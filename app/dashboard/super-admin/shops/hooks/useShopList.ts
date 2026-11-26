import { useState, useCallback, useEffect } from "react";
import stores from "../../../../store/stores";

export const useShopList = () => {
    const { companyStore } = stores;
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalShops, setTotalShops] = useState(0);
    const [reviewStatus, setReviewStatus] = useState("pending");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchShops = useCallback(
        (
            page: number,
            nextReviewStatus: string = reviewStatus,
            overrideStart: string = startDate,
            overrideEnd: string = endDate
        ) => {
            setLoading(true);
            const payload: any = {
                limit: 10,
                page: page,
                shopStatus: "all",
                reviewStatus: nextReviewStatus,
                includeInactive: true,
            };
            if (overrideStart) payload.startDate = overrideStart;
            if (overrideEnd) payload.endDate = overrideEnd;

            companyStore
                .getAllShops(payload, true)
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
        },
        [companyStore, reviewStatus, startDate, endDate]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [reviewStatus, startDate, endDate]);

    useEffect(() => {
        fetchShops(currentPage, reviewStatus, startDate, endDate);
    }, [fetchShops, currentPage, reviewStatus, startDate, endDate]);

    return {
        shops,
        loading,
        currentPage,
        totalPages,
        totalShops,
        reviewStatus,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        setReviewStatus,
        setCurrentPage,
        fetchShops,
    };
};


