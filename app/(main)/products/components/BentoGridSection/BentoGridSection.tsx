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
  HStack,
  Skeleton
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
  FiStar,
  FiBarChart2
} from 'react-icons/fi';

const BentoGridSection = () => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
    const [imageLoaded, setImageLoaded] = useState({
        hero: false,
        audio: false,
        sneakers: false
    });

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

    // Blue & White color mode values
    const sectionBg = useColorModeValue('blue.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const overlayGradient = useColorModeValue(
        'linear(to-t, blue.900 0%, blue.500 30%, transparent 70%)',
        'linear(to-t, blackAlpha.900, blackAlpha.300, transparent)'
    );
    const badgeBg = useColorModeValue('white', 'gray.800');
    const badgeColor = useColorModeValue('blue.800', 'white');
    const gradientText = useColorModeValue(
        'linear(135deg, #1e3a8a 0%, #3b82f6 100%)',
        'linear(135deg, #60a5fa 0%, #93c5fd 100%)'
    );
    const blueGradient = 'linear(135deg, #1e3a8a 0%, #3b82f6 100%)';
    const lightBlueGradient = 'linear(135deg, #3b82f6 0%, #93c5fd 100%)';

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
                gap={{ base: 4, sm: 0 }}
                mb={{ base: 8, md: 10 }}
            >
                <Box>
                    <HStack spacing={2} mb={2}>
                        <Box 
                            w={{ base: "30px", sm: "40px" }} 
                            h="3px" 
                            bgGradient={blueGradient} 
                            borderRadius="full"
                        />
                        <Text 
                            fontSize={{ base: "10px", sm: "xs" }} 
                            fontWeight="800" 
                            bgGradient={gradientText}
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
                        lineHeight={{ base: "1.3", md: "1.2" }}
                        letterSpacing="-0.02em"
                        color="blue.800"
                        _dark={{ color: "white" }}
                    >
                        Discover Amazing
                        <Box as="span" display="block" color="blue.600">
                            Collections ✨
                        </Box>
                    </Heading>
                </Box>
                <Button
                    variant="ghost"
                    color="blue.600"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="bold"
                    rightIcon={<FiArrowRight />}
                    _hover={{ 
                        bg: "blue.100",
                        transform: "translateX(5px)"
                    }}
                    transition="all 0.3s"
                    px={{ base: 3, md: 4 }}
                    size={{ base: "sm", md: "md" }}
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
                gridTemplateColumns={{ 
                    base: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)', 
                    lg: 'repeat(4, 1fr)' 
                }}
                gap={{ base: 4, md: 5, lg: 6 }}
            >
                {/* Hero Item */}
                <GridItem 
                    area="hero" 
                    position="relative" 
                    borderRadius={{ base: "2xl", md: "3xl" }} 
                    overflow="hidden" 
                    bg="blue.100"
                    cursor="pointer"
                    role="group"
                    h={{ base: "400px", sm: "450px", md: "500px", lg: "550px" }}
                    onMouseEnter={() => setIsHovered('hero')}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => router.push('/collections/featured')}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: { base: "none", md: "scale(1.01)" }, boxShadow: "xl" }}
                >
                    {!imageLoaded.hero && (
                        <Skeleton position="absolute" inset={0} zIndex={0} />
                    )}
                    <Image
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"
                        alt="Featured collection - Minimalist Tech"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                        _groupHover={{ transform: { base: "none", md: "scale(1.08)" } }}
                        onLoad={() => setImageLoaded(prev => ({ ...prev, hero: true }))}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient={overlayGradient}
                    />
                    
                    <Badge
                        position="absolute"
                        top={{ base: 3, md: 4 }}
                        left={{ base: 3, md: 4 }}
                        bg={badgeBg}
                        color={badgeColor}
                        px={{ base: 2, md: 3 }}
                        py={{ base: 1, md: 1.5 }}
                        borderRadius="full"
                        fontSize={{ base: "10px", md: "xs" }}
                        fontWeight="bold"
                        boxShadow="md"
                    >
                        🔥 HOT PICK
                    </Badge>

                    <Box 
                        position="absolute" 
                        bottom={{ base: 4, md: 6 }} 
                        left={{ base: 4, md: 6 }} 
                        right={{ base: 4, md: 6 }} 
                        color="white"
                    >
                        <Flex align="center" gap={2} mb={2}>
                            <Icon as={FiTrendingUp} boxSize={{ base: 3, md: 4 }} />
                            <Text fontSize={{ base: "10px", md: "xs" }} fontWeight="bold" letterSpacing="widest">
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
                            mt={{ base: 3, md: 4 }}
                            bg="white"
                            color="blue.700"
                            size={{ base: "sm", md: "md" }}
                            borderRadius="full"
                            rightIcon={<FiArrowRight />}
                            _hover={{ 
                                transform: "translateX(5px)",
                                bg: "blue.50"
                            }}
                            transition="all 0.3s"
                            opacity={isHovered === 'hero' ? { base: 1, md: 0 } : 1}
                            transform={isHovered === 'hero' ? 'translateY(0)' : { base: 'translateY(0)', md: 'translateY(20px)' }}
                            display={{ base: "inline-flex", md: isHovered === 'hero' ? "inline-flex" : "none" }}
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
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: { base: "none", md: "scale(1.02)" }, boxShadow: "lg" }}
                >
                    {!imageLoaded.audio && (
                        <Skeleton position="absolute" inset={0} zIndex={0} />
                    )}
                    <Image
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                        alt="Premium Audio headphones"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                        _groupHover={{ transform: { base: "none", md: "scale(1.1)" } }}
                        onLoad={() => setImageLoaded(prev => ({ ...prev, audio: true }))}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.100)"
                    />
                    
                    <Flex
                        position="absolute"
                        top={{ base: 3, md: 4 }}
                        right={{ base: 3, md: 4 }}
                        bg="whiteAlpha.300"
                        backdropFilter="blur(10px)"
                        borderRadius="full"
                        p={2}
                        align="center"
                        justify="center"
                    >
                        <Icon as={FiMusic} boxSize={{ base: 4, md: 5 }} color="white" />
                    </Flex>

                    <Box position="absolute" bottom={{ base: 3, md: 4 }} left={{ base: 3, md: 4 }} right={{ base: 3, md: 4 }} color="white">
                        <Badge
                            bgGradient={lightBlueGradient}
                            color="white"
                            mb={2}
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: "8px", md: "10px" }}
                        >
                            🎧 NEW
                        </Badge>
                        <Heading size="sm" mb={1}>
                            Premium Audio
                        </Heading>
                        <Text fontSize={{ base: "10px", md: "xs" }} opacity={0.9}>
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
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: { base: "none", md: "scale(1.02)" }, boxShadow: "lg" }}
                >
                    {!imageLoaded.sneakers && (
                        <Skeleton position="absolute" inset={0} zIndex={0} />
                    )}
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                        alt="Street Style sneakers"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                        _groupHover={{ transform: { base: "none", md: "scale(1.1)" } }}
                        onLoad={() => setImageLoaded(prev => ({ ...prev, sneakers: true }))}
                    />
                    <Box 
                        position="absolute" 
                        inset={0} 
                        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.100)"
                    />
                    
                    <Flex
                        position="absolute"
                        top={{ base: 3, md: 4 }}
                        right={{ base: 3, md: 4 }}
                        bg="whiteAlpha.300"
                        backdropFilter="blur(10px)"
                        borderRadius="full"
                        p={2}
                        align="center"
                        justify="center"
                    >
                        <Icon as={FiShoppingBag} boxSize={{ base: 4, md: 5 }} color="white" />
                    </Flex>

                    <Box position="absolute" bottom={{ base: 3, md: 4 }} left={{ base: 3, md: 4 }} right={{ base: 3, md: 4 }} color="white">
                        <Badge
                            bgGradient="linear(135deg, #3b82f6 0%, #1e3a8a 100%)"
                            color="white"
                            mb={2}
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: "8px", md: "10px" }}
                        >
                            👟 TRENDING
                        </Badge>
                        <Heading size="sm" mb={1}>
                            Street Style
                        </Heading>
                        <Text fontSize={{ base: "10px", md: "xs" }} opacity={0.9}>
                            Limited edition drops
                        </Text>
                    </Box>
                </GridItem>

                {/* Promo Banner - Blue theme */}
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
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: { base: "none", md: "scale(1.01)" }, boxShadow: "lg" }}
                >
                    <Box
                        w="100%"
                        h="100%"
                        bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
                        position="relative"
                    >
                        <Box
                            position="absolute"
                            top="-20%"
                            right="-10%"
                            w={{ base: "150px", md: "200px" }}
                            h={{ base: "150px", md: "200px" }}
                            borderRadius="full"
                            bg="whiteAlpha.100"
                        />
                        <Box
                            position="absolute"
                            bottom="-30%"
                            left="-10%"
                            w={{ base: "200px", md: "250px" }}
                            h={{ base: "200px", md: "250px" }}
                            borderRadius="full"
                            bg="whiteAlpha.100"
                        />
                        
                        <Flex 
                            h="100%" 
                            align="center" 
                            px={{ base: 4, md: 6, lg: 8 }}
                            justify="space-between" 
                            direction={{ base: 'column', sm: 'row' }}
                            py={{ base: 4, md: 0 }}
                            position="relative"
                            zIndex={2}
                            textAlign={{ base: 'center', sm: 'left' }}
                        >
                            <Box color="white">
                                <Flex align="center" gap={2} mb={2} justify={{ base: 'center', sm: 'flex-start' }}>
                                    <Icon as={FiGift} boxSize={{ base: 4, md: 5 }} />
                                    <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>
                                        SUMMER SALE
                                    </Text>
                                </Flex>
                                <Heading size={{ base: "sm", md: "md", lg: "lg" }} mb={1}>
                                    Up to 50% Off
                                </Heading>
                                <Text fontSize={{ base: "10px", md: "sm" }} opacity={0.95}>
                                    On all seasonal items • Limited time
                                </Text>
                            </Box>
                            <Button
                                bg="white"
                                color="blue.700"
                                borderRadius="full"
                                px={{ base: 4, md: 6, lg: 8 }}
                                fontWeight="bold"
                                size={{ base: "sm", md: "md" }}
                                _hover={{ 
                                    transform: "scale(1.05)",
                                    bg: "blue.50"
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
                        {/* Live Counter Card - Blue gradient */}
                        <Box
                            flex={1}
                            bgGradient="linear(135deg, #2563eb 0%, #1e3a8a 100%)"
                            borderRadius={{ base: "xl", md: "2xl" }}
                            p={{ base: 4, md: 6 }}
                            color="white"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ transform: { base: "none", md: "translateY(-5px)" }, boxShadow: "xl" }}
                        >
                            <Flex align="center" gap={2} mb={3}>
                                <Icon as={FiClock} boxSize={{ base: 4, md: 5 }} />
                                <Text fontWeight="bold" fontSize={{ base: "10px", md: "sm" }}>FLASH SALE ENDS IN</Text>
                            </Flex>
                            <Flex gap={2} mb={3} wrap="wrap">
                                <Box>
                                    <Heading size={{ base: "lg", md: "2xl" }}>{String(timeLeft.hours).padStart(2, '0')}</Heading>
                                    <Text fontSize={{ base: "9px", md: "xs" }}>HOURS</Text>
                                </Box>
                                <Heading size={{ base: "lg", md: "2xl" }}>:</Heading>
                                <Box>
                                    <Heading size={{ base: "lg", md: "2xl" }}>{String(timeLeft.minutes).padStart(2, '0')}</Heading>
                                    <Text fontSize={{ base: "9px", md: "xs" }}>MINS</Text>
                                </Box>
                                <Heading size={{ base: "lg", md: "2xl" }}>:</Heading>
                                <Box>
                                    <Heading size={{ base: "lg", md: "2xl" }}>{String(timeLeft.seconds).padStart(2, '0')}</Heading>
                                    <Text fontSize={{ base: "9px", md: "xs" }}>SECS</Text>
                                </Box>
                            </Flex>
                            <Button
                                size={{ base: "xs", md: "sm" }}
                                variant="outline"
                                color="white"
                                borderColor="white"
                                borderRadius="full"
                                w="full"
                                _hover={{ bg: "white", color: "blue.600" }}
                                transition="all 0.3s"
                            >
                                Shop Flash Sale
                            </Button>
                        </Box>

                        {/* Trending Items - White card with blue accents */}
                        <Box
                            flex={2}
                            bg={cardBg}
                            borderRadius={{ base: "xl", md: "2xl" }}
                            p={{ base: 4, md: 6 }}
                            boxShadow="sm"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ transform: { base: "none", md: "translateY(-5px)" }, boxShadow: "lg" }}
                        >
                            <Flex align="center" gap={2} mb={4}>
                                <Icon as={FiBarChart2} color="blue.500" />
                                <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} color="blue.700" _dark={{ color: "white" }}>
                                    Most Loved This Week
                                </Text>
                            </Flex>
                            <VStack spacing={3} align="stretch">
                                {[
                                    { name: "Wireless Headphones", sold: "2.3k", icon: FiMusic, rating: 4.9 },
                                    { name: "Smart Watch Series", sold: "1.8k", icon: FiCamera, rating: 4.8 },
                                    { name: "Premium Backpack", sold: "1.2k", icon: FiShoppingBag, rating: 4.7 }
                                ].map((item, idx) => (
                                    <Flex 
                                        key={idx} 
                                        justify="space-between" 
                                        align="center"
                                        direction={{ base: 'column', xs: 'row' }}
                                        gap={{ base: 2, xs: 0 }}
                                        pb={idx !== 2 ? 2 : 0}
                                        borderBottom={idx !== 2 ? "1px solid" : "none"}
                                        borderColor="gray.100"
                                        _dark={{ borderColor: "gray.700" }}
                                    >
                                        <Flex align="center" gap={2}>
                                            <Flex
                                                bg="blue.50"
                                                _dark={{ bg: "gray.700" }}
                                                p={1.5}
                                                borderRadius="full"
                                            >
                                                <Icon as={item.icon} boxSize={{ base: 3, md: 3.5 }} color="blue.500" />
                                            </Flex>
                                            <Box>
                                                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="500">
                                                    {item.name}
                                                </Text>
                                                <Flex align="center" gap={1}>
                                                    <Icon as={FiStar} boxSize={2.5} color="yellow.400" fill="yellow.400" />
                                                    <Text fontSize="xs" color="gray.500">{item.rating}</Text>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                        <Text fontSize={{ base: "10px", md: "xs" }} color="blue.600" fontWeight="bold">
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