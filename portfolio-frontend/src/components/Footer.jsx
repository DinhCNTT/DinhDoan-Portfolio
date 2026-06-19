import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, Lock } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 relative overflow-hidden bg-[#02050e] border-t border-white/5 text-slate-500">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Copyright */}
        <div className="text-center md:text-left space-y-1">
          <div className="font-outfit font-extrabold text-sm text-slate-300 tracking-wider flex items-center justify-center md:justify-start gap-1.5">
            <span>DINH</span>
            <span className="text-cyber-accent1">.DEV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent1 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Đoàn Tuệ Định. Mọi quyền được bảo lưu.
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            Powered by .NET 9 + React 19 + Supabase pgvector & Gemini API.
          </p>
        </div>

        {/* Center/Right: Actions and social */}
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:dinhcm123321@gmail.com" 
              className="p-2 rounded-lg border border-white/5 bg-white/5 hover:text-white hover:border-slate-700 transition-colors"
              title="Gửi Email trực tiếp"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/DinhCNTT" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg border border-white/5 bg-white/5 hover:text-white hover:border-slate-700 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com/in/doantuedinh" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg border border-white/5 bg-white/5 hover:text-white hover:border-slate-700 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Scroll to Top and Admin button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center justify-center p-2 rounded-lg border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:border-slate-700 transition-all hover:scale-105 active:scale-95"
              title="Đăng nhập trang quản trị Admin"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center justify-center p-2 rounded-lg border border-cyber-accent1/20 bg-cyber-accent1/5 text-cyber-accent1 hover:bg-cyber-accent1/15 hover:border-cyber-accent1/50 transition-all hover:scale-105 active:scale-95"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
