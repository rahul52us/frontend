import { Badge, Box, Button, Container, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'

const ShopHeroSection = ({shopData}:any) => {
    const getCurrentDayHours = () => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const today = days[new Date().getDay()]
        return shopData.operatingHours.find((day) => day.day === today)
      }
    const todayHours = getCurrentDayHours()

    const isOpen24Hours = () => {
        if (!todayHours) return false
    
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
    
        const [openHour, openMinute] = todayHours.open.split(":").map(Number)
        const [closeHour, closeMinute] = todayHours.close.split(":").map(Number)
    
        const currentTime = currentHour * 60 + currentMinute
        const openTime = openHour * 60 + openMinute
        const closeTime = closeHour * 60 + closeMinute
    
        return currentTime >= openTime && currentTime < closeTime
      }
  return (
    <Box>
          <Box position="relative">
                <Box position="relative" h={{ base: "300px", md: "400px", lg: "500px" }} w="full">
                  <Image
                    src={shopData.images.cover}
                    alt={`${shopData.name} cover`}
                    // layout="fill"
                    w={"full"}
                    h={"full"}
                    objectFit="cover"
                    // priority
                  />
                  <Box position="absolute" inset="0" bgGradient="linear(to-t, black, 20%,transparent)" />
                </Box>
        
                <Container maxW="container.xl" position="relative" mt={{ base: "-24", md: "-36" }} zIndex="10" px="4" pb={8}>
                  <Flex 
                    flexDir={{ base: "column", md: "row" }} 
                    alignItems={{ base: "start", md: "flex-end" }}
                    gap={{ base: "4", md: "6" }}
                  >
                    <Box 
                      position="relative"
                      w={{ base: "24", md: "100px" }} 
                      h={{ base: "24", md: "100px" }}
                      borderRadius="xl"
                      border="4px"
                      borderColor="white"
                      overflow="hidden"
                      bg="white"
                    >
                      <Image
                        src={shopData?.images?.logo}
                        alt={shopData.name}
                        // layout="fill"
                        h={'100%'}
                        objectFit="cover"
                      />
                    </Box>
                    <Box flex="1" color={'white'}>
                      <Heading as="h1" size={{ base: "xl", md: "xl" }} fontWeight="bold">
                        {shopData.name}
                      </Heading>
                      <Flex alignItems="center" mt="2" gap="2">
                        <Flex alignItems="center">
                          <Box as={FaStar} color="orange.400" />
                          <Text ml="1" fontWeight="medium" >{shopData.ratings.average}</Text>
                          <Text ml="1" color="gray.200">({shopData.ratings.total} reviews)</Text>
                        </Flex>
                        <Divider orientation="vertical" h="4" />
                        <Flex alignItems="center" fontSize="sm">
                          <Box as={FaMapMarkerAlt} mr="1" color="gray.500" />
                          <Text>
                            {shopData.location.city}, {shopData.location.state}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex flexWrap="wrap" gap="4" mt="3">
                        {shopData.categories.map((category, index) => (
                          <Badge key={index} colorScheme="whiteAlpha" bg={'whiteAlpha'} variant="subtle" rounded={'full'} py={0.5} px={2}>
                            {category}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>
                    <Flex display={{ base: "none", md: "flex" }} alignItems="center" gap="2" mt={{ base: "4", md: "0" }}>
                      <Badge
                        colorScheme={isOpen24Hours() ? "green" : "orange"}
                        variant={isOpen24Hours() ? "solid" : "outline"}
                        fontSize="sm"
                        py="2"
                        px="3"
                      >
                        {isOpen24Hours() ? "Open Now" : "Closed"}
                      </Badge>
                      <Button colorScheme="blue">Contact Shop</Button>
                    </Flex>
                  </Flex>
                </Container>
              </Box>
    </Box>
  )
}

export default ShopHeroSection