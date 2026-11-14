"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiCreditCard, FiHeart, FiShoppingCart } from "react-icons/fi";
// import { useCartToast } from "../../../../hooks/useCartToast";
// import stores from "../../../../store/stores";
import CouponOffers from "../../individual-product/component/CouponOffers.tsx/CouponOffers";
import ProductLikeButton from "../../products/components/ProductCard/ProductLikeButton";
import stores from "../../../store/stores";
import { useCartToast } from "../../../hooks/useCartToast";

const ProductBuyBox = observer(({ product }: { product: any }) => {
  const { cartStore } = stores;
  const { showAddToCartToast } = useCartToast();
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);

  const { stock, brand, _id, id } = product || {};
  const isOutOfStock = (stock ?? 1) <= 0;

  // Hoisted Theme Tokens
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const sellerColor = useColorModeValue("blue.600", "blue.400");

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    try {
      setIsAdding(true);
      await cartStore.addToCart(product);
      showAddToCartToast(product);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      await cartStore.addToCart(product);
      if (cartStore.openCart) {
        cartStore.openCart();
      } else {
        router.push(`/checkout?buyNow=true&productId=${_id || id}`);
      }
    } catch (err) {
      console.error("Buy now error:", err);
    }
  };

  const sellerName = brand || product?.seller?.name || "Local Seller";
  const rawOffers = product?.offers;
  const offers =
    Array.isArray(rawOffers) && rawOffers.length > 0
      ? rawOffers
      : [
          "Instant 5% Cashback on Partner UPI & Credit Cards",
          "Extra ₹100 off on local express delivery",
        ];

  return (
    <Box w="full">
      {/* Stock & Seller Info Row */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        pb={2.5}
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        <HStack spacing={2} fontSize="xs">
          <Text
            fontWeight="700"
            color={!isOutOfStock ? "green.600" : "red.500"}
          >
            {!isOutOfStock ? "● In Stock" : "● Out of Stock"}
          </Text>
          <Text color={mutedText}>|</Text>
          <Text color={mutedText}>
            Sold by{" "}
            <Text as="span" color={sellerColor} fontWeight="600">
              {sellerName}
            </Text>
          </Text>
        </HStack>
      </Flex>

      {/* Action Buttons: Add to Cart & Buy Now */}
      <VStack spacing={3} align="stretch">
        <Flex gap={2.5} direction={{ base: "row", sm: "row" }}>
          <Button
            leftIcon={<FiShoppingCart size={15} />}
            variant="outline"
            colorScheme="blue"
            size="md"
            flex={1}
            h="46px"
            onClick={handleAddToCart}
            isLoading={isAdding || cartStore.loading}
            loadingText="Adding..."
            isDisabled={isOutOfStock}
            rounded="xl"
            fontWeight="700"
            fontSize="xs"
            borderWidth="1.5px"
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>

          <Button
            leftIcon={<FiCreditCard size={15} />}
            bgGradient="linear(to-r, blue.600, purple.600)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, blue.700, purple.700)",
            }}
            size="md"
            flex={1}
            h="46px"
            onClick={handleBuyNow}
            isDisabled={isOutOfStock}
            rounded="xl"
            fontWeight="700"
            fontSize="xs"
            boxShadow="0 4px 12px rgba(37, 99, 235, 0.25)"
          >
            Buy Now
          </Button>
        </Flex>

        {/* Wishlist Action Button */}
        <Flex justify="center" align="center" pt={1}>
          <HStack
            spacing={2}
            cursor="pointer"
            color="gray.600"
            _dark={{ color: "gray.300" }}
            _hover={{ color: "blue.600" }}
            transition="color 0.15s ease"
          >
            <ProductLikeButton product={product} />
            <Text fontSize="xs" fontWeight="600">
              Save to Wishlist
            </Text>
          </HStack>
        </Flex>
      </VStack>

      {/* Dynamic Coupons & Bank Offers */}
      {offers.length > 0 && (
        <Box mt={4}>
          <CouponOffers offers={offers} />
        </Box>
      )}
    </Box>
  );
});

ProductBuyBox.displayName = "ProductBuyBox";

export default ProductBuyBox;