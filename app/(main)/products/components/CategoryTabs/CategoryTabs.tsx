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
  const categories = [
    { icon: FiShoppingBag, name: "Essentials", color: "blue.400", slogan: "Daily needs, delivered with care." },
    { icon: FiDroplet, name: "Dairy", color: "cyan.400", slogan: "Fresh from the farm to your fridge." },
    { icon: FiHeart, name: "Sweets", color: "pink.400", slogan: "Indulge in a moment of pure bliss." },
    { icon: AiFillApple, name: "Fruits", color: "orange.400", slogan: "Nature's candy, ripe and ready." },
    { icon: FiSmile, name: "Beauty", color: "purple.400", slogan: "Radiate confidence every single day." },
    { icon: FiPackage, name: "Snacks", color: "teal.400", slogan: "Crunchy, salty, and totally addictive." },
  ];

  const bgColor = useColorModeValue("gray.50", "gray.950");
  const headingColor = useColorModeValue("gray.800", "white");

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
      bg={bgColor}
      borderRadius={{ base: "40px", md: "80px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Decorative Element */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg={categories[activeTab].color}
        filter="blur(150px)"
        opacity={0.1}
        transition="all 0.8s ease"
      />

      <VStack spacing={2} mb={12} textAlign="center" position="relative" zIndex={1}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" rounded="full" bg={categories[activeTab].color} />
          <Text 
            fontSize="xs" 
            fontWeight="black" 
            color={categories[activeTab].color} 
            letterSpacing="3px" 
            textTransform="uppercase"
          >
            Our Collection
          </Text>
          <Box w="8px" h="8px" rounded="full" bg={categories[activeTab].color} />
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
            bg={useColorModeValue("white", "whiteAlpha.100")}
            backdropFilter="blur(10px)"
            borderRadius="full"
            boxShadow="xl"
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
                      backgroundColor: isActive ? category.color : "transparent",
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <Icon
                      as={category.icon}
                      fontSize={isActive ? "20px" : "24px"}
                      color={isActive ? "white" : "gray.400"}
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
                        'li button:before': { color: categories[activeTab].color, fontSize: '10px' },
                        'li.slick-active button:before': { color: categories[activeTab].color, transform: 'scale(1.5)', opacity: 1 }
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
                                // FIX: Cast price to number to prevent build error
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