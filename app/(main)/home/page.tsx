"use client";
import { Box, Container } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import ProductIndex from "../products/page";

const Page = observer(() => {
  return (
    <Box w="full" px={{ base: 2, sm: 4, md: 6, lg: 6 }} py={{ base: 2, md: 4 }}>
      <ProductIndex />
    </Box>
  );
});

export default Page;