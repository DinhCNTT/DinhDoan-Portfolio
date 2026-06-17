using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Portfolio.Application.Services;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DbSeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGeminiService _geminiService;

        public DbSeedController(ApplicationDbContext context, IGeminiService geminiService)
        {
            _context = context;
            _geminiService = geminiService;
        }

        [HttpPost("seed")]
        public async Task<IActionResult> SeedDatabase()
        {
            try
            {
                // 1. Ensure database is created and Schema is set up
                await _context.Database.EnsureCreatedAsync();

                // If the database already existed (like Supabase "postgres"), EnsureCreated does not create tables.
                // We force create tables if our custom tables (e.g. "Skills") don't exist:
                var databaseCreator = _context.Database.GetService<IRelationalDatabaseCreator>();
                bool tablesExist = false;
                try
                {
                    // Try to query the Skills table to check if it exists in the public schema
                    await _context.Database.ExecuteSqlRawAsync("SELECT 1 FROM \"Skills\" LIMIT 1;");
                    tablesExist = true;
                }
                catch (Exception)
                {
                    // Table does not exist, need to create tables
                    tablesExist = false;
                }

                if (!tablesExist)
                {
                    await databaseCreator.CreateTablesAsync();

                    // Create HNSW index for fast Cosine Distance search on vector embeddings
                    await _context.Database.ExecuteSqlRawAsync(
                        "CREATE INDEX IF NOT EXISTS \"IX_CvEmbeddings_Embedding\" ON \"CvEmbeddings\" USING hnsw (\"Embedding\" vector_cosine_ops);"
                    );
                }

                // 2. Seed Skills if empty
                if (!_context.Skills.Any())
                {
                    var skills = new List<Skill>
                    {
                        new Skill { Id = Guid.NewGuid(), Name = ".NET 9 / C#", Category = "Backend", Level = 85 },
                        new Skill { Id = Guid.NewGuid(), Name = "ASP.NET Core Web API", Category = "Backend", Level = 85 },
                        new Skill { Id = Guid.NewGuid(), Name = "React 19 / Vite", Category = "Frontend", Level = 75 },
                        new Skill { Id = Guid.NewGuid(), Name = "Tailwind CSS", Category = "Frontend", Level = 80 },
                        new Skill { Id = Guid.NewGuid(), Name = "PostgreSQL", Category = "Database", Level = 80 },
                        new Skill { Id = Guid.NewGuid(), Name = "Docker", Category = "DevOps", Level = 70 },
                        new Skill { Id = Guid.NewGuid(), Name = "SignalR Realtime", Category = "Backend", Level = 80 },
                        new Skill { Id = Guid.NewGuid(), Name = "EF Core / ORM", Category = "Backend", Level = 85 }
                    };
                    await _context.Skills.AddRangeAsync(skills);
                }

                // 3. Seed Projects if empty
                if (!_context.Projects.Any())
                {
                    var projects = new List<Project>
                    {
                        new Project
                        {
                            Id = Guid.NewGuid(),
                            Title = "TechGearShop",
                            Description = "Hệ thống thương mại điện tử chuyên bán thiết bị công nghệ với kiến trúc Clean Architecture.",
                            Tags = ".NET 9, Clean Architecture, EF Core, System.Threading.Channels, BackgroundService, PostgreSQL",
                            ImageUrl = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600",
                            GithubUrl = "https://github.com/dinhdoan/TechGearShop",
                            LiveUrl = "https://techgearshop-demo.vercel.app",
                            ProblemDescription = "Hệ thống bị quá tải và xảy ra hiện tượng overselling (bán quá số lượng tồn kho) khi lượng traffic tăng đột biến vào các giờ mở bán coupon.",
                            SolutionDescription = "Sử dụng System.Threading.Channels làm hàng đợi xử lý đặt hàng bất đồng bộ trong bộ nhớ cùng với BackgroundService để đảm bảo các yêu cầu được xử lý tuần tự và nhất quán.",
                            ResultDescription = "Khắc phục triệt để lỗi overselling, giảm tải trực tiếp cho database, thời gian phản hồi cho API đặt hàng giảm từ 1.2s xuống 45ms."
                        },
                        new Project
                        {
                            Id = Guid.NewGuid(),
                            Title = "Personal AI Clone Chatbot",
                            Description = "Trợ lý ảo thông minh trả lời nhà tuyển dụng, tích hợp trên Portfolio cá nhân.",
                            Tags = "React, Tailwind, .NET 9, SignalR, Gemini API, pgvector, PostgreSQL",
                            ImageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
                            GithubUrl = "https://github.com/dinhdoan/Personal-AI-Clone",
                            LiveUrl = "https://dinhdoan-portfolio.vercel.app",
                            ProblemDescription = "Nhà tuyển dụng đọc CV truyền thống mất nhiều thời gian và khó kiểm chứng các kỹ năng cụ thể của ứng viên.",
                            SolutionDescription = "Tích hợp Chatbot trợ lý ảo. Backend sử dụng pgvector để thực hiện kỹ thuật RAG (Retrieval-Augmented Generation) tìm kiếm ngữ cảnh CV phù hợp, sau đó stream câu trả lời realtime từ Gemini API bằng SignalR.",
                            ResultDescription = "Tạo trải nghiệm tương tác cao (Wow-effect), cung cấp câu trả lời chính xác trong dưới 1 giây và thống kê câu hỏi của nhà tuyển dụng để cải thiện CV."
                        }
                    };
                    await _context.Projects.AddRangeAsync(projects);
                }

                // 4. Seed CV Embeddings for RAG Chatbot
                if (!_context.CvEmbeddings.Any())
                {
                    var cvChunks = new List<(string Title, string Content)>
                    {
                        ("Giới thiệu cá nhân", "Họ và tên ứng viên: Đoàn Công Định. Vị trí ứng tuyển: Kỹ sư Fullstack (.NET Core 9 & React). Định vị thương hiệu: Chuyên môn hóa thiết kế hệ thống backend hiệu năng cao, mở rộng tốt và tích hợp các công nghệ AI hiện đại."),
                        ("Kỹ năng Backend", "Đoàn Công Định thành thạo phát triển Backend sử dụng C#, .NET 9, ASP.NET Core Web API, Entity Framework Core (EF Core), và SignalR để truyền tải dữ liệu thời gian thực. Áp dụng các kiến trúc Clean Architecture và Generic Repository Pattern."),
                        ("Kỹ năng Frontend & Mobile", "Về Frontend, Đoàn Công Định sử dụng React 19 (Vite), Tailwind CSS cho phong cách thiết kế Cyber Tech tối giản hiện đại, thư viện Recharts để trực quan hóa biểu đồ và Framer Motion cho animation mượt mà."),
                        ("Kỹ năng Database & DevOps", "Kinh nghiệm làm việc với hệ quản trị cơ sở dữ liệu PostgreSQL (Supabase) và SQL Server. Sử dụng pgvector để lưu trữ và truy vấn vector tương tự cho AI. Thành thạo Docker để container hóa ứng dụng và deploy lên các nền tảng đám mây như Render, Railway, Vercel."),
                        ("Học vấn và định hướng", "Đoàn Công Định tốt nghiệp ngành Công nghệ thông tin chuyên ngành Kỹ thuật phần mềm. Định hướng nghề nghiệp trở thành Senior Fullstack Engineer có chuyên môn sâu về tối ưu hóa hệ thống backend lớn và tích hợp giải pháp AI nâng cao."),
                        ("Dự án TechGearShop chi tiết", "Dự án TechGearShop của Định giải quyết bài toán chống overselling khi nghẽn mạng bằng hàng đợi bất đồng bộ System.Threading.Channels + BackgroundService trong .NET 9. Database sử dụng PostgreSQL kết nối qua EF Core."),
                        ("Dự án Chatbot AI cá nhân chi tiết", "Dự án Chatbot trợ lý ảo cá nhân (Định AI Clone) tích hợp trên portfolio sử dụng Gemini API của Google để sinh phản hồi. Sử dụng pgvector để tìm kiếm thông tin CV liên quan nhất dựa trên độ tương đồng cosine (Cosine Similarity) làm context đầu vào.")
                    };

                    foreach (var chunk in cvChunks)
                    {
                        // Generate vector embeddings via Gemini API
                        var embedding = await _geminiService.GenerateEmbeddingAsync(chunk.Content);

                        var cvEmbedding = new CvEmbedding
                        {
                            Id = Guid.NewGuid(),
                            Title = chunk.Title,
                            Content = chunk.Content,
                            Embedding = new Pgvector.Vector(embedding)
                        };

                        await _context.CvEmbeddings.AddAsync(cvEmbedding);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Database seeded successfully with projects, skills, and CV embeddings! 🚀" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.InnerException?.Message });
            }
        }
    }
}
