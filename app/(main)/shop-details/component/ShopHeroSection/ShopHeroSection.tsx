"use client";
import {
  Badge,
  Box,
  Button,
  Divider,
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
  FiClock,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShare2,
  FiShoppingBag,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { DAYS, fallback } from "./constant";

const MotionBox = motion(Box);

export interface ShopHeroSectionProps {
  shopData: any;
  onShopProductsClick?: () => void;
}

const formatTime = (t?: string) => {
  if (!t) return "";
  const [h = 0, m = 0] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
};

const glassBtn = {
  size: "md",
  borderRadius: "full",
  bg: "rgba(0, 0, 0, 0.45)",
  color: "white",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  _hover: { bg: "rgba(0, 0, 0, 0.7)", transform: "scale(1.06)" },
  _active: { transform: "scale(0.94)" },
  transition: "all 0.2s",
} as const;

const ShopHeroSection: React.FC<ShopHeroSectionProps> = memo(
  ({ shopData, onShopProductsClick }) => {
    const router = useRouter();
    const toast = useToast();
    const [isSaved, setIsSaved] = useState(false);
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 300], [0, 40]);

    // Color tokens
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "whiteAlpha.200");
    const textPrimary = useColorModeValue("gray.900", "white");
    const textMuted = useColorModeValue("gray.500", "gray.400");
    const chipBg = useColorModeValue("gray.100", "whiteAlpha.200");
    const chipText = useColorModeValue("gray.700", "gray.200");
    const ghostBtnBorder = useColorModeValue("gray.200", "whiteAlpha.300");
    const ghostBtnBg = useColorModeValue("white", "whiteAlpha.100");
    const ghostBtnHover = useColorModeValue("gray.50", "whiteAlpha.200");
    const callColor = useColorModeValue("green.500", "green.300");
    const dirColor = useColorModeValue("blue.500", "blue.300");

    // Ratings
    const avgRating = shopData?.ratings?.average ?? 4.8;
    const totalRatings = shopData?.ratings?.total ?? 0;

    // Address for directions
    const loc = shopData?.location;
    const formattedAddress = useMemo(() => {
      return [loc?.address, loc?.city, loc?.state, loc?.postalCode || loc?.pincode]
        .filter(Boolean)
        .join(", ");
    }, [loc?.address, loc?.city, loc?.postalCode, loc?.pincode, loc?.state]);

    const directionsUrl = useMemo(
      () =>
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          formattedAddress || shopData?.name || ""
        )}`,
      [formattedAddress, shopData?.name]
    );

    const phone = shopData?.contactInfo?.phone;

    // Open status logic
    const status = useMemo(() => {
      const now = new Date();
      const today = DAYS[now.getDay()] ?? "";
      const hours =
        shopData?.operatingHours?.find((d: any) => d.day === today) ?? null;
      const closedToday =
        Array.isArray(shopData?.closedDates) &&
        shopData.closedDates.includes(now.toISOString().split("T")[0]);

      let isOpen = false;
      let hint = "";
      if (closedToday) {
        hint = "Closed today";
      } else if (hours?.open && hours?.close) {
        const [oh = 0, om = 0] = hours.open.split(":").map(Number);
        const [ch = 0, cm = 0] = hours.close.split(":").map(Number);
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const openMin = oh * 60 + om;
        const closeMin = ch * 60 + cm;
        isOpen = nowMin >= openMin && nowMin < closeMin;
        if (isOpen) hint = `Closes ${formatTime(hours.close)}`;
        else if (nowMin < openMin) hint = `Opens ${formatTime(hours.open)}`;
      }
      return { today, hours, isOpen, closedToday, hint };
    }, [shopData]);

    // Share
    const handleShare = useCallback(async () => {
      if (typeof window === "undefined") return;
      const shareData = {
        title: shopData?.name || "Shop Details",
        text: `Check out ${shopData?.name} on Business Sahayata`,
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

    // Save / Favorite
    const handleToggleSave = useCallback(() => {
      const next = !isSaved;
      setIsSaved(next);
      toast({
        title: next ? "Saved to favorites" : "Removed from favorites",
        status: next ? "success" : "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }, [isSaved, toast]);

    const coverUrl = shopData?.coverImage?.url || fallback;

    const mobileIconBtn = {
      flex: 1,
      h: "42px",
      borderRadius: "xl",
      border: "1px solid",
      borderColor: ghostBtnBorder,
      bg: ghostBtnBg,
      _hover: { bg: ghostBtnHover, transform: "translateY(-1px)" },
      _active: { transform: "scale(0.96)" },
      transition: "all 0.2s",
    } as const;

    const desktopBtn = {
      size: "md",
      h: "44px",
      px: 4,
      borderRadius: "xl",
      border: "1px solid",
      borderColor: ghostBtnBorder,
      bg: ghostBtnBg,
      color: textPrimary,
      fontWeight: "bold",
      fontSize: "sm",
      _hover: { bg: ghostBtnHover, transform: "translateY(-1px)" },
      _active: { transform: "scale(0.98)" },
      transition: "all 0.2s",
    } as const;

    // Tagline + chips (rendered beside the logo on desktop, full width below on mobile)
    const details = (
      <>
        {shopData?.tagline && (
          <Text fontSize="sm" color={textMuted} mb={2.5} noOfLines={2}>
            {shopData.tagline}
          </Text>
        )}
        <Flex gap={2} flexWrap="wrap" fontSize="xs" color={chipText}>
          {shopData?.category && (
            <HStack bg={chipBg} px={2.5} py={1} borderRadius="full" spacing={1.5}>
              <Icon as={FiShoppingBag} boxSize={3.5} />
              <Text fontWeight="semibold">
                {typeof shopData.category === "object"
                  ? shopData.category?.name
                  : shopData.category}
              </Text>
            </HStack>
          )}
          <HStack bg={chipBg} px={2.5} py={1} borderRadius="full" spacing={1.5}>
            <Icon as={FaStar} boxSize={3} color="orange.400" />
            <Text fontWeight="bold">{avgRating.toFixed(1)}</Text>
            {totalRatings > 0 && <Text color={textMuted}>({totalRatings})</Text>}
          </HStack>
          {loc?.city && (
            <HStack bg={chipBg} px={2.5} py={1} borderRadius="full" spacing={1.5}>
              <Icon as={FiMapPin} boxSize={3.5} />
              <Text fontWeight="semibold" noOfLines={1}>
                {loc.city}
                {loc.state ? `, ${loc.state}` : ""}
              </Text>
            </HStack>
          )}
        </Flex>
      </>
    );

    return (
      <Box w="full">
        {/* Cover */}
        <Box
          position="relative"
          h={{ base: "180px", md: "320px" }}
          w="full"
          overflow="hidden"
          bg="gray.900"
        >
          <MotionBox
            style={{ y: yParallax }}
            position="absolute"
            top="-30%"
            left={0}
            right={0}
            h="130%"
          >
            <Image
              src={coverUrl}
              alt={shopData?.name || "Shop Cover"}
              w="full"
              h="full"
              objectFit="cover"
              filter="brightness(0.88)"
            />
          </MotionBox>
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            bgGradient="linear(to-b, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.25) 100%)"
          />

          {/* Floating actions */}
          <Flex
            position="absolute"
            top={{ base: 3, md: 6 }}
            left={{ base: 3, md: 8 }}
            right={{ base: 3, md: 8 }}
            justify="space-between"
            align="center"
            zIndex={10}
          >
            <IconButton
              aria-label="Go Back"
              icon={<FiArrowLeft size={20} />}
              onClick={() => router.back()}
              {...glassBtn}
            />
            <HStack spacing={2}>
              <IconButton
                aria-label="Share"
                icon={<FiShare2 size={18} />}
                onClick={handleShare}
                {...glassBtn}
              />
              <IconButton
                aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
                icon={
                  isSaved ? (
                    <FaHeart size={18} color="#EF4444" />
                  ) : (
                    <FaRegHeart size={18} />
                  )
                }
                onClick={handleToggleSave}
                {...glassBtn}
              />
            </HStack>
          </Flex>
        </Box>

        {/* Info card (sits below the cover, no overlap) */}
        <Box maxW="7xl" mx="auto" px={{ base: 3, md: 8 }} pt={{ base: 3, md: 6 }}>
          <MotionBox
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            bg={cardBg}
            borderRadius={{ base: "2xl", md: "3xl" }}
            p={{ base: 4, md: 6 }}
            boxShadow="0 8px 30px -12px rgba(0, 0, 0, 0.15)"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex align={{ base: "center", md: "flex-start" }} gap={{ base: 3, md: 5 }}>
              {/* Logo */}
              <Box position="relative" flexShrink={0}>
                <Box
                  boxSize={{ base: "68px", md: "112px" }}
                  borderRadius={{ base: "xl", md: "2xl" }}
                  border="1px solid"
                  borderColor={borderColor}
                  overflow="hidden"
                  bg="gray.100"
                  boxShadow="sm"
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
                      <Icon as={FaStore} boxSize={{ base: 6, md: 8 }} />
                    </Flex>
                  )}
                </Box>
                {shopData?.isVerified && (
                  <Tooltip label="Verified Merchant" placement="top">
                    <Box
                      position="absolute"
                      bottom="-5px"
                      right="-5px"
                      bg={cardBg}
                      borderRadius="full"
                      p="2px"
                    >
                      <Icon as={MdVerified} boxSize={5} color="blue.500" />
                    </Box>
                  </Tooltip>
                )}
              </Box>

              {/* Name + status (+ details on desktop) */}
              <Box minW={0} flex={1}>
                <Heading
                  as="h1"
                  fontSize={{ base: "lg", md: "3xl" }}
                  fontWeight="800"
                  color={textPrimary}
                  letterSpacing="-0.02em"
                  lineHeight="shorter"
                  noOfLines={2}
                >
                  {shopData?.name}
                </Heading>

                <HStack spacing={2} mt={1.5} mb={{ base: 0, md: 3 }} flexWrap="wrap">
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
                  {status.hint && (
                    <HStack spacing={1} color={textMuted} fontSize="xs">
                      <Icon as={FiClock} boxSize={3} />
                      <Text>{status.hint}</Text>
                    </HStack>
                  )}
                </HStack>

                <Box display={{ base: "none", md: "block" }}>{details}</Box>
              </Box>

              {/* Desktop actions */}
              <HStack
                spacing={2.5}
                flexShrink={0}
                alignSelf="center"
                display={{ base: "none", md: "flex" }}
              >
                {phone && (
                  <Button as="a" href={`tel:${phone}`} leftIcon={<FiPhone />} {...desktopBtn}>
                    Call
                  </Button>
                )}
                <Button
                  as="a"
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<FiNavigation />}
                  {...desktopBtn}
                >
                  Directions
                </Button>
                <Button
                  onClick={onShopProductsClick}
                  leftIcon={<FiShoppingBag />}
                  h="44px"
                  px={5}
                  borderRadius="xl"
                  bgGradient="linear(to-r, var(--color-primary, #2563eb), var(--color-secondary, #4f46e5))"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  boxShadow="0 4px 16px rgba(37, 99, 235, 0.35)"
                  _hover={{
                    opacity: 0.92,
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.45)",
                  }}
                  _active={{ transform: "scale(0.98)" }}
                  transition="all 0.2s"
                >
                  Shop Products
                </Button>
              </HStack>
            </Flex>

            {/* Mobile: details + icon actions */}
            <Box display={{ base: "block", md: "none" }} mt={3}>
              {details}
              <Divider my={3} borderColor={borderColor} />
              <HStack spacing={2}>
                {phone && (
                  <IconButton
                    as="a"
                    href={`tel:${phone}`}
                    aria-label="Call shop"
                    icon={<FiPhone size={18} />}
                    color={callColor}
                    {...mobileIconBtn}
                  />
                )}
                <IconButton
                  as="a"
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions"
                  icon={<FiNavigation size={18} />}
                  color={dirColor}
                  {...mobileIconBtn}
                />
              </HStack>
            </Box>
          </MotionBox>
        </Box>
      </Box>
    );
  }
);

ShopHeroSection.displayName = "ShopHeroSection";
export default ShopHeroSection;