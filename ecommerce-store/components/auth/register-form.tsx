// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios"; // Import AxiosError for better typing

interface RegisterFormProps {
     onSwitchToLogin?: () => void;
}

// Ensure your API URL is correctly defined in environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
if (!API_URL) {
     console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
     // Handle this case appropriately, maybe disable the form or show an error
}


const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
     const { isLoaded, signUp, setActive } = useSignUp();
     const router = useRouter();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [phone, setPhone] = useState("");
     const [address, setAddress] = useState("");
     const [pendingVerification, setPendingVerification] = useState(false);
     const [code, setCode] = useState("");
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(false);

     const handleSignUpSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!isLoaded || loading) return;

          setLoading(true);
          setError(null);

          try {
               // Start Clerk sign-up process
               await signUp.create({
                    emailAddress: email,
                    password, // Clerk handles this securely
                    firstName, // Clerk can store these
                    lastName,  // Clerk can store these
                    // Note: Clerk doesn't natively store phone/address in the main user object easily.
                    // You *could* potentially use unsafeMetadata, but syncing to your DB is standard.
               });

               // Send email verification code via Clerk
               await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
               setPendingVerification(true);
               toast.success("Verification email sent! Please check your inbox.");

          } catch (err: any) { // Catch specific Clerk errors if possible
               console.error("Clerk Error during sign up:", JSON.stringify(err, null, 2));
               const clerkErrorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "An error occurred during sign up.";
               setError(clerkErrorMessage);
               toast.error(clerkErrorMessage);
          } finally {
               // Only stop loading if not moving to verification step
               if (!pendingVerification) {
                    setLoading(false);
               }
               // Keep loading true if pendingVerification is now true,
               // as the user moves to the next step (verification).
          }
     };

     const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!isLoaded || loading) return;

          setLoading(true);
          setError(null);

          try {
               // Attempt to verify the email code with Clerk
               const completeSignUp = await signUp.attemptEmailAddressVerification({
                    code,
               });

               // Check if Clerk verification was successful
               if (completeSignUp.status === "complete") {
                    // Set the Clerk session as active
                    await setActive({ session: completeSignUp.createdSessionId });

                    const userId = completeSignUp.createdUserId;
                    if (!userId) {
                         // This shouldn't happen if status is 'complete', but check just in case
                         throw new Error("Clerk User ID not found after successful sign up.");
                    }

                    // --- Sync user data to your backend ---
                    try {
                         // Ensure API_URL has a trailing slash if needed, or adjust endpoint path
                         const response = await axios.post(`${API_URL}/api/user/create`, {
                              id: userId, // Send Clerk's user ID
                              email: email, // Send email used for signup
                              name: `${firstName} ${lastName}`.trim(), // Combine names
                              phone: phone || undefined, // Send phone if provided, else undefined
                              address: address || undefined, // Send address if provided, else undefined
                              role: "CUSTOMER", // Default role for new signups
                              emailVerified: true // Email is verified by Clerk at this point
                         });

                         console.log("Backend user creation response:", response.data);
                         toast.success("Account created and verified successfully!");
                         router.push("/dashboard"); // Or wherever you redirect users

                    } catch (axiosError) {
                         console.error("Error creating user in backend:", axiosError);
                         let backendErrorMessage = "Failed to save user details after verification.";
                         if (axios.isAxiosError(axiosError)) {
                              const serverError = axiosError.response?.data?.error;
                              if (serverError) {
                                   backendErrorMessage = serverError;
                              } else if (axiosError.response?.status === 409) {
                                   backendErrorMessage = axiosError.response?.data?.message || "Account conflict. User might already exist.";
                              }
                         }
                         setError(backendErrorMessage);
                         toast.error(backendErrorMessage);
                         // Keep user on verification page or handle state appropriately
                         // Consider if you need to manually clean up anything if backend sync fails
                    }
                    // --- End sync ---

               } else {
                    // Handle cases where Clerk verification isn't 'complete' (e.g., incorrect code)
                    console.error("Clerk verification status not complete:", completeSignUp.status);
                    setError("Verification failed. The code might be incorrect or expired.");
                    toast.error("Verification failed. Please check the code and try again.");
               }
          } catch (err: any) { // Catch specific Clerk verification errors if possible
               console.error("Clerk Error during verification:", JSON.stringify(err, null, 2));
               const clerkErrorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "An error occurred during verification.";
               setError(clerkErrorMessage);
               toast.error(clerkErrorMessage);
          } finally {
               setLoading(false); // Stop loading regardless of success/failure in verification
          }
     };

     // --- JSX Structure ---
     // Split forms for clarity
     const renderSignUpForm = () => (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
               {/* Input fields for firstName, lastName, email, password, phone, address */}
               {/* ... (Your existing input fields - unchanged) ... */}
               <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                         type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your first name" required disabled={loading}
                    />
               </div>
               <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                         type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your last name" required disabled={loading}
                    />
               </div>
               <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                         type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your email" required disabled={loading}
                    />
               </div>
               <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                         type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your password (min 8 chars)" required minLength={8} disabled={loading}
                    />
               </div>
               <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <input
                         type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your phone number" disabled={loading}
                    />
               </div>
               <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                    <textarea
                         id="address" value={address} onChange={(e) => setAddress(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter your address" rows={3} disabled={loading}
                    />
               </div>

               {error && <p className="text-red-500 text-sm">{error}</p>}

               <button
                    type="submit"
                    disabled={loading || !isLoaded}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                    {loading ? "Signing Up..." : "Sign Up"}
               </button>
               <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                         type="button"
                         onClick={onSwitchToLogin}
                         disabled={loading}
                         className="text-blue-600 hover:underline disabled:text-gray-400"
                    >
                         Log in
                    </button>
               </p>
          </form>
     );

     const renderVerificationForm = () => (
          <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
               <p className="text-center text-sm text-gray-600">
                    We've sent a verification code to {email}. Please enter it below.
               </p>
               <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
                    <input
                         type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)}
                         className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter the 6-digit code" required disabled={loading} maxLength={6} // Common length for codes
                    />
               </div>

               {error && <p className="text-red-500 text-sm">{error}</p>}

               <button
                    type="submit"
                    disabled={loading || !isLoaded || code.length < 6} // Basic validation
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                    {loading ? "Verifying..." : "Verify Code"}
               </button>
               <button
                    type="button"
                    onClick={() => setPendingVerification(false)} // Allow user to go back if needed
                    disabled={loading}
                    className="w-full text-center text-sm text-blue-600 hover:underline mt-2 disabled:text-gray-400"
               >
                    Entered wrong email? Go back
               </button>
          </form>
     );

     return (
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
               <h1 className="text-3xl font-bold text-center mb-6">
                    {pendingVerification ? "Verify Your Email" : "Create an Account"}
               </h1>
               {!pendingVerification ? renderSignUpForm() : renderVerificationForm()}
          </div>
     );
};

export default RegisterForm;