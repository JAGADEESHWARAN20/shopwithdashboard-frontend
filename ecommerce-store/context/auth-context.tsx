// context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types'; // Import the User interface

interface AuthContextProps {
     user: User | null;
     token: string | null;
     setAuth: (user: User | null, token: string | null) => void;
     logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [user, setUser] = useState<User | null>(null);
     const [token, setToken] = useState<string | null>(null);

     const setAuth = (user: User | null, token: string | null) => {
          setUser(user);
          setToken(token);
     };

     const logout = () => {
          setUser(null);
          setToken(null);
     };

     const value: AuthContextProps = {
          user,
          token,
          setAuth,
          logout,
     };

     return (
          <AuthContext.Provider value= { value } >
          { children }
          </AuthContext.Provider>
    );
};

export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};