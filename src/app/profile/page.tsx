"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Trash2, 
  Download, 
  FileText, 
  Code, 
  X, 
  Calendar, 
  MessageSquare, 
  Heart,
  User,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import MeteorBackground from "@/components/ui/MeteorBackground";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  moodTag?: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'md' | 'json' | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: "星空旅人",
    image: null,
    postsCount: 0,
    joinDate: "2026-01-22"
  });

  // 情绪数据 (Mood Graph) - 基于真实帖子数据生成
  const moodData = useMemo(() => {
    // 创建最近 30 天的数组
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last30Days.map((date, i) => {
      // 查找该日期的帖子
      const postsOnDay = posts.filter(p => {
        const postDate = new Date(p.createdAt);
        postDate.setHours(0, 0, 0, 0);
        return postDate.getTime() === date.getTime();
      });

      // 亮度根据当天帖子数量决定 (0条: 0.1, 1条: 0.5, 2条+: 1.0)
      let intensity = 0;
      if (postsOnDay.length === 1) intensity = 0.5;
      else if (postsOnDay.length > 1) intensity = 1.0;

      return {
        day: i,
        intensity: intensity || 0.05 // 即使没数据也给点微光
      };
    });
  }, [posts]);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch("/api/v1/posts/me");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setUser(prev => ({ ...prev, postsCount: data.length }));
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/v1/posts/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== deleteId));
        setUser(prev => ({ ...prev, postsCount: prev.postsCount - 1 }));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    if (!exportFormat) return;
    const format = exportFormat;
    let content = "";
    if (format === 'json') {
      content = JSON.stringify(posts, null, 2);
    } else {
      content = posts.map(p => `## ${new Date(p.createdAt).toLocaleString()}\n\n${p.content}\n\n---`).join("\n\n");
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodflow-export-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    setIsExportModalOpen(false);
    setExportFormat(null);
  };

  return (
    <div className="min-h-screen text-slate-100 font-serif overflow-x-hidden">
      <MeteorBackground />

      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">返回星空</span>
        </Link>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-amber-300/10 backdrop-blur-md rounded-full border border-amber-300/30 hover:bg-amber-300/20 transition-all text-amber-300"
        >
          <Download size={18} />
          <span className="text-sm font-bold tracking-wider">导出数据</span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        {/* 用户信息卡片 */}
        <section className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-amber-300/20 to-blue-500/20 border-2 border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(253,230,138,0.1)]">
              <User size={48} className="text-amber-300/50" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white tracking-tight">{user.name}</h1>
            <p className="text-slate-400 text-sm tracking-[0.2em] uppercase font-light">
              自 {user.joinDate} 开启星际旅程
            </p>
          </motion.div>

          {/* 统计区 */}
          <div className="flex flex-col items-center mt-12">
            <div className="flex justify-center gap-12 mb-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-300 mb-1">{user.postsCount}</p>
                <p className="text-xs text-slate-500 tracking-widest uppercase">发布心得</p>
              </div>
              <div className="w-px h-12 bg-white/5" />
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-300 mb-1">
                  {posts.reduce((acc, p) => acc + p._count.likes, 0)}
                </p>
                <p className="text-xs text-slate-500 tracking-widest uppercase">获赞总数</p>
              </div>
            </div>

            {/* 情绪星座图 Mood Graph */}
            <div className="glass-card p-6 rounded-3xl w-full max-w-2xl border-amber-300/10 shadow-[0_0_20px_rgba(253,230,138,0.05)] min-h-[160px] flex flex-col justify-center">
              {mounted ? (
                <>
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold text-amber-300/60 tracking-widest uppercase">
                    <Sparkles size={14} /> 近 30 日情绪星图
                  </div>
                  <div className="flex justify-between items-end h-16 gap-1 md:gap-2 px-2">
                    {moodData.map((data) => (
                      <motion.div
                        key={data.day}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="flex-1 min-w-[4px] rounded-full relative group"
                        style={{ 
                          height: `${20 + data.intensity * 80}%`,
                          backgroundColor: `rgba(253, 230, 138, ${0.1 + data.intensity * 0.9})`,
                          boxShadow: data.intensity > 0.7 ? `0 0 10px rgba(253, 230, 138, ${data.intensity * 0.5})` : 'none'
                        }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-amber-300 text-slate-950 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          亮度: {Math.round(data.intensity * 100)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 px-1 text-[10px] text-slate-600 tracking-tighter uppercase font-medium">
                    <span>30天前</span>
                    <span>今日</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-amber-300/30 border-t-amber-300 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 帖子瀑布流 */}
        <section>
          <h2 className="text-xl font-bold mb-8 text-amber-300/80 italic flex items-center gap-3">
            <Calendar size={18} /> 我的记忆星链
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 glass-card rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    className="glass-card p-8 rounded-[2rem] group relative hover:border-amber-300/30 transition-all duration-500"
                  >
                    <p className="text-lg text-slate-200 leading-relaxed mb-8 font-serif">
                      {post.content}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                          <Heart size={14} className="text-rose-400/50" />
                          {post._count.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          {post._count.comments}
                        </span>
                      </div>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <button 
                      onClick={() => setDeleteId(post.id)}
                      className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 bg-rose-500/10 text-rose-400 rounded-full hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* 导出 Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExportModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
              
              <h3 className="text-2xl font-bold text-white mb-2 italic">导出记忆备份</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                将您在这片星空留下的所有心得导出为本地文件，永久留存。
              </p>

              <div className="space-y-4">
                <button 
                  onClick={() => setExportFormat('md')}
                  className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-amber-300/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Markdown 格式</p>
                      <p className="text-xs text-slate-500">适合阅读与排版</p>
                    </div>
                  </div>
                  <ArrowLeft className="rotate-180 text-slate-600 group-hover:text-amber-300 transition-colors" size={18} />
                </button>

                <button 
                  onClick={() => setExportFormat('json')}
                  className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-amber-300/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Code size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">JSON 数据</p>
                      <p className="text-xs text-slate-500">适合开发者进行数据迁移</p>
                    </div>
                  </div>
                  <ArrowLeft className="rotate-180 text-slate-600 group-hover:text-amber-300 transition-colors" size={18} />
                </button>
              </div>

              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 删除确认 Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden text-center"
            >
              <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 italic">确定要删除吗？</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                这条心得将从星空中永久陨落，无法再次找回。
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
                >
                  取消
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-all text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                  确定删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 下载确认 Modal */}
      <AnimatePresence>
        {exportFormat && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExportFormat(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden text-center"
            >
              <div className="mx-auto w-16 h-16 mb-6 rounded-full bg-amber-300/10 flex items-center justify-center text-amber-300">
                <Download size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 italic">确认下载备份？</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                即将导出您的全部心得记录为 <span className="text-amber-300 font-bold uppercase">{exportFormat}</span> 格式。
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setExportFormat(null)}
                  className="flex-1 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
                >
                  取消
                </button>
                <button 
                  onClick={handleExport}
                  className="flex-1 px-6 py-3 bg-amber-300 text-slate-900 rounded-2xl hover:bg-amber-400 transition-all text-sm font-bold shadow-[0_0_20px_rgba(253,230,138,0.3)]"
                >
                  开始下载
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
