import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: 'Anh Nguyễn Hoàng Sơn',
    role: 'Backend Tech Lead · CyberSoft Mentor',
    content: 'Định là một trong những thực tập sinh xuất sắc nhất mà tôi từng hướng dẫn. Em đã giải quyết thành công các bài toán xử lý bất đồng bộ phức tạp bằng BullMQ, tự xây dựng RAG Search Engine hoàn chỉnh tích hợp Pinecone/Gemini, và triển khai hệ thống giám sát Prometheus/Grafana rất chuyên nghiệp. Tư duy tối ưu và khả năng bảo mật của em vượt trội so với trình độ thông thường.',
    avatarInitials: 'HS',
    color: 'from-cyan-500 to-blue-500',
    stars: 5
  },
  {
    id: 2,
    name: 'TS. Lê Văn Minh',
    role: 'Giảng viên Khoa CNTT · HUTECH',
    content: 'Điểm số GPA 3.43 cùng danh hiệu Sinh viên Xuất sắc phản ánh đúng năng lực học thuật và sự chỉn chu của Định. Em có kiến thức nền tảng rất vững về cấu trúc dữ liệu, thuật toán và thiết kế cơ sở dữ liệu. Dự án UniMarket của em thể hiện rõ tính sáng tạo và khả năng làm chủ các công nghệ mới.',
    avatarInitials: 'LM',
    color: 'from-purple-500 to-pink-500',
    stars: 5
  },
  {
    id: 3,
    name: 'Mr. David Nguyen',
    role: 'Founder & CEO · TechGear Shop',
    content: 'Chúng tôi hợp tác với Định để tối ưu hóa cổng thanh toán và xử lý đơn đặt hàng bất đồng bộ. Kết quả thật ngoài mong đợi: tốc độ checkout giảm mạnh từ 150ms xuống chỉ còn 60ms thông qua RabbitMQ & MassTransit, giảm tải ghi DB đến 90%. Hệ thống vận hành hoàn toàn ổn định và an toàn trong đợt sale cao điểm. Rất chuyên nghiệp!',
    avatarInitials: 'DN',
    color: 'from-amber-500 to-orange-500',
    stars: 5
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  };

  const activeTestimonial = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      {/* Light Blur Background Orbs */}
      <div className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-cyber-accent2/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyber-accent1/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-16"
        >
          <h2 className="text-xs font-jakarta font-extrabold tracking-[0.2em] text-cyber-accent2 uppercase">
            // SOCIAL.PROOF
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-jakarta text-white">
            ĐÁNH GIÁ TỪ ĐỐI TÁC & CỐ VẤN
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 mx-auto rounded" />
        </motion.div>

        {/* Carousel Container */}
        <div className="relative min-h-[320px] flex items-center justify-center">
          
          {/* Main Card with AnimatePresence */}
          <div className="w-full relative overflow-hidden px-2 py-4">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full p-8 md:p-10 rounded-3xl border border-white/5 bg-cyber-card backdrop-blur-md relative shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-white/10 transition-all duration-300"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-8 w-12 h-12 text-cyber-accent1/10 pointer-events-none" />

                <div className="flex flex-col gap-6">
                  {/* Rating stars */}
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(activeTestimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>

                  {/* Comment text */}
                  <blockquote className="text-slate-200 text-sm md:text-base leading-relaxed italic font-medium font-jakarta">
                    "{activeTestimonial.content}"
                  </blockquote>

                  {/* Profile info */}
                  <div className="flex items-center gap-4 border-t border-white/5 pt-5 mt-2">
                    {/* Avatar Initials */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${activeTestimonial.color} flex items-center justify-center text-white font-jakarta font-extrabold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
                      {activeTestimonial.avatarInitials}
                    </div>
                    <div>
                      <cite className="not-italic font-jakarta font-extrabold text-white text-sm md:text-base block">
                        {activeTestimonial.name}
                      </cite>
                      <span className="text-xs text-slate-400 font-semibold tracking-wide">
                        {activeTestimonial.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[-20px] md:left-[-50px] z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 bg-slate-950/70 hover:bg-slate-900/90 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-[-20px] md:right-[-50px] z-20">
            <button
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/5 bg-slate-950/70 hover:bg-slate-900/90 text-slate-400 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-cyber-accent2 shadow-[0_0_8px_rgba(168,85,247,0.5)]' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
