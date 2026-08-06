using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Interfaces;
using Portfolio.API.Hubs;

namespace Portfolio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IGenericRepository<ChatMessage> _chatMessageRepository;

        public AdminController(IGenericRepository<ChatMessage> chatMessageRepository)
        {
            _chatMessageRepository = chatMessageRepository;
        }

        [HttpGet("chat-logs")]
        public async Task<IActionResult> GetChatLogs()
        {
            var logs = await _chatMessageRepository.GetAllAsync();
            var sortedLogs = logs.OrderByDescending(l => l.CreatedAt).ToList();
            return Ok(sortedLogs);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var logs = await _chatMessageRepository.GetAllAsync();
            var totalMessages = logs.Count();
            var totalSessions = logs.Select(l => l.SessionId).Distinct().Count();
            
            var assistantLogs = logs.Where(l => l.Role == "assistant" && l.LatencyMs > 0).ToList();
            var averageLatencyMs = assistantLogs.Any() 
                ? (long)assistantLogs.Average(l => l.LatencyMs) 
                : 0;

            return Ok(new
            {
                onlineCount = ChatHub.OnlineCount,
                totalMessages,
                totalSessions,
                averageLatencyMs
            });
        }

        [HttpGet("system-prompt")]
        public async Task<IActionResult> GetSystemPrompt()
        {
            try
            {
                var prompt = await ChatHub.GetBaseSystemPromptAsync();
                return Ok(new { prompt });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi đọc file cấu hình: {ex.Message}" });
            }
        }

        [HttpPost("system-prompt")]
        public async Task<IActionResult> UpdateSystemPrompt([FromBody] UpdatePromptRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
            {
                return BadRequest(new { message = "Prompt không được để trống" });
            }
            try
            {
                await ChatHub.SaveBaseSystemPromptAsync(request.Prompt);
                return Ok(new { message = "Cập nhật System Prompt thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi ghi file cấu hình: {ex.Message}" });
            }
        }

        [HttpDelete("chat-logs/{sessionId}")]
        public async Task<IActionResult> DeleteSession(string sessionId)
        {
            var logs = await _chatMessageRepository.GetAllAsync();
            var sessionMessages = logs.Where(l => l.SessionId == sessionId).ToList();
            
            foreach (var msg in sessionMessages)
            {
                await _chatMessageRepository.DeleteAsync(msg.Id);
            }
            
            return Ok(new { message = $"Đã xóa cuộc hội thoại {sessionId}" });
        }

        [HttpGet("contacts")]
        public IActionResult GetContacts()
        {
            var contactsFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "contacts.json");
            if (!System.IO.File.Exists(contactsFilePath))
            {
                return Ok(new List<ContactRequestDto>());
            }
            try
            {
                string json = System.IO.File.ReadAllText(contactsFilePath);
                var contacts = JsonSerializer.Deserialize<List<ContactRequestDto>>(json) ?? new List<ContactRequestDto>();
                var sortedContacts = contacts.OrderByDescending(c => c.CreatedAt).ToList();
                return Ok(sortedContacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi đọc danh sách liên hệ: {ex.Message}" });
            }
        }

        [HttpDelete("contacts")]
        public IActionResult DeleteContact([FromQuery] string email, [FromQuery] string createdAt)
        {
            var contactsFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "contacts.json");
            if (!System.IO.File.Exists(contactsFilePath))
            {
                return NotFound(new { message = "Không tìm thấy file liên hệ." });
            }
            try
            {
                string json = System.IO.File.ReadAllText(contactsFilePath);
                var contacts = JsonSerializer.Deserialize<List<ContactRequestDto>>(json) ?? new List<ContactRequestDto>();
                
                if (DateTime.TryParse(createdAt, out DateTime targetDate))
                {
                    // Match email and timestamp close enough (within 2 seconds)
                    int removedCount = contacts.RemoveAll(c => c.Email == email && Math.Abs((c.CreatedAt.ToUniversalTime() - targetDate.ToUniversalTime()).TotalSeconds) < 2);
                    if (removedCount > 0)
                    {
                        string updatedJson = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
                        System.IO.File.WriteAllText(contactsFilePath, updatedJson);
                        return Ok(new { message = "Đã xóa liên hệ thành công." });
                    }
                }
                return BadRequest(new { message = "Không tìm thấy liên hệ cần xóa." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi khi xóa liên hệ: {ex.Message}" });
            }
        }
    }

    public class UpdatePromptRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }

    public class ContactRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
