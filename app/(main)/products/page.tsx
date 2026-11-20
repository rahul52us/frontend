"use client";
import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect } from "react";
import CategoryFilter from "../../component/common/CategoryFilter/CategoryFilter";
import HeroSection from "../../component/HeroSection/HeroSection";
import ProductsListSection from "./components/ProductCard/ProductsListSection";
import ProductCarousel from "./components/ProductCarousel/ProductCarousel";

// ── Performance Optimization: Lazy load heavy below-the-fold components ──
const MapComponent = dynamic(() => import("../../component/maps/MapMarker"), {
  ssr: false,
  loading: () => <Skeleton height="350px" borderRadius="24px" my={6} />,
});

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

// Backward-compatibility: Redirect any legacy `/products?search=...` to `/search?q=...`
const SearchRedirectWatcher = memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("q") || searchParams.get("search");
    if (query) {
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [router, searchParams]);

  return null;
});
SearchRedirectWatcher.displayName = "SearchRedirectWatcher";

const Page = memo(
  observer(() => {
    return (
      <Box overflowX="hidden">
        <Suspense fallback={null}>
          <SearchRedirectWatcher />
        </Suspense>

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
