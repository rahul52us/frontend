"use client";

import {
  Box,
  Button,
  Circle,
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
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";
import {
  MerchantBadge,
  MerchantPageHeader,
  MerchantPageShell,
} from "../components/common/merchantDashboardUI";
import { OrderCard } from "./components/OrderCard";
import { OrderDetailsDrawer } from "./components/OrderDetailsDrawer";
import { OrderData } from "./types";

export default function BuyerDashboardOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [counts, setCounts] = useState({ all: 0, active: 0, delivered: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Order Details Modal / Drawer State
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const handleOpenOrderDetails = async (order: OrderData) => {
    setSelectedOrder(order);
    onDetailsOpen();
    try {
      setDetailsLoading(true);
      const res = await axios.get(`/order/details/${order._id}`);
      if (res.data?.success && res.data?.data) {
        setSelectedOrder(res.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch fresh order details", err);
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

        {/* Content Section with Skeletons / Orders */}
        {loading ? (
          <VStack align="stretch" spacing={3}>
            {[1, 2, 3].map((i) => (
              <Box key={i} p={4} borderRadius="2xl" bg={cardBg} border="1px solid" borderColor={borderColor}>
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack spacing={3}>
                    <SkeletonCircle size="10" />
                    <Box>
                      <Skeleton h="14px" w="130px" mb={2} />
                      <Skeleton h="11px" w="80px" />
                    </Box>
                  </HStack>
                  <Skeleton h="20px" w="70px" borderRadius="full" />
                </Flex>
                <Skeleton h="45px" borderRadius="xl" />
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
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={handleOpenOrderDetails}
              />
            ))}
          </VStack>
        )}

        {/* Pagination Controls */}
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

        {/* Real-Time Order Details Drawer */}
        <OrderDetailsDrawer
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          order={selectedOrder}
          loading={detailsLoading}
        />
      </VStack>
    </MerchantPageShell>
  );
}
