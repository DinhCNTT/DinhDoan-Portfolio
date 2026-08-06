import React, { useEffect, useState } from 'react';

export default function CyberBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {/* Layer 3: Static ambient neon nebula clouds (highly performant) */}
      <div 
        className="absolute top-[-15%] left-[-10%] w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] rounded-full bg-cyber-accent1/5 blur-[140px]" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[65vw] h-[65vw] max-w-[650px] max-h-[650px] rounded-full bg-cyber-accent2/5 blur-[140px]" 
      />
      <div 
        className="absolute top-[35%] left-[45%] -translate-x-1/2 w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full bg-cyber-accent3/3 blur-[150px]" 
      />

      {/* Layer 5: Procedural Micro-noise/grain texture overlay for premium matte finish (hidden on mobile for performance) */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none hidden lg:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
