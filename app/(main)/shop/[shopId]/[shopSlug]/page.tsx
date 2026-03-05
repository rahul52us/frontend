"use client";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import ShopLayoutSkeletan from "../../../[shopTitle]/component/ShopPage/ShopLayoutSkeletan";
import ShopPage from "../../../[shopTitle]/component/ShopPage/ShopPage";
import stores from "../../../../store/stores";
import { authentication } from "../../../../config/utils/routes";

const dummyData = {
  ratings: {
    average: 4.8,
    total: 256,
  },
};

const Page = observer(() => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const rawShopId = params?.shopId;
  const shopId = Array.isArray(rawShopId) ? rawShopId[0] : rawShopId;

  const {
    shopStore: { getSingleShopById },
  } = stores;

  useEffect(() => {
    if (!shopId) return;

    const fetchShopData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSingleShopById(shopId);
        if (!data?.data) {
          setError("Shop not found");
          return;
        }
        setShopData(data.data);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId, getSingleShopById]);

  if (loading) return <ShopLayoutSkeletan />;

  if (error || !shopData) {
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
            <Button onClick={() => router.push("/shops")} colorScheme="blue">
              Explore shops
            </Button>
            <Button onClick={() => router.push(authentication.register)} variant="outline">
              Start your shop
            </Button>
          </Flex>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <ShopPage
        shopData={{
          ...shopData,
          ratings: dummyData.ratings,
        }}
      />
    </Box>
  );
});

export default Page;

