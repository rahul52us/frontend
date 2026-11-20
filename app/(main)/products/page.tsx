"use client";
import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import HeroSection from "../../component/HeroSection/HeroSection";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";

// ── Performance Optimization: Lazy load heavy below-the-fold components ──
// MapMarker loads @react-google-maps/api (heavy script & DOM) -> lazy load
const MapComponent = dynamic(() => import("../../component/maps/MapMarker"), {
  ssr: false,
  loading: () => <Skeleton height="350px" borderRadius="24px" my={6} />,
});

// IndianStateFilter and ProductBanner are below the fold
const IndianStateFilter = dynamic(
  () => import("../../component/common/StateFilter/StateFilter"),
  {
    ssr: false,
    loading: () => <Skeleton height="280px" borderRadius="24px" my={4} />,
  }
);

const ProductBanner = dynamic(
  () => import("../../component/common/ProductBanner/ProductBanner"),
  {
    ssr: false,
    loading: () => <Skeleton height="320px" borderRadius="24px" my={4} />,
  }
);

const BentoGridSection = dynamic(
  () => import("./components/BentoGridSection/BentoGridSection"),
  {
    ssr: false,
    loading: () => <Skeleton height="400px" borderRadius="24px" my={6} />,
  }
);

const Page = memo(
  observer(() => {
    return (
      <Box overflowX="hidden">
        {/* Above the fold (Fast First Paint) */}
        <HeroSection />
        <CategoryFilter />
        <ProductCarousel />

        <Flex
          direction={{ base: "column", md: "row" }}
          align="stretch"
          w="full"
        >
          <Box
            w="full"
            overflowY={{ base: "visible", md: "auto" }}
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "full",
              },
            }}
          >
            <Suspense fallback={null}>
              <ProductsListSection />
            </Suspense>
          </Box>
        </Flex>

        {/* Below the fold sections (Code-split into isolated bundles) */}
        <MapComponent />
        <IndianStateFilter />

        <Box mb={{ base: 4, md: 6 }}>
          <ProductBanner />
        </Box>

        <BentoGridSection />
      </Box>
    );
  })
);

export default Page;
