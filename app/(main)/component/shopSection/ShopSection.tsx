"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Center,
  Text,
  VStack,
  Container,
  Spinner,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import ShopCard from "./element/ShopCard";
import ShopCardSkeleton from "./ShopSkeletonCard/ShowSkeletonCard";
import { tablePageLimit } from "../../../component/config/utils/variable";

const MotionSimpleGrid = motion(SimpleGrid);
const MotionBox = motion(Box);

const ShopSection = observer(() => {
  const {
    shopStore: { getAllShops, shop },
    auth: { openNotification },
  } = stores;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const applyGetAllShops = useCallback(
    async ({
      page = 1,
      limit = tablePageLimit,
      search = "",
      append = false,
    }) => {
      try {
        await getAllShops({ page, limit, search, append });
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
      append: false,
    });
  }, [debouncedSearchQuery, applyGetAllShops]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage > (shop.totalPages || 1)) return;

    setCurrentPage(nextPage);
    applyGetAllShops({
      page: nextPage,
      search: debouncedSearchQuery,
      append: true,
    });
  }, [currentPage, shop.totalPages, applyGetAllShops, debouncedSearchQuery]);

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !shop.loading &&
          currentPage < (shop.totalPages || 1)
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [shop.loading, currentPage, shop.totalPages, handleLoadMore]);

  const shops = shop?.data || [];
  const totalPages = shop?.totalPages || 1;
  const loading = shop?.loading && currentPage === 1;
  const loadingMore = shop?.loading && currentPage > 1;
  const allLoaded = currentPage >= totalPages;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
  };

  return (
    <Box position="relative" pb={10}>
      <Container maxW="container.xl" px={0}>
        {/* Shop Cards Grid */}
        <AnimatePresence>
          {!loading && (
            <MotionSimpleGrid
              columns={{ base: 1, sm: 2, lg: 3 }}
              spacing={{ base: 6, md: 8 }}
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

        {/* Initial Skeleton */}
        {loading && (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ShopCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        )}

        {/* Empty State */}
        {!loading && shops.length === 0 && (
          <Center py={20} flexDirection="column">
            <Text fontSize="2xl" fontWeight="black" color="gray.300" mb={2}>
              No Shops Found
            </Text>
            <Text color="gray.500">Check back later for new arrivals! 🌟</Text>
          </Center>
        )}

        {/* Load More Indicator */}
        <Box ref={loadMoreRef} py={10}>
          {loadingMore && (
            <Center w="full">
              <VStack spacing={4}>
                <Spinner size="md" color="purple.500" thickness="3px" />
                <Text fontSize="xs" fontWeight="black" color="gray.400" letterSpacing="widest">
                  DISCOVERING MORE
                </Text>
              </VStack>
            </Center>
          )}

          {!loading && allLoaded && shops.length > 0 && (
            <Center py={10}>
              <VStack spacing={2}>
                <Box h="1px" w="40px" bg="gray.100" />
                <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="wider">
                  END OF EXPLORATION
                </Text>
              </VStack>
            </Center>
          )}
        </Box>
      </Container>
    </Box>
  );
});

export default ShopSection;
