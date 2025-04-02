// actions/auth/get-session.ts
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface SessionResponse {
     user: { id: string; email: string; name: string };
}

export const getSession = async (token: string): Promise<SessionResponse | null> => {
     try {
          const res = await fetch(`${API_URL}api/auth/session`, {
               headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
               throw new Error(`Failed to fetch session: ${res.status}`);
          }
          return res.json();
     } catch (error) {
          console.error("Error fetching session:", error);
          return null;
     }
};