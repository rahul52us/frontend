"use client";

import {
  AspectRatio,
  Badge,
  Box,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState, type MouseEvent, type TouchEvent } from "react";
import {
  FaArrowLeft,
  FaBolt,
  FaBoxOpen,
  FaCheck,
  FaGift,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShareAlt,
  FaShieldAlt,
  FaStar,
  FaTag,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { getLowStockThreshold } from "../utils/stockThreshold";

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
  mode?: "page" | "drawer";
}

const colorMap: Record<string, string> = {
  red: "#DC2626",
  blue: "#2563EB",
  black: "#171717",
  white: "#FAFAFA",
  green: "#16A34A",
  yellow: "#EAB308",
  grey: "#6B7280",
  gray: "#6B7280",
  pink: "#EC4899",
  orange: "#EA580C",
  purple: "#7C3AED",
  brown: "#92400E",
};

const getImageSrc = (image: any) =>
  image?.preview ||
  image?.url ||
  image?.secure_url ||
  image?.location ||
  image ||
  "https://via.placeholder.com/1200x1200?text=Product";

const getCategoryName = (category: any) =>
  typeof category === "object" ? category?.name || "Uncategorized" : category || "Uncategorized";

const getSubCategoryName = (subCategory: any) =>
  typeof subCategory === "object" ? subCategory?.name || "" : subCategory || "";

const prettifyKey = (value: string) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

const normalizeEntries = (value: any): Array<[string, string]> => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => [String(item?.key || "").trim(), String(item?.value || "").trim()] as [string, string])
      .filter(([key, entryValue]) => Boolean(key) && Boolean(entryValue));
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, entryValue]) => [String(key).trim(), String(entryValue ?? "").trim()] as [string, string])
      .filter(([key, entryValue]) => Boolean(key) && Boolean(entryValue));
  }

  return [];
};

const parseCsv = (value?: string) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const uniqueValues = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const getVariantOptions = (product: any, variantName: string) => {
  const variant = (product?.variants || []).find(
    (item: any) => String(item?.name || "").trim().toLowerCase() === variantName
  );

  return Array.isArray(variant?.options) ? variant.options.filter(Boolean) : [];
};

const getRatingAverage = (product: any) =>
  Number(product?.ratings?.average ?? product?.ratings?.averageRating ?? product?.rating ?? 0);

const getRatingCount = (product: any) =>
  Number(
    product?.ratings?.count ??
      product?.ratings?.total ??
      product?.ratings?.totalRatings ??
      product?.reviewsCount ??
      0
  );

const getOfferTitle = (offer: any) => {
  if (offer?.type === "buyXgetY") {
    return `Buy ${offer?.config?.buyQuantity || "X"} Get ${offer?.config?.getQuantity || "Y"} Free`;
  }

  if (offer?.type === "discount") {
    const percentage = offer?.config?.discountPercentage;
    return percentage ? `${percentage}% off offer` : "Discount offer";
  }

  if (offer?.type === "freebie") {
    return offer?.config?.freebieProductName
      ? `Freebie: ${offer.config.freebieProductName}`
      : "Free gift offer";
  }

  return prettifyKey(String(offer?.type || "offer"));
};

export default function ProductDetailView({
  product,
  onBack,
  mode = "drawer",
}: ProductDetailViewProps) {
  const toast = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  const shell = useColorModeValue("#F8FAFC", dashboardPalette.shell);
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const surfaceMuted = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const borderStrong = useColorModeValue("#CBD5E1", dashboardPalette.borderStrong);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const headerBg = useColorModeValue("rgba(248, 250, 252, 0.86)", "rgba(11, 17, 32, 0.88)");
  const accent = useColorModeValue("#2563EB", dashboardPalette.accent);
  const accentStrong = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const accentSoft = useColorModeValue("rgba(37, 99, 235, 0.08)", dashboardPalette.accentSoft);
  const success = useColorModeValue("#15803D", dashboardPalette.success);
  const successSoft = useColorModeValue("rgba(34, 197, 94, 0.12)", dashboardPalette.successSoft);
  const danger = useColorModeValue("#DC2626", dashboardPalette.danger);
  const dangerSoft = useColorModeValue("rgba(239, 68, 68, 0.12)", dashboardPalette.dangerSoft);
  const elevatedShadow = useColorModeValue(
    "0 24px 48px rgba(37, 99, 235, 0.10)",
    "0 24px 48px rgba(2, 6, 23, 0.34)"
  );

  const images = useMemo(
    () => ((product?.images || []).map(getImageSrc).filter(Boolean) as string[]),
    [product]
  );
  const safeImages = images.length > 0 ? images : [getImageSrc(null)];

  const productDetails = useMemo(() => normalizeEntries(product?.productDetails), [product?.productDetails]);
  const information = useMemo(() => normalizeEntries(product?.information), [product?.information]);

  const detailLookup = useMemo(
    () =>
      new Map(
        [...productDetails, ...information].map(([key, value]) => [key.trim().toLowerCase(), value])
      ),
    [information, productDetails]
  );

  const colors = useMemo(
    () =>
      uniqueValues([
        ...parseCsv(detailLookup.get("color")),
        ...getVariantOptions(product, "color"),
      ]),
    [detailLookup, product]
  );

  const sizes = useMemo(
    () =>
      uniqueValues([
        ...getVariantOptions(product, "size"),
        ...parseCsv(detailLookup.get("size")),
        ...parseCsv(detailLookup.get("ssd")),
      ]),
    [detailLookup, product]
  );

  const specRows = useMemo(() => {
    const baseRows: Array<[string, string]> = [
      ["Brand", product?.brand || "NA"],
      ["SKU", product?.sku || "NA"],
      ["Weight", product?.weight ? `${product.weight} kg` : "NA"],
      ["Category", getCategoryName(product?.category)],
      ["Subcategory", getSubCategoryName(product?.subCategories?.[0]) || "NA"],
      ["In stock", `${Number(product?.stock || 0)} units`],
      ["Product ID", product?.productId || product?._id || "NA"],
    ];

    const dynamicRows = [...productDetails, ...information]
      .filter(([key, value]) => {
        const normalizedKey = key.trim().toLowerCase();
        return !["color", "size", "ssd"].includes(normalizedKey) && Boolean(value);
      })
      .map(([key, value]) => [prettifyKey(key), value] as [string, string]);

    const seen = new Set<string>();

    return [...baseRows, ...dynamicRows].filter(([key]) => {
      const normalizedKey = key.trim().toLowerCase();
      if (seen.has(normalizedKey)) {
        return false;
      }

      seen.add(normalizedKey);
      return true;
    });
  }, [information, product, productDetails]);

  const activeOffers = useMemo(
    () => ((product?.offers || []).filter((offer: any) => offer?.isEnabled !== false) as any[]),
    [product?.offers]
  );

  const categoryName = getCategoryName(product?.category);
  const subCategoryName = getSubCategoryName(product?.subCategories?.[0]);
  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discountPrice || 0);
  const effectivePrice = discountPrice > 0 && discountPrice < price ? discountPrice : price;
  const savedAmount = Math.max(price - effectivePrice, 0);
  const discountPct = price > 0 && savedAmount > 0 ? Math.round((savedAmount / price) * 100) : 0;
  const ratingAverage = getRatingAverage(product);
  const ratingCount = getRatingCount(product);
  const soldCount = Number(product?.soldCount || 0);
  const stock = Number(product?.stock || 0);
  const lowStockThreshold = getLowStockThreshold(product);
  const isInStock = stock > 0;

  useEffect(() => {
    setActiveImage(0);
    setZoomOpen(false);
    setZoomScale(1);
    setZoomPos({ x: 50, y: 50 });
    setSelectedColor("");
    setSelectedSize("");
    setWishlisted(false);
  }, [product?._id]);

  const handleShare = async () => {
    const shareData = {
      title: product?.name || "Product",
      text: `${product?.name || "Product"} - Rs ${effectivePrice.toLocaleString("en-IN")}`,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.title} | ${shareData.text}`);
        toast({
          title: "Product copied",
          description: "Product details were copied to the clipboard.",
          status: "success",
          duration: 2200,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Share cancelled",
        status: "info",
        duration: 1800,
        isClosable: true,
      });
    }
  };

  const handleZoomMove = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = "touches" in event ? event.touches[0] : event;
    const x = ((point.clientX - rect.left) / rect.width) * 100;
    const y = ((point.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <Box minH={mode === "page" ? "100vh" : "100%"} bg={shell}>
      <Box
        bg={headerBg}
        borderBottomWidth="1px"
        borderBottomColor={border}
      >
        <Flex
          maxW={mode === "page" ? "3xl" : "none"}
          mx="auto"
          px={{ base: 4, md: 5 }}
          py={1}
          align="center"
          justify="space-between"
        >
          <IconButton
            aria-label="Back"
            icon={<FaArrowLeft />}
            onClick={onBack}
            h="42px"
            w="42px"
            minW="42px"
            borderRadius="full"
            bg={surface}
            color={text}
            borderWidth="1px"
            borderColor={border}
            boxShadow="sm"
            _hover={{ bg: surfaceMuted }}
          />

          <HStack spacing={2}>
            <IconButton
              aria-label="Wishlist"
              icon={<FaHeart />}
              onClick={() => setWishlisted((value) => !value)}
              h="42px"
              w="42px"
              minW="42px"
              borderRadius="full"
              bg={surface}
              color={wishlisted ? danger : text}
              borderWidth="1px"
              borderColor={wishlisted ? danger : border}
              boxShadow="sm"
              _hover={{ bg: surfaceMuted }}
            />
            <IconButton
              aria-label="Share"
              icon={<FaShareAlt />}
              onClick={handleShare}
              h="42px"
              w="42px"
              minW="42px"
              borderRadius="full"
              bg={surface}
              color={text}
              borderWidth="1px"
              borderColor={border}
              boxShadow="sm"
              _hover={{ bg: surfaceMuted }}
            />
          </HStack>
        </Flex>
      </Box>

      <VStack
        align="stretch"
        spacing={5}
        maxW={mode === "page" ? "3xl" : "none"}
        mx="auto"
        px={{ base: 4, md: 5 }}
        pt={4}
        pb={{ base: 8, md: 10 }}
      >
        <Box position="relative">
         <AspectRatio
  ratio={1}
  overflow="hidden"
  bg={surface}
  h="60vh"
  boxShadow={elevatedShadow}
  onClick={() => setZoomOpen(true)}
>
  <Image
    src={safeImages[activeImage]}
    alt={product?.name || "Product image"}
    objectFit="contain"
    w="100%"
    h="100%"
  />
</AspectRatio>

          {discountPct > 0 ? (
            <Badge
              position="absolute"
              top={4}
              left={4}
              px={3}
              py={1.5}
              borderRadius="full"
              bgGradient="linear(to-r, blue.500, blue.400)"
              color="white"
              fontSize="11px"
              fontWeight="800"
              boxShadow="lg"
            >
              {discountPct}% OFF
            </Badge>
          ) : null}

          <Box
            position="absolute"
            right={4}
            bottom={4}
            px={3}
            py={1.5}
            borderRadius="full"
            bg={useColorModeValue("rgba(255,255,255,0.86)", "rgba(11,17,32,0.86)")}
            color={text}
            borderWidth="1px"
            borderColor={border}
            fontSize="xs"
            fontWeight="700"
            backdropFilter="blur(12px)"
          >
            {activeImage + 1} / {safeImages.length}
          </Box>

          {safeImages.length > 1 ? (
            <HStack mt={3} spacing={2} overflowX="auto" pb={1}>
              {safeImages.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  as="button"
                  type="button"
                  onClick={() => setActiveImage(index)}
                  flexShrink={0}
                  borderRadius="16px"
                  overflow="hidden"
                  borderWidth="2px"
                  borderColor={activeImage === index ? accent : "transparent"}
                  opacity={activeImage === index ? 1 : 0.65}
                  boxShadow={activeImage === index ? "md" : "none"}
                  transition="all 0.2s ease"
                  _hover={{ opacity: 1 }}
                >
                  <Image
                    src={image}
                    alt={`${product?.name || "Product"} thumbnail ${index + 1}`}
                    h="68px"
                    w="68px"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </HStack>
          ) : null}
        </Box>

        <Box>
          <HStack spacing={2} flexWrap="wrap" color="gray.500" fontSize="xs" fontWeight="600">
            <Text color={accentStrong}>{product?.brand || "Brand"}</Text>
            <Text>•</Text>
            <Text>{categoryName}</Text>
            {subCategoryName ? (
              <>
                <Text>•</Text>
                <Text>{subCategoryName}</Text>
              </>
            ) : null}
          </HStack>

          <Text mt={2} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color={text} lineHeight="1.15">
            {product?.name || "Untitled product"}
          </Text>

          <Flex mt={3} gap={3} wrap="wrap" align="center">
            {ratingAverage > 0 ? (
              <HStack
                spacing={1.5}
                px={3}
                py={1.5}
                borderRadius="lg"
                bg={successSoft}
                color={success}
              >
                <Icon as={FaStar} boxSize={3.5} />
                <Text fontSize="xs" fontWeight="800">
                  {ratingAverage.toFixed(1)}
                </Text>
                <Text fontSize="xs" opacity={0.8}>
                  ({ratingCount})
                </Text>
              </HStack>
            ) : null}

            <Text fontSize="xs" color={textMuted}>
              {soldCount > 0 ? `${soldCount}+ sold` : "Fresh in your catalog"}
            </Text>

            <Wrap spacing={2}>
              {(product?.tags || []).map((tag: string) => (
                <WrapItem key={tag}>
                  <Badge
                    px={2.5}
                    py={1}
                    borderRadius="full"
                    bg={accentSoft}
                    color={accentStrong}
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    fontSize="10px"
                    fontWeight="800"
                  >
                    #{tag}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Flex>
        </Box>

        <Box
          p={4}
          borderRadius="24px"
          bgGradient={useColorModeValue(
            "linear(to-br, blue.50, white)",
            "linear(to-br, rgba(37,99,235,0.10), rgba(15,23,42,0.26))"
          )}
          borderWidth="1px"
          borderColor={border}
        >
          <Flex gap={3} align="end" wrap="wrap">
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" color={text} lineHeight="1">
              Rs {effectivePrice.toLocaleString("en-IN")}
            </Text>
            {savedAmount > 0 ? (
              <Text mb={1} fontSize="lg" color={textMuted} textDecoration="line-through">
                Rs {price.toLocaleString("en-IN")}
              </Text>
            ) : null}
            {savedAmount > 0 ? (
              <Text mb={1} fontSize="sm" fontWeight="800" color={success}>
                You save Rs {savedAmount.toLocaleString("en-IN")}
              </Text>
            ) : null}
          </Flex>

          {Number(product?.taxRate || 0) > 0 ? (
            <Text mt={2} fontSize="xs" color={textMuted}>
              Inclusive of all taxes ({Number(product.taxRate)}% GST)
            </Text>
          ) : null}
        </Box>

        {activeOffers.length > 0 ? (
          <Box>
            <HStack spacing={2} mb={2.5}>
              <Icon as={FaGift} color={accentStrong} />
              <Text fontSize="sm" fontWeight="800" color={text}>
                Available Offers
              </Text>
            </HStack>

            <VStack align="stretch" spacing={2.5}>
              {activeOffers.map((offer: any, index: number) => (
                <HStack
                  key={offer?._id || offer?.offerId || `${offer?.type}-${index}`}
                  align="start"
                  spacing={3}
                  p={3.5}
                  borderRadius="20px"
                  bg={surface}
                  borderWidth="1px"
                  borderColor={border}
                >
                  <Center
                    boxSize="40px"
                    borderRadius="14px"
                    bg={accentSoft}
                    color={accentStrong}
                    flexShrink={0}
                  >
                    <Icon as={FaTag} boxSize={4} />
                  </Center>

                  <Box minW={0}>
                    <Text fontSize="sm" fontWeight="700" color={text}>
                      {getOfferTitle(offer)}
                    </Text>
                    <Text mt={1} fontSize="xs" color={textMuted}>
                      Code:{" "}
                      <Box as="span" fontFamily="mono" fontWeight="800" color={text}>
                        {String(offer?.offerId || offer?._id || offer?.type || "offer").toUpperCase()}
                      </Box>
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        ) : null}

        {colors.length > 0 ? (
          <Box>
            <Flex justify="space-between" align="center" mb={2.5}>
              <Text fontSize="sm" fontWeight="800" color={text}>
                Color
              </Text>
              {selectedColor ? (
                <Text fontSize="xs" color={textMuted} textTransform="capitalize">
                  {selectedColor}
                </Text>
              ) : null}
            </Flex>

            <HStack spacing={3} flexWrap="wrap">
              {colors.map((color) => {
                const normalizedColor = color.toLowerCase();
                const background = colorMap[normalizedColor] || color;
                const isActive = selectedColor === color;

                return (
                  <Center
                    key={color}
                    as="button"
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    h="46px"
                    w="46px"
                    borderRadius="full"
                    borderWidth={isActive ? "2px" : "1px"}
                    borderColor={isActive ? accent : borderStrong}
                    bg={background}
                    boxShadow={isActive ? "0 0 0 4px rgba(37, 99, 235, 0.14)" : "none"}
                    transition="all 0.2s ease"
                  >
                    {isActive ? (
                      <Icon
                        as={FaCheck}
                        color={["white", "yellow"].includes(normalizedColor) ? "black" : "white"}
                        boxSize={4}
                      />
                    ) : null}
                  </Center>
                );
              })}
            </HStack>
          </Box>
        ) : null}

        {sizes.length > 0 ? (
          <Box>
            <Flex justify="space-between" align="center" mb={2.5}>
              <Text fontSize="sm" fontWeight="800" color={text}>
                Size
              </Text>
              <Text fontSize="xs" color={accentStrong} fontWeight="700">
                Variant options
              </Text>
            </Flex>

            <Grid templateColumns="repeat(auto-fit, minmax(74px, 1fr))" gap={2.5}>
              {sizes.map((size) => {
                const isActive = selectedSize === size;

                return (
                  <Box
                    key={size}
                    as="button"
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    h="48px"
                    borderRadius="16px"
                    borderWidth="1px"
                    borderColor={isActive ? accent : border}
                    bg={isActive ? text : surface}
                    color={isActive ? surface : text}
                    fontSize="sm"
                    fontWeight="800"
                    transition="all 0.2s ease"
                  >
                    {size}
                  </Box>
                );
              })}
            </Grid>
          </Box>
        ) : null}

        {product?.description ? (
          <Box>
            <Text mb={2.5} fontSize="sm" fontWeight="800" color={text}>
              About this item
            </Text>
            <Text fontSize="sm" lineHeight="1.8" color={textMuted}>
              {product.description}
            </Text>
          </Box>
        ) : null}

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
          {[
            { icon: FaTruck, label: "Free delivery", sub: "On orders above Rs 499" },
            { icon: FaUndoAlt, label: "7-day returns", sub: "Easy and free" },
            { icon: FaShieldAlt, label: "Secure pay", sub: "100% protected" },
            { icon: FaBolt, label: "Express ship", sub: "Fast dispatch ready" },
          ].map((item) => (
            <Box
              key={item.label}
              p={3.5}
              borderRadius="20px"
              bg={surface}
              borderWidth="1px"
              borderColor={border}
            >
              <Icon as={item.icon} boxSize={5} color={accentStrong} mb={2} />
              <Text fontSize="xs" fontWeight="800" color={text}>
                {item.label}
              </Text>
              <Text mt={1} fontSize="11px" color={textMuted}>
                {item.sub}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {specRows.length > 0 ? (
          <Box>
            <HStack spacing={2} mb={2.5}>
              <Icon as={FaBoxOpen} color={accentStrong} />
              <Text fontSize="sm" fontWeight="800" color={text}>
                Specifications
              </Text>
            </HStack>

            <Box
              borderRadius="24px"
              overflow="hidden"
              borderWidth="1px"
              borderColor={border}
              bg={surface}
            >
              {specRows.map(([label, value], index) => (
                <Flex
                  key={`${label}-${index}`}
                  px={4}
                  py={3.5}
                  justify="space-between"
                  align="start"
                  gap={4}
                  borderTopWidth={index === 0 ? "0" : "1px"}
                  borderTopColor={border}
                >
                  <Text flexShrink={0} fontSize="xs" color={textMuted}>
                    {label}
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color={text}
                    textAlign="right"
                    whiteSpace="pre-wrap"
                  >
                    {value}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        ) : null}

        <HStack
          spacing={2}
          px={3.5}
          py={3}
          borderRadius="18px"
          bg={isInStock ? successSoft : dangerSoft}
          color={isInStock ? success : danger}
        >
          <Box
            boxSize="8px"
            borderRadius="full"
            bg={isInStock ? success : danger}
            flexShrink={0}
          />
          <Text fontSize="xs" fontWeight="800">
            {isInStock ? "In stock" : "Out of stock"}
          </Text>
          <Text fontSize="xs" color={isInStock ? success : danger}>
            {isInStock
              ? stock <= lowStockThreshold
                ? `Only ${stock} units left`
                : "Ready to ship soon"
              : "Restock needed"}
          </Text>
        </HStack>
      </VStack>

      <Modal isOpen={zoomOpen} onClose={() => setZoomOpen(false)} size="full" motionPreset="scale">
        <ModalOverlay bg="rgba(0,0,0,0.94)" />
        <ModalContent bg="rgba(0,0,0,0.96)" borderRadius="none" maxW="100vw" minH="100vh">
          <ModalCloseButton color="white" zIndex={2} />
          <ModalBody p={0} position="relative">
            <HStack position="absolute" top={4} left={4} zIndex={2} spacing={2}>
              <IconButton
                aria-label="Zoom out"
                icon={<FaMinus />}
                onClick={() => setZoomScale((value) => Math.max(1, value - 0.5))}
                borderRadius="full"
                bg="rgba(255,255,255,0.12)"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.18)" }}
              />
              <IconButton
                aria-label="Zoom in"
                icon={<FaPlus />}
                onClick={() => setZoomScale((value) => Math.min(4, value + 0.5))}
                borderRadius="full"
                bg="rgba(255,255,255,0.12)"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.18)" }}
              />
            </HStack>

            <Flex
              h="100%"
              w="100%"
              align="center"
              justify="center"
              overflow="hidden"
              onMouseMove={handleZoomMove}
              onTouchMove={handleZoomMove}
            >
              <Image
                src={safeImages[activeImage]}
                alt={product?.name || "Product image"}
                maxH="100%"
                maxW="100%"
                objectFit="contain"
                transition="transform 0.18s ease"
                transform={`scale(${zoomScale})`}
                transformOrigin={`${zoomPos.x}% ${zoomPos.y}%`}
              />
            </Flex>

            {safeImages.length > 1 ? (
              <HStack
                position="absolute"
                bottom={6}
                left={0}
                right={0}
                justify="center"
                spacing={2}
                px={4}
                overflowX="auto"
              >
                {safeImages.map((image, index) => (
                  <Box
                    key={`${image}-${index}-zoom`}
                    as="button"
                    type="button"
                    onClick={() => setActiveImage(index)}
                    borderRadius="14px"
                    overflow="hidden"
                    borderWidth="2px"
                    borderColor={activeImage === index ? "white" : "whiteAlpha.400"}
                    flexShrink={0}
                  >
                    <Image src={image} alt="" h="56px" w="56px" objectFit="cover" />
                  </Box>
                ))}
              </HStack>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
