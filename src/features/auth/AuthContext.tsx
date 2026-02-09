import React, { createContext, useCallback, useMemo, useState } from 'react';
import { clearToken, readToken, writeToken } from './storage';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, remember: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readToken());

  const setSession = useCallback((nextToken: string, remember: boolean) => {
    writeToken(nextToken, remember);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: token != null,
      setSession,
      logout,
    }),
    [token, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
