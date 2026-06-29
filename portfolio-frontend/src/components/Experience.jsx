import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, ChevronRight, Github, ExternalLink } from 'lucide-react';

const experiences = [
  {
    role: 'Backend Engineering Intern',
    company: 'CyberSoft',
    period: '20/04/2026 – 20/06/2026',
    description: 'Thực tập sinh phát triển hệ thống API Backend, xây dựng các giải pháp lưu trữ dữ liệu hiệu quả và cấu hình các cơ chế bảo mật.',
    points: [
      'Xây dựng các REST API có khả năng mở rộng tốt bằng Node.js & Express.js dựa trên kiến trúc MVC chuẩn mực.',
      'Thiết kế và tối ưu hóa NoSQL schema trong MongoDB (sử dụng Mongoose) giúp lưu trữ và truy vấn dữ liệu hiệu suất cao.',
      'Triển khai các cơ chế bảo mật và phân quyền truy cập nâng cao sử dụng JSON Web Token (JWT) và thuật toán mã hóa bcrypt.',
      'Quản lý source code qua Git, phối hợp nhóm hiệu quả và đồng bộ hóa mượt mà các API Backend với ứng dụng React Client.',
      'Xây dựng và triển khai thực tế ứng dụng Clean Text Workspace lên nền tảng đám mây Vercel.'
    ],
    github: 'https://github.com/DinhCNTT/clean-text-workspace',
    demo: 'https://clean-text-workspace.vercel.app'
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="absolute top-1/2 left-10 w-96 h-96 rounded-full bg-cyber-accent1/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-outfit font-extrabold tracking-[0.2em] text-cyber-accent1 uppercase">
            // CAREER.PATHWAY
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-white">
            KINH NGHIỆM LÀM VIỆC
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 mx-auto rounded" />
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-cyber-accent1/20 ml-4 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-10"
            >
              {/* Pulsing Timeline Node */}
              <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full border border-cyber-accent1 bg-[#030712] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyber-accent1 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-cyber-accent1 absolute" />
              </div>

              {/* Timeline Card */}
              <div className="p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md relative group hover:border-cyber-accent1/30 transition-all duration-300">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-cyber-accent1 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-cyber-accent1 transition-colors">
                      {exp.role}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                      <Briefcase className="w-4 h-4 text-cyber-accent1" />
                      <span className="font-semibold text-slate-300">{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-outfit font-semibold text-slate-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg w-fit">
                    <Calendar className="w-3.5 h-3.5 text-cyber-accent2" />
                    {exp.period}
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4 leading-relaxed font-medium">
                  {exp.description}
                </p>

                {/* Key Accomplishments */}
                <ul className="space-y-2 mb-6">
                  {exp.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex gap-2 text-slate-400 text-sm leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-cyber-accent1 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Links for Internship Project */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <a
                    href={exp.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Code repository
                  </a>
                  {exp.demo && (
                    <a
                      href={exp.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyber-accent1/20 bg-cyber-accent1/5 text-xs text-cyber-accent1 hover:bg-cyber-accent1/10 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo thực tế
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
