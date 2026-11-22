"use client";

import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Progress,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiArrowUpRight,
  FiBell,
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiPlusCircle,
  FiRefreshCw,
  FiSend,
  FiShoppingBag,
  FiShoppingCart,
  FiTrendingUp,
  FiTruck,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import { normalizeOrderStatusKey } from "../../../utils/orderStatus";
import {
  MerchantBadge,
  merchantFadeUp,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantPanel,
  merchantPulse,
  MerchantSectionHeader,
  merchantSpin,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import { getLowStockThreshold } from "../../products/utils/stockThreshold";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type DashboardOrder = {
  _id?: string;
  orderId?: string;
  orderStatus?: string;
  createdAt?: string;
  total?: number;
  user?: { name?: string };
  quote?: { price?: { value?: number | string } };
  items?: any[];
};

type DashboardProduct = {
  _id: string;
  name?: string;
  stock?: number;
  lowStockThreshold?: number;
  threshold?: number;
  reorderLevel?: number;
  minStock?: number;
  updatedAt?: string;
  createdAt?: string;
};

type DashboardParty = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  outstandingBalance?: number;
};

type DashboardNotification = {
  _id: string;
  title: string;
  message: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  isRead?: boolean;
  createdAt?: string;
};

type DashboardMetrics = {
  totalOrders: number;
  pendingOrders: number;
  inFlightOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  customerReceivable: number;
  customerAdvance: number;
  supplierPayable: number;
  supplierAdvance: number;
  unreadNotifications: number;
  todaySales?: number;
  weeklyGrowth?: number;
};

type DashboardData = {
  company: any | null;
  metrics: DashboardMetrics;
  recentOrders: DashboardOrder[];
  lowStockItems: DashboardProduct[];
  topCustomers: DashboardParty[];
  topSuppliers: DashboardParty[];
  notifications: DashboardNotification[];
};

const defaultMetrics: DashboardMetrics = {
  totalOrders: 0,
  pendingOrders: 0,
  inFlightOrders: 0,
  deliveredOrders: 0,
  totalProducts: 0,
  activeProducts: 0,
  lowStockProducts: 0,
  outOfStockProducts: 0,
  featuredProducts: 0,
  totalCustomers: 0,
  totalSuppliers: 0,
  customerReceivable: 0,
  customerAdvance: 0,
  supplierPayable: 0,
  supplierAdvance: 0,
  unreadNotifications: 0,
  todaySales: 0,
  weeklyGrowth: 0,
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatNumber = (value: number) => Number(value || 0).toLocaleString("en-IN");
const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

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

const getOrderAmount = (order: DashboardOrder) =>
  Number(order.quote?.price?.value || order.total || 0);

const getOrderStatusTone = (status?: string): "success" | "warning" | "accent" | "danger" | "soft" => {
  const normalized = normalizeOrderStatusKey(status);
  if (normalized === "delivered") return "success";
  if (normalized === "shipped" || normalized === "processing") return "accent";
  if (normalized === "cancelled") return "danger";
  return "warning";
};

/* ------------------------------------------------------------------ */
/* Seller Dashboard Health Gauge Component                             */
/* ------------------------------------------------------------------ */

const GAUGE_SIZE = 120;
const GAUGE_STROKE = 10;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

const ShopHealthGauge = ({ score, loading }: { score: number; loading: boolean }) => {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (loading) {
      setShown(0);
      return;
    }
    const timer = setTimeout(() => setShown(score), 150);
    return () => clearTimeout(timer);
  }, [score, loading]);

  const color =
    score >= 80 ? dashboardPalette.success : score >= 50 ? dashboardPalette.warning : dashboardPalette.danger;
  const label = score >= 80 ? "Optimized" : score >= 50 ? "Action Needed" : "Incomplete";
  const offset = GAUGE_CIRCUMFERENCE * (1 - shown / 100);

  if (loading) {
    return <SkeletonCircle size={`${GAUGE_SIZE}px`} />;
  }

  return (
    <Box position="relative" w={`${GAUGE_SIZE}px`} h={`${GAUGE_SIZE}px`} flexShrink={0}>
      <svg
        width={GAUGE_SIZE}
        height={GAUGE_SIZE}
        viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke="var(--merchant-surface-soft)"
          strokeWidth={GAUGE_STROKE}
        />
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s ease" }}
        />
      </svg>
      <Flex position="absolute" inset={0} direction="column" align="center" justify="center">
        <Text fontSize="2xl" fontWeight="800" lineHeight="1" letterSpacing="-0.02em" color="var(--merchant-text)">
          {score}%
        </Text>
        <Text fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color={color} mt={1}>
          {label}
        </Text>
      </Flex>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const SellerOverview = observer(() => {
  const router = useRouter();
  const { auth, companyStore } = stores;
  const companyId = auth.user?.company?._id || auth.user?.company;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    company: null,
    metrics: defaultMetrics,
    recentOrders: [],
    lowStockItems: [],
    topCustomers: [],
    topSuppliers: [],
    notifications: [],
  });

  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const shellBg = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textCol = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  const loadDashboard = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);

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
      setError(loadError?.message || "Unable to load merchant overview");
    } finally {
      setLoading(false);
    }
  }, [companyId, companyStore]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const company = dashboardData.company;
  const metrics = dashboardData.metrics;

  const checklistItems = useMemo(() => {
    const items = [
      { label: "Shop basics added", done: Boolean(company?.name && company?.description) },
      {
        label: "Primary location set",
        done: Boolean(company?.location?.address || company?.location?.city),
      },
      {
        label: "Contact details verified",
        done: Boolean(company?.contactInfo?.phone || auth.user?.phone),
      },
      { label: "GST & Business ID", done: Boolean(company?.gstNumber) },
      { label: "5+ products cataloged", done: metrics.totalProducts >= 5 },
      { label: "Payment & Settlement details", done: Boolean(company?.bankDetails?.accountNumber) },
    ];

    const completed = items.filter((item) => item.done).length;
    return {
      items,
      completed,
      percent: items.length ? Math.round((completed / items.length) * 100) : 0,
    };
  }, [company, metrics.totalProducts, auth.user?.phone]);

  const todaySales = Number(metrics.todaySales || metrics.customerAdvance || 0);
  const unreadCount = Number(metrics.unreadNotifications || 0);

  // Top primary stat cards (matching superadmin layout)
  const primaryStats = [
    {
      label: "Today's Sales",
      value: formatCurrency(todaySales),
      icon: FiTrendingUp,
      color: dashboardPalette.accentStrong,
      bg: "rgba(59, 130, 246, 0.12)",
    },
    {
      label: "Active Products",
      value: formatNumber(metrics.activeProducts || metrics.totalProducts),
      icon: FiBox,
      color: dashboardPalette.warning,
      bg: "rgba(224, 179, 91, 0.14)",
      href: "/dashboard/products",
    },
    {
      label: "Pending Orders",
      value: formatNumber(metrics.pendingOrders),
      icon: FiShoppingCart,
      color: metrics.pendingOrders > 0 ? dashboardPalette.warning : dashboardPalette.success,
      bg: "rgba(245, 158, 11, 0.14)",
      href: "/dashboard/orders",
    },
    {
      label: "Total Customers",
      value: formatNumber(metrics.totalCustomers),
      icon: FiUsers,
      color: dashboardPalette.info,
      bg: "rgba(139, 92, 246, 0.14)",
      href: "/dashboard/customers",
    },
  ];

  // Secondary metrics
  const secondaryStats = [
    {
      label: "Receivable",
      value: formatCurrency(metrics.customerReceivable),
      icon: FiDollarSign,
      color: dashboardPalette.success,
      bg: "rgba(70, 201, 139, 0.14)",
      href: "/dashboard/customers",
    },
    {
      label: "Payable",
      value: formatCurrency(metrics.supplierPayable),
      icon: FiTruck,
      color: dashboardPalette.danger,
      bg: "rgba(239, 107, 107, 0.14)",
      href: "/dashboard/customers",
    },
    {
      label: "Low Stock Alert",
      value: formatNumber(metrics.lowStockProducts),
      icon: FiPackage,
      color: metrics.lowStockProducts > 0 ? dashboardPalette.danger : dashboardPalette.success,
      bg: "rgba(239, 107, 107, 0.14)",
      href: "/dashboard/products",
    },
    {
      label: "Delivered Orders",
      value: formatNumber(metrics.deliveredOrders),
      icon: FiCheckCircle,
      color: dashboardPalette.accentStrong,
      bg: "rgba(59, 130, 246, 0.12)",
      href: "/dashboard/orders",
    },
  ];

  // Quick Action Pills
  const quickActions = [
    { label: "New Product", icon: FiPlusCircle, href: "/dashboard/products" },
    { label: "Orders", icon: FiShoppingCart, href: "/dashboard/orders" },
    { label: "Shop Profile", icon: FiShoppingBag, href: "/dashboard/shop" },
    { label: "Customers", icon: FiUsers, href: "/dashboard/customers" },
    { label: "Broadcasts", icon: FiSend, href: "/dashboard/super-admin/notifications" },
  ];

  return (
    <MerchantPageShell>
      {/* Page Header matching superadmin header */}
      <MerchantPageHeader
        icon={FiShoppingBag}
        title={company?.name || "Merchant Dashboard"}
        description={
          company?.location?.city
            ? `${company.location.city} • Operational Shop Console`
            : "Live operations overview, order tracking, and inventory signals"
        }
        badges={
          <HStack spacing={2}>
            <MerchantBadge tone="success">
              {/* <Box w="5px" h="5px" borderRadius="full" bg={dashboardPalette.success} mr={1} /> */}
              {String(company?.shopStatus || "Active").toUpperCase()}
            </MerchantBadge>
            {unreadCount > 0 && (
              <MerchantBadge tone="danger">
                {unreadCount} Alerts
              </MerchantBadge>
            )}
          </HStack>
        }
        actions={
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<FiPlusCircle />}
              colorScheme="brand"
              borderRadius="14px"
              onClick={() => router.push("/dashboard/products")}
            >
              Add Product
            </Button>
            <Button
              size="sm"
              onClick={loadDashboard}
              isDisabled={loading}
              leftIcon={
                <Icon
                  as={FiRefreshCw}
                  animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                />
              }
              {...merchantGhostButtonProps}
            >
              Refresh
            </Button>
          </HStack>
        }
        mobileActions={
          <HStack spacing={1.5}>
            <IconButton
              size="sm"
              aria-label="Add Product"
              icon={<FiPlusCircle />}
              colorScheme="brand"
              borderRadius="full"
              onClick={() => router.push("/dashboard/products")}
            />
            <IconButton
              size="sm"
              aria-label="Refresh dashboard"
              icon={
                <Icon
                  as={FiRefreshCw}
                  animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                />
              }
              onClick={loadDashboard}
              isDisabled={loading}
              {...merchantGhostButtonProps}
            />
          </HStack>
        }
      />

      {/* Error state */}
      {error && (
        <MerchantPanel mb={{ base: 4, md: 6 }} animation={merchantFadeUp(0)}>
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            gap={3}
          >
            <HStack spacing={3} align="start">
              <Flex
                align="center"
                justify="center"
                w="36px"
                h="36px"
                borderRadius="12px"
                bg="rgba(239, 107, 107, 0.14)"
                flexShrink={0}
              >
                <Icon as={FiAlertTriangle} color={dashboardPalette.danger} />
              </Flex>
              <Box>
                <Text fontSize="md" fontWeight="700" color={textCol}>
                  Merchant overview failed to load completely
                </Text>
                <Text fontSize="sm" color={textMuted} mt={0.5}>
                  {error}
                </Text>
              </Box>
            </HStack>
            <Button size="sm" onClick={loadDashboard} {...merchantGhostButtonProps}>
              Retry
            </Button>
          </Flex>
        </MerchantPanel>
      )}

      {/* Quick Action Navigation Bar */}
      <Flex
        gap={2}
        overflowX="auto"
        pb={1}
        mb={{ base: 3, md: 4 }}
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {quickActions.map((action) => (
          <Button
            key={action.label}
            size="sm"
            leftIcon={<Icon as={action.icon} boxSize={3.5} />}
            variant="outline"
            borderRadius="12px"
            borderColor={borderCol}
            bg={surfaceBg}
            color={textCol}
            flexShrink={0}
            fontSize="xs"
            fontWeight="700"
            _hover={{
              borderColor: dashboardPalette.accent,
              color: dashboardPalette.accentStrong,
              bg: dashboardPalette.accentSoft,
            }}
            onClick={() => router.push(action.href)}
          >
            {action.label}
          </Button>
        ))}
      </Flex>

      {/* Primary KPI Cards (Top 4) */}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
        {primaryStats.map((stat, index) => (
          <Box key={stat.label} animation={merchantFadeUp(60 + index * 60)}>
            <MerchantStatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              iconBg={stat.bg}
              variant="panel"
              isLoading={loading}
              onClick={stat.href ? () => router.push(stat.href) : undefined}
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* Secondary Metrics Grid (Compact 4) */}
      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }}>
        {secondaryStats.map((stat, index) => (
          <Box key={stat.label} animation={merchantFadeUp(300 + index * 50)}>
            <MerchantStatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.color}
              iconBg={stat.bg}
              variant="compact"
              isLoading={loading}
              onClick={() => router.push(stat.href)}
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* Main Grid: Orders & Activity on Left, Shop Readiness & Inventory on Right */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 1.45fr) minmax(0, 1fr)" }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 4, md: 6 }}
      >
        {/* Left Column: Recent Orders List */}
        <MerchantPanel animation={merchantFadeUp(450)}>
          <MerchantSectionHeader
            title="Recent Orders"
            subtitle="Latest orders placed by customers"
            right={
              <HStack spacing={2}>
                <MerchantBadge tone="soft" fontSize="xs" px={2.5} py={0.5}>
                  {loading ? "..." : `${dashboardData.recentOrders.length} recent`}
                </MerchantBadge>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="brand"
                  rightIcon={<FiArrowUpRight />}
                  onClick={() => router.push("/dashboard/orders")}
                >
                  View All
                </Button>
              </HStack>
            }
          />

          {loading ? (
            <Stack spacing={2.5}>
              {[0, 1, 2, 3].map((i) => (
                <Flex key={i} align="center" gap={3} p={3} borderRadius="16px" bg={shellBg}>
                  <Skeleton w="42px" h="42px" borderRadius="12px" flexShrink={0} />
                  <Box flex="1">
                    <Skeleton h="14px" w="60%" borderRadius="md" mb={2} />
                    <Skeleton h="12px" w="40%" borderRadius="md" />
                  </Box>
                  <Skeleton h="24px" w="70px" borderRadius="full" />
                </Flex>
              ))}
            </Stack>
          ) : dashboardData.recentOrders.length === 0 ? (
            <Box
              py={10}
              textAlign="center"
              bg={shellBg}
              borderRadius="16px"
              border="1px dashed"
              borderColor={borderCol}
            >
              <Circle size="46px" bg={surfaceBg} mx="auto" mb={2.5} border="1px solid" borderColor={borderCol}>
                <Icon as={FiShoppingCart} boxSize={5} color={dashboardPalette.accentStrong} />
              </Circle>
              <Text fontSize="sm" fontWeight="700" color={textCol} mb={1}>
                No orders received yet
              </Text>
              <Text fontSize="xs" color={textMuted} maxW="280px" mx="auto">
                Incoming orders from buyers will appear here in real-time.
              </Text>
            </Box>
          ) : (
            <Stack spacing={2}>
              {dashboardData.recentOrders.slice(0, 5).map((order) => {
                const amount = getOrderAmount(order);
                const tone = getOrderStatusTone(order.orderStatus);

                return (
                  <Flex
                    key={order._id || order.orderId}
                    p={3.5}
                    borderRadius="16px"
                    border="1px solid"
                    borderColor={borderCol}
                    bg={surfaceBg}
                    align="center"
                    justify="space-between"
                    gap={3}
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: dashboardPalette.accent,
                      transform: "translateY(-1px)",
                    }}
                  >
                    <HStack spacing={3} minW={0} flex="1">
                      <Circle
                        size="40px"
                        borderRadius="12px"
                        bg={dashboardPalette.accentSoft}
                        color={dashboardPalette.accentStrong}
                        flexShrink={0}
                      >
                        <Icon as={FiShoppingBag} boxSize={4} />
                      </Circle>
                      <Box minW={0}>
                        <Text fontSize="sm" fontWeight="700" color={textCol} noOfLines={1}>
                          {order.user?.name || "Customer Order"}
                        </Text>
                        <HStack spacing={1.5} color={textMuted} fontSize="xs">
                          <Text fontWeight="600">{order.orderId || order._id}</Text>
                          <Text>•</Text>
                          <HStack spacing={1}>
                            <Icon as={FiClock} boxSize={3} />
                            <Text>{formatRelativeTime(order.createdAt)}</Text>
                          </HStack>
                        </HStack>
                      </Box>
                    </HStack>

                    <Box textAlign="right" flexShrink={0}>
                      <Text fontSize="sm" fontWeight="800" color={textCol}>
                        {formatCurrency(amount)}
                      </Text>
                      <MerchantBadge tone={tone} fontSize="10px" px={2} py={0.5} mt={0.5} textTransform="capitalize">
                        {order.orderStatus || "Placed"}
                      </MerchantBadge>
                    </Box>
                  </Flex>
                );
              })}
            </Stack>
          )}
        </MerchantPanel>

        {/* Right Column: Shop Setup Readiness & Signals */}
        <Stack spacing={{ base: 4, md: 6 }} minW={0}>
          {/* Shop Health & Setup Gauge */}
          <MerchantPanel animation={merchantFadeUp(520)}>
            <MerchantSectionHeader
              title="Shop Readiness"
              subtitle="Profile setup & operational compliance"
              mb={3}
            />

            <Flex direction="column" align="center" gap={4}>
              <ShopHealthGauge score={checklistItems.percent} loading={loading} />

              <Box w="full">
                <Flex justify="space-between" align="center" mb={1.5}>
                  <Text fontSize="xs" fontWeight="700" color={textCol}>
                    Setup Checklist
                  </Text>
                  <Text fontSize="xs" color={textMuted} fontWeight="600">
                    {checklistItems.completed} of {checklistItems.items.length} done
                  </Text>
                </Flex>

                <Progress
                  value={checklistItems.percent}
                  h="6px"
                  borderRadius="full"
                  bg={shellBg}
                  colorScheme="brand"
                  mb={3}
                />

                <VStack spacing={1.5} align="stretch">
                  {checklistItems.items.map((item) => (
                    <Flex
                      key={item.label}
                      align="center"
                      justify="space-between"
                      py={1.5}
                      px={2.5}
                      borderRadius="10px"
                      bg={item.done ? "transparent" : shellBg}
                    >
                      <HStack spacing={2} minW={0}>
                        <Icon
                          as={item.done ? FiCheckCircle : FiClock}
                          color={item.done ? dashboardPalette.success : textMuted}
                          boxSize={3.5}
                        />
                        <Text
                          fontSize="xs"
                          fontWeight={item.done ? "500" : "600"}
                          color={item.done ? textMuted : textCol}
                          textDecoration={item.done ? "line-through" : "none"}
                          noOfLines={1}
                        >
                          {item.label}
                        </Text>
                      </HStack>
                      {item.done ? (
                        <MerchantBadge tone="success" fontSize="9px" px={1.5} py={0}>
                          Done
                        </MerchantBadge>
                      ) : (
                        <MerchantBadge tone="warning" fontSize="9px" px={1.5} py={0}>
                          Pending
                        </MerchantBadge>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </Flex>
          </MerchantPanel>

          {/* Quick Notice Banner if any */}
          {dashboardData.notifications.length > 0 && (
            <MerchantPanel animation={merchantFadeUp(580)}>
              <MerchantSectionHeader
                title="Broadcast Notices"
                subtitle="Alerts from platform administration"
                mb={2}
              />
              <VStack spacing={2} align="stretch">
                {dashboardData.notifications.slice(0, 2).map((notif) => (
                  <Box
                    key={notif._id}
                    p={3}
                    borderRadius="14px"
                    border="1px solid"
                    borderColor={borderCol}
                    bg={shellBg}
                  >
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="xs" fontWeight="700" color={textCol} noOfLines={1}>
                        {notif.title}
                      </Text>
                      <Text fontSize="10px" color={textMuted}>
                        {formatRelativeTime(notif.createdAt)}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={textMuted} noOfLines={2}>
                      {notif.message}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </MerchantPanel>
          )}
        </Stack>
      </Box>

      {/* Bottom Section: Low Stock & Inventory Watch (Matching superadmin Catalog Watch) */}
      <MerchantPanel animation={merchantFadeUp(620)}>
        <MerchantSectionHeader
          title="Inventory Watch & Low Stock"
          subtitle="Real-time stock depletion and restocking alerts"
          right={
            <HStack spacing={2}>
              <MerchantBadge
                tone={metrics.lowStockProducts > 0 ? "danger" : "success"}
                fontSize="xs"
                px={2.5}
                py={0.5}
              >
                {loading ? "..." : `${metrics.lowStockProducts} low stock`}
              </MerchantBadge>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="brand"
                rightIcon={<FiArrowUpRight />}
                onClick={() => router.push("/dashboard/products")}
              >
                Manage Inventory
              </Button>
            </HStack>
          }
        />

        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} h="72px" borderRadius="16px" />
            ))}
          </SimpleGrid>
        ) : dashboardData.lowStockItems.length === 0 ? (
          <Box
            py={8}
            textAlign="center"
            bg={shellBg}
            borderRadius="16px"
            border="1px dashed"
            borderColor={borderCol}
          >
            <Icon as={FiCheckCircle} boxSize={5} color={dashboardPalette.success} mb={1.5} />
            <Text fontSize="sm" fontWeight="700" color={textCol} mb={0.5}>
              Inventory is healthy
            </Text>
            <Text fontSize="xs" color={textMuted}>
              No items currently below their reorder thresholds.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
            {dashboardData.lowStockItems.map((item) => {
              const stock = Number(item.stock || 0);
              const threshold = getLowStockThreshold(item);
              const isCritical = stock <= 0;

              return (
                <Flex
                  key={item._id}
                  align="center"
                  justify="space-between"
                  p={3.5}
                  border="1.5px solid"
                  borderColor={isCritical ? "red.300" : borderCol}
                  borderRadius="16px"
                  bg={surfaceBg}
                  transition="all 0.2s ease"
                  _hover={{
                    borderColor: isCritical ? "red.400" : dashboardPalette.accent,
                    transform: "translateY(-1px)",
                  }}
                >
                  <HStack spacing={3} minW={0}>
                    <Circle
                      size="40px"
                      borderRadius="12px"
                      bg={isCritical ? "rgba(239, 107, 107, 0.14)" : "rgba(245, 158, 11, 0.14)"}
                      color={isCritical ? dashboardPalette.danger : dashboardPalette.warning}
                      flexShrink={0}
                    >
                      <Icon as={FiPackage} boxSize={4} />
                    </Circle>
                    <Box minW={0}>
                      <Text fontSize="sm" fontWeight="700" color={textCol} noOfLines={1}>
                        {item.name || "Product"}
                      </Text>
                      <Text fontSize="xs" color={textMuted}>
                        Threshold: {threshold} units
                      </Text>
                    </Box>
                  </HStack>

                  <Box textAlign="right" flexShrink={0}>
                    <Text
                      fontSize="lg"
                      fontWeight="900"
                      color={isCritical ? dashboardPalette.danger : dashboardPalette.warning}
                      lineHeight="1"
                    >
                      {stock}
                    </Text>
                    <MerchantBadge
                      tone={isCritical ? "danger" : "warning"}
                      fontSize="9px"
                      px={1.5}
                      py={0}
                      mt={1}
                    >
                      {isCritical ? "Out of Stock" : "Low Stock"}
                    </MerchantBadge>
                  </Box>
                </Flex>
              );
            })}
          </SimpleGrid>
        )}
      </MerchantPanel>
    </MerchantPageShell>
  );
});

export default SellerOverview;
