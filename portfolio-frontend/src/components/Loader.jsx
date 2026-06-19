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
      <div className="relative w-28 h-28 flex items-center justify-center mb-8">
        {/* Outer Tech Ring */}
        <div className="absolute inset-0 border-2 border-dashed border-cyber-accent1/40 rounded-full animate-[spin_10s_linear_infinite]" />
        
        {/* Middle Dashed Ring */}
        <div className="absolute inset-3 border border-dotted border-cyber-accent2/60 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
        
        {/* Inner Tech Target Corners */}
        <div className="absolute inset-6 border border-cyber-accent3/20 rounded-full flex items-center justify-center bg-cyber-bg/80 shadow-[inset_0_0_12px_rgba(217,70,239,0.15)] animate-pulse">
          <Cpu className="w-8 h-8 text-cyber-accent1 animate-pulse" />
        </div>
      </div>

      {/* Progress Info */}
      <div className="w-[320px] md:w-[450px] text-center mb-4 z-10">
        <h2 className="text-sm font-semibold tracking-[0.25em] text-cyber-accent1 uppercase glow-text-cyan mb-2">
          Initializing System
        </h2>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 tracking-wider mb-2">
          <span>SECURE_BOOT_SEQUENCE: v1.0.9</span>
          <span className="text-cyber-accent3 font-bold">{progress}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-[6px] bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-[1px] relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-cyber-accent1 via-cyber-accent2 to-cyber-accent3 shadow-[0_0_8px_#06b6d4]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Terminal Output Logs */}
      <div className="w-[320px] md:w-[450px] h-[100px] bg-black/40 border border-slate-900 rounded-md p-4 font-mono text-[9px] md:text-[10px] text-slate-400 text-left overflow-hidden flex flex-col justify-end gap-1.5 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] z-10">
        {visibleLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -5 }}
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
