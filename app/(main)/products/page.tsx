"use client";
import { Box, Flex } from "@chakra-ui/react";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import ProductBanner from "../../component/common/ProductBanner/ProductBanner";
import IndianStateFilter from "../../component/common/StateFilter/StateFilter";
// import FilterPanel from "../../component/config/component/filterPanel/FIlterPanel";
import HeroSection from "../../component/HeroSection/HeroSection";
import BenefitSection from "./components/BenefitSection/BenefitSection";
import BentoGrid from "./components/BentoGrid/BentoGrid";
import CreativeEcommerceSection from "./components/ContentSection";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";

const Page = () => {
  return (
    <Box maxW="98%" mx="auto" py={{ base: 4, md: 2 }} overflowX="hidden">
      <CategoryFilter />
      <HeroSection/>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 2 }}
        align="stretch"
        w="full"
      >
        {/* <Box
          w={{ base: "100%", md: "280px", lg: "320px" }}
          flexShrink={0}
          position={{ md: "sticky" }}
          top={{ md: "20px" }}
          maxH={{ md: "calc(100vh - 40px)" }}
          overflowY={{ md: "auto" }}
          display="none"
        >
          <FilterPanel />
        </Box> */}
        <Box
          w="full"
          overflowY={{ base: "visible", md: "auto" }}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "4px" },
          }}
        >
          <ProductsListSection />
        </Box>
      </Flex>

      <Box>
        <ProductCarousel />
      </Box>
      <IndianStateFilter/>
      <CreativeEcommerceSection/>
      <BenefitSection/>
      <Box>
        <BentoGrid />
      </Box>
      <Box mb={{ base: 4, md: 6 }}>
        <ProductBanner />
      </Box>
    </Box>
  );
};

export default Page;
