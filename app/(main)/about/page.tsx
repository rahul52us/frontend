'use client';

import {
  Box,
  Text,
  Flex,
  Button,
  Heading,
  Container,
  SimpleGrid,
  VStack,
  Icon,
  Avatar,
  Badge,
  Circle,
  HStack,
  Image,
  Stack,
} from '@chakra-ui/react';

import {
  FaStore,
  FaRocket,
  FaUsers,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaGift,
} from 'react-icons/fa';
import { FiTrendingUp, FiCompass, FiZap } from 'react-icons/fi';

// ================= DATA =================
const features = [
  {
    icon: FaStore,
    title: 'Empowering Vendors',
    desc: 'We help local businesses grow digitally with smarter tools and better visibility.',
    color: 'blue',
  },
  {
    icon: FaShoppingCart,
    title: 'Smarter Shopping',
    desc: 'Discover nearby stores, compare products, and shop with confidence.',
    color: 'cyan',
  },
  {
    icon: FaHeart,
    title: 'Community First',
    desc: 'Every purchase supports local families and strengthens communities.',
    color: 'purple',
  },
];

const steps = [
  {
    icon: FaStore,
    title: 'Discover Shops',
    desc: 'Find trusted nearby vendors instantly.',
    color: 'blue',
  },
  {
    icon: FaUsers,
    title: 'Compare & Explore',
    desc: 'View products, ratings, and pricing easily.',
    color: 'cyan',
  },
  {
    icon: FaRocket,
    title: 'Shop Easily',
    desc: 'Order online or visit stores directly.',
    color: 'purple',
  },
];

const reviews = [
  {
    name: 'Priya Sharma',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'BusinessSahayata helped me discover amazing nearby stores and made local shopping incredibly simple.',
    rating: 5,
  },
  {
    name: 'Amit Joshi',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'This platform helped my offline store attract more customers and grow digitally.',
    rating: 5,
  },
];

// ================= MAIN COMPONENT =================
export default function AboutPage() {
  return (
    <Box bg="gray.50" overflow="hidden">

      {/* ================= HERO SECTION ================= */}
      <Box
        minH="90vh"
        position="relative"
        bgGradient="linear(135deg, #0f172a 0%, #1e3a8a 100%)"
      >
        <Container maxW="1200px" position="relative" zIndex={2} py={{ base: 20, md: 28 }}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={{ base: 12, lg: 16 }}
          >
            {/* Left Content */}
            <VStack flex={1} align={{ base: 'center', lg: 'start' }} textAlign={{ base: 'center', lg: 'left' }} spacing={6}>
              <Badge
                bg="whiteAlpha.300"
                backdropFilter="blur(8px)"
                color="white"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="600"
              >
                <HStack spacing={2}>
                  <Icon as={FiZap} />
                  <Text>Empowering Local Businesses Digitally</Text>
                </HStack>
              </Badge>

              <Heading
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontWeight="900"
                lineHeight="1.1"
                color="white"
              >
                Discover.
                <Text as="span" bgGradient="linear(135deg, #60a5fa, #c084fc)" bgClip="text">
                  {' '}Support. Grow.
                </Text>
              </Heading>

              <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.200" maxW="lg">
                BusinessSahayata connects customers with trusted local vendors,
                making shopping smarter, faster, and more community‑focused.
              </Text>

              <HStack spacing={4} flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
                <Button
                  bgGradient="linear(135deg, #3b82f6, #2563eb)"
                  color="white"
                  size="lg"
                  borderRadius="full"
                  px={8}
                  rightIcon={<FiTrendingUp />}
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                >
                  Explore Shops
                </Button>
                <Button
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  color="white"
                  size="lg"
                  borderRadius="full"
                  px={8}
                  transition="all 0.2s"
                  _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                >
                  Become Vendor
                </Button>
              </HStack>
            </VStack>

            {/* Right Image with Floating Stats */}
            <Box flex={1} position="relative">
              <Box
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="2xl"
                transition="all 0.3s"
                _hover={{ transform: 'rotate(0deg) scale(1.02)' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2070&auto=format&fit=crop"
                  alt="Shopping"
                  w="100%"
                  h={{ base: '300px', md: '450px' }}
                  objectFit="cover"
                />
              </Box>

              {/* Floating Card 1 */}
              <Box
                position="absolute"
                bottom={{ base: '-20px', md: '-30px' }}
                left={{ base: '-10px', md: '-30px' }}
                bg="white"
                p={5}
                borderRadius="2xl"
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <Heading size="lg" color="blue.600">20K+</Heading>
                <Text fontWeight="500">Happy Customers</Text>
              </Box>

              {/* Floating Card 2 */}
              <Box
                position="absolute"
                top={{ base: '-10px', md: '-20px' }}
                right={{ base: '-10px', md: '-20px' }}
                bg="white"
                p={4}
                borderRadius="2xl"
                boxShadow="xl"
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <HStack>
                  <Icon as={FaStar} color="yellow.400" />
                  <Text fontWeight="bold">4.9 Rating</Text>
                </HStack>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* ================= FEATURES ================= */}
      <Container maxW="1200px" py={{ base: 16, md: 24 }}>
        <VStack spacing={3} textAlign="center" mb={12}>
          <Badge colorScheme="blue" px={3} py={1} borderRadius="full">WHY CHOOSE US</Badge>
          <Heading size="2xl" fontWeight="800">Designed for Local Growth</Heading>
          <Text color="gray.600" fontSize="lg" maxW="2xl">Modern tools that empower both shoppers and vendors</Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {features.map((item, i) => (
            <FeatureCard key={i} {...item} />
          ))}
        </SimpleGrid>
      </Container>

      {/* ================= ABOUT SECTION ================= */}
      <Box bg="white" py={{ base: 16, md: 24 }}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <Box position="relative">
              <Box borderRadius="3xl" overflow="hidden" boxShadow="2xl" transition="0.3s" _hover={{ transform: 'scale(1.02)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1974&auto=format&fit=crop"
                  alt="Team"
                  w="100%"
                  h={{ base: '350px', md: '500px' }}
                  objectFit="cover"
                />
              </Box>
              <Box
                position="absolute"
                bottom="-20px"
                right="-20px"
                bgGradient="linear(135deg, #3b82f6, #2563eb)"
                color="white"
                p={6}
                borderRadius="2xl"
                boxShadow="xl"
                transition="0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <Heading size="2xl">100+</Heading>
                <Text fontWeight="600">Cities Connected</Text>
              </Box>
            </Box>

            <VStack align="start" spacing={6}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">OUR STORY</Badge>
              <Heading size="2xl" fontWeight="800">Transforming Local Shopping into a Modern Experience</Heading>
              <Text color="gray.600" fontSize="lg">
                BusinessSahayata bridges the gap between local businesses and modern customers.
                We help users discover trusted nearby stores while empowering vendors with
                digital visibility, growth opportunities, and stronger customer connections.
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
                <InfoItem text="✓ Trusted Local Vendors" />
                <InfoItem text="✓ Modern Shopping Experience" />
                <InfoItem text="✓ Fast Business Growth" />
                <InfoItem text="✓ Community Driven Platform" />
              </SimpleGrid>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Container maxW="1200px" py={{ base: 16, md: 24 }}>
        <VStack spacing={3} textAlign="center" mb={12}>
          <Badge colorScheme="blue" px={3} py={1} borderRadius="full">SIMPLE PROCESS</Badge>
          <Heading size="2xl" fontWeight="800">Get Started in 3 Easy Steps</Heading>
          <Text color="gray.600" fontSize="lg">From discovery to delivery – we make it seamless</Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {steps.map((item, i) => (
            <StepCard key={i} {...item} index={i} />
          ))}
        </SimpleGrid>
      </Container>

      {/* ================= TESTIMONIALS ================= */}
      <Box bg="white" py={{ base: 16, md: 24 }}>
        <Container maxW="1200px">
          <VStack spacing={3} textAlign="center" mb={12}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">LOVED BY USERS</Badge>
            <Heading size="2xl" fontWeight="800">Real Experiences</Heading>
            <Text color="gray.600" fontSize="lg">What our community says about us</Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {reviews.map((item, i) => (
              <TestimonialCard key={i} {...item} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ================= MISSION SECTION ================= */}
      <Container maxW="1200px" py={{ base: 16, md: 24 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <VStack align="start" spacing={6}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">OUR MISSION</Badge>
            <Heading size="2xl" fontWeight="800">Building Stronger Communities Through Technology</Heading>
            <Text color="gray.600" fontSize="lg">
              Our mission is to empower local businesses with modern digital tools while helping
              customers shop locally with trust, convenience, and confidence.
            </Text>
            <Button
              bgGradient="linear(135deg, #3b82f6, #2563eb)"
              color="white"
              size="lg"
              borderRadius="full"
              px={8}
              rightIcon={<FiCompass />}
              transition="0.2s"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            >
              Learn More
            </Button>
          </VStack>

          <Box borderRadius="3xl" overflow="hidden" boxShadow="2xl" transition="0.3s" _hover={{ transform: 'scale(1.02)' }}>
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
              alt="Mission"
              w="100%"
              h={{ base: '350px', md: '450px' }}
              objectFit="cover"
            />
          </Box>
        </SimpleGrid>
      </Container>

      {/* ================= CTA BANNER ================= */}
      <Container maxW="1100px" py={{ base: 12, md: 20 }}>
        <Box
          borderRadius="3xl"
          overflow="hidden"
          bgGradient="linear(135deg, #1e3a8a, #3b82f6)"
          p={{ base: 10, md: 16 }}
          textAlign="center"
          boxShadow="2xl"
          transition="0.3s"
          _hover={{ transform: 'scale(1.02)' }}
        >
          <Icon as={FaGift} boxSize={12} color="whiteAlpha.800" mb={4} />
          <Heading size="2xl" color="white" mb={4}>Ready To Support Local Businesses?</Heading>
          <Text color="whiteAlpha.900" fontSize="lg" maxW="2xl" mx="auto" mb={8}>
            Join thousands of customers and vendors creating a smarter, stronger,
            and more connected local shopping experience.
          </Text>
          <Button
            bg="white"
            color="blue.600"
            size="lg"
            borderRadius="full"
            px={10}
            rightIcon={<FiTrendingUp />}
            transition="0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ================= SUBCOMPONENTS =================
const FeatureCard = ({ icon, title, desc, color }) => {
  const colorMap = { blue: 'blue.50', cyan: 'cyan.50', purple: 'purple.50' };
  const iconColorMap = { blue: 'blue.500', cyan: 'cyan.500', purple: 'purple.500' };
  return (
    <Box
      bg="white"
      p={8}
      borderRadius="3xl"
      boxShadow="lg"
      textAlign="center"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-8px)', boxShadow: 'xl' }}
    >
      <Circle size="70px" bg={colorMap[color]} mx="auto" mb={5}>
        <Icon as={icon} boxSize={7} color={iconColorMap[color]} />
      </Circle>
      <Heading size="md" mb={3}>{title}</Heading>
      <Text color="gray.600">{desc}</Text>
    </Box>
  );
};

const StepCard = ({ icon, title, desc, index }) => {
  const gradients = ['blue', 'cyan', 'purple'];
  const bgGradients = {
    blue: 'linear(135deg, #eff6ff, #dbeafe)',
    cyan: 'linear(135deg, #ecfeff, #cffafe)',
    purple: 'linear(135deg, #faf5ff, #f3e8ff)',
  };
  const color = gradients[index % gradients.length];
  return (
    <Flex
      bg={bgGradients[color]}
      p={6}
      borderRadius="2xl"
      align="center"
      gap={5}
      transition="all 0.3s"
      _hover={{ transform: 'translateX(8px)', boxShadow: 'md' }}
    >
      <Circle size="50px" bg="white" boxShadow="md">
        <Icon as={icon} boxSize={6} color={`${color}.500`} />
      </Circle>
      <Box>
        <Heading size="sm" mb={1}>{title}</Heading>
        <Text fontSize="sm" color="gray.600">{desc}</Text>
      </Box>
    </Flex>
  );
};

const TestimonialCard = ({ name, img, text, rating }) => (
  <Box bg="white" p={6} borderRadius="3xl" boxShadow="lg" transition="0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}>
    <HStack spacing={4} mb={4}>
      <Avatar src={img} name={name} size="md" />
      <Box>
        <Text fontWeight="bold">{name}</Text>
        <HStack spacing={1}>
          {[...Array(rating)].map((_, i) => <Icon key={i} as={FaStar} color="yellow.400" boxSize={3} />)}
        </HStack>
      </Box>
    </HStack>
    <Text color="gray.600" fontStyle="italic">"{text}"</Text>
  </Box>
);

const InfoItem = ({ text }) => (
  <HStack spacing={3}>
    <Circle size="8px" bg="blue.500" />
    <Text fontWeight="500">{text}</Text>
  </HStack>
);