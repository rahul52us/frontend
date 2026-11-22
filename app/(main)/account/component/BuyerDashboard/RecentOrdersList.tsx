"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiRefreshCw,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { RecentOrder } from "./types";
import { formatCurrency, formatDate } from "./utils";

const getOrderStatusBadge = (status: string) => {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "delivered":
    case "completed":
      return { label: "Delivered", colorScheme: "green", icon: FiCheckCircle };
    case "shipped":
      return { label: "Shipped", colorScheme: "blue", icon: FiTruck };
    case "processing":
    case "in-progress":
      return { label: "Processing", colorScheme: "orange", icon: FiRefreshCw };
    case "cancelled":
    case "returned":
      return { label: "Cancelled", colorScheme: "red", icon: FiAlertCircle };
    default:
      return { label: "Order Placed", colorScheme: "purple", icon: FiClock };
  }
};

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

export const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <Box
        bg="var(--color-surface)"
        borderRadius="2xl"
        p={8}
        borderWidth="1px"
        borderColor="var(--color-border)"
        textAlign="center"
      >
        <Icon as={FiShoppingBag} boxSize={12} color="var(--color-text-secondary)" mb={3} />
        <Heading size="sm" color="var(--color-text-primary)">
          No Orders Placed Yet
        </Heading>
        <Text fontSize="xs" color="var(--color-text-secondary)" mt={1} maxW="320px" mx="auto">
          Browse products from our sellers and place your first order!
        </Text>
        <Button as={Link} href="/" mt={4} size="sm" colorScheme="teal" fontWeight="800">
          Explore Products
        </Button>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={3}>
      {orders.map((order) => {
        const badge = getOrderStatusBadge(order.orderStatus);
        return (
          <Box
            key={order._id}
            bg="var(--color-surface)"
            borderRadius="xl"
            p={4}
            borderWidth="1px"
            borderColor="var(--color-border)"
            transition="all 0.2s"
            _hover={{ borderColor: "var(--color-primary)", shadow: "sm" }}
          >
            <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
              <HStack spacing={3}>
                <Avatar
                  size="md"
                  name={order.companyName}
                  src={order.companyLogo || undefined}
                  borderRadius="lg"
                />
                <Box>
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="800" color="var(--color-text-primary)">
                      {order.orderId}
                    </Text>
                    <Badge colorScheme={badge.colorScheme} borderRadius="full" px={2} py={0.5} fontSize="10px">
                      {badge.label}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="var(--color-text-secondary)">
                    Seller: {order.companyName} • {formatDate(order.createdAt)}
                  </Text>
                  {order.firstItem && (
                    <Text fontSize="xs" color="var(--color-text-primary)" fontWeight="600" mt={1}>
                      {order.firstItem.name} {order.totalItems > 1 ? `+${order.totalItems - 1} more items` : ""}
                    </Text>
                  )}
                </Box>
              </HStack>

              <Flex align="center" justify="space-between" w={{ base: "100%", sm: "auto" }} gap={4}>
                <Box textAlign={{ base: "left", sm: "right" }}>
                  <Text fontSize="sm" fontWeight="900" color="var(--color-primary)">
                    {formatCurrency(order.totalAmount)}
                  </Text>
                  <Text fontSize="10px" color="var(--color-text-secondary)" textTransform="uppercase">
                    {order.paymentMethod}
                  </Text>
                </Box>
                  <Button
                    as={Link}
                    href="/dashboard/my-orders"
                    size="xs"
                    variant="outline"
                    colorScheme="teal"
                    fontWeight="800"
                    rightIcon={<FiExternalLink />}
                  >
                    Details
                  </Button>
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
};

