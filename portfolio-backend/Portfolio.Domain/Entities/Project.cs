using System;

namespace Portfolio.Domain.Entities
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;
        public string LiveUrl { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty; // Comma separated tags (e.g. ".NET 9, React, Docker")
        
        // STAR framework columns
        public string ProblemDescription { get; set; } = string.Empty;
        public string SolutionDescription { get; set; } = string.Empty;
        public string ResultDescription { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
