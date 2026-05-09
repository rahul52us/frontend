"use client";
import React from "react";
import dynamic from "next/dynamic";
import { observer } from "mobx-react-lite";
import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_TOKEN } from "../config/utils/variables";

// Reuse the refactored ShopForm which handles creation vs update automatically
const ShopForm = dynamic(() => import("../dashboard/shop/component/Form"), { ssr: false });

const BecomeSellerPage = observer(() => {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (!token) {
            router.push("/login?redirect=/become-seller");
            return;
        }
        setIsCheckingAuth(false);
    }, [router]);

    if (isCheckingAuth) {
        return (
            <Center minH="60vh">
                <Spinner />
            </Center>
        );
    }

    return (
        <ShopForm />
    );
});

export default BecomeSellerPage;
