"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar } from "react-icons/fa";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiPhoneCall,
} from "react-icons/fi";

const pulseRing = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(72, 187, 120, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
`;

interface ShopCardProps {
  shop: {
    _id?: string;
    name: string;
    description: string;
    rating?: number;
    location: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    contactInfo: {
      phone: string;
      email: string;
      website: string;
      socialMedia: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
        youtube: string;
      };
    };
    logo: {
      url: string;
      name: string;
    };
    coverImage: {
      url: string;
      name: string;
    };
    operatingHours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    isActive: boolean;
    shopStatus: string;
    categories: string[];
    distanceMeters?: number;
    distanceKm?: number;
  };
}

const MotionBox = motion(Box);

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const router = useRouter();

  // Theme-aware tokens hoisted to top
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const titleColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const dockBg = useColorModeValue("#F8FAFC", "gray.900");
  const chipBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const chipColor = useColorModeValue("gray.700", "gray.200");

  const shopSlug = shop?.name?.replace(/\s+/g, "-").toLowerCase() || "shop";

  const distanceKm =
    typeof shop?.distanceKm === "number"
      ? Number(shop.distanceKm.toFixed(1))
      : typeof shop?.distanceMeters === "number"
      ? Number((shop.distanceMeters / 1000).toFixed(1))
      : null;

  const coverUrl =
    shop?.coverImage?.url ||
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80";

  const logoUrl =
    shop?.logo?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      shop?.name || "Shop"
    )}&background=2563EB&color=fff&bold=true`;

  const isOpen =
    !shop?.shopStatus ||
    shop.shopStatus.toLowerCase() === "open" ||
    shop.shopStatus.toLowerCase() === "active" ||
    shop?.isActive;

  const rating = shop?.rating ? Number(shop.rating).toFixed(1) : "4.8";
  const locationLabel =
    [shop?.location?.address, shop?.location?.city]
      .filter(Boolean)
      .join(", ") || "Nearby Local Store";

  const todayKey = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof ShopCardProps["shop"]["operatingHours"];
  const todayHours = shop?.operatingHours?.[todayKey] || "9:00 AM – 9:00 PM";

  const handleNavigate = () => {
    if (shop?._id) {
      router.push(`/shop?id=${shop._id}&slug=${shopSlug}`);
      return;
    }
    router.push(`/shop-details?title=${shopSlug}`);
  };

  const handleCallShop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (shop?.contactInfo?.phone) {
      window.location.href = `tel:${shop.contactInfo.phone}`;
    }
  };

  const handleOpenDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(
      `${shop?.name || ""} ${shop?.location?.address || ""} ${
        shop?.location?.city || ""
      }`.trim()
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <>
      {/* ===================================================================
          1. NATIVE MOBILE APP CARD (Horizontal, Compact, Fast-Scanning)
          Visible on Mobile (`base`), Hidden on Tablet/Desktop (`md`)
         =================================================================== */}
      <MotionBox
        display={{ base: "block", md: "none" }}
        w="full"
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={2.5}
        boxShadow="0 2px 10px rgba(0, 0, 0, 0.03)"
        cursor="pointer"
        onClick={handleNavigate}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        position="relative"
        overflow="hidden"
      >
        <Flex gap={3} align="center">
          {/* Left: Square Thumbnail with Corner Logo & Status Badge */}
          <Box
            position="relative"
            w="88px"
            h="88px"
            borderRadius="xl"
            overflow="hidden"
            bg="gray.100"
            flexShrink={0}
          >
            <Image
              src={coverUrl}
              alt={shop?.name}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
            />
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, blackAlpha.700 0%, transparent 60%)"
            />

            {/* Top-Left Live Status Pill */}
            <HStack
              position="absolute"
              top={1.5}
              left={1.5}
              spacing={1}
              bg="whiteAlpha.950"
              px={1.5}
              py={0.5}
              rounded="md"
              boxShadow="2xs"
            >
              <Box
                w="5px"
                h="5px"
                rounded="full"
                bg={isOpen ? "green.500" : "red.500"}
                animation={isOpen ? `${pulseRing} 2s infinite` : undefined}
              />
              <Text
                fontSize="8px"
                fontWeight="800"
                color="gray.800"
                textTransform="uppercase"
              >
                {isOpen ? "Open" : "Closed"}
              </Text>
            </HStack>

            {/* Bottom-Left Mini Store Avatar + Distance */}
            <HStack
              position="absolute"
              bottom={1.5}
              left={1.5}
              right={1.5}
              justify="space-between"
              align="flex-end"
            >
              <Image
                src={logoUrl}
                alt={shop?.name}
                boxSize="26px"
                rounded="lg"
                objectFit="cover"
                border="1.5px solid white"
                bg="white"
                boxShadow="sm"
              />
              {distanceKm !== null && (
                <Badge
                  bg="blackAlpha.700"
                  color="white"
                  fontSize="8px"
                  fontWeight="700"
                  px={1.5}
                  py={0.5}
                  rounded="md"
                  backdropFilter="blur(4px)"
                >
                  {distanceKm} km
                </Badge>
              )}
            </HStack>
          </Box>

          {/* Center: Store Info (App-Style Hierarchy) */}
          <VStack align="flex-start" spacing={1} flex="1" minW={0}>
            {/* Title + Verified */}
            <HStack spacing={1} w="full" align="center">
              <Text
                fontSize="sm"
                textTransform={'capitalize'}
                fontWeight="700"
                color={titleColor}
                noOfLines={1}
                lineHeight="1.2"
              >
                {shop?.name}
              </Text>
              <Icon
                as={FiCheckCircle}
                color="blue.500"
                boxSize={3.5}
                flexShrink={0}
              />
            </HStack>

            {/* Rating Pill + City/Location */}
            <HStack spacing={2} w="full">
              <HStack
                spacing={0.5}
                bg="green.600"
                color="white"
                px={1.5}
                py={0.2}
                rounded="md"
                fontSize="10px"
                fontWeight="800"
                flexShrink={0}
              >
                <Text>{rating}</Text>
                <Icon as={FaStar} boxSize={2} />
              </HStack>

              <HStack
                spacing={1}
                color={mutedText}
                fontSize="11px"
                fontWeight="500"
                minW={0}
              >
                <Icon as={FiMapPin} boxSize={2.5} color="gray.400" flexShrink={0} />
                <Text noOfLines={1}>
                  {shop?.location?.city || locationLabel}
                </Text>
              </HStack>
            </HStack>

            {/* Categories + Quick Action Buttons Row */}
            <Flex
              w="full"
              align="center"
              justify="space-between"
              pt={1}
              gap={2}
            >
              {/* Category Tags */}
              <HStack spacing={1} overflow="hidden" flex="1">
                {(shop?.categories?.length ? shop.categories : ["Local Shop"])
                  .slice(0, 2)
                  .map((cat, idx) => (
                    <Badge
                      key={idx}
                      bg={chipBg}
                      color={chipColor}
                      fontSize="9px"
                      fontWeight="600"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      textTransform="none"
                      noOfLines={1}
                    >
                      {cat}
                    </Badge>
                  ))}
              </HStack>

              {/* Native App Quick-Tap Icons (Call, Map, Enter) */}
              <HStack spacing={1.5} flexShrink={0}>
                {shop?.contactInfo?.phone && (
                  <IconButton
                    aria-label="Call store"
                    icon={<FiPhoneCall size={12} />}
                    size="xs"
                    w="26px"
                    h="26px"
                    minW="26px"
                    rounded="full"
                    bg="green.50"
                    color="green.600"
                    onClick={handleCallShop}
                  />
                )}
                <IconButton
                  aria-label="Directions"
                  icon={<FiNavigation size={12} />}
                  size="xs"
                  w="26px"
                  h="26px"
                  minW="26px"
                  rounded="full"
                  bg="blue.50"
                  color="blue.600"
                  onClick={handleOpenDirections}
                />
                <Flex
                  w="26px"
                  h="26px"
                  rounded="full"
                  bg="gray.900"
                  color="white"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiChevronRight} boxSize={3.5} />
                </Flex>
              </HStack>
            </Flex>
          </VStack>
        </Flex>
      </MotionBox>

      {/* ===================================================================
          2. DESKTOP VERTICAL STOREFRONT CARD
          Hidden on Mobile (`base`), Visible on Tablet/Desktop (`md`)
         =================================================================== */}
      <MotionBox
        display={{ base: "none", md: "flex" }}
        w="full"
        h="full"
        flexDirection="column"
        justifyContent="space-between"
        bg={cardBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        p={2}
        cursor="pointer"
        role="group"
        onClick={handleNavigate}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2 }}
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.04)"
        _hover={{
          // borderColor: "blue.300",
          boxShadow: "0 16px 32px -10px rgba(37, 99, 235, 0.16)",
        }}
      >
        <Box>
          {/* Framed Inset Cover Image */}
          <Box
            position="relative"
            h="145px"
            w="full"
            borderRadius="xl"
            overflow="hidden"
            bg="gray.100"
          >
            <Image
              src={coverUrl}
              alt={shop?.coverImage?.name || shop?.name || "Shop cover"}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
              transition="transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              _groupHover={{ transform: "scale(1.07)" }}
            />

            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-b, blackAlpha.400 0%, transparent 45%, blackAlpha.700 100%)"
            />

            {/* Top-Left: Live Pulsing Status Pill */}
            <HStack
              position="absolute"
              top={2.5}
              left={2.5}
              spacing={1.5}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="whiteAlpha.950"
              backdropFilter="blur(8px)"
              boxShadow="sm"
            >
              <Box
                w="7px"
                h="7px"
                borderRadius="full"
                bg={isOpen ? "green.500" : "red.500"}
                animation={isOpen ? `${pulseRing} 2s infinite` : undefined}
              />
              <Text
                fontSize="10px"
                fontWeight="800"
                color="gray.800"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                {shop?.shopStatus || (isOpen ? "Open Now" : "Closed")}
              </Text>
            </HStack>

            {/* Top-Right: Distance Pill */}
            {distanceKm !== null && (
              <HStack
                position="absolute"
                top={2.5}
                right={2.5}
                spacing={1}
                px={2.5}
                py={1}
                borderRadius="full"
                bg="blackAlpha.700"
                color="white"
                backdropFilter="blur(8px)"
              >
                <Icon as={FiNavigation} boxSize={2.5} color="blue.300" />
                <Text fontSize="10px" fontWeight="700">
                  {distanceKm} km
                </Text>
              </HStack>
            )}

            {/* Bottom-Right of Cover: Operating Hours */}
            <HStack
              position="absolute"
              bottom={2}
              right={2.5}
              spacing={1}
              color="whiteAlpha.900"
              fontSize="10px"
              fontWeight="600"
            >
              <Icon as={FiClock} boxSize={2.5} />
              <Text noOfLines={1}>{todayHours}</Text>
            </HStack>
          </Box>

          {/* Overlapping Avatar + Rating Row */}
          <Flex
            px={2.5}
            mt="-26px"
            mb={2}
            justify="space-between"
            align="flex-end"
            position="relative"
            zIndex={2}
          >
            <Box
              boxSize="52px"
              borderRadius="2xl"
              bg="white"
              p="3px"
              boxShadow="0 6px 16px rgba(0, 0, 0, 0.12)"
              border="1px solid"
              borderColor="gray.100"
              transition="transform 0.25s ease"
              _groupHover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={logoUrl}
                alt={shop?.logo?.name || shop?.name}
                w="full"
                h="full"
                objectFit="cover"
                borderRadius="xl"
              />
            </Box>

            <HStack
              spacing={1}
              bg="amber.50"
              border="1px solid"
              borderColor="amber.200"
              px={2}
              py={0.5}
              borderRadius="lg"
            >
              <Icon as={FaStar} color="amber.400" boxSize={3} />
              <Text fontSize="xs" fontWeight="800" color="gray.700">
                {rating}
              </Text>
              <Text fontSize="10px" color="gray.500" fontWeight="600">
                • Verified
              </Text>
            </HStack>
          </Flex>

          {/* Store Details Body */}
          <Box px={2.5} pb={3}>
            <HStack spacing={1.5} align="center">
              <Text
                fontSize="md"
                textTransform={'capitalize'}
                fontWeight="700"
                color={titleColor}
                noOfLines={1}
                letterSpacing="-0.01em"
                _groupHover={{ color: "blue.600" }}
                transition="color 0.15s ease"
              >
                {shop?.name}
              </Text>
              <Icon
                as={FiCheckCircle}
                color="blue.500"
                boxSize={3.5}
                flexShrink={0}
              />
            </HStack>

            <HStack spacing={1} mt={0.5} color={mutedText}>
              <Icon as={FiMapPin} boxSize={3} color="blue.500" flexShrink={0} />
              <Text fontSize="xs" fontWeight="400" noOfLines={1}>
                {locationLabel}
              </Text>
            </HStack>

            <Text
              fontSize="xs"
              color={mutedText}
              noOfLines={1}
              mt={1.5}
              lineHeight="1.4"
            >
              {shop?.description ||
                "Quality products & fast local delivery from your neighborhood store."}
            </Text>

            <HStack spacing={1.5} mt={2.5} overflow="hidden">
              {(shop?.categories?.length ? shop.categories : ["Local Store"])
                .slice(0, 2)
                .map((cat, idx) => (
                  <Badge
                    key={idx}
                    bg={chipBg}
                    color={chipColor}
                    fontSize="10px"
                    fontWeight="600"
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    textTransform="none"
                    noOfLines={1}
                  >
                    {cat}
                  </Badge>
                ))}
              {shop?.categories?.length > 2 && (
                <Badge
                  bg="blue.50"
                  color="blue.600"
                  fontSize="10px"
                  fontWeight="700"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  +{shop.categories.length - 2}
                </Badge>
              )}
            </HStack>
          </Box>
        </Box>

        {/* Bottom Action Dock */}
        <Flex
          bg={dockBg}
          p={1.5}
          borderRadius="xl"
          align="center"
          justify="space-between"
          gap={2}
          mt="auto"
        >
          <HStack spacing={1.5}>
            {shop?.contactInfo?.phone && (
              <Tooltip label={`Call ${shop.contactInfo.phone}`} hasArrow>
                <IconButton
                  aria-label="Call shop"
                  icon={<FiPhoneCall size={14} />}
                  size="sm"
                  w="32px"
                  h="32px"
                  minW="32px"
                  borderRadius="lg"
                  bg="white"
                  color="green.600"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="2xs"
                  _hover={{
                    bg: "green.500",
                    color: "white",
                    borderColor: "green.500",
                  }}
                  onClick={handleCallShop}
                />
              </Tooltip>
            )}

            <Tooltip label="Get Directions" hasArrow>
              <IconButton
                aria-label="Directions"
                icon={<FiMapPin size={14} />}
                size="sm"
                w="32px"
                h="32px"
                minW="32px"
                borderRadius="lg"
                bg="white"
                color="blue.600"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="2xs"
                _hover={{
                  bg: "blue.600",
                  color: "white",
                  borderColor: "blue.600",
                }}
                onClick={handleOpenDirections}
              />
            </Tooltip>
          </HStack>

          <Button
            size="sm"
            h="32px"
            px={4}
            flex="1"
            maxW="150px"
            borderRadius="lg"
            bgGradient="linear(to-r, blue.600, purple.600)"
            color="white"
            fontSize="xs"
            fontWeight="700"
            rightIcon={<FiArrowUpRight size={14} />}
            _hover={{
              bgGradient: "linear(to-r, blue.700, purple.700)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
          >
            Visit Store
          </Button>
        </Flex>
      </MotionBox>
    </>
  );
};

export default ShopCard;