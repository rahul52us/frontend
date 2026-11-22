"use client";

import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiCheckCircle, FiClock, FiPackage, FiShoppingBag, FiTruck } from "react-icons/fi";
import { OrderData } from "../types";

interface OrderCardProps {
  order: OrderData;
  onClick: (order: OrderData) => void;
}

const getStatusBadge = (status: string) => {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "delivered":
    case "completed":
      return { label: "Delivered", colorScheme: "green" };
    case "shipped":
      return { label: "Dispatched", colorScheme: "blue" };
    case "processing":
    case "in-progress":
      return { label: "Processing", colorScheme: "orange" };
    case "cancelled":
    case "returned":
      return { label: "Cancelled", colorScheme: "red" };
    default:
      return { label: "Order Placed", colorScheme: "purple" };
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const softBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const badge = getStatusBadge(order.orderStatus);
  const totalAmount = Number(order.quote?.price?.value || order.total || 0);
  const isDelivered = order.orderStatus === "delivered" || order.orderStatus === "completed";
  const itemCount = order.items?.length || 0;

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s ease"
      _hover={{ borderColor: "brand.300", transform: "translateY(-1px)", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)" }}
      onClick={() => onClick(order)}
    >
      {/* Top Header: Store Info + Order Status + Total Amount */}
      <Flex
        p={{ base: 3, md: 4 }}
        justify="space-between"
        align="center"
        gap={2.5}
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={softBg}
      >
        <HStack spacing={2.5} minW={0} flex="1">
          <Avatar
            size="sm"
            name={order.company?.name || "Store"}
            src={order.company?.logo?.url || undefined}
            borderRadius="lg"
            flexShrink={0}
          />
          <Box minW={0}>
            <HStack spacing={2} align="center">
              <Text fontSize={{ base: "13px", md: "14px" }} fontWeight="800" color={textPrimary} noOfLines={1}>
                {order.company?.name || "Seller Store"}
              </Text>
              <Badge
                colorScheme={badge.colorScheme}
                borderRadius="full"
                px={2}
                py={0.2}
                fontSize="9px"
                fontWeight="800"
                textTransform="uppercase"
                flexShrink={0}
              >
                {badge.label}
              </Badge>
            </HStack>
            <Text fontSize="10px" color={textMuted} noOfLines={1} mt={0.2}>
              #{order.orderId.slice(-8)} • {formatDate(order.createdAt)} • {itemCount} {itemCount === 1 ? "item" : "items"}
            </Text>
          </Box>
        </HStack>

        <Box textAlign="right" flexShrink={0}>
          <Text fontSize={{ base: "14px", md: "16px" }} fontWeight="900" color={textPrimary}>
            {formatCurrency(totalAmount)}
          </Text>
          <Text fontSize="9px" color="green.600" textTransform="uppercase" fontWeight="700">
            {order.paymentMethod} • PAID
          </Text>
        </Box>
      </Flex>

      {/* Order Line Items */}
      <Box p={{ base: 3, md: 3.5 }}>
        <VStack align="stretch" spacing={2}>
          {order.items?.map((item: any, idx: number) => (
            <Flex
              key={idx}
              justify="space-between"
              align="center"
              p={2}
              borderRadius="xl"
              bg={softBg}
              gap={2}
            >
              <HStack spacing={2.5} minW={0}>
                <Avatar
                  size="xs"
                  src={item.productImage}
                  name={item.productName}
                  borderRadius="md"
                  flexShrink={0}
                />
                <Box minW={0}>
                  <Text fontSize="12px" fontWeight="700" color={textPrimary} noOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text fontSize="10px" color={textMuted}>
                    Qty: {item.quantity} • {formatCurrency(Number(item.unitPrice || 0))} each
                  </Text>
                </Box>
              </HStack>
              <Text fontSize="12px" fontWeight="800" color={textPrimary} flexShrink={0}>
                {formatCurrency(Number(item.total || item.unitPrice * item.quantity || 0))}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Delivery Timeline / Tracking Bar */}
      <Box px={{ base: 3, md: 4 }} py={2.5} borderTop="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center" fontSize="10px">
          <HStack spacing={1} color="green.500" fontWeight="700">
            <Icon as={FiCheckCircle} boxSize={3} />
            <Text>Placed</Text>
          </HStack>
          <Box flex="1" h="2px" bg={order.orderStatus !== "created" ? "green.500" : "gray.200"} mx={2} borderRadius="full" />
          <HStack
            spacing={1}
            color={order.orderStatus !== "created" ? "blue.500" : textMuted}
            fontWeight="700"
          >
            <Icon as={FiPackage} boxSize={3} />
            <Text>Dispatched</Text>
          </HStack>
          <Box flex="1" h="2px" bg={isDelivered ? "green.500" : "gray.200"} mx={2} borderRadius="full" />
          <HStack
            spacing={1}
            color={isDelivered ? "green.500" : textMuted}
            fontWeight="700"
          >
            <Icon as={FiCheckCircle} boxSize={3} />
            <Text>Delivered</Text>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

