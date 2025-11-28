import React, { useState } from 'react';
import { SessionState, Slide, SlideType } from '../../types';
import { CheckCircle2, Send } from 'lucide-react';

interface SlideInteractionProps {
  slide: Slide;
  onResponse: (slideId: string, value: string) => void;
}

// Inner component to handle state for a specific slide
// This allows us to use React keys to reset state automatically when slide changes
const SlideInteraction: React.FC<SlideInteractionProps> = ({ slide, onResponse }) => {
  const [hasResponded, setHasResponded] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (value: string) => {
    onResponse(slide.id, value);
    setHasResponded(true);
  };

  if (hasResponded) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">已提交！</h2>
        <p className="text-slate-600">请在大屏幕上查看结果，等待下一题。</p>
        
        <div className="mt-12 text-sm text-slate-400">
           正在等待演讲者切换...
        </div>
      </div>
    );
  }

  switch (slide.type) {
    case SlideType.POLL:
      return (
        <div className="flex flex-col space-y-4 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{slide.question}</h2>
          {slide.options?.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSubmit(opt.id)}
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl text-left text-lg font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 active:scale-[0.98] transition-all shadow-sm"
            >
              {opt.label}
            </button>
          ))}
        </div>
      );

    case SlideType.WORD_CLOUD:
    case SlideType.QNA:
      return (
        <div className="flex flex-col h-full animate-fade-in-up">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{slide.question}</h2>
          <p className="text-slate-500 mb-8 text-sm">
              {slide.type === SlideType.WORD_CLOUD ? '输入一个关键词' : '输入您的具体问题'}
          </p>
          
          <div className="relative">
              <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              maxLength={slide.type === SlideType.WORD_CLOUD ? 15 : 100}
              placeholder={slide.type === SlideType.WORD_CLOUD ? "例如：创新" : "输入问题..."}
              className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none bg-white shadow-inner min-h-[120px]"
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                  {textInput.length} / {slide.type === SlideType.WORD_CLOUD ? 15 : 100}
              </div>
          </div>

          <button
            onClick={() => handleSubmit(textInput)}
            disabled={!textInput.trim()}
            className="mt-6 w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
          >
            提交 <Send className="w-5 h-5" />
          </button>
        </div>
      );
    
    default:
      return <div>Unsupported slide type</div>;
  }
};

interface ParticipantViewProps {
  session: SessionState;
  onResponse: (slideId: string, value: string) => void;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({ session, onResponse }) => {
  const currentSlide = session.slides[session.currentSlideIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-center items-center sticky top-0 z-10">
         <span className="text-slate-400 text-xs font-mono tracking-widest">{session.code}</span>
      </div>

      <main className="flex-grow p-6 max-w-md mx-auto w-full">
         {/* Using key to force remount on slide change triggers animation and resets internal state */}
         <div key={currentSlide.id} className="w-full animate-slide-enter">
            <SlideInteraction slide={currentSlide} onResponse={onResponse} />
         </div>
      </main>

      <footer className="p-6 text-center text-xs text-slate-300">
        Powered by HuDong
      </footer>
    </div>
  );
};