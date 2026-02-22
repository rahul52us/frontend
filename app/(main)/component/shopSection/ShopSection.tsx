import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Container,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import ShopCard from "./element/ShopCard";
import ShopCardSkeleton from "./ShopSkeletonCard/ShowSkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";

const MotionSimpleGrid = motion(SimpleGrid);
const MotionBox = motion(Box);

const tablePageLimit = 8;

interface ShopSectionProps {
  searchQuery?: string;
  activeCategory?: string | null;
}

const ShopSection = observer(({ searchQuery = "", activeCategory = null }: ShopSectionProps) => {
  const {
    shopStore: { getAllShops, shop },
    auth: { openNotification },
  } = stores;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const applyGetAllShops = useCallback(
    async ({
      page = 1,
      limit = tablePageLimit,
      search = "",
      category = null,
      append = false,
    }: { page?: number, limit?: number, search?: string, category?: string | null, append?: boolean }) => {
      try {
        await getAllShops({ page, limit, search, category: category === 'All Shops' ? null : category, append });
      } catch (err: any) {
        openNotification({
          title: "Failed to get Shops",
          message: err.message,
          type: "error",
        });
      }
    },
    [getAllShops, openNotification]
  );

  useEffect(() => {
    setCurrentPage(1);
    applyGetAllShops({
      page: 1,
      limit: tablePageLimit,
      search: debouncedSearchQuery,
      category: activeCategory,
      append: false,
    });
  }, [debouncedSearchQuery, activeCategory, applyGetAllShops]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage > (shop.totalPages || 1)) return;

    setCurrentPage(nextPage);
    applyGetAllShops({
      page: nextPage,
      search: debouncedSearchQuery,
      category: activeCategory,
      append: true,
    });
  }, [currentPage, shop.totalPages, applyGetAllShops, debouncedSearchQuery, activeCategory]);

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    if (!currentLoadMoreRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shop.loading) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentLoadMoreRef);
    return () => observer.disconnect();
  }, [handleLoadMore, shop.loading]);

  const shops = shop?.data || [];
  const loading = shop?.loading && currentPage === 1;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box position="relative">
      <Container maxW="7xl" px={0}>
        <AnimatePresence>
          {!loading && (
            <MotionSimpleGrid
              columns={{ base: 1, sm: 2, md: 3 }}
              spacing={{ base: 6, md: 10 }}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {shops.map((shop: any, index: number) => (
                <MotionBox key={shop._id || index} variants={item}>
                  <ShopCard shop={shop} />
                </MotionBox>
              ))}
            </MotionSimpleGrid>
          )}
        </AnimatePresence>

        {loading && (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 10 }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ShopCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        )}

        {shops.length === 0 && !loading && (
          <Box py={20} textAlign="center">
            <Text fontSize="lg" color="gray.500" fontWeight="500">No shops found matching your criteria.</Text>
          </Box>
        )}

        <Box ref={loadMoreRef} h="10px" />

        {shop.loading && currentPage > 1 && (
          <Box py={8} textAlign="center">
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              display="inline-block"
              w="24px"
              h="24px"
              border="2px solid"
              borderColor="purple.500"
              borderTopColor="transparent"
              borderRadius="full"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
});

export default ShopSection;
