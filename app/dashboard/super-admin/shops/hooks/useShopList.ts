import { useState, useCallback, useEffect } from "react";
import stores from "../../../../store/stores";

export const useShopList = () => {
    const { companyStore } = stores;
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalShops, setTotalShops] = useState(0);

    const fetchShops = useCallback((page: number) => {
        setLoading(true);
        companyStore
            .getAllShops({ limit: 10, page: page, shopStatus: "all", includeInactive: true })
            .then((res: any) => {
                if (res?.data?.data) {
                    setShops(res.data.data);
                    setTotalPages(res.data.totalPages || 1);
                    setTotalShops(res.data.total || 0);
                }
            })
            .catch(() => {
                // Error handling
            })
            .finally(() => {
                setLoading(false);
            });
    }, [companyStore]);

    useEffect(() => {
        fetchShops(currentPage);
    }, [fetchShops, currentPage]);

    return {
        shops,
        loading,
        currentPage,
        totalPages,
        totalShops,
        setCurrentPage,
        fetchShops
    };
};
