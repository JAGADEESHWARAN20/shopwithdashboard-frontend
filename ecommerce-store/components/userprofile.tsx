// components/UserProfile.tsx
'use client'

import { useUser } from '@/contexts/user-context'

export default function UserProfile() {
     const { user, isLoading, error } = useUser()

     if (isLoading) return <div>Loading user data...</div>
     if (error) return <div>Error: {error}</div>
     if (!user) return <div>Not authenticated</div>

     return (
          <div className="flex items-center gap-4">
               <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
               />
               <div>
                    <h3 className="font-medium">
                         {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
               </div>
          </div>
     )
}