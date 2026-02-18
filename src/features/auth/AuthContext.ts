import { createContext } from 'react';

export type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, remember: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);