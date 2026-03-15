import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('inkwell_user', null);
  const [users, setUsers] = useLocalStorage('inkwell_users', []);

  const login = (email, password) => {
    const existingUser = users.find((u) => u.email === email && u.password === password);
    if (existingUser) {
      setUser(existingUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    // Auto-generate avatar using DiceBear based on name
    const seed = encodeURIComponent(name);
    const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
    
    const newUser = {
      id: generateId(),
      name,
      email,
      password,
      bio: '',
      avatar,
      joinDate: new Date().toISOString(),
      likesReceived: 0,
      postCount: 0
    };
    
    setUsers([...users, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout, 
      updateProfile,
      users // Exposed for search/stats functionality if needed
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
