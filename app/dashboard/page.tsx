'use client'
import { Box } from '@chakra-ui/react'
import Dashboard from './components/Dashboard/Dashboard'
import { observer } from 'mobx-react-lite'
import stores from '../store/stores'
import CompanyRequiredState from './components/common/CompanyRequiredState'
import BuyerDashboard from '../(main)/account/component/BuyerDashboard/BuyerDashboard'

const page = observer(() => {
  const { user } = stores.auth;
  const hasCompany = Boolean(user?.company?._id || user?.company);
  const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";
  const isSellerPendingShop = user?.onboarding?.state === "seller_pending_shop";
  const isBuyerOnlyUser = !isSuperAdmin && !hasCompany && user?.type !== "seller" && !isSellerPendingShop;

  if (isBuyerOnlyUser) {
    return (
      <Box>
        <BuyerDashboard />
      </Box>
    );
  }

  if (!isSuperAdmin && !hasCompany) {
    return (
      <CompanyRequiredState
        message={isSellerPendingShop ? "Finish setting up your shop" : "Please create your shop first"}
      />
    );
  }

  return (
    <Box>
      <Dashboard />
    </Box>
  )
})

export default page
