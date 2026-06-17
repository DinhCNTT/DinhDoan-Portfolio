using System;

namespace Portfolio.Domain.Entities
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public string SessionId { get; set; } = string.Empty; // Identify distinct chat sessions
        public string Role { get; set; } = string.Empty; // "user" or "assistant" / "model"
        public string Content { get; set; } = string.Empty;
        public long LatencyMs { get; set; } // Response latency in milliseconds
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
