import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import ShopSection from "../../../component/shopSection/ShopSection";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton/ProductCardSkeleton";

const MotionBox = motion(Box);

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
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setProducts(shuffled.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box
      mx="auto"
      px={{ base: 4, md: 8, lg: 12 }}
      py={{ base: 6, md: 10 }}
      overflow="hidden"
    >
      {/* Trending Products Section */}
      <MotionBox
        mb={{ base: 10, md: 16 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <CommonHeading
          heading="Top Picks For You"
          subheading="Handpicked favorites based on current trends"
          mb={{ base: 6, md: 10 }}
          color={headingColor}
          align="left"
        />
        <ShopSection />
      </MotionBox>

      {/* Grid Based Product Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <CommonHeading
          heading="Deals You'll Love"
          subheading="Check out our latest arrivals"
          mb={{ base: 6, md: 10 }}
          color={headingColor}
          align="left"
        />
        <Box>
          {loading ? (
            <Carousel slidesToShow={5} dots={false} autoplay={false}>
              {[...Array(6)].map((_, index) => (
                <Box key={index} px={3}>
                  <ProductCardSkeleton />
                </Box>
              ))}
            </Carousel>
          ) : (
            products.length > 0 ? (
              <Box mx="-12px">
                <Carousel
                  slidesToShow={5}
                  dots={false}
                  autoplay={false}
                  buttonColor={headingColor}
                >
                  {products.map((product, idx) => (
                    <Box
                      key={`${product._id}-${product.name}-carousel`}
                      px={3}
                      py={4}
                    >
                      <ProductCard product={product} />
                    </Box>
                  ))}
                </Carousel>
              </Box>
            ) : (
              <Box textAlign="center" py={10} fontSize="lg" color="gray.500">No products found.</Box>
            )
          )}
        </Box>
      </MotionBox>
    </Box>
  );
});

export default ProductsListSection;
