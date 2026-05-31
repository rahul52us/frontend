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
  Text,
  Flex,
  HStack,
  Badge,
  Circle,
  Button,
  VStack,
  Container,
  SimpleGrid,
  ScaleFade,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { AiFillApple } from "react-icons/ai";
import {
  FiDroplet,
  FiHeart,
  FiPackage,
  FiShoppingBag,
  FiSmile,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaHandsHelping } from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { uniqueProducts } from "../utils/constant";

const CreativeTabs = () => {
  const categories = [
    { icon: FiShoppingBag, name: "Essentials", color: "blue", badge: "24 items", trend: "+15%" },
    { icon: FiDroplet, name: "Dairy", color: "cyan", badge: "18 items", trend: "+8%" },
    { icon: FiHeart, name: "Sweets", color: "pink", badge: "32 items", trend: "+42%" },
    { icon: AiFillApple, name: "Fruits", color: "green", badge: "28 items", trend: "+12%" },
    { icon: FiSmile, name: "Beauty", color: "purple", badge: "15 items", trend: "+25%" },
    { icon: FiPackage, name: "Snacks", color: "orange", badge: "45 items", trend: "+35%" },
  ];

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.900");
  
  // Responsive settings
  const columnsCount = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  });
  
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 14, sm: 16, md: 18 });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(uniqueProducts.slice(0, 10));

  // Simulate loading when tab changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      // Show different products based on category
      const shuffled = [...uniqueProducts].sort(() => 0.5 - Math.random());
      setVisibleProducts(shuffled.slice(0, 10));
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Get gradient for category
  const getCategoryGradient = (color: string) => {
    const gradients: Record<string, string> = {
      blue: "linear(135deg, #60a5fa 0%, #3b82f6 100%)",
      cyan: "linear(135deg, #22d3ee 0%, #06b6d4 100%)",
      pink: "linear(135deg, #f472b6 0%, #ec4899 100%)",
      green: "linear(135deg, #4ade80 0%, #22c55e 100%)",
      purple: "linear(135deg, #a78bfa 0%, #8b5cf6 100%)",
      orange: "linear(135deg, #fb923c 0%, #f97316 100%)",
    };
    return gradients[color] || gradients.blue;
  };

  return (
    <Box
      position="relative"
      py={{ base: 8, md: 12, lg: 16 }}
      px={{ base: 4, md: 6, lg: 8 }}
      bg={bgColor}
      minH="100vh"
    >
      {/* Decorative Background */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w={{ base: "200px", md: "400px" }}
        h={{ base: "200px", md: "400px" }}
        bg="purple.200"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.3}
        _dark={{ opacity: 0.1 }}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w={{ base: "200px", md: "300px" }}
        h={{ base: "200px", md: "300px" }}
        bg="pink.200"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.3}
        _dark={{ opacity: 0.1 }}
        pointerEvents="none"
      />

      <Container maxW="100%" position="relative" zIndex={2}>
        {/* Header Section */}
        <VStack spacing={4} mb={{ base: 8, md: 12 }}>
          <HStack spacing={2}>
            <Circle size="40px" bg="purple.100" _dark={{ bg: "purple.900" }}>
              <Icon as={FiTrendingUp} color="purple.600" boxSize={5} />
            </Circle>
            <Text
              fontSize="xs"
              fontWeight="800"
              letterSpacing="widest"
              textTransform="uppercase"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              bgClip="text"
            >
              Shop by Category
            </Text>
          </HStack>
          
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="900"
            textAlign="center"
            letterSpacing="-0.02em"
            lineHeight="1.2"
          >
            Discover Your
            <Text as="span" bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)" bgClip="text">
              {" "}Favorite{" "}
            </Text>
            Categories
          </Text>
          
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.600"
            _dark={{ color: "gray.400" }}
            textAlign="center"
            maxW="2xl"
          >
            Explore our curated collection of premium products across various categories
          </Text>
        </VStack>

        <Tabs
          variant="unstyled"
          onChange={(index) => setActiveTab(index)}
          isLazy
          lazyBehavior="keepMounted"
        >
          <TabList
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            gap={{ base: 2, md: 3 }}
            mb={{ base: 8, md: 10 }}
            pb={{ base: 2, md: 0 }}
          >
            {categories.map((category, index) => (
              <Tab
                key={index}
                px={{ base: 3, sm: 4, md: 5 }}
                py={{ base: 2, md: 2.5 }}
                fontSize={tabFontSize}
                fontWeight="bold"
                bg={activeTab === index ? "white" : "transparent"}
                color={activeTab === index ? `${category.color}.600` : "gray.500"}
                borderRadius="2xl"
                boxShadow={activeTab === index ? "lg" : "none"}
                border="1px solid"
                borderColor={activeTab === index ? `${category.color}.200` : "gray.100"}
                _dark={{
                  borderColor: activeTab === index ? `${category.color}.800` : "gray.700",
                  bg: activeTab === index ? "gray.800" : "transparent",
                }}
                position="relative"
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                  borderColor: `${category.color}.300`,
                }}
              >
                <HStack spacing={2}>
                  <Icon 
                    as={category.icon} 
                    fontSize={iconSize} 
                    color={activeTab === index ? `${category.color}.500` : "gray.400"}
                  />
                  <Text fontWeight="700">{category.name}</Text>
                  <Badge
                    colorScheme={category.color}
                    fontSize="10px"
                    borderRadius="full"
                    px={2}
                  >
                    {category.badge}
                  </Badge>
                </HStack>
                
                {/* Active Indicator */}
                {activeTab === index && (
                  <Box
                    position="absolute"
                    bottom="-2px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="40px"
                    h="3px"
                    bgGradient={getCategoryGradient(category.color)}
                    borderRadius="full"
                  />
                )}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {categories.map((category, idx) => (
              <TabPanel
                key={category.name}
                p={{ base: 2, md: 4 }}
                transition="all 0.3s ease"
              >
                <ScaleFade in={!loading} initialScale={0.9} delay={0.1}>
                  {/* Category Hero Section */}
                  <Box
                    mb={8}
                    p={{ base: 4, md: 6 }}
                    borderRadius="3xl"
                    bgGradient={getCategoryGradient(category.color)}
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="-20%"
                      right="-10%"
                      w="200px"
                      h="200px"
                      bg="white"
                      borderRadius="full"
                      opacity={0.1}
                    />
                    <Flex
                      justify="space-between"
                      align="center"
                      direction={{ base: "column", sm: "row" }}
                      gap={4}
                      position="relative"
                      zIndex={1}
                    >
                      <HStack spacing={4}>
                        <Circle size="60px" bg="whiteAlpha.300" backdropFilter="blur(10px)">
                          <Icon as={category.icon} boxSize={8} color="white" />
                        </Circle>
                        <Box>
                          <Text fontSize="xs" color="whiteAlpha.800" fontWeight="bold" letterSpacing="widest">
                            FEATURED COLLECTION
                          </Text>
                          <Text fontSize="2xl" fontWeight="900" color="white">
                            {category.name} Specials
                          </Text>
                          <Text fontSize="sm" color="whiteAlpha.900">
                            Handpicked {category.name.toLowerCase()} products just for you
                          </Text>
                        </Box>
                      </HStack>
                      <Button
                        bg="white"
                        color={`${category.color}.600`}
                        rightIcon={<FiArrowRight />}
                        borderRadius="full"
                        px={6}
                        _hover={{ transform: "translateX(5px)", bg: "gray.50" }}
                        transition="all 0.3s"
                      >
                        View Collection
                      </Button>
                    </Flex>
                  </Box>

                  {/* Products Grid - No Carousel, Clean Grid */}
                  {loading ? (
                    <SimpleGrid
                      columns={columnsCount}
                      spacing={{ base: 3, md: 4, lg: 5 }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <>
                      <SimpleGrid
                        columns={columnsCount}
                        spacing={{ base: 3, md: 4, lg: 5 }}
                      >
                        {visibleProducts.map((product, productIdx) => (
                          <Box
                            key={`${product.id}-${productIdx}`}
                            transition="all 0.3s ease"
                            _hover={{ transform: "translateY(-4px)" }}
                          >
                            <ProductCard product={{ ...product, categoryName: category.name }} />
                          </Box>
                        ))}
                      </SimpleGrid>

                      {/* Load More Button */}
                      <Flex justify="center" mt={8}>
                        <Button
                          variant="outline"
                          colorScheme={category.color}
                          borderRadius="full"
                          px={8}
                          rightIcon={<FiArrowRight />}
                          _hover={{ transform: "translateX(5px)" }}
                          transition="all 0.3s"
                        >
                          Load More Products
                        </Button>
                      </Flex>
                    </>
                  )}

                  {/* Category Features */}
                  <Flex
                    justify="space-between"
                    align="center"
                    mt={8}
                    pt={6}
                    borderTop="2px solid"
                    borderColor="gray.100"
                    _dark={{ borderColor: "gray.700" }}
                    direction={{ base: "column", sm: "row" }}
                    gap={4}
                    flexWrap="wrap"
                  >
                    <HStack spacing={6} flexWrap="wrap" justify="center">
                      <HStack spacing={2}>
                        <Icon as={FiAward} boxSize={5} color="green.500" />
                        <Text fontSize="sm" fontWeight="500">Top Rated Products</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon as={FaHandsHelping} boxSize={5} color="purple.500" />
                        <Text fontSize="sm" fontWeight="500">100% Verified Sellers</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon as={FiClock} boxSize={5} color="orange.500" />
                        <Text fontSize="sm" fontWeight="500">Free & Fast Delivery</Text>
                      </HStack>
                    </HStack>
                    <Badge
                      colorScheme={category.color}
                      fontSize="sm"
                      p={2}
                      px={3}
                      borderRadius="full"
                    >
                      {Math.floor(Math.random() * 100) + 50}+ Products Available
                    </Badge>
                  </Flex>
                </ScaleFade>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default CreativeTabs;