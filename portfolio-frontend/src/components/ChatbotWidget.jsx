import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, CornerDownLeft, Sparkles } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SUGGESTIONS = [
  "Giới thiệu bản thân bạn đi?",
  "Kinh nghiệm thực tập của Định?",
  "Dự án UniMarket hoạt động như thế nào?",
  "Thông tin liên hệ của Định?"
];

const SLOGANS = [
  "💬 Tò mò về tôi? Chat với AI Clone để phỏng vấn tớ nhé!",
  "🤖 Hỏi trợ lý AI xem Định có thể làm gì cho dự án của bạn!",
  "✨ Tìm kiếm thông tin liên hệ, học vấn của Định? Bấm chat ngay!",
  "🚀 Trợ lý AI sẵn sàng trả lời 24/7. Hỏi mình bất cứ điều gì!"
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showBubble || isOpen) return;

    const interval = setInterval(() => {
      setCurrentSloganIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [showBubble, isOpen]);

  const handleToggleChat = () => {
    setIsOpen(prev => {
      const nextState = !prev;
      if (nextState) {
        setShowBubble(false);
      }
      return nextState;
    });
  };

  const handleDismissBubble = (e) => {
    e.stopPropagation();
    setShowBubble(false);
  };

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Xin chào! Mình là trợ lý ảo AI của Đoàn Tuệ Định. Bạn có thể hỏi mình bất cứ điều gì về kinh nghiệm lập trình .NET, các dự án nổi bật, học vấn hoặc cách liên hệ với Định nhé! 🚀',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connection, setConnection] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    let id = localStorage.getItem('chat_session_id');
    // Nếu chưa có ID hoặc ID cũ chưa có thông tin trình duyệt (không chứa ký tự '|')
    if (!id || !id.includes('|')) {
      const ua = navigator.userAgent;
      let browser = "Other";
      if (ua.indexOf("Firefox") > -1) browser = "Firefox";
      else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung";
      else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
      else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
      else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
      else if (ua.indexOf("Safari") > -1) browser = "Safari";

      let os = "Other";
      if (ua.indexOf("Windows") > -1) os = "Windows";
      else if (ua.indexOf("Macintosh") > -1) os = "macOS";
      else if (ua.indexOf("Android") > -1) os = "Android";
      else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
      else if (ua.indexOf("Linux") > -1) os = "Linux";

      const randId = Math.random().toString(36).substring(2, 10);
      id = `${randId}|${browser}|${os}`;
      localStorage.setItem('chat_session_id', id);
    }
    return id;
  });

  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  // Initialize SignalR Connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BACKEND_URL}/chatHub`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    let reconnectTimeoutId = null;

    const startConnection = async () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        return;
      }
      try {
        await newConnection.start();
        console.log("SignalR Connected to ChatHub!");
      } catch (err) {
        console.error("SignalR Connection Error, retrying in 5s: ", err);
        if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = setTimeout(startConnection, 5000);
      }
    };

    newConnection.onclose((err) => {
      console.log("SignalR Connection closed. Attempting reconnect in 5s...", err);
      if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
      reconnectTimeoutId = setTimeout(startConnection, 5000);
    });

    startConnection();

    return () => {
      if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = async (textToSend) => {
    const trimmedText = textToSend || input.trim();
    if (!trimmedText) return;

    if (!textToSend) {
      setInput('');
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedText,
      time: timeString
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Prepare Placeholder Bot Message for Streaming
    const botMsgId = `bot-${Date.now()}`;
    const botMsgPlaceholder = {
      id: botMsgId,
      sender: 'bot',
      text: '',
      time: timeString,
      isStreaming: true
    };
    setMessages(prev => [...prev, botMsgPlaceholder]);

    // 3. Invoke Stream
    // 3. Invoke Stream
    const sendStream = async () => {
      let checkCount = 0;
      // Nếu đang trong quá trình kết nối, đợi tối đa 5 giây (10 lần * 500ms)
      while (
        connectionRef.current &&
        connectionRef.current.state === signalR.HubConnectionState.Connecting &&
        checkCount < 10
      ) {
        await new Promise(resolve => setTimeout(resolve, 500));
        checkCount++;
      }

      if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
        let accumulatedText = "";
        
        connectionRef.current.stream("SendMessage", sessionId, trimmedText).subscribe({
          next: (chunk) => {
            setIsTyping(false);
            accumulatedText += chunk;
            setMessages(prev =>
              prev.map(m => m.id === botMsgId ? { ...m, text: accumulatedText } : m)
            );
          },
          complete: () => {
            setMessages(prev =>
              prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m)
            );
          },
          error: (err) => {
            setIsTyping(false);
            console.error("Streaming error:", err);
            setMessages(prev =>
              prev.map(m =>
                m.id === botMsgId
                  ? { ...m, text: "Có lỗi xảy ra khi kết nối máy chủ AI. Vui lòng thử lại sau!", isStreaming: false }
                  : m
              )
            );
          }
        });
      } else {
        // Reconnection fallback
        setIsTyping(false);
        setMessages(prev =>
          prev.map(m =>
            m.id === botMsgId
              ? { ...m, text: "Đang mất kết nối tới Server AI. Vui lòng đợi trong giây lát...", isStreaming: false }
              : m
          )
        );
      }
    };

    sendStream();
  };

  const clearChatHistory = () => {
    const welcomeMsg = {
      id: 'welcome',
      sender: 'bot',
      text: 'Đã xóa lịch sử trò chuyện. Mình có thể giúp gì thêm cho bạn?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
    localStorage.removeItem('chat_history');

    // Tạo mới hoàn toàn chat_session_id cùng metadata trình duyệt và OS
    const ua = navigator.userAgent;
    let browser = "Other";
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    let os = "Other";
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Macintosh") > -1) os = "macOS";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";

    const randId = Math.random().toString(36).substring(2, 10);
    const newId = `${randId}|${browser}|${os}`;
    localStorage.setItem('chat_session_id', newId);
    setSessionId(newId);
  };

  return (
    <>
      {/* Zalo Floating Button - Hidden when AI Chatbox is open to avoid overlay overlap */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-50 group">
          <a 
            href="https://zalo.me/0842070552"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#0068ff] text-white rounded-full shadow-[0_0_15px_rgba(0,104,255,0.5)] hover:scale-110 hover:shadow-[0_0_25px_rgba(0,104,255,0.85)] transition-all duration-300 relative"
            aria-label="Liên hệ Zalo"
          >
            <span className="font-bold text-base md:text-lg font-jakarta tracking-wide">Zalo</span>
          </a>
          
          {/* Zalo Tooltip */}
          <span className="absolute right-18 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0b0f19]/90 border border-blue-500/30 rounded-xl text-xs font-semibold font-jakarta text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.55)] backdrop-blur-sm">
            Kết nối Zalo trực tiếp 💬
            {/* Arrow pointer */}
            <span className="absolute top-1/2 right-[-4px] -translate-y-1/2 w-2 h-2 bg-[#0b0f19] border-r border-t border-blue-500/30 rotate-45" />
          </span>
        </div>
      )}

      {/* Speech Bubble / Greeting Slogans */}
      <AnimatePresence>
        {!isOpen && showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 30 }}
            onClick={handleToggleChat}
            className="fixed bottom-6 right-24 z-50 w-[280px] md:w-[340px] bg-[#0b0f19]/95 border border-cyber-accent2/50 backdrop-blur-md text-slate-100 rounded-2xl p-4 pr-9 shadow-[0_0_35px_rgba(168,85,247,0.4)] cursor-pointer select-none text-xs md:text-sm font-jakarta flex gap-3 hover:border-cyber-accent2 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
          >
            {/* Tiny triangle arrow pointing to the button */}
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 bg-[#0b0f19] border-r border-t border-cyber-accent2/50 rotate-45 pointer-events-none" />

            {/* Glowing Bot Avatar inside bubble */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyber-accent1 to-cyber-accent2 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] relative">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold tracking-widest text-cyber-accent1 font-outfit uppercase">
                  Trợ Lý AI
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-400 font-medium">Online</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSloganIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-200 font-semibold leading-relaxed font-jakarta"
                >
                  {SLOGANS[currentSloganIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismissBubble}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
              title="Tắt thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button Container */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {/* Pulsing Outer Ripples (when closed) */}
        {!isOpen && (
          <>
            <div className="absolute inset-[-6px] rounded-full bg-cyber-accent2/25 animate-ping-slow pointer-events-none" style={{ animationDelay: '0s' }} />
            <div className="absolute inset-[-6px] rounded-full bg-cyber-accent1/15 animate-ping-slow pointer-events-none" style={{ animationDelay: '1.75s' }} />
          </>
        )}

        <div className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 group">
          {/* Actual button with soft purple border */}
          <button
            id="chatbot-widget-trigger"
            onClick={handleToggleChat}
            className="relative w-full h-full bg-slate-950 hover:bg-slate-900 border-2 border-cyber-accent2/50 hover:border-cyber-accent2/80 text-white rounded-full flex items-center justify-center transition-colors"
            title="Trò chuyện với AI Clone"
          >
            {/* Red active notification badge */}
            {!isOpen && (
              <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-600 border-2 border-slate-950 rounded-full flex items-center justify-center text-[10px] font-black font-outfit text-white shadow-[0_0_12px_rgba(244,63,94,0.7)] z-20">
                1
              </span>
            )}

            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <div className="relative flex items-center justify-center text-cyber-accent2 group-hover:text-cyber-accent3 transition-colors animate-bot-float">
                <Bot className="w-7 h-7" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Chat window drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[380px] h-[520px] bg-[#0b0f19]/95 border border-cyber-accent2/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-md"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-cyber-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-accent1 to-cyber-accent2 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0b0f19] rounded-full" />
                </div>
                <div>
                  <h4 className="font-outfit font-extrabold text-sm text-white flex items-center gap-1">
                    AI CLONE ASSISTANT
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider font-outfit uppercase">
                    Đoàn Tuệ Định AI Version
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChatHistory}
                  className="text-[10px] font-outfit font-bold text-slate-500 hover:text-rose-400 px-2 py-1 rounded hover:bg-white/5 transition-colors"
                  title="Clear Chat History"
                >
                  XÓA LỊCH SỬ
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyber-accent2/10 border border-cyber-accent2/30 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line break-words">
                      {msg.text || (msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-cyber-accent1 animate-pulse" />)}
                    </div>
                    <span className="block text-[9px] text-slate-500 text-right mt-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-3.5 py-3 text-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent1 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent1 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent1 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/10 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  className="px-3 py-1 rounded-full border border-white/5 bg-white/5 hover:border-cyber-accent1/30 hover:bg-cyber-accent1/5 text-xs text-slate-300 hover:text-cyber-accent1 transition-all"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/5 bg-cyber-card flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Hỏi về kỹ năng, dự án của Định..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-accent2/50 transition-colors placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyber-accent2/10 hover:bg-cyber-accent2/20 border border-cyber-accent2/20 text-cyber-accent2 transition-all flex items-center justify-center"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
