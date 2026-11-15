"use client";

import React from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    image?: string;
    price: number | string;
    originalPrice?: number | string;
    quantity: number;
    unit?: string;
  };
  updateQuantity: (id: string, qty: number) => Promise<any> | void;
  onRemove?: (id: string) => Promise<any> | void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80";

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, onRemove }) => {
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const stepperBg = useColorModeValue("purple.50", "whiteAlpha.100");
  const stepperBorder = useColorModeValue("purple.200", "purple.700");

  const priceNum = Number(item.price) || 0;
  const originalPriceNum = Number(item.originalPrice) || 0;
  const itemTotal = priceNum * (item.quantity || 1);

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      if (onRemove) {
        onRemove(item.id);
      } else {
        updateQuantity(item.id, 0);
      }
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    } else {
      updateQuantity(item.id, 0);
    }
  };

  return (
    <Flex
      align="center"
      gap={3}
      py={2.5}
      position="relative"
      transition="all 0.2s ease"
    >
      {/* Product Thumbnail */}
      <Box
        flexShrink={0}
        boxSize="64px"
        rounded="xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        bg={useColorModeValue("gray.50", "gray.800")}
        position="relative"
      >
        <Image
          w="full"
          h="full"
          src={item.image || FALLBACK_IMAGE}
          fallbackSrc={FALLBACK_IMAGE}
          objectFit="cover"
          alt={item.name}
        />
      </Box>

      {/* Info & Quantity & Price */}
      <Box flex="1" minW={0}>
        <Flex justify="space-between" align="flex-start" gap={2}>
          <Text
            fontWeight="600"
            fontSize="sm"
            color={textColor}
            noOfLines={2}
            lineHeight="1.3"
          >
            {item.name}
          </Text>

          <IconButton
            aria-label="Remove item"
            icon={<Icon as={FiTrash2} boxSize={3.5} />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            color={useColorModeValue("gray.400", "gray.500")}
            _hover={{ color: "red.500", bg: "red.50" }}
            onClick={handleRemove}
            flexShrink={0}
          />
        </Flex>

        {/* Price & Stepper Row */}
        <Flex
          justify="space-between"
          align="center"
          mt={2}
          gap={2}
          flexWrap="wrap"
        >
          {/* Unit Price */}
          <HStack spacing={1.5} align="baseline">
            <Text fontWeight="700" fontSize="sm" color="var(--color-primary)">
              ₹{priceNum}
            </Text>
            {originalPriceNum > priceNum && (
              <Text
                fontSize="xs"
                color={mutedText}
                textDecoration="line-through"
              >
                ₹{originalPriceNum}
              </Text>
            )}
            {item.quantity > 1 && (
              <Text fontSize="2xs" color={mutedText}>
                (Total: ₹{itemTotal})
              </Text>
            )}
          </HStack>

          {/* Stepper */}
          <HStack
            spacing={0}
            bg={stepperBg}
            border="1px solid"
            borderColor={stepperBorder}
            rounded="lg"
            overflow="hidden"
            h="28px"
            flexShrink={0}
          >
            <IconButton
              size="xs"
              variant="ghost"
              icon={
                item.quantity <= 1 ? (
                  <Icon as={FiTrash2} boxSize={3} color="red.500" />
                ) : (
                  <Icon as={FiMinus} boxSize={3} color="var(--color-primary)" />
                )
              }
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              rounded="none"
              h="full"
              w="26px"
              _hover={{ bg: "purple.100" }}
            />
            <Text
              px={2}
              minW="28px"
              textAlign="center"
              fontSize="xs"
              fontWeight="700"
              color={textColor}
            >
              {item.quantity}
            </Text>
            <IconButton
              size="xs"
              variant="ghost"
              icon={<Icon as={FiPlus} boxSize={3} color="var(--color-primary)" />}
              onClick={handleIncrease}
              aria-label="Increase quantity"
              rounded="none"
              h="full"
              w="26px"
              _hover={{ bg: "purple.100" }}
            />
          </HStack>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CartItem;
