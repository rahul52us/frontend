import { useState, useCallback, useEffect } from "react";
import stores from "../../../../store/stores";

export interface ProductStats {
    totalProducts: number;
    withCategory: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    avgPrice: number;
}

const defaultStats: ProductStats = {
    totalProducts: 0,
    withCategory: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    avgPrice: 0,
};

export const useProductStats = (companyId?: string) => {
    const { shopStore } = stores;
    const [stats, setStats] = useState<ProductStats>(defaultStats);
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchStats = useCallback(async (customCompanyId?: string) => {
        const targetCompany = customCompanyId !== undefined ? customCompanyId : companyId;
        setLoadingStats(true);
        try {
            const res = await shopStore.getProductStats(targetCompany);
            const payload = res?.data || res;
            if (payload) {
                setStats({
                    totalProducts: Number(payload.totalProducts || 0),
                    withCategory: Number(payload.withCategory || 0),
                    inStock: Number(payload.inStock || 0),
                    lowStock: Number(payload.lowStock || 0),
                    outOfStock: Number(payload.outOfStock || 0),
                    avgPrice: Number(payload.avgPrice || 0),
                });
            }
        } catch (err) {
            console.error("Failed to fetch product stats:", err);
        } finally {
            setLoadingStats(false);
        }
    }, [shopStore, companyId]);

    useEffect(() => {
        fetchStats(companyId);
    }, [companyId, fetchStats]);

    return {
        stats,
        loadingStats,
        fetchStats,
    };
};

