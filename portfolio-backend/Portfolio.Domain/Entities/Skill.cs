using System;

namespace Portfolio.Domain.Entities
{
    public class Skill
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // e.g. "Backend", "Frontend", "Database", "DevOps"
        public int Level { get; set; } // e.g. 0 to 100 percentage
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
