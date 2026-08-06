import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, Lock } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 relative overflow-hidden bg-cyber-bg/85 border-t border-white/5 text-slate-400">
      {/* Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] rounded-full bg-cyber-accent1/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Copyright & Info */}
        <div className="text-center md:text-left space-y-2">
          <div className="font-outfit font-extrabold text-base text-slate-200 tracking-wider flex items-center justify-center md:justify-start gap-1.5">
            <span>DINH</span>
            <span className="text-cyber-accent1">.DEV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent1 animate-pulse" />
          </div>
          <p className="text-sm text-slate-300 font-medium">
            © {new Date().getFullYear()} Đoàn Tuệ Định. Mọi quyền được bảo lưu.
          </p>
          <p className="text-xs text-slate-400 font-jakarta leading-relaxed">
            Hệ thống phát triển trên nền tảng <span className="text-cyber-accent1 font-semibold">.NET 9</span> + <span className="text-cyber-accent2 font-semibold">React 19</span> + <span className="text-cyber-accent3 font-semibold">Supabase Vector DB</span> & <span className="text-cyber-accent1 font-semibold">Gemini AI API</span>.
          </p>
        </div>

        {/* Right Side: Social & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="mailto:dinhcm123321@gmail.com" 
              className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-cyber-accent1/10 hover:text-cyber-accent1 hover:border-cyber-accent1/30 text-slate-300 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.01)]"
              title="Gửi Email trực tiếp"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/DinhCNTT" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-cyber-accent1/10 hover:text-cyber-accent1 hover:border-cyber-accent1/30 text-slate-300 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.01)]"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/doantuedinh" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-cyber-accent1/10 hover:text-cyber-accent1 hover:border-cyber-accent1/30 text-slate-300 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.01)]"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Scroll to Top & Admin */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:text-white hover:border-white/30 transition-all hover:scale-105 active:scale-95"
              title="Đăng nhập trang quản trị Admin"
            >
              <Lock className="w-5 h-5" />
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center justify-center p-2.5 rounded-xl border border-cyber-accent1/30 bg-cyber-accent1/10 text-cyber-accent1 hover:bg-cyber-accent1/20 hover:border-cyber-accent1/50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
