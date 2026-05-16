"use client";

import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  List,
  ListItem,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegCircle, FaStore, FaWarehouse } from "react-icons/fa";
import {
  FiBell,
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiClipboard,
  FiClock,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiTrendingDown,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiZap
} from "react-icons/fi";
import { dashboardHeroGradient, dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { getLowStockThreshold } from "../../products/utils/stockThreshold";
import stores from "../../../store/stores";
import { normalizeOrderStatusKey } from "../../../utils/orderStatus";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

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

const getOrderStatusPalette = (
  status: string | undefined,
  isDark: boolean
): { label: string; bg: string; color: string } => {
  const normalized = normalizeOrderStatusKey(status);

  if (normalized === "created") {
    return {
      label: "Placed",
      bg: isDark ? dashboardPalette.warningSoft : "#FFF3E6",
      color: isDark ? "#FFB27A" : "#FF941F",
    };
  }

  if (normalized === "shipped" || normalized === "processing") {
    return {
      label: normalized === "processing" ? "Processing" : "Shipped",
      bg: isDark ? dashboardPalette.infoSoft : "#E8F2FF",
      color: isDark ? "#8FC0FF" : "#2E8DFF",
    };
  }

  if (normalized === "delivered") {
    return {
      label: "Delivered",
      bg: isDark ? dashboardPalette.successSoft : "#E7F9EF",
      color: isDark ? "#7CE7B3" : "#20B95A",
    };
  }

  if (normalized === "cancelled") {
    return {
      label: "Cancelled",
      bg: isDark ? dashboardPalette.dangerSoft : "#FDECEC",
      color: isDark ? "#FF9D9D" : "#E65050",
    };
  }

  return {
    label: "Draft",
    bg: isDark ? dashboardPalette.warningSoft : "#FFF3E6",
    color: isDark ? "#FFB27A" : "#FF941F",
  };
};

const getNotificationPalette = (
  priority: string | undefined,
  isDark: boolean
): { bg: string; color: string } => {
  if (priority === "high") {
    return {
      bg: isDark ? dashboardPalette.dangerSoft : "#FDECEC",
      color: isDark ? "#FF9D9D" : "#F04F4F",
    };
  }

  if (priority === "medium") {
    return {
      bg: isDark ? dashboardPalette.warningSoft : "#FFF3E6",
      color: isDark ? "#FFB27A" : "#FF941F",
    };
  }

  return {
    bg: isDark ? dashboardPalette.infoSoft : "#E8F2FF",
    color: isDark ? "#8FC0FF" : "#2E8DFF",
  };
};

const OverviewSectionHeader = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) => {
  const titleColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const actionColor = useColorModeValue("#4263FF", dashboardPalette.accentStrong);

  return (
    <Flex align="center" justify="space-between" mb={3} px={1}>
      <Heading fontSize={{ base: "sm", md: "md" }} lineHeight="1.1" fontWeight="700" color={titleColor}>
        {title}
      </Heading>
      {action && onAction ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          color={actionColor}
          rightIcon={<FiChevronRight size={13} />}
          _hover={{ bg: "transparent", opacity: 0.85 }}
          px={1}
          minW="auto"
        >
          {action}
        </Button>
      ) : null}
    </Flex>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  helper,
  gradient,
  trend,
}: {
  icon: any;
  label: string;
  value: string | number;
  helper: string;
  gradient: string;
  trend?: "up" | "down";
}) => {
  const cardBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const labelColor = useColorModeValue("#4B5563", dashboardPalette.textMuted);
  const valueColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const helperColor = useColorModeValue("#64748B", dashboardPalette.textSoft);
  const trendUp = useColorModeValue("#22C55E", dashboardPalette.success);
  const trendDown = useColorModeValue("#EF4444", dashboardPalette.danger);

  return (
    <MotionBox
      variants={fadeUp}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="24px"
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 4 }}
      boxShadow={useColorModeValue("0 16px 40px rgba(15, 23, 42, 0.06)", "0 20px 40px rgba(0, 0, 0, 0.26)")}
      position="relative"
      overflow="hidden"
      minH="132px"
    >
      <Box
        position="absolute"
        top="-22px"
        right="-18px"
        w={{ base: "70px", md: "78px" }}
        h={{ base: "70px", md: "78px" }}
        borderRadius="full"
        bgGradient={gradient}
        opacity={useColorModeValue(0.12, 0.2)}
      />
      <Circle size={{ base: "30px", md: "40px" }} borderRadius="14px" bgGradient={gradient} color="white" mb={2}>
        <Icon as={icon} boxSize={5} />
      </Circle>
      <Text fontSize="sm" color={labelColor} fontWeight="500">
        {label}
      </Text>
      <Text mt={{base:0.5,md:1}} fontSize={{ base: "xl", md: "3xl" }} lineHeight="0.95" fontWeight="700" color={valueColor}>
        {value}
      </Text>
      <HStack mt={1} spacing={1} color={helperColor} align="center">
        {trend === "up" ? <FiTrendingUp color={trendUp} size={12} /> : null}
        {trend === "down" ? <FiTrendingDown color={trendDown} size={12} /> : null}
        <Text fontSize="xs" fontWeight="500">
          {helper}
        </Text>
      </HStack>
    </MotionBox>
  );
};

const QuickActionCard = ({
  icon,
  label,
  gradient,
  onClick,
}: {
  icon: any;
  label: string;
  gradient: string;
  onClick: () => void;
}) => {
  const textColor = useColorModeValue("#0F172A", dashboardPalette.text);

  return (
    <MotionButton
      variants={fadeUp}
      whileTap={{ scale: 0.96 }}
      variant="unstyled"
      minW={{ base: "72px", md: "88px" }}
      h="auto"
      onClick={onClick}
    >
      <Stack spacing={2.5} align="center">
        <Circle
          size={{ base: "48px", md: "56px" }}
          borderRadius="18px"
          bgGradient={gradient}
          color="white"
          boxShadow={useColorModeValue("0 10px 24px rgba(91, 108, 255, 0.18)", "0 12px 28px rgba(0, 0, 0, 0.24)")}
        >
          <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
        </Circle>
        <Text fontSize="sm" color={textColor} fontWeight="500" textAlign="center" lineHeight="1.1">
          {label}
        </Text>
      </Stack>
    </MotionButton>
  );
};

const OrderRow = ({ order }: { order: DashboardOrder }) => {
  const rowBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const textPrimary = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const iconBg = useColorModeValue("#EEF2FF", dashboardPalette.accentSoft);
  const iconColor = useColorModeValue("#4568FF", dashboardPalette.accentStrong);
  const isDark = useColorModeValue(false, true);
  const status = getOrderStatusPalette(order.orderStatus, isDark);

  return (
    <MotionBox
      variants={fadeUp}
      bg={rowBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="20px"
      p={{base:2,md:3.5}}
      boxShadow={useColorModeValue("0 12px 28px rgba(15, 23, 42, 0.04)", "0 18px 32px rgba(0, 0, 0, 0.22)")}
    >
      <Flex align="center" justify="space-between" gap={3}>
        <HStack spacing={3} minW={0} flex="1">
          <Circle size={{base:"38px",md:"44px"}} borderRadius="14px" bg={iconBg} color={iconColor} flexShrink={0}>
            <Icon as={FiShoppingBag} boxSize={4} />
          </Circle>
          <Box minW={0}>
            <Text fontSize={{md:"md"}} fontWeight="700" color={textPrimary} noOfLines={1}>
              {order.user?.name || "Unknown customer"}
            </Text>
            <HStack spacing={{base:1,md:2}} mt={{base:0.5,md:0}} color={textMuted} flexWrap="wrap">
              <Text fontSize={{base:"xs",md:"sm"}} fontWeight="500">
                {order.orderId || order._id}
              </Text>
              <Text fontSize="xs">•</Text>
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={3} />
                <Text fontSize={{base:"xs",md:"sm"}}>{formatRelativeTime(order.createdAt)}</Text>
              </HStack>
            </HStack>
          </Box>
        </HStack>

        <Box textAlign="right" flexShrink={0}>
          <Text fontSize={{md:"lg"}} lineHeight="1" fontWeight="700" color={textPrimary}>
            {formatCurrency(getOrderAmount(order))}
          </Text>
          <Badge
            mt={{base:1,md:2}}
            px={{base:1.5,md:2.5}}
            py={1}
            borderRadius="full"
            bg={status.bg}
            color={status.color}
            textTransform="uppercase"
            fontSize="10px"
            fontWeight="700"
          >
            {status.label}
          </Badge>
        </Box>
      </Flex>
    </MotionBox>
  );
};

const StockRow = ({ item }: { item: DashboardProduct }) => {
  const rowBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const textPrimary = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const stock = Number(item.stock || 0);
  const threshold = getLowStockThreshold(item);
  const percent = Math.max(Math.min(Math.round((stock / threshold) * 100), 100), stock > 0 ? 8 : 4);
  const danger = stock <= threshold;
  const iconBg = useColorModeValue(danger ? "#FDECEC" : "#FFF3E6", danger ? dashboardPalette.dangerSoft : dashboardPalette.warningSoft);
  const iconColor = useColorModeValue(danger ? "#F04F4F" : "#FF941F", danger ? "#FF9D9D" : "#FFB27A");
  const track = useColorModeValue("#F3F4F6", dashboardPalette.surfaceSoft);

  return (
    <MotionBox
      variants={fadeUp}
      bg={rowBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="20px"
      p={3.5}
      boxShadow={useColorModeValue("0 12px 28px rgba(15, 23, 42, 0.04)", "0 18px 32px rgba(0, 0, 0, 0.22)")}
    >
      <Flex align="center" justify="space-between" gap={3} mb={3}>
        <HStack spacing={3} minW={0}>
          <Circle size="44px" borderRadius="14px" bg={iconBg} color={iconColor} flexShrink={0}>
            <Icon as={FiPackage} boxSize={4} />
          </Circle>
          <Box minW={0}>
            <Text fontSize={{md:"lg"}} fontWeight="700" color={textPrimary} noOfLines={1}>
              {item.name || "Unnamed product"}
            </Text>
            <Text fontSize="sm" color={textMuted}>
              Threshold: {threshold} units
            </Text>
          </Box>
        </HStack>
        <Text fontSize="2xl" lineHeight="1" fontWeight="900" color={iconColor} flexShrink={0}>
          {stock}
        </Text>
      </Flex>

      <Progress
        value={percent}
        h="6px"
        borderRadius="full"
        bg={track}
        sx={{
          "& > div": {
            background: iconColor,
            borderRadius: "999px",
          },
        }}
      />
    </MotionBox>
  );
};

const NotificationRow = ({ notification }: { notification: DashboardNotification }) => {
  const rowBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const textPrimary = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const isDark = useColorModeValue(false, true);
  const palette = getNotificationPalette(notification.priority, isDark);

  return (
    <MotionBox
      variants={fadeUp}
      bg={rowBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="20px"
      p={{base:3,md:3.5}}
      boxShadow={useColorModeValue("0 12px 28px rgba(15, 23, 42, 0.04)", "0 18px 32px rgba(0, 0, 0, 0.22)")}
    >
      <Flex align="start" justify="space-between" gap={3}>
        <HStack spacing={3} align="start" minW={0}>
          <Circle size={{base:"32px",md:"44px"}} borderRadius="14px" bg={palette.bg} color={palette.color} flexShrink={0}>
            <Icon as={FiBell} boxSize={4} />
          </Circle>
          <Box minW={0}>
            <Text fontSize={{base:"sm",md:"md"}} fontWeight="700" color={textPrimary} noOfLines={1}>
              {notification.title}
            </Text>
            <Text fontSize={{base:"xs",md:"sm"}} color={textMuted} mt={{base: 0, md: 0.5}} noOfLines={2}>
              {notification.message}
            </Text>
          </Box>
        </HStack>
        <Text fontSize="sm" color={textMuted} flexShrink={0}>
          {formatRelativeTime(notification.createdAt)}
        </Text>
      </Flex>
    </MotionBox>
  );
};

const ChecklistCard = ({
  items,
  completed,
  percent,
}: {
  items: { label: string; done: boolean }[];
  completed: number;
  percent: number;
}) => {
  const cardBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const titleColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const mutedText = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const progressTrack = useColorModeValue("#E5E7EB", dashboardPalette.surfaceSoft);
  const progressTextBg = useColorModeValue("#EEF2FF", dashboardPalette.accentSoft);
  const progressText = useColorModeValue("#4568FF", dashboardPalette.accentStrong);
  const successColor = useColorModeValue("#22C55E", dashboardPalette.success);

  return (
    <MotionBox
      variants={fadeUp}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="28px"
      p={5}
      boxShadow={useColorModeValue("0 16px 40px rgba(15, 23, 42, 0.05)", "0 20px 40px rgba(0, 0, 0, 0.26)")}
    >
      <Flex align="center" justify="space-between" mb={5}>
        <Box>
          <Heading fontSize={{base:"sm",md:"md"}} fontWeight="700" color={titleColor}>
            Shop Setup
          </Heading>
          <Text fontSize="sm" color={mutedText} mt={1}>
            {completed} of {items.length} completed
          </Text>
        </Box>

        <Circle size="56px" bg={progressTextBg} color={progressText} fontSize="sm" fontWeight="900">
          {percent}%
        </Circle>
      </Flex>

      <Progress
        value={percent}
        h="8px"
        borderRadius="full"
        bg={progressTrack}
        sx={{
          "& > div": {
            background: "linear-gradient(90deg, #5B6CFF 0%, #C44AE8 100%)",
            borderRadius: "999px",
          },
        }}
      />

      <List spacing={3} mt={5}>
        {items.map((item) => (
          <ListItem key={item.label}>
            <HStack align="start" spacing={3}>
              <Icon
                as={item.done ? FiCheckCircle : FaRegCircle}
                boxSize={4}
                mt="2px"
                color={item.done ? successColor : mutedText}
              />
              <Text
                fontSize="sm"
                color={item.done ? mutedText : titleColor}
                fontWeight={item.done ? "500" : "700"}
                textDecoration={item.done ? "line-through" : "none"}
              >
                {item.label}
              </Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </MotionBox>
  );
};

const OverviewSkeleton = () => {
  const skeletonBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);

  return (
    <Stack spacing={6}>
      <Box bgGradient="linear(135deg, #5B6CFF 0%, #C44AE8 100%)" borderRadius="32px" p={5}>
        <Skeleton h="24px" w="120px" startColor="whiteAlpha.400" endColor="whiteAlpha.600" />
        <Skeleton h="12px" w="100px" mt={5} startColor="whiteAlpha.400" endColor="whiteAlpha.600" />
        <Skeleton h="46px" w="180px" mt={3} startColor="whiteAlpha.400" endColor="whiteAlpha.600" />
      </Box>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index} bg={skeletonBg} border="1px solid" borderColor={borderColor} borderRadius="24px" p={4}>
            <Skeleton h="34px" w="34px" borderRadius="14px" />
            <Skeleton h="12px" w="70%" mt={4} />
            <Skeleton h="30px" w="50%" mt={3} />
            <Skeleton h="10px" w="60%" mt={4} />
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
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

  const pageBg = useColorModeValue("white", dashboardPalette.page);
  const textPrimary = useColorModeValue("#0F172A", dashboardPalette.text);
  const mutedText = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const errorCardBg = useColorModeValue("white", dashboardPalette.surface);
  const errorBorder = useColorModeValue("#FECACA", dashboardPalette.dangerBorder);
  const heroGradient = useColorModeValue(
    "linear(135deg, #5B6CFF 0%, #C44AE8 100%)",
    dashboardHeroGradient
  );

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
      setError(loadError?.message || "Unable to load seller overview");
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
        label: "Phone & email added",
        done: Boolean(company?.contactInfo?.phone && company?.contactInfo?.email),
      },
      { label: "GST number added", done: Boolean(company?.gstNumber) },
      { label: "5+ products listed", done: metrics.totalProducts >= 5 },
      { label: "Bank details verified", done: Boolean(company?.bankDetails?.accountNumber) },
    ];

    const completed = items.filter((item) => item.done).length;
    return {
      items,
      completed,
      percent: items.length ? Math.round((completed / items.length) * 100) : 0,
    };
  }, [company, metrics.totalProducts]);

  const quickActions = [
    { label: "Add Product", icon: FiBox, gradient: "linear(to-br, #6A5DFF, #A94FF0)", onClick: () => router.push("/dashboard/products") },
    { label: "Customers", icon: FiUsers, gradient: "linear(to-br, #22C55E, #14B8A6)", onClick: () => router.push("/dashboard/customers") },
    { label: "Orders", icon: FiClipboard, gradient: "linear(to-br, #FF9C3A, #FF6A3D)", onClick: () => router.push("/dashboard/orders") },
    { label: "Suppliers", icon: FiTruck, gradient: "linear(to-br, #EC5BA9, #B95BF4)", onClick: () => router.push("/dashboard/customers") },
    { label: "Shop", icon: FaStore, gradient: "linear(to-br, #4EA6FF, #4677FF)", onClick: () => router.push("/dashboard/shop") },
    { label: "Boost", icon: FiZap, gradient: "linear(to-br, #8B5CF6, #5B6CFF)", onClick: () => router.push("/dashboard/orders") },
  ];

  const todaySales = Number(metrics.todaySales || metrics.customerAdvance || 0);
  const weeklyGrowth = Number(metrics.weeklyGrowth || 12.5);
  const locationLabel =
    company?.location?.city ||
    company?.location?.address ||
    company?.city ||
    "Location not added";
  const phoneLabel = company?.contactInfo?.phone || auth.user?.phone || "Phone not added";
  const shopStatusLabel = String(company?.shopStatus || "active").toUpperCase();

  return (
    <Box bg={pageBg} minH="100vh">
      <Box>
        <Stack
          as={motion.div}
          variants={stagger}
          initial="hidden"
          animate="show"
          spacing={{ base: 4, xl: 6 }}
          px={{ base: 0, md: 6, xl: 4 }}
          py={{ base: 2, md: 0 }}
        >
          {loading ? (
            <OverviewSkeleton />
          ) : (
            <>



<MotionBox
  variants={fadeUp}
  bgGradient={heroGradient}
  borderRadius={{ base: "16px", md: "20px" }}
  px={{ base: 4, md: 6 }}
  py={{ base: 4, md: 5 }}
  color="white"
  position="relative"
  overflow="hidden"
  boxShadow={useColorModeValue(
    "0 12px 30px rgba(91, 108, 255, 0.15)",
    "0 15px 40px rgba(0, 0, 0, 0.25)"
  )}
>
  {/* Decorative Background Elements */}
  <Box position="absolute" right="-20px" top="-20px" w="100px" h="100px" borderRadius="full" bg="whiteAlpha.160" />
  <Box position="absolute" left="-15px" bottom="-30px" w="90px" h="90px" borderRadius="full" bg="whiteAlpha.120" />

  <Box position="relative" zIndex={1}>
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align={{ base: "flex-start", md: "center" }}
      gap={{ base: 4, md: 0 }}
    >
      {/* ================= LEFT SIDE: Shop Info ================= */}
      <Box>
        <Flex align="center" gap={3} mb={{ base: 2, md: 3 }}>
          <Badge
            px={2.5}
            py={{ base: 0.5, md: 1 }}
            borderRadius="full"
            bg="rgba(255,255,255,0.18)"
            color="white"
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.04em"
          >
            <HStack spacing={1.5}>
              <Box w="5px" h="5px" borderRadius="full" bg="#5CFF8A" />
              <Text as="span" fontSize={{ base: "9px", md: "xs" }}>
                {shopStatusLabel}
              </Text>
            </HStack>
          </Badge>
          <Icon as={FiZap} boxSize={3.5} color="whiteAlpha.850" />
        </Flex>

        <HStack spacing={3} flexWrap="wrap" color="whiteAlpha.850">
          <HStack spacing={1}>
            <Icon as={FiMapPin} boxSize={3.5} />
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="500">
              {locationLabel}
            </Text>
          </HStack>
          <Text fontSize="xs" opacity={0.6}>•</Text>
          <HStack spacing={1}>
            <Icon as={FiPhone} boxSize={3.5} />
            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="500">
              {phoneLabel}
            </Text>
          </HStack>
        </HStack>
      </Box>

      {/* ================= RIGHT SIDE: Sales Info ================= */}
      <Box textAlign={{ base: "left", md: "right" }}>
        <Text
          fontSize={{ base: "9px", md: "xs" }}
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="whiteAlpha.800"
          fontWeight="700"
        >
          Today's Sales
        </Text>

        <Flex
          align="center"
          justify={{ base: "flex-start", md: "flex-end" }}
          gap={2}
          mt={1}
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }} lineHeight="1" fontWeight="800">
            {formatCurrency(todaySales)}
          </Heading>
          <Badge
            px={2.5}
            py={{ base: 0.5, md: 1 }}
            borderRadius="full"
            bg="rgba(255,255,255,0.22)"
            color="white"
            fontSize={{ base: "10px", md: "xs" }}
            fontWeight="700"
          >
            <HStack spacing={1}>
              <FiTrendingUp size={10} />
              <Text as="span">^ {weeklyGrowth}%</Text>
            </HStack>
          </Badge>
        </Flex>
      </Box>
    </Flex>
  </Box>
</MotionBox>



              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{base:2,md:4}}>
                <StatCard
                  icon={FiClipboard}
                  label="Pending Orders"
                  value={metrics.pendingOrders}
                  helper={`${metrics.inFlightOrders} in transit`}
                  gradient="linear(to-br, #FF9C3A, #FF6A3D)"
                />
                <StatCard
                  icon={FiTrendingUp}
                  label="Receivable"
                  value={formatCompact(metrics.customerReceivable)}
                  helper={`${metrics.totalCustomers} customers`}
                  gradient="linear(to-br, #22C55E, #14B8A6)"
                  trend="up"
                />
                <StatCard
                  icon={FiTruck}
                  label="Payable"
                  value={formatCompact(metrics.supplierPayable)}
                  helper={`${metrics.totalSuppliers} suppliers`}
                  gradient="linear(to-br, #EC5BA9, #B95BF4)"
                />
                <StatCard
                  icon={FaWarehouse}
                  label="Low Stock"
                  value={metrics.lowStockProducts}
                  helper={`${metrics.outOfStockProducts} out of stock`}
                  gradient="linear(to-br, #4EA6FF, #4677FF)"
                />
              </SimpleGrid>
            </>
          )}

          {error ? (
            <MotionBox
              variants={fadeUp}
              bg={errorCardBg}
              border="1px solid"
              borderColor={errorBorder}
              borderRadius="24px"
              p={4}
              boxShadow={useColorModeValue("0 12px 28px rgba(15, 23, 42, 0.04)", "0 18px 32px rgba(0, 0, 0, 0.22)")}
            >
              <HStack align="start" spacing={3}>
                <Circle size="40px" bg={useColorModeValue("#FDECEC", dashboardPalette.dangerSoft)} color={useColorModeValue("#F04F4F", dashboardPalette.danger)}>
                  <FiBell size={18} />
                </Circle>
                <Box>
                  <Text fontWeight="700" color={textPrimary}>
                    Seller overview could not load fully
                  </Text>
                  <Text mt={1} fontSize="sm" color={mutedText}>
                    {error}
                  </Text>
                  <Button mt={3} size="sm" colorScheme="red" variant="outline" onClick={loadDashboard}>
                    Retry
                  </Button>
                </Box>
              </HStack>
            </MotionBox>
          ) : null}

          <Box>
            <OverviewSectionHeader title="Quick Actions" />
            <Flex
              gap={5}
              overflowX="auto"
              pb={2}
              px={1}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  gradient={action.gradient}
                  onClick={action.onClick}
                />
              ))}
            </Flex>
          </Box>

          <Grid templateColumns={{ base: "1fr", xl: "1.08fr 0.92fr" }} gap={{ base: 6, xl: 8 }}>
            <Stack spacing={6}>
              <Box>
                <OverviewSectionHeader title="Recent Orders" action="View all" onAction={() => router.push("/dashboard/orders")} />
                <Stack spacing={2}>
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <Box key={index}>
                          <Skeleton h="90px" borderRadius="20px" />
                        </Box>
                      ))
                    : dashboardData.recentOrders.length
                      ? dashboardData.recentOrders.map((order) => <OrderRow key={order._id || order.orderId} order={order} />)
                      : (
                        <MotionBox
                          variants={fadeUp}
                          bg={useColorModeValue("white", dashboardPalette.surface)}
                          border="1px solid"
                          borderColor={useColorModeValue("#EEF2F7", dashboardPalette.border)}
                          borderRadius="20px"
                          p={5}
                        >
                          <Text fontWeight="700" color={textPrimary}>
                            No orders yet
                          </Text>
                          <Text mt={0.5} fontSize="sm" color={mutedText}>
                            Once buyers place orders, the newest ones will show here.
                          </Text>
                        </MotionBox>
                      )}
                </Stack>
              </Box>

              <Box>
                <OverviewSectionHeader title="Low Stock Alerts" action="Manage" onAction={() => router.push("/dashboard/products")} />
                <Stack spacing={3}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <Box key={index}>
                          <Skeleton h="92px" borderRadius="20px" />
                        </Box>
                      ))
                    : dashboardData.lowStockItems.length
                      ? dashboardData.lowStockItems.map((item) => <StockRow key={item._id} item={item} />)
                      : (
                        <MotionBox
                          variants={fadeUp}
                          bg={useColorModeValue("white", dashboardPalette.surface)}
                          border="1px solid"
                          borderColor={useColorModeValue("#EEF2F7", dashboardPalette.border)}
                          borderRadius="20px"
                          p={5}
                        >
                          <Text fontWeight="700" color={textPrimary}>
                            Inventory looks healthy
                          </Text>
                          <Text mt={1} fontSize="sm" color={mutedText}>
                            No low-stock products were found.
                          </Text>
                        </MotionBox>
                      )}
                </Stack>
              </Box>
            </Stack>

            <Stack spacing={6}>
              <Box>
                <OverviewSectionHeader title="Notifications" action="See all" onAction={() => router.push("/dashboard/orders")} />
                <Stack spacing={3}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <Box key={index}>
                          <Skeleton h="82px" borderRadius="20px" />
                        </Box>
                      ))
                    : dashboardData.notifications.length
                      ? dashboardData.notifications.map((notification) => (
                          <NotificationRow key={notification._id} notification={notification} />
                        ))
                      : (
                        <MotionBox
                          variants={fadeUp}
                          bg={useColorModeValue("white", dashboardPalette.surface)}
                          border="1px solid"
                          borderColor={useColorModeValue("#EEF2F7", dashboardPalette.border)}
                          borderRadius="20px"
                          p={5}
                        >
                          <Text fontWeight="700" color={textPrimary}>
                            No recent notifications
                          </Text>
                          <Text mt={1} fontSize="sm" color={mutedText}>
                            Order, payment, and account alerts will start showing here.
                          </Text>
                        </MotionBox>
                      )}
                </Stack>
              </Box>

              <ChecklistCard
                items={checklistItems.items}
                completed={checklistItems.completed}
                percent={checklistItems.percent}
              />
            </Stack>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
});

export default SellerOverview;
