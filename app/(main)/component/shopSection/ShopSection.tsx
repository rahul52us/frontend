"use client";

import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import stores from "../../../store/stores";
import ShopCardSkeleton from "./ShopSkeletonCard/ShowSkeletonCard";
import ShopCard from "./element/ShopCard";

const MotionSimpleGrid = motion(SimpleGrid);
const MotionBox = motion(Box);

const tablePageLimit = 8;

interface GeoFilter {
  lat: number | null;
  lng: number | null;
  radiusKm: number;
}

interface ShopSectionProps {
  searchQuery?: string;
  activeCategory?: string | null;
  geoFilter?: GeoFilter;
  sortBy?: "distance" | "latest";
  enableInfiniteLoad?: boolean;
}

const DEFAULT_GEO_FILTER: GeoFilter = { lat: null, lng: null, radiusKm: 5 };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const ShopSection = observer(
  ({
    searchQuery = "",
    activeCategory = null,
    geoFilter = DEFAULT_GEO_FILTER,
    sortBy = "distance",
    enableInfiniteLoad = true,
  }: ShopSectionProps) => {
    const {
      shopStore: { getAllShops, shop },
      auth: { openNotification },
    } = stores;

    const [currentPage, setCurrentPage] = useState<number>(1);
    const debouncedSearchQuery = useDebounce(searchQuery, 800);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const geoLat = geoFilter.lat;
    const geoLng = geoFilter.lng;
    const geoRadiusKm = geoFilter.radiusKm;

    const emptyBg = useColorModeValue("white", "gray.900");
    const emptyBorder = useColorModeValue("gray.200", "gray.800");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const titleColor = useColorModeValue("gray.800", "white");

    const applyGetAllShops = useCallback(
      async ({
        page = 1,
        limit = tablePageLimit,
        name = "",
        categories = null,
        lat = null,
        lng = null,
        radiusKm = 5,
        sortBy = "distance",
      }: {
        page?: number;
        limit?: number;
        name?: string;
        categories?: string | null;
        lat?: number | null;
        lng?: number | null;
        radiusKm?: number;
        sortBy?: "distance" | "latest";
      }) => {
        try {
          const payload: any = {
            page,
            limit,
            name: name?.trim() || "",
            categories: categories === "All Shops" ? null : categories,
            sortBy,
          };

          if (lat !== null && lng !== null) {
            payload.lat = lat;
            payload.lng = lng;
            payload.radiusKm = radiusKm;
          }

          await getAllShops(payload);
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
        name: debouncedSearchQuery,
        categories: activeCategory,
        lat: geoLat,
        lng: geoLng,
        radiusKm: geoRadiusKm,
        sortBy,
      });
    }, [
      debouncedSearchQuery,
      activeCategory,
      geoLat,
      geoLng,
      geoRadiusKm,
      sortBy,
      applyGetAllShops,
    ]);

    const handleLoadMore = useCallback(() => {
      const nextPage = currentPage + 1;
      if (nextPage > (shop.totalPages || 1)) return;

      setCurrentPage(nextPage);
      applyGetAllShops({
        page: nextPage,
        name: debouncedSearchQuery,
        categories: activeCategory,
        lat: geoLat,
        lng: geoLng,
        radiusKm: geoRadiusKm,
        sortBy,
      });
    }, [
      currentPage,
      shop.totalPages,
      applyGetAllShops,
      debouncedSearchQuery,
      activeCategory,
      geoLat,
      geoLng,
      geoRadiusKm,
      sortBy,
    ]);

    useEffect(() => {
      if (!enableInfiniteLoad) {
        return undefined;
      }

      const currentLoadMoreRef = loadMoreRef.current;
      if (!currentLoadMoreRef) return;

      const observerInstance = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !shop.loading) {
            handleLoadMore();
          }
        },
        { threshold: 0.5 }
      );

      observerInstance.observe(currentLoadMoreRef);
      return () => observerInstance.disconnect();
    }, [enableInfiniteLoad, handleLoadMore, shop.loading]);

    const shops = shop?.data || [];
    const loading = shop?.loading && currentPage === 1;

    return (
      <Box position="relative" w="full" pb={{ base: 2, md: 6 }}>
    <AnimatePresence mode="wait">
          {!loading && shops.length > 0 && (
            <MotionSimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
              spacing={{ base: 2.5, md: 5 }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {shops.map((shopItem: any, index: number) => (
                <MotionBox
                  key={shopItem._id || index}
                  variants={itemVariants}
                  h="full"
                >
                  <ShopCard shop={shopItem} />
                </MotionBox>
              ))}
            </MotionSimpleGrid>
          )}
        </AnimatePresence>

        {loading && (
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing={{ base: 3.5, sm: 4, md: 5 }}
          >
            {Array.from({ length: tablePageLimit }).map((_, index) => (
              <Box key={index} borderRadius="2xl" overflow="hidden">
                <ShopCardSkeleton />
              </Box>
            ))}
          </SimpleGrid>
        )}

        {shops.length === 0 && !loading && (
          <VStack
            py={12}
            px={4}
            spacing={2.5}
            bg={emptyBg}
            borderRadius="2xl"
            border="1px dashed"
            borderColor={emptyBorder}
            textAlign="center"
          >
            <Flex
              w="44px"
              h="44px"
              rounded="full"
              bg="blue.50"
              color="blue.600"
              align="center"
              justify="center"
            >
              <Icon as={FiShoppingBag} boxSize={5} />
            </Flex>
            <Text fontSize="md" fontWeight="700" color={titleColor}>
              No local shops found
            </Text>
            <Text fontSize="xs" color={mutedText} maxW="xs">
              Try expanding your search radius or selecting a different category.
            </Text>
          </VStack>
        )}

        {enableInfiniteLoad && (
          <Box ref={loadMoreRef} h={{ base: "12px", md: "20px" }} />
        )}

        {shop.loading && currentPage > 1 && (
          <Flex py={6} justify="center" align="center" gap={2}>
            <Spinner size="sm" color="blue.600" thickness="2px" />
            <Text fontSize="xs" fontWeight="600" color={mutedText}>
              Loading more shops...
            </Text>
          </Flex>
        )}
      </Box>
    );
  }
);

export default ShopSection;