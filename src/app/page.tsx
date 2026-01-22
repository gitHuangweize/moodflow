"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, LayoutGrid, PlusCircle, User, X, Sparkles, Send } from "lucide-react";
import StarryBackground from "@/components/ui/StarryBackground";

export default function Home() {
  const [viewMode, setViewMode] = useState<"random" | "feed">("random");
  const [mounted, setMounted] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedContent, setPolishedContent] = useState("");
  const [currentPost, setCurrentPost] = useState<{ content: string; authorName?: string; moodTag?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 用于控制翻书动画的方向，虽然目前主要是单向换，但保留扩展性
  const [direction, setDirection] = useState(1);

  const fetchRandomPost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setDirection(1); // 每次点击都向右翻
    try {
      const res = await fetch("/api/v1/posts/random");
      if (res.ok) {
        const data = await res.json();
        // 稍微延迟一下以展示动画效果
        setTimeout(() => {
          setCurrentPost({
            content: data.content,
            authorName: data.author?.name || "匿名",
            moodTag: data.moodTag,
          });
          setIsLoading(false);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRandomPost();
  }, []);

  const handlePolish = async () => {
    if (!content) return;
    setIsPolishing(true);
    // 模拟 AI 润色延迟
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPolishedContent(content + " (AI 润色后的版本：让文字更有诗意...)");
    setIsPolishing(false);
  };

  if (!mounted) return null;

  // 翻书动画变体
  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // iOS style spring-like ease
      },
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div className="min-h-screen text-slate-100 font-serif overflow-hidden selection:bg-amber-200/30">
      <StarryBackground />
      
      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-2xl font-bold italic tracking-tighter cursor-pointer text-amber-100/90 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:text-amber-200 transition-colors" onClick={() => window.location.reload()}>MoodFlow</div>
        <div className="flex gap-6 items-center bg-slate-900/30 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl border border-white/10 ring-1 ring-white/5">
          <button
            onClick={() => setViewMode("random")}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              viewMode === "random" ? "bg-amber-200/90 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110" : "hover:bg-white/10 text-slate-400 hover:text-slate-100"
            }`}
            title="沉浸模式"
          >
            <Shuffle size={18} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setViewMode("feed")}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              viewMode === "feed" ? "bg-amber-200/90 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110" : "hover:bg-white/10 text-slate-400 hover:text-slate-100"
            }`}
            title="卡片瀑布流"
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button 
            onClick={() => setIsComposeOpen(true)}
            className="p-2.5 hover:bg-white/10 rounded-full transition-all text-amber-200/80 hover:text-amber-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
          >
            <PlusCircle size={20} strokeWidth={2} />
          </button>
          <button className="p-2.5 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-slate-100">
            <User size={20} strokeWidth={2} />
          </button>
        </div>
      </nav>

      {/* 主体内容 */}
      <main className="relative h-screen flex flex-col items-center justify-center perspective-[2000px]">
        <AnimatePresence mode="wait" custom={direction}>
          {viewMode === "random" ? (
            <motion.div
              key={currentPost?.content || "loading"}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-4xl w-full px-8 text-center"
            >
              {/* 核心玻璃容器 */}
              <div className="relative group cursor-pointer bg-white/5 backdrop-blur-2xl p-16 md:p-24 rounded-[3rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] hover:border-white/20 transition-all duration-700 hover:shadow-[0_20px_50px_0_rgba(0,0,0,0.4)]">
                {/* 装饰性角标 */}
                <div className="absolute top-8 left-8 text-amber-200/20">
                  <Sparkles size={24} />
                </div>
                <div className="absolute bottom-8 right-8 text-amber-200/20 rotate-180">
                  <Sparkles size={24} />
                </div>

                <blockquote className={`font-serif text-3xl md:text-5xl leading-[1.6] md:leading-[1.5] text-slate-100 tracking-wide drop-shadow-lg ${isLoading ? "blur-sm opacity-50" : ""} transition-all duration-500`}>
                  “{currentPost?.content || "正在从星空中拾取..."}”
                </blockquote>
                
                <cite className="mt-12 block text-amber-200/70 not-italic text-sm md:text-base tracking-[0.3em] uppercase font-medium">
                  — {currentPost?.authorName || "MOODFLOW"}
                </cite>
              </div>
              
              <div className="mt-20">
                <button 
                  onClick={fetchRandomPost}
                  disabled={isLoading}
                  className="group relative flex items-center gap-3 mx-auto px-8 py-3.5 bg-amber-200/10 hover:bg-amber-200/20 text-amber-100 rounded-full border border-amber-200/30 hover:border-amber-200/50 transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Shuffle size={18} className={`${isLoading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`} />
                  <span className="font-medium tracking-[0.1em] text-sm">换一个</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full pt-32 overflow-y-auto px-4 md:px-8 custom-scrollbar"
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-lg hover:border-amber-200/20 hover:bg-white/10 transition-all duration-500 group cursor-pointer">
                    <p className="text-lg text-slate-200/90 leading-relaxed mb-6 group-hover:text-slate-100 transition-colors font-serif tracking-wide">
                      这是一条模拟的心得文字。在这个瞬息万变的世界里，找到一处安静的角落，记录下当下的感受。
                    </p>
                    <div className="flex justify-between items-center text-xs text-amber-200/50 font-medium tracking-wider">
                      <span className="bg-amber-200/5 px-3 py-1 rounded-full group-hover:bg-amber-200/10 transition-colors"># 感悟</span>
                      <span>2小时前</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 发布对话框 */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposeOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-amber-100 italic tracking-wider">记录当下</h3>
                <button 
                  onClick={() => setIsComposeOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="此刻，你在想什么..."
                  className="w-full h-48 p-6 bg-black/20 rounded-3xl border border-white/5 focus:border-amber-200/30 focus:bg-black/40 focus:ring-0 resize-none text-lg text-slate-100 placeholder:text-slate-600 transition-all font-serif tracking-wide leading-relaxed"
                />
                
                <AnimatePresence>
                  {polishedContent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-6 bg-amber-200/5 border border-amber-200/10 text-amber-100/90 rounded-3xl text-base italic overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-3 font-bold text-amber-200/80 text-sm tracking-widest uppercase">
                        <Sparkles size={14} /> AI 润色建议
                      </div>
                      <p className="font-serif leading-relaxed">{polishedContent}</p>
                      <button 
                        onClick={() => {
                          setContent(polishedContent);
                          setPolishedContent("");
                        }}
                        className="mt-4 text-xs font-bold underline decoration-1 underline-offset-4 hover:text-amber-300 transition-colors block tracking-wider opacity-70 hover:opacity-100"
                      >
                        采用建议
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={handlePolish}
                    disabled={!content || isPolishing}
                    className="flex items-center gap-2 px-5 py-2.5 text-amber-200/60 hover:text-amber-200 hover:bg-amber-200/5 rounded-full transition-all disabled:opacity-30 text-sm font-medium tracking-wide"
                  >
                    <Sparkles size={16} className={isPolishing ? "animate-spin" : ""} />
                    <span>{isPolishing ? "星尘聚拢中..." : "AI 润色"}</span>
                  </button>
                  <button
                    disabled={!content}
                    className="flex items-center gap-2 px-8 py-3 bg-amber-200 text-slate-900 rounded-full hover:bg-amber-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] font-bold tracking-widest disabled:opacity-30 disabled:hover:scale-100 text-sm"
                  >
                    <Send size={16} />
                    <span>发布</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
