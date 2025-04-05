"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import { tablePageLimit } from "../../../component/config/utils/variable";
import ShopCard from "./element/ShopCard";
import ShopCardSkeleton from "../ShopSkeletonCard/ShowSkeletonCard";

const ShopSection = observer(() => {
  const {
    shopStore: { getAllShops },
    auth: { openNotification },
  } = stores;

  const [allShops, setAllShops] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage] = useState<number>(1);
  const [searchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const applyGetAllShops = useCallback(
    ({ page = 1, limit = tablePageLimit, search = "" }) => {
      setLoading(true);
      getAllShops({ page, limit, search })
        .then((data: any) => {
          setAllShops(data?.data?.data || []);
          setLoading(false);
        })
        .catch((err) => {
          openNotification({
            title: "Failed to get Shops",
            message: err.message,
            type: "error",
          });
          setLoading(false);
        });
    },
    [getAllShops, openNotification]
  );

  useEffect(() => {
    applyGetAllShops({ page: currentPage, search: debouncedSearchQuery });
  }, [currentPage, debouncedSearchQuery, applyGetAllShops]);

  return (
    <Box>
      {/* Display Shop Cards */}
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={2}>
        {allShops.map((shop, index) => (
          <ShopCard shop={shop} key={index} onClick={() => {}} />
        ))}
      </SimpleGrid>

      {/* Show Skeleton Cards at the Bottom While Loading */}
      {loading && (
        <SimpleGrid columns={[1, 2,3 , 4]} spacing={2} mt={2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ShopCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
});

export default ShopSection;
