"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthGuardModal({
  isOpen,
  onClose,
  title = "星空旅人",
  message = "请先开启你的记忆星图"
}: AuthGuardModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/signin");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[280px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="text-center relative z-10">
              <h3 className="text-lg font-medium text-white mb-2 tracking-wide">
                {title}
              </h3>
              <p className="text-slate-300 text-sm mb-8 font-sans">
                {message}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-amber-300 text-slate-900 rounded-xl font-bold tracking-wider hover:bg-amber-200 transition-all"
                >
                  去登录
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-slate-400 hover:text-slate-200 transition-all text-sm"
                >
                  稍后再说
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
