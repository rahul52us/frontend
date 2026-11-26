"use client";

import {
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
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiSend,
  FiShoppingBag,
  FiShoppingCart,
  FiTrendingUp,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import {
  merchantFadeUp,
  merchantGhostButtonProps,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantPanel,
  merchantSpin,
  MerchantStatCard,
} from "../../components/common/merchantDashboardUI";
import InventoryWatchSection from "./component/InventoryWatchSection";
import QuickActionNav from "./component/QuickActionNav";
import RecentOrdersSection, { DashboardOrder } from "./component/RecentOrdersSection";
import ShopReadinessSection from "./component/ShopReadinessSection";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Quick Actions Definition                                            */
/* ------------------------------------------------------------------ */

const BASE_QUICK_ACTIONS = [
  { label: "New Product", icon: FiPlusCircle, href: "/dashboard/products" },
  { label: "Orders", icon: FiShoppingCart, href: "/dashboard/orders" },
  { label: "Shop Profile", icon: FiShoppingBag, href: "/dashboard/shop" },
  { label: "Customers", icon: FiUsers, href: "/dashboard/customers" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const SellerOverview = observer(() => {
  const router = useRouter();
  const toast = useToast();
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

  const isSuperAdmin = useMemo(() => {
    const user = auth.user;
    const normalizedRoles = Array.isArray(user?.role)
      ? user.role.filter(Boolean)
      : [user?.role].filter(Boolean);
    return (
      user?.type === "superAdmin" ||
      user?.role === "superAdmin" ||
      normalizedRoles.includes("superAdmin")
    );
  }, [auth.user]);

  const isAdmin = useMemo(() => {
    const user = auth.user;
    const normalizedRoles = Array.isArray(user?.role)
      ? user.role.filter(Boolean)
      : [user?.role].filter(Boolean);
    return (
      isSuperAdmin ||
      user?.type === "admin" ||
      user?.role === "admin" ||
      normalizedRoles.includes("admin")
    );
  }, [auth.user, isSuperAdmin]);

  const isShopApproved = useMemo(() => {
    if (isAdmin) return true;
    const reviewStatus = dashboardData.company?.reviewStatus || (typeof auth.user?.company === "object" ? (auth.user?.company as any)?.reviewStatus : null);
    return reviewStatus === "approved";
  }, [isAdmin, dashboardData.company?.reviewStatus, auth.user?.company]);

  const handleAddProductClick = useCallback(() => {
    if (!isShopApproved) {
      toast({
        title: "Shop Under Review",
        description:
          "Your shop is currently waiting for admin approval. You can create products once your shop is approved.",
        status: "warning",
        duration: 4500,
        isClosable: true,
      });
      return;
    }
    router.push("/dashboard/products");
  }, [isShopApproved, router, toast]);

  const quickActions = useMemo(() => {
    if (isSuperAdmin) {
      return [
        ...BASE_QUICK_ACTIONS,
        { label: "Broadcasts", icon: FiSend, href: "/dashboard/super-admin/notifications" },
      ];
    }
    return BASE_QUICK_ACTIONS;
  }, [isSuperAdmin]);

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

  // Top primary stat cards
  const primaryStats = useMemo(
    () => [
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
    ],
    [todaySales, metrics.activeProducts, metrics.totalProducts, metrics.pendingOrders, metrics.totalCustomers]
  );

  // Secondary metrics
  const secondaryStats = useMemo(
    () => [
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
    ],
    [metrics.customerReceivable, metrics.supplierPayable, metrics.lowStockProducts, metrics.deliveredOrders]
  );

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <MerchantPageShell>
      {/* Page Header */}
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
            <Badge
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              borderRadius="10px"
              px={2.5}
              py={1}
              fontSize="11.5px"
              fontWeight="600"
              textTransform="capitalize"
              bg={
                company?.shopStatus === "active"
                  ? useColorModeValue("green.50", "rgba(34, 197, 94, 0.15)")
                  : company?.shopStatus === "pending"
                  ? useColorModeValue("orange.50", "rgba(245, 158, 11, 0.15)")
                  : useColorModeValue("gray.100", "whiteAlpha.100")
              }
              color={
                company?.shopStatus === "active"
                  ? useColorModeValue("green.700", "green.300")
                  : company?.shopStatus === "pending"
                  ? useColorModeValue("orange.700", "orange.300")
                  : useColorModeValue("gray.700", "gray.300")
              }
              border="1px solid"
              borderColor={
                company?.shopStatus === "active"
                  ? useColorModeValue("green.200", "rgba(34, 197, 94, 0.3)")
                  : company?.shopStatus === "pending"
                  ? useColorModeValue("orange.200", "rgba(245, 158, 11, 0.3)")
                  : useColorModeValue("gray.200", "whiteAlpha.200")
              }
            >
              <Circle
                size="6px"
                bg={
                  company?.shopStatus === "active"
                    ? "green.500"
                    : company?.shopStatus === "pending"
                    ? "orange.500"
                    : "gray.400"
                }
              />
              {company?.shopStatus || "Active"}
            </Badge>

            {unreadCount > 0 && (
              <Badge
                display="inline-flex"
                alignItems="center"
                gap={1.5}
                borderRadius="10px"
                px={2.5}
                py={1}
                fontSize="11.5px"
                fontWeight="600"
                bg={useColorModeValue("red.50", "rgba(239, 68, 68, 0.15)")}
                color={useColorModeValue("red.700", "red.300")}
                border="1px solid"
                borderColor={useColorModeValue("red.200", "rgba(239, 68, 68, 0.3)")}
                cursor="pointer"
                onClick={() => router.push("/dashboard/super-admin/notifications")}
                transition="all 0.2s"
                _hover={{
                  bg: useColorModeValue("red.100", "rgba(239, 68, 68, 0.25)"),
                }}
              >
                <Circle size="6px" bg="red.500" />
                {unreadCount} {unreadCount === 1 ? "Alert" : "Alerts"}
              </Badge>
            )}
          </HStack>
        }
        actions={
          <HStack spacing={2}>
            <Button
              size="sm"
              h="38px"
              px={4}
              leftIcon={<FiPlusCircle />}
              bg="var(--color-primary, #065F68)"
              _hover={{
                bg: "var(--color-primary-hover, #044249)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(6, 95, 104, 0.3)",
              }}
              _active={{ bg: "var(--color-primary-dark, #032b30)" }}
              color="white"
              borderRadius="12px"
              fontSize="xs"
              fontWeight={600}
              boxShadow="0 2px 6px rgba(6, 95, 104, 0.2)"
              transition="all 0.15s ease"
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add products" : undefined}
              onClick={handleAddProductClick}
            >
              Add Product
            </Button>
            <Button
              size="sm"
              h="38px"
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
              bg="var(--color-primary, #065F68)"
              _hover={{ bg: "var(--color-primary-hover, #044249)" }}
              color="white"
              borderRadius="full"
              opacity={!isShopApproved ? 0.65 : 1}
              title={!isShopApproved ? "Shop approval required to add products" : undefined}
              onClick={handleAddProductClick}
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
      <QuickActionNav
        actions={quickActions}
        surfaceBg={surfaceBg}
        borderCol={borderCol}
        textCol={textCol}
        onNavigate={handleNavigate}
      />

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
              onClick={stat.href ? () => handleNavigate(stat.href) : undefined}
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
              onClick={() => handleNavigate(stat.href)}
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* Main Grid: Orders on Left, Readiness & Signals on Right */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 1.45fr) minmax(0, 1fr)" }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 4, md: 6 }}
      >
        <RecentOrdersSection
          orders={dashboardData.recentOrders}
          loading={loading}
          surfaceBg={surfaceBg}
          shellBg={shellBg}
          borderCol={borderCol}
          textCol={textCol}
          textMuted={textMuted}
          formatCurrency={formatCurrency}
          formatRelativeTime={formatRelativeTime}
          onViewAll={() => handleNavigate("/dashboard/orders")}
        />

        <ShopReadinessSection
          percent={checklistItems.percent}
          completed={checklistItems.completed}
          total={checklistItems.items.length}
          items={checklistItems.items}
          notifications={dashboardData.notifications}
          loading={loading}
          shellBg={shellBg}
          borderCol={borderCol}
          textCol={textCol}
          textMuted={textMuted}
          formatRelativeTime={formatRelativeTime}
        />
      </Box>

      {/* Bottom Section: Low Stock & Inventory Watch */}
      <InventoryWatchSection
        lowStockItems={dashboardData.lowStockItems}
        lowStockCount={metrics.lowStockProducts}
        loading={loading}
        surfaceBg={surfaceBg}
        shellBg={shellBg}
        borderCol={borderCol}
        textCol={textCol}
        textMuted={textMuted}
        onManageInventory={() => handleNavigate("/dashboard/products")}
      />
    </MerchantPageShell>
  );
});

export default SellerOverview;
