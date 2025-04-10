// actions/userActions.ts
export async function getUserData() {
     try {
          // Fetch user data from the /api/auth/user route
          const response = await fetch('/api/auth/user', {
               method: 'GET',
               headers: {
                    'Content-Type': 'application/json', // Ensure correct header
               },
          });

          // If response is not ok, throw an error
          if (!response.ok) {
               throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          // Parse the JSON response
          const userData = await response.json();
          return userData;
     } catch (error) {
          console.error('Failed to fetch user data:', error);
          throw error;
     }
}

export async function postUserDataToAdminDashboard(userData: { email: string; name: string; image: string; emailVerified: boolean; phone: string | null; role: string }) {
     try {
          // Sending POST request to the user-added API
          const response = await fetch('https://admindashboardecom.vercel.app/api/user-added', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify(userData),
          });

          // Check if the response is ok (status code 2xx)
          if (!response.ok) {
               throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          // Parse the response body as JSON
          const data = await response.json();
          return data; // Returning the response data (success or error message)
     } catch (error) {
          console.error('Failed to post user data:', error);
          throw error;
     }
}
