import { useState, useCallback, useEffect } from "react";
import stores from "../../../../store/stores";

export const useProductList = () => {
    const { shopStore } = stores;
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = useCallback((page: number) => {
        setLoading(true);
        shopStore
            .getAllProducts({ limit: 10, page, company: null })
            .then((res: any) => {
                if (res?.data) {
                    setProducts(res.data.products || []);
                    setTotalProducts(res.data.total || 0);
                    setTotalPages(res.data.totalPages || 1);
                }
            })
            .catch(() => {
                // Error handling handled by store or ignored for now
            })
            .finally(() => {
                setLoading(false);
            });
    }, [shopStore]);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    return {
        products,
        loading,
        currentPage,
        totalPages,
        totalProducts,
        setCurrentPage,
        fetchProducts
    };
};
