import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize with localStorage value to prevent flash of login screen
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminAuth') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount (fallback)
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    console.log('AuthContext: Checking localStorage:', authStatus);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      console.log('AuthContext: User is authenticated');
    } else {
      console.log('AuthContext: User is not authenticated');
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in production, this would be more secure
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      console.log('AuthContext: Login successful, localStorage set');
      return true;
    }
    console.log('AuthContext: Login failed');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    console.log('AuthContext: Logout successful, localStorage cleared');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
