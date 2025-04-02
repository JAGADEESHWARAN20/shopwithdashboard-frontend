// components/auth/register-form.tsx
"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

interface RegisterFormProps {
     onSwitchToLogin?: () => void;
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

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!isLoaded) return;

          setLoading(true);
          setError(null);

          try {
               await signUp.create({
                    emailAddress: email,
                    password,
                    firstName,
                    lastName,
               });

               // Send email verification code
               await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
               setPendingVerification(true);
          } catch (err: any) {
               console.error("Error during signup:", err);
               setError(err.errors?.[0]?.message || "An error occurred during signup.");
               toast.error(err.errors?.[0]?.message || "Signup failed. Please try again.");
               setLoading(false);
          }
     };

     // components/auth/register-form.tsx (snippet)
     const handleVerifyCode = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!isLoaded) return;

          setLoading(true);
          setError(null);

          try {
               const completeSignUp = await signUp.attemptEmailAddressVerification({
                    code,
               });

               if (completeSignUp.status === "complete") {
                    await setActive({ session: completeSignUp.createdSessionId });

                    const userId = completeSignUp.createdUserId;
                    if (!userId) {
                         throw new Error("User ID not found after signup.");
                    }

                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
                         id: userId,
                         email,
                         name: `${firstName} ${lastName}`,
                         phone,
                         address,
                         role: "CUSTOMER",
                         emailVerified: true,
                    });

                    toast.success("Account created successfully!");
                    router.push("/dashboard");
               } else {
                    setError("Verification failed. Please try again.");
                    toast.error("Verification failed. Please try again.");
               }
          } catch (err: any) {
               console.error("Error verifying code or creating user:", err);
               setError(err.errors?.[0]?.message || "An error occurred during verification.");
               toast.error(err.errors?.[0]?.message || "Verification failed. Please try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="w-full">
               {!pendingVerification ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                   First Name
                              </label>
                              <input
                                   type="text"
                                   id="firstName"
                                   value={firstName}
                                   onChange={(e) => setFirstName(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your first name"
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                   Last Name
                              </label>
                              <input
                                   type="text"
                                   id="lastName"
                                   value={lastName}
                                   onChange={(e) => setLastName(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your last name"
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                   Email
                              </label>
                              <input
                                   type="email"
                                   id="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your email"
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                   Password
                              </label>
                              <input
                                   type="password"
                                   id="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your password"
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                   Phone Number (Optional)
                              </label>
                              <input
                                   type="tel"
                                   id="phone"
                                   value={phone}
                                   onChange={(e) => setPhone(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your phone number"
                              />
                         </div>
                         <div>
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                   Address (Optional)
                              </label>
                              <textarea
                                   id="address"
                                   value={address}
                                   onChange={(e) => setAddress(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter your address"
                                   rows={3}
                              />
                         </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                         <button
                              type="submit"
                              disabled={loading || !isLoaded}
                              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                              {loading ? "Signing Up..." : "Sign Up"}
                         </button>
                         <p className="text-center text-sm text-gray-600">
                              Already have an account?{" "}
                              <button
                                   type="button"
                                   onClick={onSwitchToLogin}
                                   className="text-blue-600 hover:underline"
                              >
                                   Log in
                              </button>
                         </p>
                    </form>
               ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                         <div>
                              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                   Verification Code
                              </label>
                              <input
                                   type="text"
                                   id="code"
                                   value={code}
                                   onChange={(e) => setCode(e.target.value)}
                                   className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="Enter the verification code"
                                   required
                              />
                         </div>
                         {error && <p className="text-red-500 text-sm">{error}</p>}
                         <button
                              type="submit"
                              disabled={loading || !isLoaded}
                              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                         >
                              {loading ? "Verifying..." : "Verify Code"}
                         </button>
                    </form>
               )}
          </div>
     );
};

export default RegisterForm;