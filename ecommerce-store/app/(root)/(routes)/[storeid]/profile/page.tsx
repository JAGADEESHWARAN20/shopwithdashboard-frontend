// app/(root)/(routes)/[storeid]/profile/page.tsx
import { getProfile } from "@/actions/user/get-profile";
import { UserProfile } from "@/types";

interface ProfilePageProps {
     params: { storeId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
     const { storeId } = params;
     const profile: UserProfile | null = await getProfile();

     if (!profile) {
          return <div className="text-center py-10 text-red-500">Failed to fetch profile.</div>;
     }

     return (
          <div className="min-h-screen flex flex-col items-center justify-center">
               <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
               <p className="text-lg">Name: {profile.name}</p>
               <p className="text-lg">Email: {profile.email}</p>
               {profile.phone && <p className="text-lg">Phone: {profile.phone}</p>}
               {profile.address && <p className="text-lg">Address: {profile.address}</p>}
               {profile.role && <p className="text-lg">Role: {profile.role}</p>}
               <p className="text-lg">Store ID: {storeId}</p>
          </div>
     );
}