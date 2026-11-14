"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiPackage,
  FiShare2,
  FiShoppingBag,
  FiShoppingCart,
  FiZap,
} from "react-icons/fi";
import ProductImageViewer from "../../../component/common/ProductImagesViewer/ProductImagesViewer";
import { useCartToast } from "../../../hooks/useCartToast";
import stores from "../../../store/stores";
import ProductCard from "../../products/components/ProductCard/ProductCard";
import ProductAboutSection from "./ProductAboutSection";
import ProductBuyBox from "./ProductBuyBox";
import ProductDetailsSection from "./ProductDetailsSection";

const MotionBox = motion(Box);

// ─── Native-Feel Skeleton Loader (Replaces blank 100vh spinner) ─────────
const ProductPageSkeleton = () => {
  const pageBg = useColorModeValue("#F8FAFC", "gray.950");
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 3, md: 6 }}>
      <Container maxW="8xl" px={{ base: 3, md: 8 }}>
        <Skeleton h="20px" w="180px" mb={4} rounded="md" />
        <Grid
          templateColumns={{ base: "1fr", lg: "1.1fr 1fr" }}
          gap={{ base: 4, lg: 8 }}
        >
          <Box
            bg={cardBg}
            p={{ base: 3, md: 5 }}
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Skeleton h={{ base: "300px", sm: "380px", md: "440px" }} rounded="xl" mb={3} />
            <HStack spacing={2.5}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} boxSize={{ base: "56px", md: "70px" }} rounded="lg" />
              ))}
            </HStack>
          </Box>

          <VStack
            align="stretch"
            spacing={4}
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
          >
            <Skeleton h="18px" w="110px" rounded="full" />
            <Skeleton h="28px" w="90%" rounded="md" />
            <Skeleton h="20px" w="60%" rounded="md" />
            <Skeleton h="40px" w="160px" rounded="lg" mt={2} />
            <Skeleton h="90px" w="full" rounded="xl" />
            <Skeleton h="120px" w="full" rounded="xl" />
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
};

const DetailedProductPage = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const { showAddToCartToast } = useCartToast();
  const { shopStore, cartStore } = stores;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Hoisted Theme Tokens
  const pageBg = useColorModeValue("#F8FAFC", "gray.950");
  const cardBg = useColorModeValue("white", "gray.900");
  const stickyBarBg = useColorModeValue(
    "rgba(255, 255, 255, 0.96)",
    "rgba(17, 24, 39, 0.96)"
  );
  const textColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await shopStore.getProductById(productId);
        const loadedProduct = res?.data ? res.data : res;

        if (loadedProduct && (loadedProduct._id || loadedProduct.name || loadedProduct.title)) {
          setProduct(loadedProduct);

          // Fetch related products
          if (loadedProduct.category) {
            const subCategories = loadedProduct.subCategories;
            const subCategory =
              Array.isArray(subCategories) && subCategories.length > 0
                ? subCategories[0]._id || subCategories[0]
                : undefined;

            try {
              const relatedRes = await shopStore.searchGlobalProducts({
                category: loadedProduct.category?._id || loadedProduct.category,
                subCategory,
                excludeId: loadedProduct._id,
                limit: 6,
              });
              if (relatedRes?.data?.products) {
                setRelatedProducts(relatedRes.data.products);
              }
            } catch (relErr) {
              console.warn("Could not load related products:", relErr);
            }
          }
        } else {
          setProduct(null);
        }
      } catch (error: any) {
        toast({
          title: "Unable to load product",
          description: error?.message || "Please try again in a moment.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, shopStore, toast]);

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <Box bg={pageBg} minH="75vh" py={16} px={4}>
        <Container maxW="md">
          <VStack
            bg={cardBg}
            p={8}
            rounded="2xl"
            border="1px solid"
            borderColor={borderColor}
            spacing={4}
            textAlign="center"
            boxShadow="xs"
          >
            <Flex
              w="52px"
              h="52px"
              rounded="full"
              bg="blue.50"
              color="blue.600"
              align="center"
              justify="center"
            >
              <Icon as={FiPackage} boxSize={6} />
            </Flex>
            <Heading size="md" color={textColor}>
              Product Not Found
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              This item may be out of stock or no longer available from the seller.
            </Text>
            <Button
              size="sm"
              h="38px"
              px={6}
              rounded="full"
              colorScheme="blue"
              onClick={() => router.push("/products")}
            >
              Browse Available Products
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Safely resolve product images
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category || "Products";

  const productTitle = product.name || product.title || "Product";
  const finalPrice = Number(product.price ?? product.sellingPrice ?? 0);
  const originalPrice = Number(product.originalPrice ?? product.mrp ?? 0);
  const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const handleMobileAddToCart = async () => {
    if (isAddingCart) return;
    try {
      setIsAddingCart(true);
      await cartStore.addToCart(product);
      showAddToCartToast(product);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1400);
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleMobileBuyNow = async () => {
    if (isBuyingNow) return;
    try {
      setIsBuyingNow(true);
      await cartStore.addToCart(product);
      if (cartStore.openCart) {
        cartStore.openCart();
      } else {
        router.push("/checkout");
      }
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: `Check out ${productTitle} on Business Sahayata!`,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled share sheet
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Product link copied to your clipboard.",
        status: "success",
        duration: 2000,
      });
    }
  };

  return (
    <Box
      bg={pageBg}
      minH="100vh"
      pb={{
        base: "calc(88px + env(safe-area-inset-bottom, 0px))",
        lg: 12,
      }}
    >
      <Container maxW="8xl" px={{ base: 3, md: 8 }} pt={{ base: 2.5, md: 5 }}>
        {/* 1. Top Navigation Bar: Compact Back + Share on Mobile, Breadcrumbs on Desktop */}
        <Flex
          justify="space-between"
          align="center"
          mb={{ base: 2.5, md: 4 }}
          gap={2}
        >
          {/* Mobile Back Button + Category Crumb */}
          <HStack spacing={1.5} minW={0} flex="1">
            <Button
              size="xs"
              h="30px"
              px={2.5}
              rounded="full"
              bg={cardBg}
              color={textColor}
              border="1px solid"
              borderColor={borderColor}
              leftIcon={<FiArrowLeft size={13} />}
              onClick={() => router.back()}
              fontWeight="600"
              flexShrink={0}
            >
              Back
            </Button>

            <HStack
              spacing={1}
              fontSize="xs"
              color={mutedText}
              minW={0}
              overflow="hidden"
            >
              <Icon as={FiChevronRight} boxSize={3} flexShrink={0} />
              <Text
                as="button"
                onClick={() => router.push("/categories")}
                _hover={{ color: "blue.600", textDecoration: "underline" }}
                fontWeight="500"
                noOfLines={1}
                flexShrink={0}
              >
                {categoryName}
              </Text>
              <Icon
                as={FiChevronRight}
                boxSize={3}
                flexShrink={0}
                display={{ base: "none", sm: "inline" }}
              />
              <Text
                display={{ base: "none", sm: "inline" }}
                color={textColor}
                fontWeight="600"
                noOfLines={1}
              >
                {productTitle}
              </Text>
            </HStack>
          </HStack>

          {/* Share Button */}
          <IconButton
            aria-label="Share product"
            icon={<FiShare2 size={14} />}
            size="xs"
            w="30px"
            h="30px"
            rounded="full"
            bg={cardBg}
            color={textColor}
            border="1px solid"
            borderColor={borderColor}
            _hover={{ color: "blue.600", borderColor: "blue.200" }}
            onClick={handleShare}
          />
        </Flex>

        {/* 2. Main Product Grid: Image Gallery (Left) + Details & Buy Box (Right) */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1.12fr 1fr" }}
          gap={{ base: 3.5, lg: 7 }}
          alignItems="start"
        >
          {/* LEFT COLUMN: Image Gallery (Sticky on Desktop) */}
          <Box
            position={{ lg: "sticky" }}
            top={{ lg: "96px" }}
            bg={cardBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            p={{ base: 2.5, sm: 3.5, md: 4 }}
            boxShadow="2xs"
          >
            <ProductImageViewer images={images} />
          </Box>

          {/* RIGHT COLUMN: Product Details & Buy Box */}
          <VStack align="stretch" spacing={{ base: 3.5, md: 4 }}>
            <Box
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 3.5, sm: 4, md: 6 }}
              boxShadow="2xs"
            >
              <ProductDetailsSection product={product} />
            </Box>

            <Box
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={borderColor}
              p={{ base: 3.5, sm: 4, md: 5 }}
              boxShadow="2xs"
            >
              <ProductBuyBox product={product} />
            </Box>
          </VStack>
        </Grid>

        {/* 3. Full-Width About / Specifications Section */}
        <Box
          mt={{ base: 4, md: 7 }}
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          p={{ base: 3.5, sm: 5, md: 6 }}
          boxShadow="2xs"
        >
          <ProductAboutSection product={product} />
        </Box>

        {/* 4. Related Products Section (Horizontal Scroll on Mobile, Grid on Desktop) */}
        {relatedProducts.length > 0 && (
          <Box mt={{ base: 6, md: 10 }}>
            <Flex justify="space-between" align="flex-end" mb={{ base: 3.5, md: 5 }}>
              <Box>
                <HStack spacing={1.5} mb={0.5}>
                  <Icon as={FiShoppingBag} color="blue.600" boxSize={3.5} />
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="blue.600"
                  >
                    Similar Items
                  </Text>
                </HStack>
                <Heading
                  as="h2"
                  fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                  fontWeight="800"
                  color={textColor}
                  letterSpacing="tight"
                >
                  You Might Also Like
                </Heading>
              </Box>

              <Button
                size="xs"
                h="30px"
                px={3}
                rounded="full"
                variant="ghost"
                colorScheme="blue"
                rightIcon={<FiArrowRight />}
                onClick={() => router.push("/products")}
              >
                View More
              </Button>
            </Flex>

            <SimpleGrid
              columns={{ base: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
              spacing={{ base: 2.5, sm: 3.5, md: 5 }}
            >
              {relatedProducts.map((related, index) => (
                <MotionBox
                  key={related._id || index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * index }}
                >
                  <ProductCard product={related} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>

      {/* 5. Native App-Style Mobile Sticky Action Dock */}
      <Box
        display={{ base: "block", lg: "none" }}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1010} // Above MobileBottomNav on product detail view so CTAs are always reachable
        bg={stickyBarBg}
        backdropFilter="blur(16px)"
        borderTop="1px solid"
        borderColor={borderColor}
        px={3.5}
        pt={2.5}
        pb="calc(10px + env(safe-area-inset-bottom, 0px))"
        boxShadow="0 -8px 25px rgba(15, 23, 42, 0.08)"
      >
        <Flex align="center" justify="space-between" gap={3} maxW="500px" mx="auto">
          {/* Live Price Summary on Left */}
          <Box minW="76px" flexShrink={0}>
            <HStack spacing={1.5} align="baseline">
              <Text
                fontSize="lg"
                fontWeight="800"
                color={textColor}
                lineHeight="1.1"
              >
                {formatINR(finalPrice)}
              </Text>
              {discountPercent > 0 && (
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  fontSize="9px"
                  px={1.5}
                  rounded="sm"
                >
                  {discountPercent}% off
                </Badge>
              )}
            </HStack>
            {hasDiscount ? (
              <Text
                fontSize="10px"
                color={mutedText}
                textDecoration="line-through"
                fontWeight="500"
              >
                MRP {formatINR(originalPrice)}
              </Text>
            ) : (
              <Text fontSize="10px" color="green.600" fontWeight="600">
                Inclusive of all taxes
              </Text>
            )}
          </Box>

          {/* Action Buttons on Right */}
          <HStack spacing={2} flex="1" justify="flex-end">
            <Button
              flex="1"
              h="42px"
              rounded="xl"
              variant="outline"
              colorScheme={addedSuccess ? "green" : "blue"}
              bg={addedSuccess ? "green.50" : "blue.50"}
              borderColor={addedSuccess ? "green.300" : "blue.200"}
              color={addedSuccess ? "green.700" : "blue.700"}
              fontWeight="700"
              fontSize="xs"
              leftIcon={
                addedSuccess ? <FiCheck size={14} /> : <FiShoppingCart size={14} />
              }
              isLoading={isAddingCart}
              onClick={handleMobileAddToCart}
              _active={{ transform: "scale(0.97)" }}
            >
              {addedSuccess ? "Added" : "Add to Cart"}
            </Button>

            <Button
              flex="1"
              h="42px"
              rounded="xl"
              bgGradient="linear(to-r, blue.600, purple.600)"
              color="white"
              fontWeight="700"
              fontSize="xs"
              leftIcon={<FiZap size={14} />}
              isLoading={isBuyingNow}
              onClick={handleMobileBuyNow}
              boxShadow="0 6px 16px -4px rgba(37, 99, 235, 0.45)"
              _hover={{ bgGradient: "linear(to-r, blue.700, purple.700)" }}
              _active={{ transform: "scale(0.97)" }}
            >
              Buy Now
            </Button>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default observer(DetailedProductPage);