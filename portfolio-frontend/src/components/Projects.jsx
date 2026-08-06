import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Search, HelpCircle, ToggleLeft, CheckCircle, ChevronRight, X } from 'lucide-react';

const projectsData = [
  {
    id: 'unimarket',
    title: 'UniMarket – E-Commerce & Social Network Platform',
    category: '.NET',
    description: 'Hệ thống thương mại điện tử kết hợp mạng xã hội xây dựng trên .NET 9 với kiến trúc microservices containerized.',
    tags: ['.NET 9 Web API', 'SQL Server', 'MongoDB', 'Docker Compose', 'IMemoryCache', 'SignalR', 'Gemini API', 'React 19'],
    imageUrl: '/images/unimarket.png',
    githubUrl: 'https://github.com/DinhCNTT/unimarket-fullstack',
    liveUrl: 'https://bit.ly/4ul7636',
    problem: 'Role: Backend Developer · Team size: 3 · Mar 2026 – Jun 2026\n• Hệ thống phân tán chịu tải lớn yêu cầu cấu hình môi trường local đơn giản, tối ưu hóa cơ sở dữ liệu trên 170+ API, xử lý ngoại lệ tập trung và tích hợp Chatbot AI tư vấn.',
    solution: '• Container hóa backend .NET 9 Web API và SQL Server bằng Docker Compose, giúp thiết lập môi trường chạy local nhanh chóng bằng một câu lệnh.\n• Tối ưu hiệu năng cơ sở dữ liệu tại các endpoint có lưu lượng truy cập cao trong backend 170+ API bằng IMemoryCache cho dữ liệu tĩnh và LINQ AsNoTracking cho các truy vấn chỉ đọc.\n• Triển khai theo dõi trạng thái hoạt động (online/offline) thời gian thực bằng SignalR Hubs với cơ chế quản lý kết nối an toàn đa luồng (thread-safe) và BackgroundService để tự động phát hiện ngắt kết nối.\n• Tích hợp Google Gemini API với cơ chế Function Calling để xây dựng chatbot tư vấn sản phẩm thông minh bằng AI, tự động trả lời các câu hỏi thường gặp của khách hàng.\n• Triển khai middleware xử lý ngoại lệ tập trung (centralized exception) để chuẩn hóa phản hồi lỗi JSON, loại bỏ các đoạn mã try-catch trùng lặp trên 32 Services và Repositories.',
    result: '• Rút ngắn thời gian thiết lập môi trường local xuống tối đa bằng lệnh Docker Compose duy nhất.\n• Giảm tải rõ rệt thời gian phản hồi trung bình nhờ cache và AsNoTracking trên 170+ API.\n• Loại bỏ mã nguồn try-catch dư thừa trên toàn bộ 32 Services/Repositories nhờ xử lý lỗi tập trung.'
  },
  {
    id: 'techgearshop',
    title: 'TechGearShop – E-Commerce & Mini-ERP System',
    category: '.NET',
    description: 'Hệ thống thương mại điện tử nổi bật với tính năng thanh toán đơn hàng tự động, quản lý mã giảm giá khuyến mãi và đồng bộ kho hàng theo thời gian thực.',
    tags: ['RabbitMQ', 'MassTransit', 'SQL Server', 'SignalR', 'ASP.NET Core', 'VNPay API', 'xUnit', 'Moq'],
    imageUrl: '/images/techgearshop.png',
    githubUrl: 'https://github.com/DinhCNTT/TechGearShop_V1',
    liveUrl: '',
    problem: 'Role: Full-stack Developer (Backend Focused) · Team size: solo · Mar 2026 – Jun 2026\n• Hệ thống yêu cầu xử lý đặt hàng nhanh chóng, quản lý mã giảm giá phức tạp và đồng bộ kho hàng theo thời gian thực (real-time).',
    solution: '• Tối ưu thời gian phản hồi checkout từ 150ms xuống 60ms thông qua RabbitMQ và MassTransit, xử lý bất đồng bộ đặt hàng và thông báo tồn kho.\n• Giảm 90% thao tác ghi database bằng in-memory buffering, đồng bộ lượt xem sản phẩm xuống SQL Server mỗi 5 phút.\n• Triển khai theo dõi đơn hàng realtime bằng ASP.NET Core SignalR, loại bỏ polling.\n• Xây dựng 68 HTTP endpoints và 2 SignalR Hubs, tích hợp VNPay và xuất báo cáo Excel (EPPlus).',
    result: '• Tối ưu hệ thống hoàn thiện với độ trễ thấp và khả năng chịu tải tốt nhờ queue và cache.\n• Viết 16 unit tests (xUnit & Moq) cho module Cart và Checkout, đảm bảo độ ổn định của business logic và ngăn chặn lỗi regression.'
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
  },
  {
    id: 'soundspace',
    title: 'SoundSpace',
    category: 'Node.js',
    description: 'Nền tảng nghe nhạc cộng tác thời gian thực tích hợp hệ thống phát nhạc đồng bộ và cơ chế fallback âm thanh thông minh.',
    tags: ['Node.js', 'Express.js', 'React 19', 'Socket.IO', 'MongoDB', 'Mongoose', 'LRU Cache', 'Cloudinary', 'node-schedule'],
    imageUrl: '/images/soundspace.png',
    githubUrl: 'https://github.com/DinhCNTT/soundspace-web',
    liveUrl: '',
    problem: '• Cần giảm thiểu thời gian trễ và gián đoạn (buffering) khi phát âm thanh từ YouTube thông qua server.\n• Đảm bảo đồng bộ hóa trạng thái phát nhạc (play, pause, seek) thời gian thực cho hơn 50+ người nghe đồng thời trong cùng một phòng.\n• Tối ưu hóa hiệu năng API backend và bộ đệm để hạn chế truy vấn lặp lại đến cơ sở dữ liệu khi xác thực phòng.\n• Dọn dẹp tự động tệp tin tạm thời và tài nguyên mồ côi trên Cloudinary để tối ưu chi phí lưu trữ.',
    solution: '• Triển khai hệ thống phát nhạc kép (dual-engine audio fallback) kết hợp ytdl-core và yt-dlp CLI cùng với LRU Cache để lưu trữ tạm các luồng audio.\n• Sử dụng Socket.IO để xây dựng kênh giao tiếp thời gian thực, đồng bộ hóa trạng thái phát nhạc giữa host và listeners.\n• Di chuyển các tác vụ database không quan trọng (ghi log, lưu vết) thành các background job bất đồng bộ.\n• Xây dựng in-memory access-control cache có thời gian hết hạn (expiration) cho các phòng công cộng và phòng có mã PIN.\n• Cài đặt cơ chế cleanup hướng sự kiện (event-driven cleanup) bằng node-schedule để tự động xóa tệp thừa.',
    result: '• Giảm thời gian buffering âm thanh từ ~3 giây xuống còn 0.5 giây trong môi trường thử nghiệm.\n• Hỗ trợ ổn định trên 50+ listeners đồng thời mỗi phòng mà không bị lệch pha playback.\n• Giảm thời gian phản hồi API khi tham gia phòng (room-join response time) từ ~1.8 giây xuống còn 250ms.\n• Tối ưu chỉ mục truy vấn phòng và giải phóng dung lượng lưu trữ Cloudinary tự động.'
  }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProjectDetails, setActiveProjectDetails] = useState(null);
  const [projects, setProjects] = useState(projectsData);
  const [activeTab, setActiveTab] = useState('overview');

  const getProjectMetrics = (title) => {
    const normTitle = title.toLowerCase();
    if (normTitle.includes('unimarket')) {
      return [
        { label: 'Quy mô hệ thống', value: '170+ APIs', desc: 'Backend .NET 9 Web API' },
        { label: 'Xử lý lỗi tập trung', value: '32 Services', desc: 'Chuẩn hóa JSON Error Middleware' },
        { label: 'Chatbot tư vấn', value: 'Gemini AI', desc: 'Tích hợp Function Calling' },
        { label: 'Thiết lập local', value: '1 Lệnh chạy', desc: 'Container hóa Docker Compose' }
      ];
    }
    if (normTitle.includes('techgearshop')) {
      return [
        { label: 'Checkout Time', value: '60 ms', desc: 'Tối ưu từ 150ms nhờ RabbitMQ' },
        { label: 'Lưu lượng ghi DB', value: '- 90%', desc: 'In-memory view buffering' },
        { label: 'Backend APIs', value: '68 Endpoints', desc: 'Kèm theo 2 SignalR Hubs' },
        { label: 'Unit Tests', value: '16 Tests', desc: 'xUnit & Moq cho Checkout' }
      ];
    }
    if (normTitle.includes('soundspace')) {
      return [
        { label: 'Độ trễ âm thanh', value: '0.5 giây', desc: 'Giảm từ 3s nhờ dual-engine' },
        { label: 'Đồng bộ realtime', value: '50+ user', desc: 'Listeners đồng thời mỗi phòng' },
        { label: 'Room-join API', value: '250 ms', desc: 'Giảm từ 1.8s (tác vụ chạy ngầm)' },
        { label: 'Dọn dẹp tự động', value: 'Cloudinary', desc: 'Xóa media mồ côi tự động' }
      ];
    }
    return [
      { label: 'Phân quyền bảo mật', value: '100% An toàn', desc: 'Chống phân quyền sai sót' },
      { label: 'Bảo mật Client', value: 'HttpOnly JWT', desc: 'Chống tấn công XSS & CSRF' },
      { label: 'Mã hóa mật khẩu', value: 'bcrypt (s=10)', desc: 'Thuật toán mã hóa an toàn' },
      { label: 'Chỉ mục tìm kiếm', value: 'Text Search', desc: 'Tối ưu hóa truy vấn MongoDB' }
    ];
  };

  const renderBulletPoints = (text, type) => {
    if (!text) return null;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return (
      <ul className="grid grid-cols-1 gap-3">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[•\-\*]\s*/, '');
          
          let Icon = ChevronRight;
          let iconColor = 'text-slate-400';
          let borderTheme = 'border-white/5 hover:border-slate-800 bg-white/5';
          
          if (type === 'problem') {
            Icon = HelpCircle;
            iconColor = 'text-rose-400';
            borderTheme = 'border-rose-500/10 hover:border-rose-500/30 bg-rose-500/5';
          } else if (type === 'solution') {
            Icon = ToggleLeft;
            iconColor = 'text-cyan-400';
            borderTheme = 'border-cyan-500/10 hover:border-cyan-500/30 bg-[#06b6d4]/5';
          } else if (type === 'result') {
            Icon = CheckCircle;
            iconColor = 'text-emerald-400';
            borderTheme = 'border-emerald-500/10 hover:border-emerald-500/30 bg-emerald-500/5';
          }
          
          return (
            <motion.li 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              key={idx} 
              className={`flex gap-3 p-4 rounded-xl border ${borderTheme} transition-all duration-300`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <span className="text-slate-300 text-sm leading-relaxed">{cleanLine}</span>
            </motion.li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/projects`)
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
    <section id="projects" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-cyber-accent2/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 md:px-8 relative z-10"
      >
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-jakarta font-extrabold tracking-[0.2em] text-cyber-accent2 uppercase">
            // PROJECTS.REPOSITORY
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-jakarta text-white">
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
                className={`px-4 py-2 rounded-lg text-xs font-bold font-jakarta tracking-wider transition-all border whitespace-nowrap ${
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
                  <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 border border-white/10 text-xs font-jakarta text-cyber-accent2 font-bold tracking-wider">
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
                      onClick={() => { setActiveProjectDetails(project); setActiveTab('overview'); }}
                      className="inline-flex items-center gap-1 text-xs font-jakarta font-bold text-cyber-accent2 hover:text-cyber-accent3 transition-colors group-hover:underline"
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
      </motion.div>

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
              className="w-full max-w-2xl bg-[#0b0f19] border border-cyber-accent2/30 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#080d16]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-accent2 animate-pulse" />
                  <div>
                    <h3 className="font-jakarta font-black text-lg text-white uppercase tracking-wide leading-none">
                      {activeProjectDetails.title}
                    </h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                      PSR Analytics Dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeProjectDetails.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all flex items-center gap-1 text-[10px] font-jakarta font-extrabold tracking-wider"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>CODE</span>
                  </a>
                  {activeProjectDetails.liveUrl && (
                    <a
                      href={activeProjectDetails.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-cyber-accent2/10 hover:bg-cyber-accent2/20 text-cyber-accent2 border border-cyber-accent2/20 hover:border-cyber-accent2/40 transition-all flex items-center gap-1 text-[10px] font-jakarta font-extrabold tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>DEMO</span>
                    </a>
                  )}
                  <button
                    onClick={() => setActiveProjectDetails(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors ml-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-white/5 bg-[#080d16]/50 px-5 shrink-0 overflow-x-auto scrollbar-none">
                {[
                  { id: 'overview', name: 'OVERVIEW & KPI' },
                  { id: 'challenge', name: 'CHALLENGE & SOLUTION' },
                  { id: 'results', name: 'IMPACT & RESULTS' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3 text-[10px] font-jakarta font-extrabold tracking-widest border-b-2 transition-all relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-cyber-accent2 text-cyber-accent2 font-black'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.name}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeModalTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyber-accent2"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Scrollable details container */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#0b0f19] scrollbar-thin">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 shadow-inner">
                      <img 
                        src={activeProjectDetails.imageUrl} 
                        alt={activeProjectDetails.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent" />
                    </div>

                    {/* Summary description */}
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0e1424]/40">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {activeProjectDetails.description}
                      </p>
                    </div>

                    {/* KPI Metrics Dashboard Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-jakarta font-extrabold tracking-[0.15em] text-cyber-accent1 uppercase">
                        // CORE PERFORMANCE METRICS
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {getProjectMetrics(activeProjectDetails.title).map((metric, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 rounded-xl border border-white/5 bg-[#0e1424]/60 hover:border-cyber-accent1/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] flex flex-col justify-between"
                          >
                            <span className="text-[10px] font-jakarta font-extrabold tracking-wider text-slate-400 uppercase">
                              {metric.label}
                            </span>
                            <span className="text-xl font-black font-mono text-cyber-accent1 mt-1.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.3)]">
                              {metric.value}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 leading-normal">
                              {metric.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies tags */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-jakarta font-extrabold tracking-[0.15em] text-slate-400 uppercase">
                        // TECH STACK DEPLOYED
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProjectDetails.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-semibold text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'challenge' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Problem Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-rose-400 font-jakarta font-black text-xs tracking-wider uppercase">
                        <HelpCircle className="w-4.5 h-4.5" />
                        PROBLEM / THỬ THÁCH & VẤN ĐỀ ĐẶT RA
                      </div>
                      {renderBulletPoints(activeProjectDetails.problem, 'problem')}
                    </div>

                    {/* Solution Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-cyan-400 font-jakarta font-black text-xs tracking-wider uppercase">
                        <ToggleLeft className="w-4.5 h-4.5" />
                        SOLUTION / GIẢI PHÁP & KIẾN TRÚC TRIỂN KHAI
                      </div>
                      {renderBulletPoints(activeProjectDetails.solution, 'solution')}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'results' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Result Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-jakarta font-black text-xs tracking-wider uppercase">
                        <CheckCircle className="w-4.5 h-4.5" />
                        RESULT / HIỆU QUẢ ĐO LƯỜNG THỰC TẾ
                      </div>
                      {renderBulletPoints(activeProjectDetails.result, 'result')}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
