import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
     const { userId } = await auth();

     // If no userId, return an Unauthorized response
     if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     // Fetch the current user
     const user = await currentUser();

     // If the user is not found, return a Not Found response
     if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
     }

     // Get the primary email address from the user's emailAddresses array
     const primaryEmailObj = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
     );

     // Structure the user data that will be sent back in the response
     const userData = {
          email: primaryEmailObj?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          image: user.imageUrl,
          emailVerified: primaryEmailObj?.verification?.status === 'verified',
          phone: user.phoneNumbers?.[0]?.phoneNumber || null,
          role: 'CUSTOMER', // You can hardcode this or extract from Clerk metadata
     };

     // Return the user data as a JSON response
     return NextResponse.json(userData);
}
