"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import { tablePageLimit } from "../../../component/config/utils/variable";
import ShopCard from "./element/ShopCard";

const ShopSection = observer(() => {
  const {
    shopStore: { getAllShops },
    auth: { openNotification },
  } = stores;

  const [allShops, setAllShops] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
      {/* Show loading spinner */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {allShops.map((shop, index : number) => (
              <ShopCard shop={shop} key={index} onClick={() => {}} />
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
});

export default ShopSection;
