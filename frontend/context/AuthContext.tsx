"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { whoamiAction } from "@/lib/actions/auth-actions";
import type { AuthUser } from "@/lib/api/auth";
import { clearAuthCookies, storeUserCookie } from "@/lib/cookies";

type AuthContextValue = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<AuthUser | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await whoamiAction();
      const currentUser = response.data?.user || null;

      setUser(currentUser);

      if (currentUser) {
        storeUserCookie(currentUser);
      }

      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthCookies();
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void checkAuth();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: !!user,
      checkAuth,
      logout,
    }),
    [checkAuth, loading, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
