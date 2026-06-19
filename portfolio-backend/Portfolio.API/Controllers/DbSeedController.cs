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

                // Clear existing records first to allow clean re-seeding
                _context.Skills.RemoveRange(_context.Skills);
                _context.Projects.RemoveRange(_context.Projects);
                _context.CvEmbeddings.RemoveRange(_context.CvEmbeddings);
                await _context.SaveChangesAsync();

                // 2. Seed Skills
                var skills = new List<Skill>
                {
                    new Skill { Id = Guid.NewGuid(), Name = "C# / .NET 9 (Web API & MVC)", Category = "Backend", Level = 85 },
                    new Skill { Id = Guid.NewGuid(), Name = "EF Core / ORM", Category = "Backend", Level = 85 },
                    new Skill { Id = Guid.NewGuid(), Name = "SignalR Realtime", Category = "Backend", Level = 80 },
                    new Skill { Id = Guid.NewGuid(), Name = "ML.NET & Gemini API", Category = "Backend", Level = 75 },
                    new Skill { Id = Guid.NewGuid(), Name = "React 19 / Vite", Category = "Frontend", Level = 75 },
                    new Skill { Id = Guid.NewGuid(), Name = "Node.js / Express.js", Category = "Backend", Level = 70 },
                    new Skill { Id = Guid.NewGuid(), Name = "PostgreSQL / SQL Server", Category = "Database", Level = 80 },
                    new Skill { Id = Guid.NewGuid(), Name = "Docker / Containerization", Category = "DevOps", Level = 75 }
                };
                await _context.Skills.AddRangeAsync(skills);

                // 3. Seed Projects
                var projects = new List<Project>
                {
                    new Project
                    {
                        Id = Guid.NewGuid(),
                        Title = "UniMarket",
                        Description = "Hệ thống thương mại điện tử kết hợp mạng xã hội với kiến trúc microservices containerized.",
                        Tags = ".NET 9 Web API, EF Core, SignalR, ML.NET, SQL Server, MongoDB, Docker Compose, React 19, Material UI, Recharts, Leaflet, JWT, OAuth2",
                        ImageUrl = "/images/unimarket.png",
                        GithubUrl = "https://github.com/DinhCNTT/unimarket-fullstack",
                        LiveUrl = "https://bit.ly/4ul7636",
                        ProblemDescription = "• Cần xây dựng một hệ thống phân tán chịu tải cao kết hợp mạng xã hội.\n• Giải quyết bài toán gợi ý sản phẩm tự động và tư vấn khách hàng tự động bằng AI.\n• Quản lý trạng thái kết nối thời gian thực (online/offline) của hàng chục ngàn người dùng đồng thời mà không gây nghẽn database chính.",
                        SolutionDescription = "• Thiết kế hệ thống gồm 6 services containerized bằng Docker Compose, liên lạc qua HTTP REST.\n• Kết hợp linh hoạt SQL Server (dữ liệu transactional) và MongoDB (social network posts).\n• Triển khai thuật toán Matrix Factorization bằng ML.NET để gợi ý sản phẩm cá nhân hóa, tích hợp Google Gemini API cho AI Chatbot.\n• Sử dụng SignalR Hub kết hợp Redis Distributed Cache để lưu tạm trạng thái người dùng bằng cơ chế Heartbeat, giảm tải 95% thao tác đọc ghi DB chính.",
                        ResultDescription = "• Hệ thống vận hành ổn định trên môi trường Docker. Giao diện tải mượt mà cho 20+ API.\n• Thời gian phản hồi gợi ý sản phẩm cá nhân thực tế chỉ dưới 45ms.\n• AI Chatbot phản hồi token đầu tiên < 200ms thông qua streaming SignalR.\n• Tối ưu hóa chỉ mục (Index) và cache giúp API chịu tải tốt hơn 300%."
                    },
                    new Project
                    {
                        Id = Guid.NewGuid(),
                        Title = "TechGearShop",
                        Description = "Hệ thống quản lý bán hàng và ERP mini tích hợp dashboard phân tích dữ liệu admin.",
                        Tags = "ASP.NET Core MVC 9, SQL Server, SignalR, Channels & BackgroundService, VNPay API, Cloudinary, EPPlus",
                        ImageUrl = "/images/techgearshop.png",
                        GithubUrl = "https://github.com/DinhCNTT/TechGearShop_V1",
                        LiveUrl = "",
                        ProblemDescription = "• Trong các đợt mở bán cao điểm, hệ thống cũ gặp lỗi tranh chấp dữ liệu (Race Condition) ở bước check-out thanh toán.\n• Xảy ra hiện tượng Overselling (bán quá số lượng tồn kho thực tế).\n• Thời gian chờ tích hợp VNPay API phản hồi quá lâu khiến người dùng hủy giao dịch.",
                        SolutionDescription = "• Loại bỏ cơ chế ghi DB đồng bộ trực tiếp khi đặt hàng.\n• Thiết kế bộ đệm hàng đợi (In-memory Queue) bằng System.Threading.Channels, kết hợp BackgroundService chạy ngầm để xử lý đơn hàng tuần tự bất đồng bộ.\n• Áp dụng Database Transactions cách ly mức Serializable ngăn chặn tranh chấp tồn kho.\n• Tích hợp cổng thanh toán VNPay (IPN hash validation) và thư viện EPPlus xuất báo cáo doanh thu/tồn kho ra Excel.",
                        ResultDescription = "• Khắc phục hoàn toàn 100% lỗi Overselling và Race Condition trong kiểm kho.\n• Tải của database chính giảm 80% nhờ xử lý xếp hàng ngầm.\n• Tốc độ xuất báo cáo admin tăng gấp 5 lần (xử lý file 50,000 dòng chỉ mất chưa đầy 2 giây)."
                    },
                    new Project
                    {
                        Id = Guid.NewGuid(),
                        Title = "Clean Text Workspace",
                        Description = "Ứng dụng xử lý văn bản xây dựng trong kỳ thực tập tại CyberSoft.",
                        Tags = "Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Git, React",
                        ImageUrl = "/images/cleantext.png",
                        GithubUrl = "https://github.com/DinhCNTT/clean-text-workspace",
                        LiveUrl = "https://clean-text-workspace.vercel.app",
                        ProblemDescription = "• Hệ thống quản lý và xử lý văn bản yêu cầu tính năng phân quyền bảo mật chặt chẽ cho nhiều nhóm cộng tác viên khác nhau.\n• Ngăn chặn triệt để các lỗ hổng bảo mật như tấn công XSS và SQL Injection vào nội dung tài liệu.\n• Đồng bộ dữ liệu văn bản giữa Client và Server nhanh chóng, mượt mà.",
                        SolutionDescription = "• Xây dựng REST API bằng Express.js sử dụng kiến trúc MVC phân lớp rõ ràng.\n• Thiết kế schema MongoDB tối ưu với chỉ mục tìm kiếm toàn văn bản (Text Search).\n• Bảo mật hệ thống bằng JWT (HttpOnly Cookie) chống tấn công XSS, mã hóa bcrypt mật khẩu người dùng với salt rounds = 10, và sử dụng thư viện Helmet gia cố các HTTP Headers an toàn.",
                        ResultDescription = "• Hoàn thành xuất sắc dự án thực tập, được đánh giá cao về độ ổn định và tính bảo mật (chống phân quyền sai sót 100%).\n• Triển khai thực tế chạy ổn định trên nền tảng Vercel."
                    }
                };
                await _context.Projects.AddRangeAsync(projects);

                // 4. Seed CV Embeddings for RAG Chatbot
                var cvChunks = new List<(string Title, string Content)>
                {
                    ("Giới thiệu cá nhân", "Họ và tên ứng viên: Đoàn Tuệ Định (DOAN TUE DINH). Vị trí ứng tuyển: Fresher .NET Developer / Fullstack Developer. Email liên hệ: dinhcm123321@gmail.com. Số điện thoại: (+84) 842 070 552. GitHub cá nhân: github.com/DinhCNTT. LinkedIn cá nhân: linkedin.com/in/doantuedinh. Mục tiêu nghề nghiệp: Trở thành một kỹ sư phần mềm chuyên môn hóa thiết kế hệ thống backend hiệu năng cao, mở rộng tốt sử dụng .NET và tích hợp công nghệ AI."),
                    ("Học vấn và giải thưởng", "Đoàn Tuệ Định đang là sinh viên năm cuối ngành Kỹ thuật phần mềm (Software Engineering) tại Trường Đại học Công nghệ TP.HCM (HUTECH). Đã hoàn thành toàn bộ chương trình học và dự kiến tốt nghiệp năm 2026. Điểm trung bình tích lũy GPA đạt mức ấn tượng: 3.43 / 4.0. Định vinh dự nhận giải thưởng Sinh viên xuất sắc (Outstanding Student Award) từ HUTECH vào tháng 11 năm 2025."),
                    ("Kinh nghiệm thực tập", "Đoàn Tuệ Định có kinh nghiệm thực tập làm Backend Engineering Intern tại CyberSoft từ tháng 4/2026 đến tháng 6/2026. Tại đây, Định đã xây dựng các REST API có khả năng mở rộng tốt bằng Node.js và Express.js sử dụng mô hình MVC. Định thiết kế schema trong MongoDB sử dụng Mongoose, thiết lập xác thực an toàn bằng JWT + mã hóa bcrypt, quản lý source code qua Git và đã triển khai dự án Clean Text Workspace lên Vercel."),
                    ("Kỹ năng lập trình Backend", "Đoàn Tuệ Định thành thạo ngôn ngữ C# và các công nghệ phát triển Backend của Microsoft bao gồm ASP.NET Core (.NET 9) (Web API, MVC), Entity Framework Core (EF Core), RESTful APIs, JWT, OAuth2, SignalR, và ML.NET. Định áp dụng thành thạo mô hình Clean Architecture, Repository Pattern, SOLID, RBAC."),
                    ("Kỹ năng Frontend & Mobile", "Về Frontend, Đoàn Tuệ Định có khả năng lập trình tốt với React 19, Razor Views, Bootstrap 5, Material UI, Recharts để trực quan hóa biểu đồ và Leaflet cho hiển thị bản đồ."),
                    ("Cơ sở dữ liệu & DevOps Tools", "Định có kinh nghiệm làm việc với các hệ quản trị cơ sở dữ liệu SQL Server, MongoDB, PostgreSQL (bao gồm thư viện pgvector hỗ trợ AI), MySQL Server. Sử dụng tốt các công cụ Git, GitHub, Docker, Postman và tích hợp VNPay API, Cloudinary, triển khai hosting lên Render và Vercel."),
                    ("Dự án UniMarket chi tiết", "Dự án UniMarket là nền tảng thương mại điện tử kết hợp mạng xã hội xây dựng trên .NET 9. Định đóng vai trò Backend Developer trong nhóm 3 người. Thiết kế hệ thống với 6 containerized services sử dụng Docker Compose, tích hợp SQL Server và MongoDB, tối ưu hóa hơn 20 API với cache, xây dựng ML.NET Recommendation, tích hợp Gemini Chatbot và thiết lập SignalR Hubs theo dõi trạng thái online/offline của người dùng. Vấn đề: Quản lý trạng thái kết nối thời gian thực mà không nghẽn database. Giải pháp: Sử dụng SignalR Hub kết hợp Redis Distributed Cache để lưu tạm trạng thái hoạt động của người dùng, giảm tải 95% thao tác đọc ghi DB chính. Kết quả: Phản hồi gợi ý sản phẩm thời gian thực < 45ms, AI Chatbot phản hồi token đầu tiên < 200ms thông qua streaming Hub, hệ thống chịu tải tốt hơn 300%."),
                    ("Dự án TechGearShop chi tiết", "Dự án TechGearShop là hệ thống E-Commerce & Mini-ERP do Đoàn Tuệ Định tự phát triển (Solo) từ tháng 3/2026 đến tháng 6/2026. Dự án viết trên ASP.NET Core MVC 9, SQL Server, SignalR, VNPay API, Cloudinary, EPPlus. Vấn đề: Tranh chấp dữ liệu (Race Condition) và Overselling hàng tồn kho trong đợt sale cao điểm. Giải pháp: Thay vì ghi DB đồng bộ trực tiếp, thiết kế bộ đệm hàng đợi System.Threading.Channels cùng BackgroundService ngầm xử lý tuần tự đơn đặt hàng bất đồng bộ kết hợp Serializable transactions. Kết quả: Khắc phục 100% lỗi Overselling, tải của database thanh toán giảm 80%, tốc độ xuất file báo cáo admin EPPlus tăng gấp 5 lần (file 50k dòng chỉ mất chưa đầy 2 giây).")
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
