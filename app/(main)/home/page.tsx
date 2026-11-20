"use client";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { memo } from "react";
import ProductIndex from "../products/page";

const Page = memo(
  observer(() => {
    return (
      <Box w="full" px={{ base: 2, sm: 4, md: 6, lg: 6 }} py={{ base: 2, md: 4 }}>
        <ProductIndex />
      </Box>
    );
  })
);

export default Page;
