"use client";

import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";

const ProductsListSection = observer(() => {
  const {
    themeStore: { themeConfig },
    shopStore,
  } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await shopStore.getAllShopProducts();
      const allProducts = res.data || [];
      // Shuffle and take 10
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 10));
    } catch (error) {
      alert(error?.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });

  const carouselSettings = {
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    dots: true,
    infinite: true,
    arrows: slidesToShow > 1, // Show arrows only if more than 1 slide visible
    centerMode: false,
    centerPadding: "20px",
    pauseOnHover: true,
  };

  return (
    <Box
      mx="auto"
      px={{ base: 3, md: 4, lg: 6 }}
      py={{ base: 4, md: 8 }}
      overflow="hidden"
    >
      {/* Trending Products Section */}
      <Box mb={{ base: 6, md: 8 }}>
        <CommonHeading
          heading="Top Picks For You"
          subheading="Handpicked favorites based on current trends"
          mb={{ base: 4, md: 6 }}
          color={headingColor}
          align="left"
        />
        <ShopSection />
      </Box>

      {/* Grid Based Product Section (2 Columns for Mobile) */}
      <Box>
        <CommonHeading
          heading="Deals You'll Love"
          subheading="Check out our latest arrivals"
          mb={{ base: 4, md: 6 }}
          color={headingColor}
          align="left"
        />
        <Box>
          {loading ? (
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)", xl: "repeat(5, 1fr)" }} gap={3} my={2}>
              {[...Array(6)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </Grid>
          ) : (
            products.length > 0 ? (
              <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)", xl: "repeat(5, 1fr)" }}
                gap={{ base: 2, md: 4 }}
                my={2}
              >
                {products.map((product) => (
                  <Box
                    key={`${product._id}-${product.name}-grid`}
                    width="100%"
                  >
                    <ProductCard product={product} />
                  </Box>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={10}>No products found.</Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default ProductsListSection;
