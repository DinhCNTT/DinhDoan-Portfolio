import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, ArrowRight, Github, Linkedin, Award, BookOpen, Briefcase } from 'lucide-react';

function TypingTerminal() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullText = "Fresher Backend Developer";

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length - 1));
        }, 50);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    } else {
      if (displayText.length < fullText.length) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, 100);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  return (
    <div className="h-8 flex items-center justify-start font-mono text-slate-400 text-lg md:text-2xl font-bold">
      <span className="text-cyber-accent1 mr-2">&gt;</span>
      <span>{displayText}</span>
      <span className="w-2 h-5 bg-cyber-accent1 ml-1 animate-pulse" />
    </div>
  );
}

export default function Hero() {
  // Parallax background scroll effects
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);
  const yText = useTransform(scrollY, [0, 500], [0, -30]);

  // Framer Motion entry variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen relative flex items-center justify-center pt-28 pb-16 overflow-hidden bg-transparent"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* Futuristic SVG background elements with Parallax scroll */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute inset-0 pointer-events-none z-0 opacity-10"
      >
        <svg width="100%" height="100%">
          <circle cx="20%" cy="30%" r="2" fill="#06b6d4" className="animate-pulse" />
          <circle cx="80%" cy="70%" r="3" fill="#a855f7" className="animate-pulse" />
          <path d="M 0,100 Q 150,150 300,100 T 600,100 T 900,100 T 1200,100" fill="none" stroke="#06b6d4" strokeWidth="1" />
        </svg>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Info */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: yText }}
            className="lg:col-span-7 text-left space-y-8 flex flex-col items-start order-2 lg:order-1"
          >
            
            {/* Status Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyber-accent1/25 bg-cyber-accent1/5 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
              <span className="text-xs font-jakarta tracking-wider text-slate-300 font-extrabold">
                SẴN SÀNG LÀM VIỆC · TP. HỒ CHÍ MINH
              </span>
            </motion.div>

            <div className="space-y-4 w-full">
              {/* Hello Text */}
              <motion.p 
                variants={itemVariants}
                className="text-cyber-accent1 font-jakarta tracking-widest text-xs sm:text-sm font-extrabold uppercase"
              >
                // DEVELOPER.INITIALIZE ( "WELCOME" );
              </motion.p>

              {/* Main Name Heading */}
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-jakarta tracking-tight text-white leading-none animate-glow-text"
              >
                ĐOÀN TUỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent1 via-cyber-accent2 to-cyber-accent3 drop-shadow-[0_0_15px_rgba(6,182,212,0.35)]">ĐỊNH</span>
              </motion.h1>

              {/* Typing Terminal Text */}
              <motion.div variants={itemVariants}>
                <TypingTerminal />
              </motion.div>
            </div>

            {/* Brief CV Summary */}
            <motion.p 
              variants={itemVariants}
              className="text-slate-400 max-w-2xl leading-relaxed text-sm md:text-base font-jakarta font-medium"
            >
              Đam mê phát triển hệ thống <b>Backend</b> với kinh nghiệm thực tiễn vững chắc về <b>ASP.NET Core (.NET 9)</b> và <b>Node.js</b>. Sở hữu nền tảng tốt về xây dựng RESTful API, tối ưu hóa cơ sở dữ liệu SQL/NoSQL, áp dụng nguyên lý OOP, SOLID, kiến trúc Clean Architecture và viết Unit Testing. Luôn sẵn sàng đóng góp phát triển sản phẩm, cộng tác hiệu quả trong các dự án Agile và không ngừng cập nhật các công nghệ backend hiện đại.
            </motion.p>

            {/* CTA Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-cyber-accent1/30 bg-cyber-accent1/5 hover:bg-cyber-accent1/10 hover:border-cyber-accent1/60 font-extrabold text-sm tracking-wider font-jakarta text-cyber-accent1 shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all hover:scale-105 duration-200 active:scale-95 animate-glow-pulse-cyan"
              >
                KHÁM PHÁ DỰ ÁN
                <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
              </a>

              <button
                onClick={() => {
                  const chatbotWidgetBtn = document.getElementById('chatbot-widget-trigger');
                  if (chatbotWidgetBtn) chatbotWidgetBtn.click();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-accent2 via-cyber-accent3 to-cyber-accent2 hover:from-purple-600 hover:to-pink-600 font-extrabold text-sm tracking-wider font-jakarta text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] transition-all hover:scale-105 duration-200 active:scale-95 animate-glow-pulse-purple"
              >
                CHAT VỚI AI CLONE
                <MessageSquare className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-5 pt-2 text-slate-400"
            >
              <a href="https://github.com/DinhCNTT" target="_blank" rel="noreferrer" className="hover:text-cyber-accent1 transition-colors hover:scale-110 duration-200" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/doantuedinh" target="_blank" rel="noreferrer" className="hover:text-cyber-accent2 transition-colors hover:scale-110 duration-200" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Mini stats grid */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 w-full"
            >
              <div className="p-4 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center hover:border-cyber-accent1/20 transition-all duration-300">
                <BookOpen className="w-5 h-5 text-cyber-accent1 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-extrabold font-jakarta mb-0.5 uppercase">HUTECH GPA</span>
                <span className="text-base sm:text-lg font-extrabold font-jakarta text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">3.43 / 4.0</span>
              </div>

              <div className="p-4 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center hover:border-cyber-accent2/20 transition-all duration-300">
                <Award className="w-5 h-5 text-cyber-accent2 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-extrabold font-jakarta mb-0.5 uppercase">THÀNH TÍCH</span>
                <span className="text-[11px] font-extrabold text-center font-jakarta text-white leading-tight uppercase">OUTSTANDING STUDENT</span>
              </div>

              <div className="p-4 col-span-2 sm:col-span-1 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center hover:border-cyber-accent3/20 transition-all duration-300">
                <Briefcase className="w-5 h-5 text-cyber-accent3 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-extrabold font-jakarta mb-0.5 uppercase">KỲ THỰC TẬP</span>
                <span className="text-xs sm:text-sm font-extrabold font-jakarta text-white uppercase">CYBERSOFT INTERN</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Avatar HUD Container */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex items-center justify-center w-[280px] sm:w-[320px] lg:w-[350px] aspect-square"
            >
              {/* Glowing backdrop */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyber-accent1/10 to-cyber-accent2/10 blur-3xl pointer-events-none" />

              {/* Outer static cyber ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-accent1/20" />

              {/* Inner static cyber ring */}
              <div className="absolute inset-3 rounded-full border border-dashed border-cyber-accent2/20" />

              {/* Main Avatar Wrapper with glowing border */}
              <div className="absolute inset-7 rounded-full border border-white/10 bg-black/40 backdrop-blur-md p-1.5 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-500 group">
                
                {/* Inner decorative neon ring */}
                <div className="absolute inset-1 rounded-full border border-transparent bg-gradient-to-tr from-cyber-accent1 via-transparent to-cyber-accent2 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Profile Image */}
                <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-slate-950 flex items-center justify-center">
                  <img 
                    src="/images/avatar.jpg" 
                    alt="Đoàn Tuệ Định" 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    onError={(e) => {
                      if (!e.target.src.endsWith('.png')) {
                        e.target.src = '/images/avatar.png';
                      } else {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }
                    }}
                  />
                  {/* Fallback Icon if avatar doesn't exist */}
                  <div className="hidden w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-1/4 h-1/4 text-cyber-accent1/40 animate-pulse">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span className="text-[9px] font-mono text-slate-500 mt-2 tracking-wider">NO_AVATAR.SYS</span>
                  </div>
                </div>

                {/* Technical corner accents / HUD labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded bg-[#030712] border border-cyber-accent1/30 text-[8px] font-mono text-cyber-accent1/80 tracking-widest select-none z-20">
                  D.DEV_UNIT_01
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
