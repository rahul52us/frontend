"use client";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useSearchParams, useRouter } from "next/navigation";
import ShopLayoutSkeletan from "../shop-details/component/ShopPage/ShopLayoutSkeletan";
import ShopPage from "../shop-details/component/ShopPage/ShopPage";
import stores from "../../store/stores";
import { authentication } from "../../config/utils/routes";

const DEFAULT_RATINGS = {
  average: 4.8,
  total: 256,
};

const ShopContent = memo(
  observer(() => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const shopId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [shopData, setShopData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const {
      shopStore: { getSingleShopById },
    } = stores;

    useEffect(() => {
      let isMounted = true;

      if (!shopId) {
        setLoading(false);
        setError("Shop ID is required");
        return;
      }

      const fetchShopData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getSingleShopById(shopId);
          if (!isMounted) return;

          if (!data?.data) {
            setError("Shop not found");
            return;
          }
          setShopData(data.data);
        } catch {
          if (isMounted) {
            setError("Something went wrong. Please try again.");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchShopData();

      return () => {
        isMounted = false;
      };
    }, [shopId, getSingleShopById]);

    const handleExploreShops = useCallback(() => {
      router.push("/shops");
    }, [router]);

    const handleStartShop = useCallback(() => {
      router.push(authentication.register);
    }, [router]);

    const fullShopData = useMemo(() => {
      if (!shopData) return null;
      return {
        ...shopData,
        ratings: shopData.ratings || DEFAULT_RATINGS,
      };
    }, [shopData]);

    if (loading) return <ShopLayoutSkeletan />;

    if (error || !fullShopData) {
      return (
        <Flex minH="70vh" align="center" justify="center" px={4} py={10}>
          <VStack spacing={4} maxW="520px" textAlign="center">
            <Text fontSize="2xl" fontWeight="700">
              Shop unavailable
            </Text>
            <Text color="gray.500">
              {error || "This shop is currently not available."}
            </Text>
            <Flex gap={3} wrap="wrap" justify="center">
              <Button onClick={handleExploreShops} colorScheme="brand">
                Explore shops
              </Button>
              <Button onClick={handleStartShop} variant="outline">
                Start your shop
              </Button>
            </Flex>
          </VStack>
        </Flex>
      );
    }

    return (
      <Box minH="100vh">
        <ShopPage shopData={fullShopData} />
      </Box>
    );
  })
);

ShopContent.displayName = "ShopContent";

export default function ShopClientPage() {
  return <ShopContent />;
}
