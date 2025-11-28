import React, { useState } from 'react';
import { Presentation, Users, BarChart3, ArrowRight, Smartphone, Zap } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-blue-600">
          <BarChart3 className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900">互动派 | HuDong</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">功能特色</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">解决方案</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">价格方案</a>
          <button 
            onClick={onEnterTeacher}
            className="text-slate-600 font-medium hover:text-blue-600"
          >
            登录
          </button>
          <button 
            onClick={onEnterTeacher}
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            免费注册
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-24 max-w-7xl mx-auto w-full gap-12">
        
        {/* Left: Participation (Student Focus) */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight text-center md:text-left">
            让每一次演示<br />
            <span className="text-blue-600">都充满互动</span>
          </h1>
          <p className="text-lg text-slate-600 text-center md:text-left max-w-lg">
            无需下载安装，听众通过手机即可实时投票、提问。数千万教师和演讲者的选择。
          </p>

          <div className="w-full max-w-md bg-white p-2 rounded-xl shadow-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder="输入会议代码 (例如: 8816 2024)" 
              className="flex-grow px-4 py-3 text-lg outline-none rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-center sm:text-left"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button 
              onClick={handleCodeSubmit}
              className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              加入互动 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-400">无需注册，直接加入</p>
        </div>

        {/* Right: Visual Mockup */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
             {/* Mock Chart */}
             <div className="flex justify-between items-end h-64 space-x-4 px-4 pb-4 border-b border-slate-100">
                <div className="w-16 bg-blue-200 rounded-t-lg h-[40%] relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">40%</div>
                </div>
                <div className="w-16 bg-blue-400 rounded-t-lg h-[70%] relative group">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">70%</div>
                </div>
                <div className="w-16 bg-blue-600 rounded-t-lg h-[90%] relative group">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">90%</div>
                </div>
                <div className="w-16 bg-indigo-500 rounded-t-lg h-[55%] relative group">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">55%</div>
                </div>
             </div>
             <div className="pt-4 flex justify-between text-slate-500 font-medium text-sm">
                <span>选项 A</span>
                <span>选项 B</span>
                <span>选项 C</span>
                <span>选项 D</span>
             </div>
          </div>
          
          {/* Floating Mobile Mockup */}
          <div className="absolute -bottom-10 -left-10 w-48 bg-slate-900 rounded-3xl p-3 shadow-2xl transform -rotate-6 border-4 border-slate-800">
            <div className="bg-white rounded-2xl h-64 flex flex-col items-center justify-center p-4">
               <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                 <Smartphone className="text-white w-6 h-6" />
               </div>
               <p className="text-slate-900 font-bold mb-1">投票成功!</p>
               <p className="text-xs text-slate-500 text-center">感谢您的参与</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Strip */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col items-center text-center p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">全员参与</h3>
              <p className="text-slate-600">无论是线下课堂还是远程会议，每个人都能通过手机轻松发声。</p>
           </div>
           <div className="flex flex-col items-center text-center p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">实时数据</h3>
              <p className="text-slate-600">投票结果实时生成精美图表，让数据可视化变得前所未有的简单。</p>
           </div>
           <div className="flex flex-col items-center text-center p-6 hover:bg-white hover:shadow-lg rounded-xl transition-all">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Presentation className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">丰富题型</h3>
              <p className="text-slate-600">包含多选投票、词云、开放问答、测验等多种互动形式。</p>
           </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-8 text-center text-slate-400 text-sm border-t border-slate-100">
        <p>&copy; 2024 HuDong Technology. All rights reserved. | 隐私政策 | 服务条款</p>
      </footer>
    </div>
  );
};