'use client';

import { 
  Box, 
  Grid, 
  GridItem, 
  Image, 
  Text, 
  Flex, 
  Heading, 
  Button, 
  Icon, 
  Badge,
  useColorModeValue,
  VStack,
  HStack
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  FiHeart, 
  FiTrendingUp, 
  FiZap, 
  FiGift, 
  FiArrowRight,
  FiMusic,
  FiShoppingBag,
  FiCamera,
  FiClock,
  FiStar
} from 'react-icons/fi';

const BentoGridSection = () => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Color mode values
    const overlayGradient = useColorModeValue(
        'linear(to-t, blackAlpha.800, blackAlpha.200)',
        'linear(to-t, blackAlpha.900, blackAlpha.300)'
    );
    const badgeBg = useColorModeValue('white', 'gray.800');
    const badgeColor = useColorModeValue('gray.800', 'white');
    const cardBg = useColorModeValue('white', 'gray.800');
    const sectionBg = useColorModeValue('gray.50', 'gray.900');

    const featuredItems = [
        {
            id: 'hero',
            title: "Minimalist Tech",
            subtitle: "Clean lines. Powerful performance. Premium quality.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
            category: "Editor's Pick",
            icon: FiZap,
            badge: "⚡ FEATURED"
        },
        {
            id: 'audio',
            title: "Premium Audio",
            subtitle: "Immersive sound experience",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
            category: "Audio",
            icon: FiMusic,
            badge: "🎧 NEW ARRIVAL"
        },
        {
            id: 'sneakers',
            title: "Street Style",
            subtitle: "Limited edition drops",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
            category: "Sneakers",
            icon: FiShoppingBag,
            badge: "👟 TRENDING"
        }
    ];

    return (
        <Box 
            maxW="100%" 
            px={{ base: 4, sm: 6, md: 8, lg: 12 }} 
            py={{ base: 8, md: 12, lg: 16 }}
            bg={sectionBg}
        >
            {/* Header Section */}
            <Flex 
                justify="space-between" 
                align={{ base: 'flex-start', sm: 'flex-end' }}
                direction={{ base: 'column', sm: 'row' }}
                gap={{ base: 3, sm: 0 }}
                mb={{ base: 8, md: 10 }}
            >
                <Box>
                    <HStack spacing={2} mb={2}>
                        <Box 
                            w="40px" 
                            h="3px" 
                            bgGradient="linear(90deg, purple.500, pink.500)" 
                            borderRadius="full"
                        />
                        <Text 
                            fontSize={{ base: "10px", sm: "xs" }} 
                            fontWeight="800" 
                            bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                            bgClip="text"
                            letterSpacing="widest" 
                            textTransform="uppercase"
                        >
                            Curated Just For You
                        </Text>
                    </HStack>
                    <Heading 
                        size={{ base: "lg", md: "xl", lg: "2xl" }} 
                        fontWeight="900"
                        lineHeight="1.2"
                        letterSpacing="-0.02em"
                    >
                        Discover Amazing
                        <Box as="span" display="block" color="purple.500">
                            Collections ✨
                        </Box>
                    </Heading>
                </Box>
                <Button
                    variant="ghost"
                    color="purple.500"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="bold"
                    rightIcon={<FiArrowRight />}
                    _hover={{ 
                        bg: "purple.50",
                        transform: "translateX(5px)"
                    }}
                    transition="all 0.3s"
                >
                    EXPLORE ALL
                </Button>
            </Flex>

            {/* Bento Grid */}
            <Grid
                templateAreas={{
                    base: `
                        "hero"
                        "audio"
                        "sneakers"
                        "promo"
                        "trending"
                    `,
                    sm: `
                        "hero hero"
                        "audio sneakers"
                        "promo promo"
                        "trending trending"
                    `,
                    md: `
                        "hero hero audio"
                        "hero hero sneakers"
                        "promo promo promo"
                        "trending trending trending"
                    `,
                    lg: `
                        "hero hero hero audio"
                        "hero hero hero sneakers"
                        "promo promo promo promo"
                        "trending trending trending trending"
                    `
                }}
                gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
                gap={{ base: 4, md: 5, lg: 6 }}
            >
                {/* Hero Item - Large Featured */}
                <GridItem 
                    area="hero" 
                    position="relative" 
                    borderRadius={{ base: "2xl", md: "3xl" }} 
                    overflow="hidden" 
                    bg="gray.100"
                    cursor="pointer"
                    role="group"
                    h={{ base: "400px", sm: "450px", md: "500px", lg: "550px" }}
                    onMouseEnter={() => setIsHovered('hero')}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => router.push('/collections/featured')}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.01)" }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"
                        alt="Featured collection"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s ease"
                        _groupHover={{ transform: 'scale(1.08)' }}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient="linear(to-t, blackAlpha.800, blackAlpha.200, transparent)"
                    />
                    
                    {/* Badge */}
                    <Badge
                        position="absolute"
                        top={4}
                        left={4}
                        bg={badgeBg}
                        color={badgeColor}
                        px={3}
                        py={1.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="bold"
                        boxShadow="md"
                    >
                        🔥 HOT PICK
                    </Badge>

                    <Box position="absolute" bottom={6} left={6} right={6} color="white">
                        <Flex align="center" gap={2} mb={2}>
                            <Icon as={FiTrendingUp} boxSize={4} />
                            <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
                                TRENDING NOW
                            </Text>
                        </Flex>
                        <Heading size={{ base: "md", md: "lg", lg: "xl" }} mb={2}>
                            Minimalist Tech
                        </Heading>
                        <Text fontSize={{ base: "sm", md: "md" }} opacity={0.95} noOfLines={2}>
                            Discover the cleanest setup essentials for modern workspace
                        </Text>
                        <Button
                            mt={4}
                            bg="white"
                            color="gray.900"
                            size={{ base: "sm", md: "md" }}
                            borderRadius="full"
                            rightIcon={<FiArrowRight />}
                            _hover={{ 
                                transform: "translateX(5px)",
                                bg: "gray.100"
                            }}
                            transition="all 0.3s"
                            opacity={isHovered === 'hero' ? 1 : 0}
                            transform={isHovered === 'hero' ? 'translateY(0)' : 'translateY(20px)'}
                        >
                            Shop Now
                        </Button>
                    </Box>
                </GridItem>

                {/* Audio Item */}
                <GridItem 
                    area="audio"
                    position="relative" 
                    borderRadius={{ base: "xl", md: "2xl" }} 
                    overflow="hidden"
                    cursor="pointer"
                    role="group"
                    h={{ base: "280px", sm: "300px", md: "240px" }}
                    onMouseEnter={() => setIsHovered('audio')}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => router.push('/collections/audio')}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.02)" }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                        alt="Audio collection"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s ease"
                        _groupHover={{ transform: 'scale(1.1)' }}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.100)"
                    />
                    
                    {/* Category Icon */}
                    <Flex
                        position="absolute"
                        top={4}
                        right={4}
                        bg="whiteAlpha.200"
                        backdropFilter="blur(10px)"
                        borderRadius="full"
                        p={2}
                        align="center"
                        justify="center"
                    >
                        <Icon as={FiMusic} boxSize={5} color="white" />
                    </Flex>

                    <Box position="absolute" bottom={4} left={4} right={4} color="white">
                        <Badge
                            bg="linear(135deg, #f093fb 0%, #f5576c 100%)"
                            color="white"
                            mb={2}
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize="10px"
                        >
                            🎧 NEW
                        </Badge>
                        <Heading size="sm" mb={1}>
                            Premium Audio
                        </Heading>
                        <Text fontSize="xs" opacity={0.9}>
                            Immersive sound experience
                        </Text>
                    </Box>
                </GridItem>

                {/* Sneakers Item */}
                <GridItem 
                    area="sneakers"
                    position="relative" 
                    borderRadius={{ base: "xl", md: "2xl" }} 
                    overflow="hidden"
                    cursor="pointer"
                    role="group"
                    h={{ base: "280px", sm: "300px", md: "240px" }}
                    onMouseEnter={() => setIsHovered('sneakers')}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => router.push('/collections/sneakers')}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.02)" }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                        alt="Sneakers collection"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s ease"
                        _groupHover={{ transform: 'scale(1.1)' }}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.100)"
                    />
                    
                    <Flex
                        position="absolute"
                        top={4}
                        right={4}
                        bg="whiteAlpha.200"
                        backdropFilter="blur(10px)"
                        borderRadius="full"
                        p={2}
                        align="center"
                        justify="center"
                    >
                        <Icon as={FiShoppingBag} boxSize={5} color="white" />
                    </Flex>

                    <Box position="absolute" bottom={4} left={4} right={4} color="white">
                        <Badge
                            bg="linear(135deg, #fa709a 0%, #fee140 100%)"
                            color="white"
                            mb={2}
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize="10px"
                        >
                            👟 TRENDING
                        </Badge>
                        <Heading size="sm" mb={1}>
                            Street Style
                        </Heading>
                        <Text fontSize="xs" opacity={0.9}>
                            Limited edition drops
                        </Text>
                    </Box>
                </GridItem>

                {/* Promo Banner - Summer Sale */}
                <GridItem 
                    area="promo" 
                    position="relative" 
                    borderRadius={{ base: "xl", md: "3xl" }} 
                    overflow="hidden"
                    cursor="pointer"
                    role="group"
                    h={{ base: "180px", sm: "200px", md: "160px" }}
                    onMouseEnter={() => setIsHovered('promo')}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => router.push('/sale')}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.01)" }}
                >
                    <Box
                        w="100%"
                        h="100%"
                        bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                        position="relative"
                    >
                        {/* Decorative circles */}
                        <Box
                            position="absolute"
                            top="-20%"
                            right="-10%"
                            w="200px"
                            h="200px"
                            borderRadius="full"
                            bg="whiteAlpha.100"
                        />
                        <Box
                            position="absolute"
                            bottom="-30%"
                            left="-10%"
                            w="250px"
                            h="250px"
                            borderRadius="full"
                            bg="whiteAlpha.100"
                        />
                        
                        <Flex 
                            h="100%" 
                            align="center" 
                            px={{ base: 6, md: 8, lg: 12 }}
                            justify="space-between" 
                            direction={{ base: 'column', sm: 'row' }}
                            py={{ base: 6, md: 0 }}
                            position="relative"
                            zIndex={2}
                        >
                            <Box color="white" textAlign={{ base: 'center', sm: 'left' }}>
                                <Flex align="center" gap={2} mb={2} justify={{ base: 'center', sm: 'flex-start' }}>
                                    <Icon as={FiGift} boxSize={5} />
                                    <Text fontWeight="bold" fontSize="sm">
                                        SUMMER SALE
                                    </Text>
                                </Flex>
                                <Heading size={{ base: "sm", md: "md", lg: "lg" }} mb={1}>
                                    Up to 50% Off
                                </Heading>
                                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.95}>
                                    On all seasonal items • Limited time
                                </Text>
                            </Box>
                            <Button
                                bg="white"
                                color="purple.600"
                                borderRadius="full"
                                px={{ base: 6, md: 8 }}
                                fontWeight="bold"
                                size={{ base: "sm", md: "md" }}
                                _hover={{ 
                                    transform: "scale(1.05)",
                                    bg: "gray.100"
                                }}
                                transition="all 0.3s"
                                rightIcon={<FiArrowRight />}
                                mt={{ base: 3, sm: 0 }}
                            >
                                GRAB DEAL
                            </Button>
                        </Flex>
                    </Box>
                </GridItem>

                {/* Trending Section */}
                <GridItem 
                    area="trending" 
                    position="relative"
                    h="auto"
                >
                    <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        gap={4}
                        h="100%"
                    >
                        {/* Live Counter Card */}
                        <Box
                            flex={1}
                            bgGradient="linear(135deg, #f093fb 0%, #f5576c 100%)"
                            borderRadius={{ base: "xl", md: "2xl" }}
                            p={{ base: 4, md: 6 }}
                            color="white"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                        >
                            <Flex align="center" gap={2} mb={3}>
                                <Icon as={FiClock} boxSize={5} />
                                <Text fontWeight="bold" fontSize="sm">FLASH SALE ENDS IN</Text>
                            </Flex>
                            <Flex gap={3} mb={3}>
                                <Box>
                                    <Heading size="2xl">{String(timeLeft.hours).padStart(2, '0')}</Heading>
                                    <Text fontSize="xs">HOURS</Text>
                                </Box>
                                <Heading size="2xl">:</Heading>
                                <Box>
                                    <Heading size="2xl">{String(timeLeft.minutes).padStart(2, '0')}</Heading>
                                    <Text fontSize="xs">MINS</Text>
                                </Box>
                                <Heading size="2xl">:</Heading>
                                <Box>
                                    <Heading size="2xl">{String(timeLeft.seconds).padStart(2, '0')}</Heading>
                                    <Text fontSize="xs">SECS</Text>
                                </Box>
                            </Flex>
                            <Button
                                size="sm"
                                variant="outline"
                                color="white"
                                borderColor="white"
                                borderRadius="full"
                                w="full"
                                _hover={{ bg: "white", color: "pink.500" }}
                                transition="all 0.3s"
                            >
                                Shop Flash Sale
                            </Button>
                        </Box>

                        {/* Trending Items */}
                        <Box
                            flex={2}
                            bg={cardBg}
                            borderRadius={{ base: "xl", md: "2xl" }}
                            p={{ base: 4, md: 6 }}
                            boxShadow="sm"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                        >
                            <Flex align="center" gap={2} mb={4}>
                                <Icon as={FiHeart} color="red.500" />
                                <Text fontWeight="bold" fontSize="sm">
                                    Most Loved This Week
                                </Text>
                            </Flex>
                            <VStack spacing={3} align="stretch">
                                {[
                                    { name: "Wireless Headphones", sold: "2.3k", icon: FiMusic, rating: 4.9 },
                                    { name: "Smart Watch Series", sold: "1.8k", icon: FiCamera, rating: 4.8 },
                                    { name: "Premium Backpack", sold: "1.2k", icon: FiShoppingBag, rating: 4.7 }
                                ].map((item, idx) => (
                                    <Flex key={idx} justify="space-between" align="center">
                                        <Flex align="center" gap={2}>
                                            <Flex
                                                bg={useColorModeValue('gray.100', 'gray.700')}
                                                p={1.5}
                                                borderRadius="full"
                                            >
                                                <Icon as={item.icon} boxSize={3} />
                                            </Flex>
                                            <Box>
                                                <Text fontSize="sm" fontWeight="500">{item.name}</Text>
                                                <Flex align="center" gap={1}>
                                                    <Icon as={FiStar} boxSize={2.5} color="yellow.400" fill="yellow.400" />
                                                    <Text fontSize="xs" color="gray.500">{item.rating}</Text>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                        <Text fontSize="xs" color="green.500" fontWeight="bold">
                                            +{item.sold} sold
                                        </Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </Flex>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default BentoGridSection;