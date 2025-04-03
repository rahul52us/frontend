'use client';

import {
  Heading, Text, Button, VStack, Box, HStack, Icon, Image
} from "@chakra-ui/react";
import { FaStore, FaShoppingCart, FaHandshake } from "react-icons/fa";

export default function AboutPage() {
  return (
    <VStack spacing={10} align="center" p={10} maxW="900px" mx="auto">

      {/* Hero Section */}
      <VStack spacing={4} textAlign="center">
        <Heading as="h1" size="2xl" color="brand.primary">
          Welcome to BusinessSahayata
        </Heading>
        <Text fontSize="lg" color="gray.700" px={6} maxW="750px">
          Your one-stop platform connecting **local vendors** with **customers** to make shopping more **accessible, convenient, and community-driven**.
        </Text>
      </VStack>

      {/* Image Section */}
      <Image
        src="https://plus.unsplash.com/premium_photo-1661497675847-2075003562fd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29ycG9yYXRlfGVufDB8fDB8fHww"
        alt="BusinessSahayata Market"
        borderRadius="lg"
        boxShadow="lg"
      />

      {/* Feature Highlights */}
      <HStack spacing={6} w="full" justify="center">
        <FeatureCard
          icon={FaStore}
          title="Empowering Local Shops"
          description="Vendors can easily register, showcase their products, and grow their businesses online."
        />
        <FeatureCard
          icon={FaShoppingCart}
          title="Seamless Shopping Experience"
          description="Customers can browse nearby shops, compare prices, and buy with confidence."
        />
        <FeatureCard
          icon={FaHandshake}
          title="Community Support"
          description="We help local businesses thrive while ensuring customers get the best products from trusted vendors."
        />
      </HStack>

      {/* Mission Statement */}
      <Box textAlign="center" bg="gray.100" p={6} borderRadius="lg" w="full">
        <Text fontSize="xl" fontWeight="bold" color="brand.secondary">
          Our Mission
        </Text>
        <Text fontSize="md" color="gray.600" mt={2}>
          To **bridge the gap** between vendors and customers, making shopping hyper-local, **more efficient, and digitally empowered** for everyone.
        </Text>
      </Box>

      {/* Call-to-Action */}
      <Button variant="solid" colorScheme="teal" size="lg" mt={6}>
        Explore Local Shops
      </Button>
    </VStack>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <VStack
    bg="white"
    p={5}
    borderRadius="lg"
    boxShadow="md"
    textAlign="center"
    maxW="250px"
  >
    <Icon as={icon} w={10} h={10} color="teal.500" />
    <Heading as="h3" size="md" mt={3}>
      {title}
    </Heading>
    <Text fontSize="sm" color="gray.600">
      {description}
    </Text>
  </VStack>
);
