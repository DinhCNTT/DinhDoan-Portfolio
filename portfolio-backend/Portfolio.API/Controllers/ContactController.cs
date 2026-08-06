using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Portfolio.Application.Services;

namespace Portfolio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private static readonly string ContactsFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "contacts.json");
        private static readonly object FileLock = new object();
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public class ContactRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Subject { get; set; } = string.Empty;
            public string Message { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] ContactRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Dữ liệu gửi lên không hợp lệ." });
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Vui lòng nhập họ tên của bạn." });
            }

            if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains("@"))
            {
                return BadRequest(new { message = "Vui lòng nhập địa chỉ email hợp lệ." });
            }

            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Vui lòng nhập nội dung tin nhắn." });
            }

            try
            {
                // Assign timestamp
                request.CreatedAt = DateTime.UtcNow;

                // Log to console for real-time visibility
                Console.WriteLine($"[CONTACT_RECEIVED] {request.CreatedAt:yyyy-MM-dd HH:mm:ss} | From: {request.Name} <{request.Email}> | Subject: {request.Subject}");
                Console.WriteLine($"Content: {request.Message}");

                // Save to local JSON file
                List<ContactRequest> contactsList = new List<ContactRequest>();
                
                lock (FileLock)
                {
                    if (System.IO.File.Exists(ContactsFilePath))
                    {
                        try
                        {
                            string existingJson = System.IO.File.ReadAllText(ContactsFilePath);
                            contactsList = JsonSerializer.Deserialize<List<ContactRequest>>(existingJson) ?? new List<ContactRequest>();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[CONTACT_ERROR] Error reading contacts.json: {ex.Message}. Reinitializing file.");
                        }
                    }

                    contactsList.Add(request);

                    string updatedJson = JsonSerializer.Serialize(contactsList, new JsonSerializerOptions 
                    { 
                        WriteIndented = true 
                    });
                    
                    System.IO.File.WriteAllText(ContactsFilePath, updatedJson);
                }

                // Trigger email notification (SMTP config checked inside the service)
                await _emailService.SendContactNotificationAsync(
                    request.Name, 
                    request.Email, 
                    request.Subject, 
                    request.Message, 
                    request.CreatedAt
                );

                return Ok(new { 
                    message = "Tin nhắn của bạn đã được gửi đi thành công! Định sẽ sớm phản hồi qua email.",
                    data = new { name = request.Name, email = request.Email }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CONTACT_ERROR] Fail to save contact request: {ex.Message}");
                return StatusCode(500, new { message = "Có lỗi xảy ra khi xử lý tin nhắn của bạn ở server.", error = ex.Message });
            }
        }
    }
}
