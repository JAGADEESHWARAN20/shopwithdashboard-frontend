// contexts/UserContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { User } from '@/types'

interface UserContextType {
     user: User | null
     isLoading: boolean
     error: string | null
     refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
     user: null,
     isLoading: true,
     error: null,
     refreshUser: async () => { },
})

export function UserProvider({ children }: { children: React.ReactNode }) {
     const { userId, getToken } = useAuth()
     const [user, setUser] = useState<User | null>(null)
     const [isLoading, setIsLoading] = useState(true)
     const [error, setError] = useState<string | null>(null)

     const fetchUser = async () => {
          try {
               setIsLoading(true)
               setError(null)

               if (!userId) {
                    setUser(null)
                    return
               }

               const token = await getToken()
               const response = await fetch('/api/user', {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               })

               if (!response.ok) {
                    throw new Error('Failed to fetch user data')
               }

               const userData = await response.json()
               setUser(userData)
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Unknown error occurred')
               setUser(null)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchUser()
     }, [userId])

     return (
          <UserContext.Provider
               value={{
                    user,
                    isLoading,
                    error,
                    refreshUser: fetchUser,
               }}
          >
               {children}
          </UserContext.Provider>
     )
}

export const useUser = () => useContext(UserContext)