"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaBell,
  FaBoxOpen,
  FaClipboardList,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStore,
  FaTruck,
  FaUserFriends,
  FaWarehouse,
} from "react-icons/fa";
import stores from "../../../store/stores";
import { dashboardHeroGradient, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

type DashboardOrder = {
  _id?: string;
  orderId?: string;
  orderStatus?: string;
  createdAt?: string;
  total?: number;
  user?: {
    name?: string;
  };
  quote?: {
    price?: {
      value?: number | string;
    };
  };
  items?: any[];
};

type DashboardProduct = {
  _id: string;
  name?: string;
  stock?: number;
  status?: "active" | "draft" | "discontinued";
  isFeatured?: boolean;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: boolean;
};

type DashboardParty = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  partyType?: "customer" | "supplier";
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
};

const formatCurrency = (value: number) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

const formatCompactCurrency = (value: number) =>
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
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const getOrderAmount = (order: DashboardOrder) =>
  Number(order.quote?.price?.value || order.total || 0);

const getOrderStatusMeta = (status?: string) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "delivered") {
    return { label: "Delivered", colorScheme: "green" as const };
  }
  if (normalized === "shipped" || normalized === "processing") {
    return { label: normalized === "shipped" ? "Shipped" : "Processing", colorScheme: "blue" as const };
  }
  if (normalized === "cancelled") {
    return { label: "Cancelled", colorScheme: "red" as const };
  }
  if (normalized === "created" || normalized === "pending" || normalized === "confirmed") {
    return { label: "Pending", colorScheme: "orange" as const };
  }
  return { label: "Placed", colorScheme: "gray" as const };
};

const getPriorityColor = (priority?: string) => {
  if (priority === "high") return "red";
  if (priority === "medium") return "orange";
  return "blue";
};

const MetricCard = ({
  label,
  value,
  helper,
  icon,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  icon: any;
  accent: string;
}) => {
  return (
    <Box
      bg={dashboardPalette.surface}
      border="1px solid"
      borderColor={dashboardPalette.border}
      borderRadius="2xl"
      p={5}
      boxShadow="0 18px 30px rgba(0, 0, 0, 0.22)"
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" insetX={0} top={0} h="3px" bg={dashboardPalette.accent} />
      <Flex justify="space-between" align="start" gap={3}>
        <Stat>
          <StatLabel fontSize="sm" color={dashboardPalette.textMuted}>
            {label}
          </StatLabel>
          <StatNumber fontSize={{ base: "xl", md: "2xl" }} color={dashboardPalette.text}>
            {value}
          </StatNumber>
          <StatHelpText mb={0} color={dashboardPalette.textSoft}>{helper}</StatHelpText>
        </Stat>
        <Circle size="46px" bg={dashboardPalette.accentSoft}>
          <Icon as={icon} color={dashboardPalette.accentStrong} boxSize={5} />
        </Circle>
      </Flex>
    </Box>
  );
};

const SectionCard = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Box
      bg={dashboardPalette.surface}
      border="1px solid"
      borderColor={dashboardPalette.border}
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      boxShadow="0 18px 30px rgba(0, 0, 0, 0.22)"
      h="100%"
    >
      <Flex
        justify="space-between"
        align={{ base: "start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap={3}
        mb={4}
      >
        <Box>
          <Heading size="md" color={dashboardPalette.text}>
            {title}
          </Heading>
          {subtitle ? (
            <Text mt={1} color={dashboardPalette.textMuted} fontSize="sm">
              {subtitle}
            </Text>
          ) : null}
        </Box>
        {actionLabel && onAction ? (
          <Button
            size="sm"
            variant="outline"
            color={dashboardPalette.accentStrong}
            borderColor={dashboardPalette.borderStrong}
            _hover={{ bg: dashboardPalette.accentSoft, borderColor: dashboardPalette.accent }}
            rightIcon={<FaArrowRight />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Flex>
      {children}
    </Box>
  );
};

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

  const pageBg = dashboardPalette.page;
  const panelBg = dashboardPalette.surface;
  const mutedText = dashboardPalette.textMuted;
  const borderColor = dashboardPalette.border;
  const heroBg = dashboardHeroGradient;

  const loadDashboard = useCallback(async () => {
    if (!companyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await companyStore.getDashboardSummary(String(companyId));
      const payload = response?.data || {};
      setDashboardData({
        company: payload.company || null,
        metrics: {
          ...defaultMetrics,
          ...(payload.metrics || {}),
        },
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

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const company = dashboardData.company;

  const checklistItems = useMemo(() => {
    const items = [
      {
        label: "Shop basics added",
        done: Boolean(company?.name && company?.description),
      },
      {
        label: "Primary location set",
        done: Boolean(company?.location?.address && Array.isArray(company?.location?.coordinates)),
      },
      {
        label: "Phone added",
        done: Boolean(company?.contactInfo?.phone),
      },
      {
        label: "Email added",
        done: Boolean(company?.contactInfo?.email),
      },
      {
        label: "GST added",
        done: Boolean(company?.gstNumber),
      },
      {
        label: "At least one product listed",
        done: dashboardData.metrics.totalProducts > 0,
      },
    ];

    const completed = items.filter((item) => item.done).length;

    return {
      items,
      completed,
      percent: items.length ? Math.round((completed / items.length) * 100) : 0,
    };
  }, [company, dashboardData.metrics.totalProducts]);

  const quickActions = [
    {
      label: "Add Product",
      helper: "List a new product in your catalog",
      icon: FaBoxOpen,
      onClick: () => router.push("/dashboard/products"),
    },
    {
      label: "Manage Customers",
      helper: "Open customer and supplier ledgers",
      icon: FaUserFriends,
      onClick: () => router.push("/dashboard/customers"),
    },
    {
      label: "Review Orders",
      helper: "Handle pending and active orders",
      icon: FaClipboardList,
      onClick: () => router.push("/dashboard/orders"),
    },
    {
      label: "Update Shop",
      helper: "Edit location, GST, photos, and contact info",
      icon: FaStore,
      onClick: () => router.push("/dashboard/shop"),
    },
  ];

  return (
    <Box bg={pageBg} minH="100%">
      <Stack spacing={{ base: 4, md: 6 }} px={{ base: 2, md: 4 }} py={{ base: 3, md: 5 }}>
        <Box
          bgImage={heroBg}
          color="white"
          borderRadius="3xl"
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
          boxShadow="xl"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            right="-50px"
            top="-60px"
            w="220px"
            h="220px"
            bg="whiteAlpha.200"
            borderRadius="full"
          />
          <Stack
            direction={{ base: "column", xl: "row" }}
            justify="space-between"
            align={{ base: "start", xl: "center" }}
            spacing={6}
            position="relative"
            zIndex={1}
          >
            <Box maxW="3xl">
              <Badge
                colorScheme={company?.shopStatus === "active" ? "green" : company?.shopStatus === "pending" ? "orange" : "purple"}
                px={3}
                py={1}
                borderRadius="full"
                textTransform="capitalize"
                mb={4}
              >
                {company?.shopStatus || "shop setup"}
              </Badge>
              <Heading size={{ base: "lg", md: "xl" }} lineHeight="1.2">
                {company?.name ? `Welcome back, ${company.name}` : "Welcome to your seller dashboard"}
              </Heading>
              <Text mt={3} color={dashboardPalette.textMuted} maxW="2xl">
                Keep track of orders, stock, customers, suppliers, and shop readiness from one place.
              </Text>
              <HStack spacing={5} mt={5} wrap="wrap">
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} />
                  <Text fontSize="sm">
                    {company?.location?.city || company?.location?.address || "Location not added"}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaPhoneAlt} />
                  <Text fontSize="sm">
                    {company?.contactInfo?.phone || auth.user?.phone || "Phone not added"}
                  </Text>
                </HStack>
              </HStack>
            </Box>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} minW={{ base: "100%", xl: "460px" }}>
              <Box bg="rgba(255,255,255,0.04)" border="1px solid" borderColor={dashboardPalette.border} borderRadius="2xl" p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="whiteAlpha.700">
                  Pending orders
                </Text>
                <Heading size="md" mt={1}>
                  {dashboardData.metrics.pendingOrders}
                </Heading>
              </Box>
              <Box bg="rgba(255,255,255,0.04)" border="1px solid" borderColor={dashboardPalette.border} borderRadius="2xl" p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="whiteAlpha.700">
                  Customer due
                </Text>
                <Heading size="md" mt={1}>
                  {formatCompactCurrency(dashboardData.metrics.customerReceivable)}
                </Heading>
              </Box>
              <Box bg="rgba(255,255,255,0.04)" border="1px solid" borderColor={dashboardPalette.border} borderRadius="2xl" p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="whiteAlpha.700">
                  Supplier payable
                </Text>
                <Heading size="md" mt={1}>
                  {formatCompactCurrency(dashboardData.metrics.supplierPayable)}
                </Heading>
              </Box>
              <Box bg="rgba(255,255,255,0.04)" border="1px solid" borderColor={dashboardPalette.border} borderRadius="2xl" p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="whiteAlpha.700">
                  Unread alerts
                </Text>
                <Heading size="md" mt={1}>
                  {dashboardData.metrics.unreadNotifications}
                </Heading>
              </Box>
            </SimpleGrid>
          </Stack>
        </Box>

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
            <MetricCard
              label="Pending Orders"
              value={String(dashboardData.metrics.pendingOrders)}
              helper={`${dashboardData.metrics.inFlightOrders} in processing or shipped`}
              icon={FaClipboardList}
              accent="orange"
            />
            <MetricCard
              label="Customer Receivable"
              value={formatCurrency(dashboardData.metrics.customerReceivable)}
              helper={`${dashboardData.metrics.totalCustomers} active customers`}
              icon={FaFileInvoiceDollar}
              accent="green"
            />
            <MetricCard
              label="Supplier Payable"
              value={formatCurrency(dashboardData.metrics.supplierPayable)}
              helper={`${dashboardData.metrics.totalSuppliers} supplier profiles`}
              icon={FaTruck}
              accent="red"
            />
            <MetricCard
              label="Inventory Health"
              value={String(dashboardData.metrics.lowStockProducts)}
              helper={`${dashboardData.metrics.outOfStockProducts} out of stock`}
              icon={FaWarehouse}
              accent="blue"
            />
          </SimpleGrid>
        )}

        {error ? (
          <Box bg={panelBg} border="1px solid" borderColor="rgba(239, 107, 107, 0.22)" borderRadius="2xl" p={5}>
            <HStack justify="space-between" align="start" spacing={4}>
              <HStack align="start" spacing={3}>
                <Circle size="42px" bg="rgba(239, 107, 107, 0.14)">
                  <Icon as={FaExclamationTriangle} color={dashboardPalette.danger} />
                </Circle>
                <Box>
                  <Heading size="sm" color={dashboardPalette.text}>
                    Seller overview could not load fully
                  </Heading>
                  <Text mt={1} color={mutedText}>
                    {error}
                  </Text>
                </Box>
              </HStack>
              <Button
                size="sm"
                variant="outline"
                borderColor={dashboardPalette.borderStrong}
                color={dashboardPalette.accentStrong}
                _hover={{ bg: dashboardPalette.accentSoft }}
                onClick={loadDashboard}
              >
                Retry
              </Button>
            </HStack>
          </Box>
        ) : null}

        <Grid templateColumns={{ base: "1fr", xl: "1.7fr 1fr" }} gap={4}>
          <GridItem>
            <SectionCard
              title="Recent Orders"
              subtitle="Latest orders that need seller attention"
              actionLabel="View all orders"
              onAction={() => router.push("/dashboard/orders")}
            >
              {loading ? (
                <Stack spacing={4}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Box key={index}>
                      <Skeleton height="18px" width="25%" />
                      <SkeletonText mt={3} noOfLines={2} spacing={2} />
                    </Box>
                  ))}
                </Stack>
              ) : dashboardData.recentOrders.length ? (
                <Stack spacing={3}>
                  {dashboardData.recentOrders.map((order) => {
                    const statusMeta = getOrderStatusMeta(order.orderStatus);
                    return (
                      <Box
                        key={order._id || order.orderId}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="xl"
                        p={4}
                        bg={panelBg}
                      >
                        <Flex justify="space-between" align={{ base: "start", md: "center" }} gap={3} direction={{ base: "column", md: "row" }}>
                          <Box>
                            <HStack spacing={3}>
                              <Text fontWeight="semibold" color={dashboardPalette.text}>
                                {order.orderId || order._id}
                              </Text>
                              <Badge colorScheme={statusMeta.colorScheme}>{statusMeta.label}</Badge>
                            </HStack>
                            <Text mt={1} fontSize="sm" color={mutedText}>
                              {order.user?.name || "Unknown customer"} • {formatRelativeTime(order.createdAt)}
                            </Text>
                          </Box>
                          <Box textAlign={{ base: "left", md: "right" }}>
                            <Text fontWeight="bold" color={dashboardPalette.text}>
                              {formatCurrency(getOrderAmount(order))}
                            </Text>
                            <Text fontSize="sm" color={mutedText}>
                              {order.items?.length || 0} items
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={6}>
                  <Text fontWeight="medium" color={dashboardPalette.text}>
                    No orders yet
                  </Text>
                  <Text mt={1} color={mutedText} fontSize="sm">
                    Once buyers place orders, the newest ones will show here.
                  </Text>
                </Box>
              )}
            </SectionCard>
          </GridItem>

          <GridItem>
            <Stack spacing={4}>
              <SectionCard
                title="Shop Readiness"
                subtitle="A quick view of what is already set up"
                actionLabel="Open shop"
                onAction={() => router.push("/dashboard/shop")}
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontSize="sm" color={mutedText}>
                    Completion
                  </Text>
                  <Text fontWeight="semibold" color={dashboardPalette.text}>
                    {checklistItems.completed}/{checklistItems.items.length}
                  </Text>
                </Flex>
                <Progress value={checklistItems.percent} colorScheme="teal" borderRadius="full" h="8px" />
                <List spacing={3} mt={4}>
                  {checklistItems.items.map((item) => (
                    <ListItem key={item.label}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={dashboardPalette.text}>
                          {item.label}
                        </Text>
                        <Badge colorScheme={item.done ? "green" : "orange"}>{item.done ? "Done" : "Pending"}</Badge>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </SectionCard>

              <SectionCard title="Quick Actions" subtitle="Jump into the seller flows you use most">
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      justifyContent="start"
                      alignItems="start"
                      textAlign="left"
                      p={4}
                      h="auto"
                      variant="outline"
                      borderRadius="xl"
                      onClick={action.onClick}
                    >
                      <HStack align="start" spacing={3}>
                        <Circle size="38px" bg={dashboardPalette.accentSoft}>
                          <Icon as={action.icon} color={dashboardPalette.accentStrong} />
                        </Circle>
                        <Box>
                          <Text fontWeight="semibold" color={dashboardPalette.text}>
                            {action.label}
                          </Text>
                          <Text fontSize="xs" color={mutedText} whiteSpace="normal">
                            {action.helper}
                          </Text>
                        </Box>
                      </HStack>
                    </Button>
                  ))}
                </SimpleGrid>
              </SectionCard>
            </Stack>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={4}>
          <GridItem>
            <SectionCard
              title="Inventory Snapshot"
              subtitle="Products that may need action soon"
              actionLabel="Manage products"
              onAction={() => router.push("/dashboard/products")}
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={3}>
                  <Text fontSize="xs" color={mutedText}>
                    Total products
                  </Text>
                  <Text mt={1} fontWeight="bold" color={dashboardPalette.text}>
                    {dashboardData.metrics.totalProducts}
                  </Text>
                </Box>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={3}>
                  <Text fontSize="xs" color={mutedText}>
                    Active
                  </Text>
                  <Text mt={1} fontWeight="bold" color={dashboardPalette.text}>
                    {dashboardData.metrics.activeProducts}
                  </Text>
                </Box>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={3}>
                  <Text fontSize="xs" color={mutedText}>
                    Low stock
                  </Text>
                  <Text mt={1} fontWeight="bold" color={dashboardPalette.warning}>
                    {dashboardData.metrics.lowStockProducts}
                  </Text>
                </Box>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={3}>
                  <Text fontSize="xs" color={mutedText}>
                    Featured
                  </Text>
                  <Text mt={1} fontWeight="bold" color={dashboardPalette.accentStrong}>
                    {dashboardData.metrics.featuredProducts}
                  </Text>
                </Box>
              </SimpleGrid>

              {dashboardData.lowStockItems.length ? (
                <Stack spacing={3}>
                  {dashboardData.lowStockItems.map((product) => (
                    <Flex
                      key={product._id}
                      justify="space-between"
                      align="center"
                      border="1px solid"
                      borderColor={borderColor}
                      borderRadius="xl"
                      p={3}
                    >
                      <Box>
                        <Text fontWeight="semibold" color={dashboardPalette.text}>
                          {product.name || "Unnamed product"}
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Updated {formatRelativeTime(product.updatedAt || product.createdAt)}
                        </Text>
                      </Box>
                      <Badge colorScheme={Number(product.stock || 0) === 0 ? "red" : "orange"} px={3} py={1} borderRadius="full">
                        {Number(product.stock || 0)} left
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={5}>
                  <Text fontWeight="medium" color={dashboardPalette.text}>
                    Inventory looks healthy
                  </Text>
                  <Text mt={1} fontSize="sm" color={mutedText}>
                    No low-stock products were found in your current catalog.
                  </Text>
                </Box>
              )}
            </SectionCard>
          </GridItem>

          <GridItem>
            <SectionCard
              title="Parties Snapshot"
              subtitle="Who owes you, and who you need to pay"
              actionLabel="Open ledgers"
              onAction={() => router.push("/dashboard/customers")}
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={4}>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={4}>
                  <Text fontSize="xs" textTransform="uppercase" color={mutedText}>
                    Customers
                  </Text>
                  <Heading size="md" mt={1} color={dashboardPalette.text}>
                    {dashboardData.metrics.totalCustomers}
                  </Heading>
                  <Text mt={2} fontSize="sm" color={dashboardPalette.success} fontWeight="semibold">
                    You will get {formatCurrency(dashboardData.metrics.customerReceivable)}
                  </Text>
                </Box>
                <Box border="1px solid" borderColor={borderColor} borderRadius="xl" p={4}>
                  <Text fontSize="xs" textTransform="uppercase" color={mutedText}>
                    Suppliers
                  </Text>
                  <Heading size="md" mt={1} color={dashboardPalette.text}>
                    {dashboardData.metrics.totalSuppliers}
                  </Heading>
                  <Text mt={2} fontSize="sm" color={dashboardPalette.danger} fontWeight="semibold">
                    You will give {formatCurrency(dashboardData.metrics.supplierPayable)}
                  </Text>
                </Box>
              </SimpleGrid>

              <Stack spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color={dashboardPalette.text} mb={2}>
                    Top customer receivables
                  </Text>
                  <Stack spacing={2}>
                    {dashboardData.topCustomers.length ? (
                      dashboardData.topCustomers.map((party) => (
                        <Flex key={party._id} justify="space-between" align="center">
                          <HStack spacing={3}>
                            <Avatar size="sm" name={party.name} />
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color={dashboardPalette.text}>
                                {party.name || "Unnamed customer"}
                              </Text>
                              <Text fontSize="xs" color={mutedText}>
                                {party.phone || party.email || "No contact info"}
                              </Text>
                            </Box>
                          </HStack>
                          <Text fontWeight="semibold" color={dashboardPalette.success}>
                            {formatCurrency(Number(party.outstandingBalance || 0))}
                          </Text>
                        </Flex>
                      ))
                    ) : (
                      <Text fontSize="sm" color={mutedText}>
                        No customer receivables right now.
                      </Text>
                    )}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color={dashboardPalette.text} mb={2}>
                    Top supplier payables
                  </Text>
                  <Stack spacing={2}>
                    {dashboardData.topSuppliers.length ? (
                      dashboardData.topSuppliers.map((party) => (
                        <Flex key={party._id} justify="space-between" align="center">
                          <HStack spacing={3}>
                            <Avatar size="sm" name={party.name} />
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color={dashboardPalette.text}>
                                {party.name || "Unnamed supplier"}
                              </Text>
                              <Text fontSize="xs" color={mutedText}>
                                {party.phone || party.email || "No contact info"}
                              </Text>
                            </Box>
                          </HStack>
                          <Text fontWeight="semibold" color={dashboardPalette.danger}>
                            {formatCurrency(Number(party.outstandingBalance || 0))}
                          </Text>
                        </Flex>
                      ))
                    ) : (
                      <Text fontSize="sm" color={mutedText}>
                        No supplier payables right now.
                      </Text>
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
                <Box key={index}>
                  <Skeleton height="14px" width="30%" />
                  <SkeletonText mt={3} noOfLines={2} spacing={2} />
                </Box>
              ))}
            </Stack>
          ) : dashboardData.notifications.length ? (
            <Stack spacing={3}>
              {dashboardData.notifications.map((notification) => (
                <Flex
                  key={notification._id}
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                  direction={{ base: "column", md: "row" }}
                  gap={3}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="xl"
                  p={4}
                >
                  <HStack align="start" spacing={3}>
                    <Circle size="40px" bg={`${getPriorityColor(notification.priority)}.50`}>
                      <Icon as={FaBell} color={`${getPriorityColor(notification.priority)}.500`} />
                    </Circle>
                    <Box>
                      <HStack spacing={2} wrap="wrap">
                        <Text fontWeight="semibold" color={dashboardPalette.text}>
                          {notification.title}
                        </Text>
                        {notification.category ? (
                          <Badge variant="subtle" colorScheme="blue">
                            {notification.category}
                          </Badge>
                        ) : null}
                        {!notification.isRead ? <Badge colorScheme="orange">Unread</Badge> : null}
                      </HStack>
                      <Text mt={1} color={mutedText} fontSize="sm">
                        {notification.message}
                      </Text>
                    </Box>
                  </HStack>
                  <Text fontSize="sm" color={mutedText} whiteSpace="nowrap">
                    {formatRelativeTime(notification.createdAt)}
                  </Text>
                </Flex>
              ))}
            </Stack>
          ) : (
            <Box border="1px dashed" borderColor={borderColor} borderRadius="xl" p={5}>
              <Text fontWeight="medium" color={dashboardPalette.text}>
                No recent notifications
              </Text>
              <Text mt={1} fontSize="sm" color={mutedText}>
                Order, payment, and account alerts will start showing here.
              </Text>
            </Box>
          )}
        </SectionCard>
      </Stack>
    </Box>
  );
});

export default SellerOverview;
