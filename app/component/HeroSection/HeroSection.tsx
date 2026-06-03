"use client";

import React, { useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Icon,
  SimpleGrid,
  Circle,
} from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform, useAnimation, useInView } from "framer-motion";
import {
  FaArrowRight,
  FaPlay,
  FaStar,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
const MotionFlex = motion(Flex);
const MotionSimpleGrid = motion(SimpleGrid);

const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Premium Sneakers",
    price: "$129",
    rating: 4.9,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    title: "Luxury Fashion",
    price: "$89",
    rating: 4.8,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "Modern Outfit",
    price: "$149",
    rating: 4.9,
  },
];

// Staggered fade-in variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } },
};

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for parallax
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Transform values for 3D tilt (max 10deg rotation)
  const rotateX = useTransform(springY, [-300, 300], [6, -6]);
  const rotateY = useTransform(springX, [-300, 300], [-6, 6]);

  // For background gradient movement
  const bgX = useTransform(springX, [-300, 300], [-30, 30]);
  const bgY = useTransform(springY, [-300, 300], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <Box
      ref={containerRef}
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%)"
    >
      {/* Animated Background with mouse-follow glow */}
      <MotionBox
        position="absolute"
        inset="0"
        style={{ x: bgX, y: bgY }}
        bgGradient="radial(circle at top left, rgba(124,58,237,.15), transparent 50%), radial(circle at bottom right, rgba(59,130,246,.15), transparent 50%)"
      />

      {/* Grid Pattern */}
      <Box
        position="absolute"
        inset="0"
        opacity={0.06}
        backgroundImage={`
          linear-gradient(to right, #1a1a2e 1px, transparent 1px),
          linear-gradient(to bottom, #1a1a2e 1px, transparent 1px)
        `}
        backgroundSize="60px 60px"
      />

      {/* Glow Effects with spring animation */}
      <MotionCircle
        size="500px"
        bg="purple.300"
        opacity={0.25}
        filter="blur(100px)"
        position="absolute"
        top="-200px"
        left="-150px"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <MotionCircle
        size="400px"
        bg="blue.300"
        opacity={0.25}
        filter="blur(100px)"
        position="absolute"
        bottom="-150px"
        right="-120px"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container maxW="8xl" position="relative" zIndex={2}>
        <Flex
          minH="100vh"
          align="center"
          justify="space-between"
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 12, lg: 10 }}
          py={{ base: 12, lg: 8 }}
        >
          {/* LEFT CONTENT with staggered animations */}
          <MotionFlex
            flex={1}
            direction="column"
            align={{ base: "center", lg: "flex-start" }}
            spacing={6}
            textAlign={{ base: "center", lg: "left" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionBox variants={itemVariants}>
              <Badge
                px={5}
                py={2}
                rounded="full"
                bg="rgba(124,58,237,0.12)"
                color="purple.700"
                border="1px solid rgba(124,58,237,0.2)"
                backdropFilter="blur(4px)"
                fontSize="sm"
                fontWeight="medium"
              >
                ✨ NEXT GEN E-COMMERCE EXPERIENCE
              </Badge>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Heading
                color="gray.800"
                lineHeight="1.05"
                fontWeight="800"
                fontSize={{
                  base: "3.5rem",
                  md: "5rem",
                  lg: "6.5rem",
                }}
                letterSpacing="-2px"
              >
                SHOP
                <br />
                <Text
                  as="span"
                  bgGradient="linear(to-r, #7c3aed, #2563eb)"
                  bgClip="text"
                  fontWeight="800"
                >
                  THE FUTURE
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Text
                color="gray.600"
                fontSize={{ base: "md", md: "xl" }}
                maxW="580px"
                lineHeight="1.6"
                fontWeight="500"
              >
                Experience futuristic shopping with premium collections,
                immersive design, ultra-fast delivery, and products people
                actually fall in love with.
              </Text>
            </MotionBox>

            {/* BUTTONS */}
            <MotionBox variants={itemVariants}>
              <HStack spacing={5} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
                <Button
                  size="lg"
                  h="60px"
                  px={8}
                  rounded="full"
                  bgGradient="linear(to-r, #7c3aed, #2563eb)"
                  color="white"
                  fontWeight="bold"
                  fontSize="md"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 20px 30px -12px rgba(37,99,235,0.4)",
                  }}
                  transition="all 0.25s"
                  rightIcon={<FaArrowRight />}
                >
                  Start Shopping
                </Button>

                <Button
                  size="lg"
                  h="60px"
                  px={7}
                  rounded="full"
                  bg="rgba(255,255,255,0.9)"
                  color="gray.700"
                  border="1px solid rgba(0,0,0,0.08)"
                  boxShadow="0 4px 12px rgba(0,0,0,0.02)"
                  leftIcon={<FaPlay />}
                  _hover={{
                    bg: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                  }}
                  transition="all 0.25s"
                >
                  Watch Demo
                </Button>
              </HStack>
            </MotionBox>

            {/* STATS with staggered entrance */}
            <MotionSimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={4}
              pt={6}
              w="100%"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                ["120K+", "Customers"],
                ["4.9★", "Ratings"],
                ["1K+", "Brands"],
                ["24H", "Delivery"],
              ].map(([value, label], index) => (
                <MotionBox
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 400 } }}
                  bg="rgba(255,255,255,0.7)"
                  border="1px solid rgba(0,0,0,0.06)"
                  backdropFilter="blur(12px)"
                  rounded="2xl"
                  p={4}
                  boxShadow="0 8px 20px rgba(0,0,0,0.02)"
                >
                  <Heading size="lg" color="gray.800" fontWeight="800">
                    {value}
                  </Heading>
                  <Text color="gray.500" mt={1} fontSize="sm" fontWeight="500">
                    {label}
                  </Text>
                </MotionBox>
              ))}
            </MotionSimpleGrid>
          </MotionFlex>

          {/* RIGHT SIDE - 3D Parallax & Floating Cards */}
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="100%"
            minH={{ base: "460px", lg: "700px" }}
          >
            {/* MAIN CIRCLE with tilt and rotation */}
            <MotionBox
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              position="relative"
              style={{ perspective: 1000 }}
            >
              <MotionCircle
                size={{ base: "280px", md: "460px", lg: "560px" }}
                bg="rgba(255,255,255,0.6)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255,255,255,0.8)"
                boxShadow="0 25px 50px -12px rgba(0,0,0,0.15)"
                overflow="hidden"
                position="relative"
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
              >
                {/* Rotating ring effect */}
                <MotionCircle
                  size="102%"
                  position="absolute"
                  top="-1%"
                  left="-1%"
                  border="2px solid"
                  borderColor="rgba(124,58,237,0.3)"
                  borderTopColor="transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <Image
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
                  alt="Fashion model"
                  objectFit="cover"
                  w="88%"
                  h="88%"
                  rounded="full"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.02)" }}
                />
              </MotionCircle>
            </MotionBox>

            {/* FLOATING PRODUCT CARD 1 - Top Left */}
            <MotionBox
              position="absolute"
              top={{ base: "5%", lg: "8%" }}
              left={{ base: "0%", lg: "2%" }}
              animate={{
                y: [0, -18, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", type: "spring", stiffness: 100 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ x: useTransform(springX, [-300, 300], [-15, 15]) }}
              zIndex={3}
              whileHover={{ scale: 1.08, rotate: 0, transition: { type: "spring", stiffness: 400 } }}
            >
              <GlassProductCard product={products[0]} />
            </MotionBox>

            {/* FLOATING PRODUCT CARD 2 - Bottom Right */}
            <MotionBox
              position="absolute"
              bottom={{ base: "8%", lg: "12%" }}
              right={{ base: "0%", lg: "2%" }}
              animate={{
                y: [0, 18, 0],
                rotate: [0, -2, 2, 0],
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", type: "spring", stiffness: 90 },
                rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ x: useTransform(springX, [-300, 300], [15, -15]) }}
              zIndex={3}
              whileHover={{ scale: 1.08, rotate: 0, transition: { type: "spring", stiffness: 400 } }}
            >
              <GlassProductCard product={products[1]} />
            </MotionBox>

            {/* FLOATING PRODUCT CARD 3 - Left side (desktop only) */}
            <MotionBox
              position="absolute"
              bottom="30%"
              left="-30px"
              display={{ base: "none", md: "block" }}
              animate={{
                x: [0, 16, 0],
                rotate: [0, 3, -3, 0],
              }}
              transition={{
                x: { duration: 4.2, repeat: Infinity, ease: "easeInOut", type: "spring", stiffness: 110 },
                rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ y: useTransform(springY, [-300, 300], [-20, 20]) }}
              zIndex={3}
              whileHover={{ scale: 1.08, rotate: 0, transition: { type: "spring", stiffness: 400 } }}
            >
              <GlassProductCard product={products[2]} />
            </MotionBox>

            {/* FLOATING ICON - Shopping Bag with mouse follow */}
            <MotionBox
              position="absolute"
              top="22%"
              right="8%"
              animate={{
                rotate: [0, 12, 0],
                y: [0, -12, 0],
              }}
              transition={{
                rotate: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ x: useTransform(springX, [-300, 300], [25, -25]), y: useTransform(springY, [-300, 300], [-15, 15]) }}
              zIndex={3}
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <Circle
                size="70px"
                bg="rgba(255,255,255,0.85)"
                backdropFilter="blur(8px)"
                border="1px solid rgba(255,255,255,0.5)"
                boxShadow="0 12px 24px -8px rgba(0,0,0,0.1)"
              >
                <Icon as={FaShoppingBag} color="#7c3aed" boxSize={7} />
              </Circle>
            </MotionBox>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

// Glass product card with hover bounce
const GlassProductCard = ({ product }: { product: typeof products[0] }) => {
  return (
    <MotionBox
      w={{ base: "160px", md: "210px" }}
      bg="rgba(255,255,255,0.85)"
      border="1px solid rgba(255,255,255,0.8)"
      backdropFilter="blur(12px)"
      rounded="2xl"
      overflow="hidden"
      boxShadow="0 20px 35px -12px rgba(0,0,0,0.12)"
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: "0 30px 40px -12px rgba(0,0,0,0.2)",
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
    >
      <Box position="relative">
        <Image
          src={product.image}
          alt={product.title}
          h="160px"
          w="100%"
          objectFit="cover"
        />
        <Circle
          size="34px"
          bg="white"
          position="absolute"
          top={3}
          right={3}
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          cursor="pointer"
          // whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
          // transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon as={FaHeart} color="#ef4444" boxSize={4} />
        </Circle>
      </Box>

      <VStack align="start" spacing={1.5} p={3}>
        <Text color="gray.800" fontWeight="bold" fontSize="sm" noOfLines={1}>
          {product.title}
        </Text>

        <HStack justify="space-between" w="100%">
          <Text color="#6d28d9" fontWeight="extrabold" fontSize="md">
            {product.price}
          </Text>

          <HStack spacing={0.5}>
            <Icon as={FaStar} color="#f59e0b" boxSize={3.5} />
            <Text color="gray.600" fontSize="xs" fontWeight="medium">
              {product.rating}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

export default HeroSection;