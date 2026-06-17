using System;
using Pgvector;

namespace Portfolio.Domain.Entities
{
    public class CvEmbedding
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty; // e.g. "Work Experience", "Education"
        public string Content { get; set; } = string.Empty; // The text content of the chunk
        public Vector? Embedding { get; set; } // Vector representation (768 dimensions for Gemini text-embedding-004)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
