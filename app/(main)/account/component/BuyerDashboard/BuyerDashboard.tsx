"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiShoppingBag, FiMapPin, FiPhone, FiAlertCircle } from "react-icons/fi";
import axios from "axios";

type SellerShop = {
  _id: string;
  name: string;
  logo: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
};

type SellerConnection = {
  profileId: string;
  partyType: "customer" | "supplier";
  sellerShop: SellerShop | null;
  displayName: string | null;
  outstandingBalance: number;
  isBlocked: boolean;
  lastPurchaseAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type ConnectionSummary = {
  totalSellers: number;
  totalOutstanding: number;
  totalPayable: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const BuyerDashboard = () => {
  const [connections, setConnections] = useState<SellerConnection[]>([]);
  const [summary, setSummary] = useState<ConnectionSummary>({ totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("/buyer/my-sellers");
        const data = response.data?.data;
        setConnections(data?.connections || []);
        setSummary(data?.summary || { totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return (
      <Flex minH="300px" align="center" justify="center" direction="column" gap={3}>
        <Spinner color="blue.500" thickness="3px" size="lg" />
        <Text fontSize="sm" color="gray.500">Loading your dashboard...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH="200px" align="center" justify="center" direction="column" gap={3}>
        <Icon as={FiAlertCircle} color="red.400" boxSize={8} />
        <Text fontSize="sm" color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <VStack align="stretch" spacing={6}>
      {/* Header */}
      <Box>
        <Heading size="md" color="gray.800">Dashboard</Heading>
        <Text fontSize="sm" color="gray.500" mt={1}>
          View your connections with sellers and track your outstanding balances.
        </Text>
      </Box>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Box
          bg="linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 100%)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="blue.100"
        >
          <Text fontSize="xs" fontWeight="800" color="blue.700" textTransform="uppercase" letterSpacing="0.08em">
            Connected Sellers
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="blue.600" mt={1}>
            {summary.totalSellers}
          </Text>
        </Box>
        <Box
          bg="linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="orange.200"
        >
          <Text fontSize="xs" fontWeight="800" color="orange.700" textTransform="uppercase" letterSpacing="0.08em">
            Outstanding (You Owe)
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="orange.600" mt={1}>
            {formatCurrency(summary.totalOutstanding)}
          </Text>
        </Box>
        <Box
          bg="linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="green.200"
        >
          <Text fontSize="xs" fontWeight="800" color="green.700" textTransform="uppercase" letterSpacing="0.08em">
            Payable (Suppliers)
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="green.600" mt={1}>
            {formatCurrency(summary.totalPayable)}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Connection Cards */}
      {connections.length === 0 ? (
        <Box
          bg="white"
          borderRadius="2xl"
          p={8}
          borderWidth="1px"
          borderColor="gray.200"
          textAlign="center"
        >
          <Icon as={FiShoppingBag} boxSize={10} color="blue.300" mb={3} />
          <Text fontWeight="700" color="gray.700" fontSize="md">
            No seller connections yet
          </Text>
          <Text fontSize="sm" color="gray.500" mt={2} maxW="360px" mx="auto">
            When sellers add you to their customer ledger, they will appear here so you can track your transactions.
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm" fontWeight="700" color="gray.600" textTransform="uppercase" letterSpacing="0.08em">
            Your Sellers ({connections.length})
          </Text>
          {connections.map((conn) => {
            const shop = conn.sellerShop;
            const balance = conn.outstandingBalance;
            const isPositiveBalance = balance > 0;
            const balanceColor = conn.partyType === "customer"
              ? (isPositiveBalance ? "red.500" : "green.500")
              : (isPositiveBalance ? "orange.500" : "green.500");

            const initials = shop?.name
              ? shop.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
              : "??";

            return (
              <Box
                key={conn.profileId}
                bg="white"
                borderRadius="xl"
                p={5}
                borderWidth="1px"
                borderColor="gray.200"
                shadow="sm"
                _hover={{ shadow: "md", borderColor: "blue.200" }}
                transition="all 0.2s"
              >
                <Flex align="start" gap={4}>
                  {/* Avatar / Logo */}
                  {shop?.logo ? (
                    <Box
                      w="52px"
                      h="52px"
                      borderRadius="xl"
                      overflow="hidden"
                      flexShrink={0}
                      bg="gray.100"
                    >
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  ) : (
                    <Flex
                      w="52px"
                      h="52px"
                      borderRadius="xl"
                      bg="blue.50"
                      color="blue.600"
                      align="center"
                      justify="center"
                      fontWeight="900"
                      fontSize="lg"
                      flexShrink={0}
                    >
                      {initials}
                    </Flex>
                  )}

                  {/* Details */}
                  <Box flex="1" minW={0}>
                    <Flex justify="space-between" align="start" gap={3}>
                      <Box minW={0}>
                        <Text fontSize="md" fontWeight="800" color="gray.900" noOfLines={1}>
                          {shop?.name || "Unknown Shop"}
                        </Text>
                        {(shop?.city || shop?.state) && (
                          <HStack spacing={1} mt={0.5} color="gray.500">
                            <Icon as={FiMapPin} boxSize={3.5} />
                            <Text fontSize="sm">
                              {[shop.city, shop.state].filter(Boolean).join(", ")}
                            </Text>
                          </HStack>
                        )}
                      </Box>

                      <VStack spacing={0} align="end" flexShrink={0}>
                        <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase">
                          Balance
                        </Text>
                        <Text fontSize="lg" fontWeight="900" color={balanceColor} lineHeight="1">
                          {formatCurrency(Math.abs(balance))}
                        </Text>
                      </VStack>
                    </Flex>

                    <Flex mt={3} gap={2} wrap="wrap" align="center">
                      <Badge
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        colorScheme={conn.partyType === "supplier" ? "purple" : "blue"}
                        textTransform="capitalize"
                        fontSize="0.65rem"
                      >
                        {conn.partyType === "supplier" ? "Supplier" : "Customer"}
                      </Badge>
                      <Badge
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        colorScheme={conn.isBlocked ? "red" : "green"}
                        textTransform="uppercase"
                        fontSize="0.65rem"
                      >
                        {conn.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                      {conn.lastPurchaseAt && (
                        <Text fontSize="xs" color="gray.500" fontWeight="600">
                          Last: {formatDate(conn.lastPurchaseAt)}
                        </Text>
                      )}
                    </Flex>

                    {shop?.phone && (
                      <HStack mt={2} spacing={1.5} color="gray.500">
                        <Icon as={FiPhone} boxSize={3.5} />
                        <Text fontSize="sm">{shop.phone}</Text>
                      </HStack>
                    )}
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
};

export default BuyerDashboard;
