import { Box, Flex, Heading, Text, useColorModeValue, Badge, Container, VStack, Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import { featuredProducts } from "./utils/constant";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const ProductCarousel = observer(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');

  return (
    <Box py={16} my={10} px={4} bg={useColorModeValue('gray.50', 'gray.900/50')} borderRadius="3xl">
      <Container maxW="7xl">
        <CommonHeading
          heading="Must-Have Picks for You"
          subheading="Explore our top-rated and trending products, handpicked just for you."
          mb={12}
          color={headingColor}
        />

        <Flex gap={10} direction={{ base: "column", lg: "row" }} mt={8} align="center">
          {/* Animated Accordion List */}
          <Flex flex={2} gap={4} direction={{ base: "column", md: "row" }} w="full">
            {featuredProducts.map((product, index) => (
              <MotionBox
                key={index}
                flex={activeIndex === index ? 3 : 1}
                h={{ base: "280px", md: "420px" }}
                position="relative"
                borderRadius="3xl"
                overflow="hidden"
                cursor="pointer"
                onMouseEnter={() => setActiveIndex(index)}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                boxShadow={activeIndex === index ? "2xl" : "lg"}
                initial={false}
              >
                <Box
                  position="absolute"
                  inset={0}
                  bgImage={product.image}
                  bgSize="cover"
                  bgPosition="center"
                  transition="transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)"
                  transform={activeIndex === index ? "scale(1.1)" : "scale(1)"}
                />

                {/* Overlay */}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient={activeIndex === index
                    ? "linear(to-t, blackAlpha.800, transparent)"
                    : "linear(to-t, blackAlpha.600, blackAlpha.300)"}
                  transition="all 0.4s"
                />

                <Flex
                  position="absolute"
                  inset={0}
                  p={6}
                  direction="column"
                  justify="flex-end"
                >
                  <AnimatePresence mode="wait">
                    {activeIndex === index ? (
                      <MotionBox
                        key="active"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Badge colorScheme="purple" mb={2} borderRadius="md" px={2}>FEATURED</Badge>
                        <Heading size="md" color="white" mb={1}>{product.title}</Heading>
                        {/* Progress Bar */}
                        <Box h="3px" bg="whiteAlpha.400" mt={3} borderRadius="full" overflow="hidden">
                          <MotionBox
                            h="full"
                            bg="white"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 8, ease: "linear" }}
                          />
                        </Box>
                      </MotionBox>
                    ) : (
                      <MotionHeading
                        key="inactive"
                        size="xs"
                        color="whiteAlpha.900"
                        letterSpacing="widest"
                        textTransform="uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transform={{ rotate: { base: 0, md: -90 } }}
                        whiteSpace="nowrap"
                        position={{ base: "relative", md: "absolute" }}
                        bottom={{ base: 0, md: 10 }}
                        left={{ base: 0, md: -6 }}
                      >
                        {product.title}
                      </MotionHeading>
                    )}
                  </AnimatePresence>
                </Flex>
              </MotionBox>
            ))}
          </Flex>

          {/* Description Content */}
          <Flex flex={1} direction="column" justify="center" p={8} bg={bgColor} borderRadius="3xl" boxShadow="xl" minH="300px">
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Heading fontSize="3xl" mb={4} color={textColor} fontWeight="900">
                  {featuredProducts[activeIndex].title}
                </Heading>
                <Text fontSize="lg" mb={8} color="gray.500" lineHeight="relaxed">
                  {featuredProducts[activeIndex].description}
                </Text>
              </MotionBox>
            </AnimatePresence>

            <Flex align="center" justify="space-between">
              <VStack align="flex-start" spacing={0}>
                <Text fontWeight="black" fontSize="2xl" color="purple.500">
                  {featuredProducts[activeIndex].availability}
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" letterSpacing="widest">STATUS</Text>
              </VStack>
              <Button
                size="lg"
                bg="purple.600"
                color="white"
                borderRadius="2xl"
                px={10}
                _hover={{
                  bg: "purple.700",
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 20px -5px rgba(128, 90, 213, 0.5)"
                }}
                transition="all 0.3s"
              >
                DISCOVER
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
});

export default ProductCarousel;