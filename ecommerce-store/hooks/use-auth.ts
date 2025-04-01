// hooks/use-auth.ts
import { useAuth } from "@/context/auth-context";

export const useAuthHook = () => {
     const { user, token, setAuth, logout } = useAuth();
     return { user, token, setAuth, logout };
};