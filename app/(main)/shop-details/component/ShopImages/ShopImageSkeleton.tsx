import { Box, Grid, Skeleton } from '@chakra-ui/react'
import { endColor, startColor } from '../../../../component/common/utils/skeletonColors'

const ShopImageSkeleton = () => {
  return (
    <Box maxW={'90%'} mx={'auto'}>
        <Grid templateColumns={{lg:'1fr 1fr 1fr'}} gap={{base:4,lg:8}}>

        <Skeleton h={'240px'} startColor={startColor} endColor={endColor} rounded={'xl'} />
        <Skeleton h={'240px'} startColor={startColor} endColor={endColor} rounded={'xl'} />
        <Skeleton h={'240px'} startColor={startColor} endColor={endColor} rounded={'xl'} />
        </Grid>
    </Box>
  )
}

export default ShopImageSkeleton