import { useState, useCallback, useEffect } from "react";
import stores from "../../../../store/stores";

export interface ShopStats {
    totalShops: number;
    pendingReviewShops: number;
    approvedShops: number;
    changesRequestedShops: number;
    rejectedShops: number;
    activeShops: number;
}

const defaultStats: ShopStats = {
    totalShops: 0,
    pendingReviewShops: 0,
    approvedShops: 0,
    changesRequestedShops: 0,
    rejectedShops: 0,
    activeShops: 0,
};

export const useShopStats = () => {
    const { companyStore } = stores;
    const [stats, setStats] = useState<ShopStats>(defaultStats);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await companyStore.getShopStats();
            const payload = res?.data || res;
            if (payload) {
                setStats({
                    totalShops: Number(payload.totalShops || 0),
                    pendingReviewShops: Number(payload.pendingReviewShops || 0),
                    approvedShops: Number(payload.approvedShops || 0),
                    changesRequestedShops: Number(payload.changesRequestedShops || 0),
                    rejectedShops: Number(payload.rejectedShops || 0),
                    activeShops: Number(payload.activeShops || 0),
                });
            }
        } catch (err) {
            console.error("Failed to fetch shop stats:", err);
        } finally {
            setLoadingStats(false);
        }
    }, [companyStore]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loadingStats,
        fetchStats,
    };
};

