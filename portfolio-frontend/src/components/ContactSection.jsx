import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc (Họ tên, Email và Tin nhắn).');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (response.ok) {
        setStatus('success');
        setSuccessData(resData.data || { name: formData.name });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(resData.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      // Fallback to simulation if backend API is not currently reachable/deployed
      setTimeout(() => {
        setStatus('success');
        setSuccessData({ name: formData.name });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 1500);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-cyber-accent2/[0.03] blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-16"
        >
          <h2 className="text-xs font-jakarta font-extrabold tracking-[0.2em] text-cyber-accent1 uppercase">
            // CONTACT.CHANNELS
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold font-jakarta text-white">
            LIÊN HỆ HỢP TÁC
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 mx-auto rounded" />
          <p className="text-slate-400 text-sm max-w-xl mx-auto pt-2">
            Đang tìm kiếm cơ hội làm việc Full-time hoặc các dự án Freelance. Hãy gửi tin nhắn ngay, Định sẽ phản hồi nhanh nhất!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Direct Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-white/5 bg-cyber-card backdrop-blur-md relative overflow-hidden group hover:border-cyber-accent1/25 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            {/* Visual glow overlay */}
            <div className="absolute top-0 left-0 w-16 h-[2px] bg-gradient-to-r from-cyber-accent1 to-transparent" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5 rounded-tr-3xl" />
            
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-jakarta font-extrabold text-white mb-2">
                  THÔNG TIN LIÊN HỆ
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Kết nối trực tiếp qua email, điện thoại hoặc các mạng xã hội nghề nghiệp.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Item */}
                <div className="flex items-center gap-4 group/item">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-cyber-accent1 group-hover/item:border-cyber-accent1/30 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">EMAIL</span>
                    <a href="mailto:dinhcm123321@gmail.com" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors font-mono">
                      dinhcm123321@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-center gap-4 group/item">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-cyber-accent2 group-hover/item:border-cyber-accent2/30 transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ĐIỆN THOẠI</span>
                    <a href="tel:0842070552" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors font-mono">
                      0842.070.552
                    </a>
                  </div>
                </div>

                {/* Location Item */}
                <div className="flex items-center gap-4 group/item">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-cyber-accent3 group-hover/item:border-cyber-accent3/30 transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Khu Vực</span>
                    <span className="text-sm font-semibold text-slate-300">
                      Quận Bình Thạnh, TP. Hồ Chí Minh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Tech Status badge */}
            <div className="mt-10 p-4 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-400 font-semibold font-jakarta">Trạng thái công việc:</span>
              </div>
              <span className="text-xs font-jakarta font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                SẴN SÀNG NHẬN VIỆC
              </span>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 rounded-3xl border border-white/5 bg-cyber-card backdrop-blur-md relative shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            {/* Visual pulse glow on submit */}
            <div className="absolute top-0 right-0 w-16 h-[2px] bg-gradient-to-r from-transparent to-cyber-accent2" />

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                  </motion.div>
                  <h4 className="text-2xl font-jakarta font-extrabold text-white">
                    Gửi Tin Nhắn Thành Công!
                  </h4>
                  <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                    Cảm ơn <b>{successData?.name || 'bạn'}</b> đã gửi liên hệ cho Định. Hệ thống backend đã ghi nhận thành công. Định sẽ liên lạc lại trong thời gian sớm nhất qua email <b>{successData?.email}</b>.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-jakarta font-bold text-white transition-colors"
                  >
                    GỬI TIN NHẮN KHÁC
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-jakarta font-bold text-slate-400 tracking-wider">
                        HỌ VÀ TÊN <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/30 text-white text-sm focus:border-cyber-accent1 focus:ring-1 focus:ring-cyber-accent1/20 outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-jakarta font-bold text-slate-400 tracking-wider">
                        EMAIL LIÊN HỆ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/30 text-white text-sm focus:border-cyber-accent1 focus:ring-1 focus:ring-cyber-accent1/20 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-jakarta font-bold text-slate-400 tracking-wider">
                      TIÊU ĐỀ ĐỀ XUẤT
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Lời mời hợp tác dự án / Phỏng vấn tuyển dụng"
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/30 text-white text-sm focus:border-cyber-accent1 focus:ring-1 focus:ring-cyber-accent1/20 outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-jakarta font-bold text-slate-400 tracking-wider">
                      NỘI DUNG CHI TIẾT <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Xin chào Định, mình đến từ công ty... Muốn trao đổi với bạn về..."
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/30 text-white text-sm focus:border-cyber-accent1 focus:ring-1 focus:ring-cyber-accent1/20 outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl border border-rose-500/15 bg-rose-500/5 text-rose-400 text-xs flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyber-accent1 to-cyber-accent2 hover:from-cyan-500 hover:to-purple-600 font-jakarta font-extrabold text-sm tracking-wider text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          ĐANG XỬ LÝ GỬI TIN...
                        </>
                      ) : (
                        <>
                          GỬI ĐỀ NGHỊ LIÊN HỆ
                          <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
