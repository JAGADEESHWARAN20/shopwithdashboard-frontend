'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SyncUser() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const sendUserToServer = async () => {
        const res = await fetch('https://admindashboardecom.vercel.app/api/user-added', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            fullName: user.fullName,
            imageUrl: user.imageUrl,
            externalAccounts: user.externalAccounts, // includes Google info
          }),
        });

        if (!res.ok) {
          console.error('Failed to send user data:', await res.text());
        }
      };

      sendUserToServer();
    }
  }, [user, isSignedIn, isLoaded]);

  return null;
}