import { Box, Container, Flex, Image, Text, VStack, HStack, Icon, Link, Heading, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const ShopFooterSection = ({ shopData }: any) => {
  const currentYear = new Date().getFullYear();

  // Marquee items for brand slogans
  const marqueeItems = [
    shopData.name,
    "PURVEYOR OF FINERIES",
    "ESTABLISHED " + currentYear,
    "THE PRISM STANDARD",
    "CRAFTED FOR EXCELLENCE"
  ];

  return (
    <Box
      as="footer"
      bg="gray.900"
      color="white"
      pt={12}
      pb={8}
      position="relative"
    >
      <Container maxW="container.xl" px={8}>
        {/* kinetic Micro-Marquee - Integrated */}
        <Box
          w="full"
          borderY="1px solid"
          borderColor="whiteAlpha.100"
          py={4}
          mb={16}
          position="relative"
          overflow="hidden"
        >
          <Flex
            as={motion.div}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity } as any}
            w="max-content"
            gap="60px"
          >
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <Text
                key={idx}
                fontSize="9px"
                fontWeight="800"
                letterSpacing="4px"
                opacity={0.3}
                whiteSpace="nowrap"
                color="white"
              >
                {item.toUpperCase()}
              </Text>
            ))}
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12} mb={16}>
          {/* Column 1: Brand Signature */}
          <VStack align="flex-start" spacing={6}>
            <Box
              bg="white"
              p={3}
              borderRadius="xl"
            >
              <Image
                src={shopData.logo?.url}
                alt={shopData.name}
                boxSize="40px"
                objectFit="contain"
              />
            </Box>
            <VStack align="flex-start" spacing={1}>
              <Heading size="sm" fontWeight="800" letterSpacing="-0.02em">{shopData.name}</Heading>
              <Text fontSize="10px" fontWeight="800" color="gray.500" letterSpacing="1px">PRISM CERTIFIED VENDOR</Text>
            </VStack>
          </VStack>

          {/* Column 2: Navigation */}
          <VStack align="flex-start" spacing={5}>
            <Text fontSize="xs" fontWeight="800" color="whiteAlpha.400" letterSpacing="2px">DISCOVER</Text>
            <VStack align="flex-start" spacing={3}>
              {['COLLECTIONS', 'ATELIER', 'LEGACY', 'PRESENCE'].map((link) => (
                <Link
                  key={link}
                  _hover={{ textDecoration: "none", color: "blue.400" }}
                  fontSize="xs"
                  fontWeight="700"
                  color="whiteAlpha.700"
                  transition="all 0.2s"
                >
                  {link}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Column 3: Experience */}
          <VStack align="flex-start" spacing={5}>
            <Text fontSize="xs" fontWeight="800" color="whiteAlpha.400" letterSpacing="2px">EXPERIENCE</Text>
            <VStack align="flex-start" spacing={3}>
              {['BOOKINGS', 'ENQUIRIES', 'PORTFOLIO', 'STUDIO'].map((link) => (
                <Link
                  key={link}
                  _hover={{ textDecoration: "none", color: "blue.400" }}
                  fontSize="xs"
                  fontWeight="700"
                  color="whiteAlpha.700"
                  transition="all 0.2s"
                >
                  {link}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Column 4: Social & Utils */}
          <VStack align="flex-start" spacing={5}>
            <Text fontSize="xs" fontWeight="800" color="whiteAlpha.400" letterSpacing="2px">CONNECT</Text>
            <HStack spacing={4}>
              {[FiInstagram, FiTwitter, FiFacebook].map((Social, i) => (
                <Link key={i} _hover={{ color: "blue.400", transform: "translateY(-2px)" }} transition="all 0.2s">
                  <Icon as={Social} boxSize={5} />
                </Link>
              ))}
            </HStack>
            <VStack align="flex-start" spacing={1} pt={2}>
              <Text fontSize="10px" fontWeight="700" color="whiteAlpha.500">Based in Digital Presence</Text>
              <Text fontSize="9px" fontWeight="700" color="whiteAlpha.300">ESTD {String(currentYear)}</Text>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="whiteAlpha.100" pt={8}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="10px" fontWeight="700" color="whiteAlpha.300" letterSpacing="1px">
              © {String(currentYear)} {shopData.name.toUpperCase()} • ALL RIGHTS RESERVED
            </Text>
            <HStack spacing={8}>
              <Link fontSize="9px" fontWeight="700" color="whiteAlpha.300" _hover={{ color: "white" }}>PRIVACY</Link>
              <Link fontSize="9px" fontWeight="700" color="whiteAlpha.300" _hover={{ color: "white" }}>TERMS</Link>
              <Link fontSize="9px" fontWeight="700" color="whiteAlpha.300" _hover={{ color: "white" }}>COOKIES</Link>
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ShopFooterSection;
