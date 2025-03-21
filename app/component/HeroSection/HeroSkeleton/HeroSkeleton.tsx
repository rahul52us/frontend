import { Box, Skeleton } from '@chakra-ui/react'
import { endColor, startColor } from '../../common/utils/skeletonColors'

const HeroSkeleton = () => {
  return (
    <Box >
        <Skeleton height="380px" startColor={startColor} endColor={endColor} rounded={"xl"} />
    </Box>
  )
}

export default HeroSkeleton