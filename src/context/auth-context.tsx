'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
import { CurrentUser } from '@/types/user';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    // Don't fetch if we're already refreshing to prevent loops
    if (isRefreshing) {
      return;
    }

    setIsLoading(true);
    try {
      // Fetch user without automatic redirect on error
      const currentUser = await getCurrentUser(false);
      setUser(currentUser);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("AuthContext: Failed to fetch user on load", error);
      setUser(null);
      
      // Only redirect on auth errors if we're not already on an auth page
      if (!window.location.pathname.startsWith('/auth/')) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router, isRefreshing]);

  // Only fetch user on mount and when explicitly requested
  useEffect(() => {
    fetchUser();
  }, []); // Remove fetchUser from deps to prevent unnecessary reruns

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiRequest<void>('auth/logout', { method: 'POST' });
      console.log("Logout successful on backend.");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/auth/login');
    }
  }, [router]);

  // Function to manually refetch user data
  const refetchUser = useCallback(async () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      try {
        await fetchUser();
        setIsRefreshing(false);
        setIsLoading(false);
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    }
  }, [fetchUser, isRefreshing]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 