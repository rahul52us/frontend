import { AspectRatio, Box, Container, Flex, Heading, Icon, SimpleGrid, Text, Button, Badge, VStack, HStack } from '@chakra-ui/react'
import { FiFlag, FiMapPin, FiNavigation, FiExternalLink } from 'react-icons/fi'
import { motion } from 'framer-motion'
import CommonHeading from '../../../../component/common/CommonHeading/CommonHeading'

const MotionBox = motion(Box);

const LocationSection = ({ shopData }: any) => {
  const handleGetDirections = (address: string) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <Box id="location" py={16} bgGradient="linear(to-b, #f8fafc, white)">
      <Container maxW="container.xl" px={{ base: 4, lg: 8 }}>
        <CommonHeading
          heading="Our Location"
          subheading="Visit our main studio or explore our multiple locations designed to serve you better."
        />

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={10}
          bg="white"
          borderRadius="4xl"
          p={{ base: 6, lg: 8 }}
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.08)"
          position="relative"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Map Section */}
          <Box
            flex="1.4"
            borderRadius="3xl"
            overflow="hidden"
            minH={{ base: "350px", lg: "500px" }}
            position="relative"
            boxShadow="inner"
            border="1px solid"
            borderColor="gray.200"
          >
            <AspectRatio ratio={16 / 10} h="full">
              <iframe
                title="Shop Location"
                src="https://www.google.com/maps/embed?pb=..."
                style={{ filter: "contrast(1.1) saturate(1.2) brightness(0.95)" }}
              />
            </AspectRatio>
            <Badge
              position="absolute"
              top={4}
              left={4}
              bg="white"
              color="blue.600"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="xs"
              fontWeight="900"
              boxShadow="xl"
            >
              INTERACTIVE MAP
            </Badge>
          </Box>

          {/* Addresses Section */}
          <Box flex="1" position="relative">
            <VStack spacing={8} align="stretch">
              {/* Primary Location Card */}
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                bg="blue.50"
                p={8}
                borderRadius="3xl"
                position="relative"
                transition={{ duration: 0.3 }}
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 20px 40px rgba(49, 130, 206, 0.1)"
                }}
              >
                <Flex align="center" mb={5}>
                  <Box p={3} bg="blue.600" borderRadius="2xl" color="white" mr={4}>
                    <Icon as={FiMapPin} boxSize={5} />
                  </Box>
                  <Heading fontSize="2xl" fontWeight="900" color="gray.800" letterSpacing="tight">
                    Main Headquarter
                  </Heading>
                </Flex>

                <Text
                  color="gray.600"
                  lineHeight="tall"
                  fontSize="md"
                  fontWeight="600"
                  mb={6}
                >
                  {shopData.location.address}<br />
                  {shopData.location.city}, {shopData.location.state} {shopData.location.postalCode}<br />
                  {shopData.location.country}
                </Text>

                <Button
                  leftIcon={<FiNavigation />}
                  rightIcon={<FiExternalLink />}
                  w="full"
                  size="lg"
                  colorScheme="blue"
                  borderRadius="2xl"
                  fontWeight="900"
                  fontSize="sm"
                  variant="solid"
                  onClick={() => handleGetDirections(shopData.location.address)}
                >
                  GET DIRECTIONS
                </Button>
              </MotionBox>

              {/* Additional Locations */}
              {shopData?.multipleLocations?.length > 0 && (
                <SimpleGrid columns={1} spacing={4}>
                  {shopData.multipleLocations.map((location, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      bg="white"
                      p={5}
                      borderRadius="2xl"
                      border="1px solid"
                      borderColor="gray.100"
                      _hover={{
                        borderColor: "blue.200",
                        bg: "blue.50/30",
                        transform: "translateX(5px)"
                      }}
                    >
                      <Flex align="center" justify="space-between">
                        <HStack spacing={4}>
                          <Icon as={FiFlag} boxSize={5} color="blue.500" />
                          <Box>
                            <Heading fontSize="md" fontWeight="800" color="gray.800">
                              Studio {index + 1}
                            </Heading>
                            <Text color="gray.500" fontSize="xs" fontWeight="700">
                              {location.city}, {location.state}
                            </Text>
                          </Box>
                        </HStack>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleGetDirections(location.address)}
                        >
                          View
                        </Button>
                      </Flex>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default LocationSection
