import {
  Badge,
  Box,
  Center,
  Circle,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FiCheckCircle, FiChevronRight, FiClipboard, FiClock, FiCreditCard, FiDollarSign, FiMapPin, FiPackage, FiSliders, FiTruck } from "react-icons/fi";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../../store/stores";
import OrderDrawer from "./OrderDrawer";

const formatCurrency = (amount: any) => {
  const numericAmount = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const statusMetaDef: Record<string, { label: string; colorScheme: string; dot: string }> = {
  pending: { label: "Pending", colorScheme: "yellow", dot: "yellow.500" },
  confirmed: { label: "Confirmed", colorScheme: "blue", dot: "blue.500" },
  processing: { label: "Processing", colorScheme: "orange", dot: "orange.500" },
  shipped: { label: "Shipped", colorScheme: "purple", dot: "purple.500" },
  delivered: { label: "Delivered", colorScheme: "green", dot: "green.500" },
  cancelled: { label: "Cancelled", colorScheme: "red", dot: "red.500" },
  created: { label: "Placed", colorScheme: "blue", dot: "blue.500" },
};

export const getStatusMeta = (status: string) => {
  const normalized = String(status || "").toLowerCase();
  return statusMetaDef[normalized] || { label: status || "Unknown", colorScheme: "gray", dot: "gray.500" };
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "created", label: "Created" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function StatCard({ label, value, delta, icon: IconCmp, tone }: any) {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  
  const toneConfig: Record<string, any> = {
    primary: { bg: useColorModeValue("blue.50", "blue.900"), color: useColorModeValue("blue.600", "blue.200"), ring: useColorModeValue("blue.100", "blue.800") },
    mint: { bg: useColorModeValue("green.50", "green.900"), color: useColorModeValue("green.600", "green.200"), ring: useColorModeValue("green.100", "green.800") },
    peach: { bg: useColorModeValue("orange.50", "orange.900"), color: useColorModeValue("orange.600", "orange.200"), ring: useColorModeValue("orange.100", "orange.800") },
    amber: { bg: useColorModeValue("yellow.50", "yellow.900"), color: useColorModeValue("yellow.600", "yellow.200"), ring: useColorModeValue("yellow.100", "yellow.800") },
  };
  
  const t = toneConfig[tone] || toneConfig.primary;

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="3xl"
      border="1px solid"
      borderColor={borderColor}
      bg={cardBg}
      p={{ base: 3, sm: 4 }}
      boxShadow={{ base: "none", sm: "sm" }}
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      <Flex align="start" justify="space-between" gap={{base:1,md:3}}>
        <Box minW={0}>
          <Text fontSize="xs" fontWeight="medium" letterSpacing="wide" color={textMuted} textTransform="uppercase">
            {label}
          </Text>
          <Text mt={{base:1,md:2}} fontFamily="heading" fontSize={{ base: "2xl", sm: "3xl" }} fontWeight="bold" lineHeight="none" letterSpacing="tight" color={textColor}>
            {value}
          </Text>
          {delta && (
            <Text mt={{base:1,md:2}} fontSize="xs" fontWeight="medium" color={textMuted}>{delta}</Text>
          )}
        </Box>
        <Flex h={8} w={8} flexShrink={0} align="center" justify="center" borderRadius="2xl" bg={t.bg} color={t.color} ring={2} ringColor={t.ring}>
          <IconCmp size={20} strokeWidth={2} />
        </Flex>
      </Flex>
    </Box>
  );
}

const OrderCard = ({ order, onClick, bg, borderColor, textColor, textMuted, getStatusMeta }: any) => {
  const meta = getStatusMeta(order.orderStatus);
  const initials = (order.user?.name || "U K").split(" ").map((n: string) => n[0]).slice(0, 2).join("");
  
  const addressStr = [
    order.shippingAddress?.addressLine1,
    order.shippingAddress?.city,
  ].filter(Boolean).join(", ") || "No address provided";

  return (
    <Box
      as="button"
      w="full"
      onClick={onClick}
      borderRadius={{ base: "2xl", sm: "3xl" }}
      border={{ base: "1px solid", sm: "1px solid" }}
      borderColor={borderColor}
      bg={bg}
      p={4}
      textAlign="left"
      boxShadow={{ base: "none", sm: "sm" }}
      transition="all 0.2s"
      _active={{ transform: "scale(0.985)" }}
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      display="block"
    >
      <Flex align="start" justify="space-between" gap={3}>
        <Flex minW={0} align="center" gap={3}>
          <Flex h={11} w={11} flexShrink={0} align="center" justify="center" borderRadius="2xl" bg="blue.500" color="white" fontSize="sm" fontWeight="bold" boxShadow={{ base: "none", sm: "sm" }}>
            {initials}
          </Flex>
          <Box minW={0}>
            <Text isTruncated fontFamily="heading" fontSize="15px" fontWeight="semibold" color={textColor}>
              {order.user?.name || "Unknown"}
            </Text>
            <Text mt={0.5} isTruncated maxW={{base:"140px",md:"100%"}} fontSize="xs" color={textMuted}>
              {order.orderId} · {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : ""}
            </Text>
          </Box>
        </Flex>
        <Badge colorScheme={meta.colorScheme} borderRadius="full" px={2.5} py={1} fontSize="11px" fontWeight="semibold" display="inline-flex" alignItems="center" gap={1.5} textTransform="capitalize">
          <Circle size={1.5} bg={meta.dot} />
          {meta.label}
        </Badge>
      </Flex>

      <Flex mt={2} align="center" gap={2} fontSize="xs" color={textMuted}>
        <Icon as={FiMapPin} boxSize={3.5} flexShrink={0} />
        <Text isTruncated>{addressStr}</Text>
      </Flex>

      <Flex mt={1} align="flex-end" justify="space-between" gap={3} borderTop="1px dashed" borderColor={borderColor} pt={3}>
        <Flex align="center" gap={3} fontSize="xs">
          <Flex align="center" gap={1} borderRadius="full" bg={useColorModeValue("gray.100", "gray.700")} px={2} py={1} fontWeight="medium" color={textColor}>
            <Icon as={FiPackage} boxSize={3} />
            {order.items?.length || 0} {(order.items?.length === 1) ? "item" : "items"}
          </Flex>
          <Flex align="center" gap={1} color={textMuted}>
            <Icon as={order.paymentMethod?.toLowerCase() === "online" ? FiCreditCard : FiDollarSign} boxSize={3.5} />
            {order.paymentMethod || "COD"}
          </Flex>
        </Flex>
        <Flex align="center" gap={1}>
          <Text fontFamily="heading" fontSize="lg" fontWeight="bold" letterSpacing="tight" color={textColor}>
            {formatCurrency(order.quote?.price?.value || order.total)}
          </Text>
          <Icon as={FiChevronRight} boxSize={4} color={textMuted} transition="transform 0.2s" _groupHover={{ transform: "translateX(2px)" }} />
        </Flex>
      </Flex>
    </Box>
  );
};

const OrdersTab = observer(() => {
  const bg = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const mutedBg = useColorModeValue("gray.100", "gray.700");

  const { orderStore, auth } = stores;
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const companyId = auth.user?.company?._id || auth.user?.company;

  const fetchOrders = useCallback(async () => {
    if (!companyId) return;
    try {
      await orderStore.fetchCompanyOrders(companyId);
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        status: "error",
      });
    }
  }, [companyId, toast, orderStore]);

  useEffect(() => {
    if (auth.token && companyId) {
      fetchOrders();
    }
  }, [fetchOrders, auth.token, companyId]);

  const handleSearchChange = (e: any) => {
    orderStore.setFilter("search", e.target.value);
  };

  const handleTabChange = (key: string) => {
    orderStore.setFilter("status", key === "all" ? "" : key);
  };

  const isMounted = React.useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      if (companyId) fetchOrders();
    }, 800);
    return () => clearTimeout(timer);
  }, [orderStore.filters.search, orderStore.filters.status, companyId, fetchOrders]);

  const metrics = useMemo(() => {
    const orders = orderStore.companyOrders || [];
    const total = orderStore.pagination.total || 0;
    const pending = orders.filter((o: any) => ["pending", "created"].includes(String(o.orderStatus).toLowerCase())).length;
    const inTransit = orders.filter((o: any) => ["confirmed", "processing", "shipped"].includes(String(o.orderStatus).toLowerCase())).length;
    const delivered = orders.filter((o: any) => String(o.orderStatus).toLowerCase() === "delivered").length;
    const revenue = orders.filter((o: any) => String(o.orderStatus).toLowerCase() !== "cancelled").reduce((s: number, o: any) => s + Number(o.quote?.price?.value || o.total || 0), 0);
    
    return { total, pending, inTransit, delivered, revenue };
  }, [orderStore.companyOrders, orderStore.pagination.total]);

  const counts = useMemo(() => {
    const orders = orderStore.companyOrders || [];
    const c: Record<string, number> = { all: orders.length };
    for (const key of filterTabs.map(t => t.key)) {
      if (key !== "all") {
         c[key] = orders.filter((o: any) => String(o.orderStatus).toLowerCase() === key).length;
      }
    }
    return c;
  }, [orderStore.companyOrders]);

  const handleRowClick = (row: any) => {
    setSelectedOrderId(row._id || row.orderId);
    onOpen();
  };

  const handleCloseDrawer = () => {
    onClose();
    setSelectedOrderId(null);
    fetchOrders(); 
  };

  const selectedOrder = orderStore.companyOrders.find(
    (o: any) => o._id === selectedOrderId || o.orderId === selectedOrderId
  );

  const currentStatusTab = orderStore.filters.status || "all";

  return (
    <Box minH="100vh" bg={bg} fontFamily="body">
      <Box px={{ sm: 4 }} pb={{base:4,md:24}} pt={{ base: 0, sm: 6 }}>
   

          <Box 
  mb={{ base: 3, sm: 6 }} 
  borderRadius={{ base: "xl", sm: "28px" }} // Sleeker radius on mobile
  border="1px solid" 
  borderColor={borderColor} 
  bg={cardBg} 
  px={{base:3,md:6}}
  py={{ base: 2, md: 6 }} // Tighter padding on mobile
  boxShadow={{ base: "none", sm: "sm" }}
>
  <Flex 
    direction={{ base: "column", sm: "row" }} 
    align={{ sm: "center" }} 
    justify={{ sm: "space-between" }} 
    gap={{ base: 3, sm: 4 }}
  >
    <Box minW={0} w="full">
      {/* Top Meta Row: Badge + Mobile Revenue */}
      <Flex justify="space-between" align="center" mb={{ sm: 2 }}>
        <Badge 
          display="inline-flex" 
          alignItems="center" 
          gap={1.5} 
          borderRadius="full" 
          bg="green.100" 
          color="green.700" 
          px={2.5} 
          py={1} 
          fontSize="11px" 
          fontWeight="semibold" 
          textTransform="none"
        >
          <Circle size={1.5} bg="green.600" />
          Live
        </Badge>

        {/* 📱 MOBILE ONLY: Revenue sits top right to save vertical space */}
        <Box display={{ base: "block", sm: "none" }} textAlign="right">
          <Text fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color={textMuted}>
            Today
          </Text>
          <Text fontFamily="heading" fontSize="md" fontWeight="bold" letterSpacing="tight" color={textColor}>
            {formatCurrency(metrics.revenue)}
          </Text>
        </Box>
      </Flex>

      <Heading 
        fontFamily="heading" 
        fontSize={{ base: "lg", sm: "2xl" }} 
        fontWeight="bold" 
        letterSpacing="tight" 
        color={textColor}
      >
        Good day, Merchant 👋
      </Heading>
      <Text mt={{md:1}} fontSize={{ base: "xs", sm: "md" }} color={textMuted}>
        You have <Text as="span" fontWeight="semibold" color={textColor}>{metrics.pending}</Text> new orders waiting for confirmation.
      </Text>
    </Box>

    {/* 💻 DESKTOP ONLY: Preserves your original boxed design */}
    <Flex display={{ base: "none", sm: "flex" }} align="center" gap={2} shrink={0}>
      <Box borderRadius="2xl" bg={mutedBg} px={4} py={3} minW="120px" textAlign="right">
        <Text fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color={textMuted}>
          Today
        </Text>
        <Text fontFamily="heading" fontSize="lg" fontWeight="bold" letterSpacing="tight" color={textColor}>
          {formatCurrency(metrics.revenue)}
        </Text>
      </Box>
    </Flex>
  </Flex>
</Box>

        {/* Stat grid */}
        <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }} gap={{ base: 2, sm: 4 }} mb={{ base: 5, sm: 6 }}>
          <StatCard label="Total" value={metrics.total} icon={FiClipboard} tone="primary" delta="All time" />
          <StatCard label="Pending" value={metrics.pending} icon={FiClock} tone="amber" delta="Needs action" />
          <StatCard label="In transit" value={metrics.inTransit} icon={FiTruck} tone="peach" delta="On the way" />
          <StatCard label="Delivered" value={metrics.delivered} icon={FiCheckCircle} tone="mint" delta="Completed" />
        </Grid>

        {/* Search + Filters */}
        <Box mb={4}>
          <Flex align="center" gap={2} mb={3}>
            <Input
              value={orderStore.filters.search || ""}
              onChange={handleSearchChange}
              placeholder="Search order ID, customer, address…"
              borderRadius="2xl"
              bg={cardBg}
              borderColor={borderColor}
              h={{base:"38px",md:"40px"}}
              px={4}
              fontSize="sm"
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
            />
            <Flex as="button"   h={{base:"38px",md:"40px"}} w={{base:"38px",md:"48px"}} shrink={0} align="center" justify="center" borderRadius="2xl" border="1px solid" borderColor={borderColor} bg={cardBg} color={textColor} transition="all 0.2s" _hover={{ bg: mutedBg }}>
              <Icon as={FiSliders} boxSize={4} />
            </Flex>
          </Flex>

          <Box mx={{ base: -4, sm: 0 }} px={{ base: 4, sm: 0 }} overflowX="auto" css={{ "&::-webkit-scrollbar": { display: "none" } }}>
            <Flex gap={2} pb={1} w="max-content">
              {filterTabs.map((t) => {
                const active = currentStatusTab === t.key;
                return (
                  <Flex
                    as="button"
                    key={t.key}
                    onClick={() => handleTabChange(t.key)}
                    align="center"
                    gap={2}
                    flexShrink={0}
                    borderRadius="full"
                    border="1px solid"
                    borderColor={active ? "transparent" : borderColor}
                    bg={active ? dashboardPalette.accent : cardBg}
                    color={active ? bg : textMuted}
                    px={3.5}
                    py={2}
                    fontSize="xs"
                    fontWeight="semibold"
                    transition="all 0.2s"
                    boxShadow={active ? "sm" : "none"}
                  >
                    {t.label}
                    <Badge bg={active ? "whiteAlpha.200" : mutedBg} color={active ? bg : textMuted} borderRadius="full" px={1.5} py={0.5} fontSize="10px">
                      {counts[t.key] || 0}
                    </Badge>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Box>

        {/* Mobile List */}
        <Grid display={{ base: "grid", lg: "none" }} templateColumns="1fr" gap={3}>
          {orderStore.isLoading ? (
            <Center py={10}><Spinner size="xl" color="blue.500" /></Center>
          ) : orderStore.companyOrders.length === 0 ? (
            <EmptyState />
          ) : (
            orderStore.companyOrders.map((o: any) => (
              <OrderCard key={o._id} order={o} onClick={() => handleRowClick(o)} bg={cardBg} borderColor={borderColor} textColor={textColor} textMuted={textMuted} getStatusMeta={getStatusMeta} />
            ))
          )}
        </Grid>

        {/* Desktop Table */}
        <Box display={{ base: "none", lg: "block" }} overflow="hidden" borderRadius="3xl" border="1px solid" borderColor={borderColor} bg={cardBg} boxShadow="sm">
          {orderStore.isLoading ? (
            <Center py={20}><Spinner size="xl" color="blue.500" /></Center>
          ) : orderStore.companyOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <TableContainer>
              <Table variant="unstyled">
                <Thead bg={useColorModeValue("gray.50", "gray.800")}>
                  <Tr borderBottom="1px solid" borderColor={borderColor}>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5}>Order</Th>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5}>Customer</Th>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5}>Date</Th>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5}>Items</Th>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5}>Status</Th>
                    <Th color={textMuted} fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" py={3} px={5} isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orderStore.companyOrders.map((o: any) => {
                    const meta = getStatusMeta(o.orderStatus);
                    const initials = (o.user?.name || "U K").split(" ").map((n: string) => n[0]).slice(0, 2).join("");
                    const addressStr = [o.shippingAddress?.addressLine1, o.shippingAddress?.city].filter(Boolean).join(", ") || "No address provided";
                    
                    return (
                      <Tr key={o._id} onClick={() => handleRowClick(o)} cursor="pointer" borderBottom="1px solid" borderColor={borderColor} transition="all 0.2s" _hover={{ bg: useColorModeValue("gray.50", "gray.700") }} _last={{ borderBottom: "none" }}>
                        <Td px={5} py={4}>
                          <Text fontWeight="semibold" color={textColor}>{o.orderId}</Text>
                          <Text mt={0.5} fontSize="xs" color={textMuted} textTransform="capitalize">{o.paymentMethod || "COD"}</Text>
                        </Td>
                        <Td px={5} py={4}>
                          <Flex align="center" gap={3}>
                            <Flex h={9} w={9} align="center" justify="center" borderRadius="xl" bg="blue.500" color="white" fontSize="xs" fontWeight="bold">
                              {initials}
                            </Flex>
                            <Box minW={0}>
                              <Text isTruncated fontWeight="medium" color={textColor}>{o.user?.name || "Unknown"}</Text>
                              <Text mt={0.5} isTruncated fontSize="xs" color={textMuted} maxW="200px">{addressStr}</Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td px={5} py={4} fontSize="sm" color={textMuted}>
                          {o.createdAt ? format(new Date(o.createdAt), "MMM d, yyyy") : ""}
                        </Td>
                        <Td px={5} py={4} fontSize="sm" color={textColor} opacity={0.8}>
                          {o.items?.length || 0} {(o.items?.length === 1) ? "item" : "items"}
                        </Td>
                        <Td px={5} py={4}>
                          <Badge colorScheme={meta.colorScheme} borderRadius="full" px={2.5} py={1} fontSize="11px" fontWeight="semibold" display="inline-flex" alignItems="center" gap={1.5} textTransform="capitalize">
                            <Circle size={1.5} bg={meta.dot} />
                            {meta.label}
                          </Badge>
                        </Td>
                        <Td px={5} py={4} isNumeric>
                          <Text fontFamily="heading" fontWeight="bold" letterSpacing="tight" color={textColor}>
                            {formatCurrency(o.quote?.price?.value || o.total)}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {selectedOrder ? (
        <OrderDrawer
          isOpen={isOpen}
          onClose={handleCloseDrawer}
          order={selectedOrder}
        />
      ) : null}
    </Box>
  );
});

function EmptyState() {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex direction="column" align="center" justify="center" borderRadius="3xl" border="1px dashed" borderColor={borderColor} bg={useColorModeValue("gray.50", "gray.800")} px={6} py={12} textAlign="center">
      <Flex h={14} w={14} align="center" justify="center" borderRadius="2xl" bg={useColorModeValue("blue.50", "blue.900")} color="blue.500">
        <Icon as={FaRupeeSign} boxSize={6} />
      </Flex>
      <Heading mt={3} fontFamily="heading" fontSize="base" fontWeight="semibold" color={textColor}>
        No orders match your filters
      </Heading>
      <Text mt={1} maxW="xs" fontSize="sm" color={textMuted}>
        Try clearing your search or switching to another status tab.
      </Text>
    </Flex>
  );
}
export default OrdersTab;