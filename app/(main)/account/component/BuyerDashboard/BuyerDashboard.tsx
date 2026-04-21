"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Badge,
  Divider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
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

type SellerPurchaseItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
};

type SellerPurchaseRecord = {
  _id: string;
  saleDate: string | null;
  grandTotal: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  status: "draft" | "posted" | "void";
  notes: string;
  postedAt: string | null;
  createdAt: string | null;
  itemCount: number;
  totalQuantity: number;
  items: SellerPurchaseItem[];
};

type SellerPurchaseDetailsSummary = {
  totalRecords: number;
  totalSpent: number;
  totalLineItems: number;
  totalQuantity: number;
  lastPurchaseAt: string | null;
  shownRecords: number;
};

type SellerPurchaseDetails = {
  profileId: string;
  partyType: "customer" | "supplier";
  sellerShop: SellerShop | null;
  displayName: string | null;
  summary: SellerPurchaseDetailsSummary;
  records: SellerPurchaseRecord[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatShortId = (value?: string | null) => (value ? value.slice(-6).toUpperCase() : "-");
const getShopInitials = (name?: string | null) =>
  name
    ? name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "SH";

const BuyerDashboard = () => {
  const [connections, setConnections] = useState<SellerConnection[]>([]);
  const [summary, setSummary] = useState<ConnectionSummary>({ totalSellers: 0, totalOutstanding: 0, totalPayable: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConnection, setSelectedConnection] = useState<SellerConnection | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<SellerPurchaseDetails | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobilePurchaseSheet = useBreakpointValue({ base: true, md: false }) ?? false;

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

  const closePurchaseModal = () => {
    onClose();
    setSelectedConnection(null);
    setPurchaseDetails(null);
    setPurchaseLoading(false);
    setPurchaseError("");
  };

  const openPurchaseModal = async (connection: SellerConnection) => {
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

  const activePurchaseShop = purchaseDetails?.sellerShop || selectedConnection?.sellerShop || null;

  const purchasePanelContent = (
    <Box h="100%" display="flex" flexDirection="column">
      <Box
        position="relative"
        overflow="hidden"
        bgGradient="linear(160deg, #0f1f5c 0%, #1d4fbf 100%)"
        color="white"
        px={{ base: 4, md: 6 }}
        pt={{ base: 3, md: 5 }}
        pb={{ base: 5, md: 6 }}
        flexShrink={0}
      >
        <Box
          display={{ base: "block", md: "none" }}
          w="42px"
          h="4px"
          borderRadius="full"
          bg="whiteAlpha.600"
          mx="auto"
          mb={4}
        />
        <Box
          position="absolute"
          top="-30px"
          right="-28px"
          h="130px"
          w="130px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 46%, rgba(255,255,255,0) 72%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          left="-54px"
          bottom="-60px"
          h="180px"
          w="180px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 74%)"
          pointerEvents="none"
        />

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
                  bg="#2BC45A"
                  color="white"
                  fontSize="9px"
                  fontWeight="900"
                >
                  {purchaseDetails.summary.totalRecords} Bills
                </Badge>
              ) : null}
            </HStack>
            <Heading
              size="md"
              fontSize={{ base: "xl", md: "2xl" }}
              lineHeight="1.08"
              noOfLines={2}
            >
              {activePurchaseShop?.name || "Seller Purchases"}
            </Heading>
            <Text mt={1.5} fontSize={{ base: "sm", md: "sm" }} color="whiteAlpha.820" maxW="380px">
              Review posted purchase bills and the exact items you bought from this seller.
            </Text>
            <HStack mt={3} spacing={3} flexWrap="wrap" color="whiteAlpha.820">
              {(activePurchaseShop?.city || activePurchaseShop?.state) && (
                <Text fontSize="xs" fontWeight="600">
                  {[activePurchaseShop?.city, activePurchaseShop?.state].filter(Boolean).join(", ")}
                </Text>
              )}
              {activePurchaseShop?.phone && (
                <Text fontSize="xs" fontWeight="600">
                  {activePurchaseShop.phone}
                </Text>
              )}
            </HStack>
          </Box>
        </Flex>
      </Box>

      <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} flex="1" overflowY="auto">
        {purchaseLoading ? (
          <Flex
            minH="280px"
            align="center"
            justify="center"
            direction="column"
            gap={3}
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Spinner color="blue.500" thickness="3px" size="lg" />
            <Text fontSize="sm" color="gray.500">
              Loading purchase items...
            </Text>
          </Flex>
        ) : purchaseError ? (
          <Flex
            minH="220px"
            align="center"
            justify="center"
            direction="column"
            gap={3}
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="red.100"
            p={6}
          >
            <Icon as={FiAlertCircle} color="red.400" boxSize={7} />
            <Text fontSize="sm" color="red.500" textAlign="center">
              {purchaseError}
            </Text>
          </Flex>
        ) : !purchaseDetails || purchaseDetails.records.length === 0 ? (
          <Flex
            minH="220px"
            align="center"
            justify="center"
            direction="column"
            gap={3}
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={6}
          >
            <Icon as={FiShoppingBag} color="blue.300" boxSize={8} />
            <Text fontWeight="700" color="gray.700">
              No posted purchases yet
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center" maxW="380px">
              This seller connection exists, but there are no posted purchase records to show yet.
            </Text>
          </Flex>
        ) : (
          <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
              <Box bg="white" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="blue.100" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="blue.700" textTransform="uppercase" letterSpacing="0.08em">
                  Posted Bills
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="blue.800" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalRecords}
                </Text>
              </Box>
              <Box bg="white" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="green.100" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="green.700" textTransform="uppercase" letterSpacing="0.08em">
                  Total Spent
                </Text>
                <Text fontSize={{ base: "md", md: "xl" }} fontWeight="900" color="green.800" mt={1.5} lineHeight="1.1" wordBreak="break-word">
                  {formatCurrency(purchaseDetails.summary.totalSpent)}
                </Text>
              </Box>
              <Box bg="white" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="purple.100" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="purple.700" textTransform="uppercase" letterSpacing="0.08em">
                  Item Lines
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="purple.800" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalLineItems}
                </Text>
              </Box>
              <Box bg="white" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="orange.100" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="orange.700" textTransform="uppercase" letterSpacing="0.08em">
                  Total Qty
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="orange.800" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalQuantity}
                </Text>
              </Box>
            </SimpleGrid>

            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "stretch", md: "start" }}
              gap={3}
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="gray.200"
              boxShadow="sm"
              p={{ base: 3.5, md: 4 }}
            >
              <Text fontSize="sm" color="gray.500">
                Showing latest {purchaseDetails.summary.shownRecords} purchase records
                {purchaseDetails.summary.totalRecords > purchaseDetails.summary.shownRecords
                  ? ` out of ${purchaseDetails.summary.totalRecords}`
                  : ""}
                .
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="700">
                Last purchase: {formatDate(purchaseDetails.summary.lastPurchaseAt)}
              </Text>
            </Flex>

            <Divider borderColor="gray.300" />

            <VStack align="stretch" spacing={4}>
              {purchaseDetails.records.map((record) => (
                <Box
                  key={record._id}
                  bg="white"
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  p={{ base: 3.5, md: 4 }}
                  boxShadow="0 14px 28px rgba(15, 31, 92, 0.06)"
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", md: "start" }}
                    gap={3}
                  >
                    <Box>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="blue" borderRadius="full" px={2.5} py={0.5}>
                          Bill #{formatShortId(record._id)}
                        </Badge>
                        <Badge colorScheme="green" borderRadius="full" px={2.5} py={0.5}>
                          {record.itemCount} items
                        </Badge>
                        <Badge colorScheme="purple" borderRadius="full" px={2.5} py={0.5}>
                          Qty {record.totalQuantity}
                        </Badge>
                      </HStack>
                      <Text mt={2} fontSize="sm" color="gray.500">
                        {formatDate(record.saleDate || record.createdAt)}
                      </Text>
                    </Box>
                    <Box
                      textAlign={{ base: "left", md: "right" }}
                      bg="linear-gradient(135deg, #0f1f5c 0%, #1743a4 100%)"
                      color="white"
                      borderRadius="xl"
                      px={{ base: 3.5, md: 4 }}
                      py={{ base: 3, md: 3.5 }}
                      minW={{ md: "180px" }}
                      alignSelf={{ base: "stretch", md: "start" }}
                    >
                      <Text fontSize="10px" color="whiteAlpha.800" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em">
                        Grand Total
                      </Text>
                      <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="white" mt={1}>
                        {formatCurrency(record.grandTotal)}
                      </Text>
                    </Box>
                  </Flex>

                  <VStack align="stretch" spacing={2.5} mt={4}>
                    {record.items.map((item, index) => (
                      <Flex
                        key={`${record._id}-${item.itemName}-${index}`}
                        direction={{ base: "column", sm: "row" }}
                        justify="space-between"
                        align={{ base: "stretch", sm: "center" }}
                        gap={3}
                        bg="#f8faff"
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="rgba(15, 31, 92, 0.08)"
                        px={{ base: 3, md: 3.5 }}
                        py={{ base: 3, md: 3.5 }}
                      >
                        <Box minW={0}>
                          <Text fontSize="sm" fontWeight="700" color="gray.800" noOfLines={2}>
                            {item.itemName}
                          </Text>
                          <HStack mt={2} spacing={2} flexWrap="wrap">
                            <Badge borderRadius="full" px={2.5} py={1} bg="blue.50" color="blue.700">
                              Qty {item.quantity}
                            </Badge>
                            <Text fontSize="xs" color="gray.500" fontWeight="600">
                              {formatCurrency(item.unitPrice)} each
                            </Text>
                          </HStack>
                        </Box>
                        <Box
                          bg="white"
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor="gray.200"
                          px={3}
                          py={2}
                          alignSelf={{ base: "flex-start", sm: "auto" }}
                          flexShrink={0}
                        >
                          <Text fontSize="10px" color="gray.500" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em">
                            Line Total
                          </Text>
                          <Text fontSize="sm" fontWeight="900" color="gray.900" mt={0.5}>
                            {formatCurrency(item.lineTotal)}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>

                  {record.notes ? (
                    <Box mt={3} bg="blue.50" borderRadius="xl" px={3.5} py={3} borderWidth="1px" borderColor="blue.100">
                      <Text fontSize="xs" color="blue.700" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em">
                        Note
                      </Text>
                      <Text mt={1} fontSize="sm" color="gray.700">
                        {record.notes}
                      </Text>
                    </Box>
                  ) : null}
                </Box>
              ))}
            </VStack>
          </VStack>
        )}
      </Box>
    </Box>
  );

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

            return (
              <Box
                key={conn.profileId}
                bg="white"
                borderRadius="xl"
                p={5}
                borderWidth="1px"
                borderColor="gray.200"
                shadow="sm"
                cursor="pointer"
                role="button"
                tabIndex={0}
                _hover={{ shadow: "md", borderColor: "blue.200", transform: "translateY(-1px)" }}
                _focusVisible={{ boxShadow: "0 0 0 3px rgba(59,130,246,0.18)", borderColor: "blue.300" }}
                transition="all 0.2s"
                onClick={() => openPurchaseModal(conn)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openPurchaseModal(conn);
                  }
                }}
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
                      {getShopInitials(shop?.name)}
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

                    <Text mt={3} fontSize="xs" fontWeight="700" color="blue.600">
                      Click to view purchased items
                    </Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}

      {isMobilePurchaseSheet ? (
        <Drawer isOpen={isOpen} placement="bottom" onClose={closePurchaseModal} size="full">
          <DrawerOverlay bg="blackAlpha.500" />
          <DrawerContent
            bg="#f4f7fb"
            h="94dvh"
            maxH="94dvh"
            borderTopRadius="28px"
            boxShadow="0 -12px 30px rgba(15, 31, 92, 0.22)"
            overflow="hidden"
          >
            <DrawerCloseButton
              top={4}
              right={4}
              color="white"
              bg="whiteAlpha.220"
              borderRadius="full"
              _hover={{ bg: "whiteAlpha.300" }}
              _active={{ bg: "whiteAlpha.340" }}
            />
            {purchasePanelContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal isOpen={isOpen} onClose={closePurchaseModal} size="3xl" scrollBehavior="inside">
          <ModalOverlay bg="blackAlpha.500" />
          <ModalContent
            overflow="hidden"
            bg="#f4f7fb"
            mx={4}
            my={6}
            maxH="88vh"
            borderRadius="2xl"
            boxShadow="0 24px 60px rgba(15, 31, 92, 0.18)"
          >
            <ModalCloseButton
              top={5}
              right={5}
              color="white"
              bg="whiteAlpha.220"
              borderRadius="full"
              _hover={{ bg: "whiteAlpha.300" }}
              _active={{ bg: "whiteAlpha.340" }}
            />
            {purchasePanelContent}
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default BuyerDashboard;
