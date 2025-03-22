import {
    Box,
    Grid,
    Icon,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useBreakpointValue,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillApple } from "react-icons/ai";
import {
    FiChevronRight,
    FiDroplet,
    FiHeart,
    FiPackage,
    FiShoppingBag,
    FiSmile
} from "react-icons/fi";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { uniqueProducts } from "../utils/constant";

const CreativeTabs = () => {
  const categories = [
    { icon: FiShoppingBag, name: 'Daily Essentials' },
    { icon: FiDroplet, name: 'Dairy Products' },
    { icon: FiHeart, name: 'Sweets' },
    { icon: AiFillApple, name: 'Fruits & Veggies' },
    { icon: FiSmile, name: 'Beauty' },
    { icon: FiPackage, name: 'Snacks' }
  ];

  const glowColor = useColorModeValue("purple.200", "purple.600");
  const activeBg = useColorModeValue("purple.50", "purple.900");

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
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <Box>
      <Tabs variant="unstyled" size={'sm'} onChange={(index) => setActiveTab(index)}>
        <TabList display="flex" justifyContent="center" gap={1} position="relative">
          {categories.map((category, index) => (
            <Tab key={index} zIndex={1} rounded={'full'} _selected={{ color: "white" }} fontWeight={700}>
              <Icon fontSize={'18px'} as={category.icon} mr={2} />
              {category.name}
              {index < categories.length - 1 && (
                <Icon as={FiChevronRight} ml={3} opacity={0.4} position="absolute" right="-18px" top="50%" transform="translateY(-50%)" />
              )}
            </Tab>
          ))}
        </TabList>
        <TabIndicator mt="-34px" rounded={'full'} height="38px" bgGradient="linear(to-r, purple.400,purple.500, purple.700)" borderRadius="md" />

        <TabPanels mt={6}>
          {categories.map((category) => (
            <TabPanel key={category.name} p={4} borderRadius="lg" border="1px solid" borderColor="purple.100" bg={activeBg} _hover={{ boxShadow: `0px 4px 24px ${glowColor}` }} transition="all 0.3s ease">
              {loading ? (
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }} gap={4} my={2}>
                  {[...Array(5)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </Grid>
              ) : (
                <>
                  <Carousel {...carouselSettings}>
                    {uniqueProducts.map((product) => (
                      <Box key={`${product.id}-${product.name}-carousel`} px={{ base: 2, md: 2 }} py={2} width="100%">
                        <ProductCard product={product} />
                      </Box>
                    ))}
                  </Carousel>
                </>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CreativeTabs;
