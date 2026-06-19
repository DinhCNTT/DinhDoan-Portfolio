using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Portfolio.Application.Services;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Interfaces;

namespace Portfolio.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IGeminiService _geminiService;
        private readonly ICvEmbeddingRepository _cvEmbeddingRepository;
        private readonly IGenericRepository<ChatMessage> _chatMessageRepository;

        private static readonly HashSet<string> _onlineUsers = new HashSet<string>();
        private static readonly object _lock = new object();

        public static int OnlineCount
        {
            get
            {
                lock (_lock)
                {
                    return _onlineUsers.Count;
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            lock (_lock)
            {
                _onlineUsers.Add(Context.ConnectionId);
            }
            await Clients.All.SendAsync("UpdateOnlineCount", OnlineCount);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            lock (_lock)
            {
                _onlineUsers.Remove(Context.ConnectionId);
            }
            await Clients.All.SendAsync("UpdateOnlineCount", OnlineCount);
            await base.OnDisconnectedAsync(exception);
        }

        private static readonly string PromptFilePath = System.IO.Path.Combine(AppContext.BaseDirectory, "system_prompt.txt");
        private static readonly string DefaultBasePrompt = @"Bạn là Trợ lý ảo AI của Đoàn Tuệ Định (Đinh Đoàn), một Fresher .NET Developer tài năng. 
Nhiệm vụ của bạn là trả lời các câu hỏi của nhà tuyển dụng hoặc khách truy cập về kỹ năng, dự án, học vấn và kinh nghiệm của Đoàn Tuệ Định dựa trên thông tin ngữ cảnh được cung cấp dưới đây.

[Quy tắc trả lời]
1. Trả lời một cách chuyên nghiệp, lịch sự, thân thiện và tự tin. Xưng hô là 'mình' hoặc 'Định' và gọi người dùng là 'bạn' hoặc 'anh/chị'.
2. Chỉ trả lời dựa trên thông tin ngữ cảnh được cung cấp. Nếu câu hỏi nằm ngoài ngữ cảnh hoặc bạn không biết, hãy trả lời lịch sự rằng: 'Thông tin này mình chưa cập nhật, bạn có thể liên hệ trực tiếp với mình qua email hoặc số điện thoại để trao đổi thêm nhé!'.
3. Tuyệt đối không tự bịa đặt hoặc giả định thông tin không có trong ngữ cảnh.
4. Trả lời ngắn gọn, trực diện vào câu hỏi. Chỉ sử dụng ngôn ngữ Tiếng Việt (hoặc Tiếng Anh nếu người dùng hỏi bằng Tiếng Anh).";

        public static async Task<string> GetBaseSystemPromptAsync()
        {
            if (System.IO.File.Exists(PromptFilePath))
            {
                return await System.IO.File.ReadAllTextAsync(PromptFilePath, Encoding.UTF8);
            }
            return DefaultBasePrompt;
        }

        public static async Task SaveBaseSystemPromptAsync(string prompt)
        {
            var dir = System.IO.Path.GetDirectoryName(PromptFilePath);
            if (dir != null && !System.IO.Directory.Exists(dir))
            {
                System.IO.Directory.CreateDirectory(dir);
            }
            await System.IO.File.WriteAllTextAsync(PromptFilePath, prompt, Encoding.UTF8);
        }

        public ChatHub(
            IGeminiService geminiService,
            ICvEmbeddingRepository cvEmbeddingRepository,
            IGenericRepository<ChatMessage> chatMessageRepository)
        {
            _geminiService = geminiService;
            _cvEmbeddingRepository = cvEmbeddingRepository;
            _chatMessageRepository = chatMessageRepository;
        }

        public async IAsyncEnumerable<string> SendMessage(string sessionId, string message)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                sessionId = Guid.NewGuid().ToString();
            }

            // 1. Generate embedding vector for the user's message
            float[]? queryVector = null;
            string? embeddingError = null;
            try
            {
                queryVector = await _geminiService.GenerateEmbeddingAsync(message);
            }
            catch (Exception ex)
            {
                embeddingError = ex.Message;
            }

            if (embeddingError != null)
            {
                yield return $"[Error] Lỗi tạo vector embedding: {embeddingError}";
                yield break;
            }

            // 2. Query similar chunks of CV content
            List<CvEmbedding>? similarChunks = null;
            string? ragError = null;
            try
            {
                similarChunks = await _cvEmbeddingRepository.SearchSimilarAsync(queryVector!, 3);
            }
            catch (Exception ex)
            {
                ragError = ex.Message;
            }

            if (ragError != null)
            {
                yield return $"[Error] Lỗi tìm kiếm RAG: {ragError}";
                yield break;
            }

            // 3. Combine context chunks
            var contextBuilder = new StringBuilder();
            foreach (var chunk in similarChunks!)
            {
                contextBuilder.AppendLine($"[Chủ đề: {chunk.Title}]");
                contextBuilder.AppendLine(chunk.Content);
                contextBuilder.AppendLine();
            }

            // 4. Construct System Prompt with context
            var basePrompt = await GetBaseSystemPromptAsync();
            var systemPrompt = $@"{basePrompt}

[Thông tin ngữ cảnh về Đoàn Tuệ Định]
{contextBuilder}";

            // 5. Stream from Gemini and yield tokens
            var stopwatch = Stopwatch.StartNew();
            var fullResponseBuilder = new StringBuilder();

            IAsyncEnumerable<string>? responseStream = null;
            string? streamError = null;
            try
            {
                responseStream = _geminiService.StreamTextAsync(systemPrompt, message);
            }
            catch (Exception ex)
            {
                streamError = ex.Message;
            }

            if (streamError != null)
            {
                yield return $"[Error] Lỗi kết nối luồng stream Gemini: {streamError}";
                yield break;
            }

            await foreach (var chunk in responseStream!)
            {
                fullResponseBuilder.Append(chunk);
                yield return chunk;
            }

            stopwatch.Stop();
            var latencyMs = stopwatch.ElapsedMilliseconds;

            // 6. Save messages to ChatMessage database table asynchronously
            try
            {
                var userMsg = new ChatMessage
                {
                    Id = Guid.NewGuid(),
                    SessionId = sessionId,
                    Role = "user",
                    Content = message,
                    LatencyMs = 0,
                    CreatedAt = DateTime.UtcNow
                };

                var assistantMsg = new ChatMessage
                {
                    Id = Guid.NewGuid(),
                    SessionId = sessionId,
                    Role = "assistant",
                    Content = fullResponseBuilder.ToString(),
                    LatencyMs = latencyMs,
                    CreatedAt = DateTime.UtcNow
                };

                await _chatMessageRepository.AddAsync(userMsg);
                await _chatMessageRepository.AddAsync(assistantMsg);
            }
            catch (Exception)
            {
                // Silent fail for logs to prevent disrupting user experience
            }
        }
    }
}
