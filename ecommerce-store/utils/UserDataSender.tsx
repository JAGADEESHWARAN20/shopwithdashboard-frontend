"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { postUserDetails } from "@/actions/post-userdetails"; // Adjust the import path if necessary

const UserDataSender = () => {
    const { isSignedIn } = useUser();
    const [hasSentDetails, setHasSentDetails] = useState(false);

    useEffect(() => {
        if (isSignedIn && !hasSentDetails) {
            postUserDetails();
            setHasSentDetails(true);
        }
    }, [isSignedIn, hasSentDetails]);

    return null;
};

export default UserDataSender;
