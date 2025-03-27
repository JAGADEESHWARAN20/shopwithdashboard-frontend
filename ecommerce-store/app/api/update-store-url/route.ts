// app/api/update-store-url/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function PATCH(req: NextRequest) {
     try {
          const { userId } = await auth();

          if (!userId) {
               return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }

          const body = await req.json();
          const { storeId, storeUrl } = body;

          if (!storeId || !storeUrl) {
               return NextResponse.json({ error: 'Missing storeId or storeUrl' }, { status: 400 });
          }

          const store = await prismadb.store.findFirst({
               where: {
                    id: storeId,
                    authId: userId, // Use authId here
               },
          });

          if (!store) {
               return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
          }

          const updatedStore = await prismadb.store.update({
               where: {
                    id: storeId,
               },
               data: { storeUrl },
          });

          return NextResponse.json(updatedStore);
     } catch (error) {
          console.error('[UPDATE_STORE_URL_API]', error);
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
     }
}