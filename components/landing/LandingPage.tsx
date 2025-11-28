import React, { useState } from 'react';
import { Presentation, Users, ArrowRight, BarChart3, MonitorPlay, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center space-x-2 text-indigo-600">
          <div className="p-2 bg-indigo-50 rounded-lg">
             <BarChart3 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">互动派 | HuDong</span>
        </div>
        <div className="text-sm text-slate-500 font-medium">
            v1.0.0
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row items-stretch justify-center p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Student Portal - Mobile Friendly Style */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>
          
          <div className="p-8 md:p-12 flex flex-col items-center text-center flex-grow justify-center z-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">我是参与者</h2>
            <p className="text-slate-500 mb-8 max-w-xs text-sm">
              无需注册，输入代码立即加入互动
            </p>
            
            <form onSubmit={handleCodeSubmit} className="w-full max-w-sm space-y-4">
              <div className="relative">
                  <input 
                    type="text" 
                    placeholder="8816" 
                    className="w-full px-6 py-5 text-center text-2xl font-mono font-bold tracking-[0.2em] border-2 border-slate-100 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-slate-50 focus:bg-white placeholder:text-slate-200 text-slate-800"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-[0.98]"
              >
                加入互动 <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          {/* Decorative Blob */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
        </div>

        {/* Teacher Portal - Admin Style */}
        <div className="flex-1 bg-slate-900 rounded-3xl shadow-xl shadow-slate-900/20 border border-slate-800 overflow-hidden flex flex-col animate-fade-in-up group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="p-8 md:p-12 flex flex-col items-center text-center flex-grow justify-center z-10 relative">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-slate-700">
              <Presentation className="w-10 h-10 text-blue-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">我是演讲者</h2>
            <p className="text-slate-400 mb-8 max-w-xs text-sm">
              创建投票、词云，实时掌控全场节奏
            </p>
            
            <div className="w-full max-w-sm space-y-4">
              <button 
                onClick={onEnterTeacher}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                进入控制台 <MonitorPlay className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-4">
                 <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI 辅助</span>
                 <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                 <span>实时图表</span>
                 <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                 <span>数据导出</span>
              </div>
            </div>
          </div>

          {/* Decorative Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[80px] pointer-events-none"></div>
        </div>

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; 2024 HuDong Technology. 
        <span className="mx-2 opacity-50">|</span>
        建议演讲者使用电脑，参与者使用手机访问
      </footer>
    </div>
  );
};