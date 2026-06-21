'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType extends AuthState {
  login: (nrp: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  switchRole: (role: 'personel' | 'admin' | 'psikolog') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulasi load session dari localStorage
    const stored = localStorage.getItem('kehati_user');
    if (stored) {
      try {
        const user = JSON.parse(stored) as User;
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (nrp: string, _password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    // Simulasi delay API
    await new Promise(r => setTimeout(r, 800));

    // Cek user dummy — semua password diterima untuk demo
    const found = mockUsers.find(u => u.nrp === nrp);
    if (found) {
      localStorage.setItem('kehati_user', JSON.stringify(found));
      setState({ user: found, isAuthenticated: true, isLoading: false });
      return { success: true, user: found };
    }
    // Default: login sebagai personel jika NRP tidak ditemukan tapi bukan kosong
    if (nrp.trim()) {
      const defaultUser = mockUsers[0];
      localStorage.setItem('kehati_user', JSON.stringify(defaultUser));
      setState({ user: defaultUser, isAuthenticated: true, isLoading: false });
      return { success: true, user: defaultUser };
    }
    return { success: false, error: 'NRP atau password salah.' };
  };

  const logout = () => {
    localStorage.removeItem('kehati_user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  // Helper untuk dev: switch role demo
  const switchRole = (role: 'personel' | 'admin' | 'psikolog') => {
    const user = mockUsers.find(u => u.role === role) ?? mockUsers[0];
    localStorage.setItem('kehati_user', JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
