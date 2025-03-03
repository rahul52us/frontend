'use client'
import { Box } from '@chakra-ui/react'
import Dashboard from './components/Dashboard/Dashboard'
import { observer } from 'mobx-react-lite'

const page = observer(() => {
  return (
    <Box>
      <Dashboard />
    </Box>
  )
})

export default page