import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Search, HelpCircle, ToggleLeft, CheckCircle, ChevronRight, X } from 'lucide-react';

const projectsData = [
  {
    id: 'unimarket',
    title: 'UniMarket',
    category: '.NET',
    description: 'Hệ thống thương mại điện tử kết hợp mạng xã hội với kiến trúc microservices containerized.',
    tags: ['.NET 9', 'EF Core', 'SignalR', 'ML.NET', 'SQL Server', 'MongoDB', 'Docker Compose', 'React 19'],
    imageUrl: '/images/unimarket.png',
    githubUrl: 'https://github.com/DinhCNTT/unimarket-fullstack',
    liveUrl: 'https://bit.ly/4ul7636',
    problem: '• Cần xây dựng một hệ thống phân tán chịu tải cao kết hợp mạng xã hội.\n• Giải quyết bài toán gợi ý sản phẩm tự động và tư vấn khách hàng tự động bằng AI.\n• Quản lý trạng thái kết nối thời gian thực (online/offline) của hàng chục ngàn người dùng đồng thời mà không gây nghẽn database chính.',
    solution: '• Thiết kế hệ thống gồm 6 services containerized bằng Docker Compose, liên lạc qua HTTP REST.\n• Kết hợp linh hoạt SQL Server (dữ liệu transactional) và MongoDB (social network posts).\n• Triển khai thuật toán Matrix Factorization bằng ML.NET để gợi ý sản phẩm cá nhân hóa, tích hợp Google Gemini API cho AI Chatbot.\n• Sử dụng SignalR Hub kết hợp Redis Distributed Cache để lưu tạm trạng thái người dùng bằng cơ chế Heartbeat, giảm tải 95% thao tác đọc ghi DB chính.',
    result: '• Hệ thống vận hành ổn định trên môi trường Docker. Giao diện tải mượt mà cho 20+ API.\n• Thời gian phản hồi gợi ý sản phẩm cá nhân thực tế chỉ dưới 45ms.\n• AI Chatbot phản hồi token đầu tiên < 200ms thông qua streaming SignalR.\n• Tối ưu hóa chỉ mục (Index) và cache giúp API chịu tải tốt hơn 300%.'
  },
  {
    id: 'techgearshop',
    title: 'TechGearShop',
    category: '.NET',
    description: 'Hệ thống quản lý bán hàng và ERP mini tích hợp dashboard phân tích dữ liệu admin.',
    tags: ['ASP.NET MVC 9', 'SQL Server', 'SignalR', 'Channels', 'BackgroundService', 'VNPay API'],
    imageUrl: '/images/techgearshop.png',
    githubUrl: 'https://github.com/DinhCNTT/TechGearShop_V1',
    liveUrl: '',
    problem: '• Trong các đợt mở bán cao điểm, hệ thống cũ gặp lỗi tranh chấp dữ liệu (Race Condition) ở bước check-out thanh toán.\n• Xảy ra hiện tượng Overselling (bán quá số lượng tồn kho thực tế).\n• Thời gian chờ tích hợp VNPay API phản hồi quá lâu khiến người dùng hủy giao dịch.',
    solution: '• Loại bỏ cơ chế ghi DB đồng bộ trực tiếp khi đặt hàng.\n• Thiết kế bộ đệm hàng đợi (In-memory Queue) bằng System.Threading.Channels, kết hợp BackgroundService chạy ngầm để xử lý đơn hàng tuần tự bất đồng bộ.\n• Áp dụng Database Transactions cách ly mức Serializable ngăn chặn tranh chấp tồn kho.\n• Tích hợp cổng thanh toán VNPay (IPN hash validation) và thư viện EPPlus xuất báo cáo doanh thu/tồn kho ra Excel.',
    result: '• Khắc phục hoàn toàn 100% lỗi Overselling và Race Condition trong kiểm kho.\n• Tải của database chính giảm 80% nhờ xử lý xếp hàng ngầm.\n• Tốc độ xuất báo cáo admin tăng gấp 5 lần (xử lý file 50,000 dòng chỉ mất chưa đầy 2 giây).'
  },
  {
    id: 'cleantext',
    title: 'Clean Text Workspace',
    category: 'Node.js',
    description: 'Ứng dụng xử lý văn bản xây dựng trong kỳ thực tập tại CyberSoft.',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'React'],
    imageUrl: '/images/cleantext.png',
    githubUrl: 'https://github.com/DinhCNTT/clean-text-workspace',
    liveUrl: 'https://clean-text-workspace.vercel.app',
    problem: '• Hệ thống quản lý và xử lý văn bản yêu cầu tính năng phân quyền bảo mật chặt chẽ cho nhiều nhóm cộng tác viên khác nhau.\n• Ngăn chặn triệt để các lỗ hổng bảo mật như tấn công XSS và SQL Injection vào nội dung tài liệu.\n• Đồng bộ dữ liệu văn bản giữa Client và Server nhanh chóng, mượt mà.',
    solution: '• Xây dựng REST API bằng Express.js sử dụng kiến trúc MVC phân lớp rõ ràng.\n• Thiết kế schema MongoDB tối ưu với chỉ mục tìm kiếm toàn văn bản (Text Search).\n• Bảo mật hệ thống bằng JWT (HttpOnly Cookie) chống tấn công XSS, mã hóa bcrypt mật khẩu với salt rounds = 10, và dùng thư viện Helmet gia cố các HTTP Headers an toàn.',
    result: '• Hoàn thành xuất sắc dự án thực tập, được đánh giá cao về độ ổn định và tính bảo mật (chống phân quyền sai sót 100%).\n• Triển khai thực tế chạy ổn định trên nền tảng Vercel.'
  }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProjectDetails, setActiveProjectDetails] = useState(null);
  const [projects, setProjects] = useState(projectsData);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const parsed = data.map(p => {
            const tagsStr = (typeof p.tags === 'string' ? p.tags : Array.isArray(p.tags) ? p.tags.join(',') : '').toLowerCase();
            const category = (tagsStr.includes('node.js') || tagsStr.includes('express.js') || tagsStr.includes('express')) ? 'Node.js' : '.NET';
            return {
              ...p,
              category,
              tags: typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : (Array.isArray(p.tags) ? p.tags : []),
              problem: p.problemDescription || p.problem,
              solution: p.solutionDescription || p.solution,
              result: p.resultDescription || p.result
            };
          });
          setProjects(parsed);
        }
      })
      .catch(err => console.error("Lỗi fetch projects:", err));
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-cyber-bg border-t border-white/5">
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-cyber-accent2/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-outfit font-extrabold tracking-[0.2em] text-cyber-accent2 uppercase">
            // PROJECTS.REPOSITORY
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-white">
            DỰ ÁN NỔI BẬT
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 mx-auto rounded" />
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          {/* Category Tabs */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', '.NET', 'Node.js'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-outfit tracking-wider transition-all border whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyber-accent2/10 border-cyber-accent2 text-cyber-accent2 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'TẤT CẢ DỰ ÁN' : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc công nghệ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/5 bg-cyber-card text-slate-200 text-sm focus:outline-none focus:border-cyber-accent1/50 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(project => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md overflow-hidden flex flex-col group hover:border-cyber-accent2/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300"
              >
                {/* Project Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 border border-white/10 text-xs font-outfit text-cyber-accent2 font-bold tracking-wider">
                    {project.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-cyber-accent2 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-slate-300">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-cyber-accent1">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {/* External links */}
                    <div className="flex gap-3">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="GitHub code repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Live demonstration link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* PSR Detail toggle */}
                    <button
                      onClick={() => setActiveProjectDetails(project)}
                      className="inline-flex items-center gap-1 text-xs font-outfit font-bold text-cyber-accent2 hover:text-cyber-accent3 transition-colors group-hover:underline"
                    >
                      CHI TIẾT PSR
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cyber overlay Drawer modal (PSR details) */}
      <AnimatePresence>
        {activeProjectDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProjectDetails(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#0b0f19] border border-cyber-accent2/30 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(168,85,247,0.2)]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-accent2 animate-pulse" />
                  <h3 className="font-outfit font-bold text-lg text-white">
                    {activeProjectDetails.title} (PSR ANALYTICS)
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProjectDetails(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                {/* Image & Tech Stack */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img 
                    src={activeProjectDetails.imageUrl} 
                    alt={activeProjectDetails.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent" />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activeProjectDetails.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* PSR Grid */}
                <div className="space-y-5">
                  {/* Problem */}
                  <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5">
                    <div className="flex items-center gap-2 text-rose-400 font-outfit font-extrabold text-sm mb-2">
                      <HelpCircle className="w-4.5 h-4.5" />
                      PROBLEM / VẤN ĐỀ ĐẶT RA
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {activeProjectDetails.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="p-4 rounded-xl border border-cyber-accent1/10 bg-cyber-accent1/5">
                    <div className="flex items-center gap-2 text-cyber-accent1 font-outfit font-extrabold text-sm mb-2">
                      <ToggleLeft className="w-4.5 h-4.5" />
                      SOLUTION / GIẢI PHÁP THỰC HIỆN
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {activeProjectDetails.solution}
                    </p>
                  </div>

                  {/* Result */}
                  <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                    <div className="flex items-center gap-2 text-emerald-400 font-outfit font-extrabold text-sm mb-2">
                      <CheckCircle className="w-4.5 h-4.5" />
                      RESULT / KẾT QUẢ ĐẠT ĐƯỢC
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {activeProjectDetails.result}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
