"use client"
import { Box } from '@chakra-ui/react'
import IndividualBlogPage from '../blogs/components/IndividualBlogPage/IndividualBlogPage'
import OtherBlogSection from '../blogs/components/OtherBlogSection/OtherBlogSection'
import StayTune from '../blogs/components/stayTuned/stayTuned'

const page = () => {
    return (
        <Box>
            <IndividualBlogPage />
            <Box my={{ base: "40px", lg: "80px" }} maxW={{ md: "90%", xl: '85%' }} mx={'auto'} bg={'#D5EBF8'} rounded={'16px'}>
                <StayTune />
            </Box>
            <OtherBlogSection />
        </Box>
    )
}

export default page