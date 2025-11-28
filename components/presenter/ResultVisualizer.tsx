import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slide, SlideType } from '../../types';

interface ResultVisualizerProps {
  slide: Slide;
}

const COLORS = ['#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

export const ResultVisualizer: React.FC<ResultVisualizerProps> = ({ slide }) => {
  
  if (slide.type === SlideType.POLL) {
    const data = slide.options || [];
    return (
      <div className="w-full h-full p-4 md:p-10 flex flex-col">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 text-center leading-tight">
          {slide.question}
        </h2>
        <div className="flex-grow w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#475569', fontSize: 14 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (slide.type === SlideType.WORD_CLOUD) {
    const words = slide.words || [];
    // Simple visual simulation of a word cloud without complex d3 physics for this demo
    // Sort by count to put big words in middle
    const sortedWords = [...words].sort((a, b) => b.count - a.count);
    
    return (
      <div className="w-full h-full p-4 md:p-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 text-center leading-tight">
          {slide.question}
        </h2>
        <div className="flex-grow w-full flex flex-wrap content-center justify-center gap-6 max-w-5xl relative">
            {sortedWords.map((word, idx) => {
                const size = Math.max(1, Math.min(5, word.count)); // Scale 1-5
                const fontSize = `${size * 1.5 + 1}rem`;
                const opacity = Math.min(1, 0.5 + (word.count / 10));
                
                return (
                    <span 
                        key={idx}
                        className="transition-all duration-1000 ease-out"
                        style={{ 
                            fontSize, 
                            color: COLORS[idx % COLORS.length],
                            fontWeight: word.count > 3 ? 800 : 500,
                            opacity,
                            transform: `rotate(${idx % 2 === 0 ? 0 : (Math.random() * 10 - 5)}deg)`
                        }}
                    >
                        {word.text}
                    </span>
                );
            })}
        </div>
      </div>
    );
  }

  if (slide.type === SlideType.QNA) {
      return (
        <div className="w-full h-full p-4 md:p-10 flex flex-col">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 text-center leading-tight">
            {slide.question}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-20">
                {slide.qnaEntries?.map((q, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start space-x-4 animate-fade-in-up">
                        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            Q
                        </div>
                        <p className="text-lg text-slate-800 font-medium">{q}</p>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  return <div>Unknown Slide Type</div>;
};