export type DashboardMetrics = {
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

export type DashboardAlerts = {
    moderationQueue: number;
    lowStockProducts: number;
    pendingOrders: number;
    inFlightOrders: number;
    unreadNotifications: number;
};

export type DashboardState = {
    metrics: DashboardMetrics;
    alerts: DashboardAlerts;
    recentShops: any[];
    recentProducts: any[];
    recentOrders: any[];
    notifications: any[];
};

export const defaultMetrics: DashboardMetrics = {
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

export const defaultAlerts: DashboardAlerts = {
    moderationQueue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    inFlightOrders: 0,
    unreadNotifications: 0,
};