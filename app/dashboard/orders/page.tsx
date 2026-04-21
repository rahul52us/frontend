
"use client";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import OrdersTab from "../components/Dashboard/tabs/OrdersTab";
import stores from "../../store/stores";
import CompanyRequiredState from "../components/common/CompanyRequiredState";

const OrdersPage = observer(() => {
    const router = useRouter();
    const { user } = stores.auth;
    const hasCompany = Boolean(user?.company?._id || user?.company);
    const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";
    const isBuyerOnlyUser = !isSuperAdmin && !hasCompany && user?.type !== "seller";

    useEffect(() => {
        if (isBuyerOnlyUser) {
            router.replace("/account?tab=orders");
        }
    }, [isBuyerOnlyUser, router]);

    if (isBuyerOnlyUser) {
        return null;
    }

    if (!isSuperAdmin && !hasCompany) {
        return <CompanyRequiredState />;
    }

    return (
        <>
            <OrdersTab />
        </>
    );
});

export default OrdersPage;
