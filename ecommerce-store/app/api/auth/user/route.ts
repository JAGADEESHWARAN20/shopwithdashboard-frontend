import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
     // Authenticate the request
     const { userId } = await auth();

     if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     // Retrieve the authenticated user's information
     const user = await currentUser();

     if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
     }

     // Extract user details
     const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress,
          imageUrl: user.imageUrl,
          // Add any additional fields you need
     };

     return NextResponse.json(userData);
}
