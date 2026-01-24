"use client";

import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const requireAuth = useCallback((action: () => void) => {
    if (status === "loading") return;
    
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }
    
    action();
  }, [session, status]);

  return {
    requireAuth,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated: !!session,
    isLoading: status === "loading"
  };
}
