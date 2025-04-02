const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const signup = async (email: string, password: string, name: string): Promise<{ token?: string; user?: { id: string; email: string; name?: string } } | { error: string } | null> => {
     try {
          const res = await fetch(`${API_URL}api/auth/user/create`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password, name }),
          });

          if (!res.ok) {
               const errorData = await res.json();
               throw new Error(errorData.error || `Sign-up failed: ${res.status} ${res.statusText}`);
          }

          return await res.json(); // Returns user data or token from the backend response
     } catch (error) {
          console.error("Error signing up:", error);
          return { error: (error as Error).message };
     }
};
