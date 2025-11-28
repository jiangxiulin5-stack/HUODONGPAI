import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, BarChart2, MessageSquare, 
  Type, Share2, MoreHorizontal, Sparkles, Users 
} from 'lucide-react';
import { SessionState, Slide, SlideType } from '../../types';
import { ResultVisualizer } from './ResultVisualizer';
import { generateSlideContent } from '../../services/geminiService';

interface PresenterDashboardProps {
  session: SessionState;
  updateSession: (newSession: SessionState) => void;
  onExit: () => void;
}

export const PresenterDashboard: React.FC<PresenterDashboardProps> = ({ session, updateSession, onExit }) => {
  const currentSlide = session.slides[session.currentSlideIndex];
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Calculate total responses for the current slide
  const totalResponses = React.useMemo(() => {
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
  }, [currentSlide]);

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
    
    const newSlide = await generateSlideContent(aiPrompt);
    
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
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top Bar - Simplified for "Presentation Mode" */}
      <header className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-4">
            <button onClick={onExit} className="text-slate-500 hover:text-slate-900 font-bold text-sm">
                退出演示
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">加入代码</span>
                <span className="text-xl font-bold text-slate-900 tracking-widest">{session.code}</span>
            </div>
        </div>
        
        <div className="flex items-center space-x-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                实时互动中
            </div>
             <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-6xl aspect-video bg-white shadow-2xl rounded-xl overflow-hidden relative">
             {/* Key ensures the component remounts and animates when slide changes */}
             <div key={currentSlide.id} className="w-full h-full animate-slide-enter">
                <ResultVisualizer slide={currentSlide} />
             </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20">
         <div className="flex items-center space-x-2">
            <button 
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
            >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI 提问</span>
            </button>
            <span className="text-sm text-slate-400 ml-2 hidden md:inline">
                Slide {session.currentSlideIndex + 1} / {session.slides.length}
            </span>
         </div>

         <div className="flex items-center space-x-4">
             <button 
                onClick={handlePrev}
                disabled={session.currentSlideIndex === 0}
                className="p-3 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
             >
                 <ChevronLeft className="w-6 h-6 text-slate-700" />
             </button>
             
             <div className="flex space-x-1">
                {session.slides.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all ${idx === session.currentSlideIndex ? 'bg-blue-600 w-4' : 'bg-slate-300'}`}
                    />
                ))}
             </div>

             <button 
                onClick={handleNext}
                disabled={session.currentSlideIndex === session.slides.length - 1}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
             >
                 <ChevronRight className="w-6 h-6" />
             </button>
         </div>

         <div className="flex items-center space-x-3 justify-end min-w-[140px]">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full" title="当前参与人数">
                <Users className="w-4 h-4" />
                <span className="font-bold text-sm">{totalResponses}</span>
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-600">
                 <MoreHorizontal className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* AI Generation Modal */}
      {showAiModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          AI 智能出题
                      </h3>
                      <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                      输入一个主题（例如“气候变化”或“团队建设”），AI 将自动为您生成一个互动投票幻灯片。
                  </p>
                  <input 
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="请输入主题..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                      {isGenerating ? (
                          <>
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           正在思考...
                          </>
                      ) : (
                          "生成幻灯片"
                      )}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};