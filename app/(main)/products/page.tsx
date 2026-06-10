"use client";
import { Suspense } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import ProductBanner from "../../component/common/ProductBanner/ProductBanner";
import IndianStateFilter from "../../component/common/StateFilter/StateFilter";
import HeroSection from "../../component/HeroSection/HeroSection";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import BentoGridSection from "./components/BentoGridSection/BentoGridSection";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";
import VideoStories from "./components/VideoStories/VideoStories";
import MapComponent from "../../component/maps/MapMarker";

const Page = observer(() => {
  return (
    <Box maxW={{ base: "100%", md: "95%" }} mx="auto" py={{ base: 0, md: 2 }} px={{ base: 0, md: 0 }} overflowX="hidden">
      <CategoryFilter />
      

      {/* <VideoStories /> */}
      <HeroSection />

      <Box p={4}>
        <Box h="1px" bg="gray.100" w="100%" />
      </Box>

      <Box>
        <ProductCarousel />
      </Box>
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
          <Suspense fallback={null}>
            <ProductsListSection />
          </Suspense>
        </Box>
      </Flex>
      <MapComponent />
      <CategoryTabs />
      <IndianStateFilter />

      <Box mb={{ base: 4, md: 6 }}>
        <ProductBanner />
      </Box>
      <BentoGridSection />
    </Box>
  );
});

export default Page;
