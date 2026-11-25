import { useState, useCallback, useEffect, useRef } from "react";
import stores from "../../../../store/stores";

export interface ProductListFilterParams {
    search?: string;
    category?: string;
    company?: string;
    stockFilter?: "all" | "in_stock" | "low_stock" | "out_of_stock";
}

export const useProductList = () => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [filters, setFilters] = useState<ProductListFilterParams>({});
    const prevPayloadRef = useRef<string>("");

    const fetchProducts = useCallback(
        (page: number, customFilters?: ProductListFilterParams) => {
            const activeFilters = customFilters !== undefined ? customFilters : filters;
            setLoading(true);

            const payload: any = {
                limit: 10,
                page,
                company: activeFilters.company && activeFilters.company !== "all" ? activeFilters.company : null,
            };

            if (activeFilters.search && activeFilters.search.trim()) {
                payload.search = activeFilters.search.trim();
            }

            if (activeFilters.category && activeFilters.category !== "all") {
                payload.category = activeFilters.category;
            }

            if (activeFilters.stockFilter && activeFilters.stockFilter !== "all") {
                const availabilityMap: Record<string, string> = {
                    in_stock: "inStock",
                    low_stock: "lowStock",
                    out_of_stock: "outOfStock",
                };
                payload.filters = {
                    ...(payload.filters || {}),
                    availability: [availabilityMap[activeFilters.stockFilter]],
                };
            }

            shopStore
                .getAllProducts(payload, true)
                .then((res: any) => {
                    if (res?.data) {
                        setProducts(res.data.products || []);
                        setTotalProducts(res.data.total || 0);
                        setTotalPages(res.data.totalPages || 1);
                    }
                })
                .catch(() => {
                    // Handled gracefully
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [shopStore, filters.search, filters.category, filters.company, filters.stockFilter]
    );

    useEffect(() => {
        const payloadKey = `${currentPage}_${filters.search || ""}_${filters.category || ""}_${filters.company || ""}_${filters.stockFilter || ""}`;
        if (prevPayloadRef.current !== payloadKey) {
            prevPayloadRef.current = payloadKey;
            fetchProducts(currentPage);
        }
    }, [currentPage, filters.search, filters.category, filters.company, filters.stockFilter, fetchProducts]);

    return {
        products,
        loading,
        currentPage,
        totalPages,
        totalProducts,
        filters,
        setFilters,
        setCurrentPage,
        fetchProducts,
    };
};
