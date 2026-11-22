"use client";

import {
  Avatar,
  Badge,
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiAlertCircle, FiMapPin, FiPackage, FiPhone } from "react-icons/fi";
import { SellerConnection, SellerPurchaseDetails } from "./types";
import { formatCurrency, formatDate } from "./utils";

interface SellerPurchaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConnection: SellerConnection | null;
  purchaseDetails: SellerPurchaseDetails | null;
  loading: boolean;
  error: string;
}

export const SellerPurchaseDrawer: React.FC<SellerPurchaseDrawerProps> = ({
  isOpen,
  onClose,
  selectedConnection,
  purchaseDetails,
  loading,
  error,
}) => {
  const activePurchaseShop = purchaseDetails?.sellerShop || selectedConnection?.sellerShop || null;

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size={{ base: "full", md: "lg", xl: "xl" }}
    >
      <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DrawerContent
        bg="var(--color-bg)"
        maxH="100vh"
        boxShadow="-8px 0 30px rgba(0, 0, 0, 0.3)"
        overflow="hidden"
        borderLeftWidth="1px"
        borderLeftColor="var(--color-border)"
      >
        <DrawerCloseButton
          top={4}
          right={4}
          color="white"
          bg="whiteAlpha.200"
          borderRadius="full"
          zIndex={20}
          _hover={{ bg: "whiteAlpha.300" }}
          _active={{ bg: "whiteAlpha.400" }}
        />

        <Box h="100%" display="flex" flexDirection="column">
          {/* Header */}
          <Box
            position="relative"
            overflow="hidden"
            bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
            color="white"
            px={{ base: 4, md: 6 }}
            pt={{ base: 3, md: 5 }}
            pb={{ base: 5, md: 6 }}
            flexShrink={0}
          >
            <Flex position="relative" align="start" gap={3} pr={12}>
              <Avatar
                size="md"
                name={activePurchaseShop?.name || "Shop"}
                src={activePurchaseShop?.logo || undefined}
                bg="whiteAlpha.250"
                color="white"
                border="1px solid rgba(255,255,255,0.22)"
              />
              <Box minW={0}>
                <HStack spacing={2} flexWrap="wrap" mb={2}>
                  <Badge
                    borderRadius="full"
                    px={2.5}
                    py={1}
                    bg="whiteAlpha.220"
                    color="white"
                    textTransform="uppercase"
                    fontSize="9px"
                    fontWeight="900"
                    letterSpacing="0.05em"
                  >
                    Purchase History
                  </Badge>
                  {purchaseDetails?.summary?.totalRecords ? (
                    <Badge
                      borderRadius="full"
                      px={2.5}
                      py={1}
                      bg="whiteAlpha.220"
                      color="white"
                      textTransform="uppercase"
                      fontSize="9px"
                      fontWeight="900"
                      letterSpacing="0.05em"
                    >
                      {purchaseDetails.summary.totalRecords} Records
                    </Badge>
                  ) : null}
                </HStack>
                <Heading size="md" lineHeight="short" fontWeight="900">
                  {activePurchaseShop?.name || selectedConnection?.displayName || "Shop Details"}
                </Heading>
                <HStack spacing={4} mt={1} color="whiteAlpha.800" fontSize="xs" flexWrap="wrap">
                  {(activePurchaseShop?.city || activePurchaseShop?.state) && (
                    <HStack spacing={1}>
                      <Icon as={FiMapPin} boxSize={3} />
                      <Text>{[activePurchaseShop?.city, activePurchaseShop?.state].filter(Boolean).join(", ")}</Text>
                    </HStack>
                  )}
                  {activePurchaseShop?.phone && (
                    <HStack spacing={1}>
                      <Icon as={FiPhone} boxSize={3} />
                      <Text>{activePurchaseShop.phone}</Text>
                    </HStack>
                  )}
                </HStack>
              </Box>
            </Flex>
          </Box>

          {/* Drawer Body */}
          <Box p={{ base: 4, md: 6 }} flex="1" overflowY="auto">
            {loading ? (
              <Flex minH="240px" align="center" justify="center" direction="column" gap={3}>
                <Spinner color="var(--color-primary)" thickness="3px" size="lg" />
                <Text fontSize="sm" color="var(--color-text-secondary)">Loading purchases...</Text>
              </Flex>
            ) : error ? (
              <Flex minH="240px" align="center" justify="center" direction="column" gap={3}>
                <Icon as={FiAlertCircle} color="red.400" boxSize={8} />
                <Text fontSize="sm" color="red.500">{error}</Text>
              </Flex>
            ) : !purchaseDetails?.records?.length ? (
              <Flex minH="240px" align="center" justify="center" direction="column" gap={2}>
                <Icon as={FiPackage} boxSize={10} color="var(--color-text-secondary)" />
                <Text fontWeight="700" color="var(--color-text-primary)">No purchases recorded yet</Text>
                <Text fontSize="xs" color="var(--color-text-secondary)">
                  Items purchased from this seller will appear here.
                </Text>
              </Flex>
            ) : (
              <VStack align="stretch" spacing={4}>
                {purchaseDetails.records.map((record) => (
                  <Box
                    key={record._id}
                    p={4}
                    bg="var(--color-surface)"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="var(--color-border)"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontSize="xs" fontWeight="700" color="var(--color-text-secondary)">
                        Date: {formatDate(record.saleDate)}
                      </Text>
                      <Text fontSize="sm" fontWeight="900" color="var(--color-primary)">
                        {formatCurrency(record.grandTotal)}
                      </Text>
                    </Flex>
                    <VStack align="stretch" spacing={2}>
                      {record.items.map((item, idx) => (
                        <Flex key={idx} justify="space-between" align="center" fontSize="xs">
                          <Text color="var(--color-text-primary)" fontWeight="600">{item.itemName} (x{item.quantity})</Text>
                          <Text color="var(--color-text-secondary)">{formatCurrency(item.lineTotal)}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

