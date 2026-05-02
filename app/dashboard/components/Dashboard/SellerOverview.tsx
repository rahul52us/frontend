"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  List,
  ListItem,
  Progress,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaBoxOpen,
  FaCheckCircle,
  FaChevronRight,
  FaClipboardList,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegCircle,
  FaStore,
  FaTruck,
  FaUserFriends,
  FaWarehouse
} from "react-icons/fa";
import { dashboardHeroGradient, dashboardHeroGradientLight, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";

const MotionBox = motion(Box);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// ... Types ...
type DashboardOrder = { _id?: string; orderId?: string; orderStatus?: string; createdAt?: string; total?: number; user?: { name?: string; }; quote?: { price?: { value?: number | string; }; }; items?: any[]; };
type DashboardProduct = { _id: string; name?: string; stock?: number; status?: "active" | "draft" | "discontinued"; isFeatured?: boolean; updatedAt?: string; createdAt?: string; isDeleted?: boolean; };
type DashboardParty = { _id: string; name?: string; phone?: string; email?: string; partyType?: "customer" | "supplier"; outstandingBalance?: number; };
type DashboardNotification = { _id: string; title: string; message: string; category?: string; priority?: "low" | "medium" | "high"; isRead?: boolean; createdAt?: string; };
type DashboardMetrics = { totalOrders: number; pendingOrders: number; inFlightOrders: number; deliveredOrders: number; totalProducts: number; activeProducts: number; lowStockProducts: number; outOfStockProducts: number; featuredProducts: number; totalCustomers: number; totalSuppliers: number; customerReceivable: number; customerAdvance: number; supplierPayable: number; supplierAdvance: number; unreadNotifications: number; };
type DashboardData = { company: any | null; metrics: DashboardMetrics; recentOrders: DashboardOrder[]; lowStockItems: DashboardProduct[]; topCustomers: DashboardParty[]; topSuppliers: DashboardParty[]; notifications: DashboardNotification[]; };

const defaultMetrics: DashboardMetrics = { totalOrders: 0, pendingOrders: 0, inFlightOrders: 0, deliveredOrders: 0, totalProducts: 0, activeProducts: 0, lowStockProducts: 0, outOfStockProducts: 0, featuredProducts: 0, totalCustomers: 0, totalSuppliers: 0, customerReceivable: 0, customerAdvance: 0, supplierPayable: 0, supplierAdvance: 0, unreadNotifications: 0 };

const formatCurrency = (value: number) => `Rs ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const formatCompactCurrency = (value: number) => new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value || 0));

const formatRelativeTime = (value?: string) => {
  if (!value) return "Just now";
  const now = Date.now();
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "Recently";
  const diffMinutes = Math.max(Math.floor((now - target) / (1000 * 60)), 0);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const getOrderAmount = (order: DashboardOrder) => Number(order.quote?.price?.value || order.total || 0);

const getOrderStatusMeta = (status?: string) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "delivered") return { label: "Delivered", colorScheme: "green" };
  if (normalized === "shipped" || normalized === "processing") return { label: normalized === "shipped" ? "Shipped" : "Processing", colorScheme: "blue" };
  if (normalized === "cancelled") return { label: "Cancelled", colorScheme: "red" };
  if (normalized === "created" || normalized === "pending" || normalized === "confirmed") return { label: "Pending", colorScheme: "orange" };
  return { label: "Placed", colorScheme: "gray" };
};

const getPriorityColor = (priority?: string) => {
  if (priority === "high") return "red";
  if (priority === "medium") return "orange";
  return "blue";
};

const MetricCard = ({ label, value, helper, icon, colorScheme }: any) => {
  const bg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("gray.100", dashboardPalette.border);
  const textPrimary = useColorModeValue("gray.800", dashboardPalette.text);
  const textMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const iconBg = useColorModeValue(`${colorScheme}.50`, `rgba(255,255,255,0.05)`);
  const iconColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.300`);
  // const topBarBg = useColorModeValue(`${colorScheme}.400`, dashboardPalette.accent);
  const topBarBg =`${colorScheme}.400`;

  return (
  <MotionBox
      variants={itemVariants}
      // Use whileHover for Framer Motion's hardware-accelerated animations
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2, ease: "easeInOut" } 
      }}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={5}
      boxShadow={useColorModeValue("sm", "0 18px 30px rgba(0, 0, 0, 0.22)")}
      position="relative"
      overflow="hidden"
      // Keep border color changes in Chakra's _hover as they are non-transform properties
      _hover={{ 
        borderColor: useColorModeValue(`${colorScheme}.200`, dashboardPalette.borderAccent),
        boxShadow: "md" 
      }}
      // This ensures the border and shadow transition smoothly
      animate="all 0.2s cubic-bezier(.08,.52,.52,1)"
    >
      <Box position="absolute" insetX={0} top={0} h="4px" bg={topBarBg} />
      <Flex justify="space-between" align="start" gap={3}>
        <Stat>
          <StatLabel fontSize="sm" color={textMuted} fontWeight="medium">
            {label}
          </StatLabel>
          <StatNumber fontSize={{ base: "xl", md: "2xl" }} color={textPrimary} fontWeight="700" mt={1}>
            {value}
          </StatNumber>
          <StatHelpText mb={0} color={textMuted} fontSize="xs" mt={1}>{helper}</StatHelpText>
        </Stat>
        <Circle size="48px" bg={iconBg}>
          <Icon as={icon} color={iconColor} boxSize={6} />
        </Circle>
      </Flex>
    </MotionBox>
  );
};

const SectionCard = ({ title, subtitle, actionLabel, onAction, children, delay = 0 }: any) => {
  const bg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("gray.100", dashboardPalette.border);
  const textPrimary = useColorModeValue("gray.800", dashboardPalette.text);
  const textMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  
  return (
    <MotionBox
      variants={itemVariants}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      boxShadow={useColorModeValue("sm", "0 18px 30px rgba(0, 0, 0, 0.22)")}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
        <Box>
          <Heading size="md" color={textPrimary} fontWeight="700">
            {title}
          </Heading>
          {subtitle ? (
            <Text mt={1} color={textMuted} fontSize="sm">
              {subtitle}
            </Text>
          ) : null}
        </Box>
        {actionLabel && onAction ? (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            color={useColorModeValue("blue.600", dashboardPalette.accentStrong)}
            rightIcon={<FaChevronRight size={12} />}
            onClick={onAction}
            borderRadius="full"
            _hover={{ bg: useColorModeValue("blue.50", dashboardPalette.accentSoft) }}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Flex>
      <Box flex="1">{children}</Box>
    </MotionBox>
  );
};

const SellerOverview = observer(() => {
  const router = useRouter();
  const { auth, companyStore } = stores;
  const companyId = auth.user?.company?._id || auth.user?.company;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    company: null, metrics: defaultMetrics, recentOrders: [], lowStockItems: [], topCustomers: [], topSuppliers: [], notifications: [],
  });

  const pageBg = useColorModeValue("#F0F6FF", dashboardPalette.page);
  const panelBg = useColorModeValue("white", dashboardPalette.surface);
  const mutedText = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const textPrimary = useColorModeValue("gray.800", dashboardPalette.text);
  const borderColor = useColorModeValue("blue.100", dashboardPalette.border);
  const heroBg = useColorModeValue(dashboardHeroGradientLight, dashboardHeroGradient);
  const heroText = "white";
  const heroMutedText = "whiteAlpha.800";

  const loadDashboard = useCallback(async () => {
    if (!companyId) return;
    setLoading(true); setError(null);
    try {
      const response = await companyStore.getDashboardSummary(String(companyId));
      const payload = response?.data || {};
      setDashboardData({
        company: payload.company || null,
        metrics: { ...defaultMetrics, ...(payload.metrics || {}) },
        recentOrders: Array.isArray(payload.recentOrders) ? payload.recentOrders : [],
        lowStockItems: Array.isArray(payload.lowStockItems) ? payload.lowStockItems : [],
        topCustomers: Array.isArray(payload.topCustomers) ? payload.topCustomers : [],
        topSuppliers: Array.isArray(payload.topSuppliers) ? payload.topSuppliers : [],
        notifications: Array.isArray(payload.notifications) ? payload.notifications : [],
      });
    } catch (loadError: any) {
      setError(loadError?.message || "Unable to load seller overview");
    } finally {
      setLoading(false);
    }
  }, [companyId, companyStore]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const company = dashboardData.company;

  const checklistItems = useMemo(() => {
    const items = [
      { label: "Shop basics added", done: Boolean(company?.name && company?.description) },
      { label: "Primary location set", done: Boolean(company?.location?.address && Array.isArray(company?.location?.coordinates)) },
      { label: "Phone added", done: Boolean(company?.contactInfo?.phone) },
      { label: "Email added", done: Boolean(company?.contactInfo?.email) },
      { label: "GST added", done: Boolean(company?.gstNumber) },
      { label: "At least one product listed", done: dashboardData.metrics.totalProducts > 0 },
    ];
    const completed = items.filter((item) => item.done).length;
    return { items, completed, percent: items.length ? Math.round((completed / items.length) * 100) : 0 };
  }, [company, dashboardData.metrics.totalProducts]);

  const quickActions = [
    { label: "Add Product", helper: "List new items", icon: FaBoxOpen, colorScheme: "blue", onClick: () => router.push("/dashboard/products") },
    { label: "Customers", helper: "Open ledgers", icon: FaUserFriends, colorScheme: "teal", onClick: () => router.push("/dashboard/customers") },
    { label: "Orders", helper: "Manage pending", icon: FaClipboardList, colorScheme: "purple", onClick: () => router.push("/dashboard/orders") },
    { label: "Shop Setup", helper: "Edit details", icon: FaStore, colorScheme: "orange", onClick: () => router.push("/dashboard/shop") },
  ];

  return (
    <Box bg={pageBg} minH="100vh">
      <Stack as={motion.div} variants={containerVariants} initial="hidden" animate="show" spacing={{ base: 4, md: 6 }} px={{ base: 0, md: 2 }} py={{ base: 4, md: 6 }} maxW="1600px" mx="auto">
        <MotionBox
  variants={itemVariants}
  bgImage={heroBg}
  color={heroText}
  borderRadius={{ base: "xl", md: "3xl" }}
  px={{ base: 4, md: 6, lg: 8 }} 
  py={{ base: 5, md: 6, lg: 6 }} 
  boxShadow={useColorModeValue("0 10px 30px -10px rgba(37, 99, 235, 0.3)", "lg")} // Softer shadow
  overflow="hidden"
  position="relative"
>
  <Box position="absolute" right="-40px" top="-50px" w="180px" h="180px" bg="whiteAlpha.200" borderRadius="full" filter="blur(20px)" />
  <Box position="absolute" left="5%" bottom="-60px" w="140px" h="140px" bg="whiteAlpha.100" borderRadius="full" filter="blur(30px)" />
  
  <Stack 
    direction={{ base: "column", lg: "row" }} // Changed from xl to lg for better tablet/laptop view
    justify="space-between" 
    align={{ base: "start", lg: "center" }} 
    spacing={{ base: 5, lg: 8 }} // Reduced spacing
    position="relative" 
    zIndex={1}
  >
    <Box maxW={{ base: "100%", lg: "xl", xl: "2xl" }}>
      <Badge
        colorScheme={company?.shopStatus === "active" ? "green" : company?.shopStatus === "pending" ? "orange" : "purple"}
        px={2.5} py={0.5} 
        fontSize="xs" // Explicitly smaller badge text
        borderRadius="full" 
        textTransform="capitalize" 
        mb={2} // Reduced margin
        bg="whiteAlpha.300" 
        color="white" 
        backdropFilter="blur(10px)"
      >
        {company?.shopStatus || "shop setup"}
      </Badge>
      
      {/* Scaled down heading */}
      <Heading size={{ base: "lg", md: "xl" }} lineHeight="1.2" fontWeight="700" letterSpacing="-0.02em">
        {company?.name ? `Welcome back, ${company.name}` : "Welcome to your seller dashboard"}
      </Heading>
      
      {/* Scaled down subtitle text */}
      <Text mt={2} color={heroMutedText} maxW="2xl" fontSize={{ base: "xs", md: "sm" }}>
        Keep track of orders, stock, customers, suppliers, and shop readiness from one place.
      </Text>
      
      <HStack spacing={{ base: 4, md: 6 }} mt={4} wrap="wrap">
        <HStack spacing={1.5}>
          <Icon as={FaMapMarkerAlt} color="whiteAlpha.800" boxSize={3.5} />
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
            {company?.location?.city || company?.location?.address || "Location not added"}
          </Text>
        </HStack>
        <HStack spacing={1.5}>
          <Icon as={FaPhoneAlt} color="whiteAlpha.800" boxSize={3.5} />
          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">
            {company?.contactInfo?.phone || auth.user?.phone || "Phone not added"}
          </Text>
        </HStack>
      </HStack>
    </Box>

    <SimpleGrid 
      columns={{ base: 2, lg: 2, xl: 4 }} 
      spacing={{ base: 2, md: 4 }} // Tighter spacing on mobile
      w={{ base: "100%", lg: "auto" }}
    >
      {[
        { label: "Pending Orders", value: dashboardData.metrics.pendingOrders },
        { label: "Customer Due", value: formatCompactCurrency(dashboardData.metrics.customerReceivable) },
        { label: "Supplier Payable", value: formatCompactCurrency(dashboardData.metrics.supplierPayable) },
        { label: "Unread Alerts", value: dashboardData.metrics.unreadNotifications },
      ].map((stat, idx) => (
        <Box 
          key={idx} 
          bg="whiteAlpha.200" 
          backdropFilter="blur(12px)" 
          border="1px solid" 
          borderColor="whiteAlpha.300" 
          borderRadius="xl" // Reduced from 2xl
          p={{ base: 3, md: 4 }} // Smaller padding on mobile
          _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }} 
          transition="all 0.2s"
        >
          <Text 
            fontSize={{ base: "10px", md: "xs" }} // Tiny font for mobile labels
            textTransform="uppercase" 
            color="whiteAlpha.800" 
            fontWeight="bold"
            isTruncated // Prevents text wrapping on very small screens
          >
            {stat.label}
          </Text>
          <Heading size={{ base: "md", md: "lg" }} mt={1} fontWeight="700">
            {stat.value}
          </Heading>
        </Box>
      ))}
    </SimpleGrid>
  </Stack>
</MotionBox>
        {/* Metrics Grid */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Box key={index} bg={panelBg} borderRadius="2xl" p={5} boxShadow="sm" border="1px solid" borderColor={borderColor}>
                <Skeleton height="16px" width="40%" />
                <Skeleton height="28px" mt={4} width="60%" />
                <Skeleton height="12px" mt={3} width="50%" />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
            <MetricCard label="Pending Orders" value={String(dashboardData.metrics.pendingOrders)} helper={`${dashboardData.metrics.inFlightOrders} in processing or shipped`} icon={FaClipboardList} colorScheme="orange" />
            <MetricCard label="Customer Receivable" value={formatCurrency(dashboardData.metrics.customerReceivable)} helper={`${dashboardData.metrics.totalCustomers} active customers`} icon={FaFileInvoiceDollar} colorScheme="green" />
            <MetricCard label="Supplier Payable" value={formatCurrency(dashboardData.metrics.supplierPayable)} helper={`${dashboardData.metrics.totalSuppliers} supplier profiles`} icon={FaTruck} colorScheme="red" />
            <MetricCard label="Inventory Health" value={String(dashboardData.metrics.lowStockProducts)} helper={`${dashboardData.metrics.outOfStockProducts} out of stock`} icon={FaWarehouse} colorScheme="blue" />
          </SimpleGrid>
        )}

        {error ? (
          <MotionBox variants={itemVariants} bg={panelBg} border="1px solid" borderColor="red.200" borderRadius="2xl" p={5} boxShadow="sm">
            <HStack justify="space-between" align="start" spacing={4}>
              <HStack align="start" spacing={4}>
                <Circle size="42px" bg="red.50">
                  <Icon as={FaExclamationTriangle} color="red.500" />
                </Circle>
                <Box>
                  <Heading size="sm" color={textPrimary} fontWeight="bold">Seller overview could not load fully</Heading>
                  <Text mt={1} color={mutedText} fontSize="sm">{error}</Text>
                </Box>
              </HStack>
              <Button size="sm" variant="outline" colorScheme="red" onClick={loadDashboard}>Retry</Button>
            </HStack>
          </MotionBox>
        ) : null}

        <Grid templateColumns={{ base: "1fr", xl: "1.7fr 1fr" }} gap={6}>
          <GridItem>
            <SectionCard title="Recent Orders" subtitle="Latest orders that need seller attention" actionLabel="View all orders" onAction={() => router.push("/dashboard/orders")}>
              {loading ? (
                <Stack spacing={4}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box key={index}><Skeleton height="18px" width="25%" /><SkeletonText mt={3} noOfLines={2} spacing={2} /></Box>
                  ))}
                </Stack>
              ) : dashboardData.recentOrders.length ? (
                <Stack spacing={3}>
                  {dashboardData.recentOrders.map((order) => {
                    const statusMeta = getOrderStatusMeta(order.orderStatus);
                    return (
                      <Flex key={order._id || order.orderId} justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} p={4} border="1px solid" borderColor={borderColor} borderRadius="xl" bg={useColorModeValue("gray.50", "whiteAlpha.50")} _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }} transition="all 0.2s">
                        <Box>
                          <HStack spacing={3} mb={1}>
                            <Text fontWeight="bold" color={textPrimary}>{order.orderId || order._id}</Text>
                            <Badge colorScheme={statusMeta.colorScheme} borderRadius="full" px={2}>{statusMeta.label}</Badge>
                          </HStack>
                          <Text fontSize="sm" color={mutedText}>{order.user?.name || "Unknown customer"} • {formatRelativeTime(order.createdAt)}</Text>
                        </Box>
                        <Box textAlign={{ base: "left", md: "right" }} mt={{ base: 2, md: 0 }}>
                          <Text fontWeight="bold" color={textPrimary} fontSize="lg">{formatCurrency(getOrderAmount(order))}</Text>
                          <Text fontSize="sm" color={mutedText}>{order.items?.length || 0} items</Text>
                        </Box>
                      </Flex>
                    );
                  })}
                </Stack>
              ) : (
                <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={8} textAlign="center" bg={useColorModeValue("gray.50", "whiteAlpha.50")}>
                  <Icon as={FaClipboardList} boxSize={8} color="gray.300" mb={3} />
                  <Text fontWeight="bold" color={textPrimary}>No orders yet</Text>
                  <Text mt={1} color={mutedText} fontSize="sm">Once buyers place orders, the newest ones will show here.</Text>
                </Box>
              )}
            </SectionCard>
          </GridItem>

          <GridItem>
            <Stack spacing={6} h="100%">
              <SectionCard title="Shop Readiness" subtitle="A quick view of what is already set up" actionLabel="Open shop" onAction={() => router.push("/dashboard/shop")}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" color={mutedText} fontWeight="medium">Completion</Text>
                  <Text fontWeight="bold" color={textPrimary}>{checklistItems.completed}/{checklistItems.items.length}</Text>
                </Flex>
                <Progress value={checklistItems.percent} colorScheme="teal" borderRadius="full" h="8px" bg={useColorModeValue("teal.50", "whiteAlpha.200")} />
                <List spacing={3} mt={5}>
                  {checklistItems.items.map((item, idx) => (
                    <ListItem key={idx}>
                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={item.done ? FaCheckCircle : FaRegCircle} color={item.done ? "teal.500" : "gray.400"} />
                          <Text fontSize="sm" color={textPrimary} fontWeight={item.done ? "medium" : "normal"}>{item.label}</Text>
                        </HStack>
                        <Badge colorScheme={item.done ? "green" : "gray"} borderRadius="full" px={2} variant="subtle">{item.done ? "Done" : "Pending"}</Badge>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </SectionCard>

              <SectionCard title="Quick Actions" subtitle="Jump into the seller flows you use most">
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                  {quickActions.map((action, idx) => (
                    <Button key={idx} justifyContent="start" alignItems="center" p={4} h="auto" variant="outline" borderRadius="xl" borderColor={borderColor} bg={useColorModeValue("white", "transparent")} _hover={{ bg: useColorModeValue(`${action.colorScheme}.50`, "whiteAlpha.100"), borderColor: useColorModeValue(`${action.colorScheme}.200`, "whiteAlpha.300") }} onClick={action.onClick} transition="all 0.2s">
                      <HStack spacing={3}>
                        <Circle size="40px" bg={useColorModeValue(`${action.colorScheme}.100`, "whiteAlpha.200")}>
                          <Icon as={action.icon} color={useColorModeValue(`${action.colorScheme}.600`, `${action.colorScheme}.300`)} />
                        </Circle>
                        <Box textAlign="left">
                          <Text fontWeight="bold" color={textPrimary} fontSize="sm">{action.label}</Text>
                          <Text fontSize="xs" color={mutedText}>{action.helper}</Text>
                        </Box>
                      </HStack>
                    </Button>
                  ))}
                </SimpleGrid>
              </SectionCard>
            </Stack>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
          <GridItem>
            <SectionCard title="Inventory Snapshot" subtitle="Products that may need action soon" actionLabel="Manage products" onAction={() => router.push("/dashboard/products")}>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={5}>
                {[
                  { label: "Total products", value: dashboardData.metrics.totalProducts, color: textPrimary },
                  { label: "Active", value: dashboardData.metrics.activeProducts, color: textPrimary },
                  { label: "Low stock", value: dashboardData.metrics.lowStockProducts, color: useColorModeValue("orange.500", "orange.300") },
                  { label: "Featured", value: dashboardData.metrics.featuredProducts, color: useColorModeValue("blue.500", "blue.300") },
                ].map((stat, idx) => (
                  <Box key={idx} border="1px solid" borderColor={borderColor} borderRadius="xl" p={3} bg={useColorModeValue("gray.50", "whiteAlpha.50")}>
                    <Text fontSize="xs" color={mutedText} fontWeight="medium">{stat.label}</Text>
                    <Text mt={1} fontWeight="bold" fontSize="lg" color={stat.color}>{stat.value}</Text>
                  </Box>
                ))}
              </SimpleGrid>

              {dashboardData.lowStockItems.length ? (
                <Stack spacing={3}>
                  {dashboardData.lowStockItems.map((product) => (
                    <Flex key={product._id} justify="space-between" align="center" border="1px solid" borderColor={borderColor} borderRadius="xl" p={3} _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.50") }} transition="all 0.2s">
                      <Box>
                        <Text fontWeight="bold" color={textPrimary} fontSize="sm">{product.name || "Unnamed product"}</Text>
                        <Text fontSize="xs" color={mutedText}>Updated {formatRelativeTime(product.updatedAt || product.createdAt)}</Text>
                      </Box>
                      <Badge colorScheme={Number(product.stock || 0) === 0 ? "red" : "orange"} px={2} py={1} borderRadius="md">
                        {Number(product.stock || 0)} left
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={6} textAlign="center" bg={useColorModeValue("gray.50", "whiteAlpha.50")}>
                  <Text fontWeight="bold" color={textPrimary}>Inventory looks healthy</Text>
                  <Text mt={1} fontSize="sm" color={mutedText}>No low-stock products were found.</Text>
                </Box>
              )}
            </SectionCard>
          </GridItem>

          <GridItem>
            <SectionCard title="Parties Snapshot" subtitle="Who owes you, and who you need to pay" actionLabel="Open ledgers" onAction={() => router.push("/dashboard/customers")}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={5}>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={4} bg={useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)")}>
                  <Text fontSize="xs" textTransform="uppercase" color={useColorModeValue("green.600", "green.300")} fontWeight="bold">Customers</Text>
                  <Heading size="md" mt={1} color={useColorModeValue("green.700", "green.200")}>{dashboardData.metrics.totalCustomers}</Heading>
                  <Text mt={2} fontSize="sm" color={useColorModeValue("green.600", "green.300")} fontWeight="semibold">You will get {formatCurrency(dashboardData.metrics.customerReceivable)}</Text>
                </Box>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={4} bg={useColorModeValue("red.50", "rgba(245, 101, 101, 0.1)")}>
                  <Text fontSize="xs" textTransform="uppercase" color={useColorModeValue("red.600", "red.300")} fontWeight="bold">Suppliers</Text>
                  <Heading size="md" mt={1} color={useColorModeValue("red.700", "red.200")}>{dashboardData.metrics.totalSuppliers}</Heading>
                  <Text mt={2} fontSize="sm" color={useColorModeValue("red.600", "red.300")} fontWeight="semibold">You will give {formatCurrency(dashboardData.metrics.supplierPayable)}</Text>
                </Box>
              </SimpleGrid>

              <Stack spacing={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color={textPrimary} mb={3}>Top customer receivables</Text>
                  <Stack spacing={3}>
                    {dashboardData.topCustomers.length ? (
                      dashboardData.topCustomers.map((party) => (
                        <Flex key={party._id} justify="space-between" align="center" p={2} _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.50") }} borderRadius="md" transition="all 0.2s">
                          <HStack spacing={3}>
                            <Avatar size="sm" name={party.name} bg="blue.500" color="white" />
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color={textPrimary}>{party.name || "Unnamed customer"}</Text>
                              <Text fontSize="xs" color={mutedText}>{party.phone || party.email || "No contact info"}</Text>
                            </Box>
                          </HStack>
                          <Text fontWeight="bold" color={useColorModeValue("green.600", "green.300")}>{formatCurrency(Number(party.outstandingBalance || 0))}</Text>
                        </Flex>
                      ))
                    ) : (
                      <Text fontSize="sm" color={mutedText}>No customer receivables right now.</Text>
                    )}
                  </Stack>
                </Box>
                <Divider borderColor={borderColor} />
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color={textPrimary} mb={3}>Top supplier payables</Text>
                  <Stack spacing={3}>
                    {dashboardData.topSuppliers.length ? (
                      dashboardData.topSuppliers.map((party) => (
                        <Flex key={party._id} justify="space-between" align="center" p={2} _hover={{ bg: useColorModeValue("gray.50", "whiteAlpha.50") }} borderRadius="md" transition="all 0.2s">
                          <HStack spacing={3}>
                            <Avatar size="sm" name={party.name} bg="red.500" color="white" />
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color={textPrimary}>{party.name || "Unnamed supplier"}</Text>
                              <Text fontSize="xs" color={mutedText}>{party.phone || party.email || "No contact info"}</Text>
                            </Box>
                          </HStack>
                          <Text fontWeight="bold" color={useColorModeValue("red.600", "red.300")}>{formatCurrency(Number(party.outstandingBalance || 0))}</Text>
                        </Flex>
                      ))
                    ) : (
                      <Text fontSize="sm" color={mutedText}>No supplier payables right now.</Text>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </SectionCard>
          </GridItem>
        </Grid>

        <SectionCard title="Recent Notifications" subtitle="Latest alerts from orders, payments, and account changes">
          {loading ? (
            <Stack spacing={4}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index}><Skeleton height="14px" width="30%" /><SkeletonText mt={3} noOfLines={2} spacing={2} /></Box>
              ))}
            </Stack>
          ) : dashboardData.notifications.length ? (
            <Stack spacing={3}>
              {dashboardData.notifications.map((notification) => (
                <Flex key={notification._id} justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3} border="1px solid" borderColor={borderColor} borderRadius="xl" p={4} bg={useColorModeValue("gray.50", "whiteAlpha.50")} _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }} transition="all 0.2s">
                  <HStack align="start" spacing={4}>
                    <Circle size="40px" bg={useColorModeValue(`${getPriorityColor(notification.priority)}.100`, `rgba(255,255,255,0.05)`)}>
                      <Icon as={FaBell} color={useColorModeValue(`${getPriorityColor(notification.priority)}.600`, `${getPriorityColor(notification.priority)}.300`)} />
                    </Circle>
                    <Box>
                      <HStack spacing={2} wrap="wrap" mb={1}>
                        <Text fontWeight="bold" color={textPrimary}>{notification.title}</Text>
                        {notification.category ? <Badge variant="subtle" colorScheme="blue" borderRadius="md">{notification.category}</Badge> : null}
                        {!notification.isRead ? <Badge colorScheme="orange" borderRadius="md">Unread</Badge> : null}
                      </HStack>
                      <Text color={mutedText} fontSize="sm" lineHeight="short">{notification.message}</Text>
                    </Box>
                  </HStack>
                  <Text fontSize="xs" color={mutedText} whiteSpace="nowrap" fontWeight="medium">{formatRelativeTime(notification.createdAt)}</Text>
                </Flex>
              ))}
            </Stack>
          ) : (
            <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={6} textAlign="center" bg={useColorModeValue("gray.50", "whiteAlpha.50")}>
              <Icon as={FaBell} boxSize={8} color="gray.300" mb={3} />
              <Text fontWeight="bold" color={textPrimary}>No recent notifications</Text>
              <Text mt={1} fontSize="sm" color={mutedText}>Order, payment, and account alerts will start showing here.</Text>
            </Box>
          )}
        </SectionCard>
      </Stack>
    </Box>
  );
});
export default SellerOverview;