import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function CyberBackground() {
  const [mounted, setMounted] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Initialize mouse coordinates
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Spring config for the fast inner core (snaps to mouse cursor quickly)
  const fastSpringConfig = { damping: 30, stiffness: 220, mass: 0.4 };
  // Spring config for the trailing outer aura (lags behind organically)
  const slowSpringConfig = { damping: 40, stiffness: 100, mass: 0.8 };

  const springX = useSpring(mouseX, fastSpringConfig);
  const springY = useSpring(mouseY, fastSpringConfig);

  const slowSpringX = useSpring(mouseX, slowSpringConfig);
  const slowSpringY = useSpring(mouseY, slowSpringConfig);

  // Center the spotlight: offset by half of element width
  // Inner core size is 160px, so offset is -80px
  const glowXInner = useTransform(springX, (v) => v - 80);
  const glowYInner = useTransform(springY, (v) => v - 80);

  // Outer aura size is 450px, so offset is -225px
  const glowXOuter = useTransform(slowSpringX, (v) => v - 225);
  const glowYOuter = useTransform(slowSpringY, (v) => v - 225);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e) => {
      if (!hasMoved) setHasMoved(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, hasMoved]);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0a0618 0%, #030612 50%, #000000 100%)'
      }}
    >
      {/* Layer 1: Global Dotted Matrix Grid (Stripe/Tailwind style) */}
      <div 
        className="absolute inset-0 opacity-[0.25]" 
        style={{
          backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.18) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 60%, transparent 100%)',
        }}
      />

      {/* Layer 2: Cyber Tech Grid Lines (wider mesh for blueprint look) */}
      <div 
        className="absolute inset-0 bg-grid opacity-[0.15]" 
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Layer 3: Slowly morphing ambient neon nebula clouds */}
      <div 
        className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] rounded-full bg-cyber-accent1/5 blur-[140px] animate-pulse-slow" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] rounded-full bg-cyber-accent2/5 blur-[140px] animate-pulse-slow" 
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="absolute top-[35%] left-[45%] -translate-x-1/2 w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full bg-cyber-accent3/3 blur-[150px] animate-pulse-slow" 
        style={{ animationDelay: '1s' }}
      />

      {/* Layer 4: Interactive dual-layer mouse glow spotlight */}
      {hasMoved && (
        <>
          {/* Outer soft trailing aura (Cyan & Purple blend) */}
          <motion.div
            className="hidden md:block absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-cyber-accent1/25 via-cyber-accent2/15 to-transparent blur-[75px] mix-blend-screen"
            style={{
              x: glowXOuter,
              y: glowYOuter,
            }}
          />
          {/* Inner energetic core (highly vibrant Cyan & Pink blend) */}
          <motion.div
            className="hidden md:block absolute w-[160px] h-[160px] rounded-full bg-gradient-to-r from-cyber-accent1/45 via-cyber-accent3/35 to-cyber-accent2/25 blur-[25px] mix-blend-screen"
            style={{
              x: glowXInner,
              y: glowYInner,
            }}
          />
        </>
      )}

      {/* Layer 5: Procedural Micro-noise/grain texture overlay for premium matte finish */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
