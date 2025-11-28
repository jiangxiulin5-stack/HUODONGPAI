import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Sparkles, Users, 
  Share2, MoreHorizontal, MonitorPlay, X,
  BarChart3, Cloud, MessageCircle
} from 'lucide-react';
import { SessionState, SlideType } from '../../types';
import { ResultVisualizer } from './ResultVisualizer';
import { generateSlideContent } from '../../services/geminiService';

interface PresenterDashboardProps {
  session: SessionState;
  updateSession: (newSession: SessionState) => void;
  onExit: () => void;
}

export const PresenterDashboard: React.FC<PresenterDashboardProps> = ({ session, updateSession, onExit }) => {
  const currentSlide = session.slides[session.currentSlideIndex];
  
  // AI Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedAiType, setSelectedAiType] = useState<SlideType>(SlideType.POLL);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate total responses for the current slide
  const totalResponses = (() => {
    if (!currentSlide) return 0;
    switch (currentSlide.type) {
        case SlideType.POLL:
            return currentSlide.options?.reduce((acc, opt) => acc + opt.count, 0) || 0;
        case SlideType.WORD_CLOUD:
            return currentSlide.words?.reduce((acc, word) => acc + word.count, 0) || 0;
        case SlideType.QNA:
            return currentSlide.qnaEntries?.length || 0;
        default:
            return 0;
    }
  })();

  const handleNext = () => {
    if (session.currentSlideIndex < session.slides.length - 1) {
      updateSession({
        ...session,
        currentSlideIndex: session.currentSlideIndex + 1
      });
    }
  };

  const handlePrev = () => {
    if (session.currentSlideIndex > 0) {
      updateSession({
        ...session,
        currentSlideIndex: session.currentSlideIndex - 1
      });
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    // Call service with specific type
    const newSlide = await generateSlideContent(aiPrompt, selectedAiType);
    
    updateSession({
      ...session,
      slides: [...session.slides, newSlide],
      currentSlideIndex: session.slides.length // Jump to new slide
    });
    
    setIsGenerating(false);
    setShowAiModal(false);
    setAiPrompt('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Bar - Dark Transparent */}
      <header className="px-6 py-4 flex items-center justify-between shrink-0 z-20 bg-slate-900/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-6">
            <button 
                onClick={onExit} 
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
            >
                <div className="p-1 rounded-md group-hover:bg-white/10">
                    <X className="w-4 h-4" />
                </div>
                <span>结束演示</span>
            </button>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">加入代码</span>
                <span className="text-xl font-bold text-white tracking-widest font-mono">{session.code}</span>
            </div>
        </div>
        
        <div className="flex items-center space-x-3">
            <div className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse shadow-[0_0_8px_currentColor]"></span>
                LIVE
            </div>
             <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Main Content Area - Cinema Mode */}
      <main className="flex-grow relative overflow-hidden flex items-center justify-center p-6 md:p-12">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
        
        {/* Slide Projector Screen */}
        <div className="w-full max-w-6xl aspect-video bg-white shadow-2xl rounded-xl overflow-hidden relative z-10 ring-1 ring-white/10">
             {/* Key ensures the component remounts and animates when slide changes */}
             <div key={currentSlide.id} className="w-full h-full animate-slide-enter">
                <ResultVisualizer slide={currentSlide} />
             </div>
        </div>
      </main>

      {/* Bottom Control Dock - Floating */}
      <div className="pb-8 px-6 flex justify-center shrink-0 z-20">
         <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 max-w-4xl w-full justify-between">
             
             {/* Left Controls */}
             <div className="flex items-center gap-3">
                <button 
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 hover:text-purple-200 transition-all border border-purple-500/30"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium text-sm">AI 出题</span>
                </button>
                <span className="text-xs text-slate-500 font-mono">
                    {session.currentSlideIndex + 1} / {session.slides.length}
                </span>
             </div>

             {/* Center Navigation */}
             <div className="flex items-center gap-4">
                 <button 
                    onClick={handlePrev}
                    disabled={session.currentSlideIndex === 0}
                    className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                 >
                     <ChevronLeft className="w-6 h-6" />
                 </button>
                 
                 {/* Progress Dots */}
                 <div className="flex space-x-1.5 items-center">
                    {session.slides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`rounded-full transition-all duration-300 ${
                                idx === session.currentSlideIndex 
                                ? 'bg-blue-500 w-6 h-2 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                                : 'bg-slate-600 w-2 h-2 hover:bg-slate-500 cursor-pointer'
                            }`}
                            onClick={() => updateSession({...session, currentSlideIndex: idx})}
                        />
                    ))}
                 </div>

                 <button 
                    onClick={handleNext}
                    disabled={session.currentSlideIndex === session.slides.length - 1}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:hover:bg-blue-600 disabled:shadow-none transition-all active:scale-95"
                 >
                     <ChevronRight className="w-6 h-6" />
                 </button>
             </div>

             {/* Right Info */}
             <div className="flex items-center gap-4">
                 <div key={totalResponses} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full shadow-[0_2px_8px_rgba(59,130,246,0.2)] animate-slide-enter" title="当前参与人数">
                    <Users className="w-4 h-4" />
                    <span className="font-bold text-sm">{totalResponses} 人参与</span>
                 </div>
                 
                 <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                     <MoreHorizontal className="w-5 h-5" />
                 </button>
             </div>
         </div>
      </div>

      {/* AI Generation Modal - Enhanced */}
      {showAiModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          AI 智能出题
                      </h3>
                      <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                  </div>

                  {/* Type Selection */}
                  <div className="mb-6">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 block">选择互动类型</label>
                      <div className="grid grid-cols-3 gap-3">
                          <button 
                            onClick={() => setSelectedAiType(SlideType.POLL)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedAiType === SlideType.POLL ? 'bg-purple-600/20 border-purple-500 text-purple-200' : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700'}`}
                          >
                              <BarChart3 className="w-6 h-6" />
                              <span className="text-xs font-medium">投票</span>
                          </button>
                          <button 
                            onClick={() => setSelectedAiType(SlideType.WORD_CLOUD)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedAiType === SlideType.WORD_CLOUD ? 'bg-purple-600/20 border-purple-500 text-purple-200' : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700'}`}
                          >
                              <Cloud className="w-6 h-6" />
                              <span className="text-xs font-medium">词云</span>
                          </button>
                          <button 
                            onClick={() => setSelectedAiType(SlideType.QNA)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedAiType === SlideType.QNA ? 'bg-purple-600/20 border-purple-500 text-purple-200' : 'bg-slate-700/50 border-transparent text-slate-400 hover:bg-slate-700'}`}
                          >
                              <MessageCircle className="w-6 h-6" />
                              <span className="text-xs font-medium">问答</span>
                          </button>
                      </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 block">
                        输入主题
                    </label>
                    <input 
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={
                            selectedAiType === SlideType.POLL ? "例如：2024年团队建设目的地..." :
                            selectedAiType === SlideType.WORD_CLOUD ? "例如：你对新产品的印象..." :
                            "例如：关于未来战略的讨论..."
                        }
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none placeholder-slate-600"
                        autoFocus
                    />
                  </div>

                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98]"
                  >
                      {isGenerating ? (
                          <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           正在构思中...
                          </>
                      ) : (
                          "立即生成"
                      )}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};