import React, { useCallback, useMemo, useState } from 'react';
import { clearToken, readToken, writeToken } from './storage';
import { AuthContext, type AuthContextValue } from './AuthContext';

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