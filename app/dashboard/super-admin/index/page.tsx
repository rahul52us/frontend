"use client";

import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    IconButton,
    SimpleGrid,
    Skeleton,
    SkeletonCircle,
    Stack,
    Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import React from "react";
import {
    FiActivity,
    FiAlertTriangle,
    FiBell,
    FiBox,
    FiCheckCircle,
    FiClock,
    FiFileText,
    FiGift,
    FiLayers,
    FiPackage,
    FiRefreshCw,
    FiShield,
    FiShoppingBag,
    FiShoppingCart,
    FiUsers,
} from "react-icons/fi";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
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
    MerchantStatCard
} from "../../components/common/merchantDashboardUI";
import { DashboardState, defaultAlerts, defaultMetrics } from "./constant";

const formatNumber = (value: number) => Number(value || 0).toLocaleString("en-IN");
const formatCurrency = (value: number) =>
    `Rs ${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;

const formatRelativeTime = (value?: string) => {
    if (!value) return "just now";
    const now = Date.now();
    const target = new Date(value).getTime();
    if (Number.isNaN(target)) return "recently";
    const diffMinutes = Math.max(Math.floor((now - target) / (1000 * 60)), 0);
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
};

const toStatusLabel = (value?: string) =>
    value ? value.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase()) : "Unknown";

const percentOf = (part: number, total: number) =>
    total > 0 ? Math.min((Number(part || 0) / Number(total)) * 100, 100) : 0;

type Tone = "accent" | "success" | "danger" | "soft" | "info" | "warning";

type ActivityItem = {
    key: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle: string;
    badgeTone: Tone;
    badgeLabel: string;
};

/* ------------------------------------------------------------------ */
/* Header controls                                                     */
/* ------------------------------------------------------------------ */

const AttentionChip = ({
    icon,
    label,
    count,
    color,
    bg,
    loading,
    onClick,
}: {
    icon: any;
    label: string;
    count: number;
    color: string;
    bg: string;
    loading: boolean;
    onClick: () => void;
}) => (
    <Flex
        as="button"
        type="button"
        onClick={onClick}
        align="center"
        gap={2}
        px={3}
        py={1.5}
        bg="var(--merchant-surface)"
        border="1px solid"
        borderColor="var(--merchant-border)"
        borderRadius="full"
        transition="all 0.2s ease"
        _hover={{ borderColor: color, transform: "translateY(-1px)" }}
        _active={{ transform: "scale(0.97)" }}
    >
        <Flex align="center" justify="center" w="22px" h="22px" borderRadius="full" bg={bg}>
            <Icon as={icon} boxSize={3} color={color} />
        </Flex>
        <Text fontSize="xs" fontWeight="600" color="var(--merchant-text-muted)">
            {label}
        </Text>
        {loading ? (
            <Skeleton h="14px" w="18px" borderRadius="md" />
        ) : (
            <Text fontSize="xs" fontWeight="800" color={count > 0 ? color : "var(--merchant-text)"}>
                {formatNumber(count)}
            </Text>
        )}
    </Flex>
);

/* ------------------------------------------------------------------ */
/* Activity                                                            */
/* ------------------------------------------------------------------ */

const ActivityRow = ({ item, index }: { item: ActivityItem; index: number }) => (
    <Flex
        align="center"
        gap={3}
        p={3}
        borderRadius="16px"
        transition="background 0.2s ease"
        _hover={{ bg: "var(--merchant-surface-alt)" }}
        animation={merchantFadeUp(index * 50)}
    >
        <Flex
            align="center"
            justify="center"
            w={{ base: "36px", md: "40px" }}
            h={{ base: "36px", md: "40px" }}
            borderRadius="12px"
            bg={item.iconBg}
            flexShrink={0}
        >
            <Icon as={item.icon} boxSize={4} color={item.iconColor} />
        </Flex>
        <Box flex="1" minW={0}>
            <Text fontSize="sm" fontWeight="600" color="var(--merchant-text)" noOfLines={1}>
                {item.title}
            </Text>
            <Text fontSize="xs" color="var(--merchant-text-muted)" noOfLines={1}>
                {item.subtitle}
            </Text>
        </Box>
        <MerchantBadge tone={item.badgeTone} fontSize="10px" px={2.5} py={1} flexShrink={0}>
            {item.badgeLabel}
        </MerchantBadge>
    </Flex>
);

const EmptyState = ({ icon, text }: { icon: any; text: string }) => (
    <Flex direction="column" align="center" justify="center" py={10} gap={3}>
        <Flex align="center" justify="center" w="48px" h="48px" borderRadius="full" bg="var(--merchant-surface-alt)">
            <Icon as={icon} boxSize={5} color="var(--merchant-text-muted)" />
        </Flex>
        <Text fontSize="sm" color="var(--merchant-text-muted)" textAlign="center">
            {text}
        </Text>
    </Flex>
);

/* ------------------------------------------------------------------ */
/* Platform health: animated score ring + mini progress tiles          */
/* ------------------------------------------------------------------ */

const GAUGE_SIZE = 140;
const GAUGE_STROKE = 12;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

const HealthGauge = ({ score, loading }: { score: number; loading: boolean }) => {
    const [shown, setShown] = React.useState(0);

    React.useEffect(() => {
        if (loading) {
            setShown(0);
            return;
        }
        const timer = setTimeout(() => setShown(score), 150);
        return () => clearTimeout(timer);
    }, [score, loading]);

    const color =
        score >= 80 ? dashboardPalette.success : score >= 50 ? dashboardPalette.warning : dashboardPalette.danger;
    const label = score >= 80 ? "Healthy" : score >= 50 ? "Needs attention" : "Critical";
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
                <Text fontSize="3xl" fontWeight="800" lineHeight="1" letterSpacing="-0.02em" color="var(--merchant-text)">
                    {score}
                </Text>
                <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em" color={color} mt={1}>
                    {label}
                </Text>
            </Flex>
        </Box>
    );
};

const HealthTile = ({
    icon,
    label,
    value,
    percent,
    color,
    loading,
    live,
}: {
    icon: any;
    label: string;
    value: number;
    percent?: number;
    color: string;
    loading: boolean;
    live?: boolean;
}) => {
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        if (loading || percent === undefined) return;
        const target = percent > 0 ? Math.max(percent, 4) : 0;
        const timer = setTimeout(() => setWidth(target), 200);
        return () => clearTimeout(timer);
    }, [percent, loading]);

    return (
        <Box
            p={3}
            border="1px solid"
            borderColor="var(--merchant-border)"
            borderRadius="16px"
            bg="var(--merchant-surface-alt)"
            transition="all 0.2s ease"
            _hover={{ borderColor: color, transform: "translateY(-2px)" }}
        >
            <HStack spacing={2} mb={2}>
                <Icon as={icon} boxSize={3.5} color={color} />
                <Text fontSize="xs" fontWeight="600" color="var(--merchant-text-muted)" noOfLines={1}>
                    {label}
                </Text>
            </HStack>
            {loading ? (
                <Skeleton h="24px" w="40px" borderRadius="md" />
            ) : (
                <HStack spacing={2} align="center">
                    <Text fontSize="xl" fontWeight="800" lineHeight="1.1" color="var(--merchant-text)">
                        {formatNumber(value)}
                    </Text>
                    {live && value > 0 ? (
                        <Box
                            w="7px"
                            h="7px"
                            borderRadius="full"
                            bg={color}
                            color={color}
                            animation={`${merchantPulse} 1.8s ease-out infinite`}
                        />
                    ) : null}
                </HStack>
            )}
            {percent !== undefined ? (
                <Box mt={2.5} h="5px" borderRadius="full" bg="var(--merchant-surface-soft)" overflow="hidden">
                    <Box
                        h="full"
                        w={`${width}%`}
                        borderRadius="full"
                        bg={color}
                        transition="width 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
                    />
                </Box>
            ) : (
                <Text mt={2} fontSize="10px" color="var(--merchant-text-muted)">
                    {value > 0 ? "Live right now" : "Nothing in progress"}
                </Text>
            )}
        </Box>
    );
};

const getStockMeta = (stock: number) => {
    if (stock <= 0) return { label: "Out of stock", tone: "danger" as Tone, color: dashboardPalette.danger };
    if (stock <= 5) return { label: "Low stock", tone: "warning" as Tone, color: dashboardPalette.warning };
    return { label: "In stock", tone: "success" as Tone, color: dashboardPalette.success };
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const SuperAdminDashboard = observer(() => {
    const router = useRouter();
    const { companyStore } = stores;
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [dashboardData, setDashboardData] = React.useState<DashboardState>({
        metrics: defaultMetrics,
        alerts: defaultAlerts,
        recentShops: [],
        recentProducts: [],
        recentOrders: [],
        notifications: [],
    });

    const fetchDashboard = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await companyStore.getSuperAdminDashboardSummary();
            const payload = response?.data || {};
            setDashboardData({
                metrics: {
                    ...defaultMetrics,
                    ...(payload.metrics || {}),
                },
                alerts: {
                    ...defaultAlerts,
                    ...(payload.alerts || {}),
                },
                recentShops: Array.isArray(payload.recentShops) ? payload.recentShops : [],
                recentProducts: Array.isArray(payload.recentProducts) ? payload.recentProducts : [],
                recentOrders: Array.isArray(payload.recentOrders) ? payload.recentOrders : [],
                notifications: Array.isArray(payload.notifications) ? payload.notifications : [],
            });
        } catch (loadError: any) {
            setError(loadError?.message || "Unable to load dashboard summary");
        } finally {
            setLoading(false);
        }
    }, [companyStore]);

    React.useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const { metrics, alerts } = dashboardData;

    /* Health score: 100 minus weighted penalties for the share of shops pending
       review, products low on stock and products still in draft. */
    const reviewPct = percentOf(metrics.pendingReviewShops, metrics.totalShops);
    const lowStockPct = percentOf(metrics.lowStockProducts, metrics.totalProducts);
    const draftPct = percentOf(metrics.draftProducts, metrics.totalProducts);
    const healthScore = Math.round(
        Math.max(0, Math.min(100, 100 - (reviewPct * 0.4 + lowStockPct * 0.4 + draftPct * 0.2) * 2))
    );

    const topStats = [
        {
            label: "Total Shops",
            value: formatNumber(metrics.totalShops),
            icon: FiShoppingBag,
            color: dashboardPalette.accentStrong,
            bg: "rgba(59, 130, 246, 0.12)",
        },
        {
            label: "Total Products",
            value: formatNumber(metrics.totalProducts),
            icon: FiBox,
            color: dashboardPalette.warning,
            bg: "rgba(224, 179, 91, 0.14)",
        },
        {
            label: "Active Users",
            value: formatNumber(metrics.activeUsers),
            icon: FiUsers,
            color: dashboardPalette.success,
            bg: "rgba(70, 201, 139, 0.14)",
        },
        {
            label: "Platform GMV",
            value: formatCurrency(metrics.grossMerchandiseValue),
            icon: FiActivity,
            color: dashboardPalette.info,
            bg: "rgba(139, 92, 246, 0.14)",
        },
    ];

    const secondaryStats = [
        {
            label: "Pending Review",
            value: formatNumber(metrics.pendingReviewShops),
            icon: FiClock,
            color: dashboardPalette.warning,
            bg: "rgba(224, 179, 91, 0.14)",
            href: "/dashboard/super-admin/shops",
        },
        {
            label: "Low Stock",
            value: formatNumber(metrics.lowStockProducts),
            icon: FiPackage,
            color: dashboardPalette.danger,
            bg: "rgba(239, 107, 107, 0.14)",
            href: "/dashboard/super-admin/products",
        },
        {
            label: "Categories",
            value: formatNumber(metrics.activeCategories),
            icon: FiLayers,
            color: dashboardPalette.success,
            bg: "rgba(70, 201, 139, 0.14)",
            href: "/dashboard/super-admin/categories",
        },
        {
            label: "Active Offers",
            value: formatNumber(metrics.activeOffers),
            icon: FiGift,
            color: dashboardPalette.accentStrong,
            bg: "rgba(59, 130, 246, 0.12)",
            href: "/dashboard/super-admin/offers",
        },
    ];

    const quickActions = [
        { label: "Shops", icon: FiShoppingBag, href: "/dashboard/super-admin/shops" },
        { label: "Products", icon: FiBox, href: "/dashboard/super-admin/products" },
        { label: "Categories", icon: FiLayers, href: "/dashboard/super-admin/categories" },
        { label: "Offers", icon: FiGift, href: "/dashboard/super-admin/offers" },
        { label: "Alerts", icon: FiBell, href: "/dashboard/super-admin/notifications" },
        { label: "Reviews", icon: FiCheckCircle, href: "/dashboard/super-admin/shops" },
    ];

    const activity: ActivityItem[] = [
        ...dashboardData.recentShops.slice(0, 3).map((shop: any): ActivityItem => ({
            key: `shop-${shop._id}`,
            icon: FiShoppingBag,
            iconColor: dashboardPalette.accentStrong,
            iconBg: "rgba(59, 130, 246, 0.12)",
            title: `New shop: ${shop.name || "Untitled Shop"}`,
            subtitle: `${toStatusLabel(shop.reviewStatus)} review · ${formatRelativeTime(shop.createdAt)}`,
            badgeTone: shop.reviewStatus === "approved" ? "success" : "accent",
            badgeLabel: toStatusLabel(shop.reviewStatus),
        })),
        ...dashboardData.recentOrders.slice(0, 2).map((order: any): ActivityItem => ({
            key: `order-${order._id}`,
            icon: FiShoppingCart,
            iconColor: dashboardPalette.success,
            iconBg: "rgba(70, 201, 139, 0.14)",
            title: `Order ${order.orderId || order._id}`,
            subtitle: `${order.company?.name || "Unknown shop"} · ${formatRelativeTime(order.createdAt)}`,
            badgeTone: order.orderStatus === "cancelled" ? "danger" : "soft",
            badgeLabel: toStatusLabel(order.orderStatus),
        })),
        ...dashboardData.notifications.slice(0, 1).map((notification: any): ActivityItem => ({
            key: `notification-${notification._id}`,
            icon: FiAlertTriangle,
            iconColor: dashboardPalette.danger,
            iconBg: "rgba(239, 107, 107, 0.14)",
            title: notification.title || "Untitled notification",
            subtitle: `${toStatusLabel(notification.priority)} priority · ${formatRelativeTime(notification.createdAt)}`,
            badgeTone: notification.isRead ? "soft" : "danger",
            badgeLabel: notification.isRead ? "Read" : "Unread",
        })),
    ];

    const unreadCount = Number(alerts.unreadNotifications || 0);

    return (
        <MerchantPageShell>
            {/* Header: slim single row on mobile, chips + refresh on desktop */}
            <MerchantPageHeader
                icon={FiShield}
                title="Super Admin"
                description="Platform overview across shops, products, users and orders"
                mobileActions={
                    <>
                        <Box position="relative">
                            <IconButton
                                aria-label="Notifications"
                                icon={<FiBell />}
                                size="sm"
                                w="36px"
                                h="36px"
                                onClick={() => router.push("/dashboard/super-admin/notifications")}
                                {...merchantGhostButtonProps}
                            />
                            {!loading && unreadCount > 0 ? (
                                <Flex
                                    position="absolute"
                                    top="-4px"
                                    right="-4px"
                                    minW="16px"
                                    h="16px"
                                    px={1}
                                    align="center"
                                    justify="center"
                                    borderRadius="full"
                                    bg={dashboardPalette.danger}
                                    color="white"
                                    fontSize="10px"
                                    fontWeight="700"
                                    pointerEvents="none"
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Flex>
                            ) : null}
                        </Box>
                        <IconButton
                            aria-label="Refresh dashboard"
                            icon={
                                <Icon
                                    as={FiRefreshCw}
                                    animation={loading ? `${merchantSpin} 1s linear infinite` : undefined}
                                />
                            }
                            size="sm"
                            w="36px"
                            h="36px"
                            onClick={fetchDashboard}
                            isDisabled={loading}
                            {...merchantGhostButtonProps}
                        />
                    </>
                }
                badges={
                    <>
                        <AttentionChip
                            icon={FiClock}
                            label="Moderation"
                            count={alerts.moderationQueue}
                            color={dashboardPalette.warning}
                            bg="rgba(224, 179, 91, 0.14)"
                            loading={loading}
                            onClick={() => router.push("/dashboard/super-admin/shops")}
                        />
                        <AttentionChip
                            icon={FiBell}
                            label="Unread"
                            count={alerts.unreadNotifications}
                            color={dashboardPalette.danger}
                            bg="rgba(239, 107, 107, 0.14)"
                            loading={loading}
                            onClick={() => router.push("/dashboard/super-admin/notifications")}
                        />
                    </>
                }
                actions={
                    <Button
                        size="sm"
                        onClick={fetchDashboard}
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
                }
            />

            {/* Error */}
            {error ? (
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
                                <Text fontSize="md" fontWeight="700" color="var(--merchant-text)">
                                    Dashboard summary failed to load
                                </Text>
                                <Text fontSize="sm" color="var(--merchant-text-muted)" mt={0.5}>
                                    {error}
                                </Text>
                            </Box>
                        </HStack>
                        <Button size="sm" onClick={fetchDashboard} {...merchantGhostButtonProps}>
                            Retry
                        </Button>
                    </Flex>
                </MerchantPanel>
            ) : null}

            {/* Primary KPIs */}
            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
                {topStats.map((stat, index) => (
                    <Box key={stat.label} animation={merchantFadeUp(60 + index * 60)}>
                        <MerchantStatCard
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            iconColor={stat.color}
                            iconBg={stat.bg}
                            variant="panel"
                            isLoading={loading}
                        />
                    </Box>
                ))}
            </SimpleGrid>

            {/* Secondary metrics */}
            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }}>
                {secondaryStats.map((stat, index) => (
                    <Box key={stat.label} animation={merchantFadeUp(320 + index * 50)}>
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

            {/* Activity + side column */}
            <Box
                display="grid"
                gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 1.5fr) minmax(0, 1fr)" }}
                gap={{ base: 4, md: 6 }}
                mb={{ base: 4, md: 6 }}
            >
                <MerchantPanel animation={merchantFadeUp(520)}>
                    <MerchantSectionHeader
                        title="Recent Activity"
                        subtitle="Latest shops, orders and alerts"
                        right={
                            <MerchantBadge tone="soft" fontSize="xs" px={2.5} py={0.5}>
                                {loading ? "Loading" : `${activity.length} entries`}
                            </MerchantBadge>
                        }
                    />
                    {loading ? (
                        <Stack spacing={2}>
                            {[0, 1, 2, 3].map((i) => (
                                <Flex key={i} align="center" gap={3} p={3}>
                                    <Skeleton w="40px" h="40px" borderRadius="12px" flexShrink={0} />
                                    <Box flex="1">
                                        <Skeleton h="14px" w="60%" borderRadius="md" mb={2} />
                                        <Skeleton h="12px" w="40%" borderRadius="md" />
                                    </Box>
                                    <Skeleton h="22px" w="64px" borderRadius="full" />
                                </Flex>
                            ))}
                        </Stack>
                    ) : activity.length === 0 ? (
                        <EmptyState icon={FiActivity} text="No recent activity found yet." />
                    ) : (
                        <Stack spacing={1} mx={{ base: -1, md: -2 }}>
                            {activity.map((item, index) => (
                                <ActivityRow key={item.key} item={item} index={index} />
                            ))}
                        </Stack>
                    )}
                </MerchantPanel>

                <Stack spacing={{ base: 4, md: 6 }} minW={0}>
                    {/* Platform health: ring + tiles */}
                    <MerchantPanel animation={merchantFadeUp(580)}>
                        <MerchantSectionHeader title="Platform Health" subtitle="Overall score and key signals" mb={3} />
                        <Flex direction="column" align="center" gap={4}>
                            <HealthGauge score={healthScore} loading={loading} />
                            <SimpleGrid columns={2} spacing={3} w="full">
                                <HealthTile
                                    icon={FiClock}
                                    label="Pending review"
                                    value={metrics.pendingReviewShops}
                                    percent={reviewPct}
                                    color={metrics.pendingReviewShops > 0 ? dashboardPalette.warning : dashboardPalette.success}
                                    loading={loading}
                                />
                                <HealthTile
                                    icon={FiPackage}
                                    label="Low stock"
                                    value={metrics.lowStockProducts}
                                    percent={lowStockPct}
                                    color={metrics.lowStockProducts > 0 ? dashboardPalette.danger : dashboardPalette.success}
                                    loading={loading}
                                />
                                <HealthTile
                                    icon={FiShoppingCart}
                                    label="Orders in progress"
                                    value={metrics.inFlightOrders}
                                    color={dashboardPalette.accentStrong}
                                    loading={loading}
                                    live
                                />
                                <HealthTile
                                    icon={FiFileText}
                                    label="Catalog drafts"
                                    value={metrics.draftProducts}
                                    percent={draftPct}
                                    color={metrics.draftProducts > 0 ? dashboardPalette.accentStrong : dashboardPalette.success}
                                    loading={loading}
                                />
                            </SimpleGrid>
                        </Flex>
                    </MerchantPanel>

                    {/* <MerchantPanel animation={merchantFadeUp(640)}>
                        <MerchantSectionHeader title="Quick Actions" mb={3} />
                        <SimpleGrid columns={3} spacing={{ base: 2, md: 3 }}>
                            {quickActions.map((action) => (
                                <MerchantActionTile
                                    key={action.label}
                                    icon={action.icon}
                                    label={action.label}
                                    onClick={() => router.push(action.href)}
                                />
                            ))}
                        </SimpleGrid>
                    </MerchantPanel> */}
                </Stack>
            </Box>

            {/* Catalog watch */}
            <MerchantPanel animation={merchantFadeUp(700)}>
                <MerchantSectionHeader
                    title="Catalog Watch"
                    subtitle="Stock levels of the latest products"
                    right={
                        <MerchantBadge tone="soft" fontSize="xs" px={2.5} py={0.5}>
                            {loading ? "Loading" : `${dashboardData.recentProducts.length} latest`}
                        </MerchantBadge>
                    }
                />
                {loading ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={3}>
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} h="68px" borderRadius="16px" />
                        ))}
                    </SimpleGrid>
                ) : dashboardData.recentProducts.length === 0 ? (
                    <EmptyState icon={FiPackage} text="No recent products found." />
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={3}>
                        {dashboardData.recentProducts.map((product: any, index: number) => {
                            const stock = Number(product.stock || 0);
                            const meta = getStockMeta(stock);
                            return (
                                <Flex
                                    key={product._id}
                                    align="center"
                                    gap={3}
                                    p={3}
                                    border="1px solid"
                                    borderColor="var(--merchant-border)"
                                    borderRadius="16px"
                                    bg="var(--merchant-surface)"
                                    transition="all 0.2s ease"
                                    _hover={{ borderColor: meta.color, transform: "translateY(-2px)" }}
                                    animation={merchantFadeUp(index * 40)}
                                >
                                    <Flex
                                        align="center"
                                        justify="center"
                                        w="40px"
                                        h="40px"
                                        borderRadius="12px"
                                        bg="var(--merchant-surface-alt)"
                                        flexShrink={0}
                                    >
                                        <Icon as={FiPackage} color={meta.color} />
                                    </Flex>
                                    <Box flex="1" minW={0}>
                                        <Text fontSize="sm" fontWeight="600" color="var(--merchant-text)" noOfLines={1}>
                                            {product.name || "Untitled Product"}
                                        </Text>
                                        <Text fontSize="xs" color="var(--merchant-text-muted)">
                                            {formatNumber(stock)} in stock
                                        </Text>
                                    </Box>
                                    <MerchantBadge tone={meta.tone} fontSize="10px" px={2.5} py={1} flexShrink={0}>
                                        {meta.label}
                                    </MerchantBadge>
                                </Flex>
                            );
                        })}
                    </SimpleGrid>
                )}
            </MerchantPanel>
        </MerchantPageShell>
    );
});

export default SuperAdminDashboard;