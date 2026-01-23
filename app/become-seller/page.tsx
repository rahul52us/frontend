"use client";
import React from "react";
import dynamic from "next/dynamic";
import { observer } from "mobx-react-lite";

// Reuse the refactored ShopForm which handles creation vs update automatically
const ShopForm = dynamic(() => import("../dashboard/shop/component/Form"), { ssr: false });

const BecomeSellerPage = observer(() => {
    return (
        <ShopForm />
    );
});

export default BecomeSellerPage;
