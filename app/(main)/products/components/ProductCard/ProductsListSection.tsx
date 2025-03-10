import { Box, Grid, useBreakpointValue } from '@chakra-ui/react';
import Carousel from '../../../../component/common/CommonCarousel/CommonCarousel';
import CommonHeading from '../../../../component/common/CommonHeading/CommonHeading';
import ProductCard from './ProductCard';

// Define product interface
interface Product {
  id: number;
  image: string;
  category: string;
  name: string;
  price: string;
  rating: number;
  freeShipping: boolean;
}

// Unique products array
const uniqueProducts: Product[] = Array.from(
  new Map(
    [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
        category: "Business Supplies",
        name: "Premium Office Chair",
        price: "299.99",
        rating: 4,
        freeShipping: true,
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
        category: "Electronics",
        name: "Wireless Headphones",
        price: "149.99",
        rating: 5,
        freeShipping: false,
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
        category: "Fashion",
        name: "Running Shoes",
        price: "89.99",
        rating: 3,
        freeShipping: true,
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
        category: "Business Supplies",
        name: "Ergonomic Desk",
        price: "399.99",
        rating: 4,
        freeShipping: true,
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
        category: "Electronics",
        name: "Bluetooth Speaker",
        price: "99.99",
        rating: 5,
        freeShipping: false,
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
        category: "Fashion",
        name: "Sports Watch",
        price: "129.99",
        rating: 3,
        freeShipping: true,
      },
    ].map((product) => [product.id, product])
  ).values()
);

const ProductsListSection: React.FC = () => {
  // Responsive grid columns
  const gridColumns = useBreakpointValue({
    base: 'repeat(1, 1fr)',    // Mobile: 1 column
    sm: 'repeat(1, 1fr)',     // Small: 2 columns
    md: 'repeat(3, 1fr)',     // Tablet: 3 columns
    lg: 'repeat(4, 1fr)',     // Desktop: 4 columns
    xl: 'repeat(4, 1fr)',     // Large desktop: 4 columns
  });

  // Responsive carousel slides
  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 1,
    md: 3,
    lg: 3,
    xl: 4,
  });

  // Carousel settings aligned with Chakra UI breakpoints
  const carouselSettings = {
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 600,
    dots: true,
    infinite: true,
    arrows: slidesToShow > 1, // Show arrows only when more than 1 slide
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
          color="gray.800"
        >
          Trending Products
        </CommonHeading>
        <Grid
          templateColumns={gridColumns}
          gap={{ base: 4, md: 6, lg: 8 }}
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
          color="gray.800"
        >
          Recently Added
        </CommonHeading>
        <Box
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            bg: 'gray.200',
            display: { base: 'none', md: 'block' },
          }}
        >
          <Carousel {...carouselSettings}>
            {uniqueProducts.map((product) => (
              <Box
                key={`${product.id}-${product.name}-carousel`}
                px={{ base: 1, md: 2, lg: 3 }}
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
};

export default ProductsListSection;
