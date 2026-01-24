"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import StarryBackground from "@/components/ui/StarryBackground";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("邮箱或密码错误，请重试");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("登录时发生意外错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden selection:bg-amber-200/30">
      <StarryBackground />
      
      {/* 返回按钮 */}
      <Link 
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-amber-200 transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-200/30">
          <ArrowLeft size={20} />
        </div>
        <span className="text-sm font-medium tracking-widest uppercase">回到星空</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative group">
          {/* 装饰星光 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300/10 blur-[80px] rounded-full group-hover:bg-amber-300/20 transition-all duration-700" />
          
          <div className="text-center mb-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block p-4 rounded-3xl bg-amber-300/10 border border-amber-300/20 mb-6"
            >
              <Sparkles className="text-amber-300" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white italic tracking-tighter mb-2">MoodFlow</h1>
            <p className="text-slate-400 text-sm tracking-[0.2em] uppercase font-light">连接每一枚情绪星辰</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-200/60 uppercase tracking-widest ml-4">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-amber-300/50 focus:bg-white/10 transition-all outline-none text-white placeholder:text-slate-600 font-sans"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-200/60 uppercase tracking-widest ml-4">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-amber-300/50 focus:bg-white/10 transition-all outline-none text-white placeholder:text-slate-600 font-sans"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-rose-400 text-xs font-medium ml-4 flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-rose-400 rounded-full" />
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-amber-300 text-slate-900 rounded-2xl font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:bg-amber-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>星尘同步中...</span>
                </>
              ) : (
                <span>开启旅程</span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">
              还没有账号？
              <Link href="/auth/signup" className="text-amber-300/80 hover:text-amber-300 ml-2 font-bold transition-colors">
                点亮星光
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
