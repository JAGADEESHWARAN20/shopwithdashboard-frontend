const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const signin = async (email: string, password: string): Promise<{ token?: string; user?: { id: string; email: string; name?: string } } | { error: string } | null> => {
     try {
          const res = await fetch(`${API_URL}api/auth/signin`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
               const errorData = await res.json();
               throw new Error(errorData.error || `Sign-in failed: ${res.status} ${res.statusText}`);
          }

          return await res.json(); // Returns token and user details
     } catch (error) {
          console.error("Error signing in:", error);
          return { error: (error as Error).message };
     }
};
