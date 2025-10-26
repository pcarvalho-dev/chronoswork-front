'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, User, RegisterData, UpdateProfileData, ManagerRegisterData, EmployeeRegisterData, ManagerRegisterResponse, EmployeeRegisterResponse } from '@/app/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  registerManager: (managerData: ManagerRegisterData) => Promise<ManagerRegisterResponse>;
  registerEmployee: (employeeData: EmployeeRegisterData) => Promise<EmployeeRegisterResponse>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
  isAuthenticated: boolean;
  isManager: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user profile on mount
  const loadUserProfile = useCallback(async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const token = api.getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const { user: profileUser } = await api.getProfile();
      setUser(profileUser);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Try to refresh token if profile fetch fails
      try {
        await api.refreshToken();
        const { user: profileUser } = await api.getProfile();
        setUser(profileUser);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Clear tokens if refresh fails
        api.clearTokens();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.user);
    // Redirect based on user role
    if (response.user.role === 'manager') {
      router.push('/manager');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (userData: RegisterData) => {
    const response = await api.register(userData);
    setUser(response.user);
    // Redirect based on user role
    if (response.user.role === 'manager') {
      router.push('/manager');
    } else {
      router.push('/dashboard');
    }
  };

  const registerManager = async (managerData: ManagerRegisterData) => {
    const response = await api.registerManager(managerData);
    setUser(response.user);
    // Manager is automatically approved and redirected to manager dashboard
    router.push('/manager');
    return response;
  };

  const registerEmployee = async (employeeData: EmployeeRegisterData) => {
    const response = await api.registerEmployee(employeeData);
    setUser(response.user);
    // Employee needs approval, redirect to waiting page
    router.push('/dashboard?pending=approval');
    return response;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      api.clearTokens();
      router.push('/login');
    }
  };

  const refreshUserProfile = async () => {
    try {
      const { user: profileUser } = await api.getProfile();
      setUser(profileUser);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    const response = await api.updateProfile(userData);
    setUser(response.user);
  };

  const value = {
    user,
    loading,
    login,
    register,
    registerManager,
    registerEmployee,
    logout,
    refreshUserProfile,
    updateProfile,
    isAuthenticated: !!user,
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
