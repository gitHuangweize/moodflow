"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface UserStatusProps {
  onLoginClick: () => void;
}

export default function UserStatus({ onLoginClick }: UserStatusProps) {
  const { data: session } = useSession();

  if (session) {
    return (
      <Link href="/profile" className="relative group p-1 transition-transform active:scale-95">
        <div className="w-10 h-10 rounded-full border border-amber-300/50 overflow-hidden ring-2 ring-transparent group-hover:ring-amber-300/20 transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-200">
              <User size={20} />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onLoginClick}
      className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-amber-200 text-sm font-medium hover:bg-white/10 hover:border-amber-200/30 transition-all duration-300 shadow-lg"
    >
      登录
    </motion.button>
  );
}
