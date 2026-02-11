"use client";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import { Box, Spinner, Text } from "@chakra-ui/react";



const CheckoutContent = () => {
    return <CheckoutClient />;
};

const CheckoutPage = () => {
    return (
        <Suspense fallback={<Box p={10} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading checkout...</Text></Box>}>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;
