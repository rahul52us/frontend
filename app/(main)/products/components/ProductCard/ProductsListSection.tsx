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
    base: 'repeat(1, 1fr)',  // 1 column on mobile
    sm: 'repeat(2, 1fr)',   // 2 columns on small screens
    md: 'repeat(3, 1fr)',   // 3 columns on medium screens
    lg: 'repeat(3, 1fr)',   // 4 columns on large screens
    xl: 'repeat(4, 1fr)',   // 5 columns on extra-large screens
  });

  // Responsive slides to show in carousel
  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3,
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
      maxW="container.xl"
      mx="auto"
      px={{ base: 4, md: 6, lg: 8 }}
      py={{ base: 6, md: 8 }}
      overflow="hidden"
    >
      {/* Trending Products Section */}
      <Box mb={{ base: 8, md: 12 }}>
        <CommonHeading
          mb={{ base: 4, md: 6 }}
          fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
          color={headingColor}
          textAlign={{ base: 'center', md: 'left' }}
        >
          Trending Products
        </CommonHeading>
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
          mb={{ base: 4, md: 6 }}
          fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
          color={headingColor}
          textAlign={{ base: 'center', md: 'left' }}
        >
          Recently Added
        </CommonHeading>
        <Box
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: { base: 0, md: '10%' },
            right: { base: 0, md: '10%' },
            height: '1px',
            bg: 'gray.200',
            display: { base: 'none', md: 'block' },
          }}
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