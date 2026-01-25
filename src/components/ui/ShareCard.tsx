"use client";

import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Stars } from 'lucide-react';

interface ShareCardProps {
  content: string;
  authorName: string;
  date: string;
  moodTag?: string;
  moodIcon?: string;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ 
  content, 
  authorName, 
  date, 
  moodTag, 
  moodIcon 
}, ref) => {
  return (
    <div 
      ref={ref}
      className="fixed -left-[2000px] top-0 w-[750px] min-h-[1000px] bg-slate-950 text-slate-100 font-serif p-16 flex flex-col justify-between overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
      }}
    >
      {/* 背景装饰：模拟星光 */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              opacity: Math.random(),
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full gap-12">
        {/* 顶部区域：日期与情绪 */}
        <div className="flex justify-between items-center border-b border-white/10 pb-8">
          <div className="text-amber-200/60 tracking-[0.2em] text-lg font-sans">
            {date}
          </div>
          {moodTag && (
            <div className="flex items-center gap-2 bg-amber-300/10 px-4 py-2 rounded-full border border-amber-300/20 text-amber-200">
              <span className="text-xl">{moodIcon}</span>
              <span className="text-sm tracking-widest uppercase font-sans font-bold">{moodTag}</span>
            </div>
          )}
        </div>

        {/* 正文区域：黄金比例上部 2/3 */}
        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="relative">
            <span className="absolute -top-12 -left-8 text-8xl text-amber-300/10 font-serif">“</span>
            <p className="text-4xl md:text-5xl leading-[1.8] tracking-wide text-slate-100 text-shadow-starlight relative z-10">
              {content}
            </p>
            <span className="absolute -bottom-16 -right-8 text-8xl text-amber-300/10 font-serif">”</span>
          </div>
          
          <div className="mt-16 text-right">
            <cite className="text-amber-300/80 not-italic text-xl tracking-[0.3em] uppercase font-medium">
              — {authorName || "星空旅人"}
            </cite>
          </div>
        </div>

        {/* 底部品牌区 */}
        <div className="mt-auto pt-12 border-t border-white/10 flex justify-between items-end">
          <div className="space-y-4">
            <div className="text-3xl font-bold italic tracking-tighter text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
              MoodFlow
            </div>
            <p className="text-slate-400 font-sans tracking-widest text-base italic opacity-80">
              记录当下，在星河中留下回响
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-xl shadow-2xl">
            <QRCodeSVG 
              value={typeof window !== 'undefined' ? window.location.origin : 'https://moodflow.space'} 
              size={100}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;
