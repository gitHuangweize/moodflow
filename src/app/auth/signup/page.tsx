"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Stars, ArrowRight } from "lucide-react";
import StarryBackground from "@/components/ui/StarryBackground";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "注册失败");
      }

      // 注册成功后自动登录
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        router.push("/auth/signin");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-serif">
      <StarryBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* 装饰性光晕 */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="text-center mb-10 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Stars className="text-amber-300" size={32} />
            </motion.div>
            <h1 className="text-3xl font-bold text-amber-100 italic tracking-wider">
              开启你的记忆星链
            </h1>
            <p className="text-slate-400 mt-3 text-sm tracking-widest font-sans uppercase">
              Begin Your Starlight Journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 p-4 rounded-2xl text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-amber-200/60 ml-4 tracking-[0.2em] uppercase">
                星空代号
              </label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-300/60 transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="请输入用户名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl px-14 py-4 focus:outline-none focus:border-amber-300/30 focus:bg-black/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-slate-100 placeholder:text-slate-600 font-sans"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-amber-200/60 ml-4 tracking-[0.2em] uppercase">
                星际邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-300/60 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="example@moodflow.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl px-14 py-4 focus:outline-none focus:border-amber-300/30 focus:bg-black/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-slate-100 placeholder:text-slate-600 font-sans"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-amber-200/60 ml-4 tracking-[0.2em] uppercase">
                记忆密码
              </label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-300/60 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl px-14 py-4 focus:outline-none focus:border-amber-300/30 focus:bg-black/40 focus:ring-4 focus:ring-amber-300/5 transition-all text-slate-100 placeholder:text-slate-600 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-200 hover:bg-amber-100 text-slate-900 rounded-2xl py-4 font-bold tracking-[0.3em] uppercase text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.2)] disabled:opacity-50 flex items-center justify-center gap-3 group/btn mt-8"
            >
              {isLoading ? (
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-slate-900 rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <span>星链同步</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs tracking-widest font-sans uppercase">
              已有星链？{" "}
              <Link href="/auth/signin" className="inline-block px-2 py-1 text-amber-300/80 hover:text-amber-300 font-bold transition-colors underline decoration-1 underline-offset-4">
                立即溯源
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-slate-600 hover:text-slate-400 text-xs tracking-[0.3em] font-sans uppercase transition-colors">
            ← 返回银河中心
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
