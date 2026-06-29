import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Github, Linkedin, Award, BookOpen, Briefcase } from 'lucide-react';

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullText = "Fresher .NET Developer";

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length - 1));
        }, 50);
      } else {
        // Finished deleting, wait 500ms then start typing
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
        // Finished typing, wait 2000ms then start deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  return (
    <section 
      id="home" 
      className="min-h-screen relative flex items-center justify-center pt-28 pb-16 overflow-hidden bg-transparent"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* Futuristic SVG background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="100%">
          <circle cx="20%" cy="30%" r="2" fill="#06b6d4" className="animate-pulse" />
          <circle cx="80%" cy="70%" r="3" fill="#a855f7" className="animate-pulse" />
          <path d="M 0,100 Q 150,150 300,100 T 600,100 T 900,100 T 1200,100" fill="none" stroke="#06b6d4" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Info */}
          <div className="lg:col-span-7 text-left space-y-8 flex flex-col items-start order-2 lg:order-1">
            
            {/* Status Badge */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-accent1/20 bg-cyber-accent1/5 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
              <span className="text-xs font-outfit tracking-wider text-slate-300 font-semibold">
                READY TO CODE · HO CHI MINH CITY
              </span>
            </motion.div>

            <div className="space-y-4 w-full">
              {/* Hello Text */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-cyber-accent1 font-outfit tracking-widest text-sm md:text-base font-semibold"
              >
                SYSTEM.INITIALIZE ( "HELLO_WORLD" );
              </motion.p>

              {/* Main Name Heading */}
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-outfit tracking-tight text-white leading-none animate-glow-text"
              >
                ĐOÀN TUỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent1 via-cyber-accent2 to-cyber-accent3 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">ĐỊNH</span>
              </motion.h1>

              {/* Typing Terminal Text */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="h-8 flex items-center justify-start font-mono text-slate-400 text-lg md:text-2xl font-bold"
              >
                <span className="text-cyber-accent1 mr-2">&gt;</span>
                <span>{displayText}</span>
                <span className="w-2 h-5 bg-cyber-accent1 ml-1 animate-pulse" />
              </motion.div>
            </div>

            {/* Brief CV Summary */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-400 max-w-2xl leading-relaxed text-sm md:text-base"
            >
              Sinh viên năm cuối ngành Kỹ thuật phần mềm tại <b>HUTECH (GPA: 3.43)</b>. Chuyên môn hóa thiết kế hệ thống Backend hiệu năng cao dùng <b>ASP.NET Core (.NET 9)</b>, kiến trúc Clean Architecture, microservices Docker, và tích hợp các giải pháp AI thông minh.
            </motion.p>

            {/* CTA Actions */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-cyber-accent1/30 bg-cyber-accent1/5 hover:bg-cyber-accent1/10 hover:border-cyber-accent1/60 font-semibold text-sm tracking-wider font-outfit text-cyber-accent1 shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all hover:scale-105 duration-200 active:scale-95"
              >
                KHÁM PHÁ DỰ ÁN
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  const chatbotWidgetBtn = document.getElementById('chatbot-widget-trigger');
                  if (chatbotWidgetBtn) chatbotWidgetBtn.click();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 hover:from-purple-600 hover:to-pink-600 font-semibold text-sm tracking-wider font-outfit text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all hover:scale-105 duration-200 active:scale-95"
              >
                CHAT VỚI AI CLONE
                <MessageSquare className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-5 pt-2 text-slate-400"
            >
              <a href="https://github.com/DinhCNTT" target="_blank" rel="noreferrer" className="hover:text-cyber-accent1 transition-colors hover:scale-110 duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/doantuedinh" target="_blank" rel="noreferrer" className="hover:text-cyber-accent2 transition-colors hover:scale-110 duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Mini stats grid */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 w-full"
            >
              <div className="p-4 rounded-xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center animate-cyber-float">
                <BookOpen className="w-5 h-5 text-cyber-accent1 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-semibold font-outfit mb-0.5 uppercase">HUTECH GPA</span>
                <span className="text-base sm:text-lg font-bold font-outfit text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">3.43 / 4.0</span>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center animate-cyber-float-reverse">
                <Award className="w-5 h-5 text-cyber-accent2 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-semibold font-outfit mb-0.5 uppercase">THÀNH TÍCH</span>
                <span className="text-[11px] font-bold text-center font-outfit text-white leading-tight uppercase">OUTSTANDING STUDENT</span>
              </div>

              <div className="p-4 col-span-2 sm:col-span-1 rounded-xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center animate-cyber-float">
                <Briefcase className="w-5 h-5 text-cyber-accent3 mb-1.5" />
                <span className="text-[10px] text-slate-400 tracking-wider font-semibold font-outfit mb-0.5 uppercase">KỲ THỰC TẬP</span>
                <span className="text-xs sm:text-sm font-bold font-outfit text-white uppercase">CYBERSOFT INTERN</span>
              </div>
            </motion.div>
          </div>
          
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

              {/* Outer rotating cyber ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-accent1/20 animate-[spin_50s_linear_infinite]" />

              {/* Inner rotating cyber ring (different direction, different speed) */}
              <div className="absolute inset-3 rounded-full border border-dashed border-cyber-accent2/20 animate-[spin_30s_linear_infinite_reverse]" />

              {/* Main Avatar Wrapper with glowing border */}
              <div className="absolute inset-7 rounded-full border border-white/10 bg-black/40 backdrop-blur-md p-1.5 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-500 group animate-cyber-float">
                
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
