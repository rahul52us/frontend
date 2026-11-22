"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  FiCheck,
  FiChevronRight,
  FiClock,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { RecentOrder } from "./types";
import { formatCurrency, formatDate } from "./utils";

const STEPS = [
  { key: "created", label: "Confirmed", icon: FiCheck },
  { key: "processing", label: "Packed", icon: FiPackage },
  { key: "shipped", label: "Shipped", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiCheck },
];

const getStepIndex = (status: string) => {
  const s = String(status || "").toLowerCase();
  if (s === "delivered" || s === "completed") return 3;
  if (s === "shipped") return 2;
  if (s === "processing" || s === "in-progress") return 1;
  return 0; // created / placed
};

interface LiveActiveOrdersHeroProps {
  orders: RecentOrder[];
}

export const LiveActiveOrdersHero: React.FC<LiveActiveOrdersHeroProps> = ({ orders }) => {
  // Find orders currently on the way (not delivered, not cancelled)
  const activeOrders = orders.filter((o) => {
    const s = String(o.orderStatus || "").toLowerCase();
    return s !== "delivered" && s !== "completed" && s !== "cancelled" && s !== "returned";
  });

  if (activeOrders.length === 0) return null;

  const currentOrder = activeOrders[0];
  const activeStep = getStepIndex(currentOrder.orderStatus);

  return (
    <Box
      bg="var(--color-surface)"
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      borderWidth="1px"
      borderColor="teal.500"
      boxShadow="0 4px 20px rgba(13, 148, 136, 0.15)"
      position="relative"
      overflow="hidden"
    >
      <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={2} mb={4}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="teal.400" animation="pulse 1.5s infinite" />
          <Text fontSize="xs" fontWeight="900" color="teal.400" textTransform="uppercase" letterSpacing="0.08em">
            Active Package Tracker
          </Text>
        </HStack>
        <Button as={Link} href="/dashboard/my-orders" size="xs" variant="ghost" colorScheme="teal" rightIcon={<FiChevronRight />}>
          View all ({activeOrders.length})
        </Button>
      </Flex>

      <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
        <HStack spacing={3}>
          <Avatar size="md" name={currentOrder.companyName} src={currentOrder.companyLogo || undefined} borderRadius="lg" />
          <Box>
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="800" color="var(--color-text-primary)">
                {currentOrder.orderId}
              </Text>
              <Badge colorScheme="teal" borderRadius="full" px={2} py={0.5} fontSize="9px">
                In-Transit
              </Badge>
            </HStack>
            <Text fontSize="xs" color="var(--color-text-secondary)">
              {currentOrder.firstItem?.name || "Items"} • Placed on {formatDate(currentOrder.createdAt)}
            </Text>
          </Box>
        </HStack>

        <Box textAlign={{ base: "left", sm: "right" }}>
          <Text fontSize="lg" fontWeight="900" color="var(--color-primary)">
            {formatCurrency(currentOrder.totalAmount)}
          </Text>
          <Text fontSize="10px" color="var(--color-text-secondary)" textTransform="uppercase">
            {currentOrder.paymentMethod}
          </Text>
        </Box>
      </Flex>

      {/* Progress Line */}
      <Box px={{ base: 1, md: 4 }}>
        <Flex justify="space-between" position="relative" align="center">
          {/* Connector bar */}
          <Box
            position="absolute"
            top="14px"
            left="16px"
            right="16px"
            h="3px"
            bg="var(--color-border)"
            zIndex={1}
          />
          <Box
            position="absolute"
            top="14px"
            left="16px"
            w={`${(activeStep / (STEPS.length - 1)) * 90}%`}
            h="3px"
            bg="teal.400"
            zIndex={2}
            transition="width 0.4s ease"
          />

          {STEPS.map((step, idx) => {
            const isDone = idx <= activeStep;
            const isCurrent = idx === activeStep;

            return (
              <VStack key={step.key} spacing={1.5} zIndex={3} align="center">
                <Flex
                  w="30px"
                  h="30px"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  bg={isDone ? "teal.400" : "var(--color-surface)"}
                  color={isDone ? "white" : "var(--color-text-secondary)"}
                  borderWidth="2px"
                  borderColor={isDone ? "teal.400" : "var(--color-border)"}
                  boxShadow={isCurrent ? "0 0 10px rgba(13, 148, 136, 0.5)" : "none"}
                >
                  <Icon as={step.icon} boxSize={3.5} />
                </Flex>
                <Text
                  fontSize="11px"
                  fontWeight={isCurrent ? "800" : "600"}
                  color={isDone ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
                >
                  {step.label}
                </Text>
              </VStack>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

