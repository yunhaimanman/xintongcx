import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, removeToken, removeUser } from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中的用户信息
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

  const hasPermission = (permission) => {
    if (!user || !user.roles) return false;
    
    return user.roles.some(role => 
      role.permissions && role.permissions.some(perm => perm.name === permission)
    );
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    
    return user.roles.some(role => role.name === roleName);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

