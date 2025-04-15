"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  mfaEnabled: boolean;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  hasRole: () => false,
  hasPermission: () => false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated, but not an error
          setUser(null);
          return;
        }
        throw new Error('Authentication check failed');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If MFA is required, we don't set the user as authenticated yet
      if (data.requiresMfa) {
        return;
      }

      await checkAuth(); // Fetch the user data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Re-throw to let the login form handle it
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Don't automatically log in after registration since email verification is required
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Re-throw to let the registration form handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string) => {
    // This is a simplified version. In a real app, this would check against a mapping of roles to permissions
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.roles.includes('admin')) return true;
    
    // Example permission mappings (this would be more sophisticated in a real app)
    const rolePermissions: Record<string, string[]> = {
      user: ['read:profile', 'update:profile'],
      manager: ['read:profile', 'update:profile', 'read:users'],
      admin: ['*'], // All permissions
    };
    
    // Check if any of the user's roles have the required permission
    return user.roles.some(role => 
      rolePermissions[role]?.includes(permission) || rolePermissions[role]?.includes('*')
    );
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 