"use client";

import { Box, Flex } from "@chakra-ui/react";
import React, { memo } from "react";
import { observer } from "mobx-react-lite";
import ProductImageViewer from "../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection/ProductDetailsSection";

const DEFAULT_IMAGES = [
  "/images/heroImage.png",
  "/images/heroImage2.png",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vZGVsfGVufDB8fDB8fHww",
];

const IndividualProductPage = memo(
  observer(() => {
    return (
      <Box maxW={{ base: "100%", md: "90%", lg: "80%", xl: "75%" }} mx="auto" my={{ base: 2, md: 4 }} px={{ base: 3, md: 0 }}>
        <Flex direction={{ base: "column", md: "row" }} gap={6} align="flex-start">
          {/* Left Section - Sticky on Desktop */}
          <Box
            w={{ base: "full", md: "auto" }}
            position={{ base: "relative", md: "sticky" }}
            top={{ base: "auto", md: "7rem", lg: "9rem" }}
            alignSelf="flex-start"
          >
            <ProductImageViewer images={DEFAULT_IMAGES} />
          </Box>

          {/* Right Section - Scrollable Details */}
          <Box flex={1} minW={0} w="full">
            <ProductDetailsSection />
          </Box>
        </Flex>
      </Box>
    );
  })
);

IndividualProductPage.displayName = "IndividualProductPage";

export default IndividualProductPage;
