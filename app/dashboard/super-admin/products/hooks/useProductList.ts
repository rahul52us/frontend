import { useState, useCallback, useEffect, useRef } from "react";
import stores from "../../../../store/stores";

export interface ProductListFilterParams {
    search?: string;
    category?: string;
    stockFilter?: "all" | "in_stock" | "low_stock" | "out_of_stock";
}

export const useProductList = (initialFilters: ProductListFilterParams = {}) => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [summary, setSummary] = useState<{
        total: number;
        inStock: number;
        featured: number;
        low: number;
    }>({
        total: 0,
        inStock: 0,
        featured: 0,
        low: 0,
    });

    const [filters, setFilters] = useState<ProductListFilterParams>(initialFilters);
    const prevPayloadRef = useRef<string>("");

    const fetchProducts = useCallback(
        (page: number, customFilters?: ProductListFilterParams) => {
            const activeFilters = customFilters !== undefined ? customFilters : filters;
            setLoading(true);

            const payload: any = {
                limit: 10,
                page,
                company: null,
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
                        if (res.data.summary) {
                            setSummary(res.data.summary);
                        }
                    }
                })
                .catch(() => {
                    // Handled gracefully
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [shopStore, filters]
    );

    useEffect(() => {
        const payloadKey = `${currentPage}_${filters.search || ""}_${filters.category || ""}_${filters.stockFilter || ""}`;
        if (prevPayloadRef.current !== payloadKey) {
            prevPayloadRef.current = payloadKey;
            fetchProducts(currentPage);
        }
    }, [fetchProducts, currentPage, filters]);

    return {
        products,
        loading,
        currentPage,
        totalPages,
        totalProducts,
        summary,
        filters,
        setFilters,
        setCurrentPage,
        fetchProducts,
    };
};
