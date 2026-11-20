"use client";

import {
  Avatar,
  Badge,
  Box,
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
import axios from "axios";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiMapPin, FiPhone, FiShoppingBag } from "react-icons/fi";

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
        bgGradient="linear(to-br, var(--color-primary), var(--color-secondary))"
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

      <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} flex="1" overflowY="auto" bg="var(--color-bg)">
        {purchaseLoading ? (
          <Flex
            minH="280px"
            align="center"
            justify="center"
            direction="column"
            gap={3}
            bg="var(--color-surface)"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="var(--color-border)"
          >
            <Spinner color="var(--color-primary)" thickness="3px" size="lg" />
            <Text fontSize="sm" color="var(--color-text-secondary)">
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
            bg="var(--color-surface)"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="red.300"
            p={6}
          >
            <Icon as={FiAlertCircle} color="red.400" boxSize={7} />
            <Text fontSize="sm" color="red.400" textAlign="center">
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
            bg="var(--color-surface)"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="var(--color-border)"
            p={6}
          >
            <Icon as={FiShoppingBag} color="var(--color-primary)" boxSize={8} />
            <Text fontWeight="700" color="var(--color-text-primary)">
              No posted purchases yet
            </Text>
            <Text fontSize="sm" color="var(--color-text-secondary)" textAlign="center" maxW="380px">
              This seller connection exists, but there are no posted purchase records to show yet.
            </Text>
          </Flex>
        ) : (
          <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
              <Box bg="var(--color-surface)" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="var(--color-border)" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="var(--color-primary)" textTransform="uppercase" letterSpacing="0.08em">
                  Posted Bills
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="var(--color-text-primary)" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalRecords}
                </Text>
              </Box>
              <Box bg="var(--color-surface)" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="var(--color-border)" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="green.400" textTransform="uppercase" letterSpacing="0.08em">
                  Total Spent
                </Text>
                <Text fontSize={{ base: "md", md: "xl" }} fontWeight="900" color="green.400" mt={1.5} lineHeight="1.1" wordBreak="break-word">
                  {formatCurrency(purchaseDetails.summary.totalSpent)}
                </Text>
              </Box>
              <Box bg="var(--color-surface)" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="var(--color-border)" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="var(--color-primary)" textTransform="uppercase" letterSpacing="0.08em">
                  Item Lines
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="var(--color-text-primary)" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalLineItems}
                </Text>
              </Box>
              <Box bg="var(--color-surface)" borderRadius="2xl" p={{ base: 3.5, md: 4 }} borderWidth="1px" borderColor="var(--color-border)" boxShadow="sm">
                <Text fontSize="10px" fontWeight="800" color="orange.400" textTransform="uppercase" letterSpacing="0.08em">
                  Total Qty
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="900" color="orange.400" mt={1.5} lineHeight="1.05">
                  {purchaseDetails.summary.totalQuantity}
                </Text>
              </Box>
            </SimpleGrid>

            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "stretch", md: "start" }}
              gap={3}
              bg="var(--color-surface)"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="var(--color-border)"
              boxShadow="sm"
              p={{ base: 3.5, md: 4 }}
            >
              <Text fontSize="sm" color="var(--color-text-secondary)">
                Showing latest {purchaseDetails.summary.shownRecords} purchase records
                {purchaseDetails.summary.totalRecords > purchaseDetails.summary.shownRecords
                  ? ` out of ${purchaseDetails.summary.totalRecords}`
                  : ""}
                .
              </Text>
              <Text fontSize="sm" color="var(--color-text-primary)" fontWeight="700">
                Last purchase: {formatDate(purchaseDetails.summary.lastPurchaseAt)}
              </Text>
            </Flex>

            <Divider borderColor="var(--color-border)" />

            <VStack align="stretch" spacing={4}>
              {purchaseDetails.records.map((record) => (
                <Box
                  key={record._id}
                  bg="var(--color-surface)"
                  borderRadius="2xl"
                  borderWidth="1px"
                  borderColor="var(--color-border)"
                  p={{ base: 3.5, md: 4 }}
                  boxShadow="sm"
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", md: "start" }}
                    gap={3}
                  >
                    <Box>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="brand" borderRadius="full" px={2.5} py={0.5}>
                          Bill #{formatShortId(record._id)}
                        </Badge>
                        <Badge colorScheme="green" borderRadius="full" px={2.5} py={0.5}>
                          {record.itemCount} items
                        </Badge>
                        <Badge colorScheme="brand" borderRadius="full" px={2.5} py={0.5}>
                          Qty {record.totalQuantity}
                        </Badge>
                      </HStack>
                      <Text mt={2} fontSize="sm" color="var(--color-text-secondary)">
                        {formatDate(record.saleDate || record.createdAt)}
                      </Text>
                    </Box>
                    <Box
                      textAlign={{ base: "left", md: "right" }}
                      bg="linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)"
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
                        bg="var(--color-surface-soft)"
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor="var(--color-border)"
                        px={{ base: 3, md: 3.5 }}
                        py={{ base: 3, md: 3.5 }}
                      >
                        <Box minW={0}>
                          <Text fontSize="sm" fontWeight="700" color="var(--color-text-primary)" noOfLines={2}>
                            {item.itemName}
                          </Text>
                          <HStack mt={2} spacing={2} flexWrap="wrap">
                            <Badge borderRadius="full" px={2.5} py={1} bg="var(--color-surface-hover)" color="var(--color-primary)">
                              Qty {item.quantity}
                            </Badge>
                            <Text fontSize="xs" color="var(--color-text-secondary)" fontWeight="600">
                              {formatCurrency(item.unitPrice)} each
                            </Text>
                          </HStack>
                        </Box>
                        <Box
                          bg="var(--color-surface)"
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor="var(--color-border)"
                          px={3}
                          py={2}
                          alignSelf={{ base: "flex-start", sm: "auto" }}
                          flexShrink={0}
                        >
                          <Text fontSize="10px" color="var(--color-text-secondary)" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em">
                            Line Total
                          </Text>
                          <Text fontSize="sm" fontWeight="900" color="var(--color-text-primary)" mt={0.5}>
                            {formatCurrency(item.lineTotal)}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>

                  {record.notes ? (
                    <Box mt={3} bg="var(--color-surface-hover)" borderRadius="xl" px={3.5} py={3} borderWidth="1px" borderColor="var(--color-border)">
                      <Text fontSize="xs" color="var(--color-primary)" fontWeight="800" textTransform="uppercase" letterSpacing="0.08em">
                        Note
                      </Text>
                      <Text mt={1} fontSize="sm" color="var(--color-text-secondary)">
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
        <Spinner color="var(--color-primary)" thickness="3px" size="lg" />
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
        <Heading size="md" color="var(--color-text-primary)">Dashboard</Heading>
        <Text fontSize="sm" color="var(--color-text-secondary)" mt={1}>
          View your connections with sellers and track your outstanding balances.
        </Text>
      </Box>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Box
          bg="var(--color-surface)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="var(--color-border)"
          shadow="sm"
        >
          <Text fontSize="xs" fontWeight="800" color="var(--color-primary)" textTransform="uppercase" letterSpacing="0.08em">
            Connected Sellers
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="var(--color-text-primary)" mt={1}>
            {summary.totalSellers}
          </Text>
        </Box>
        <Box
          bg="var(--color-surface)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="var(--color-border)"
          shadow="sm"
        >
          <Text fontSize="xs" fontWeight="800" color="orange.400" textTransform="uppercase" letterSpacing="0.08em">
            Outstanding (You Owe)
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="orange.400" mt={1}>
            {formatCurrency(summary.totalOutstanding)}
          </Text>
        </Box>
        <Box
          bg="var(--color-surface)"
          borderRadius="xl"
          p={5}
          borderWidth="1px"
          borderColor="var(--color-border)"
          shadow="sm"
        >
          <Text fontSize="xs" fontWeight="800" color="green.400" textTransform="uppercase" letterSpacing="0.08em">
            Payable (Suppliers)
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="green.400" mt={1}>
            {formatCurrency(summary.totalPayable)}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Connection Cards */}
      {connections.length === 0 ? (
        <Box
          bg="var(--color-surface)"
          borderRadius="2xl"
          p={8}
          borderWidth="1px"
          borderColor="var(--color-border)"
          textAlign="center"
        >
          <Icon as={FiShoppingBag} boxSize={10} color="var(--color-secondary)" mb={3} />
          <Text fontWeight="700" color="var(--color-text-primary)" fontSize="md">
            No seller connections yet
          </Text>
          <Text fontSize="sm" color="var(--color-text-secondary)" mt={2} maxW="360px" mx="auto">
            When sellers add you to their customer ledger, they will appear here so you can track your transactions.
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={4}>
          <Text fontSize="sm" fontWeight="700" color="var(--color-text-secondary)" textTransform="uppercase" letterSpacing="0.08em">
            Your Sellers ({connections.length})
          </Text>
          {connections.map((conn) => {
            const shop = conn.sellerShop;
            const balance = conn.outstandingBalance;
            const isPositiveBalance = balance > 0;
            const balanceColor = conn.partyType === "customer"
              ? (isPositiveBalance ? "red.400" : "green.400")
              : (isPositiveBalance ? "orange.400" : "green.400");

            return (
              <Box
                key={conn.profileId}
                bg="var(--color-surface)"
                borderRadius="xl"
                p={5}
                borderWidth="1px"
                borderColor="var(--color-border)"
                shadow="sm"
                cursor="pointer"
                role="button"
                tabIndex={0}
                _hover={{ shadow: "md", borderColor: "var(--color-border-strong)", transform: "translateY(-1px)" }}
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
                      bg="var(--color-surface-soft)"
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
                      bg="var(--color-surface-soft)"
                      color="var(--color-primary)"
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
                        <Text fontSize="md" fontWeight="800" color="var(--color-text-primary)" noOfLines={1}>
                          {shop?.name || "Unknown Shop"}
                        </Text>
                        {(shop?.city || shop?.state) && (
                          <HStack spacing={1} mt={0.5} color="var(--color-text-secondary)">
                            <Icon as={FiMapPin} boxSize={3.5} />
                            <Text fontSize="sm">
                              {[shop.city, shop.state].filter(Boolean).join(", ")}
                            </Text>
                          </HStack>
                        )}
                      </Box>

                      <VStack spacing={0} align="end" flexShrink={0}>
                        <Text fontSize="xs" color="var(--color-text-secondary)" fontWeight="700" textTransform="uppercase">
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
                        <Text fontSize="xs" color="var(--color-text-secondary)" fontWeight="600">
                          Last: {formatDate(conn.lastPurchaseAt)}
                        </Text>
                      )}
                    </Flex>

                    {shop?.phone && (
                      <HStack mt={2} spacing={1.5} color="var(--color-text-secondary)">
                        <Icon as={FiPhone} boxSize={3.5} />
                        <Text fontSize="sm">{shop.phone}</Text>
                      </HStack>
                    )}

                    <Text mt={3} fontSize="xs" fontWeight="700" color="var(--color-primary)">
                      Click to view purchased items
                    </Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}

      {/* Purchase Details Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={closePurchaseModal}
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
          {purchasePanelContent}
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default BuyerDashboard;
