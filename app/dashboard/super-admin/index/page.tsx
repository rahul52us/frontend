"use client";

import React from "react";
import { Box, Button, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import {
    FiActivity,
    FiAlertTriangle,
    FiBox,
    FiClock,
    FiGift,
    FiLayers,
    FiPackage,
    FiShield,
    FiShoppingBag,
    FiTrendingUp,
    FiUsers,
} from "react-icons/fi";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import stores from "../../../store/stores";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
    MerchantBadge,
    merchantGhostButtonProps,
    MerchantHeroSection,
    MerchantPageShell,
    MerchantPanel,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

type DashboardMetrics = {
    totalShops: number;
    activeShops: number;
    pendingReviewShops: number;
    changesRequestedShops: number;
    rejectedShops: number;
    suspendedShops: number;
    newShopsLast30Days: number;
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    discontinuedProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    featuredProducts: number;
    newProductsLast30Days: number;
    totalUsers: number;
    activeUsers: number;
    buyerUsers: number;
    sellerUsers: number;
    adminUsers: number;
    newUsersLast30Days: number;
    totalOrders: number;
    pendingOrders: number;
    inFlightOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    grossMerchandiseValue: number;
    deliveredValue: number;
    totalCategories: number;
    activeCategories: number;
    rootCategories: number;
    featuredCategories: number;
    totalOffers: number;
    activeOffers: number;
    defaultOffers: number;
    unreadNotifications: number;
};

type DashboardAlerts = {
    moderationQueue: number;
    lowStockProducts: number;
    pendingOrders: number;
    inFlightOrders: number;
    unreadNotifications: number;
};

type DashboardState = {
    metrics: DashboardMetrics;
    alerts: DashboardAlerts;
    recentShops: any[];
    recentProducts: any[];
    recentOrders: any[];
    notifications: any[];
};

const defaultMetrics: DashboardMetrics = {
    totalShops: 0,
    activeShops: 0,
    pendingReviewShops: 0,
    changesRequestedShops: 0,
    rejectedShops: 0,
    suspendedShops: 0,
    newShopsLast30Days: 0,
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    discontinuedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
    newProductsLast30Days: 0,
    totalUsers: 0,
    activeUsers: 0,
    buyerUsers: 0,
    sellerUsers: 0,
    adminUsers: 0,
    newUsersLast30Days: 0,
    totalOrders: 0,
    pendingOrders: 0,
    inFlightOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    grossMerchandiseValue: 0,
    deliveredValue: 0,
    totalCategories: 0,
    activeCategories: 0,
    rootCategories: 0,
    featuredCategories: 0,
    totalOffers: 0,
    activeOffers: 0,
    defaultOffers: 0,
    unreadNotifications: 0,
};

const defaultAlerts: DashboardAlerts = {
    moderationQueue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    inFlightOrders: 0,
    unreadNotifications: 0,
};

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
    const topStats = [
        {
            label: "Total Shops",
            value: formatNumber(metrics.totalShops),
            icon: FiShoppingBag,
            color: dashboardPalette.accentStrong,
            bg: "rgba(214, 183, 114, 0.10)",
        },
        {
            label: "Total Products",
            value: formatNumber(metrics.totalProducts),
            icon: FiBox,
            color: dashboardPalette.warning,
            bg: "rgba(224, 179, 91, 0.10)",
        },
        {
            label: "Active Users",
            value: formatNumber(metrics.activeUsers),
            icon: FiUsers,
            color: dashboardPalette.success,
            bg: "rgba(70, 201, 139, 0.10)",
        },
        {
            label: "Platform GMV",
            value: formatCurrency(metrics.grossMerchandiseValue),
            icon: FiActivity,
            color: dashboardPalette.danger,
            bg: "rgba(239, 107, 107, 0.10)",
        },
    ];

    return (
        <MerchantPageShell>
            <MerchantHeroSection
                icon={FiShield}
                primaryBadge="Platform Control"
                title="Super Admin Dashboard"
                description="Live platform intelligence for moderation, catalog health, and operations. Metrics refresh from real data across shops, products, users, and orders."
                rightContent={
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "360px" }}>
                        <MerchantStatCard
                            label="Moderation Queue"
                            value={loading ? "--" : formatNumber(alerts.moderationQueue)}
                            icon={FiClock}
                            iconColor={dashboardPalette.warning}
                            iconBg="rgba(224, 179, 91, 0.10)"
                        />
                        <MerchantStatCard
                            label="Unread Alerts"
                            value={loading ? "--" : formatNumber(alerts.unreadNotifications)}
                            icon={FiAlertTriangle}
                            iconColor={alerts.unreadNotifications > 0 ? dashboardPalette.danger : dashboardPalette.textMuted}
                            iconBg="rgba(239, 107, 107, 0.10)"
                        />
                    </SimpleGrid>
                }
            />

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4} mb={6}>
                {topStats.map((stat, index) => (
                    <MerchantStatCard
                        key={index}
                        label={stat.label}
                        value={loading ? "--" : stat.value}
                        valueColor={stat.color}
                        icon={stat.icon}
                        iconColor={stat.color}
                        iconBg={stat.bg}
                        variant="panel"
                    />
                ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4} mb={6}>
                <MerchantStatCard
                    label="Pending Review"
                    value={loading ? "--" : formatNumber(metrics.pendingReviewShops)}
                    valueColor={dashboardPalette.warning}
                    icon={FiClock}
                    iconColor={dashboardPalette.warning}
                    iconBg="rgba(224, 179, 91, 0.10)"
                    variant="panel"
                />
                <MerchantStatCard
                    label="Low Stock Products"
                    value={loading ? "--" : formatNumber(metrics.lowStockProducts)}
                    valueColor={dashboardPalette.danger}
                    icon={FiPackage}
                    iconColor={dashboardPalette.danger}
                    iconBg="rgba(239, 107, 107, 0.10)"
                    variant="panel"
                />
                <MerchantStatCard
                    label="Active Categories"
                    value={loading ? "--" : formatNumber(metrics.activeCategories)}
                    icon={FiLayers}
                    iconColor={dashboardPalette.success}
                    iconBg="rgba(70, 201, 139, 0.10)"
                    valueColor={dashboardPalette.success}
                    variant="panel"
                />
                <MerchantStatCard
                    label="Active Offers"
                    value={loading ? "--" : formatNumber(metrics.activeOffers)}
                    icon={FiGift}
                    iconColor={dashboardPalette.accentStrong}
                    iconBg="rgba(214, 183, 114, 0.10)"
                    valueColor={dashboardPalette.accentStrong}
                    variant="panel"
                />
            </SimpleGrid>

            {error ? (
                <MerchantPanel mb={6}>
                    <HStack justify="space-between" align="start" spacing={4}>
                        <Box>
                            <Text fontSize="lg" fontWeight="700" color={dashboardPalette.text}>
                                Dashboard summary failed to load
                            </Text>
                            <Text color={dashboardPalette.textMuted} mt={1}>
                                {error}
                            </Text>
                        </Box>
                        <Button onClick={fetchDashboard} {...merchantGhostButtonProps}>
                            Retry
                        </Button>
                    </HStack>
                </MerchantPanel>
            ) : null}

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <MerchantPanel minH="260px">
                    <HStack justify="space-between" align="center" mb={3}>
                        <Text fontSize="xl" fontWeight="700" color={dashboardPalette.text}>
                            Recent Activity
                        </Text>
                        <MerchantBadge tone="soft">
                            {loading
                                ? "Loading"
                                : `${dashboardData.recentShops.length + dashboardData.recentOrders.length + dashboardData.notifications.length} entries`}
                        </MerchantBadge>
                    </HStack>
                    {loading ? (
                        <Text color={dashboardPalette.textMuted}>Loading platform events...</Text>
                    ) : dashboardData.recentShops.length === 0 && dashboardData.recentOrders.length === 0 && dashboardData.notifications.length === 0 ? (
                        <Text color={dashboardPalette.textMuted}>
                            No recent activity found yet.
                        </Text>
                    ) : (
                        <Stack spacing={3}>
                            {dashboardData.recentShops.slice(0, 3).map((shop: any) => (
                                <Box key={`shop-${shop._id}`} borderWidth="1px" borderColor={dashboardPalette.borderStrong} borderRadius="16px" p={3}>
                                    <HStack justify="space-between" align="start">
                                        <Box>
                                            <Text color={dashboardPalette.text} fontWeight="600">
                                                New Shop: {shop.name || "Untitled Shop"}
                                            </Text>
                                            <Text color={dashboardPalette.textMuted} fontSize="sm">
                                                {toStatusLabel(shop.reviewStatus)} review | {formatRelativeTime(shop.createdAt)}
                                            </Text>
                                        </Box>
                                        <MerchantBadge tone={shop.reviewStatus === "approved" ? "success" : "accent"}>
                                            {toStatusLabel(shop.reviewStatus)}
                                        </MerchantBadge>
                                    </HStack>
                                </Box>
                            ))}
                            {dashboardData.recentOrders.slice(0, 2).map((order: any) => (
                                <Box key={`order-${order._id}`} borderWidth="1px" borderColor={dashboardPalette.borderStrong} borderRadius="16px" p={3}>
                                    <HStack justify="space-between" align="start">
                                        <Box>
                                            <Text color={dashboardPalette.text} fontWeight="600">
                                                Order {order.orderId || order._id}
                                            </Text>
                                            <Text color={dashboardPalette.textMuted} fontSize="sm">
                                                {order.company?.name || "Unknown shop"} | {formatRelativeTime(order.createdAt)}
                                            </Text>
                                        </Box>
                                        <MerchantBadge tone={order.orderStatus === "cancelled" ? "danger" : "soft"}>
                                            {toStatusLabel(order.orderStatus)}
                                        </MerchantBadge>
                                    </HStack>
                                </Box>
                            ))}
                            {dashboardData.notifications.slice(0, 1).map((notification: any) => (
                                <Box key={`notification-${notification._id}`} borderWidth="1px" borderColor={dashboardPalette.borderStrong} borderRadius="16px" p={3}>
                                    <HStack justify="space-between" align="start">
                                        <Box>
                                            <Text color={dashboardPalette.text} fontWeight="600">
                                                Alert: {notification.title || "Untitled notification"}
                                            </Text>
                                            <Text color={dashboardPalette.textMuted} fontSize="sm">
                                                {toStatusLabel(notification.priority)} priority | {formatRelativeTime(notification.createdAt)}
                                            </Text>
                                        </Box>
                                        <MerchantBadge tone={notification.isRead ? "soft" : "danger"}>
                                            {notification.isRead ? "Read" : "Unread"}
                                        </MerchantBadge>
                                    </HStack>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </MerchantPanel>

                <MerchantPanel minH="260px">
                    <Text fontSize="xl" fontWeight="700" color={dashboardPalette.text} mb={3}>
                        Platform Health
                    </Text>
                    <Stack spacing={3}>
                        <HStack justify="space-between">
                            <Text color={dashboardPalette.textMuted}>Shops Pending Review</Text>
                            <MerchantBadge tone={metrics.pendingReviewShops > 0 ? "accent" : "soft"}>
                                {loading ? "--" : formatNumber(metrics.pendingReviewShops)}
                            </MerchantBadge>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color={dashboardPalette.textMuted}>Products Low Stock</Text>
                            <MerchantBadge tone={metrics.lowStockProducts > 0 ? "danger" : "success"}>
                                {loading ? "--" : formatNumber(metrics.lowStockProducts)}
                            </MerchantBadge>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color={dashboardPalette.textMuted}>Orders In Progress</Text>
                            <MerchantBadge tone={metrics.inFlightOrders > 0 ? "accent" : "soft"}>
                                {loading ? "--" : formatNumber(metrics.inFlightOrders)}
                            </MerchantBadge>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color={dashboardPalette.textMuted}>Catalog Drafts</Text>
                            <MerchantBadge tone={metrics.draftProducts > 0 ? "accent" : "soft"}>
                                {loading ? "--" : formatNumber(metrics.draftProducts)}
                            </MerchantBadge>
                        </HStack>
                    </Stack>

                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mt={5}>
                        <Button leftIcon={<FiTrendingUp />} onClick={() => router.push("/dashboard/super-admin/shops")} {...merchantGhostButtonProps}>
                            Shops
                        </Button>
                        <Button leftIcon={<FiBox />} onClick={() => router.push("/dashboard/super-admin/products")} {...merchantGhostButtonProps}>
                            Products
                        </Button>
                        <Button leftIcon={<FiLayers />} onClick={() => router.push("/dashboard/super-admin/categories")} {...merchantGhostButtonProps}>
                            Categories
                        </Button>
                        <Button leftIcon={<FiGift />} onClick={() => router.push("/dashboard/super-admin/offers")} {...merchantGhostButtonProps}>
                            Offers
                        </Button>
                        <Button leftIcon={<FiUsers />} onClick={() => router.push("/dashboard/super-admin/notifications")} {...merchantGhostButtonProps}>
                            Notifications
                        </Button>
                        <Button leftIcon={<FiShoppingBag />} onClick={() => router.push("/dashboard/super-admin/shops")} {...merchantGhostButtonProps}>
                            Reviews
                        </Button>
                    </SimpleGrid>
                </MerchantPanel>
            </SimpleGrid>

            <MerchantPanel mt={6}>
                <HStack justify="space-between" align="center" mb={3}>
                    <Text fontSize="xl" fontWeight="700" color={dashboardPalette.text}>
                        Catalog Watch
                    </Text>
                    <MerchantBadge tone="soft">
                        {loading ? "Loading" : `${dashboardData.recentProducts.length} latest products`}
                    </MerchantBadge>
                </HStack>
                {loading ? (
                    <Text color={dashboardPalette.textMuted}>Loading recent products...</Text>
                ) : dashboardData.recentProducts.length === 0 ? (
                    <Text color={dashboardPalette.textMuted}>No recent products found.</Text>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
                        {dashboardData.recentProducts.map((product: any) => (
                            <MerchantStatCard
                                key={product._id}
                                label={product.name || "Untitled Product"}
                                value={`${formatNumber(product.stock || 0)} stock`}
                                valueColor={
                                    Number(product.stock || 0) <= 0
                                        ? dashboardPalette.danger
                                        : Number(product.stock || 0) <= 5
                                            ? dashboardPalette.warning
                                            : dashboardPalette.text
                                }
                                icon={FiPackage}
                                iconColor={dashboardPalette.accentStrong}
                                iconBg="rgba(214, 183, 114, 0.10)"
                                variant="panel"
                            />
                        ))}
                    </SimpleGrid>
                )}
            </MerchantPanel>
        </MerchantPageShell>
    );
});

export default SuperAdminDashboard;


