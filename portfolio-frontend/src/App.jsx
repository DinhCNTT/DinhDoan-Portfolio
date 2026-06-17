import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090b] via-[#0f172a] to-[#09090b] text-[#f8fafc] flex flex-col items-center justify-center p-6 select-none font-sans">
      <div className="max-w-xl text-center space-y-6">
        {/* Accent logo */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
          <span className="text-3xl">👨‍💻</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans">
          Dinh Doan <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Portfolio</span>
        </h1>

        <p className="text-[#94a3b8] text-lg max-w-md mx-auto leading-relaxed">
          Đang xây dựng Hệ thống Portfolio AI-Powered Fullstack (.NET 9, React 19, Supabase pgvector & SignalR).
        </p>

        <div className="flex justify-center gap-4">
          <span className="px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-sm font-medium">
            .NET 9 Clean Architecture
          </span>
          <span className="px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-300 text-sm font-medium">
            React 19 + Tailwind
          </span>
        </div>

        <div className="pt-4">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#a855f7] to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-md shadow-purple-500/10 transition-all hover:scale-105 duration-300 active:scale-95">
            Duyệt qua Kế hoạch dự án ⚡
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
