"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiRefreshCw, FiUsers } from "react-icons/fi";
import { ConnectedSellersList } from "../../(main)/account/component/BuyerDashboard/ConnectedSellersList";
import { SellerPurchaseDrawer } from "../../(main)/account/component/BuyerDashboard/SellerPurchaseDrawer";
import { ConnectionSummary, SellerConnection, SellerPurchaseDetails } from "../../(main)/account/component/BuyerDashboard/types";
import { formatCurrency } from "../../(main)/account/component/BuyerDashboard/utils";
import {
  MerchantBadge,
  MerchantPageHeader,
  MerchantPageShell,
} from "../components/common/merchantDashboardUI";

export default function BuyerDashboardSellersPage() {
  const [connections, setConnections] = useState<SellerConnection[]>([]);
  const [summary, setSummary] = useState<ConnectionSummary>({ totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedConnection, setSelectedConnection] = useState<SellerConnection | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<SellerPurchaseDetails | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/buyer/my-sellers");
      if (res.data?.success) {
        const data = res.data.data;
        setConnections(data?.connections || []);
        setSummary(data?.summary || { totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load seller connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const openPurchaseDrawer = async (connection: SellerConnection) => {
    setSelectedConnection(connection);
    setPurchaseDetails(null);
    setPurchaseError("");
    setPurchaseLoading(true);
    onOpen();

    try {
      const response = await axios.get(`/buyer/my-sellers/${connection.profileId}/purchases`, {
        params: { limit: 10 },
      });
      setPurchaseDetails(response.data?.data || null);
    } catch (err: any) {
      setPurchaseError(err?.response?.data?.message || err?.message || "Failed to load purchase items");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const closePurchaseDrawer = () => {
    onClose();
    setSelectedConnection(null);
    setPurchaseDetails(null);
    setPurchaseLoading(false);
    setPurchaseError("");
  };

  return (
    <MerchantPageShell>
      <VStack align="stretch" spacing={6} py={2}>
        {/* Standardized Enterprise Header with Icon */}
        <MerchantPageHeader
          icon={FiUsers}
          title="Seller Khata & Connections"
          description="View connected vendors, outstanding credit dues, and purchase logs"
          mobileActions={
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              w="36px"
              h="36px"
              borderRadius="12px"
              variant="outline"
              borderColor="gray.200"
              onClick={fetchConnections}
              isLoading={loading}
            />
          }
          badges={
            <HStack spacing={2}>
              <MerchantBadge tone="accent">
                {connections.length} Connected Stores
              </MerchantBadge>
              {summary.totalOutstanding > 0 && (
                <MerchantBadge tone="warning">
                  Due: {formatCurrency(summary.totalOutstanding)}
                </MerchantBadge>
              )}
            </HStack>
          }
          actions={
            <HStack spacing={2}>
              <Button
                as={Link}
                href="/dashboard"
                size="sm"
                variant="outline"
                borderRadius="12px"
                leftIcon={<FiArrowLeft />}
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                onClick={fetchConnections}
                isLoading={loading}
                leftIcon={<FiRefreshCw />}
                borderRadius="12px"
                colorScheme="brand"
              >
                Refresh
              </Button>
            </HStack>
          }
        />

        {/* Khata Summary Cards */}
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
          <Box
            bg={cardBg}
            p={5}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Text fontSize="xs" fontWeight="800" color="brand.500" _dark={{ color: "brand.300" }} textTransform="uppercase">
              Connected Sellers
            </Text>
            <Text fontSize="2xl" fontWeight="900" color={textPrimary} mt={1}>
              {summary.totalSellers}
            </Text>
          </Box>
          <Box
            bg={cardBg}
            p={5}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Text fontSize="xs" fontWeight="800" color="orange.500" _dark={{ color: "orange.300" }} textTransform="uppercase">
              Outstanding (You Owe)
            </Text>
            <Text fontSize="2xl" fontWeight="900" color="orange.500" _dark={{ color: "orange.300" }} mt={1}>
              {formatCurrency(summary.totalOutstanding)}
            </Text>
          </Box>
          <Box
            bg={cardBg}
            p={5}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Text fontSize="xs" fontWeight="800" color="green.600" _dark={{ color: "green.400" }} textTransform="uppercase">
              Payable (Suppliers)
            </Text>
            <Text fontSize="2xl" fontWeight="900" color="green.600" _dark={{ color: "green.400" }} mt={1}>
              {formatCurrency(summary.totalPayable)}
            </Text>
          </Box>
        </SimpleGrid>

        {loading ? (
          <VStack align="stretch" spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                bg="var(--color-surface)"
                p={4}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="var(--color-border)"
              >
                <Flex justify="space-between" align="center">
                  <HStack spacing={3}>
                    <SkeletonCircle size="12" />
                    <Box>
                      <Skeleton h="14px" w="140px" mb={2} />
                      <Skeleton h="11px" w="180px" mb={1} />
                      <Skeleton h="10px" w="90px" />
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Skeleton h="10px" w="60px" mb={1} />
                    <Skeleton h="16px" w="80px" />
                  </Box>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : error ? (
          <Flex minH="200px" align="center" justify="center" direction="column" gap={3}>
            <Text fontSize="sm" color="red.500">{error}</Text>
            <Button size="sm" onClick={fetchConnections}>Retry</Button>
          </Flex>
        ) : (
          <ConnectedSellersList
            connections={connections}
            onOpenDrawer={openPurchaseDrawer}
          />
        )}

        {/* Drawer for Purchases */}
        <SellerPurchaseDrawer
          isOpen={isOpen}
          onClose={closePurchaseDrawer}
          selectedConnection={selectedConnection}
          purchaseDetails={purchaseDetails}
          loading={purchaseLoading}
          error={purchaseError}
        />
      </VStack>
    </MerchantPageShell>
  );
}

