import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  ArrowLeft, 
  LogOut, 
  Lock, 
  Activity, 
  Sparkles, 
  RefreshCw,
  Terminal,
  ChevronRight,
  Eye,
  Trash2,
  Settings,
  BarChart3
} from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [stats, setStats] = useState({
    onlineCount: 0,
    totalMessages: 0,
    totalSessions: 0,
    averageLatencyMs: 0
  });
  const [logs, setLogs] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations', 'prompt', 'analytics'
  const [systemPrompt, setSystemPrompt] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptMessage, setPromptMessage] = useState({ type: '', text: '' });

  const connectionRef = useRef(null);

  // Handle Login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    if (connectionRef.current) {
      connectionRef.current.stop();
      connectionRef.current = null;
    }
  };

  // Fetch Dashboard Stats & Chat Logs
  const fetchData = async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.status === 401) {
        handleLogout();
        return;
      }
      const statsData = await statsRes.json();
      setStats(prev => ({
        ...prev,
        ...statsData
      }));

      // 2. Fetch Chat Logs
      const logsRes = await fetch(`${BACKEND_URL}/api/admin/chat-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logsData = await logsRes.json();
      setLogs(logsData);
    } catch (err) {
      console.error("Lỗi fetch dữ liệu admin:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch System Prompt from API
  const fetchSystemPrompt = async () => {
    if (!token) return;
    setPromptLoading(true);
    setPromptMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/system-prompt`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSystemPrompt(data.prompt);
      } else {
        setPromptMessage({ type: 'error', text: data.message || 'Lỗi lấy cấu hình AI' });
      }
    } catch (err) {
      setPromptMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ API' });
    } finally {
      setPromptLoading(false);
    }
  };

  // Save System Prompt to API
  const saveSystemPrompt = async () => {
    if (!token) return;
    setPromptSaving(true);
    setPromptMessage({ type: '', text: '' });
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/system-prompt`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: systemPrompt })
      });
      const data = await res.json();
      if (res.ok) {
        setPromptMessage({ type: 'success', text: 'Cập nhật chỉ thị hệ thống AI thành công!' });
      } else {
        setPromptMessage({ type: 'error', text: data.message || 'Lỗi cập nhật cấu hình AI' });
      }
    } catch (err) {
      setPromptMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ API' });
    } finally {
      setPromptSaving(false);
    }
  };

  // Delete Conversation Session
  const handleDeleteSession = async (sessionId) => {
    const cleanId = sessionId.split('|')[0];
    if (!token || !window.confirm(`Bạn có chắc chắn muốn xóa toàn bộ cuộc hội thoại ${cleanId}... ?`)) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/chat-logs/${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedSessionId(null);
        fetchData();
      } else {
        alert("Lỗi khi xóa cuộc hội thoại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối");
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();

      // Setup SignalR connection to receive live online count
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/chatHub`)
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;

      newConnection.on("UpdateOnlineCount", (count) => {
        setStats(prev => ({ ...prev, onlineCount: count }));
      });

      const startConnection = async () => {
        try {
          await newConnection.start();
          console.log("Admin connected to ChatHub for real-time online tracking!");
        } catch (err) {
          console.error("SignalR Connection error in admin:", err);
        }
      };

      startConnection();

      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'prompt' && token) {
      fetchSystemPrompt();
    }
  }, [activeTab, token]);

  // Group messages by SessionId
  const conversationsMap = {};
  logs.forEach(log => {
    if (!conversationsMap[log.sessionId]) {
      conversationsMap[log.sessionId] = {
        sessionId: log.sessionId,
        messages: [],
        lastMessageAt: null,
        userMsgCount: 0
      };
    }
    conversationsMap[log.sessionId].messages.push(log);
    if (log.role === 'user') {
      conversationsMap[log.sessionId].userMsgCount += 1;
    }
  });

  // Sort messages inside sessions and determine session times
  Object.values(conversationsMap).forEach(c => {
    c.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    c.lastMessageAt = c.messages[c.messages.length - 1]?.createdAt;
  });

  const sortedConversations = Object.values(conversationsMap).sort((a, b) => {
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });

  // Parse OS and Browser Stats for Recharts
  const parseBrowserAndOS = () => {
    const browsers = {};
    const oss = {};
    
    Object.keys(conversationsMap).forEach(sid => {
      const parts = sid.split('|');
      const browser = parts[1] || 'Unknown';
      const os = parts[2] || 'Unknown';
      
      browsers[browser] = (browsers[browser] || 0) + 1;
      oss[os] = (oss[os] || 0) + 1;
    });

    const colors = ['#06b6d4', '#a855f7', '#f43f5e', '#eab308', '#10b981', '#6366f1'];

    const browserData = Object.keys(browsers).map((name, index) => ({
      name,
      value: browsers[name],
      color: colors[index % colors.length]
    }));

    const osData = Object.keys(oss).map((name, index) => ({
      name,
      value: oss[name],
      color: colors[(index + 2) % colors.length]
    }));

    return { browserData, osData };
  };

  const { browserData, osData } = parseBrowserAndOS();

  // Selected conversation detail messages
  const selectedConversation = selectedSessionId ? conversationsMap[selectedSessionId] : null;

  // Render Login page
  if (!token) {
    return (
      <div className="min-h-screen bg-cyber-bg bg-grid flex items-center justify-center p-4 relative overflow-hidden font-outfit">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-accent2/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyber-accent1/5 blur-[120px] pointer-events-none" />
        
        {/* Back Button */}
        <button
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="absolute top-6 left-6 px-4 py-2 rounded-lg border border-white/5 bg-cyber-card text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          QUAY LẠI TRANG CHỦ
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl border border-cyber-accent2/20 bg-cyber-card backdrop-blur-md relative"
        >
          {/* Header glowing neon lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-accent2 to-transparent" />
          
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-cyber-accent2/10 border border-cyber-accent2/30 flex items-center justify-center mx-auto text-cyber-accent2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold font-outfit text-white tracking-wide uppercase">
              ADMIN CONTROL CENTER
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              // SECURE_GATEWAY_V1.9
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tài khoản
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="w-full bg-black/40 border border-white/5 focus:border-cyber-accent2/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-black/40 border border-white/5 focus:border-cyber-accent2/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-rose-500 font-mono text-center">
                ⚠️ [ERROR]: {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC THỰC TRUY CẬP'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-cyber-bg bg-grid p-6 md:p-8 font-outfit relative">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyber-accent1/5 blur-[150px] pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-accent1 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide">
              HỆ THỐNG QUẢN TRỊ PORTFOLIO
            </h1>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1">
            // CONSOLE_PANEL_ROOT • TRẠNG THÁI: ONLINE
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-white/5 bg-cyber-card text-slate-400 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-bold"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
          
          {/* Back Home */}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-cyber-card text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            TRANG CHỦ
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-rose-950/40 bg-rose-950/10 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            ĐĂNG XUẤT
          </button>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Realtime Online Card */}
        <div className="p-5 rounded-2xl border border-cyber-accent1/20 bg-cyber-card backdrop-blur-md relative overflow-hidden group shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-accent1/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online Users</span>
            <div className="p-2 rounded-lg bg-cyber-accent1/10 text-cyber-accent1 animate-pulse">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white font-mono">{stats.onlineCount}</h3>
          <p className="text-xs text-cyber-accent1 font-bold mt-1 uppercase tracking-widest font-mono">
            ● realtime_heartbeat
          </p>
        </div>

        {/* Total Sessions Card */}
        <div className="p-5 rounded-2xl border border-cyber-accent2/20 bg-cyber-card backdrop-blur-md relative overflow-hidden group shadow-[0_0_15px_rgba(168,85,247,0.05)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-accent2/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng hội thoại (Sessions)</span>
            <div className="p-2 rounded-lg bg-cyber-accent2/10 text-cyber-accent2">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalSessions}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Phiên chat nhà tuyển dụng</p>
        </div>

        {/* Total Messages Card */}
        <div className="p-5 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng số tin nhắn</span>
            <div className="p-2 rounded-lg bg-white/5 text-slate-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white font-mono">{stats.totalMessages}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Lượng tương tác Q&A</p>
        </div>

        {/* Average Latency Card */}
        <div className="p-5 rounded-2xl border border-amber-950/20 bg-cyber-card backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ trễ AI (Gemini)</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-white font-mono">{stats.averageLatencyMs}ms</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Phản hồi trung bình</p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-white/5 mb-8 gap-2">
        <button
          onClick={() => setActiveTab('conversations')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'conversations'
              ? 'border-cyber-accent1 text-cyber-accent1 bg-cyber-accent1/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Hội thoại
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'prompt'
              ? 'border-cyber-accent2 text-cyber-accent2 bg-cyber-accent2/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          Cấu hình AI
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-cyber-accent1 text-cyber-accent1 bg-cyber-accent1/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Phân tích thiết bị
        </button>
      </div>

      {/* Main Area based on Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'conversations' && (
          <motion.div
            key="conversations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Sessions List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyber-accent1" />
                  LỊCH SỬ CHAT ({sortedConversations.length})
                </h2>
                <span className="text-[10px] font-mono text-slate-500">Sắp xếp theo thời gian mới nhất</span>
              </div>

              <div className="rounded-2xl border border-white/5 bg-cyber-card p-2 max-h-[500px] overflow-y-auto space-y-1.5 scrollbar-thin">
                {sortedConversations.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs uppercase tracking-wider font-mono">
                    Chưa có dữ liệu hội thoại nào
                  </div>
                ) : (
                  sortedConversations.map((convo) => {
                    const isSelected = selectedSessionId === convo.sessionId;
                    const lastMsg = convo.messages[convo.messages.length - 1];
                    const dateText = new Date(convo.lastMessageAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                    
                    const cleanSessionId = convo.sessionId.split('|')[0];
                    const browser = convo.sessionId.split('|')[1] || 'Unknown';
                    const os = convo.sessionId.split('|')[2] || 'Unknown';

                    return (
                      <button
                        key={convo.sessionId}
                        onClick={() => setSelectedSessionId(convo.sessionId)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 group ${
                          isSelected 
                            ? 'border-cyber-accent1 bg-cyber-accent1/5 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                            : 'border-transparent bg-white/0 hover:bg-white/5 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold text-cyber-accent2 uppercase tracking-wide">
                              Session: {cleanSessionId.substring(0, 8)}...
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              {dateText}
                            </span>
                          </div>
                          
                          {/* Last message preview */}
                          <p className="text-xs text-slate-300 truncate max-w-[280px]">
                            {lastMsg ? lastMsg.content : ''}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold font-mono bg-slate-800 text-slate-400 uppercase">
                              {convo.userMsgCount} tin nhắn
                            </span>
                            {convo.sessionId.includes('|') && (
                              <>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-cyber-accent1/10 text-cyber-accent1/80 border border-cyber-accent1/10">
                                  {browser}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-cyber-accent2/10 text-cyber-accent2/80 border border-cyber-accent2/10">
                                  {os}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-white transition-colors ${isSelected ? 'text-cyber-accent1' : ''}`} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Dialogue Thread */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyber-accent2" />
                CHI TIẾT CUỘC HỘI THOẠI
              </h2>

              <div className="rounded-2xl border border-white/5 bg-cyber-card p-6 h-[500px] flex flex-col backdrop-blur-md relative overflow-hidden">
                {/* Glowing accent border */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-accent1/20 to-transparent" />

                {!selectedConversation ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
                      <Terminal className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                        [CHƯA CHỌN PHIÊN HỘI THOẠI]
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                        Vui lòng chọn một Session hội thoại từ cột bên trái để xem đầy đủ nội dung Q&A chi tiết.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col h-full min-h-0">
                    {/* Active Session Info Header */}
                    <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-cyber-accent1 uppercase tracking-widest flex items-center gap-1.5">
                          ID: {selectedConversation.sessionId.split('|')[0]}
                        </span>
                        {selectedConversation.sessionId.includes('|') && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyber-accent1/10 text-cyber-accent1 border border-cyber-accent1/25">
                              🖥️ {selectedConversation.sessionId.split('|')[1] || 'Unknown'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyber-accent2/10 text-cyber-accent2 border border-cyber-accent2/25">
                              📱 {selectedConversation.sessionId.split('|')[2] || 'Unknown'}
                            </span>
                          </div>
                        )}
                        <h3 className="text-xs text-slate-400 mt-0.5">
                          Thời gian: {new Date(selectedConversation.lastMessageAt).toLocaleString()}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleDeleteSession(selectedConversation.sessionId)}
                        className="px-3 py-1.5 rounded-lg border border-rose-950 bg-rose-950/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-bold flex items-center gap-1.5"
                        title="Xóa cuộc hội thoại này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        XÓA HỘI THOẠI
                      </button>
                    </div>

                    {/* Dialog Messages list */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                      {selectedConversation.messages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div
                            key={msg.id || index}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                isUser
                                  ? 'bg-cyber-accent2/10 border border-cyber-accent2/20 text-white rounded-tr-none'
                                  : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-line break-words">{msg.content}</p>
                              
                              <div className="flex items-center justify-between gap-4 mt-1.5">
                                {!isUser && msg.latencyMs > 0 && (
                                  <span className="text-[8px] font-mono text-amber-500/80 uppercase">
                                    Latency: {msg.latencyMs}ms
                                  </span>
                                )}
                                <span className="text-[8px] font-mono text-slate-500 text-right ml-auto">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-4xl mx-auto p-6 rounded-2xl border border-cyber-accent2/20 bg-cyber-card backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-accent2/40 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyber-accent2" />
                  Cấu hình Chỉ thị AI (System Prompt)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Thiết lập vai trò, luật phản hồi và tính cách của trợ lý AI. Hệ thống RAG sẽ tự động đính kèm thông tin ngữ cảnh CV của bạn ở cuối.
                </p>
              </div>
              <button
                onClick={fetchSystemPrompt}
                disabled={promptLoading}
                className="p-2 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${promptLoading ? 'animate-spin' : ''}`} />
                Tải lại
              </button>
            </div>

            {promptLoading ? (
              <div className="h-64 flex items-center justify-center text-slate-500 uppercase tracking-widest font-mono text-xs">
                Đang tải cấu hình AI...
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-80 bg-black/40 border border-white/5 focus:border-cyber-accent2/50 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed outline-none transition-colors resize-y scrollbar-thin"
                  placeholder="Nhập System Prompt..."
                />

                {promptMessage.text && (
                  <div className={`p-3 rounded-lg text-xs font-mono border ${
                    promptMessage.type === 'success'
                      ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-950/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {promptMessage.type === 'success' ? '✓' : '⚠️'} {promptMessage.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={saveSystemPrompt}
                    disabled={promptSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-accent2 to-cyber-accent3 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center gap-2"
                  >
                    {promptSaving ? 'ĐANG LƯU...' : 'LƯU CẤU HÌNH'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {/* Browser Chart */}
            <div className="p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md relative overflow-hidden flex flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.02)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 self-start">
                <BarChart3 className="w-4 h-4 text-cyber-accent1" />
                THỐNG KÊ TRÌNH DUYỆT
              </h3>

              {browserData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500 text-xs font-mono uppercase">
                  Chưa có dữ liệu phân tích
                </div>
              ) : (
                <>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={browserData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {browserData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(2, 5, 14, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {browserData.map((data, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-1.5">
                        <span className="flex items-center gap-2 text-slate-400">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          {data.name}
                        </span>
                        <span className="text-white font-bold">{data.value} lượt</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* OS Chart */}
            <div className="p-6 rounded-2xl border border-white/5 bg-cyber-card backdrop-blur-md relative overflow-hidden flex flex-col items-center shadow-[0_0_15px_rgba(168,85,247,0.02)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 self-start">
                <BarChart3 className="w-4 h-4 text-cyber-accent2" />
                THỐNG KÊ HỆ ĐIỀU HÀNH
              </h3>

              {osData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500 text-xs font-mono uppercase">
                  Chưa có dữ liệu phân tích
                </div>
              ) : (
                <>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={osData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {osData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(2, 5, 14, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {osData.map((data, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-1.5">
                        <span className="flex items-center gap-2 text-slate-400">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          {data.name}
                        </span>
                        <span className="text-white font-bold">{data.value} lượt</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
