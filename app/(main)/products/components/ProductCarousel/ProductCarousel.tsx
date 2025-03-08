import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import CustomSubHeading from "../../../travelComponent/common/CustomSubHeading/CustomSubHeading";

const featuredProducts = [
    {
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHN8ZW58MHwwfDB8fHwy",
      title: "Smart Home Devices",
      description: "Upgrade your home with the latest smart devices. Control your lights, security, and appliances with ease.",
      availability: "In Stock",
    },
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHwwfDB8fHwy",
      title: "Trendy Sneakers",
      description: "Step out in style with our collection of trendy sneakers. Comfort meets fashion for every occasion.",
      availability: "Limited Stock",
    },
    {
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2hlc3xlbnwwfDB8MHx8fDI%3D",
      title: "Luxury Watches",
      description: "Timeless elegance with our luxury watch collection. Perfect for every occasion, from casual to formal.",
      availability: "In Stock",
    },
    {
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpbmNhcmV8ZW58MHwwfDB8fHwy",
      title: "Skincare Essentials",
      description: "Pamper your skin with our premium skincare range. Achieve a radiant glow with natural ingredients.",
      availability: "In Stock",
    },
    {
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJhZ3JhbmNlc3xlbnwwfDB8MHx8fDI%3D",
      title: "Luxury Fragrances",
      description: "Indulge in our exclusive collection of luxury fragrances. Find your signature scent today.",
      availability: "Limited Stock",
    },
  ];

const progress = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const fadeInOut = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6 } },
};

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically change the active index every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box py={6} my={{ base: "2rem", md: "3rem" }} px={{ base: 4, md: 2 }}>
      {/* <CustomSubHeading highlightText="Boundaries !!">Travel Beyond </CustomSubHeading> */}
      {/* <Text textAlign={'center'} maxW={'80%'} color={'gray.500'} mx={'auto'}>From hidden gems to iconic wonders, find the perfect destination to fuel your wanderlust and create unforgettable memories.</Text> */}
      <Flex gap={8} direction={{ base: "column", md: "row" }} mt={12}>
        {/* Image Gallery */}
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
            key={activeIndex} // Force re-render when activeIndex changes
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
};

export default ProductCarousel;