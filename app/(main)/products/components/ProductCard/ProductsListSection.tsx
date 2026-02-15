"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
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



  return (
    <Box
      mx="auto"
      px={{ base: 2, md: 4, lg: 6 }}
      py={{ base: 4, md: 8 }}
      overflow="hidden"
    >
      {/* Trending Products Section */}
      <Box mb={{ base: 6, md: 8 }}>
        <CommonHeading
          heading="Top Picks For You"
          subheading="Handpicked favorites based on current trends"
          mb={{ base: 3, md: 6 }}
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
          mb={{ base: 3, md: 6 }}
          color={headingColor}
          align="left"
        />
        <Box>
          {loading ? (
            <Carousel slidesToShow={5} dots={false} autoplay={false}>
              {[...Array(6)].map((_, index) => (
                <Box key={index} px={2}>
                  <ProductCardSkeleton />
                </Box>
              ))}
            </Carousel>
          ) : (
            products.length > 0 ? (
              <Box mx="-8px"> {/* Negative margin to offset carousel padding if needed */}
                <Carousel
                  slidesToShow={5}
                  dots={false}
                  autoplay={false}
                  buttonColor={headingColor}
                >
                  {products.map((product) => (
                    <Box
                      key={`${product._id}-${product.name}-carousel`}
                      px={2} // Gap between slides
                      py={2} // Padding for shadow/hover effects
                    >
                      <ProductCard product={product} />
                    </Box>
                  ))}
                </Carousel>
              </Box>
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
