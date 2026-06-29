import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Shield, Layout, Database, Terminal } from 'lucide-react';

const skillsData = [
  { name: '.NET 9 / C#', level: 85, category: 'Backend', icon: Shield },
  { name: 'EF Core', level: 85, category: 'Backend', icon: Shield },
  { name: 'SignalR Realtime', level: 80, category: 'Backend', icon: Shield },
  { name: 'ML.NET & Gemini API', level: 75, category: 'Backend', icon: Shield },
  { name: 'React 19 / Vite', level: 75, category: 'Frontend', icon: Layout },
  { name: 'Node.js / Express', level: 70, category: 'Backend', icon: Shield },
  { name: 'PostgreSQL', level: 80, category: 'Database', icon: Database },
  { name: 'SQL Server', level: 80, category: 'Database', icon: Database },
  { name: 'Docker / Compose', level: 75, category: 'DevOps', icon: Terminal },
  { name: 'Git & Cloud Deploy', level: 80, category: 'DevOps', icon: Terminal }
];

const categories = [
  { id: 'all', name: 'TẤT CẢ' },
  { id: 'Backend', name: 'BACKEND' },
  { id: 'Frontend', name: 'FRONTEND' },
  { id: 'Database', name: 'CƠ SỞ DỮ LIỆU' },
  { id: 'DevOps', name: 'DEVOPS & TOOLS' }
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [skills, setSkills] = useState(skillsData);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/skills`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const mapped = data.map(s => {
            let icon = Terminal;
            if (s.category === 'Backend') icon = Shield;
            else if (s.category === 'Frontend') icon = Layout;
            else if (s.category === 'Database') icon = Database;
            return {
              ...s,
              icon
            };
          });
          setSkills(mapped);
        }
      })
      .catch(err => console.error("Lỗi fetch skills:", err));
  }, []);

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  // Data formatted for Recharts Radar (taking top 6 skills for optimal radar shape)
  const radarData = skills.slice(0, 6);

  const handleTickClick = (skillName) => {
    const found = skills.find(s => s.name === skillName);
    if (found && found.category) {
      setActiveCategory(found.category);
    }
  };

  const CustomAngleTick = ({ payload, x, y, cx, cy }) => {
    const found = skills.find(s => s.name === payload.value);
    const isCategoryMatch = activeCategory === 'all' || (found && found.category === activeCategory);
    const isActive = hoveredSkill === payload.value;
    
    const fill = isActive 
      ? '#06b6d4' 
      : isCategoryMatch 
        ? '#94a3b8' 
        : '#334155';
        
    const fontSize = isActive ? 10.5 : 9.5;
    const fontWeight = isActive ? 800 : 600;

    return (
      <g 
        className="cursor-pointer"
        onClick={() => handleTickClick(payload.value)}
        onMouseEnter={() => setHoveredSkill(payload.value)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
          fill={fill}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontFamily="Outfit"
          style={{ transition: 'all 0.2s ease-in-out' }}
          className={isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}
        >
          {payload.value}
        </text>
      </g>
    );
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-cyber-accent1/30 px-3 py-2 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <p className="text-xs font-outfit font-bold text-white uppercase tracking-wider">{payload[0].name}</p>
          <p className="text-sm font-mono text-cyber-accent1 font-bold mt-1">Trình độ: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      {/* Light highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-accent1/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-outfit font-extrabold tracking-[0.2em] text-cyber-accent1 uppercase">
            // SKILLS.DASHBOARD
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-white">
            NĂNG LỰC CÔNG NGHỆ
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Recharts Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 h-[320px] md:h-[380px] p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col items-center justify-center relative group overflow-hidden animate-pulse-cyan"
          >
            {/* Corner glowing element */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyber-accent1/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyber-accent2/20" />

            <h4 className="text-xs font-outfit text-slate-400 font-bold tracking-wider mb-4 uppercase">
              Visual Matrix analysis
            </h4>
            
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  radius="70%" 
                  data={radarData}
                  onMouseMove={(state) => {
                    if (state && state.activeLabel) {
                      setHoveredSkill(state.activeLabel);
                    }
                  }}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={<CustomAngleTick />} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#475569', fontSize: 8 }}
                  />
                  <Radar
                    name="Kỹ năng"
                    dataKey="level"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                    className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Right Column: Interactive Skills List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider font-outfit transition-all duration-300 border ${
                    activeCategory === cat.id
                      ? 'bg-cyber-accent1/10 border-cyber-accent1 text-cyber-accent1 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Progress Bars Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredSkills.map(skill => {
                const IconComponent = skill.icon;
                return (
                  <motion.div
                    layout
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                      hoveredSkill === skill.name
                        ? 'border-cyber-accent1 bg-cyber-accent1/5 scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        : 'border-white/5 bg-cyber-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-white/5 text-cyber-accent1 group-hover:text-cyber-accent2 transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyber-accent1">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 relative"
                      >
                        {/* Glow tip */}
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[1px] opacity-60" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
