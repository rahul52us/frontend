"use client";

import React from "react";
import { observer } from "mobx-react-lite";
import CustomersTab from "../components/Dashboard/tabs/CustomersTab";
import stores from "../../store/stores";
import CompanyRequiredState from "../components/common/CompanyRequiredState";

const CustomersPage = observer(() => {
  const { user } = stores.auth;
  const hasCompany = Boolean(user?.company?._id || user?.company);
  const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  return <CustomersTab />;
});

export default CustomersPage;
