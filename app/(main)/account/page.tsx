"use client"
import { Box, Spinner, Text } from '@chakra-ui/react'
import { Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import AccountPage from './component/AccountPage'

const page = () => {
  return (
    <Box>
      <Suspense fallback={<Box p={10} textAlign="center"><Spinner size="xl" /><Text mt={4}>Loading account...</Text></Box>}>
        <AccountPage />
      </Suspense>
    </Box>
  )
}

export default observer(page)