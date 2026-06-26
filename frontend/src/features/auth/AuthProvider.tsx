import React, { createContext, useContext, useMemo, useState } from "react";

type Role = "student" | "admin";

type AuthUser = {
  email: string;
  role: Role;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthed: boolean;
  isAdmin: boolean;
  setSession: (data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS_KEY = "batch223_access_token";
const REFRESH_KEY = "batch223_refresh_token";
const USER_KEY = "batch223_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_KEY)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem(REFRESH_KEY)
  );

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const value = useMemo<AuthContextValue>(() => {
    const isAuthed = Boolean(accessToken);
    const isAdmin = user?.role === "admin";

    return {
      accessToken,
      refreshToken,
      user,
      isAuthed,
      isAdmin,

      setSession: (data) => {
        localStorage.setItem(ACCESS_KEY, data.accessToken);
        localStorage.setItem(REFRESH_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
      },

      logout: () => {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      },
    };
  }, [accessToken, refreshToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}