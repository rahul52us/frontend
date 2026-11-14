"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaStore } from "react-icons/fa";
import {
  FiArrowLeft,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShare2,
  FiShoppingBag,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";

const MotionBox = motion(Box);

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatTimeString = (time?: string) => {
  if (!time) return "";
  const [h = 0, m = 0] = time.split(":").map(Number);
  const hour = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export interface ShopHeroSectionProps {
  shopData: any;
  onShopProductsClick?: () => void;
}

const ShopHeroSection: React.FC<ShopHeroSectionProps> = ({
  shopData,
  onShopProductsClick,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 400], [0, 80]);

  // Color tokens
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const chipBg = useColorModeValue("gray.100", "gray.800");
  const chipText = useColorModeValue("gray.700", "gray.200");
  const ghostBtnBorder = useColorModeValue("gray.200", "gray.700");
  const ghostBtnBg = useColorModeValue("white", "gray.800");
  const ghostBtnHover = useColorModeValue("gray.50", "gray.700");

  // Ratings calculation
  const avgRating = shopData?.ratings?.average ?? 4.8;
  const totalRatings = shopData?.ratings?.total ?? 0;

  // Address for directions
  const loc = shopData?.location;
  const formattedAddress = [
    loc?.address,
    loc?.city,
    loc?.state,
    loc?.postalCode || loc?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    formattedAddress || shopData?.name || ""
  )}`;

  const phone = shopData?.contactInfo?.phone;

  // Open status logic
  const status = useMemo(() => {
    const today = DAYS[new Date().getDay()] ?? "";
    const hours =
      shopData?.operatingHours?.find((d: any) => d.day === today) ?? null;
    const closedToday =
      Array.isArray(shopData?.closedDates) &&
      shopData.closedDates.includes(new Date().toISOString().split("T")[0]);

    let isOpen = false;
    if (!closedToday && hours?.open && hours?.close) {
      const [oh = 0, om = 0] = hours.open.split(":").map(Number);
      const [ch = 0, cm = 0] = hours.close.split(":").map(Number);
      const now = new Date().getHours() * 60 + new Date().getMinutes();
      isOpen = now >= oh * 60 + om && now < ch * 60 + cm;
    }
    return { today, hours, isOpen, closedToday };
  }, [shopData]);

  // Handle Share
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareData = {
      title: shopData?.name || "Shop Details",
      text: `Check out ${shopData?.name} on Business Sahayta`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      }
    } catch {
      // User cancelled share
    }
  };

  // Handle Save / Favorite
  const handleToggleSave = () => {
    setIsSaved((prev) => !prev);
    toast({
      title: !isSaved ? "Saved to favorites" : "Removed from favorites",
      status: !isSaved ? "success" : "info",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const coverUrl =
    shopData?.coverImage?.url ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop";

  return (
    <Box position="relative" w="full" overflow="hidden">
      {/* Cover Image Header */}
      <Box
        position="relative"
        h={{ base: "240px", md: "360px" }}
        w="full"
        overflow="hidden"
        bg="gray.900"
      >
        <MotionBox
          style={{ y: yParallax }}
          position="absolute"
          inset={0}
          w="full"
          h="full"
        >
          <Image
            src={coverUrl}
            alt={shopData?.name || "Shop Cover"}
            w="full"
            h="full"
            objectFit="cover"
            filter="brightness(0.85)"
            transform="scale(1.05)"
            transition="transform 0.4s ease"
          />
        </MotionBox>

        {/* Hero Overlay Gradient */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.7) 100%)"
        />

        {/* Top Floating Action Bar */}
        <Flex
          position="absolute"
          top={0}
          insetX={0}
          justify="space-between"
          align="center"
          p={{ base: 4, md: 6 }}
          zIndex={5}
        >
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft size={20} />}
            onClick={() => router.back()}
            size="md"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.85)"
            color="gray.800"
            _hover={{ bg: "white", transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.92)" }}
            backdropFilter="blur(8px)"
            boxShadow="sm"
          />

          <HStack spacing={2}>
            <Tooltip label="Share Shop" placement="bottom">
              <IconButton
                aria-label="Share"
                icon={<FiShare2 size={18} />}
                onClick={handleShare}
                size="md"
                borderRadius="full"
                bg="rgba(255, 255, 255, 0.85)"
                color="gray.800"
                _hover={{ bg: "white", transform: "scale(1.05)" }}
                _active={{ transform: "scale(0.92)" }}
                backdropFilter="blur(8px)"
                boxShadow="sm"
              />
            </Tooltip>

            <Tooltip
              label={isSaved ? "Saved" : "Save Shop"}
              placement="bottom"
            >
              <IconButton
                aria-label="Save"
                icon={
                  isSaved ? (
                    <FaHeart size={18} color="#e53e3e" />
                  ) : (
                    <FaRegHeart size={18} />
                  )
                }
                onClick={handleToggleSave}
                size="md"
                borderRadius="full"
                bg="rgba(255, 255, 255, 0.85)"
                color={isSaved ? "red.500" : "gray.800"}
                _hover={{ bg: "white", transform: "scale(1.05)" }}
                _active={{ transform: "scale(0.92)" }}
                backdropFilter="blur(8px)"
                boxShadow="sm"
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Box>

      {/* Identity Card Overlapping Cover */}
      <Container maxW="6xl" px={4} position="relative" zIndex={2}>
        <MotionBox
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          mt={{ base: "-70px", md: "-100px" }}
          bg={cardBg}
          borderRadius="3xl"
          p={{ base: 5, md: 8 }}
          boxShadow="0 10px 30px -5px rgba(0, 0, 0, 0.08)"
          border="1px solid"
          borderColor={borderColor}
        >
          {/* Logo & Main Info */}
          <Flex gap={{ base: 4, md: 6 }} align="flex-start">
            {/* Shop Logo */}
            <Box
              mt={{ base: "-46px", md: "-64px" }}
              w={{ base: "80px", md: "112px" }}
              h={{ base: "80px", md: "112px" }}
              flexShrink={0}
              borderRadius="2xl"
              overflow="hidden"
              border="4px solid"
              borderColor={cardBg}
              bg="gray.100"
              boxShadow="0 8px 20px -4px rgba(0,0,0,0.12)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {shopData?.logo?.url ? (
                <Image
                  src={shopData.logo.url}
                  alt={shopData.name}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                <Icon as={FaStore} boxSize={{ base: 8, md: 12 }} color="gray.400" />
              )}
            </Box>

            {/* Shop Name & Categories */}
            <Box minW={0} flex={1}>
              <HStack spacing={2} align="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}
                  fontWeight="800"
                  color={textPrimary}
                  letterSpacing="-0.02em"
                  noOfLines={1}
                >
                  {shopData?.name}
                </Heading>
                {(shopData?.verified || shopData?.isVerified) && (
                  <Tooltip label="Verified Shop" placement="top">
                    <Box as="span" display="inline-flex" color="blue.500">
                      <MdVerified size={24} />
                    </Box>
                  </Tooltip>
                )}
              </HStack>

              {shopData?.categories && shopData.categories.length > 0 && (
                <Text
                  mt={1}
                  fontSize={{ base: "xs", md: "sm" }}
                  color={textMuted}
                  fontWeight="medium"
                  noOfLines={1}
                >
                  {shopData.categories.slice(0, 3).join(" · ")}
                </Text>
              )}
            </Box>
          </Flex>

          {/* Badges / Chips Row */}
          <Flex
            mt={4}
            flexWrap="wrap"
            align="center"
            gap={2}
            fontSize="sm"
            fontWeight="semibold"
          >
            {totalRatings > 0 && (
              <HStack
                spacing={1.5}
                bg={chipBg}
                color={chipText}
                px={3}
                py={1}
                borderRadius="full"
              >
                <Icon as={FaStar} color="orange.400" boxSize={3.5} />
                <Text as="b" color={textPrimary}>
                  {Number(avgRating).toFixed(1)}
                </Text>
                <Text fontSize="xs" color={textMuted}>
                  ({totalRatings})
                </Text>
              </HStack>
            )}

            {/* Live Open / Closed Status Pill */}
            <HStack
              spacing={2}
              bg={status.isOpen ? "green.50" : "red.50"}
              color={status.isOpen ? "green.700" : "red.600"}
              px={3}
              py={1}
              borderRadius="full"
            >
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={status.isOpen ? "green.500" : "red.500"}
                boxShadow={
                  status.isOpen
                    ? "0 0 0 2px rgba(72, 187, 120, 0.3)"
                    : undefined
                }
              />
              <Text fontSize="xs" fontWeight="bold">
                {status.isOpen
                  ? `Open · till ${formatTimeString(status.hours?.close)}`
                  : "Closed now"}
              </Text>
            </HStack>

            {/* City Chip */}
            {loc?.city && (
              <HStack
                spacing={1.5}
                bg={chipBg}
                color={chipText}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                <Icon as={FiMapPin} boxSize={3.5} color="blue.500" />
                <Text>{loc.city}</Text>
              </HStack>
            )}
          </Flex>

          {/* Desktop Action Buttons */}
          <HStack
            mt={6}
            spacing={3}
            display={{ base: "none", md: "flex" }}
          >
            {phone && (
              <Button
                as="a"
                href={`tel:${phone}`}
                leftIcon={<FiPhone />}
                size="md"
                h="46px"
                px={5}
                borderRadius="2xl"
                border="1px solid"
                borderColor={ghostBtnBorder}
                bg={ghostBtnBg}
                color={textPrimary}
                fontWeight="semibold"
                _hover={{ bg: ghostBtnHover, transform: "scale(1.02)" }}
                _active={{ transform: "scale(0.96)" }}
                transition="all 0.2s"
              >
                Call
              </Button>
            )}

            <Button
              as="a"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FiNavigation />}
              size="md"
              h="46px"
              px={5}
              borderRadius="2xl"
              border="1px solid"
              borderColor={ghostBtnBorder}
              bg={ghostBtnBg}
              color={textPrimary}
              fontWeight="semibold"
              _hover={{ bg: ghostBtnHover, transform: "scale(1.02)" }}
              _active={{ transform: "scale(0.96)" }}
              transition="all 0.2s"
            >
              Directions
            </Button>

            <Button
              onClick={onShopProductsClick}
              leftIcon={<FiShoppingBag />}
              size="md"
              h="46px"
              px={6}
              borderRadius="2xl"
              bgGradient="linear(to-r, blue.600, indigo.600)"
              color="white"
              fontWeight="bold"
              boxShadow="0 4px 15px rgba(37, 99, 235, 0.35)"
              _hover={{
                bgGradient: "linear(to-r, blue.700, indigo.700)",
                transform: "scale(1.02)",
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.45)",
              }}
              _active={{ transform: "scale(0.96)" }}
              transition="all 0.2s"
            >
              Shop products
            </Button>
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ShopHeroSection;
