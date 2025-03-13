"use client";

import { Box, Grid, useBreakpointValue } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Carousel from '../../../../component/common/CommonCarousel/CommonCarousel';
import CommonHeading from '../../../../component/common/CommonHeading/CommonHeading';
import stores from '../../../../store/stores';
import { uniqueProducts } from '../utils/constant';
import ProductCard from './ProductCard';

const ProductsListSection = observer(() => {
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  // Responsive grid columns
  const gridColumns = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)',
    xl: 'repeat(5, 1fr)',
  });

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
    centerPadding: '20px',
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
  heading="Trending Products"
  subheading="Discover the most popular products"
  mb={{ base: 4, md: 8 }}
  color={headingColor}
/>
        <Grid
          templateColumns={gridColumns}
          gap={{ base: 4, md: 3, lg: 4 }}
          justifyItems="center"
        >
          {uniqueProducts.map((product) => (
            <ProductCard
              key={`${product.id}-${product.name}`}
              product={product}
            />
          ))}
        </Grid>
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
        <Box
        >
          <Carousel {...carouselSettings}>
            {uniqueProducts.map((product) => (
              <Box
                key={`${product.id}-${product.name}-carousel`}
                px={{ base: 2, md: 3 }}
                py={2}
                width="100%"
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Box>
  );
});

export default ProductsListSection;