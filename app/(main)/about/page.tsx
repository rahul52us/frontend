'use client';

import {
  Box,
  Text,
  Flex,
  Stack,
  Button,
  Heading,
  Container,
  SimpleGrid,
  VStack,
  Icon,
  Avatar,
} from '@chakra-ui/react';

import {
  FaStore,
  FaRocket,
  FaUsers,
  FaHeart,
  FaShoppingCart,
} from 'react-icons/fa';

/* ================= DATA ================= */

const features = [
  {
    icon: FaStore,
    title: 'Empowering Vendors',
    desc: 'We help local businesses grow digitally with smarter tools and better visibility.',
  },
  {
    icon: FaShoppingCart,
    title: 'Smarter Shopping',
    desc: 'Discover nearby stores, compare products, and shop with confidence.',
  },
  {
    icon: FaHeart,
    title: 'Community First',
    desc: 'Every purchase supports local families and strengthens communities.',
  },
];

const steps = [
  {
    icon: FaStore,
    title: 'Discover Shops',
    desc: 'Find trusted nearby vendors instantly.',
  },
  {
    icon: FaUsers,
    title: 'Compare & Explore',
    desc: 'View products, ratings, and pricing easily.',
  },
  {
    icon: FaRocket,
    title: 'Shop Easily',
    desc: 'Order online or visit stores directly.',
  },
];

const reviews = [
  {
    name: 'Priya Sharma',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'BusinessSahayata helped me discover amazing nearby stores and made local shopping incredibly simple.',
  },
  {
    name: 'Amit Joshi',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'This platform helped my offline store attract more customers and grow digitally.',
  },
];

/* ================= PAGE ================= */

export default function AboutPage() {
  return (
    <Box bg="gray.50" overflow="hidden">

      {/* ================= HERO ================= */}

      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
      >

        {/* BACKGROUND */}
        <Box
          position="absolute"
          inset={0}
          bgImage="url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')"
          bgSize="cover"
          bgPosition="center"
        />

        {/* OVERLAY */}
        <Box
          position="absolute"
          inset={0}
          bg="blackAlpha.700"
        />

        <Container
          maxW="1200px"
          position="relative"
          zIndex={2}
          py={{ base: 24, md: 32 }}
        >

          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={{ base: 14, md: 20 }}
            align="center"
          >

            {/* LEFT */}
            <VStack
              flex={1}
              align={{ base: 'center', lg: 'start' }}
              textAlign={{ base: 'center', lg: 'left' }}
              spacing={7}
              color="white"
            >

              <Text
                bg="whiteAlpha.200"
                px={5}
                py={2}
                rounded="full"
                backdropFilter="blur(10px)"
                fontWeight="600"
              >
                🌍 Empowering Local Businesses Digitally
              </Text>

              <Heading
                fontSize={{ base: '4xl', md: '6xl' }}
                lineHeight="1"
                fontWeight="900"
              >
                Discover.
                <Text color="teal.300">
                  Support. Grow.
                </Text>
              </Heading>

              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.200"
                maxW="650px"
                lineHeight="tall"
              >
                BusinessSahayata connects customers with trusted local vendors,
                making shopping smarter, faster, and more community-focused.
              </Text>

              <Stack
                direction={{ base: 'column', sm: 'row' }}
                spacing={4}
                w={{ base: 'full', sm: 'auto' }}
              >

                <Button
                  colorScheme="teal"
                  size="lg"
                  rounded="full"
                  px={8}
                  w={{ base: 'full', sm: 'auto' }}
                >
                  Explore Shops
                </Button>

                <Button
                  variant="outline"
                  borderColor="white"
                  color="white"
                  size="lg"
                  rounded="full"
                  w={{ base: 'full', sm: 'auto' }}
                  _hover={{
                    bg: 'whiteAlpha.200',
                  }}
                >
                  Become Vendor
                </Button>

              </Stack>
            </VStack>

            {/* RIGHT IMAGE */}
            <Box flex={1} position="relative" w="full">

              <Box
                overflow="hidden"
                rounded="3xl"
                shadow="2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2070&auto=format&fit=crop"
                  alt=""
                  style={{
                    width: '100%',
                    height: '550px',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* FLOATING CARD */}
              <Box
                position="absolute"
                bottom="-20px"
                left="-20px"
                bg="white"
                p={5}
                rounded="2xl"
                shadow="2xl"
              >
                <Heading color="teal.500">
                  20K+
                </Heading>

                <Text color="gray.600">
                  Happy Customers
                </Text>
              </Box>

            </Box>

          </Stack>
        </Container>
      </Box>

      {/* ================= FEATURES ================= */}

      <Container maxW="1200px" py={{ base: 20, md: 28 }}>

        <VStack spacing={4} textAlign="center" mb={16}>

          <Heading size="2xl">
            Why Choose Us
          </Heading>

          <Text color="gray.600" fontSize="lg">
            Smart local shopping with modern convenience
          </Text>

        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>

          {features.map((item, i) => (
            <Card key={i} {...item} />
          ))}

        </SimpleGrid>
      </Container>

      {/* ================= ABOUT SECTION ================= */}

      <Container maxW="1200px" py={{ base: 10, md: 20 }}>

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={16}
          alignItems="center"
        >

          {/* IMAGE */}
          <Box position="relative">

            <Box
              overflow="hidden"
              rounded="3xl"
              shadow="2xl"
            >

              <img
                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1974&auto=format&fit=crop"
                alt=""
                style={{
                  width: '100%',
                  height: '650px',
                  objectFit: 'cover',
                }}
              />

            </Box>

            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              bg="teal.500"
              color="white"
              p={6}
              rounded="2xl"
              shadow="2xl"
            >
              <Heading>100+</Heading>
              <Text>Cities Connected</Text>
            </Box>

          </Box>

          {/* CONTENT */}
          <VStack align="start" spacing={6}>

            <Text
              color="teal.500"
              fontWeight="bold"
              letterSpacing="wide"
            >
              ABOUT BUSINESSSAHAYATA
            </Text>

            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              lineHeight="1.1"
            >
              Transforming Local Shopping Into A Modern Experience
            </Heading>

            <Text
              color="gray.600"
              fontSize="lg"
              lineHeight="tall"
            >
              BusinessSahayata bridges the gap between local businesses
              and modern customers. We help users discover trusted nearby
              stores while empowering vendors with digital visibility,
              growth opportunities, and stronger customer connections.
            </Text>

            <Stack spacing={4} w="full">

              <Info text="Trusted Local Vendors" />
              <Info text="Modern Shopping Experience" />
              <Info text="Fast Business Growth" />
              <Info text="Community Driven Platform" />

            </Stack>

          </VStack>

        </SimpleGrid>
      </Container>

      {/* ================= HOW IT WORKS ================= */}

      <Box bg="white">

        <Container maxW="1200px" py={{ base: 20, md: 28 }}>

          <VStack spacing={4} textAlign="center" mb={16}>

            <Heading size="2xl">
              How It Works
            </Heading>

            <Text color="gray.600" fontSize="lg">
              Start shopping locally in 3 simple steps
            </Text>

          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>

            {steps.map((item, i) => (
              <Card key={i} {...item} />
            ))}

          </SimpleGrid>

        </Container>
      </Box>

      {/* ================= TESTIMONIALS ================= */}

      <Container maxW="1200px" py={{ base: 20, md: 28 }}>

        <VStack spacing={4} textAlign="center" mb={16}>

          <Heading size="2xl">
            Loved By Users
          </Heading>

          <Text color="gray.600" fontSize="lg">
            Real experiences from our customers
          </Text>

        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>

          {reviews.map((item, i) => (
            <Review key={i} {...item} />
          ))}

        </SimpleGrid>

      </Container>

      {/* ================= MISSION ================= */}

      <Box bg="white">

        <Container maxW="1200px" py={{ base: 20, md: 28 }}>

          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={16}
            alignItems="center"
          >

            {/* CONTENT */}
            <VStack align="start" spacing={6}>

              <Text
                color="teal.500"
                fontWeight="bold"
                letterSpacing="wide"
              >
                OUR MISSION
              </Text>

              <Heading
                fontSize={{ base: '3xl', md: '5xl' }}
                lineHeight="1.1"
              >
                Building Stronger Communities Through Technology
              </Heading>

              <Text
                color="gray.600"
                fontSize="lg"
                lineHeight="tall"
              >
                Our mission is to empower local businesses with modern digital
                tools while helping customers shop locally with trust,
                convenience, and confidence.
              </Text>

              <Button
                colorScheme="teal"
                size="lg"
                rounded="full"
                px={8}
              >
                Learn More
              </Button>

            </VStack>

            {/* IMAGE */}
            <Box
              overflow="hidden"
              rounded="3xl"
              shadow="2xl"
            >

              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt=""
                style={{
                  width: '100%',
                  height: '600px',
                  objectFit: 'cover',
                }}
              />

            </Box>

          </SimpleGrid>

        </Container>
      </Box>

      {/* ================= CTA ================= */}

      <Container maxW="1100px" py={{ base: 16, md: 24 }}>

        <Box
          position="relative"
          overflow="hidden"
          rounded="3xl"
          p={{ base: 10, md: 20 }}
          textAlign="center"
          color="white"
          shadow="2xl"
        >

          {/* BACKGROUND */}
          <Box
            position="absolute"
            inset={0}
            bgImage="url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop')"
            bgSize="cover"
            bgPosition="center"
          />

          {/* OVERLAY */}
          <Box
            position="absolute"
            inset={0}
            bg="blackAlpha.700"
          />

          <Box position="relative">

            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              mb={5}
            >
              Ready To Support Local Businesses?
            </Heading>

            <Text
              color="gray.200"
              mb={8}
              maxW="650px"
              mx="auto"
              fontSize="lg"
            >
              Join thousands of customers and vendors creating a smarter,
              stronger, and more connected local shopping experience.
            </Text>

            <Button
              colorScheme="teal"
              size="lg"
              rounded="full"
              px={10}
            >
              Get Started
            </Button>

          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/* ================= CARD ================= */

const Card = ({ icon, title, desc }) => (
  <VStack
    bg="white"
    p={8}
    rounded="3xl"
    shadow="lg"
    spacing={5}
    textAlign="center"
    transition="all .3s ease"
    _hover={{
      transform: 'translateY(-8px)',
      shadow: '2xl',
    }}
  >

    <Flex
      boxSize="80px"
      rounded="full"
      bg="teal.50"
      align="center"
      justify="center"
    >
      <Icon
        as={icon}
        boxSize={8}
        color="teal.500"
      />
    </Flex>

    <Heading size="md">
      {title}
    </Heading>

    <Text color="gray.600">
      {desc}
    </Text>

  </VStack>
);

/* ================= REVIEW ================= */

const Review = ({ name, img, text }) => (
  <Box
    bg="white"
    p={8}
    rounded="3xl"
    shadow="xl"
    transition="all .3s ease"
    _hover={{
      transform: 'translateY(-6px)',
    }}
  >

    <Stack direction="row" spacing={5} mb={5}>

      <Avatar
        src={img}
        name={name}
        size="lg"
      />

      <Box>
        <Text fontWeight="bold">
          {name}
        </Text>

        <Text color="gray.500">
          Happy Customer
        </Text>
      </Box>

    </Stack>

    <Text color="gray.600" lineHeight="tall">
      "{text}"
    </Text>

  </Box>
);

/* ================= INFO ================= */

const Info = ({ text }) => (
  <Flex
    bg="white"
    p={5}
    rounded="xl"
    shadow="md"
    align="center"
    gap={4}
  >

    <Box
      boxSize="12px"
      bg="teal.500"
      rounded="full"
    />

    <Text fontWeight="600">
      {text}
    </Text>

  </Flex>
);