"use client";
import Link from 'next/link';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Shuffle, LayoutGrid, PlusCircle, User, X, Sparkles, Send, Heart, LogOut, LogIn, Stars, MessageSquare } from "lucide-react";
import StarryBackground from "@/components/ui/StarryBackground";
import AuthGuardModal from "@/components/ui/AuthGuardModal";
import UserStatus from "@/components/ui/UserStatus";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function Home() {
  const { data: session } = useSession();
  const { requireAuth, isAuthModalOpen, setIsAuthModalOpen } = useRequireAuth();
  const [viewMode, setViewMode] = useState<"random" | "feed">("random");
  const [mounted, setMounted] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedContent, setPolishedContent] = useState("");
  const [currentPost, setCurrentPost] = useState<{ id: string; content: string; authorName?: string; moodTag?: string; likesCount: number; commentsCount?: number } | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [direction, setDirection] = useState(1);

  const handlePublish = async () => {
    if (!content) return;
    
    requireAuth(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/v1/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            moodTag: "感悟",
            isPrivate: false,
          }),
        });
        if (res.ok) {
          setContent("");
          setPolishedContent("");
          setIsComposeOpen(false);
          fetchRandomPost();
        }
      } catch (error) {
        console.error("Failed to publish:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const [posts, setPosts] = useState<any[]>([]);
  const fetchFeed = async () => {
    try {
      const res = await fetch("/api/v1/posts/me");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    }
  };

  useEffect(() => {
    if (viewMode === "feed") {
      fetchFeed();
    }
  }, [viewMode]);

  const fetchComments = async (postId: string) => {
    setIsLoadingComments(true);
    try {
      const res = await fetch(`/api/v1/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentContent || !currentPost) return;

    requireAuth(async () => {
      setIsSubmittingComment(true);
      try {
        const res = await fetch(`/api/v1/posts/${currentPost.id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentContent }),
        });
        if (res.ok) {
          setCommentContent("");
          fetchComments(currentPost.id);
          // 局部更新评论数
          setCurrentPost({
            ...currentPost,
            commentsCount: (currentPost.commentsCount || 0) + 1
          });
        }
      } catch (error) {
        console.error("Failed to post comment:", error);
      } finally {
        setIsSubmittingComment(false);
      }
    });
  };

  const fetchRandomPost = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setDirection(1); 
    try {
      const res = await fetch("/api/v1/posts/random");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setTimeout(() => {
            setCurrentPost({
              id: data.id,
              content: data.content,
              authorName: data.author?.name || "匿名",
              moodTag: data.moodTag,
              likesCount: data._count?.likes || 0,
              commentsCount: data._count?.comments || 0,
            });
            setComments([]); // 清空旧评论
            setIsCommentsOpen(false); // 切换帖子时关闭评论框
            setIsLoading(false);
          }, 300);
        } else {
          setCurrentPost(null);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (isLiking) return;
    
    requireAuth(async () => {
      setIsLiking(true);
      try {
        const res = await fetch(`/api/v1/posts/${postId}/like`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (currentPost && currentPost.id === postId) {
            setCurrentPost({ ...currentPost, likesCount: data.count });
          }
        }
      } catch (error) {
        console.error("Failed to like:", error);
      } finally {
        setTimeout(() => setIsLiking(false), 600);
      }
    });
  };

  useEffect(() => {
    setMounted(true);
    fetchRandomPost();
  }, []);

  const handlePolish = async () => {
    if (!content || isPolishing) return;
    setIsPolishing(true);
    setPolishedContent("");
    try {
      const res = await fetch("/api/v1/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setPolishedContent(data.refinedContent);
      }
    } catch (error) {
      console.error("Failed to polish content:", error);
    } finally {
      setIsPolishing(false);
    }
  };

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
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], 
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-slate-100 font-serif overflow-hidden selection:bg-amber-200/30">
      <StarryBackground />
      
      <nav className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-[110] bg-slate-950/20 backdrop-blur-sm">
        <div 
          className="text-xl md:text-2xl font-bold italic tracking-tighter cursor-pointer text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] hover:text-amber-200 transition-all"
          onClick={() => window.location.reload()}
        >
          MoodFlow
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 items-center bg-slate-900/30 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl border border-white/10 ring-1 ring-white/5">
            <button onClick={() => setViewMode("random")} className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === "random" ? "bg-amber-300 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110" : "hover:bg-white/10 text-slate-400 hover:text-slate-100"}`} title="沉浸模式"><Shuffle size={18} strokeWidth={2.5} /></button>
            <button onClick={() => setViewMode("feed")} className={`p-2.5 rounded-full transition-all duration-300 ${viewMode === "feed" ? "bg-amber-300 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110" : "hover:bg-white/10 text-slate-400 hover:text-slate-100"}`} title="卡片瀑布流"><LayoutGrid size={18} strokeWidth={2.5} /></button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button onClick={() => setIsComposeOpen(true)} className="p-2.5 hover:bg-white/10 rounded-full transition-all text-amber-200/80 hover:text-amber-300 hover:scale-110"><PlusCircle size={20} /></button>
          </div>
          
          <UserStatus onLoginClick={() => setIsAuthModalOpen(true)} />
        </div>
      </nav>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden">
        <div className="flex gap-6 items-center px-6 py-3 bg-slate-900/40 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
          <button onClick={() => setViewMode("random")} className={`p-2 rounded-full transition-all ${viewMode === "random" ? "text-amber-300 scale-110" : "text-slate-400"}`}><Shuffle size={20} /></button>
          <button 
            onClick={() => requireAuth(() => setIsComposeOpen(true))} 
            className="p-3 bg-amber-300 text-slate-900 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle size={24} />
          </button>
          <button onClick={() => setViewMode("feed")} className={`p-2 rounded-full transition-all ${viewMode === "feed" ? "text-amber-300 scale-110" : "text-slate-400"}`}><LayoutGrid size={20} /></button>
        </div>
      </nav>

      <main className="relative h-screen flex flex-col items-center justify-center perspective-[2000px] px-4 md:px-0">
        <AnimatePresence mode="wait" custom={direction}>
          {viewMode === "random" ? (
            <div key="random-container" className="relative z-10 w-full max-w-4xl px-4 md:px-6 py-12 text-center">
              <AnimatePresence mode="wait">
                {!currentPost && !isLoading ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center space-y-8 py-20"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          opacity: [0.2, 0.5, 0.2],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 blur-3xl bg-amber-300/20 rounded-full"
                      />
                      <Stars size={80} className="text-amber-200/40 relative z-10" strokeWidth={1} />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-amber-100/80">
                        这片星空暂时寂静
                      </h2>
                      <p className="text-slate-400 font-sans tracking-widest text-sm md:text-base">
                        快去投递你的第一枚星光吧
                      </p>
                    </div>
                    <button
                      onClick={() => setIsComposeOpen(true)}
                      className="mt-8 px-10 py-4 bg-amber-300/10 hover:bg-amber-300/20 text-amber-200 rounded-full border border-amber-300/30 transition-all group overflow-hidden relative"
                    >
                      <span className="relative z-10 flex items-center gap-3 font-bold tracking-[0.2em]">
                        <PlusCircle size={20} /> 点亮星辰
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentPost?.id || "loading"}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="max-w-4xl w-full text-center relative"
                  >
                    <div 
                      className="absolute inset-y-0 -left-20 w-40 cursor-w-resize z-10 hidden lg:block" 
                      onClick={(e) => { e.stopPropagation(); fetchRandomPost(); }} 
                      title="上一页"
                    />
                    <div 
                      className="absolute inset-y-0 -right-20 w-40 cursor-e-resize z-10 hidden lg:block" 
                      onClick={(e) => { e.stopPropagation(); fetchRandomPost(); }} 
                      title="下一页"
                    />

                    <div 
                      className="relative group cursor-pointer glass-card p-8 md:p-24 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-700 overflow-hidden"
                      onClick={() => fetchRandomPost()}
                    >
                      {isLoading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                          <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.3, 1, 0.3],
                                  boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 20px rgba(251,191,36,0.5)", "0 0 0px rgba(251,191,36,0)"]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                                className="w-3 h-3 bg-amber-300 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <blockquote className={`font-serif text-xl md:text-5xl leading-relaxed text-slate-100 tracking-wide text-shadow-starlight ${isLoading ? "blur-md opacity-20" : ""} transition-all duration-500`}>
                        “{currentPost?.content || "正在从星空中拾取..."}”
                      </blockquote>
                      
                      <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                        <cite className="text-amber-300/70 not-italic text-sm md:text-base tracking-[0.3em] uppercase font-medium">
                          — {currentPost?.authorName || "MOODFLOW"}
                        </cite>
                        
                        {currentPost && (
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleLike(currentPost.id); }}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                            >
                              <motion.div
                                animate={isLiking ? { scale: [1, 1.5, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] } : {}}
                                transition={{ duration: 0.5 }}
                                className={isLiking ? "text-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.5)]" : "text-slate-400 group-hover:text-rose-400"}
                              >
                                <Heart size={20} fill={isLiking ? "currentColor" : "none"} />
                              </motion.div>
                              <span className="text-sm font-sans text-slate-400">{currentPost.likesCount}</span>
                            </button>

                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setIsCommentsOpen(!isCommentsOpen);
                                if (!isCommentsOpen) fetchComments(currentPost.id);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                            >
                              <MessageSquare size={20} className="text-slate-400 group-hover:text-amber-300" />
                              <span className="text-sm font-sans text-slate-400">{currentPost.commentsCount || 0}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 评论区内嵌在卡片内 */}
                      <AnimatePresence>
                        {isCommentsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-12 text-left pt-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="relative flex items-center mb-10 group/input">
                              <input 
                                type="text"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="写下你的共鸣..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-amber-300/30 text-sm transition-all placeholder:text-slate-600"
                                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                              />
                              <button 
                                onClick={handlePostComment}
                                disabled={isSubmittingComment || !commentContent}
                                className="absolute right-4 p-2 text-amber-300/60 hover:text-amber-300 transition-all disabled:opacity-0"
                                title="发送评论"
                              >
                                {isSubmittingComment ? (
                                  <div className="w-5 h-5 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                                ) : (
                                  <Send size={18} />
                                )}
                              </button>
                            </div>

                            <div className="space-y-8 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                              {isLoadingComments ? (
                                <div className="text-center py-8 text-slate-500 text-sm animate-pulse">星尘感应中...</div>
                              ) : comments.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-sm italic tracking-widest opacity-60">暂无回响，成为第一个触碰这颗星的人</div>
                              ) : (
                                comments.map((comment) => (
                                  <div key={comment.id} className="group/item">
                                    <div className="flex items-start gap-4">
                                      <div className="w-9 h-9 rounded-full border border-amber-300/20 overflow-hidden shrink-0 shadow-lg">
                                        {comment.author?.image ? (
                                          <img src={comment.author.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-200">
                                            <User size={16} />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-2">
                                          <span className="text-[13px] font-bold text-amber-200/80 tracking-wide">{comment.author?.name || "匿名星友"}</span>
                                          <span className="text-[10px] text-slate-500 font-sans">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-[1.8] tracking-wide break-words">{comment.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="mt-12 md:mt-20">
                      <button 
                        onClick={(e) => { e.stopPropagation(); fetchRandomPost(); }}
                        disabled={isLoading}
                        className="group relative flex items-center gap-3 mx-auto px-8 py-3.5 bg-amber-300/10 hover:bg-amber-300/20 text-amber-100 rounded-full border border-amber-300/30 transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]"
                      >
                        <Shuffle size={18} className={isLoading ? "animate-spin" : "group-hover:rotate-180"} />
                        <span className="font-medium tracking-wide text-sm">再翻一页</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full pt-32 overflow-y-auto px-4 md:px-8 custom-scrollbar"
            >
              <div className="max-w-6xl mx-auto pb-32">
                {posts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-40 text-center space-y-6"
                  >
                    <Stars size={48} className="text-amber-200/20" strokeWidth={1} />
                    <p className="text-slate-500 tracking-[0.3em] font-light italic">
                      星尘尚未汇聚，等待你的分享...
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-lg hover:border-amber-200/20 hover:bg-white/10 transition-all duration-500 group cursor-pointer">
                        <p className="text-lg text-slate-200/90 leading-relaxed mb-6 group-hover:text-slate-100 transition-colors font-serif tracking-wide">
                          {post.content}
                        </p>
                        <div className="flex justify-between items-center text-[10px] md:text-xs text-amber-200/50 font-medium tracking-wider gap-2">
                          <span className="bg-amber-200/5 px-2 py-0.5 md:px-3 md:py-1 rounded-full group-hover:bg-amber-200/10 transition-colors shrink-0 truncate max-w-[100px]"># {post.moodTag || "感悟"}</span>
                          <span className="shrink-0">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthGuardModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

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
                    onClick={handlePublish}
                    disabled={!content || isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-amber-200 text-slate-900 rounded-full hover:bg-amber-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] font-bold tracking-widest disabled:opacity-30 disabled:hover:scale-100 text-sm"
                  >
                    <Send size={16} />
                    <span>{isLoading ? "发布中..." : "发布"}</span>
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
