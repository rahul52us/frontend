import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa'

interface ShopData {
  name: string
  coverImage?: { url: string }
  logo?: { url: string }
  ratings?: {
    average?: number
    total?: number
  }
  location?: {
    city?: string
    state?: string
  }
  categories?: string[]
  operatingHours?: {
    day: string
    open: string
    close: string
  }[]
}

const ShopHeroSection = ({ shopData }: { shopData: ShopData }) => {
  const getCurrentDayHours = () => {
    if (!shopData?.operatingHours) return null
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = days[new Date().getDay()]
    return shopData.operatingHours.find((day) => day.day === today) || null
  }

  const todayHours = getCurrentDayHours()

  const isOpenNow = () => {
    if (!todayHours) return false
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [openHour, openMinute] = todayHours.open.split(":").map(Number)
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number)

    const openMinutes = openHour * 60 + openMinute
    const closeMinutes = closeHour * 60 + closeMinute

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
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
            src={shopData?.coverImage?.url || "/fallback-cover.jpg"}
            alt={`${shopData?.name || "Shop"} cover`}
            w="full"
            h="full"
            objectFit="cover"
          />
          <Box
            position="absolute"
            inset="0"
            bgGradient={{
              base: "linear(to-t, blackAlpha.800, blackAlpha.400)",
              md: "linear(to-t, black, 20%,transparent)",
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
                src={shopData?.logo?.url || "/fallback-logo.jpg"}
                alt={shopData?.name || "Shop Logo"}
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
                {shopData?.name || "Unnamed Shop"}
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
                      {shopData?.ratings?.average?.toFixed(1) || "0.0"}
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.200">
                      ({shopData?.ratings?.total || 0} reviews)
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
                      {shopData?.location?.city || "Unknown City"},{" "}
                      {shopData?.location?.state || "Unknown State"}
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
                {shopData?.categories?.length ? (
                  shopData.categories.map((category, index) => (
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
                  ))
                ) : (
                  <Text fontSize="xs" color="gray.300">
                    No categories listed
                  </Text>
                )}
              </Flex>

              {/* Mobile status and button */}
              <Flex
                alignItems="center"
                justifyContent="center"
                gap={2}
                mt={2}
                display={{ base: "flex", md: "none" }}
                flexWrap="wrap"
              >
                <Badge
                  colorScheme={isOpenNow() ? "green" : "orange"}
                  variant={isOpenNow() ? "solid" : "outline"}
                  fontSize="xs"
                  py={1}
                  px={2}
                  rounded="full"
                >
                  {isOpenNow() ? "Open" : "Closed"}
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
                colorScheme={isOpenNow() ? "green" : "orange"}
                variant={isOpenNow() ? "solid" : "outline"}
                fontSize="sm"
                py={2}
                px={3}
              >
                {isOpenNow() ? "Open Now" : "Closed"}
              </Badge>
              <Button colorScheme="blue" size="md">
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
