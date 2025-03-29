import { createClerkClient } from "@clerk/backend";


const clerkClient = createClerkClient({
     secretKey: process.env.CLERK_SECRET_KEY,
});

export async function getUserById(userId: string) {
     try {
          const user = await clerkClient.users.getUser(userId);
          return user;
     } catch (error) {
          console.error("Error getting user:", error);
          return null;
     }
}

export async function getStoreIdForUser(userId: string) {
     try {
          const user = await clerkClient.users.getUser(userId);
          return user.publicMetadata?.storeId as string | undefined;
     } catch (error) {
          console.error("Error getting store ID:", error);
          return undefined;
     }
}

export async function setStoreIdForUser(userId: string, storeId: string) {
     try {
          await clerkClient.users.updateUserMetadata(userId, {
               publicMetadata: { storeId: storeId },
          });
          console.log(`Store ID ${storeId} set for user ${userId}`);
     } catch (error) {
          console.error("Error setting store ID:", error);
     }
}