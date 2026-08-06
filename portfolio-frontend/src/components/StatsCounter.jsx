import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Database, Users, ShieldCheck } from 'lucide-react';

function CounterItem({ target, duration = 1500, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) {
      setCount(0); // Reset count when out of view
      return;
    }
    
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = progress * target;
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, target, duration]);

  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={ref} className="font-outfit font-black tracking-tight">
      {prefix}
      {formattedCount}
      <span className={suffix.length > 5 ? "text-2xl lg:text-3xl inline-block" : ""}>{suffix}</span>
    </span>
  );
}

export default function StatsCounter() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const stats = [
    {
      id: 'api-speed',
      icon: Zap,
      label: 'TỐC ĐỘ API BACKEND',
      target: 45,
      suffix: ' ms',
      prefix: '< ',
      desc: 'Tối ưu hóa hơn 170+ API backend sử dụng IMemoryCache và LINQ AsNoTracking cho các truy vấn chỉ đọc.',
      color: 'text-cyber-accent1',
      borderColor: 'group-hover:border-cyber-accent1/35',
      glowColor: 'rgba(6, 182, 212, 0.15)',
    },
    {
      id: 'db-cache',
      icon: Database,
      label: 'GIẢM TẢI GHI DATABASE',
      target: 90,
      suffix: '%',
      prefix: '-',
      desc: 'Sử dụng cơ chế in-memory buffering để giảm tải ghi trực tiếp vào SQL Server, đồng bộ định kỳ mỗi 5 phút.',
      color: 'text-cyber-accent2',
      borderColor: 'group-hover:border-cyber-accent2/35',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      id: 'checkout-speed',
      icon: ShieldCheck,
      label: 'TỐC ĐỘ CHECKOUT',
      target: 60,
      suffix: ' ms',
      prefix: '~ ',
      desc: 'Xử lý đặt hàng bất đồng bộ qua RabbitMQ & MassTransit, loại bỏ hoàn toàn (100%) lỗi Overselling.',
      color: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/35',
      glowColor: 'rgba(52, 211, 153, 0.15)',
    },
    {
      id: 'uptime-monitor',
      icon: Users,
      label: 'THỜI GIAN UPTIME',
      target: 99.8,
      suffix: '%',
      prefix: '',
      decimals: 1,
      desc: 'Giám sát hệ thống production thực tế sử dụng Prometheus, Grafana kết hợp cảnh báo tự động Telegram.',
      color: 'text-cyber-accent3',
      borderColor: 'group-hover:border-cyber-accent3/35',
      glowColor: 'rgba(217, 70, 239, 0.15)',
    }
  ];

  return (
    <section 
      ref={containerRef}
      id="stats" 
      className="py-20 relative overflow-hidden bg-transparent border-t border-white/5"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full bg-cyber-accent1/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-16"
        >
          <h2 className="text-xs font-jakarta font-extrabold tracking-[0.2em] text-cyber-accent1 uppercase">
            // METRICS.SHOWCASE
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-jakarta text-white">
            HIỆU NĂNG VÀ CON SỐ ẤN TƯỢNG
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 mx-auto rounded" />
          <p className="text-slate-400 text-sm max-w-xl mx-auto pt-2">
            Được kiểm chứng từ thực tiễn vận hành và tối ưu hóa hệ thống để đạt tốc độ cao nhất, độ trễ thấp nhất.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                style={{
                  '--glow-color': stat.glowColor
                }}
              >
                {/* Floating Glow Spot behind card on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${stat.glowColor}, transparent 70%)`
                  }}
                />

                {/* Corner accent details */}
                <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r border-white/5 rounded-tr-2xl transition-colors duration-300 ${stat.borderColor}`} />
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/5 rounded-bl-2xl transition-colors duration-300 ${stat.borderColor}`} />

                {/* Stat Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color} transition-all duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.02)]`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-jakarta font-bold text-slate-300 text-xs tracking-wider uppercase">
                    {stat.label}
                  </h4>
                </div>

                {/* Stat Number */}
                <div className="mb-2">
                  <div className={`text-3xl sm:text-4xl lg:text-[40px] xl:text-5xl font-black font-jakarta ${stat.color} filter drop-shadow-[0_0_12px_rgba(6,182,212,0.1)] whitespace-nowrap`}>
                    <CounterItem 
                      target={stat.target} 
                      suffix={stat.suffix} 
                      prefix={stat.prefix} 
                      decimals={stat.decimals || 0}
                    />
                  </div>
                </div>

                {/* Stat Description */}
                <p className="text-slate-400 text-xs leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
