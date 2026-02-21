"use client";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  Icon,
  HStack,
  VStack,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { FiMessageCircle, FiUserPlus } from 'react-icons/fi';

interface ShopData {
  name: string;
  coverImage?: { url: string };
  logo?: { url: string };
  ratings?: {
    average?: number;
    total?: number;
  };
  location?: {
    city?: string;
    state?: string;
  };
  categories?: string[];
  about?: string;
}

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

const ShopHeroSection = ({ shopData }: { shopData: ShopData }) => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const [isExpanded, setIsExpanded] = useState(false);

  // Status Logic
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const operatingHours = (shopData as any)?.operatingHours || [];
  const todayHours = operatingHours.find((h: any) => h.day === today);

  const isOpenNow = () => {
    if (!todayHours) return false;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [openHour, openMinute] = todayHours.open.split(":").map(Number);
      const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);
      return currentMinutes >= (openHour * 60 + openMinute) && currentMinutes < (closeHour * 60 + closeMinute);
    } catch { return false; }
  };

  const isLive = isOpenNow();

  const aboutText = shopData?.about || "Experience the finest craftsmanship and curated collections designed for modern lifestyles.";
  const previewText = aboutText.slice(0, 120);
  const showReadMore = aboutText.length > 120;

  return (
    <Box position="relative" minH={{ base: "80vh", md: "70vh" }} overflow="hidden" bg="white">
      {/* Background Parallax Image */}
      <MotionBox
        style={{ y: yParallax }}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
      >
        <Image
          src={shopData?.coverImage?.url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"}
          alt="Shop Cover"
          w="full"
          h="full"
          objectFit="cover"
          filter="contrast(1.05) brightness(0.95)"
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, transparent, white)"
        />
      </MotionBox>

      {/* Main Content */}
      <Container maxW="container.xl" h="full" position="relative" zIndex={2}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          h="full"
          pt={{ base: 24, md: 32 }}
          pb={{ base: 12, md: 24 }}
        >
          {/* Horizontal Profile Strip - Solid Luxury */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            w="full"
          >
            <Box
              bg="white"
              borderRadius={{ base: "24px", md: "32px", xl: "full" }}
              p={{ base: 6, md: 10 }}
              boxShadow="0 30px 60px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={{ base: 6, md: 8, xl: 12 }}
                align="center"
                justify="space-between"
              >
                {/* 1. Left: Logo Avatar */}
                <Box
                  w={{ base: "90px", md: "110px", xl: "140px" }}
                  h={{ base: "90px", md: "110px", xl: "140px" }}
                  borderRadius="full"
                  bg="white"
                  p={1}
                  position="relative"
                  boxShadow="lg"
                  zIndex={1}
                  overflow="hidden"
                  border="4px solid"
                  borderColor="gray.50"
                >
                  <Image
                    src={shopData?.logo?.url || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=500&fit=crop"}
                    alt="Logo"
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>

                {/* 2. Center: Info & Tags */}
                <VStack align={{ base: "center", lg: "flex-start" }} spacing={4} flex={1}>
                  <VStack align={{ base: "center", lg: "flex-start" }} spacing={1}>
                    <HStack spacing={4} wrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
                      <Heading
                        fontSize={{ base: "xl", md: "2xl", xl: "3xl" }}
                        fontWeight="800"
                        color="gray.900"
                        letterSpacing="-0.02em"
                      >
                        {shopData?.name}
                      </Heading>
                      <HStack
                        spacing={1.5}
                        bg={isLive ? "green.50" : "red.50"}
                        px={3}
                        py={1}
                        borderRadius="full"
                        border="1px solid"
                        borderColor={isLive ? "green.100" : "red.100"}
                        display={{ base: "none", md: "flex" }}
                      >
                        <Box
                          w="6px"
                          h="6px"
                          bg={isLive ? "green.500" : "red.500"}
                          borderRadius="full"
                        />
                        <Text fontSize="2xs" fontWeight="800" color={isLive ? "green.700" : "red.700"}>
                          {isLive ? "OPEN NOW" : "CLOSED"}
                        </Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={3} color="gray.400">
                      <HStack spacing={1}>
                        <Icon as={FaStar} boxSize={3} color="orange.400" />
                        <Text fontWeight="800" fontSize="xs" color="gray.800">
                          {shopData?.ratings?.average?.toFixed(1) || "5.0"}
                        </Text>
                        <Text fontSize="xs" fontWeight="bold">
                          ({shopData?.ratings?.total || 0})
                        </Text>
                      </HStack>
                      <Box w="3px" h="3px" bg="gray.200" borderRadius="full" />
                      <Text color="blue.600" fontSize="xs" fontWeight="800" letterSpacing="0.02em">
                        {shopData?.categories?.[0]?.toUpperCase() || "RETAIL"}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Bio Description Center/Left */}
                  <VStack align={{ base: "center", md: "flex-start" }} spacing={2} maxW="xl">
                    <Text
                      color="gray.500"
                      fontSize="sm"
                      lineHeight="1.5"
                      textAlign={{ base: "center", md: "left" }}
                      fontWeight="500"
                    >
                      {isExpanded ? aboutText : `${previewText}${showReadMore ? '...' : ''}`}
                    </Text>
                    {showReadMore && (
                      <Button
                        variant="link"
                        color="blue.600"
                        fontSize="2xs"
                        fontWeight="800"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? "SHOW LESS" : "READ MORE"}
                      </Button>
                    )}
                  </VStack>
                </VStack>

                {/* 3. Right: Action Buttons */}
                <Stack
                  direction={{ base: "row", md: "column" }}
                  spacing={3}
                  align={{ base: "center", md: "stretch" }}
                  w={{ base: "full", md: "200px" }}
                >
                  <Button
                    leftIcon={<FiMessageCircle />}
                    bg="gray.900"
                    color="white"
                    size="lg"
                    borderRadius="xl"
                    fontWeight="800"
                    fontSize="sm"
                    _hover={{ bg: "black", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                  >
                    CONTACT
                  </Button>
                  <Button
                    leftIcon={<FiUserPlus />}
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    fontWeight="800"
                    fontSize="sm"
                    borderColor="gray.200"
                    color="gray.700"
                    _hover={{ bg: "gray.50", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                  >
                    Share
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
};




export default ShopHeroSection;
