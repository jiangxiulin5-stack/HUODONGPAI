import React, { useState } from 'react';
import { SessionState, Slide, SlideType } from '../../types';
import { CheckCircle2, Send, Coffee, Hourglass } from 'lucide-react';

interface SlideInteractionProps {
  slide: Slide;
  onResponse: (slideId: string, value: string) => void;
}

// Inner component to handle state for a specific slide
const SlideInteraction: React.FC<SlideInteractionProps> = ({ slide, onResponse }) => {
  const [hasResponded, setHasResponded] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (value: string) => {
    onResponse(slide.id, value);
    setHasResponded(true);
  };

  if (hasResponded) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">已提交！</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          请注视大屏幕查看实时结果。
        </p>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-sm animate-pulse">
           <Hourglass className="w-4 h-4" />
           <span>等待下一题...</span>
        </div>
      </div>
    );
  }

  switch (slide.type) {
    case SlideType.POLL:
      return (
        <div className="flex flex-col space-y-4 animate-fade-in-up pb-8">
          <div className="mb-4">
             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">投票</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">{slide.question}</h2>
          <div className="space-y-3 mt-4">
            {slide.options?.map((opt) => (
                <button
                key={opt.id}
                onClick={() => handleSubmit(opt.id)}
                className="w-full p-5 bg-white border border-slate-200 rounded-xl text-left text-lg font-medium text-slate-700 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:bg-blue-50/50 active:scale-[0.98] transition-all shadow-sm group flex justify-between items-center"
                >
                <span>{opt.label}</span>
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 group-hover:bg-blue-500/20"></div>
                </button>
            ))}
          </div>
        </div>
      );

    case SlideType.WORD_CLOUD:
    case SlideType.QNA:
      return (
        <div className="flex flex-col h-full animate-fade-in-up pb-8">
          <div className="mb-4">
             <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${slide.type === SlideType.WORD_CLOUD ? 'text-purple-600 bg-purple-50' : 'text-orange-600 bg-orange-50'}`}>
                {slide.type === SlideType.WORD_CLOUD ? '词云' : '问答'}
             </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-snug">{slide.question}</h2>
          <p className="text-slate-500 mb-8 text-sm">
              {slide.type === SlideType.WORD_CLOUD ? '用一个词表达你的想法' : '畅所欲言，提出你的疑问'}
          </p>
          
          <div className="relative group">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                maxLength={slide.type === SlideType.WORD_CLOUD ? 15 : 100}
                placeholder={slide.type === SlideType.WORD_CLOUD ? "输入关键词..." : "输入内容..."}
                className="w-full p-5 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white shadow-sm min-h-[140px] transition-all placeholder:text-slate-300 resize-none"
              />
              <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-300 group-focus-within:text-blue-400">
                  {textInput.length} / {slide.type === SlideType.WORD_CLOUD ? 15 : 100}
              </div>
          </div>

          <button
            onClick={() => handleSubmit(textInput)}
            disabled={!textInput.trim()}
            className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            提交 <Send className="w-5 h-5" />
          </button>
        </div>
      );
    
    default:
      return <div>不支持的题型</div>;
  }
};

interface ParticipantViewProps {
  session: SessionState;
  onResponse: (slideId: string, value: string) => void;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({ session, onResponse }) => {
  const currentSlide = session.slides[session.currentSlideIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Mobile Header - Sticky */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">互动进行中</span>
         </div>
         <span className="text-slate-900 font-mono font-bold text-sm bg-slate-100 px-2 py-1 rounded">#{session.code}</span>
      </div>

      <main className="flex-grow p-6 max-w-md mx-auto w-full flex flex-col">
         {/* Using key to force remount on slide change triggers animation and resets internal state */}
         <div key={currentSlide.id} className="w-full animate-slide-enter flex-grow">
            <SlideInteraction slide={currentSlide} onResponse={onResponse} />
         </div>
      </main>

      <footer className="p-6 text-center text-xs text-slate-300">
        <div className="flex items-center justify-center gap-1">
            <span>Powered by</span> 
            <span className="font-bold text-slate-400">HuDong</span>
        </div>
      </footer>
    </div>
  );
};