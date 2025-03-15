import { AspectRatio, Box, Container, Flex, Heading, Icon, SimpleGrid, Text } from '@chakra-ui/react'
import { FiFlag, FiMapPin } from 'react-icons/fi'
import CommonHeading from '../../../../component/common/CommonHeading/CommonHeading'

const LocationSection = ({shopData}) => {
  return (
    <Box id="location" py={16} bgGradient="linear(to-b, gray.50, white)">
  
    <Container maxW="container.xl" px={{ base: 4, lg: 8 }}>
    
      <CommonHeading  heading="Find Us" subheading=" Visit our locations or explore virtually through our interactive map" />
  
      {/* Map + Addresses Container */}
      <Flex 
        direction={{ base: "column", lg: "row" }}
        gap={8}
        bg="white"
        borderRadius="2xl"
        p={{ base: 6, lg: 4 }}
        boxShadow="base"
        position="relative"
        overflow="hidden"
      >
        {/* Map Section (Fluid width) */}
        <Box 
          flex="1.5" 
          borderRadius="2xl" 
          overflow="hidden"
          minH={{ base: "400px", lg: "auto" }}
          position="relative"
        >
          <AspectRatio ratio={16/9}>
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              style={{ filter: "grayscale(20%) saturate(120%)" }}
            />
          </AspectRatio>
        </Box>
  
        {/* Addresses Section */}
        <Box flex="1" position="relative">
          {/* Floating Address Cards */}
          <Box 
            position="relative"
            pl={{ lg: 6 }}
            _before={{
              content: '""',
              position: "absolute",
              left: "0",
              top: "8",
              bottom: "8",
              w: "2px",
              bg: "purple.100",
              borderRadius: "full"
            }}
          >
            {/* Primary Location */}
            <Box 
              bg="white"
              p={8}
              borderRadius="2xl"
              mb={6}
              boxShadow="lg"
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl"
              }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiMapPin} w={6} h={6} color="purple.600" mr={3} />
                <Heading fontSize="xl" fontWeight="700">Main Studio</Heading>
              </Flex>
              <Text 
                color="gray.600"
                lineHeight="tall"
                fontSize="md"
                _notLast={{ mb: 2 }}
              >
                {shopData.location.address}<br />
                {shopData.location.city}, {shopData.location.state}<br />
                {shopData.location.postalCode}<br />
                {shopData.location.country}
              </Text>
            </Box>
  
            {/* Additional Locations */}
            {shopData.location.additionalLocations?.length > 0 && (
              <SimpleGrid columns={1} spacing={6}>
                {shopData.location.additionalLocations.map((location, index) => (
                  <Box
                    key={index}
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.100"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "purple.100",
                      transform: "translateX(8px)"
                    }}
                  >
                    <Flex align="center" mb={3}>
                      <Icon as={FiFlag} w={5} h={5} color="blue.500" mr={3} />
                      <Heading fontSize="lg" fontWeight="600">
                        Studio {index + 1}
                      </Heading>
                    </Flex>
                    <Text color="gray.600" lineHeight="tall">
                      {location.address}<br />
                      {location.city}, {location.state} {location.postalCode}<br />
                      {location.country}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
      </Flex>
    </Container>
  </Box>
  )
}

export default LocationSection