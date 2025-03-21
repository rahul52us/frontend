"use client"
import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import AccountPage from './component/AccountPage'

const page = () => {
  return (
    <Box>
        <AccountPage/>
    </Box>
  )
}

export default observer(page)