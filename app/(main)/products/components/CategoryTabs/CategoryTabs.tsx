import {
  Box,
  Grid,
  Icon,
  Tab,
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
  FiDroplet,
  FiHeart,
  FiPackage,
  FiShoppingBag,
  FiSmile,
} from "react-icons/fi";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { uniqueProducts } from "../utils/constant";

const CreativeTabs = () => {
  const categories = [
    { icon: FiShoppingBag, name: "Essentials" },
    { icon: FiDroplet, name: "Dairy" },
    { icon: FiHeart, name: "Sweets" },
    { icon: AiFillApple, name: "Fruits" },
    { icon: FiSmile, name: "Beauty" },
    { icon: FiPackage, name: "Snacks" },
  ];

  const bgColor = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("purple.600", "purple.400");
  const hoverColor = useColorModeValue("purple.100", "purple.700");

  // Responsive settings
  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 14, sm: 16, md: 20 });

  const carouselSettings = {
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 500,
    dots: true,
    infinite: true,
    arrows: slidesToShow > 1,
    centerMode: true,
    centerPadding: { base: "8px", sm: "10px", md: "15px" },
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots", // Custom class for styling dots
    responsive: [
      { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: "5px" } },
      { breakpoint: 768, settings: { slidesToShow: 2, centerPadding: "8px" } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
    ],
  };

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <Box
      px={{ base: 2, md: 4 }}
      py={{ base: 3, md: 6 }}
      bg={bgColor}
      borderRadius="2xl"
      boxShadow="xl"
      overflow="hidden"
      maxW="100%"
    >
      <Tabs
        variant="unstyled"
        onChange={(index) => setActiveTab(index)}
        isLazy
      >
        <TabList
          display="flex"
          flexWrap={{ base: "wrap", md: "nowrap" }}
          justifyContent="center"
          gap={{ base: 1, md: 2 }}
          p={{ base: 1.5, md: 2 }}
          bgGradient="linear(to-r, purple.100, purple.200)"
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.3s ease"
        >
          {categories.map((category, index) => (
            <Tab
              key={index}
              px={{ base: 2, sm: 3, md: 4 }}
              py={{ base: 1.5, md: 2 }}
              fontSize={tabFontSize}
              fontWeight="extrabold"
              color="gray.800"
              bg={activeTab === index ? accentColor : "whiteAlpha.800"}
              _selected={{
                color: "white",
                bgGradient: "linear(to-r, purple.500, purple.700)",
                boxShadow: "0 4px 12px rgba(128, 0, 128, 0.25)",
              }}
              _hover={{
                bg: activeTab === index ? "purple.700" : hoverColor,
                color: activeTab === index ? "white" : accentColor,
              }}
              transition="all 0.3s ease"
              rounded="md"
              position="relative"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-3px",
                left: "50%",
                transform: "translateX(-50%)",
                w: "50%",
                h: "2px",
                bg: accentColor,
                opacity: activeTab === index ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <Icon as={category.icon} fontSize={iconSize} mr={{ base: 1, md: 2 }} />
              {category.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels mt={{ base: 2, md: 4 }}>
          {categories.map((category) => (
            <TabPanel
              key={category.name}
              p={{ base: 2, md: 4 }}
              borderRadius="lg"
              bg="white"
              border="1px solid"
              borderColor="purple.200"
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-3px)" }}
              transition="all 0.3s ease"
            >
              {loading ? (
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                    xl: "repeat(5, 1fr)",
                  }}
                  gap={{ base: 2, sm: 3, md: 4 }}
                >
                  {[...Array(slidesToShow)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </Grid>
              ) : (
                <Carousel {...carouselSettings}>
                  {uniqueProducts.map((product) => (
                    <Box
                      key={`${product.id}-${product.name}-carousel`}
                      px={{ base: 1, md: 2 }}
                      py={{ base: 1, md: 2 }}
                      width="100%"
                    >
                      <ProductCard product={product} />
                    </Box>
                  ))}
                </Carousel>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Custom CSS for carousel dots */}
      <style jsx global>{`
        .custom-dots li button:before {
          font-size: 8px;
          color: ${accentColor};
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          color: ${accentColor};
          opacity: 1;
          font-size: 10px;
        }
      `}</style>
    </Box>
  );
};

export default CreativeTabs;