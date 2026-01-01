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
import { motion } from "framer-motion";
import { FiSend, FiArrowUpRight, FiHeart } from "react-icons/fi";
import ContactSection from "./components/ContactSection";
// FooterSection import removed to resolve 'no-unused-vars' error
import { footerData } from "./components/footerData";
import Conditions from "./components/Conditions";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === "transition",
});

export const Footer: React.FC = () => {
  const accentColor = "#FF6F61";
  const bgDeep = "#050505"; 

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
      {/* 1. ARTISTIC BACKGROUND ELEMENTS */}
      <Box
        position="absolute"
        top="-10%"
        left="-5%"
        w="600px"
        h="600px"
        bgGradient={`radial(${accentColor}22 0%, transparent 70%)`}
        filter="blur(100px)"
        zIndex={0}
      />
      
      <Container maxW="container.xl" position="relative" zIndex={1}>
        
        {/* 2. THE LOVEABLE NEWSLETTER CARD */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          bg="whiteAlpha.50"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius={{ base: "3xl", md: "full" }}
          p={{ base: 8, md: 2 }}
          pl={{ md: 12 }}
          align="center"
          justify="space-between"
          mb={24}
          boxShadow="0 20px 50px rgba(0,0,0,0.3)"
        >
          <VStack align={{ base: "center", md: "flex-start" }} spacing={0} mb={{ base: 6, md: 0 }}>
            <Text fontSize="xl" fontWeight="bold">Join the inner circle</Text>
            <Text fontSize="sm" color="whiteAlpha.600">Get 10% off your first order & exclusive drops.</Text>
          </VStack>
          
          <HStack 
            w={{ base: "full", md: "auto" }} 
            as="form" 
            spacing={0} 
            bg="whiteAlpha.100" 
            rounded="full" 
            p={1}
            border="1px solid"
            borderColor="whiteAlpha.100"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input 
              variant="unstyled" 
              placeholder="Your email address" 
              px={6} 
              fontSize="sm"
              _placeholder={{ color: "whiteAlpha.400" }}
            />
            <Button 
              bg={accentColor} 
              color="white" 
              rounded="full" 
              px={8} 
              h="50px"
              _hover={{ bg: "white", color: "black", transform: "scale(1.05)" }}
              transition="0.3s cubic-bezier(.47,1.64,.41,.8)"
              rightIcon={<FiSend />}
            >
              Subscribe
            </Button>
          </HStack>
        </Flex>

        {/* 3. CORE ARCHITECTURE GRID */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
          spacing={{ base: 12, md: 8 }}
          mb={20}
        >
          <Stack spacing={6} gridColumn={{ lg: "span 2" }}>
            <Heading fontSize="2xl" fontWeight="900" letterSpacing="tighter">
              BUSINESS<chakra.span color={accentColor}>SAHAYATA</chakra.span>
            </Heading>
            <Text color="whiteAlpha.600" fontSize="md" lineHeight="1.7" maxW="320px">
              Redefining the digital marketplace with curated solutions for the modern entrepreneur. 
              Built for speed, styled for life.
            </Text>
            <HStack spacing={4}>
              {footerData.companyInfo.socialLinks.map((social) => (
                <Link key={social.name} href={social.url} isExternal>
                  <MotionBox
                    whileHover={{ y: -5, color: accentColor }}
                    transition={{ duration: 0.2 } as any}
                    fontSize="xl"
                    color="whiteAlpha.500"
                  >
                    <Icon as={social.icon} />
                  </MotionBox>
                </Link>
              ))}
            </HStack>
          </Stack>

          {footerData.sections.map((section) => (
            <VStack key={section.title} align="flex-start" spacing={5}>
              <Text fontSize="sm" fontWeight="800" letterSpacing="widest" color="whiteAlpha.400">
                {section.title.toUpperCase()}
              </Text>
              <VStack align="flex-start" spacing={3}>
                {section.links.map((link: any) => (
                  <Link 
                    key={link.name} 
                    href={link.url || link.href}
                    fontSize="md"
                    color="whiteAlpha.800"
                    _hover={{ color: accentColor, paddingLeft: "8px" }}
                    transition="0.2s ease"
                    display="flex"
                    alignItems="center"
                    role="group"
                  >
                    {link.name}
                    <Icon 
                      as={FiArrowUpRight} 
                      boxSize={3} 
                      ml={1} 
                      opacity={0} 
                      _groupHover={{ opacity: 1, transform: "translate(2px, -2px)" }} 
                      transition="0.2s"
                    />
                  </Link>
                ))}
              </VStack>
            </VStack>
          ))}

          <VStack align="flex-start" spacing={5}>
              <Text fontSize="sm" fontWeight="800" letterSpacing="widest" color="whiteAlpha.400">
                GET IN TOUCH
              </Text>
              <ContactSection contactInfo={footerData.contactInfo} />
              <Conditions />
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mb={10} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={6}
          fontSize="xs"
          color="whiteAlpha.500"
        >
          <HStack spacing={1}>
            <Text>© {new Date().getFullYear()} Made with</Text>
            <Icon as={FiHeart} color={accentColor} />
            <Text>by {footerData.companyInfo.name}</Text>
          </HStack>

          <HStack spacing={8} wrap="wrap" justify="center">
            {footerData.legalLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                _hover={{ color: "white" }}
                letterSpacing="1px"
              >
                {link.name}
              </Link>
            ))}
          </HStack>

          <HStack spacing={4} opacity={0.4}>
             <Text fontSize="10px" fontWeight="bold" border="1px solid" px={2} py={0.5} rounded="md">VISA</Text>
             <Text fontSize="10px" fontWeight="bold" border="1px solid" px={2} py={0.5} rounded="md">STRIPE</Text>
             <Text fontSize="10px" fontWeight="bold" border="1px solid" px={2} py={0.5} rounded="md">PAYPAL</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};