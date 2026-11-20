"use client";

import {
  Badge,
  Box,
  Button,
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
import React, { memo, useCallback, useMemo, useState } from "react";
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

const ShopHeroSection: React.FC<ShopHeroSectionProps> = memo(({
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
  const formattedAddress = useMemo(() => {
    return [
      loc?.address,
      loc?.city,
      loc?.state,
      loc?.postalCode || loc?.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }, [loc?.address, loc?.city, loc?.postalCode, loc?.pincode, loc?.state]);

  const directionsUrl = useMemo(
    () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      formattedAddress || shopData?.name || ""
    )}`,
    [formattedAddress, shopData?.name]
  );

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
  const handleShare = useCallback(async () => {
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
  }, [shopData?.name, toast]);

  // Handle Save / Favorite
  const handleToggleSave = useCallback(() => {
    setIsSaved((prev) => {
      const next = !prev;
      toast({
        title: next ? "Saved to favorites" : "Removed from favorites",
        status: next ? "success" : "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return next;
    });
  }, [toast]);

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
          />
        </MotionBox>
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
        />

        {/* Top Floating Actions Bar */}
        <Flex
          position="absolute"
          top={{ base: 4, md: 6 }}
          left={{ base: 4, md: 8 }}
          right={{ base: 4, md: 8 }}
          justify="space-between"
          align="center"
          zIndex={10}
        >
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft size={20} />}
            onClick={() => router.back()}
            size="md"
            borderRadius="full"
            bg="rgba(0, 0, 0, 0.5)"
            color="white"
            backdropFilter="blur(8px)"
            _hover={{ bg: "rgba(0, 0, 0, 0.75)", transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
            transition="all 0.2s"
          />

          <HStack spacing={2}>
            <IconButton
              aria-label="Share"
              icon={<FiShare2 size={18} />}
              onClick={handleShare}
              size="md"
              borderRadius="full"
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              backdropFilter="blur(8px)"
              _hover={{ bg: "rgba(0, 0, 0, 0.75)", transform: "scale(1.05)" }}
              _active={{ transform: "scale(0.95)" }}
              transition="all 0.2s"
            />
            <IconButton
              aria-label="Favorite"
              icon={
                isSaved ? (
                  <FaHeart size={18} color="#EF4444" />
                ) : (
                  <FaRegHeart size={18} />
                )
              }
              onClick={handleToggleSave}
              size="md"
              borderRadius="full"
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              backdropFilter="blur(8px)"
              _hover={{ bg: "rgba(0, 0, 0, 0.75)", transform: "scale(1.05)" }}
              _active={{ transform: "scale(0.95)" }}
              transition="all 0.2s"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Floating Identity & Info Card */}
      <Box
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        position="relative"
        mt={{ base: "-60px", md: "-80px" }}
        zIndex={10}
      >
        <Box
          bg={cardBg}
          borderRadius={{ base: "2xl", md: "3xl" }}
          p={{ base: 5, md: 8 }}
          boxShadow="0 10px 40px -10px rgba(0, 0, 0, 0.12)"
          border="1px solid"
          borderColor={borderColor}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "flex-end" }}
            justify="space-between"
            gap={6}
          >
            {/* Left: Avatar + Titles */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "flex-start", sm: "center" }}
              gap={5}
              flex={1}
            >
              {/* Logo / Avatar with verified badge */}
              <Box position="relative">
                <Box
                  boxSize={{ base: "90px", md: "115px" }}
                  borderRadius="2xl"
                  border="4px solid"
                  borderColor={cardBg}
                  overflow="hidden"
                  bg="gray.100"
                  boxShadow="md"
                  flexShrink={0}
                >
                  {shopData?.logo?.url ? (
                    <Image
                      src={shopData.logo.url}
                      alt={shopData.name}
                      boxSize="full"
                      objectFit="cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <Flex
                      boxSize="full"
                      bg="linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
                      align="center"
                      justify="center"
                      color="white"
                    >
                      <Icon as={FaStore} boxSize={8} />
                    </Flex>
                  )}
                </Box>
                {shopData?.isVerified && (
                  <Tooltip label="Verified Merchant" placement="top">
                    <Box
                      position="absolute"
                      bottom="-4px"
                      right="-4px"
                      bg={cardBg}
                      borderRadius="full"
                      p="2px"
                    >
                      <Icon as={MdVerified} boxSize={6} color="blue.500" />
                    </Box>
                  </Tooltip>
                )}
              </Box>

              {/* Text Info */}
              <Box minW={0} flex={1}>
                <HStack spacing={2.5} flexWrap="wrap" mb={1}>
                  <Heading
                    as="h1"
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="800"
                    color={textPrimary}
                    letterSpacing="-0.02em"
                    lineHeight="shorter"
                  >
                    {shopData?.name}
                  </Heading>

                  {/* Open / Closed Live Badge */}
                  <Badge
                    colorScheme={status.isOpen ? "green" : "red"}
                    variant="subtle"
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {status.isOpen ? "● Open Now" : "○ Closed"}
                  </Badge>
                </HStack>

                {/* Tagline / Subtitle */}
                {shopData?.tagline && (
                  <Text
                    fontSize="sm"
                    color={textMuted}
                    mb={2.5}
                    noOfLines={2}
                  >
                    {shopData.tagline}
                  </Text>
                )}

                {/* Chips Row: Category, Rating, Location */}
                <HStack
                  spacing={{ base: 2, md: 3 }}
                  flexWrap="wrap"
                  fontSize="xs"
                  color={chipText}
                >
                  {/* Category Chip */}
                  {shopData?.category && (
                    <HStack
                      bg={chipBg}
                      px={2.5}
                      py={1}
                      borderRadius="md"
                      spacing={1.5}
                    >
                      <Icon as={FiShoppingBag} boxSize={3.5} />
                      <Text fontWeight="semibold">
                        {typeof shopData.category === "object"
                          ? shopData.category?.name
                          : shopData.category}
                      </Text>
                    </HStack>
                  )}

                  {/* Rating Chip */}
                  <HStack
                    bg={chipBg}
                    px={2.5}
                    py={1}
                    borderRadius="md"
                    spacing={1.5}
                  >
                    <Icon as={FaStar} boxSize={3} color="orange.400" />
                    <Text fontWeight="bold">{avgRating.toFixed(1)}</Text>
                    {totalRatings > 0 && (
                      <Text color={textMuted}>({totalRatings})</Text>
                    )}
                  </HStack>

                  {/* Location Chip */}
                  {loc?.city && (
                    <HStack
                      bg={chipBg}
                      px={2.5}
                      py={1}
                      borderRadius="md"
                      spacing={1.5}
                    >
                      <Icon as={FiMapPin} boxSize={3.5} />
                      <Text fontWeight="semibold">
                        {loc.city}
                        {loc.state ? `, ${loc.state}` : ""}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </Box>
            </Flex>

            {/* Right: Quick Action Buttons (Call, Directions, Shop) */}
            <HStack
              spacing={2.5}
              w={{ base: "full", md: "auto" }}
              justify={{ base: "stretch", md: "flex-end" }}
              flexShrink={0}
            >
              {phone && (
                <Button
                  as="a"
                  href={`tel:${phone}`}
                  leftIcon={<FiPhone />}
                  size="md"
                  h="44px"
                  px={4}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={ghostBtnBorder}
                  bg={ghostBtnBg}
                  color={textPrimary}
                  _hover={{ bg: ghostBtnHover, transform: "translateY(-1px)" }}
                  _active={{ transform: "scale(0.98)" }}
                  transition="all 0.2s"
                  fontWeight="bold"
                  fontSize="sm"
                  flex={{ base: 1, md: "initial" }}
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
                h="44px"
                px={4}
                borderRadius="xl"
                border="1px solid"
                borderColor={ghostBtnBorder}
                bg={ghostBtnBg}
                color={textPrimary}
                _hover={{ bg: ghostBtnHover, transform: "translateY(-1px)" }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.2s"
                fontWeight="bold"
                fontSize="sm"
                flex={{ base: 1, md: "initial" }}
              >
                Directions
              </Button>

              <Button
                onClick={onShopProductsClick}
                leftIcon={<FiShoppingBag />}
                size="md"
                h="44px"
                px={5}
                borderRadius="xl"
                bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
                color="white"
                fontWeight="bold"
                fontSize="sm"
                boxShadow="0 4px 16px rgba(37, 99, 235, 0.35)"
                _hover={{
                  opacity: 0.9,
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(37, 99, 235, 0.45)",
                }}
                _active={{ transform: "scale(0.98)" }}
                transition="all 0.2s"
                flex={{ base: 2, md: "initial" }}
              >
                Shop Products
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
});

ShopHeroSection.displayName = "ShopHeroSection";

export default ShopHeroSection;
