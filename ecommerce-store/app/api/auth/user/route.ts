import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
     const { userId } = await auth();

     if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     const user = await currentUser();

     if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
     }

     const primaryEmailObj = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
     );

     const userData = {
          email: primaryEmailObj?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          image: user.imageUrl,
          emailVerified: primaryEmailObj?.verification?.status === 'verified',
          phone: user.phoneNumbers?.[0]?.phoneNumber || null,
          role: 'CUSTOMER', // You can hardcode default or extract based on some Clerk metadata
     };

     return NextResponse.json(userData);
}
