"use client";
import { Box } from "@chakra-ui/react";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import ProductBanner from "../../component/common/ProductBanner/ProductBanner";
import BentoGrid from "./components/BentoGrid/BentoGrid";
import TopFilterBar from "./components/FilterComponent/Filter";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";

const page = () => {
  return (
    <Box maxW={"95%"} mx={"auto"}>
      <CategoryFilter/>
      <TopFilterBar />
      <ProductsListSection />
      <ProductCarousel />
      {/* <ProductBanner/> */}

      <BentoGrid />
    </Box>
  );
};

export default page;
