"use client";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Spinner,
  Center,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import ProductCard from "../../../products/components/ProductCard/ProductCard";
import ContactSection from "../ContactSection/ContactSection";
import NewsLetter from "../NewsLetter/NewsLetter";
import OperatingHours from "../OperatingHours/OperatingHours";
import ShopAbout from "../ShopAbout/ShopAbout";
import ShopFooterSection from "../ShopFooterSection/ShopFooterSection";
import ShopHeroSection from "../ShopHeroSection/ShopHeroSection";
import ShopImages from "../ShopImages/ShopImages";
import StickyNav from "../StickyNav/StickyNav";
import LocationSection from "../LocationSection/LocationSection";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const ShopPage = observer(({ shopData }: any) => {
  const { shopStore: { getShopProducts } } = stores;
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page = 1) => {
    if (!shopData?._id) return;
    setLoading(true);
    try {
      const res = await getShopProducts({ company: shopData?._id, page: page, limit: 8 });
      const data = res.data?.products || [];
      const { totalPages } = res.data || {};

      setProducts(data);
      setTotalPages(totalPages || 1);
      setCurrentPage(page);
    } catch (error: any) {
      console.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopData?._id) {
      fetchProducts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopData?._id])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);

      // Scroll to products section
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const getCurrentDayHours = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    return shopData?.operatingHours?.find((day: any) => day.day === today) ?? null;
  };

  const isShopClosed = () => {
    const todayDate = new Date().toISOString().split("T")[0];
    return Array.isArray(shopData?.closedDates)
      ? shopData.closedDates.includes(todayDate)
      : false;
  };

  const todayHours = getCurrentDayHours();

  const isOpenNow = () => {
    if (isShopClosed()) return false;
    if (!todayHours?.open || !todayHours?.close) return false;

    const openParts = todayHours.open.split(":").map(Number);
    const closeParts = todayHours.close.split(":").map(Number);

    if (openParts.length !== 2 || closeParts.length !== 2 || openParts.some(isNaN) || closeParts.some(isNaN)) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = openParts[0] * 60 + openParts[1];
    const closeTime = closeParts[0] * 60 + closeParts[1];

    return currentTime >= openTime && currentTime < closeTime;
  };

  return (
    <Box position="relative">

      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ShopHeroSection shopData={shopData} />
        <StickyNav shopData={shopData} />

        {/* Integrated Balanced Grid */}
        <Box position="relative" bg="white" py={{ base: 12, md: 24 }}>
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(12, 1fr)" }}
              gap={{ base: 12, md: 16, lg: 24 }}
              alignItems="start"
            >
              <GridItem colSpan={{ base: 1, md: 7 }}>
                <MotionBox
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <ShopAbout shopData={shopData} />
                </MotionBox>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 5 }} position="sticky" top="120px">
                <MotionBox
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <OperatingHours shopData={shopData} />
                </MotionBox>
              </GridItem>
            </Grid>
          </Container>
        </Box>

        <MotionBox
          id="gallery"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          bg="gray.50"
        >
          <ShopImages shopData={shopData} />
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          id="products"
          py={{ base: 12, md: 16 }}
        >
          <Container maxW="container.xl">
            <VStack spacing={12} align="stretch">
              <VStack spacing={4} align="center" textAlign="center">
                <Badge
                  bgGradient="linear(to-r, blue.400, blue.600)"
                  color="white"
                  px={4}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  letterSpacing="0.1em"
                >
                  COLLECTION
                </Badge>
                <Heading
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="900"
                  color="gray.900"
                  letterSpacing="-0.04em"
                  lineHeight="1"
                >
                  Featured Arrivals
                </Heading>
                <Text color="gray.500" fontSize="lg" maxW="2xl" fontWeight="medium">
                  Discover our curated selection of premium products, each chosen for its exceptional quality and unique design.
                </Text>
              </VStack>

              <Box position="relative">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <Center key="loading" py={20}>
                      <Spinner size="xl" color="blue.600" thickness="4px" />
                    </Center>
                  ) : (
                    <MotionGrid
                      key="grid"
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      }}
                      gap={{ base: 6, md: 8 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {products.length > 0 ? (
                        products.map((product) => (
                          <ProductCard
                            key={`${product._id || product.id}-${product.name}`}
                            product={product}
                          />
                        ))
                      ) : (
                        <GridItem colSpan={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                          <Center py={20} flexDirection="column">
                            <Text fontSize="xl" fontWeight="black" color="gray.300" mb={2}>
                              NO PRODUCTS YET
                            </Text>
                            <Text color="gray.500">Check back later for exciting new arrivals!</Text>
                          </Center>
                        </GridItem>
                      )}
                    </MotionGrid>
                  )}
                </AnimatePresence>
              </Box>

              {products.length > 0 && totalPages > 1 && (
                <Flex justify="center" align="center" mt={16} gap={6}>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1 || loading}
                    leftIcon={<ChevronLeftIcon />}
                    variant="ghost"
                    borderRadius="2xl"
                    _hover={{ bg: "gray.100" }}
                  >
                    Prev
                  </Button>
                  <HStack spacing={2}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Box
                        key={i}
                        w={currentPage === i + 1 ? "12px" : "8px"}
                        h={currentPage === i + 1 ? "12px" : "8px"}
                        bg={currentPage === i + 1 ? "blue.600" : "gray.200"}
                        borderRadius="full"
                        transition="all 0.3s"
                        cursor="pointer"
                        onClick={() => handlePageChange(i + 1)}
                      />
                    ))}
                  </HStack>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages || loading}
                    rightIcon={<ChevronRightIcon />}
                    variant="ghost"
                    borderRadius="2xl"
                    _hover={{ bg: "gray.100" }}
                  >
                    Next
                  </Button>
                </Flex>
              )}
            </VStack>
          </Container>
        </MotionBox>

        <LocationSection shopData={shopData} />
        <NewsLetter />
        <ContactSection shopData={shopData} />
        <ShopFooterSection shopData={shopData} />
      </MotionBox>
    </Box>
  );
});

export default ShopPage;
