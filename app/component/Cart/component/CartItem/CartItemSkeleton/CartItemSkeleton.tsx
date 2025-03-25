import { Box, Divider, Flex, HStack, Skeleton } from '@chakra-ui/react'
import { endColor, startColor } from '../../../../common/utils/skeletonColors'

const CartItemSkeleton = () => {
  return (
    <Flex 
      align="center" 
      gap={3}
      py={2}
      borderBottomWidth="1px"
    >
      {/* Image Skeleton */}
      <Box flexShrink={0} width="54px" height="50px">
        <Skeleton startColor={startColor} endColor={endColor} width="100%" height="100%" borderRadius="md" />
      </Box>
      
      <Flex align="center" flex={1} minWidth={0} gap={2}>
        {/* Text Skeleton */}
        <Box flex={1} minWidth={0}>
          <Skeleton startColor={startColor} endColor={endColor} height="14px" mb={1} width="90%" />
          <Skeleton startColor={startColor} endColor={endColor} height="14px" width="60%" />
        </Box>
        
        {/* Quantity controls Skeleton */}
        <HStack 
          borderWidth="1px" 
          borderRadius="md" 
          spacing={0} 
          bg={'purple.50'}
          divider={<Divider orientation="vertical" height="6" />}
          flexShrink={0}
        >
          <Skeleton startColor={startColor} endColor={endColor} width="24px" height="22px" borderRadius="md 0 0 md" />
          <Skeleton startColor={startColor} endColor={endColor} width="30px" height="22px" />
          <Skeleton startColor={startColor} endColor={endColor} width="24px" height="22px" borderRadius="0 md md 0" />
        </HStack>
        
        {/* Price Skeleton */}
        <Skeleton 
          width="70px"
          startColor={startColor} endColor={endColor}
          height="24px"
          flexShrink={0}
        />
      </Flex>
    </Flex>
  )
}

export default CartItemSkeleton