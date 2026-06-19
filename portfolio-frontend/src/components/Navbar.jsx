import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Cpu, MessageSquare } from 'lucide-react';

const navItems = [
  { name: 'Trang Chủ', href: '#home' },
  { name: 'Kỹ Năng', href: '#skills' },
  { name: 'Dự Án', href: '#projects' },
  { name: 'Kinh Nghiệm', href: '#experience' },
  { name: 'Học Vấn', href: '#education' }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple intersection observer approximation
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-cyber-bg/75 backdrop-blur-md border-b border-cyber-accent1/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex items-center gap-2 font-outfit font-extrabold text-xl tracking-wider group text-white"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyber-accent1 to-cyber-accent2 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 bg-clip-text text-transparent group-hover:text-white transition-colors">
            DINH
          </span>
          <span className="text-slate-400 group-hover:text-cyber-accent1 transition-colors">.DEV</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const id = item.href.substring(1);
            const isActive = activeSection === id;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, id)}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive ? 'text-cyber-accent1 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}

          {/* Quick Chat Callout Button */}
          <button 
            onClick={() => {
              const chatbotWidgetBtn = document.getElementById('chatbot-widget-trigger');
              if (chatbotWidgetBtn) chatbotWidgetBtn.click();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-cyber-accent1/30 bg-cyber-accent1/10 hover:bg-cyber-accent1/20 text-cyber-accent1 font-bold text-xs tracking-wider font-outfit transition-all hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            AI CLONE
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => {
              const chatbotWidgetBtn = document.getElementById('chatbot-widget-trigger');
              if (chatbotWidgetBtn) chatbotWidgetBtn.click();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-cyber-accent1/20 bg-cyber-accent1/5 text-cyber-accent1"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cyber-bg/95 border-b border-cyber-accent1/10 backdrop-blur-md"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => {
                const id = item.href.substring(1);
                const isActive = activeSection === id;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-cyber-accent1/10 text-cyber-accent1 border-l-2 border-cyber-accent1' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
