// app/profile/page.tsx
"use client";

import React from 'react';
import { useAuthHook } from '@/hooks/use-auth';

const ProfilePage: React.FC = () => {
     const { user } = useAuthHook();

     if (!user) {
          return <div>Please log in to view your profile.</div>;
     }

     return (
          <div className="container mx-auto p-4">
               <h1 className="text-2xl font-bold mb-4">Profile</h1>
               <p>Hi, {user.name}!</p>
               {/* Add more profile details here */}
               <p>Email: {user.email}</p>
               {user.phone && <p>Phone: {user.phone}</p>}
               {user.address && <p>Address: {user.address}</p>}
               {user.image && <img src={user.image} alt="Profile" className="mt-4 rounded-full w-32 h-32" />}
               <p>Role: {user.role}</p>

          </div>
     );
};

export default ProfilePage;