// Define a type for user data (can be extended later if needed)
interface UserData {
     email: string;
     name: string;
     image: string;
     emailVerified: boolean;
     phone: string | null;
     role: string;
}

// Define the expected response format from getUserData (if applicable)
interface UserDataResponse {
     email: string;
     name: string;
     image: string;
     emailVerified: boolean;
     phone: string | null;
     role: string;
}

// Fetch user data from the /api/auth/user route
export async function getUserData(): Promise<UserDataResponse> {
     try {
          const response = await fetch('/api/auth/user', {
               method: 'GET',
               headers: {
                    'Content-Type': 'application/json',
               },
          });

          if (!response.ok) {
               throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const userData: UserDataResponse = await response.json();
          return userData;
     } catch (error) {
          console.error('Failed to fetch user data:', error);
          throw new Error('Failed to fetch user data');
     }
}

// Post user data to the admin dashboard API
export async function postUserDataToAdminDashboard(userData: UserData): Promise<any> {
     try {
          const response = await fetch('https://admindashboardecom.vercel.app/api/user-added', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify(userData),
          });

          if (!response.ok) {
               throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          return data; // Returning the response data (success or error message)
     } catch (error) {
          console.error('Failed to post user data:', error);
          throw new Error('Failed to post user data');
     }
}
