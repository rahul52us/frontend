"use client";

import {
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiHeart,
  FiShoppingBag,
  FiShoppingCart,
  FiTrash2,
} from "react-icons/fi";
import { authentication } from "../../../../config/utils/routes";
import { useCartToast } from "../../../../hooks/useCartToast";
import stores from "../../../../store/stores";
import BottomSheetDrawer from "../../../common/Drawer/BottomSheetDrawer";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer = observer(({ isOpen, onClose }: WishlistDrawerProps) => {
  const { cartStore, auth } = stores;
  const router = useRouter();
  const { showAddToCartToast } = useCartToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Theme-aware tokens
  const drawerBg = useColorModeValue("white", "var(--color-surface)");
  const cardBg = useColorModeValue("white", "var(--color-surface)");
  const cardBorder = useColorModeValue("var(--color-border)", "var(--color-border)");
  const hoverBorder = useColorModeValue("var(--color-primary)", "var(--color-primary)");
  const textPrimary = useColorModeValue("var(--color-text)", "var(--color-text)");
  const textMuted = useColorModeValue("var(--color-text-muted)", "var(--color-text-muted)");
  const imgBg = useColorModeValue("gray.50", "var(--color-surface-hover)");
  const priceColor = useColorModeValue("var(--color-primary)", "brand.300");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!auth.user) return;
      setLoading(true);
      try {
        const items = await auth.fetchWishlist();
        setWishlistItems(items || []);
      } catch {
        // ignore error
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && auth.user) {
      fetchWishlist();
    }
  }, [isOpen, auth.user, auth]);

  const handleAddToCart = async (product: any) => {
    if (!auth.user) {
      onClose();
      router.push(authentication.login);
      return;
    }
    try {
      setAddingId(product._id);
      await cartStore.addToCart(product);
      showAddToCartToast(product);
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await auth.toggleLikeProduct(productId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    } catch {
      // ignore error
    }
  };

  const isEmpty = wishlistItems.length === 0;

  // Render Wishlist Body Content
  const renderWishlistContent = () => {
    if (loading) {
      return (
        <Flex justify="center" align="center" minH="240px" direction="column" gap={3}>
          <Spinner size="lg" color="var(--color-primary)" thickness="3px" />
          <Text fontSize="sm" color={textMuted}>
            Loading your favorites...
          </Text>
        </Flex>
      );
    }

    if (isEmpty) {
      return (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={12}
          px={4}
          textAlign="center"
          gap={4}
        >
          <Flex
            w="80px"
            h="80px"
            rounded="full"
            bg="var(--color-surface-hover)"
            align="center"
            justify="center"
            color="var(--color-primary)"
            boxShadow="sm"
          >
            <Icon as={FiHeart} boxSize={9} />
          </Flex>
          <Box>
            <Text fontSize="lg" fontWeight="700" color={textPrimary}>
              Your Wishlist is Empty
            </Text>
            <Text fontSize="sm" color={textMuted} mt={1} maxW="260px" mx="auto">
              Tap the heart on any product to save your favorite items here.
            </Text>
          </Box>
          <Button
            colorScheme="brand"
            size="md"
            rounded="full"
            px={6}
            mt={2}
            rightIcon={<FiArrowRight />}
            onClick={() => {
              onClose();
              router.push("/products");
            }}
          >
            Explore Products
          </Button>
        </Flex>
      );
    }

    return (
      <VStack spacing={3} align="stretch" pb={4}>
        {wishlistItems.map((product) => {
          const isAdding = addingId === product._id;
          const displayImg =
            product.image?.url ||
            product.image ||
            product.images?.[0]?.url ||
            product.images?.[0] ||
            "https://via.placeholder.com/150";

          return (
            <Box
              key={product._id}
              bg={cardBg}
              rounded="2xl"
              p={3}
              borderWidth="1px"
              borderColor={cardBorder}
              boxShadow="sm"
              transition="all 0.2s ease"
              _hover={{
                borderColor: hoverBorder,
                boxShadow: "md",
                transform: "translateY(-1px)",
              }}
            >
              <Flex gap={3.5} align="center">
                <Box
                  w="76px"
                  h="76px"
                  rounded="xl"
                  overflow="hidden"
                  bg={imgBg}
                  flexShrink={0}
                  borderWidth="1px"
                  borderColor={cardBorder}
                >
                  <Image
                    src={displayImg}
                    alt={product.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>

                <Box flex="1" minW={0}>
                  <Flex justify="space-between" align="flex-start" gap={1}>
                    <Text
                      fontWeight="700"
                      fontSize="sm"
                      color={textPrimary}
                      noOfLines={1}
                      lineHeight="1.3"
                    >
                      {product.name}
                    </Text>
                    <IconButton
                      aria-label="Remove from wishlist"
                      icon={<FiTrash2 size={13} />}
                      size="xs"
                      color="var(--color-text-muted)"
                      variant="ghost"
                      rounded="full"
                      _hover={{ color: "red.500", bg: "red.50" }}
                      onClick={() => handleRemoveFromWishlist(product._id)}
                    />
                  </Flex>

                  <Text fontWeight="800" fontSize="sm" color={priceColor} mt={0.5}>
                    ₹{Number(product.price || product.sellingPrice || 0).toLocaleString("en-IN")}
                  </Text>

                  <Button
                    size="xs"
                    h="30px"
                    w="full"
                    mt={2}
                    colorScheme="brand"
                    variant="solid"
                    rounded="lg"
                    leftIcon={<FiShoppingCart size={12} />}
                    isLoading={isAdding}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </VStack>
    );
  };

  // 1. Mobile Drawer: BottomSheetDrawer
  if (isMobile) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        showHandle={true}
        title={
          <HStack spacing={2} align="center">
            <Icon as={FiHeart} color="var(--color-primary)" boxSize={4} />
            <Text fontSize="md" fontWeight="800" color={textPrimary}>
              Your Wishlist
            </Text>
            {wishlistItems.length > 0 && (
              <Badge
                colorScheme="brand"
                rounded="full"
                px={2}
                py={0.5}
                fontSize="xs"
              >
                {wishlistItems.length}
              </Badge>
            )}
          </HStack>
        }
        contentProps={{
          bg: drawerBg,
          maxH: "85dvh",
        }}
        bodyProps={{
          overflowY: "auto",
          px: 4,
          py: 3,
        }}
      >
        {renderWishlistContent()}
      </BottomSheetDrawer>
    );
  }

  // 2. Desktop Drawer: Sleek Right-Hand Side Drawer
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DrawerContent
        bg={drawerBg}
        borderLeftRadius="2xl"
        borderLeft="1px solid"
        borderColor="var(--color-border)"
        boxShadow="2xl"
      >
        <DrawerCloseButton top={4} right={4} />
        <DrawerHeader
          py={4}
          px={5}
          borderBottom="1px solid"
          borderColor="var(--color-border)"
        >
          <HStack spacing={2.5} align="center">
            <Flex
              w="32px"
              h="32px"
              rounded="full"
              bg="var(--color-primary-soft)"
              align="center"
              justify="center"
              color="var(--color-primary)"
            >
              <Icon as={FiHeart} boxSize={4} />
            </Flex>
            <Box>
              <Text fontSize="md" fontWeight="800" color={textPrimary} lineHeight="1.2">
                Your Wishlist
              </Text>
              <Text fontSize="xs" color={textMuted} fontWeight="normal">
                {wishlistItems.length} {wishlistItems.length === 1 ? "saved item" : "saved items"}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody px={5} py={4} overflowY="auto">
          {renderWishlistContent()}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
});

export default WishlistDrawer;
