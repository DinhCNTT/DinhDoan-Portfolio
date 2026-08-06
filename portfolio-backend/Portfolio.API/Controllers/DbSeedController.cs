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
                    new Skill { Id = Guid.NewGuid(), Name = "Socket.IO Realtime", Category = "Backend", Level = 75 },
                    new Skill { Id = Guid.NewGuid(), Name = "ML.NET & Gemini API", Category = "Backend", Level = 75 },
                    new Skill { Id = Guid.NewGuid(), Name = "React 19 / Vite", Category = "Frontend", Level = 75 },
                    new Skill { Id = Guid.NewGuid(), Name = "Node.js / Express.js", Category = "Backend", Level = 80 },
                    new Skill { Id = Guid.NewGuid(), Name = "PostgreSQL / SQL Server", Category = "Database", Level = 80 },
                    new Skill { Id = Guid.NewGuid(), Name = "MongoDB / NoSQL", Category = "Database", Level = 75 },
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
                        Title = "TechGearShop – E-Commerce & Mini-ERP System",
                        Description = "Hệ thống thương mại điện tử nổi bật với tính năng thanh toán đơn hàng tự động, quản lý mã giảm giá khuyến mãi và đồng bộ kho hàng theo thời gian thực.",
                        Tags = "RabbitMQ, MassTransit, SQL Server, SignalR, ASP.NET Core, VNPay API, xUnit, Moq",
                        ImageUrl = "/images/techgearshop.png",
                        GithubUrl = "https://github.com/DinhCNTT/TechGearShop_V1",
                        LiveUrl = "",
                        ProblemDescription = "Role: Full-stack Developer (Backend Focused) · Team size: solo · Mar 2026 – Jun 2026\n• Hệ thống yêu cầu xử lý đặt hàng nhanh chóng, quản lý mã giảm giá phức tạp và đồng bộ kho hàng theo thời gian thực (real-time).",
                        SolutionDescription = "• Tối ưu thời gian phản hồi checkout từ 150ms xuống 60ms thông qua RabbitMQ và MassTransit, xử lý bất đồng bộ đặt hàng và thông báo tồn kho.\n• Giảm 90% thao tác ghi database bằng in-memory buffering, đồng bộ lượt xem sản phẩm xuống SQL Server mỗi 5 phút.\n• Triển khai theo dõi đơn hàng realtime bằng ASP.NET Core SignalR, loại bỏ polling.\n• Xây dựng 68 HTTP endpoints và 2 SignalR Hubs, tích hợp VNPay và xuất báo cáo Excel (EPPlus).",
                        ResultDescription = "• Tối ưu hệ thống hoàn thiện với độ trễ thấp và khả năng chịu tải tốt nhờ queue và cache.\n• Viết 16 unit tests (xUnit & Moq) cho module Cart và Checkout, đảm bảo độ ổn định của business logic và ngăn chặn lỗi regression."
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
                    },
                    new Project
                    {
                        Id = Guid.NewGuid(),
                        Title = "SoundSpace",
                        Description = "Nền tảng nghe nhạc cộng tác thời gian thực tích hợp hệ thống phát nhạc đồng bộ và cơ chế fallback âm thanh thông minh.",
                        Tags = "Node.js, Express.js, React 19, Socket.IO, MongoDB, Mongoose, RESTful API, JWT, OAuth 2.0, LRU Cache, Cloudinary, node-schedule",
                        ImageUrl = "/images/soundspace.png",
                        GithubUrl = "https://github.com/DinhCNTT/soundspace-web",
                        LiveUrl = "",
                        ProblemDescription = "• Cần giảm thiểu thời gian trễ và gián đoạn (buffering) khi phát âm thanh từ YouTube thông qua server.\n• Đảm bảo đồng bộ hóa trạng thái phát nhạc (play, pause, seek) thời gian thực cho hơn 50+ người nghe đồng thời trong cùng một phòng.\n• Tối ưu hóa hiệu năng API backend và bộ đệm để hạn chế truy vấn lặp lại đến cơ sở dữ liệu khi xác thực phòng.\n• Dọn dẹp tự động tệp tin tạm thời và tài nguyên mồ côi trên Cloudinary để tối ưu chi phí lưu trữ.",
                        SolutionDescription = "• Triển khai hệ thống phát nhạc kép (dual-engine audio fallback) kết hợp ytdl-core và yt-dlp CLI cùng với LRU Cache để lưu trữ tạm các luồng audio.\n• Sử dụng Socket.IO để xây dựng kênh giao tiếp thời gian thực, đồng bộ hóa trạng thái phát nhạc giữa host và listeners.\n• Di chuyển các tác vụ database không quan trọng (ghi log, lưu vết) thành các background job bất đồng bộ.\n• Xây dựng in-memory access-control cache có thời gian hết hạn (expiration) cho các phòng công cộng và phòng có mã PIN.\n• Cài đặt cơ chế cleanup hướng sự kiện (event-driven cleanup) bằng node-schedule để tự động xóa tệp thừa.",
                        ResultDescription = "• Giảm thời gian buffering âm thanh từ ~3 giây xuống còn 0.5 giây trong môi trường thử nghiệm.\n• Hỗ trợ ổn định trên 50+ listeners đồng thời mỗi phòng mà không bị lệch pha playback.\n• Giảm thời gian phản hồi API khi tham gia phòng (room-join response time) từ ~1.8 giây xuống còn 250ms.\n• Tối ưu chỉ mục truy vấn phòng và giải phóng dung lượng lưu trữ Cloudinary tự động."
                    }
                };
                await _context.Projects.AddRangeAsync(projects);

                // 4. Seed CV Embeddings for RAG Chatbot
                var cvChunks = new List<(string Title, string Content)>
                {
                    ("Giới thiệu cá nhân", "Họ và tên ứng viên: Đoàn Tuệ Định (DOAN TUE DINH). Vị trí ứng tuyển: Fresher Backend Developer. Email liên hệ: dinhcm123321@gmail.com. Số điện thoại: (+84) 842 070 552. GitHub cá nhân: github.com/DinhCNTT. LinkedIn cá nhân: linkedin.com/in/doantuedinh. Ngoại ngữ: Tiếng Anh đạt chứng chỉ B1 CEFR (B1 CEFR Certified), thành thạo đọc hiểu tài liệu kỹ thuật (Proficient in reading technical documentation). Mục tiêu nghề nghiệp: Đam mê phát triển hệ thống Backend với kinh nghiệm thực tiễn vững chắc về ASP.NET Core (.NET 9) và Node.js. Sở hữu nền tảng tốt về xây dựng RESTful API, tối ưu hóa cơ sở dữ liệu SQL/NoSQL, áp dụng nguyên lý OOP, SOLID, kiến trúc Clean Architecture và viết Unit Testing. Luôn sẵn sàng đóng góp phát triển sản phẩm, cộng tác hiệu quả trong các dự án Agile và không ngừng cập nhật các công nghệ backend hiện đại."),
                    ("Học vấn và giải thưởng", "Đoàn Tuệ Định học ngành Kỹ thuật phần mềm (Software Engineering) tại Trường Đại học Công nghệ TP.HCM (HUTECH). Đã hoàn thành toàn bộ chương trình học và đạt mức điểm trung bình tích lũy GPA ấn tượng: 3.43 / 4.0. Định vinh dự nhận giải thưởng Sinh viên xuất sắc (Outstanding Student Award) từ HUTECH vào tháng 11 năm 2025."),
                    ("Kinh nghiệm thực tập", "Đoàn Tuệ Định làm Backend Engineering Intern tại CyberSoft từ 20/02/2026 đến 20/06/2026. Định đã thiết kế và phát triển thành công 11 RESTful API thực tế trên 6 module cốt lõi sử dụng BullMQ, Redis, SSE và Docker Compose giúp xử lý bất đồng bộ và theo dõi tác vụ realtime. Phát triển công cụ tìm kiếm RAG hoàn chỉnh dùng Gemini/OpenAI embeddings, vector database Pinecone và truy xuất ngữ nghĩa (semantic retrieval) cho Q&A tài liệu bằng AI. Tăng cường bảo mật backend bằng xác thực JWT 2 lớp, mã hóa bcrypt và Redis rate limiting. Triển khai giám sát thực tế (production monitoring) bằng Prometheus, Grafana và Telegram alerts, duy trì uptime dịch vụ đạt 99.8%."),
                    ("Kỹ năng lập trình Backend", "Đoàn Tuệ Định thành thạo ngôn ngữ C# và các công nghệ phát triển Backend của Microsoft bao gồm ASP.NET Core (.NET 9) (Web API, MVC), Entity Framework Core (EF Core), RESTful APIs, JWT, OAuth2, SignalR, và ML.NET. Định áp dụng thành thạo mô hình Clean Architecture, Repository Pattern, SOLID, RBAC."),
                    ("Kỹ năng Frontend & Mobile", "Về Frontend, Đoàn Tuệ Định có khả năng lập trình tốt với React 19, Razor Views, Bootstrap 5, Material UI, Recharts để trực quan hóa biểu đồ và Leaflet cho hiển thị bản đồ."),
                    ("Cơ sở dữ liệu & DevOps Tools", "Định có kinh nghiệm làm việc với các hệ quản trị cơ sở dữ liệu SQL Server, MongoDB, PostgreSQL (bao gồm thư viện pgvector hỗ trợ AI), MySQL Server. Sử dụng tốt các công cụ Git, GitHub, Docker, Postman và tích hợp VNPay API, Cloudinary, triển khai hosting lên Render và Vercel."),
                    ("Dự án UniMarket chi tiết", "Dự án UniMarket là nền tảng thương mại điện tử kết hợp mạng xã hội xây dựng trên .NET 9 với 6 microservices containerized bằng Docker Compose. Định đóng vai trò Backend Developer trong nhóm 3 người từ tháng 3/2026 đến tháng 6/2026. Triển khai container hóa backend .NET 9 Web API và SQL Server bằng Docker Compose giúp chạy local bằng 1 lệnh. Tối ưu hiệu năng cơ sở dữ liệu trên 170+ API bằng IMemoryCache cho dữ liệu tĩnh và LINQ AsNoTracking cho các truy vấn chỉ đọc giúp giảm thời gian phản hồi. Triển khai theo dõi trạng thái online/offline realtime bằng SignalR Hubs đa luồng và BackgroundService ngầm. Tích hợp Google Gemini API với Function Calling xây dựng chatbot tư vấn sản phẩm thông minh. Triển khai centralized exception middleware chuẩn hóa lỗi JSON, loại bỏ try-catch dư thừa trên toàn bộ 32 Services và Repositories."),
                    ("Dự án TechGearShop chi tiết", "Dự án TechGearShop là hệ thống E-Commerce & Mini-ERP do Đoàn Tuệ Định tự phát triển (Solo, Backend Focused) từ tháng 3/2026 đến tháng 6/2026. Dự án viết trên ASP.NET Core, SQL Server, SignalR, RabbitMQ, MassTransit, xUnit, Moq, VNPay API, EPPlus. Vấn đề: Hệ thống yêu cầu xử lý đặt hàng nhanh chóng, quản lý mã giảm giá phức tạp và đồng bộ kho hàng theo thời gian thực. Giải pháp: Tối ưu thời gian phản hồi checkout từ 150ms xuống 60ms qua RabbitMQ và MassTransit để xử lý bất đồng bộ đặt hàng và thông báo tồn kho. Giảm 90% thao tác ghi database bằng in-memory buffering, đồng bộ xuống SQL Server mỗi 5 phút. Triển khai theo dõi đơn hàng realtime bằng ASP.NET Core SignalR. Phát triển 68 HTTP endpoints và 2 SignalR Hubs. Kết quả: Tối ưu hệ thống hoàn thiện với độ trễ thấp, tải nhẹ. Đã viết 16 unit tests (xUnit & Moq) cho module Cart và Checkout, đảm bảo business logic ổn định."),
                    ("Dự án SoundSpace chi tiết", "Dự án SoundSpace là nền tảng nghe nhạc cộng tác thời gian thực. Định đóng vai trò Backend Developer trong nhóm 3 người từ tháng 10/2025 đến tháng 3/2026. Định đã triển khai hệ thống phát nhạc kép (ytdl-core + yt-dlp CLI) kết hợp LRU Cache giúp giảm thời gian buffering từ 3s xuống 0.5s; phát triển đồng bộ nhạc thời gian thực qua Socket.IO hỗ trợ 50+ người nghe/phòng; tối ưu API backend giúp giảm thời gian join phòng từ 1.8s xuống 250ms bằng cách chuyển tác vụ không quan trọng xuống nền; xây dựng in-memory cache cho room access control và thiết lập cơ chế dọn dẹp file tạm trên Cloudinary dùng node-schedule.")
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
