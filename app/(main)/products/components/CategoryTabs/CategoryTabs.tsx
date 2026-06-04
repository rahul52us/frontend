import {
  Box,
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
  SimpleGrid,
  Progress,
  Fade,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { AiFillApple, AiFillMobile, AiOutlineLaptop, AiOutlineCar } from "react-icons/ai";
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
  FiHome,
  FiTruck,
  FiBook,
  FiMusic,
  FiCamera,
  FiWatch,
  FiGift,
} from "react-icons/fi";
import { FaHandsHelping, FaGift, FaTshirt, FaShoePrints, FaBabyCarriage, FaGamepad } from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard";
import categoryStore from "../../../../store/categoryStore/categoryStore";
import { shopStore } from "../../../../store/shopStore/shopStore";

// Enhanced icon mapping based on category name keywords
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  // Fruits & Vegetables
  if (lowerName.includes("fruit") || lowerName.includes("vegetable") || lowerName.includes("produce")) 
    return AiFillApple;
  // Dairy
  if (lowerName.includes("dairy") || lowerName.includes("milk") || lowerName.includes("cheese")) 
    return FiDroplet;
  // Sweets & Desserts
  if (lowerName.includes("sweet") || lowerName.includes("dessert") || lowerName.includes("chocolate") || lowerName.includes("cake")) 
    return FiHeart;
  // Beauty & Personal Care
  if (lowerName.includes("beauty") || lowerName.includes("cosmetic") || lowerName.includes("skin") || lowerName.includes("hair")) 
    return FiSmile;
  // Snacks
  if (lowerName.includes("snack") || lowerName.includes("chip") || lowerName.includes("cracker")) 
    return FiPackage;
  
  // Mobile & Electronics
  if (lowerName.includes("mobile") || lowerName.includes("phone") || lowerName.includes("smartphone")) 
    return AiFillMobile;
  if (lowerName.includes("electronics") || lowerName.includes("gadget") || lowerName.includes("device")) 
    return AiOutlineLaptop;
  if (lowerName.includes("computer") || lowerName.includes("laptop") || lowerName.includes("tablet")) 
    return AiOutlineLaptop;
  if (lowerName.includes("camera") || lowerName.includes("photo")) 
    return FiCamera;
  if (lowerName.includes("audio") || lowerName.includes("headphone") || lowerName.includes("speaker")) 
    return FiMusic;
  if (lowerName.includes("watch") || lowerName.includes("wearable")) 
    return FiWatch;
  
  // Clothing & Fashion
  if (lowerName.includes("clothing") || lowerName.includes("apparel") || lowerName.includes("dress") || lowerName.includes("shirt")) 
    return FaTshirt;
  if (lowerName.includes("shoe") || lowerName.includes("footwear") || lowerName.includes("sneaker")) 
    return FaShoePrints;
  if (lowerName.includes("jewelry") || lowerName.includes("accessory")) 
    return FaGift;
  
  // Home & Living
  if (lowerName.includes("home") || lowerName.includes("furniture") || lowerName.includes("decor")) 
    return FiHome;
  if (lowerName.includes("kitchen") || lowerName.includes("cookware")) 
    return FiPackage;
  if (lowerName.includes("garden") || lowerName.includes("outdoor")) 
    return FiTruck;
  
  // Baby & Kids
  if (lowerName.includes("baby") || lowerName.includes("toy") || lowerName.includes("kid")) 
    return FaBabyCarriage;
  if (lowerName.includes("game") || lowerName.includes("gaming")) 
    return FaGamepad;
  
  // Books & Media
  if (lowerName.includes("book") || lowerName.includes("magazine") || lowerName.includes("stationery")) 
    return FiBook;
  
  // Automotive
  if (lowerName.includes("auto") || lowerName.includes("car") || lowerName.includes("vehicle")) 
    return AiOutlineCar;
  
  // Default
  return FiShoppingBag;
};

// Enhanced color mapping (keep same structure but extend with new categories)
const getCategoryColor = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("fruit") || lowerName.includes("vegetable")) return "green";
  if (lowerName.includes("dairy")) return "cyan";
  if (lowerName.includes("sweet") || lowerName.includes("dessert")) return "pink";
  if (lowerName.includes("beauty")) return "purple";
  if (lowerName.includes("snack")) return "orange";
  
  // Electronics & Mobile
  if (lowerName.includes("mobile") || lowerName.includes("phone") || lowerName.includes("electronics")) return "blue";
  if (lowerName.includes("computer") || lowerName.includes("laptop")) return "teal";
  if (lowerName.includes("camera") || lowerName.includes("audio")) return "yellow";
  
  // Fashion
  if (lowerName.includes("clothing") || lowerName.includes("shoe")) return "pink";
  if (lowerName.includes("jewelry")) return "purple";
  
  // Home
  if (lowerName.includes("home") || lowerName.includes("furniture")) return "orange";
  if (lowerName.includes("kitchen")) return "red";
  
  // Baby & Toys
  if (lowerName.includes("baby") || lowerName.includes("toy") || lowerName.includes("game")) return "teal";
  
  // Books
  if (lowerName.includes("book")) return "blue";
  
  // Automotive
  if (lowerName.includes("auto") || lowerName.includes("car")) return "gray";
  
  return "blue";
};

// Gradient mapping (same as before, but using the color)
const getCategoryGradient = (color: string) => {
  const gradients: Record<string, string> = {
    blue: "linear(135deg, #1e3a8a 0%, #3b82f6 100%)",
    cyan: "linear(135deg, #06b6d4 0%, #22d3ee 100%)",
    pink: "linear(135deg, #ec4899 0%, #f472b6 100%)",
    green: "linear(135deg, #15803d 0%, #22c55e 100%)",
    purple: "linear(135deg, #7c3aed 0%, #a78bfa 100%)",
    orange: "linear(135deg, #ea580c 0%, #f97316 100%)",
    teal: "linear(135deg, #0d9488 0%, #14b8a6 100%)",
    yellow: "linear(135deg, #ca8a04 0%, #eab308 100%)",
    red: "linear(135deg, #dc2626 0%, #ef4444 100%)",
    gray: "linear(135deg, #4b5563 0%, #6b7280 100%)",
  };
  return gradients[color] || gradients.blue;
};

const MIN_LOADER_MS = 500;

const CreativeTabs = observer(() => {
  // ... everything else stays exactly the same as your last version ...
  // (I will repeat the entire component body for completeness, but the only changes are in the helpers above)

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const columnsCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const iconSize = useBreakpointValue({ base: 14, sm: 16, md: 18 });

  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Map<string, any[]>>(new Map());
  const [categoryProductCounts, setCategoryProductCounts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("Discovering amazing products...");

  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchStartTimeRef = useRef<number>(0);

  const startLoaderAnimation = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

    setLoaderProgress(0);
    setLoaderMessage("Discovering amazing products...");
    setLoading(true);
    fetchStartTimeRef.current = Date.now();

    progressIntervalRef.current = setInterval(() => {
      setLoaderProgress(prev => {
        const next = prev + 3;
        if (next >= 90) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          return 90;
        }
        if (next < 30) setLoaderMessage("Discovering amazing products...");
        else if (next < 70) setLoaderMessage("Handpicking your favorites ✨");
        else setLoaderMessage("Almost ready! 🎁");
        return next;
      });
    }, 80);
  }, []);

  const stopLoaderAnimation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setLoaderProgress(100);

    const elapsed = Date.now() - fetchStartTimeRef.current;
    const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      loadingTimeoutRef.current = null;
    }, remaining);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryStore.getAllCategories({});
        if (response?.status === "success" && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          throw new Error("Invalid categories response");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const fetchProductsForCategory = useCallback(async (categoryId: string, categoryName: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    startLoaderAnimation();
    setVisibleProducts([]);

    const cached = productsByCategory.get(categoryId);
    if (cached && Array.isArray(cached)) {
      setVisibleProducts(cached);
      if (!categoryProductCounts.has(categoryId)) {
        setCategoryProductCounts(prev => new Map(prev).set(categoryId, cached.length));
      }
      stopLoaderAnimation();
      return;
    }

    try {
      const payload = {
        category: categoryId,
        page: 1,
        limit: 12,
      };
      
      const response = await shopStore.getAllProducts(payload, true);
      
      if (abortController.signal.aborted) return;
      
      let products: any[] = [];
      if (response?.status === "success") {
        if (Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          products = response.data.products;
        } else if (Array.isArray(response)) {
          products = response;
        }
      } else if (Array.isArray(response?.data)) {
        products = response.data;
      } else if (Array.isArray(response)) {
        products = response;
      }
      
      if (!Array.isArray(products)) products = [];
      
      setProductsByCategory(prev => new Map(prev).set(categoryId, products));
      setVisibleProducts(products);
      setCategoryProductCounts(prev => new Map(prev).set(categoryId, products.length));
      stopLoaderAnimation();
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      console.error(`Error fetching products for category ${categoryName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load products for ${categoryName}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setVisibleProducts([]);
      setCategoryProductCounts(prev => new Map(prev).set(categoryId, 0));
      stopLoaderAnimation();
    }
  }, [productsByCategory, categoryProductCounts, startLoaderAnimation, stopLoaderAnimation, toast]);

  useEffect(() => {
    if (categories.length > 0 && activeTab < categories.length) {
      const category = categories[activeTab];
      if (category) {
        fetchProductsForCategory(category._id, category.name);
      }
    }
  }, [activeTab, categories, fetchProductsForCategory]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const uiCategories = categories.map((cat) => {
    const name = cat.name || "Category";
    const color = getCategoryColor(name);
    const icon = getCategoryIcon(name);
    const productCount = categoryProductCounts.get(cat._id) ?? cat.productCount ?? cat.products?.length ?? 0;
    const badge = `${productCount} items`;
    return {
      id: cat._id,
      name,
      icon,
      color,
      badge,
      original: cat,
    };
  });

  const primaryBlueGradient = "linear(135deg, #1e3a8a 0%, #3b82f6 100%)";

  if (categories.length === 0 && !categoryStore.loading) {
    return (
      <Box textAlign="center" py={20}>
        <Text>No categories available</Text>
      </Box>
    );
  }

  return (
    <Box position="relative" py={{ base: 8, md: 12, lg: 16 }} px={{ base: 4, md: 6, lg: 8 }} bg={bgColor} minH="100vh">
      <Box position="absolute" top="-10%" right="-5%" w={{ base: "200px", md: "400px" }} h={{ base: "200px", md: "400px" }} bg="blue.200" borderRadius="full" filter="blur(80px)" opacity={0.3} _dark={{ opacity: 0.1 }} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" left="-5%" w={{ base: "200px", md: "300px" }} h={{ base: "200px", md: "300px" }} bg="blue.100" borderRadius="full" filter="blur(80px)" opacity={0.3} _dark={{ opacity: 0.1 }} pointerEvents="none" />

      <VStack spacing={4} mb={{ base: 8, md: 12 }}>
        <HStack spacing={2}>
          <Circle size="40px" bg="blue.100" _dark={{ bg: "blue.900" }}>
            <Icon as={FiTrendingUp} color="blue.600" boxSize={5} />
          </Circle>
          <Text fontSize="xs" fontWeight="800" letterSpacing="widest" textTransform="uppercase" bgGradient={primaryBlueGradient} bgClip="text">Shop by Category</Text>
        </HStack>
        <Text fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }} fontWeight="900" textAlign="center" letterSpacing="-0.02em" lineHeight="1.2">
          Discover Your
          <Text as="span" bgGradient={primaryBlueGradient} bgClip="text"> Favorite </Text>
          Categories
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" _dark={{ color: "gray.400" }} textAlign="center" maxW="2xl">
          Explore our curated collection of premium products across various categories
        </Text>
      </VStack>

      <Tabs variant="unstyled" onChange={(index) => setActiveTab(index)} isLazy lazyBehavior="keepMounted">
        <TabList display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" gap={{ base: 2, md: 3 }} mb={{ base: 8, md: 10 }} pb={{ base: 2, md: 0 }}>
          {uiCategories.map((category, index) => (
            <Tab
              key={category.id || index}
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
              _dark={{ borderColor: activeTab === index ? `${category.color}.800` : "gray.700", bg: activeTab === index ? "gray.800" : "transparent" }}
              position="relative"
              transition="all 0.3s ease"
              _hover={{ transform: "translateY(-2px)", boxShadow: "md", borderColor: `${category.color}.300` }}
            >
              <HStack spacing={2}>
                <Icon as={category.icon} fontSize={iconSize} color={activeTab === index ? `${category.color}.500` : "gray.400"} />
                <Text fontWeight="700">{category.name}</Text>
                <Badge colorScheme={category.color} fontSize="10px" borderRadius="full" px={2}>{category.badge}</Badge>
              </HStack>
              {activeTab === index && (
                <Box position="absolute" bottom="-2px" left="50%" transform="translateX(-50%)" w="40px" h="3px" bgGradient={getCategoryGradient(category.color)} borderRadius="full" />
              )}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {uiCategories.map((category, idx) => (
            <TabPanel key={category.id || idx} p={{ base: 2, md: 4 }}>
              <Box mb={8} p={{ base: 4, md: 6 }} borderRadius="3xl" bgGradient={getCategoryGradient(category.color)} position="relative" overflow="hidden">
                <Box position="absolute" top="-20%" right="-10%" w="200px" h="200px" bg="white" borderRadius="full" opacity={0.1} />
                <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={4} position="relative" zIndex={1}>
                  <HStack spacing={4}>
                    <Circle size="60px" bg="whiteAlpha.300" backdropFilter="blur(10px)">
                      <Icon as={category.icon} boxSize={8} color="white" />
                    </Circle>
                    <Box>
                      <Text fontSize="xs" color="whiteAlpha.800" fontWeight="bold" letterSpacing="widest">FEATURED COLLECTION</Text>
                      <Text fontSize="2xl" fontWeight="900" color="white">{category.name} Specials</Text>
                      <Text fontSize="sm" color="whiteAlpha.900">Handpicked {category.name.toLowerCase()} products just for you</Text>
                    </Box>
                  </HStack>
                  <Button bg="white" color={`${category.color}.600`} rightIcon={<FiArrowRight />} borderRadius="full" px={6} _hover={{ transform: "translateX(5px)", bg: "gray.50" }} transition="all 0.3s">
                    View Collection
                  </Button>
                </Flex>
              </Box>

              {loading ? (
                <Flex direction="column" align="center" justify="center" minH="400px" gap={6}>
                  <Box position="relative" boxSize="80px">
                    <Icon as={FaGift} boxSize="80px" color="blue.400" transition="all 0.2s" animation="pulse 0.8s infinite" sx={{ '@keyframes pulse': { '0%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.1)', opacity: 0.8 }, '100%': { transform: 'scale(1)', opacity: 1 } } }} />
                    <Icon as={FiHeart} position="absolute" top="-10px" right="-10px" boxSize="24px" color="red.500" transition="all 0.2s" animation="bounce 0.6s infinite" sx={{ '@keyframes bounce': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } } }} />
                  </Box>
                  <Text fontWeight="800" fontSize="lg" color="blue.600">{loaderMessage}</Text>
                  <Progress value={loaderProgress} size="sm" width="250px" colorScheme="blue" borderRadius="full" hasStripe isAnimated />
                  <Text fontSize="sm" color="gray.500">Just a moment, loading your {category.name.toLowerCase()}...</Text>
                </Flex>
              ) : (
                <Fade in={!loading} transition={{ enter: { duration: 0.5 } }}>
                  {(!visibleProducts || !Array.isArray(visibleProducts) || visibleProducts.length === 0) ? (
                    <Flex justify="center" align="center" minH="300px">
                      <Text fontSize="lg" color="gray.500">No products found in this category.</Text>
                    </Flex>
                  ) : (
                    <SimpleGrid columns={columnsCount} spacing={{ base: 3, md: 4, lg: 5 }}>
                      {visibleProducts.map((product, productIdx) => (
                        <Box key={product._id || product.id || productIdx} transition="all 0.3s ease" _hover={{ transform: "translateY(-4px)" }}>
                          <ProductCard product={{ ...product, categoryName: category.name }} />
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </Fade>
              )}

              <Flex justify="space-between" align="center" mt={8} pt={6} borderTop="2px solid" borderColor="gray.100" _dark={{ borderColor: "gray.700" }} direction={{ base: "column", sm: "row" }} gap={4} flexWrap="wrap">
                <HStack spacing={6} flexWrap="wrap" justify="center">
                  <HStack spacing={2}><Icon as={FiAward} boxSize={5} color="blue.500" /><Text fontSize="sm" fontWeight="500">Top Rated Products</Text></HStack>
                  <HStack spacing={2}><Icon as={FaHandsHelping} boxSize={5} color="blue.600" /><Text fontSize="sm" fontWeight="500">100% Verified Sellers</Text></HStack>
                  <HStack spacing={2}><Icon as={FiClock} boxSize={5} color="blue.400" /><Text fontSize="sm" fontWeight="500">Free & Fast Delivery</Text></HStack>
                </HStack>
                <Badge colorScheme={category.color} fontSize="sm" p={2} px={3} borderRadius="full">
                  {visibleProducts?.length || 0}+ Products Available
                </Badge>
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default CreativeTabs;
