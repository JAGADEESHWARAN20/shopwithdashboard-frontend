// context/auth-context.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "@/actions/auth/get-session";
import { User } from "@/types";

interface AuthContextType {
     user: User | null;
     token: string | null;
     setAuth: (token: string, user: User) => void;
     logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
     const [user, setUser] = useState<User | null>(null);
     const [token, setToken] = useState<string | null>(null);

     useEffect(() => {
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
               getSession(storedToken).then((session) => {
                    if (session) {
                         setUser(session.user);
                         setToken(storedToken);
                    }
               });
          }
     }, []);

     const setAuth = (newToken: string, newUser: User) => {
          setToken(newToken);
          setUser(newUser);
          localStorage.setItem("token", newToken);
     };

     const logout = () => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
     };

     return (
          <AuthContext.Provider value={{ user, token, setAuth, logout }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error("useAuth must be used within an AuthProvider");
     }
     return context;
};