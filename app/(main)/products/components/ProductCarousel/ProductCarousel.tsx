'use client'
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import { featuredProducts } from "./utils/constant";


const progress = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const fadeInOut = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6 } },
};

const ProductCarousel = observer(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { themeStore: { themeConfig } } = stores;
  const isDarkMode = themeConfig.config.initialColorMode === "dark";

  // Automatically change the active index every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headingColor = isDarkMode
    ? themeConfig.colors.dark.primary[500]
    : themeConfig.colors.light.primary[500];

  return (
    <Box py={6} my={{ base: "2rem", md: "3rem" }} px={{ base: 4, md: 2 }}>
<CommonHeading
  heading="Must-Have Picks for You"
  subheading="Explore our top-rated and trending products, handpicked just for you."
  mb={{ base: 4, md: 8 }}
  color={headingColor}
/>

      <Flex gap={8} direction={{ base: "column", md: "row" }} mt={12}>
        <Flex flex={2} gap={{ base: 4, md: 4 }} direction={{ base: "column", md: "row" }}>
          {featuredProducts.map((location, index) => (
            <Box
              key={index}
              w={{ base: "100%", md: activeIndex === index ? "50%" : "120px" }}
              h={{ base: "250px", md: "320px" }}
              bgImage={location.image}
              bgSize="cover"
              bgPosition="center"
              borderRadius="lg"
              cursor="pointer"
              transition="all 0.4s ease"
              transform={activeIndex === index ? "scale(1.05)" : "scale(1)"}
              position="relative"
              filter={activeIndex === index ? "brightness(1)" : "brightness(0.8)"}
              onMouseEnter={() => setActiveIndex(index)}
              display={{ base: activeIndex === index ? "block" : "none", md: "block" }} // Only show active image on mobile
            >
              {activeIndex !== index && (
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(0, 0, 0, 0.4)"
                  color="white"
                  justify="center"
                  align="center"
                  borderRadius="lg"
                >
                  <Text fontWeight="bold" fontSize="md" px={1} textAlign={'center'}>
                    {location.title}
                  </Text>
                </Flex>
              )}
              {/* Progress Bar */}
              {activeIndex === index && (
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  h="4px"
                  bg="white"
                  animation={`${progress} 5s linear`}
                />
              )}
            </Box>
          ))}
        </Flex>

        {/* Content */}
        <Flex flex={1} direction="column" justify="center" mt={{ base: 6, md: 0 }}>
          <motion.div
            key={activeIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeInOut}
          >
            <Heading fontSize={{ base: "xl", md: "2xl" }} mb={2} color="gray.700">
              {featuredProducts[activeIndex].title}
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }} mb={4} color={"gray.600"}>
              {featuredProducts[activeIndex].description}
            </Text>
          </motion.div>
          <Flex align="center" gap={4}>
            <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
              {featuredProducts[activeIndex].availability}
            </Text>
            <Box
              as="button"
              px={{ base: 4, md: 6 }}
              py={{ base: 1, md: 2 }}
              bg="black"
              color="white"
              borderRadius="full"
              _hover={{ transform: "scale(1.05)" }}
              transition="all 0.5s ease"
              fontSize={{ base: "sm", md: "md" }}
            >
              EXPLORE ALL
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
});

export default ProductCarousel;