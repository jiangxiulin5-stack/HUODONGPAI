import React, { useState } from 'react';
import { Presentation, Users, ArrowRight, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onEnterStudent: (code: string) => void;
  onEnterTeacher: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterStudent, onEnterTeacher }) => {
  const [code, setCode] = useState('');

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onEnterStudent(code);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-2 text-blue-600">
          <BarChart3 className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900">互动派 | HuDong</span>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch justify-center p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Student Portal */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up group hover:shadow-2xl transition-all duration-300">
          <div className="h-2 bg-green-500 w-full"></div>
          <div className="p-8 md:p-12 flex flex-col items-center text-center flex-grow justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">我是参与者</h2>
            <p className="text-slate-500 mb-8 max-w-xs">
              输入屏幕上的代码加入互动，无需注册，即刻参与投票与问答。
            </p>
            
            <form onSubmit={handleCodeSubmit} className="w-full max-w-sm space-y-4">
              <input 
                type="text" 
                placeholder="输入代码 (如: 8816)" 
                className="w-full px-6 py-4 text-center text-xl font-mono tracking-widest border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all bg-slate-50 focus:bg-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                加入互动 <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Teacher Portal */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up group hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.1s' }}>
          <div className="h-2 bg-blue-600 w-full"></div>
          <div className="p-8 md:p-12 flex flex-col items-center text-center flex-grow justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Presentation className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">我是演讲者</h2>
            <p className="text-slate-500 mb-8 max-w-xs">
              创建投票、词云和问答环节。实时收集观众反馈，让演示更精彩。
            </p>
            
            <div className="w-full max-w-sm space-y-4">
              <button 
                onClick={onEnterTeacher}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                进入后台 <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-slate-400">
                支持 AI 辅助出题 • 实时大屏展示
              </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; 2024 HuDong Technology. 建议在大屏设备上打开“演讲者”端，手机打开“参与者”端。
      </footer>
    </div>
  );
};