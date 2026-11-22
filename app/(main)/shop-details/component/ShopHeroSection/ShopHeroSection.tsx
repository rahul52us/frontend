"use client";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
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
import { useRouter } from "next/navigation";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export interface ShopHeroSectionProps {
  shopData: any;
  onShopProductsClick?: () => void;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatTime = (t?: string) => {
  if (!t) return "";
  const [h = 0, m = 0] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
};

const toMinutes = (t: string) => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return h * 60 + m;
};

// Local YYYY-MM-DD (toISOString() gives the UTC date, which is wrong
// between 12:00 AM and 5:30 AM in India)
const localDateKey = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const glassBtn = {
  size: "md",
  borderRadius: "full",
  bg: "rgba(0, 0, 0, 0.45)",
  color: "white",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  _hover: { bg: "rgba(0, 0, 0, 0.7)", transform: "scale(1.06)" },
  _active: { transform: "scale(0.94)" },
  _focusVisible: { boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.85)" },
  transition: "all 0.2s",
} as const;

/* ------------------------------------------------------------------ */
/* Cover image                                                         */
/* ------------------------------------------------------------------ */

// If the browser has to enlarge the picture by more than this to fill the
// frame, it will look soft. In that case we stop stretching it: the photo is
// shown at its natural proportions over a (deliberately) blurred copy of itself.
const UPSCALE_LIMIT = 1.25;

const CoverImage = ({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children?: React.ReactNode;
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [current, setCurrent] = useState(src);
  const [lowRes, setLowRes] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setLowRes(false);
  }, [src]);

  const measure = useCallback(() => {
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!img || !frame || !img.naturalWidth || !img.naturalHeight) return;
    const scale = Math.max(
      frame.clientWidth / img.naturalWidth,
      frame.clientHeight / img.naturalHeight
    );
    setLowRes(scale > UPSCALE_LIMIT);
  }, []);

  useEffect(() => {
    // covers images that finished loading before React attached onLoad
    if (imgRef.current?.complete) measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [current, measure]);

  return (
    <Box
      ref={frameRef}
      position="relative"
      w="full"
      h={{ base: "190px", sm: "240px", md: "300px", lg: "340px" }}
      overflow="hidden"
      bg="gray.900"
      borderRadius={{ base: 0, md: "3xl" }}
    >
      {lowRes && (
        <Image
          aria-hidden
          src={current}
          alt=""
          position="absolute"
          inset={0}
          w="full"
          h="full"
          objectFit="cover"
          transform="scale(1.15)"
          filter="blur(28px) brightness(0.6)"
          pointerEvents="none"
        />
      )}

      <Image
        ref={imgRef}
        src={current}
        alt={alt}
        position="relative"
        w="full"
        h="full"
        objectFit={lowRes ? "contain" : "cover"}
        objectPosition="center"
        decoding="async"
        onLoad={measure}
        onError={() => {
          if (current !== fallback) setCurrent(fallback);
        }}
      />

      {/* Light scrim at the top only, so the buttons stay readable */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bgGradient="linear(to-b, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 38%)"
      />

      {children}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Small chip                                                          */
/* ------------------------------------------------------------------ */

const Chip = ({
  icon,
  iconColor,
  children,
}: {
  icon: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
}) => {
  const bg = useColorModeValue("gray.100", "whiteAlpha.200");
  const color = useColorModeValue("gray.700", "gray.200");
  return (
    <HStack
      bg={bg}
      color={color}
      px={2.5}
      py={1}
      borderRadius="full"
      spacing={1.5}
      fontSize="xs"
      fontWeight="semibold"
      maxW="full"
    >
      <Icon as={icon} boxSize={3.5} color={iconColor} flexShrink={0} />
      {children}
    </HStack>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const ShopHeroSection: React.FC<ShopHeroSectionProps> = memo(
  ({ shopData, onShopProductsClick }) => {
    const router = useRouter();
    const toast = useToast();
    const [isSaved, setIsSaved] = useState(false);

    // Time is read after mount so server and client markup match,
    // and refreshed every minute so "Open now" stays accurate.
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
      setNow(new Date());
      const id = setInterval(() => setNow(new Date()), 60_000);
      return () => clearInterval(id);
    }, []);

    // Color tokens
    const tileBg = useColorModeValue("white", "gray.800");
    const tileBorder = useColorModeValue("white", "gray.800");
    const textPrimary = useColorModeValue("gray.900", "white");
    const textMuted = useColorModeValue("gray.600", "gray.400");
    const outlineBorder = useColorModeValue("gray.200", "whiteAlpha.300");
    const outlineHover = useColorModeValue("gray.50", "whiteAlpha.200");
    const callColor = useColorModeValue("green.600", "green.300");
    const dirColor = useColorModeValue("blue.600", "blue.300");

    // Ratings (only shown when the shop actually has some)
    const avgRating = Number(shopData?.ratings?.average);
    const totalRatings = Number(shopData?.ratings?.total) || 0;
    const hasRatings = totalRatings > 0 && Number.isFinite(avgRating);

    // Address / directions
    const loc = shopData?.location;
    const formattedAddress = useMemo(
      () =>
        [loc?.address, loc?.city, loc?.state, loc?.postalCode || loc?.pincode]
          .filter(Boolean)
          .join(", "),
      [loc?.address, loc?.city, loc?.postalCode, loc?.pincode, loc?.state]
    );

    const directionsUrl = useMemo(
      () =>
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          formattedAddress || shopData?.name || ""
        )}`,
      [formattedAddress, shopData?.name]
    );

    const phone = shopData?.contactInfo?.phone;

    // Open / closed
    const status = useMemo(() => {
      if (!now) return null;
      const today = DAYS[now.getDay()] ?? "";
      const hours =
        shopData?.operatingHours?.find((d: any) => d.day === today) ?? null;
      const closedToday =
        Array.isArray(shopData?.closedDates) &&
        shopData.closedDates.includes(localDateKey(now));

      let isOpen = false;
      let hint = "";
      if (closedToday) {
        hint = "Closed today";
      } else if (hours?.open && hours?.close) {
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const openMin = toMinutes(hours.open);
        const closeMin = toMinutes(hours.close);
        // handles shops that close after midnight (e.g. 6 PM – 1 AM)
        isOpen =
          closeMin > openMin
            ? nowMin >= openMin && nowMin < closeMin
            : nowMin >= openMin || nowMin < closeMin;
        if (isOpen) hint = `Closes ${formatTime(hours.close)}`;
        else if (nowMin < openMin) hint = `Opens ${formatTime(hours.open)}`;
      }
      return { isOpen, hint };
    }, [now, shopData?.operatingHours, shopData?.closedDates]);

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

    // Save / favorite
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
    const categoryName =
      typeof shopData?.category === "object"
        ? shopData.category?.name
        : shopData?.category;

    const outlineBtn = {
      variant: "outline",
      h: "44px",
      px: 4,
      borderRadius: "xl",
      borderColor: outlineBorder,
      fontWeight: "semibold",
      fontSize: "sm",
      _hover: { bg: outlineHover },
      _active: { transform: "scale(0.98)" },
      transition: "all 0.2s",
    } as const;

    return (
      <Box w="full">
        {/* ---------- Cover ---------- */}
        <Box maxW="8xl" mx="auto" px={{ base: 0, md: 8 }} pt={{ base: 0, md: 6 }}>
          <CoverImage src={coverUrl} alt={shopData?.name || "Shop cover"}>
            <Flex
              position="absolute"
              top={{ base: 3, md: 4 }}
              left={{ base: 3, md: 4 }}
              right={{ base: 3, md: 4 }}
              justify="space-between"
              align="center"
              zIndex={2}
            >
              <IconButton
                aria-label="Go back"
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
                  aria-label={
                    isSaved ? "Remove from favorites" : "Add to favorites"
                  }
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
          </CoverImage>
        </Box>

        {/* ---------- Identity + actions ---------- */}
        <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} pb={{ base: 4, md: 6 }}>
          <Grid
            templateColumns={{ base: "auto minmax(0, 1fr)", md: "auto minmax(0, 1fr) auto" }}
            templateAreas={{
              base: `"logo head" "details details" "actions actions"`,
              md: `"logo head actions" "logo details actions"`,
            }}
            columnGap={{ base: 3, md: 5 }}
            rowGap={{ base: 3, md: 0 }}
          >
            {/* Logo (overlaps the cover) */}
            <GridItem area="logo" mt={{ base: "-34px", md: "-56px" }} zIndex={3}>
              <Box position="relative">
                <Box
                  boxSize={{ base: "72px", md: "112px" }}
                  borderRadius={{ base: "xl", md: "2xl" }}
                  border="3px solid"
                  borderColor={tileBorder}
                  bg={tileBg}
                  overflow="hidden"
                  boxShadow="0 6px 20px -6px rgba(0, 0, 0, 0.3)"
                >
                  {shopData?.logo?.url ? (
                    <Image
                      src={shopData.logo.url}
                      alt={shopData?.name || "Shop logo"}
                      boxSize="full"
                      objectFit="cover"
                      decoding="async"
                    />
                  ) : (
                    <Flex
                      boxSize="full"
                      bg="var(--color-primary, #2563eb)"
                      align="center"
                      justify="center"
                      color="white"
                    >
                      <Icon as={FaStore} boxSize={{ base: 6, md: 9 }} />
                    </Flex>
                  )}
                </Box>
                {shopData?.isVerified && (
                  <Tooltip label="Verified merchant" placement="top">
                    <Box
                      position="absolute"
                      bottom="-6px"
                      right="-6px"
                      bg={tileBg}
                      borderRadius="full"
                      p="2px"
                      lineHeight={0}
                    >
                      <Icon as={MdVerified} boxSize={5} color="blue.500" />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </GridItem>

            {/* Name + open status */}
            <GridItem area="head" minW={0} pt={{ base: 1.5, md: 4 }}>
              <Heading
                as="h1"
                fontSize={{ base: "xl", md: "3xl" }}
                fontWeight="800"
                color={textPrimary}
                letterSpacing="-0.02em"
                lineHeight="shorter"
                noOfLines={2}
              >
                {shopData?.name}
              </Heading>

              {status && (
                <HStack spacing={2} mt={1.5} flexWrap="wrap">
                  <Badge
                    colorScheme={status.isOpen ? "green" : "red"}
                    variant="subtle"
                    display="inline-flex"
                    alignItems="center"
                    gap={1.5}
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                    textTransform="none"
                  >
                    <Box boxSize="6px" borderRadius="full" bg="currentColor" />
                    {status.isOpen ? "Open now" : "Closed"}
                  </Badge>
                  {status.hint && (
                    <HStack spacing={1} color={textMuted} fontSize="xs">
                      <Icon as={FiClock} boxSize={3} />
                      <Text>{status.hint}</Text>
                    </HStack>
                  )}
                </HStack>
              )}
            </GridItem>

            {/* Tagline + chips */}
            <GridItem area="details" minW={0} pt={{ md: 3 }}>
              {shopData?.tagline && (
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={textMuted}
                  mb={3}
                  maxW="64ch"
                  noOfLines={2}
                >
                  {shopData.tagline}
                </Text>
              )}
              <Flex gap={2} flexWrap="wrap">
                {categoryName && (
                  <Chip icon={FiShoppingBag}>
                    <Text noOfLines={1}>{categoryName}</Text>
                  </Chip>
                )}
                {hasRatings ? (
                  <Chip icon={FaStar} iconColor="orange.400">
                    <Text fontWeight="bold">{avgRating.toFixed(1)}</Text>
                    <Text color={textMuted} fontWeight="normal">
                      ({totalRatings})
                    </Text>
                  </Chip>
                ) : (
                  <Chip icon={FaStar} iconColor="orange.400">
                    <Text>New</Text>
                  </Chip>
                )}
                {loc?.city && (
                  <Chip icon={FiMapPin}>
                    <Text noOfLines={1}>
                      {loc.city}
                      {loc.state ? `, ${loc.state}` : ""}
                    </Text>
                  </Chip>
                )}
              </Flex>
            </GridItem>

            {/* Actions: primary first on mobile, last on desktop */}
            <GridItem area="actions" alignSelf={{ md: "start" }} pt={{ md: 4 }}>
              <Flex
                direction={{ base: "column", md: "row-reverse" }}
                gap={2.5}
                align={{ base: "stretch", md: "center" }}
                justify={{ md: "flex-end" }}
              >
                <Button
                  onClick={onShopProductsClick}
                  leftIcon={<FiShoppingBag />}
                  h={{ base: "48px", md: "44px" }}
                  px={6}
                  borderRadius="xl"
                  bg="var(--color-primary, #2563eb)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  boxShadow="0 4px 14px rgba(37, 99, 235, 0.3)"
                  _hover={{ opacity: 0.92, transform: "translateY(-1px)" }}
                  _active={{ transform: "scale(0.98)" }}
                  transition="all 0.2s"
                >
                  Shop products
                </Button>

                <HStack spacing={2.5}>
                  {phone && (
                    <Button
                      as="a"
                      href={`tel:${phone}`}
                      leftIcon={<FiPhone />}
                      color={callColor}
                      flex={{ base: 1, md: "initial" }}
                      {...outlineBtn}
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
                    color={dirColor}
                    flex={{ base: 1, md: "initial" }}
                    {...outlineBtn}
                  >
                    Directions
                  </Button>
                </HStack>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    );
  }
);

ShopHeroSection.displayName = "ShopHeroSection";
export default ShopHeroSection;