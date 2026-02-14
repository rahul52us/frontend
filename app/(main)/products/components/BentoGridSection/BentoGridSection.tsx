'use client';

import { Box, Grid, GridItem, Image, Text, Flex, Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const BentoGridSection = () => {
    const router = useRouter();

    return (
        <Box maxW="100%" px={{ base: 4, md: 8 }} py={10}>
            <Flex justify="space-between" align="end" mb={6}>
                <Box>
                    <Text fontSize="xs" fontWeight="black" color="purple.500" letterSpacing="widest" textTransform="uppercase">
                        Curated Picks
                    </Text>
                    <Heading size="lg" fontWeight="900">Featured Collections</Heading>
                </Box>
                <Button variant="link" color="purple.600" fontSize="sm" fontWeight="bold">VIEW ALL</Button>
            </Flex>

            <Grid
                templateAreas={{
                    base: `
            "large"
            "small1"
            "small2"
            "wide"
          `,
                    md: `
            "large large small1"
            "large large small2"
            "wide wide wide"
          `
                }}
                gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gridTemplateRows={{ base: 'auto', md: '200px 200px 180px' }}
                gap={4}
            >
                <GridItem area="large" position="relative" borderRadius="3xl" overflow="hidden" bg="gray.100" role="group" cursor="pointer">
                    <Image
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                        alt="Feature 1"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)"
                        _groupHover={{ transform: 'scale(1.05)' }}
                    />
                    <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.700, transparent)" />
                    <Box position="absolute" bottom={6} left={6} color="white">
                        <Heading size="md" mb={2}>Minimalist Tech</Heading>
                        <Text fontSize="sm" opacity={0.9} noOfLines={2}>Discover the cleanest setup essentials.</Text>
                    </Box>
                </GridItem>

                <GridItem area="small1" position="relative" borderRadius="2xl" overflow="hidden" bg="purple.50" cursor="pointer" role="group">
                    <Image
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                        alt="Feature 2"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.6s"
                        _groupHover={{ transform: 'scale(1.1)' }}
                    />
                    <Box position="absolute" inset={0} bg="blackAlpha.200" />
                    <Center position="absolute" inset={0}>
                        <Text color="white" fontWeight="black" fontSize="lg">AUDIO</Text>
                    </Center>
                </GridItem>

                <GridItem area="small2" position="relative" borderRadius="2xl" overflow="hidden" bg="orange.50" cursor="pointer" role="group">
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
                        alt="Feature 3"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.6s"
                        _groupHover={{ transform: 'scale(1.1)' }}
                    />
                    <Box position="absolute" inset={0} bg="blackAlpha.200" />
                    <Center position="absolute" inset={0}>
                        <Text color="white" fontWeight="black" fontSize="lg">SNEAKERS</Text>
                    </Center>
                </GridItem>

                <GridItem area="wide" position="relative" borderRadius="3xl" overflow="hidden" bg="teal.500" cursor="pointer" role="group">
                    <Flex h="100%" align="center" px={8} justify="space-between" direction={{ base: 'column', md: 'row' }} py={{ base: 6, md: 0 }}>
                        <Box color="white">
                            <Heading size="md" mb={1}>Summer Sale Is Live</Heading>
                            <Text fontSize="sm">Get up to 50% off on all seasonal items.</Text>
                        </Box>
                        <Button bg="white" color="teal.600" borderRadius="full" px={8} fontWeight="bold" size="sm" _hover={{ bg: 'teal.50' }}>EXPLORE</Button>
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
};

import { Center } from '@chakra-ui/react';
export default BentoGridSection;
