"use client";
import { Box, Flex, Grid } from "@chakra-ui/react";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import ProductBanner from "../../component/common/ProductBanner/ProductBanner";
import ProductImageViewer from "../../component/common/ProductImagesViewer/ProductImagesViewer";
import IndianStateFilter from "../../component/common/StateFilter/StateFilter";
import HeroSection from "../../component/HeroSection/HeroSection";
import BenefitSection from "./components/BenefitSection/BenefitSection";
import BentoGrid from "./components/BentoGrid/BentoGrid";
import CreativeEcommerceSection from "./components/ContentSection";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";

const Page = () => {
  const productImages = [
    'https://images.unsplash.com/photo-1741515277598-64b4da5d212a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D',
    "https://images.unsplash.com/photo-1565530557873-14ab8a68a85b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523132797263-747d5d0dbbb3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];
  return (
    <Box maxW="98%" mx="auto" py={{ base: 2, md: 2 }} overflowX="hidden">
      <CategoryFilter />
      <HeroSection/>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 2 }}
        align="stretch"
        w="full"
      >
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
      <Grid templateColumns={{lg:'1fr 1fr'}} gap={4} maxW={'90%'} mx={'auto'}>

      <ProductImageViewer images={productImages} />
      <Box>
        hello
      </Box>
      </Grid>

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
