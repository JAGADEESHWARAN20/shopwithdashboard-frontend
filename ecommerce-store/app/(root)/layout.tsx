import { auth } from '@clerk/nextjs/server';
import { redirect } from "next/navigation";
import { ReactNode } from 'react';
import prismadb from "@/lib/prismadb";
import React from "react";

export default async function SetupLayout({
    children,
}: {
    children: ReactNode;
}) {
    const authResult = await auth();
    const { userId } = authResult;

    if (!userId) {
        redirect('/sign-up');
    }

    try {
        const store = await prismadb.store.findFirst({
            where: {
                userId,
            },
        });

        if (store) {
            redirect(`/${store.id}`);
        }

        return (
            <>
                {children}
            </>
        );
    } catch (error) {
        console.error("Error fetching store:", error);
        return (
            <div>
                <h1>An error occurred, please try again.</h1>
            </div>
        );
    }
}