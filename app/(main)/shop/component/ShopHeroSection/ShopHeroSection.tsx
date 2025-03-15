import { Badge, Box, Button, Container, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'

const ShopHeroSection = ({ shopData }: any) => {
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
        <Box
          position="relative"
          h={{ base: "300px", md: "400px", lg: "500px" }}
          w="full"
        >
          <Image
            src={shopData.images.cover}
            alt={`${shopData.name} cover`}
            w="full"
            h="full"
            objectFit="cover"
          />
          <Box
            position="absolute"
            inset="0"
            bgGradient={{
              base: "linear(to-t, blackAlpha.800, blackAlpha.400)",
              md: "linear(to-t, black, 20%,transparent)"
            }}
          />
        </Box>

        <Container
          maxW="container.xl"
          position="relative"
          mt={{ base: "-240px", md: "-36" }}
          zIndex="10"
          px={{ base: 3, md: 4 }}
          pb={{ base: 4, md: 8 }}
        >
          <Flex
            flexDir={{ base: "column", md: "row" }}
            alignItems={{ base: "center", md: "flex-end" }}
            gap={{ base: 3, md: 6 }}
            justifyContent="space-between"
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            {/* Shop Logo */}
            <Box
              position="relative"
              w={{ base: "80px", md: "100px" }}
              h={{ base: "80px", md: "100px" }}
              borderRadius="xl"
              border="3px"
              borderColor="white"
              overflow="hidden"
              bg="white"
              mb={{ base: 2, md: 0 }}
            >
              <Image
                src={shopData?.images?.logo}
                alt={shopData.name}
                h="full"
                w="full"
                objectFit="cover"
              />
            </Box>

            {/* Shop Info */}
            <Box
              flex="1"
              color="white"
              textAlign={{ base: "center", md: "left" }}
              maxW={{ base: "100%", md: "60%" }}
            >
              <Heading
                as="h1"
                size={{ base: "lg", md: "xl" }}
                fontWeight="bold"
                lineHeight="tight"
              >
                {shopData.name}
              </Heading>

              <Flex
                alignItems="center"
                mt={2}
                gap={2}
                flexDir={{ base: "column", md: "row" }}
                justify={{ base: "center", md: "flex-start" }}
              >
                <Flex alignItems="center" gap={2}>
                  <Flex alignItems="center" gap={1}>
                    <Box as={FaStar} color="orange.400" boxSize={{ base: 4, md: 5 }} />
                    <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                      {shopData.ratings.average}
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.200">
                      ({shopData.ratings.total} reviews)
                    </Text>
                  </Flex>

                  <Box display={{ base: "block", md: "none" }}>
                    <Divider orientation="horizontal" w="20px" bg="gray.300" />
                  </Box>
                  <Box display={{ base: "none", md: "block" }}>
                    <Divider orientation="vertical" h="4" bg="gray.300" />
                  </Box>

                  <Flex alignItems="center" fontSize={{ base: "xs", md: "sm" }}>
                    <Box as={FaMapMarkerAlt} mr={1} color="gray.300" boxSize={{ base: 3, md: 4 }} />
                    <Text>
                      {shopData.location.city}, {shopData.location.state}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex
                flexWrap="wrap"
                gap={2}
                mt={2}
                justify={{ base: "center", md: "flex-start" }}
              >
                {shopData.categories.map((category, index) => (
                  <Badge
                    key={index}
                    colorScheme="whiteAlpha"
                    variant="subtle"
                    rounded="full"
                    py={0.5}
                    px={2}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {category}
                  </Badge>
                ))}
              </Flex>

              {/* Mobile-specific status and button */}
              <Flex
                alignItems="center"
                justifyContent="center"
                gap={2}
                mt={2}
                display={{ base: "flex", md: "none" }}
                flexWrap="wrap"
              >
                <Badge
                  colorScheme={isOpen24Hours() ? "green" : "orange"}
                  variant={isOpen24Hours() ? "solid" : "outline"}
                  fontSize="xs"
                  py={1}
                  px={2}
                  rounded="full"
                >
                  {isOpen24Hours() ? "Open" : "Closed"}
                </Badge>
                <Button
                  colorScheme="blue"
                  size="sm"
                  variant="outline"
                  borderColor="whiteAlpha.800"
                  color="white"
                  _hover={{ bg: "blue.500", borderColor: "blue.500" }}
                  px={4}
                >
                  Contact
                </Button>
              </Flex>
            </Box>

            {/* Desktop status and button */}
            <Flex
              alignItems="center"
              gap={3}
              mt={{ base: 4, md: 0 }}
              display={{ base: "none", md: "flex" }}
              flexShrink={0}
            >
              <Badge
                colorScheme={isOpen24Hours() ? "green" : "orange"}
                variant={isOpen24Hours() ? "solid" : "outline"}
                fontSize="sm"
                py={2}
                px={3}
              >
                {isOpen24Hours() ? "Open Now" : "Closed"}
              </Badge>
              <Button
                colorScheme="blue"
                size="md"
              >
                Contact Shop
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default ShopHeroSection