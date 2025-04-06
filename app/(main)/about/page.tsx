'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Icon,
  SimpleGrid,
  Button,
  Avatar,
} from '@chakra-ui/react';
import {
  FaStore,
  FaRocket,
  FaUsers,
  FaShoppingCart,
  FaMapMarkedAlt,
  FaHeart,
} from 'react-icons/fa';

export default function AboutPage() {

  return (
    <VStack spacing={12} px={{ base: 4, md: 10 }} py={10} maxW="1200px" mx="auto" align="stretch">

      {/* Hero Section */}
      <Box
        bgImage="url(https://images.unsplash.com/photo-1521791136064-7986c2920216)"
        bgSize="cover"
        bgPosition="center"
        borderRadius="xl"
        color="white"
        textAlign="center"
        py={{ base: 20, md: 28 }}
        px={6}
        position="relative"
        boxShadow="2xl"
      >
        <Box bg="blackAlpha.600" borderRadius="xl" p={6}>
          <Heading size="2xl" mb={4}>Empowering Local Businesses</Heading>
          <Text fontSize="lg" maxW="700px" mx="auto">
            BusinessSahayata connects you with nearby vendors to make shopping
            more personal, efficient, and community-focused.
          </Text>
          <Button mt={6} size="lg" colorScheme="teal">
            Discover Local Shops
          </Button>
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box textAlign="center">
        <Heading size="xl" mb={4}>Why BusinessSahayata?</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
          <InfoCard icon={FaStore} title="Vendor First" description="Easy onboarding and tools to help local vendors grow online." />
          <InfoCard icon={FaShoppingCart} title="Shop Smart" description="Browse nearby shops, compare deals, and shop directly." />
          <InfoCard icon={FaHeart} title="Support Local" description="Your purchases empower families and support real people." />
        </SimpleGrid>
      </Box>

      {/* How It Works (Timeline Style) */}
      <Box bg="gray.50" borderRadius="lg" p={6}>
        <Heading size="lg" textAlign="center" mb={8}>How It Works</Heading>
        <VStack spacing={6}>
          <StepItem icon={FaMapMarkedAlt} title="1. Discover Nearby Shops" desc="Search or use location to find vendors around you." />
          <StepItem icon={FaUsers} title="2. Browse & Compare" desc="View products, prices, and shop ratings easily." />
          <StepItem icon={FaRocket} title="3. Order or Visit" desc="Place orders online or visit your preferred shops directly." />
        </VStack>
      </Box>

      {/* Mission Section */}
      <Box textAlign="center" py={10}>
        <Heading size="lg">Our Mission</Heading>
        <Text mt={4} maxW="700px" mx="auto" fontSize="md" color="gray.600">
          We aim to bridge the digital divide for local businesses while giving
          users a smarter way to shop — rooted in trust, locality, and convenience.
        </Text>
      </Box>

      {/* Testimonials */}
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading size="lg" textAlign="center" mb={6}>What People Say</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Testimonial
            name="Priya Sharma"
            image="https://randomuser.me/api/portraits/women/44.jpg"
            text="I love how easy it is to find shops in my area and support local businesses!"
          />
          <Testimonial
            name="Amit Joshi"
            image="https://randomuser.me/api/portraits/men/32.jpg"
            text="BusinessSahayata helped me grow my offline store online in just days."
          />
        </SimpleGrid>
      </Box>

      {/* Final CTA */}
      <Box textAlign="center">
        <Button size="lg" colorScheme="teal" px={10} py={6}>
          Get Started Today
        </Button>
      </Box>
    </VStack>
  );
}

// Info Card Component
const InfoCard = ({ icon, title, description }) => (
  <VStack bg="white" p={6} borderRadius="lg" boxShadow="md" spacing={4} textAlign="center" _hover={{ boxShadow: "xl" }}>
    <Icon as={icon} w={10} h={10} color="teal.500" />
    <Heading size="md">{title}</Heading>
    <Text fontSize="sm" color="gray.600">{description}</Text>
  </VStack>
);

// Timeline Step Component
const StepItem = ({ icon, title, desc }) => (
  <Stack direction="row" spacing={4} align="center">
    <Box boxSize="12" bg="teal.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
      <Icon as={icon} w={6} h={6} color="teal.600" />
    </Box>
    <Box>
      <Heading size="sm">{title}</Heading>
      <Text fontSize="sm" color="gray.600">{desc}</Text>
    </Box>
  </Stack>
);

// Testimonial Component
const Testimonial = ({ name, image, text }) => (
  <Stack direction="row" spacing={4} align="center" bg="gray.50" p={4} borderRadius="md">
    <Avatar name={name} src={image} />
    <Box>
      <Text fontWeight="bold">{name}</Text>
      <Text fontSize="sm" color="gray.600">{text}</Text>
    </Box>
  </Stack>
);
