import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Languages, CheckCircle2 } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-cyber-accent2/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-outfit font-extrabold tracking-[0.2em] text-cyber-accent2 uppercase">
            // ACADEMIC.BACKGROUND
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-outfit text-white">
            HỌC VẤN & GIẢI THƯỞNG
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Academic degree info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex flex-col justify-between relative group hover:border-cyber-accent2/20 transition-all duration-300 animate-pulse-cyan"
          >
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyber-accent2/10" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyber-accent2/10 border border-cyber-accent2/20 text-cyber-accent2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-outfit font-extrabold text-white">
                    ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)
                  </h4>
                  <p className="text-cyber-accent2 font-semibold text-sm mt-1">
                    Cử Nhân Kỹ Thuật Phần Mềm (Software Engineering)
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Niên khóa: 2022 – 2026 (Đã hoàn thành toàn bộ chương trình học)
                  </p>
                </div>
              </div>

              {/* GPA Metric Display */}
              <div className="p-4 rounded-xl border border-white/5 bg-black/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyber-accent1" />
                  <span className="text-slate-300 text-sm font-medium">Điểm trung bình tích lũy (GPA):</span>
                </div>
                <span className="text-xl font-outfit font-extrabold text-cyber-accent1 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                  3.43 / 4.0
                </span>
              </div>

              {/* Core focus details */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-outfit font-bold text-slate-400 tracking-wider">
                  NỘI DUNG HOÀN THÀNH CHỦ ĐẠO:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Kiến trúc phần mềm chuẩn',
                    'Thiết kế CSDL quan hệ & NoSQL',
                    'Giải thuật và cấu trúc dữ liệu',
                    'Tích hợp trí tuệ nhân tạo (AI)',
                    'Phân tích & thiết kế hệ thống',
                    'Quản lý dự án Agile/Scrum'
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-slate-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-accent2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Awards and Languages */}
          <div className="md:col-span-5 flex flex-col gap-6 justify-between">
            {/* Award Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 relative group flex-1 flex flex-col justify-center space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-white leading-tight">
                    SINH VIÊN XUẤT SẮC
                  </h4>
                  <p className="text-amber-500 text-xs font-bold font-outfit mt-0.5">
                    OUTSTANDING STUDENT AWARD
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Được vinh danh bởi Đại học Công nghệ TP.HCM (HUTECH) vào tháng 11/2025 nhờ thành tích học tập và hoạt động đóng góp xuất sắc.
              </p>
            </motion.div>

            {/* Languages Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md flex-1 flex flex-col justify-center space-y-3 animate-pulse-purple"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyber-accent1/10 text-cyber-accent1">
                  <Languages className="w-5 h-5" />
                </div>
                <h4 className="font-outfit font-bold text-white">
                  KHẢ NĂNG NGÔN NGỮ
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs font-medium">Tiếng Việt (Bản xứ):</span>
                  <span className="text-xs font-bold font-outfit text-cyber-accent1 bg-cyber-accent1/10 border border-cyber-accent1/20 px-2 py-0.5 rounded">
                    NATIVE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs font-medium">Tiếng Anh (Chuyên ngành):</span>
                  <span className="text-xs font-bold font-outfit text-cyber-accent2 bg-cyber-accent2/10 border border-cyber-accent2/20 px-2 py-0.5 rounded">
                    PROFICIENT
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-tight mt-1">
                  * Đọc hiểu tài liệu kỹ thuật, nghiên cứu tài liệu hệ thống và giao tiếp cơ bản tốt.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
