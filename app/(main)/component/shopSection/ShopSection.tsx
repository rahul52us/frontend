"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Center,
  Text,
  VStack,
  Circle,
} from "@chakra-ui/react";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import ShopCard from "./element/ShopCard";
import ShopCardSkeleton from "./ShopSkeletonCard/ShowSkeletonCard";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
      limit = 10,
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

  // Infinite scroll observer
  useEffect(() => {
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
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [shop.loading, currentPage, shop.totalPages, handleLoadMore]);

  const shops = shop?.data || [];
  const totalPages = shop?.totalPages || 1;
  const totalShops = shop?.totalPages || 0;
  const loading = shop?.loading && currentPage === 1;
  const loadingMore = shop?.loading && currentPage > 1;

  const allLoaded =
    !shop.loading && currentPage >= totalPages && shops.length >= totalShops;

  const progress = totalShops > 0 ? (shops.length / totalShops) * 100 : 0;

  return (
    <Box position="relative">
      <SimpleGrid columns={[1, 1, 2, 3]} gap={8} spacing={2}>
        {shops.map((shop: any, index: number) => (
          <Box key={index} animation={`${fadeIn} 0.5s ease-out`}>
            <ShopCard shop={shop} onClick={() => {}} />
          </Box>
        ))}
      </SimpleGrid>

      {/* Initial Skeleton */}
      {loading && (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4} mt={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ShopCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      )}

      {/* Dynamic Load More Indicator */}
      {!loading && !allLoaded && (
        <Center mt={12} flexDirection="column" gap={4}>
          <VStack ref={loadMoreRef} spacing={3}>
            <Circle
              size="80px"
              bg="gray.50"
              position="relative"
              shadow="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <Circle
                size="80px"
                border="4px solid"
                borderColor="teal.400"
                borderTopColor="transparent"
                borderRightColor="transparent"
                position="absolute"
                transform={`rotate(${(progress / 100) * 360}deg)`}
                transition="transform 0.5s ease-in-out"
                borderRadius="full"
              />
              <Center position="absolute" inset={0}>
                <Text fontSize="lg" fontWeight="semibold" color="teal.600">
                  {shops.length}/{totalShops}
                </Text>
              </Center>
            </Circle>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              {loadingMore
                ? "Hang tight, fetching more awesome shops for you..."
                : "Keep scrolling to explore more gems 🔍"}
            </Text>
          </VStack>
        </Center>
      )}

      {/* Completion Celebration */}
      {!loading && allLoaded && shops.length > 0 && (
        <Center mt={12} flexDirection="column" gap={3}>
          <Circle size="60px" bg="teal.100">
            <Text fontSize="xl" fontWeight="bold" color="teal.600">
              ✓
            </Text>
          </Circle>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            All {shops.length} Shops Unlocked!
          </Text>
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            Explore every corner of our collection 🌟
          </Text>
        </Center>
      )}

      {/* Empty State */}
      {!loading && shops.length === 0 && (
        <Center mt={12}>
          <Text fontSize="lg" color="gray.500">
            No shops found yet - check back soon!
          </Text>
        </Center>
      )}
    </Box>
  );
});

export default ShopSection;
