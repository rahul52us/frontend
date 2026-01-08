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
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      // maxW="container.xl"
      mx="auto"
      px={{ base: 3, md: 4, lg: 6 }}
      py={{ base: 6, md: 8 }}
      overflow="hidden"
    >
      {/* Trending Products Section */}
      <Box mb={{ base: 8, md: 8 }}>
        <CommonHeading
          heading="New Shops Added"
          subheading="Discover the latest shops and explore their offerings"
          mb={{ base: 6, md: 8 }}
          color={headingColor}
          align={{ base: "center", md: "center" }}
        />
        <ShopSection />
      </Box>

      {/* Recently Added Section */}
      <Box>
        <CommonHeading
          heading="Recently Added"
          subheading="Check out the latest arrivals"
          mb={{ base: 6, md: 6 }}
          color={headingColor}
          align={{ base: "center", md: "center" }}
        />
        <Box>
          {loading ? (
            <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)", xl: "repeat(5, 1fr)" }} gap={4} my={2}>
              {[...Array(5)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </Grid>
          ) : (
            products.length > 0 ? (
              <Carousel {...carouselSettings}>
                {products.map((product) => (
                  <Box
                    key={`${product._id}-${product.name}-carousel`}
                    px={{ base: 2, md: 2 }}
                    py={2}
                    width="100%"
                  >
                    <ProductCard product={product} />
                  </Box>
                ))}
              </Carousel>
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
