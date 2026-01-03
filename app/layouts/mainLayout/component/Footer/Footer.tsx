'use client'
import {
  Box,
  Container,
  Divider,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  chakra,
  HStack,
  VStack,
  Input,
  Button,
  Heading,
  shouldForwardProp,
} from "@chakra-ui/react";
import React from "react";
import { motion, isValidMotionProp, Transition } from "framer-motion";
import { 
  FiSend, FiArrowUpRight, FiHeart, FiShoppingBag, 
  FiTag, FiShoppingCart, FiBox, FiTruck, FiStar, FiZap 
} from "react-icons/fi";
import ContactSection from "./components/ContactSection";
import { footerData } from "./components/footerData";
import Conditions from "./components/Conditions";

// 1. FIX: Refined shouldForwardProp logic
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const FloatingIcon = ({ icon, top, left, delay, duration = 6 }: any) => {
  // 2. FIX: Define the transition separately with a explicit type to avoid Chakra conflicts
  const iconTransition: Transition = {
    duration: duration,
    repeat: Infinity,
    delay: delay,
    ease: "easeInOut",
  };

  return (
    <MotionBox
      position="absolute"
      top={top}
      left={left}
      fontSize={{ base: "3xl", md: "5xl" }}
      color="skyblue"
      opacity={0.15}
      initial={{ y: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 15, -15, 0],
        opacity: [0.1, 0.2, 0.1],
      }}
      // @ts-ignore or 'as any' if the transition type still conflicts with Chakra
      transition={iconTransition as any}
      zIndex={1}
      pointerEvents="none"
    >
      <Icon as={icon} />
    </MotionBox>
  );
};

export const Footer: React.FC = () => {
  const accentColor = "#00BFFF";
  const bgDeep = "#050A14";

  return (
    <Box
      as="footer"
      bg={bgDeep}
      color="white"
      position="relative"
      overflow="hidden"
      pt={{ base: "20", md: "32" }}
      pb="10"
    >
      {/* Background Icons */}
      <FloatingIcon icon={FiShoppingCart} top="10%" left="5%" delay={0} duration={7} />
      <FloatingIcon icon={FiShoppingBag} top="25%" left="80%" delay={2} duration={8} />
      <FloatingIcon icon={FiTag} top="65%" left="10%" delay={4} duration={6} />
      <FloatingIcon icon={FiBox} top="15%" left="60%" delay={1} duration={9} />
      <FloatingIcon icon={FiTruck} top="80%" left="75%" delay={3} duration={7} />
      <FloatingIcon icon={FiStar} top="45%" left="45%" delay={5} duration={10} />
      <FloatingIcon icon={FiZap} top="5%" left="30%" delay={1.5} duration={5} />

      {/* Glow Effects */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="800px"
        h="800px"
        bgGradient={`radial(${accentColor}10 0%, transparent 70%)`}
        filter="blur(120px)"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        {/* Newsletter Section */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          bg="rgba(255, 255, 255, 0.02)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "3xl", md: "full" }}
          p={{ base: 8, md: 3 }}
          pl={{ md: 12 }}
          align="center"
          justify="space-between"
          mb={24}
        >
          <VStack align={{ base: "center", md: "flex-start" }} spacing={0} mb={{ base: 6, md: 0 }}>
            <Text fontSize="xl" fontWeight="bold">
              Join the <chakra.span color={accentColor}>inner circle</chakra.span>
            </Text>
            <Text fontSize="sm" color="whiteAlpha.600">Get 10% off your first order & exclusive drops.</Text>
          </VStack>
          
          <HStack 
            w={{ base: "full", md: "auto" }} 
            as="form" 
            bg="whiteAlpha.100" 
            rounded="full" 
            p={1.5}
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Input variant="unstyled" placeholder="Your email address" px={6} fontSize="sm" />
            <Button 
              bg={accentColor} 
              color="white" 
              rounded="full" 
              px={8} 
              h="54px"
              _hover={{ bg: "white", color: bgDeep }}
              rightIcon={<FiSend />}
            >
              Subscribe
            </Button>
          </HStack>
        </Flex>

        {/* Links Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8} mb={20}>
          <Stack spacing={6} gridColumn={{ lg: "span 2" }}>
            <Heading fontSize="2xl" fontWeight="900">
              BUSINESS<chakra.span color={accentColor}>SAHAYATA</chakra.span>
            </Heading>
            <Text color="whiteAlpha.500" fontSize="md" maxW="320px">
              Redefining the digital marketplace with curated solutions.
            </Text>
            <HStack spacing={4}>
              {footerData.companyInfo.socialLinks.map((social) => (
                <Link key={social.name} href={social.url} isExternal>
                  <MotionBox whileHover={{ y: -5, color: accentColor }} color="whiteAlpha.400">
                    <Icon as={social.icon} fontSize="xl" />
                  </MotionBox>
                </Link>
              ))}
            </HStack>
          </Stack>

          {footerData.sections.map((section) => (
            <VStack key={section.title} align="flex-start">
              <Text fontSize="xs" fontWeight="800" color={accentColor} mb={2}>
                {section.title.toUpperCase()}
              </Text>
              {section.links.map((link: any) => (
                <Link key={link.name} href={link.url || link.href} color="whiteAlpha.700" _hover={{ color: "white" }}>
                  {link.name}
                </Link>
              ))}
            </VStack>
          ))}

          <VStack align="flex-start">
              <Text fontSize="xs" fontWeight="800" color={accentColor} mb={2}>GET IN TOUCH</Text>
              <ContactSection contactInfo={footerData.contactInfo} />
              <Conditions />
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mb={10} />

        {/* Bottom Bar */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" color="whiteAlpha.400" fontSize="xs">
          <HStack>
            <Text>© {new Date().getFullYear()} Made with</Text>
            <MotionBox animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity } as any}>
              <Icon as={FiHeart} color={accentColor} />
            </MotionBox>
            <Text>by {footerData.companyInfo.name}</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};