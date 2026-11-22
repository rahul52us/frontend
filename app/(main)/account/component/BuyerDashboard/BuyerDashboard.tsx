"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import {
  MerchantBadge,
  MerchantPageHeader,
  MerchantPageShell,
  merchantSpin,
} from "../../../../dashboard/components/common/merchantDashboardUI";
import { BuyerDashboardSkeleton } from "./BuyerDashboardSkeleton";
import { BuyerSpendingChart } from "./BuyerSpendingChart";
import { SellerPurchaseDrawer } from "./SellerPurchaseDrawer";
import { BuyerStats, ConnectionSummary, RecentOrder, SellerConnection, SellerPurchaseDetails, SpendingChartPoint } from "./types";
import { formatCurrency, formatDate } from "./utils";

export default function BuyerDashboard() {
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [spendingChart, setSpendingChart] = useState<SpendingChartPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [connections, setConnections] = useState<SellerConnection[]>([]);
  const [summary, setSummary] = useState<ConnectionSummary>({
    totalSellers: 0,
    totalOutstanding: 0,
    totalPayable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedConnection, setSelectedConnection] = useState<SellerConnection | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<SellerPurchaseDetails | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const softBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, connectionsRes] = await Promise.all([
        axios.get("/buyer/overview"),
        axios.get("/buyer/my-sellers"),
      ]);

      if (overviewRes.data?.success) {
        setStats(overviewRes.data.data?.stats || null);
        setSpendingChart(overviewRes.data.data?.spendingChart || []);
        setRecentOrders(overviewRes.data.data?.recentOrders || []);
      }

      if (connectionsRes.data?.success) {
        const data = connectionsRes.data?.data;
        setConnections(data?.connections || []);
        setSummary(data?.summary || { totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <BuyerDashboardSkeleton />;
  }

  // Active in-progress order
  const activeOrders = recentOrders.filter((o) => {
    const s = String(o.orderStatus || "").toLowerCase();
    return s !== "delivered" && s !== "completed" && s !== "cancelled" && s !== "returned";
  });
  const heroOrder = activeOrders[0] || recentOrders[0] || null;
  const isOrderActive = heroOrder && heroOrder.orderStatus !== "delivered" && heroOrder.orderStatus !== "completed";

  return (
    <VStack align="stretch" spacing={{ base: 4, md: 5 }} py={{ base: 1, md: 2 }}>
      {/* 1. Unified Enterprise Merchant Page Header with Circular Icon */}
      <MerchantPageHeader
        icon={FiShoppingBag}
        title="Buyer Console"
        description="Here is what's happening with your orders, deliveries, and store khatas today"
        mobileActions={
          <HStack spacing={1.5}>
            <Button
              as={Link}
              href="/dashboard/my-orders"
              size="xs"
              colorScheme="brand"
              borderRadius="full"
              px={2.5}
              py={1}
              fontSize="11px"
            >
              Orders
            </Button>
            <IconButton
              aria-label="Refresh"
              icon={
                <Icon
                  as={FiRefreshCw}
                  animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                />
              }
              size="sm"
              w="36px"
              h="36px"
              onClick={fetchDashboardData}
              isDisabled={loading}
              borderRadius="12px"
              variant="outline"
              borderColor={borderColor}
            />
          </HStack>
        }
        badges={
          <HStack spacing={2} align="center">
            <HStack
              spacing={1.5}
              px={3}
              py={1}
              borderRadius="full"
              border="1px solid"
              borderColor={borderColor}
              bg={softBg}
            >
              <Circle size="6px" bg="green.500" />
              <Text fontSize="11px" fontWeight="700" color={textPrimary} letterSpacing="0.3px">
                Buyer Account
              </Text>
            </HStack>
            {stats?.activeOrders ? (
              <HStack
                spacing={1.5}
                px={3}
                py={1}
                borderRadius="full"
                border="1px solid"
                borderColor="orange.300"
                bg="orange.50"
                _dark={{ bg: "rgba(221, 107, 32, 0.15)", borderColor: "rgba(221, 107, 32, 0.4)" }}
              >
                <Circle size="6px" bg="orange.400" />
                <Text fontSize="11px" fontWeight="700" color="orange.600" _dark={{ color: "orange.300" }}>
                  {stats.activeOrders} In-Transit
                </Text>
              </HStack>
            ) : null}
          </HStack>
        }
        actions={
          <HStack spacing={2}>
            <Button
              as={Link}
              href="/dashboard/my-orders"
              size="sm"
              colorScheme="brand"
              borderRadius="12px"
              rightIcon={<FiArrowRight />}
            >
              All Purchases
            </Button>
            <IconButton
              size="sm"
              aria-label="Refresh"
              icon={
                <Icon
                  as={FiRefreshCw}
                  animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                />
              }
              variant="outline"
              borderRadius="12px"
              borderColor={borderColor}
              onClick={fetchDashboardData}
            />
          </HStack>
        }
      />

      {/* 2. Primary 4 KPI Stat Cards (Desktop 4-col, Mobile 2x2 grid with tight padding) */}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 2.5, md: 4 }}>
        {/* IN DELIVERY */}
        <Box
          as={Link}
          href="/dashboard/my-orders"
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: "md", borderColor: "blue.300" }}
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontSize={{ base: "10px", md: "xs" }} fontWeight="700" color={textMuted} textTransform="uppercase">
              In Delivery
            </Text>
            <Circle size={{ base: "26px", md: "32px" }} bg="blue.50" color="blue.500">
              <Icon as={FiTruck} boxSize={{ base: 3, md: 4 }} />
            </Circle>
          </Flex>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color={textPrimary}>
            {stats?.activeOrders ?? 0}
          </Text>
          <Text fontSize={{ base: "10px", md: "11px" }} color="blue.500" fontWeight="600" mt={0.5} noOfLines={1}>
            {stats?.activeOrders ? "Active & on the way" : "No active shipment"}
          </Text>
        </Box>

        {/* TOTAL KHATA DUE */}
        <Box
          as={Link}
          href="/dashboard/my-sellers"
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="2xl"
          border="1px solid"
          borderColor={summary.totalOutstanding > 0 ? "orange.300" : borderColor}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: "md", borderColor: "orange.400" }}
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontSize={{ base: "10px", md: "xs" }} fontWeight="700" color={textMuted} textTransform="uppercase">
              Total Khata Due
            </Text>
            <Circle size={{ base: "26px", md: "32px" }} bg="orange.50" color="orange.500">
              <Icon as={FiCreditCard} boxSize={{ base: 3, md: 4 }} />
            </Circle>
          </Flex>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color={summary.totalOutstanding > 0 ? "orange.500" : textPrimary} noOfLines={1}>
            {formatCurrency(summary.totalOutstanding)}
          </Text>
          <Text fontSize={{ base: "10px", md: "11px" }} color={summary.totalOutstanding > 0 ? "orange.600" : "green.500"} fontWeight="600" mt={0.5} noOfLines={1}>
            {summary.totalOutstanding > 0 ? "Outstanding to sellers" : "All khata clear"}
          </Text>
        </Box>

        {/* DELIVERED */}
        <Box
          as={Link}
          href="/dashboard/my-orders"
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: "md", borderColor: "green.300" }}
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontSize={{ base: "10px", md: "xs" }} fontWeight="700" color={textMuted} textTransform="uppercase">
              Delivered
            </Text>
            <Circle size={{ base: "26px", md: "32px" }} bg="green.50" color="green.500">
              <Icon as={FiCheckCircle} boxSize={{ base: 3, md: 4 }} />
            </Circle>
          </Flex>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color={textPrimary}>
            {stats?.deliveredOrders ?? 0}
          </Text>
          <Text fontSize={{ base: "10px", md: "11px" }} color="green.500" fontWeight="600" mt={0.5} noOfLines={1}>
            Successfully received
          </Text>
        </Box>

        {/* STORES / VYAPARI */}
        <Box
          as={Link}
          href="/dashboard/my-sellers"
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)", boxShadow: "md", borderColor: "teal.300" }}
        >
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontSize={{ base: "10px", md: "xs" }} fontWeight="700" color={textMuted} textTransform="uppercase">
              Stores / Vyapari
            </Text>
            <Circle size={{ base: "26px", md: "32px" }} bg="teal.50" color="teal.500">
              <Icon as={FiUsers} boxSize={{ base: 3, md: 4 }} />
            </Circle>
          </Flex>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="900" color={textPrimary}>
            {connections.length}
          </Text>
          <Text fontSize={{ base: "10px", md: "11px" }} color="teal.600" fontWeight="600" mt={0.5} noOfLines={1}>
            Linked suppliers
          </Text>
        </Box>
      </SimpleGrid>

      {/* 3. LATEST ORDER STATUS (Clean & Instant Comprehension) */}
      {heroOrder && (
        <Box
          as={Link}
          href="/dashboard/my-orders"
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 3.5, md: 4 }}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          display="block"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ borderColor: "blue.300", transform: "translateY(-1px)", boxShadow: "md" }}
        >
          {/* Header */}
          <Flex justify="space-between" align="center" mb={2.5}>
            <HStack spacing={2} minW={0}>
              <Circle size="24px" bg={isOrderActive ? "blue.50" : "green.50"} color={isOrderActive ? "blue.600" : "green.600"}>
                <Icon as={isOrderActive ? FiTruck : FiCheckCircle} boxSize={3} />
              </Circle>
              <Text fontSize="12px" fontWeight="800" color={textPrimary} noOfLines={1}>
                {isOrderActive ? "Tracking Your Ongoing Order" : "Latest Purchase Details"}
              </Text>
            </HStack>

            <Badge
              colorScheme={isOrderActive ? "blue" : "green"}
              borderRadius="full"
              px={2.5}
              py={0.5}
              fontSize="10px"
              fontWeight="800"
              textTransform="uppercase"
            >
              {isOrderActive ? "On The Way" : "Delivered"}
            </Badge>
          </Flex>

          {/* Product row with price */}
          <Flex
            p={3}
            borderRadius="xl"
            bg={softBg}
            align="center"
            justify="space-between"
            gap={2.5}
            mb={3}
          >
            <HStack spacing={3} minW={0}>
              <Avatar
                size="sm"
                name={heroOrder.firstItem?.name || "Product"}
                src={heroOrder.firstItem?.image}
                borderRadius="lg"
              />
              <Box minW={0}>
                <Text fontSize="13px" fontWeight="800" color={textPrimary} noOfLines={1}>
                  {heroOrder.firstItem?.name || "Order Item"}
                </Text>
                <Text fontSize="11px" color={textMuted} noOfLines={1}>
                  Store: <b>{heroOrder.companyName}</b> • {formatDate(heroOrder.createdAt)}
                </Text>
              </Box>
            </HStack>

            <Box textAlign="right" flexShrink={0}>
              <Text fontSize="14px" fontWeight="900" color={textPrimary}>
                {formatCurrency(heroOrder.totalAmount)}
              </Text>
              <Text fontSize="10px" color="green.600" fontWeight="700" textTransform="uppercase">
                Paid Online
              </Text>
            </Box>
          </Flex>

          {/* 3 Step Progress Tracker with human text */}
          <Box px={{ base: 2, md: 4 }} py={1}>
            <Flex justify="space-between" align="center" position="relative">
              {/* Step 1: Placed */}
              <VStack spacing={1} zIndex={1} align="center">
                <Circle size="22px" bg="green.500" color="white">
                  <Icon as={FiCheckCircle} boxSize={2.5} />
                </Circle>
                <Text fontSize="11px" fontWeight="700" color={textPrimary}>
                  Order Placed
                </Text>
              </VStack>

              {/* Line 1 */}
              <Box
                flex="1"
                h="2.5px"
                bg={heroOrder.orderStatus !== "created" ? "green.500" : "gray.200"}
                mx={2}
                borderRadius="full"
              />

              {/* Step 2: Dispatched */}
              <VStack spacing={1} zIndex={1} align="center">
                <Circle
                  size="22px"
                  bg={heroOrder.orderStatus !== "created" ? "blue.500" : "gray.200"}
                  color={heroOrder.orderStatus !== "created" ? "white" : "gray.400"}
                >
                  <Icon as={FiPackage} boxSize={2.5} />
                </Circle>
                <Text fontSize="11px" fontWeight="700" color={heroOrder.orderStatus !== "created" ? textPrimary : textMuted}>
                  Dispatched
                </Text>
              </VStack>

              {/* Line 2 */}
              <Box
                flex="1"
                h="2.5px"
                bg={heroOrder.orderStatus === "delivered" ? "green.500" : "gray.200"}
                mx={2}
                borderRadius="full"
              />

              {/* Step 3: Delivered */}
              <VStack spacing={1} zIndex={1} align="center">
                <Circle
                  size="22px"
                  bg={heroOrder.orderStatus === "delivered" ? "green.500" : "gray.200"}
                  color={heroOrder.orderStatus === "delivered" ? "white" : "gray.400"}
                >
                  <Icon as={FiCheckCircle} boxSize={2.5} />
                </Circle>
                <Text fontSize="11px" fontWeight="700" color={heroOrder.orderStatus === "delivered" ? textPrimary : textMuted}>
                  Delivered
                </Text>
              </VStack>
            </Flex>
          </Box>
        </Box>
      )}

      {/* 4. SMART PURCHASING TREND CHART */}
      <BuyerSpendingChart spendingChart={spendingChart} />

      {/* 5. SPLIT WORKSPACE: Recent Purchases & Connected Stores */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 4, md: 5 }}>
        {/* Left: Recent Purchases */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            gap={2.5}
            mb={4}
          >
            <HStack spacing={2.5} minW={0} flex="1">
              <Circle size="34px" bg="blue.50" color="blue.600" _dark={{ bg: "blue.900", color: "blue.200" }} flexShrink={0}>
                <Icon as={FiShoppingBag} boxSize={4} />
              </Circle>
              <Box minW={0}>
                <Text fontSize="sm" fontWeight="800" color={textPrimary} noOfLines={1}>
                  Recent Purchases
                </Text>
                <Text fontSize="11px" color={textMuted} noOfLines={1}>
                  Last {recentOrders.length} orders from your suppliers
                </Text>
              </Box>
            </HStack>
            <Button
              as={Link}
              href="/dashboard/my-orders"
              size="xs"
              variant="outline"
              borderRadius="full"
              borderColor={borderColor}
              color={textPrimary}
              _hover={{ bg: softBg, borderColor: "brand.500", color: "brand.500" }}
              rightIcon={<FiArrowRight />}
              flexShrink={0}
              alignSelf={{ base: "flex-start", sm: "auto" }}
            >
              View All ({stats?.totalOrders ?? 0})
            </Button>
          </Flex>

          {recentOrders.length === 0 ? (
            <Box py={8} textAlign="center">
              <Circle size="40px" bg={softBg} mx="auto" mb={2}>
                <Icon as={FiShoppingBag} boxSize={4} color={textMuted} />
              </Circle>
              <Text fontSize="xs" fontWeight="700" color={textPrimary}>
                No orders placed yet
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={2.5}>
              {recentOrders.slice(0, 4).map((order) => {
                const isDelivered = order.orderStatus === "delivered" || order.orderStatus === "completed";
                const isCancelled = order.orderStatus === "cancelled";
                return (
                  <Flex
                    key={order._id}
                    as={Link}
                    href="/dashboard/my-orders"
                    p={3}
                    borderRadius="14px"
                    bg={softBg}
                    align="center"
                    justify="space-between"
                    gap={3}
                    border="1px solid"
                    borderColor="transparent"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: cardBg,
                      borderColor: borderColor,
                      transform: "translateY(-1px)",
                      boxShadow: "sm",
                    }}
                  >
                    <HStack spacing={3} minW={0}>
                      <Avatar
                        size="sm"
                        name={order.companyName}
                        src={order.companyLogo || undefined}
                        borderRadius="10px"
                        border="1px solid"
                        borderColor={borderColor}
                      />
                      <Box minW={0}>
                        <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={1}>
                          {order.companyName}
                        </Text>
                        <Text fontSize="11px" color={textMuted} noOfLines={1}>
                          #{order.orderId.slice(-8)} • {formatDate(order.createdAt)}
                        </Text>
                      </Box>
                    </HStack>

                    <HStack spacing={2.5} flexShrink={0}>
                      <Box textAlign="right">
                        <Text fontSize="13px" fontWeight="800" color={textPrimary}>
                          {formatCurrency(order.totalAmount)}
                        </Text>
                        <Badge
                          colorScheme={isDelivered ? "green" : isCancelled ? "red" : "blue"}
                          fontSize="9px"
                          fontWeight="700"
                          borderRadius="full"
                          px={2}
                          py={0.5}
                          textTransform="uppercase"
                        >
                          {order.orderStatus}
                        </Badge>
                      </Box>

                      <Circle size="28px" bg={cardBg} border="1px solid" borderColor={borderColor} color={textMuted}>
                        <Icon as={FiArrowRight} boxSize={3} />
                      </Circle>
                    </HStack>
                  </Flex>
                );
              })}
            </VStack>
          )}
        </Box>

        {/* Right: Connected Stores / Khata */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            gap={2.5}
            mb={4}
          >
            <HStack spacing={2.5} minW={0} flex="1">
              <Circle size="34px" bg="purple.50" color="purple.600" _dark={{ bg: "purple.900", color: "purple.200" }} flexShrink={0}>
                <Icon as={FiUsers} boxSize={4} />
              </Circle>
              <Box minW={0}>
                <Text fontSize="sm" fontWeight="800" color={textPrimary} noOfLines={1}>
                  My Seller Khata
                </Text>
                <Text fontSize="11px" color={textMuted} noOfLines={1}>
                  Stores where your credit/khata is active
                </Text>
              </Box>
            </HStack>
            <Button
              as={Link}
              href="/dashboard/my-sellers"
              size="xs"
              variant="outline"
              borderRadius="full"
              borderColor={borderColor}
              color={textPrimary}
              _hover={{ bg: softBg, borderColor: "brand.500", color: "brand.500" }}
              rightIcon={<FiArrowRight />}
              flexShrink={0}
              alignSelf={{ base: "flex-start", sm: "auto" }}
            >
              Full Ledger
            </Button>
          </Flex>

          {connections.length === 0 ? (
            <Box py={8} textAlign="center">
              <Circle size="40px" bg={softBg} mx="auto" mb={2}>
                <Icon as={FiUsers} boxSize={4} color={textMuted} />
              </Circle>
              <Text fontSize="xs" fontWeight="700" color={textPrimary}>
                No linked stores
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={2.5}>
              {connections.slice(0, 4).map((conn) => {
                const shop = conn.sellerShop;
                const due = conn.outstandingBalance;
                const hasDue = due > 0;

                return (
                  <Box
                    key={conn.profileId}
                    p={3}
                    borderRadius="14px"
                    bg={softBg}
                    cursor="pointer"
                    border="1px solid"
                    borderColor="transparent"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: cardBg,
                      borderColor: borderColor,
                      transform: "translateY(-1px)",
                      boxShadow: "sm",
                    }}
                    onClick={() => openPurchaseDrawer(conn)}
                  >
                    <Flex justify="space-between" align="center" gap={3}>
                      <HStack spacing={3} minW={0}>
                        <Avatar
                          size="sm"
                          name={shop?.name || conn.displayName || "Store"}
                          src={shop?.logo || undefined}
                          borderRadius="10px"
                          border="1px solid"
                          borderColor={borderColor}
                        />
                        <Box minW={0}>
                          <Text fontSize="13px" fontWeight="700" color={textPrimary} noOfLines={1}>
                            {shop?.name || conn.displayName}
                          </Text>
                          <HStack spacing={1.5} fontSize="11px" color={textMuted}>
                            <Icon as={FiMapPin} boxSize={3} />
                            <Text noOfLines={1}>{[shop?.city, shop?.state].filter(Boolean).join(", ") || "India"}</Text>
                          </HStack>
                        </Box>
                      </HStack>

                      <HStack spacing={2.5} flexShrink={0}>
                        <Box textAlign="right">
                          <Text fontSize="10px" color={textMuted} textTransform="uppercase" fontWeight="700">
                            {hasDue ? "Pending Due" : "Settled"}
                          </Text>
                          <Text fontSize="13px" fontWeight="900" color={hasDue ? "orange.500" : "green.600"}>
                            {formatCurrency(due)}
                          </Text>
                        </Box>

                        <Circle size="28px" bg={cardBg} border="1px solid" borderColor={borderColor} color={textMuted}>
                          <Icon as={FiArrowRight} boxSize={3} />
                        </Circle>
                      </HStack>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Box>
      </SimpleGrid>

      {/* Slide-in Purchase Drawer for Invoices */}
      <SellerPurchaseDrawer
        isOpen={isOpen}
        onClose={closePurchaseDrawer}
        selectedConnection={selectedConnection}
        purchaseDetails={purchaseDetails}
        loading={purchaseLoading}
        error={purchaseError}
      />
    </VStack>
  );
}
