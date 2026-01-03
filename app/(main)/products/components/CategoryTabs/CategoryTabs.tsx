"use client";

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
  Flex,
  Text,
  VStack,
  Heading,
  HStack,
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
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { uniqueProducts } from "../utils/constant";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);

const CreativeTabs = () => {
  // Theme Colors
  const skyBlue = "#00BFFF";
  const midnightBg = useColorModeValue("gray.50", "#050A14");
  const tabListBg = useColorModeValue("white", "rgba(255, 255, 255, 0.05)");
  const headingColor = useColorModeValue("gray.800", "white");

  const categories = [
    { icon: FiShoppingBag, name: "Essentials", slogan: "Daily needs, delivered with care." },
    { icon: FiDroplet, name: "Dairy", slogan: "Fresh from the farm to your fridge." },
    { icon: FiHeart, name: "Sweets", slogan: "Indulge in a moment of pure bliss." },
    { icon: AiFillApple, name: "Fruits", slogan: "Nature's candy, ripe and ready." },
    { icon: FiSmile, name: "Beauty", slogan: "Radiate confidence every single day." },
    { icon: FiPackage, name: "Snacks", slogan: "Crunchy, salty, and totally addictive." },
  ];

  const slidesToShow = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  }) || 1;

  const carouselSettings = {
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 1000,
    dots: true,
    infinite: true,
    arrows: false,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
  };

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <Box
      px={{ base: 4, md: 10 }}
      py={{ base: 12, md: 20 }}
      bg={midnightBg}
      borderRadius={{ base: "40px", md: "80px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Decorative Glow */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg={skyBlue}
        filter="blur(150px)"
        opacity={0.08}
        transition="all 0.8s ease"
      />

      <VStack spacing={2} mb={12} textAlign="center" position="relative" zIndex={1}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" rounded="full" bg={skyBlue} boxShadow={`0 0 8px ${skyBlue}`} />
          <Text 
            fontSize="xs" 
            fontWeight="black" 
            color={skyBlue} 
            letterSpacing="3px" 
            textTransform="uppercase"
          >
            Our Collection
          </Text>
          <Box w="8px" h="8px" rounded="full" bg={skyBlue} boxShadow={`0 0 8px ${skyBlue}`} />
        </HStack>
        
        <MotionHeading
          key={activeTab + "heading"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="900"
          letterSpacing="-1px"
          color={headingColor}
        >
          Explore {categories[activeTab].name}
        </MotionHeading>
        
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeTab + "slogan"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <Text fontSize="lg" color="gray.500" fontWeight="medium">
              {categories[activeTab].slogan}
            </Text>
          </MotionBox>
        </AnimatePresence>
      </VStack>

      <Tabs
        variant="unstyled"
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
        isLazy
      >
        <Flex justify="center" mb={12}>
          <TabList
            display="flex"
            p={3}
            bg={tabListBg}
            backdropFilter="blur(20px)"
            borderRadius="full"
            boxShadow="2xl"
            border="1px solid"
            borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
            gap={{ base: 2, md: 4 }}
            overflowX="auto"
            maxW="100%"
            sx={{
              scrollbarWidth: 'none',
              '::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {categories.map((category, index) => {
              const isActive = activeTab === index;
              return (
                <Tab key={index} p={0}>
                  <MotionVStack
                    spacing={2}
                    py={isActive ? 3 : 4}
                    px={isActive ? 8 : 4}
                    minW={isActive ? "140px" : "60px"}
                    rounded="full"
                    animate={{
                      backgroundColor: isActive ? skyBlue : "transparent",
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <Icon
                      as={category.icon}
                      fontSize={isActive ? "20px" : "24px"}
                      color={isActive ? "white" : useColorModeValue("gray.400", "whiteAlpha.400")}
                    />
                    {isActive && (
                      <Text
                        fontSize="xs"
                        fontWeight="900"
                        color="white"
                        textTransform="uppercase"
                      >
                        {category.name}
                      </Text>
                    )}
                  </MotionVStack>
                </Tab>
              );
            })}
          </TabList>
        </Flex>

        <TabPanels>
          <AnimatePresence mode="wait">
            <TabPanel key={activeTab} p={0}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                {loading ? (
                  <Grid 
                    templateColumns={{
                      base: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: `repeat(${slidesToShow}, 1fr)`
                    }} 
                    gap={6}
                  >
                    {[...Array(slidesToShow)].map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      '.slick-list': { overflow: 'visible' },
                      '.custom-dots': {
                        bottom: '-50px',
                        'li button:before': { color: skyBlue, fontSize: '10px' },
                        'li.slick-active button:before': { color: skyBlue, transform: 'scale(1.5)', opacity: 1 }
                      }
                    }}
                  >
                    <Carousel {...carouselSettings}>
                      {uniqueProducts.map((product) => (
                        <Box key={product.id} px={3} py={4}>
                          <MotionBox whileHover={{ y: -12 }} transition={{ duration: 0.4 }}>
                            <ProductCard 
                              product={{
                                ...product,
                                price: Number(product.price) 
                              }} 
                            />
                          </MotionBox>
                        </Box>
                      ))}
                    </Carousel>
                  </Box>
                )}
              </MotionBox>
            </TabPanel>
          </AnimatePresence>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CreativeTabs;