import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const LOG_MESSAGES = [
  { text: '>> INITIALIZING PORTFOLIO_DINH.EXE PROTOCOL...', minProgress: 0 },
  { text: '>> LOADING INTERFACE STYLES & GLOW MODULES... OK', minProgress: 20 },
  { text: '>> CONNECTING TO CLOUD DATABASE (SUPABASE)... CONNECTED', minProgress: 45 },
  { text: '>> SYNCING AI CLONE KNOWLEDGE SYSTEM... ACTIVE', minProgress: 70 },
  { text: '>> SYSTEM OPERATIONAL. DEPLOYING INTERACTIVE GRID...', minProgress: 90 },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);

  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();
    const duration = 2000; // Total 2 seconds load time

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      // Filter visible logs based on current progress
      const logs = LOG_MESSAGES.filter(msg => currentProgress >= msg.minProgress).map(msg => msg.text);
      setVisibleLogs(logs);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // Delay 600ms at 100% so the user can read the last step
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05,
        filter: 'blur(10px)',
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 bg-[#030208] z-[9999] flex flex-col items-center justify-center font-orbitron select-none overflow-hidden"
    >
      {/* Cyber Grid background only for loader */}
      <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] scanlines" />

      {/* Cyber Shutter Glow Decoration */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-accent1 to-transparent shadow-[0_0_15px_#06b6d4]" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-accent2 to-transparent shadow-[0_0_15px_#a855f7]" />

      {/* Central Rotating HUD Frame */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center mb-10">
        {/* Outer Tech Ring */}
        <div className="absolute inset-0 border-2 border-dashed border-cyber-accent1/50 rounded-full animate-[spin_10s_linear_infinite]" />
        
        {/* Middle Dashed Ring */}
        <div className="absolute inset-4 border-2 border-dotted border-cyber-accent2/75 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
        
        {/* Inner Tech Target Corners */}
        <div className="absolute inset-8 border border-cyber-accent3/30 rounded-full flex items-center justify-center bg-cyber-bg/90 shadow-[inset_0_0_20px_rgba(217,70,239,0.25)] animate-pulse">
          <Cpu className="w-12 h-12 md:w-16 md:h-16 text-cyber-accent1 animate-pulse" />
        </div>
      </div>

      {/* Progress Info */}
      <div className="w-[90%] max-w-[600px] text-center mb-6 z-10">
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] text-cyber-accent1 uppercase glow-text-cyan mb-3">
          Initializing System
        </h2>
        <div className="flex justify-between items-center text-xs md:text-sm font-mono text-slate-400 tracking-wider mb-3">
          <span>SECURE_BOOT_SEQUENCE: v1.0.9</span>
          <span className="text-cyber-accent3 font-bold">{progress}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 md:h-4 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-[1px] relative shadow-[0_0_15px_rgba(0,0,0,0.6)]">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-cyber-accent1 via-cyber-accent2 to-cyber-accent3 shadow-[0_0_12px_#06b6d4]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Terminal Output Logs */}
      <div className="w-[90%] max-w-[600px] h-[150px] md:h-[180px] bg-black/50 border border-slate-900 rounded-lg p-5 md:p-6 font-mono text-xs md:text-[13px] text-slate-300 text-left overflow-hidden flex flex-col justify-end gap-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] z-10">
        {visibleLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={`tracking-wide truncate ${
              index === visibleLogs.length - 1 ? 'text-cyber-accent1 font-bold' : ''
            }`}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
