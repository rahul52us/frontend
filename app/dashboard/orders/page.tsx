
"use client";
import React from 'react';
import { observer } from "mobx-react-lite";
import OrdersTab from "../components/Dashboard/tabs/OrdersTab";
import stores from "../../store/stores";
import CompanyRequiredState from "../components/common/CompanyRequiredState";
import OrdersSection from "../../(main)/account/component/OrderSection/OrderSection";

const OrdersPage = observer(() => {
    const { user } = stores.auth;
    const hasCompany = Boolean(user?.company?._id || user?.company);
    const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";
    const isBuyerOnlyUser = !isSuperAdmin && !hasCompany && user?.type !== "seller";

    if (isBuyerOnlyUser) {
        return <OrdersSection />;
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
