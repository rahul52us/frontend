"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Divider,
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
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFilter,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiX,
} from "react-icons/fi";
import {
  MerchantBadge,
  merchantFadeUp,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantPanel,
} from "../components/common/merchantDashboardUI";

const getStatusBadge = (status: string) => {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "delivered":
    case "completed":
      return { label: "Delivered", colorScheme: "green", icon: FiCheckCircle };
    case "shipped":
      return { label: "Dispatched", colorScheme: "blue", icon: FiTruck };
    case "processing":
    case "in-progress":
      return { label: "Processing", colorScheme: "orange", icon: FiClock };
    case "cancelled":
    case "returned":
      return { label: "Cancelled", colorScheme: "red", icon: FiPackage };
    default:
      return { label: "Order Placed", colorScheme: "purple", icon: FiShoppingBag };
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

export default function BuyerDashboardOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [counts, setCounts] = useState({ all: 0, active: 0, delivered: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Order Details Modal / Drawer State
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const cardBg = useColorModeValue("white", "gray.800");
  const softBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const fetchOrders = async (targetPage: number = 1, currentFilter: string = statusFilter, search: string = searchQuery) => {
    try {
      setLoading(true);
      setError("");
      const params: any = { page: targetPage, limit: 10 };
      if (currentFilter && currentFilter !== "all") {
        params.status = currentFilter;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const res = await axios.get("/order/my-orders", { params });
      if (res.data?.success) {
        setOrders(res.data.data || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
          setPage(res.data.pagination.page);
        }
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, "all", "");
  }, []);

  const handleTabChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchOrders(1, newStatus, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1, statusFilter, searchQuery);
  };

  const handleOpenOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    onDetailsOpen();
    try {
      setDetailsLoading(true);
      setDetailsError("");
      const res = await axios.get(`/order/details/${order._id}`);
      if (res.data?.success && res.data?.data) {
        setSelectedOrder(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch fresh order details", err);
      // Fallback: selectedOrder already has the list data
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <MerchantPageShell>
      <VStack align="stretch" spacing={{ base: 4, md: 5 }} py={2}>
        {/* Header with Circular Icon */}
        <MerchantPageHeader
          icon={FiShoppingBag}
          title="My Orders & Purchases"
          description="Detailed tracking, delivery progress, and receipts for all your orders"
          mobileActions={
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              w="36px"
              h="36px"
              borderRadius="12px"
              variant="outline"
              borderColor={borderColor}
              onClick={() => fetchOrders(page)}
              isLoading={loading}
            />
          }
          badges={
            <HStack spacing={2}>
              <MerchantBadge tone="accent">
                {counts.all ?? pagination.total} Total Orders
              </MerchantBadge>
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
                onClick={() => fetchOrders(page)}
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

        {/* Search & Filter Bar */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
        >
          {/* Segmented Interactive Status Tabs */}
          <HStack
            spacing={2}
            overflowX="auto"
            p="5px"
            borderRadius="14px"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            boxShadow="sm"
            flexShrink={0}
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {[
              { id: "all", label: "All" },
              { id: "active", label: "In Delivery" },
              { id: "delivered", label: "Delivered" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <Button
                  key={tab.id}
                  size="sm"
                  variant="unstyled"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="10px"
                  px={{ base: 3.5, md: 5 }}
                  py={2}
                  h="38px"
                  fontSize="13px"
                  fontWeight="600"
                  whiteSpace="nowrap"
                  bg={isSelected ? "brand.500" : "transparent"}
                  color={isSelected ? "white" : textMuted}
                  transition="all 0.18s ease"
                  _hover={{
                    color: isSelected ? "white" : textPrimary,
                    bg: isSelected ? "brand.600" : softBg,
                  }}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <Text as="span">{tab.label}</Text>
                </Button>
              );
            })}
          </HStack>

          {/* Search Box on Right */}
          <Box as="form" onSubmit={handleSearchSubmit} maxW={{ base: "100%", md: "280px" }} w="100%">
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search orders or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="xl"
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                boxShadow="sm"
                h="38px"
              />
            </InputGroup>
          </Box>
        </Flex>

        {/* Content Area */}
        {loading ? (
          <VStack align="stretch" spacing={3}>
            {[1, 2, 3].map((i) => (
              <Box key={i} bg={cardBg} p={5} borderRadius="2xl" border="1px solid" borderColor={borderColor}>
                <Flex justify="space-between" align="center" mb={4}>
                  <HStack spacing={3}>
                    <SkeletonCircle size="10" />
                    <Box>
                      <Skeleton h="14px" w="120px" mb={1} />
                      <Skeleton h="11px" w="180px" />
                    </Box>
                  </HStack>
                  <Skeleton h="20px" w="80px" borderRadius="full" />
                </Flex>
                <Skeleton h="45px" w="100%" borderRadius="xl" />
              </Box>
            ))}
          </VStack>
        ) : error ? (
          <Box bg={cardBg} p={10} borderRadius="2xl" textAlign="center" border="1px solid" borderColor="red.200">
            <Text color="red.500" fontSize="sm" mb={3}>{error}</Text>
            <Button size="sm" onClick={() => fetchOrders(page)} colorScheme="red">Retry</Button>
          </Box>
        ) : orders.length === 0 ? (
          <Box
            bg={cardBg}
            borderRadius="2xl"
            p={12}
            border="1px dashed"
            borderColor={borderColor}
            textAlign="center"
          >
            <Circle size="52px" bg={softBg} mx="auto" mb={3}>
              <Icon as={FiShoppingBag} boxSize={6} color={textMuted} />
            </Circle>
            <Text fontSize="md" fontWeight="800" color={textPrimary}>
              {searchQuery ? "No matching orders found" : "No orders in this status"}
            </Text>
            <Text fontSize="xs" color={textMuted} mt={1} maxW="300px" mx="auto">
              {searchQuery ? "Try searching with a different order ID or store name." : "You do not have any orders matching the selected filter."}
            </Text>
            {(searchQuery || statusFilter !== "all") && (
              <Button size="xs" mt={3} variant="outline" onClick={() => { setSearchQuery(""); handleTabChange("all"); }}>
                Reset Filters
              </Button>
            )}
          </Box>
        ) : (
          <VStack align="stretch" spacing={3.5}>
            {orders.map((order) => {
              const badge = getStatusBadge(order.orderStatus);
              const totalAmount = Number(order.quote?.price?.value || order.total || 0);
              const isDelivered = order.orderStatus === "delivered" || order.orderStatus === "completed";
              const itemCount = order.items?.length || 0;

              return (
                <Box
                  key={order._id}
                  bg={cardBg}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={borderColor}
                  boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{ borderColor: "brand.300", transform: "translateY(-1px)", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)" }}
                  onClick={() => handleOpenOrderDetails(order)}
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
            })}
          </VStack>
        )}

        {/* Pagination Controls for Millions / Lakhs of Data */}
        {pagination.totalPages > 1 && (
          <Flex
            justify="space-between"
            align="center"
            pt={3}
            wrap="wrap"
            gap={2}
          >
            <Text fontSize="xs" color={textMuted} fontWeight="600">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
                isDisabled={pagination.page <= 1}
                onClick={() => fetchOrders(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
                isDisabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchOrders(pagination.page + 1)}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        )}

        {/* Real-Time Order Details Drawer / Modal */}
        <Drawer
          isOpen={isDetailsOpen}
          placement="right"
          size="md"
          onClose={onDetailsClose}
        >
          <DrawerOverlay />
          <DrawerContent bg={cardBg} style={{ maxWidth: "520px" }}>
            <DrawerHeader
              borderBottom="1px solid"
              borderColor={borderColor}
              py={3.5}
              px={{ base: 4, md: 5 }}
            >
              <Flex align="center" justify="space-between" w="100%">
                <HStack spacing={3} align="center" minW={0} flex="1">
                  <Circle size="38px" bg={softBg} border="1px solid" borderColor={borderColor} flexShrink={0}>
                    <Icon as={FiShoppingBag} color="brand.500" boxSize={4} />
                  </Circle>
                  <Box minW={0}>
                    <Text fontSize="15px" fontWeight="800" color={textPrimary} noOfLines={1}>
                      Order Details
                    </Text>
                    <Text fontSize="11px" color={textMuted} noOfLines={1}>
                      #{selectedOrder?.orderId || ""}
                    </Text>
                  </Box>
                </HStack>

                <IconButton
                  aria-label="Close details"
                  icon={<Icon as={FiX} boxSize={4} />}
                  size="sm"
                  w="34px"
                  h="34px"
                  borderRadius="10px"
                  variant="ghost"
                  color={textMuted}
                  bg={softBg}
                  border="1px solid"
                  borderColor={borderColor}
                  _hover={{ color: textPrimary, bg: useColorModeValue("gray.100", "gray.700") }}
                  _focus={{ boxShadow: "none" }}
                  onClick={onDetailsClose}
                  flexShrink={0}
                />
              </Flex>
            </DrawerHeader>

            <DrawerBody px={{ base: 4, md: 5 }} py={4} className="customScrollBar">
              {detailsLoading ? (
                <VStack spacing={4} align="stretch" py={8}>
                  <Skeleton h="24px" borderRadius="md" />
                  <Skeleton h="80px" borderRadius="xl" />
                  <Skeleton h="120px" borderRadius="xl" />
                  <Skeleton h="160px" borderRadius="xl" />
                </VStack>
              ) : selectedOrder ? (
                <VStack spacing={4} align="stretch">
                  {/* Status & Date Card */}
                  <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontSize="12px" fontWeight="700" color={textMuted}>
                        Order Status
                      </Text>
                      <Badge
                        colorScheme={getStatusBadge(selectedOrder.orderStatus).colorScheme}
                        borderRadius="full"
                        px={2.5}
                        py={0.5}
                        fontSize="10px"
                        fontWeight="800"
                        textTransform="uppercase"
                      >
                        {getStatusBadge(selectedOrder.orderStatus).label}
                      </Badge>
                    </Flex>
                    <HStack spacing={3} fontSize="11px" color={textMuted} wrap="wrap">
                      <HStack spacing={1}>
                        <Icon as={FiCalendar} />
                        <Text>Placed: {formatDate(selectedOrder.createdAt)}</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiClock} />
                        <Text>{new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                      </HStack>
                    </HStack>
                  </Box>

                  {/* Vendor Store Details */}
                  <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                    <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2.5}>
                      Sold by Merchant
                    </Text>
                    <HStack spacing={3}>
                      <Avatar
                        size="md"
                        name={selectedOrder.company?.name || "Store"}
                        src={selectedOrder.company?.logo?.url || undefined}
                        borderRadius="12px"
                      />
                      <Box minW={0}>
                        <Text fontSize="14px" fontWeight="800" color={textPrimary} noOfLines={1}>
                          {selectedOrder.company?.name || "Merchant Store"}
                        </Text>
                        <Text fontSize="11px" color={textMuted}>
                          Code: {selectedOrder.company?.companyCode || "Verified Store"}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                      <HStack spacing={2} mb={1.5} color={textPrimary}>
                        <Icon as={FiMapPin} color="brand.500" />
                        <Text fontSize="12px" fontWeight="800">
                          Delivery Address
                        </Text>
                      </HStack>
                      <Text fontSize="12px" color={textMuted} pl={6}>
                        {[
                          selectedOrder.shippingAddress.name,
                          selectedOrder.shippingAddress.addressLine1 || selectedOrder.shippingAddress.address,
                          selectedOrder.shippingAddress.city,
                          selectedOrder.shippingAddress.state,
                          selectedOrder.shippingAddress.pincode,
                        ].filter(Boolean).join(", ")}
                      </Text>
                      {selectedOrder.shippingAddress.phone && (
                        <Text fontSize="11px" color={textMuted} pl={6} mt={1}>
                          Contact: {selectedOrder.shippingAddress.phone}
                        </Text>
                      )}
                    </Box>
                  )}

                  {/* Ordered Items List */}
                  <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                    <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2.5}>
                      Purchased Items ({selectedOrder.items?.length || 0})
                    </Text>
                    <VStack spacing={2.5} align="stretch">
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <Flex
                          key={i}
                          justify="space-between"
                          align="center"
                          p={2.5}
                          bg={cardBg}
                          borderRadius="12px"
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <HStack spacing={3} minW={0}>
                            <Avatar
                              size="sm"
                              src={item.productImage}
                              name={item.productName}
                              borderRadius="8px"
                              flexShrink={0}
                            />
                            <Box minW={0}>
                              <Text fontSize="12px" fontWeight="700" color={textPrimary} noOfLines={1}>
                                {item.productName}
                              </Text>
                              <Text fontSize="11px" color={textMuted}>
                                Qty: {item.quantity} × {formatCurrency(Number(item.unitPrice || 0))}
                              </Text>
                            </Box>
                          </HStack>
                          <Text fontSize="13px" fontWeight="800" color={textPrimary} flexShrink={0}>
                            {formatCurrency(Number(item.total || item.unitPrice * item.quantity || 0))}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  {/* Order Status History Timeline */}
                  {Array.isArray(selectedOrder.statusHistory) && selectedOrder.statusHistory.length > 0 && (
                    <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                      <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={3}>
                        Order Activity & Timeline
                      </Text>
                      <VStack align="stretch" spacing={0} position="relative">
                        {selectedOrder.statusHistory.map((hist: any, hIdx: number) => {
                          const isLast = hIdx === selectedOrder.statusHistory.length - 1;
                          const histDate = hist.timestamp ? new Date(hist.timestamp) : null;
                          return (
                            <Flex key={hIdx} position="relative" pb={isLast ? 0 : 3.5}>
                              {/* Left line */}
                              {!isLast && (
                                <Box
                                  position="absolute"
                                  left="11px"
                                  top="20px"
                                  bottom="0"
                                  w="2px"
                                  bg="brand.500"
                                  opacity={0.3}
                                />
                              )}
                              {/* Node Circle */}
                              <Circle
                                size="24px"
                                bg={hIdx === 0 ? "brand.500" : "blue.500"}
                                color="white"
                                mr={3}
                                flexShrink={0}
                                zIndex={1}
                              >
                                <Icon as={FiCheckCircle} boxSize={3} />
                              </Circle>
                              <Box minW={0} flex="1">
                                <Flex justify="space-between" align="center" gap={2} mb={0.5}>
                                  <Text fontSize="12px" fontWeight="800" color={textPrimary} textTransform="capitalize">
                                    {String(hist.status || "Updated").replace(/-/g, " ")}
                                  </Text>
                                  {histDate && (
                                    <Text fontSize="10px" color={textMuted} flexShrink={0}>
                                      {histDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}{" "}
                                      {histDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </Text>
                                  )}
                                </Flex>
                                {hist.remarks && (
                                  <Text fontSize="11px" color={textMuted}>
                                    {hist.remarks}
                                  </Text>
                                )}
                              </Box>
                            </Flex>
                          );
                        })}
                      </VStack>
                    </Box>
                  )}

                  {/* Payment & Price Summary */}
                  {(() => {
                    const itemsTotal = Array.isArray(selectedOrder.items)
                      ? selectedOrder.items.reduce((sum: number, it: any) => sum + Number(it.total || it.unitPrice * it.quantity || 0), 0)
                      : 0;
                    const subtotal = Number(selectedOrder.subtotal || itemsTotal || 0);
                    const totalPaid = Number(selectedOrder.quote?.price?.value || selectedOrder.total || itemsTotal || 0);

                    // Breakup from quote if available
                    const quoteBreakup = Array.isArray(selectedOrder.quote?.breakup) ? selectedOrder.quote.breakup : [];
                    const taxItem = quoteBreakup.find((b: any) => b.title_type === "tax");
                    const deliveryItem = quoteBreakup.find((b: any) => b.title_type === "delivery");
                    const discountItem = quoteBreakup.find((b: any) => b.title_type === "discount");

                    const deliveryCharge = Number(selectedOrder.deliveryCharges || deliveryItem?.price?.value || 0);
                    const discount = Number(selectedOrder.discount || discountItem?.price?.value || 0);
                    const tax = Number(selectedOrder.tax || taxItem?.price?.value || 0);

                    return (
                      <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                        <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2}>
                          Payment & Breakdown
                        </Text>
                        <VStack spacing={1.5} align="stretch" fontSize="12px">
                          <Flex justify="space-between" color={textMuted}>
                            <Text>Items Subtotal</Text>
                            <Text>{formatCurrency(subtotal)}</Text>
                          </Flex>
                          {deliveryCharge > 0 && (
                            <Flex justify="space-between" color={textMuted}>
                              <Text>Delivery Charges</Text>
                              <Text>{formatCurrency(deliveryCharge)}</Text>
                            </Flex>
                          )}
                          {discount > 0 && (
                            <Flex justify="space-between" color="green.500">
                              <Text>Discount</Text>
                              <Text>-{formatCurrency(discount)}</Text>
                            </Flex>
                          )}
                          {tax > 0 && (
                            <Flex justify="space-between" color={textMuted}>
                              <Text>Taxes</Text>
                              <Text>{formatCurrency(tax)}</Text>
                            </Flex>
                          )}
                          <Divider my={1} borderColor={borderColor} />
                          <Flex justify="space-between" fontSize="14px" fontWeight="900" color={textPrimary}>
                            <Text>Total Amount</Text>
                            <Text>
                              {formatCurrency(totalPaid)}
                            </Text>
                          </Flex>
                          <Flex justify="space-between" fontSize="11px" color={selectedOrder.paymentStatus === "paid" ? "green.600" : "blue.500"} fontWeight="700">
                            <Text>Payment Mode</Text>
                            <Text textTransform="uppercase">
                              {selectedOrder.paymentMethod || "ONLINE"} • {selectedOrder.paymentStatus || "SUCCESS"}
                            </Text>
                          </Flex>
                        </VStack>
                      </Box>
                    );
                  })()}
                </VStack>
              ) : null}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </VStack>
    </MerchantPageShell>
  );
}
