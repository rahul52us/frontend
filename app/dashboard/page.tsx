'use client'
import { Box } from '@chakra-ui/react'
import Dashboard from './components/Dashboard/Dashboard'
import { observer } from 'mobx-react-lite'
import stores from '../store/stores'
import CompanyRequiredState from './components/common/CompanyRequiredState'

const page = observer(() => {
  const { user } = stores.auth;
  const hasCompany = Boolean(user?.company?._id || user?.company);
  const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";

  if (!isSuperAdmin && !hasCompany) {
    return <CompanyRequiredState />;
  }

  return (
    <Box>
      <Dashboard />
    </Box>
  )
})

export default page
