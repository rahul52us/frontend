'use client';

import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Skeleton,
  useColorModeValue,
  IconButton,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import categoryStore from '../../../store/categoryStore/categoryStore';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionBadge = motion(Badge);

// Unique floating particles background component
const FloatingParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" zIndex={0}>
      {particles.map((p) => (
        <MotionBox
          key={p.id}
          position="absolute"
          w={`${p.size}px`}
          h={`${p.size}px`}
          borderRadius="full"
          bg={useColorModeValue(
            `rgba(139, 92, 246, ${0.03 + Math.random() * 0.04})`,
            `rgba(139, 92, 246, ${0.05 + Math.random() * 0.05})`
          )}
          left={`${p.x}%`}
          top={`${p.y}%`}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </Box>
  );
};

// 3D tilt card component with mouse tracking
const TiltCard = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-8deg', '8deg']);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionBox
      ref={ref}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      cursor="pointer"
    >
      {children}
    </MotionBox>
  );
};

const CategorySection = observer(() => {
  const router = useRouter();
  const { categories, loading } = categoryStore;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    categoryStore.getAllCategories({ isActive: true, isFeatured: true });
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate active index based on scroll position
      const cardWidth = 200; // approximate card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, categories.length - 1));
    }
  }, [categories.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll, categories.length]);

  const bgColor = useColorModeValue('#FAFAFA', '#0F0F0F');
  const cardBg = useColorModeValue('white', '#1A1A1A');
  const cardBgHover = useColorModeValue('#FFFFFF', '#1E1E1E');
  const descriptionColor = useColorModeValue('gray.500', 'gray.400');
  const sectionText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.800');
  const borderColorHover = useColorModeValue('purple.200', 'purple.700');
  const accentGradient = useColorModeValue(
    'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
    'linear-gradient(135deg, #A78BFA 0%, #818CF8 50%, #60A5FA 100%)'
  );
  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.7)',
    'rgba(26, 26, 26, 0.7)'
  );
  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.5)',
    'rgba(255, 255, 255, 0.08)'
  );

  const handleCategoryClick = useCallback(
    (category: any) => {
      router.push(`/categories?slug=${category.slug || category.name.toLowerCase()}`);
    },
    [router]
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isLoading = loading && categories.length === 0;

  // Unique stagger animation with bounce
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateZ: -2, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 0.8,
      },
    },
  };

  // Animated number counter for items
  const AnimatedCounter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (hoveredCard) {
        let start = 0;
        const end = value;
        const duration = 600;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, [hoveredCard, value]);

    return <>{count}</>;
  };

  if (isLoading) {
    return (
      <Box py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }} position="relative">
        <FloatingParticles />
        <Flex gap={5} overflow="hidden" justify="center" position="relative" zIndex={1}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              h={{ base: '200px', md: '220px' }}
              w={{ base: '170px', md: '200px' }}
              borderRadius="24px"
              flexShrink={0}
              startColor={useColorModeValue('gray.100', 'gray.800')}
              endColor={useColorModeValue('gray.200', 'gray.700')}
            />
          ))}
        </Flex>
      </Box>
    );
  }

  if (!categories.length) return null;

  return (
    <Box
      py={{ base: 8, md: 12, lg: 16 }}
      px={{ base: 4, md: 6, lg: 10 }}
      maxW="1600px"
      mx="auto"
      position="relative"
      bg={bgColor}
      borderRadius={{ base: '24px', md: '32px' }}
      my={{ base: 4, md: 8 }}
      overflow="hidden"
    >
      <FloatingParticles />

      {/* Decorative gradient orb */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="purple.500"
        opacity={0.04}
        filter="blur(100px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-80px"
        left="-80px"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="blue.500"
        opacity={0.04}
        filter="blur(80px)"
        pointerEvents="none"
      />

      {/* Header with unique layout */}
      <MotionFlex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'flex-end' }}
        mb={{ base: 6, md: 8, lg: 10 }}
        gap={{ base: 4, md: 6 }}
        position="relative"
        zIndex={1}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Box flex="1" minW={0} maxW={{ md: '650px' }}>
          {/* Animated label */}
          <MotionFlex
            align="center"
            gap={3}
            mb={3}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bgGradient="linear(to-r, purple.400, blue.400)"
            />
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="0.2em"
              color={useColorModeValue('purple.600', 'purple.400')}
            >
              Curated For You
            </Text>
            <Box
              flex={1}
              h="1px"
              maxW="60px"
              bgGradient="linear(to-r, purple.400, transparent)"
              opacity={0.5}
            />
          </MotionFlex>

          <Text
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="extrabold"
            lineHeight="1.1"
            letterSpacing="tight"
            color={useColorModeValue('gray.900', 'white')}
            mb={3}
          >
            Shop by{' '}
            <Box
              as="span"
              bgGradient={accentGradient}
              bgClip="text"
              position="relative"
            >
              Category
              <Box
                position="absolute"
                bottom="-4px"
                left={0}
                right={0}
                h="3px"
                borderRadius="full"
                bgGradient={accentGradient}
                opacity={0.3}
              />
            </Box>
          </Text>
          <Text
            color={sectionText}
            fontSize={{ base: 'sm', md: 'md' }}
            maxW="500px"
            lineHeight="1.7"
            fontWeight="medium"
          >
            Discover handpicked collections from verified local vendors. 
            Each category tells a story — find yours.
          </Text>
        </Box>

        {/* Navigation with glass effect */}
        <Flex
          align="center"
          gap={3}
          flexShrink={0}
          display={{ base: 'none', md: 'flex' }}
          bg={glassBg}
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={glassBorder}
          borderRadius="full"
          px={2}
          py={2}
        >
          <Tooltip label="Scroll left" placement="top" hasArrow>
            <IconButton
              aria-label="Scroll left"
              icon={<ChevronLeftIcon boxSize={5} />}
              onClick={() => scroll('left')}
              borderRadius="full"
              size="sm"
              variant="ghost"
              color={useColorModeValue('gray.600', 'gray.400')}
              _hover={{
                bg: 'purple.500',
                color: 'white',
                transform: 'scale(1.15) rotate(-5deg)',
              }}
              _active={{ transform: 'scale(0.95)' }}
              transition="all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
              opacity={canScrollLeft ? 1 : 0.3}
              isDisabled={!canScrollLeft}
            />
          </Tooltip>

          {/* Progress dots */}
          <Flex gap={1.5} align="center" px={2}>
            {categories.slice(0, Math.min(categories.length, 8)).map((_: any, i: number) => (
              <MotionBox
                key={i}
                h="6px"
                borderRadius="full"
                bg={i === activeIndex ? 'purple.500' : useColorModeValue('gray.300', 'gray.600')}
                animate={{
                  width: i === activeIndex ? '24px' : '6px',
                  opacity: i === activeIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            ))}
          </Flex>

          <Tooltip label="Scroll right" placement="top" hasArrow>
            <IconButton
              aria-label="Scroll right"
              icon={<ChevronRightIcon boxSize={5} />}
              onClick={() => scroll('right')}
              borderRadius="full"
              size="sm"
              variant="ghost"
              color={useColorModeValue('gray.600', 'gray.400')}
              _hover={{
                bg: 'purple.500',
                color: 'white',
                transform: 'scale(1.15) rotate(5deg)',
              }}
              _active={{ transform: 'scale(0.95)' }}
              transition="all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
              opacity={canScrollRight ? 1 : 0.3}
              isDisabled={!canScrollRight}
            />
          </Tooltip>
        </Flex>
      </MotionFlex>

      {/* Cards Container with unique styling */}
      <Box position="relative" zIndex={1}>
        {/* Left fade with gradient */}
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          w={{ base: '30px', md: '80px' }}
          bgGradient={`linear(to-r, ${useColorModeValue('rgba(250,250,250,1)', 'rgba(15,15,15,1)')}, transparent)`}
          zIndex={2}
          pointerEvents="none"
          display={{ base: 'none', md: canScrollLeft ? 'block' : 'none' }}
        />

        {/* Right fade with gradient */}
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          w={{ base: '30px', md: '80px' }}
          bgGradient={`linear(to-l, ${useColorModeValue('rgba(250,250,250,1)', 'rgba(15,15,15,1)')}, transparent)`}
          zIndex={2}
          pointerEvents="none"
          display={{ base: 'none', md: canScrollRight ? 'block' : 'none' }}
        />

        <MotionFlex
          ref={scrollRef}
          gap={{ base: 4, md: 5, lg: 6 }}
          overflowX="auto"
          overflowY="hidden"
          pb={4}
          px={{ base: 1, md: 2 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            scrollSnapType: 'x mandatory',
            '& > div': {
              scrollSnapAlign: 'start',
            },
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category: any, index: number) => {
            const isHovered = hoveredCard === category._id;
            const itemCount = category.productCount || Math.floor(Math.random() * 500) + 50;

            return (
              <MotionBox
                key={category._id}
                variants={cardVariants}
                bg={cardBg}
                borderRadius="24px"
                overflow="hidden"
                border="1.5px solid"
                borderColor={isHovered ? borderColorHover : borderColor}
                cursor="pointer"
                position="relative"
                minW={{ base: '170px', sm: '185px', md: '200px', lg: '220px' }}
                w={{ base: '170px', sm: '185px', md: '200px', lg: '220px' }}
                flexShrink={0}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => setHoveredCard(category._id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.96 }}
                role="group"
                // Liquid glass effect on hover
                style={{
                  boxShadow: isHovered
                    ? useColorModeValue(
                        '0 25px 50px -12px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(139, 92, 246, 0.1)',
                        '0 25px 50px -12px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)'
                      )
                    : useColorModeValue(
                        '0 4px 20px rgba(0,0,0,0.06)',
                        '0 4px 20px rgba(0,0,0,0.2)'
                      ),
                }}
              >
                {/* Top gradient accent bar with animation */}
                <Box
                  h="4px"
                  w="full"
                  bgGradient={accentGradient}
                  transform={isHovered ? 'scaleX(1)' : 'scaleX(0)'}
                  transformOrigin="left"
                  transition="transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                />

                {/* Image Container with overlay effects */}
                <Box
                  h={{ base: '130px', md: '150px' }}
                  overflow="hidden"
                  position="relative"
                  bg={useColorModeValue('gray.100', 'gray.800')}
                >
                  <Image
                    src={category.image?.url || `https://picsum.photos/seed/${category._id || index}/400/400`}
                    alt={category.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.5s ease"
                    filter={isHovered ? 'brightness(0.85)' : 'brightness(1)'}
                    _groupHover={{ transform: 'scale(1.15)' }}
                  />

                  {/* Animated overlay */}
                  <MotionBox
                    position="absolute"
                    inset={0}
                    bgGradient="linear(to-t, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Floating item count badge - unique positioning */}
                  <MotionBadge
                    position="absolute"
                    top={3}
                    right={3}
                    borderRadius="full"
                    bg={useColorModeValue('whiteAlpha.95', 'blackAlpha.70')}
                    color={useColorModeValue('purple.600', 'purple.300')}
                    fontSize="10px"
                    fontWeight="bold"
                    px={2.5}
                    py={1}
                    backdropFilter="blur(12px)"
                    border="1px solid"
                    borderColor={useColorModeValue('whiteAlpha.50', 'whiteAlpha.10')}
                    boxShadow="0 2px 10px rgba(0,0,0,0.1)"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{
                      scale: isHovered ? 1 : 0.9,
                      rotate: isHovered ? 0 : -10,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {isHovered ? <AnimatedCounter value={itemCount} /> : itemCount} items
                  </MotionBadge>

                  {/* Category number indicator */}
                  <Box
                    position="absolute"
                    bottom={3}
                    left={3}
                    fontSize="3xl"
                    fontWeight="black"
                    color="whiteAlpha.30"
                    lineHeight={1}
                    fontFamily="mono"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Box>
                </Box>

                {/* Content with improved spacing */}
                <Box p={{ base: 3.5, md: 4 }}>
                  <Flex align="center" gap={2} mb={1}>
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bgGradient={accentGradient}
                      flexShrink={0}
                    />
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      fontWeight="bold"
                      noOfLines={1}
                      color={useColorModeValue('gray.800', 'gray.100')}
                      letterSpacing="tight"
                    >
                      {category.name}
                    </Text>
                  </Flex>

                  <Text
                    fontSize="12px"
                    color={descriptionColor}
                    noOfLines={1}
                    mb={{ base: 3, md: 4 }}
                    lineHeight="1.5"
                    fontWeight="medium"
                  >
                    {category.description || 'Discover amazing products curated for you'}
                  </Text>

                  {/* Unique button design */}
                  <Button
                    size="sm"
                    w="full"
                    borderRadius="16px"
                    bgGradient={isHovered ? accentGradient : 'none'}
                    bg={isHovered ? undefined : useColorModeValue('gray.100', 'gray.800')}
                    color={isHovered ? 'white' : useColorModeValue('gray.600', 'gray.400')}
                    fontWeight="semibold"
                    fontSize="13px"
                    py={2.5}
                    border="1.5px solid"
                    borderColor={isHovered ? 'transparent' : useColorModeValue('gray.200', 'gray.700')}
                    _hover={{
                      bgGradient: accentGradient,
                      color: 'white',
                      borderColor: 'transparent',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 92, 246, 0.25)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCategoryClick(category);
                    }}
                    leftIcon={
                      <Text
                        as="span"
                        fontSize="14px"
                        transition="transform 0.3s ease"
                        transform={isHovered ? 'translateX(3px)' : 'translateX(0)'}
                      >
                        →
                      </Text>
                    }
                  >
                    Explore
                  </Button>
                </Box>

                {/* Bottom decorative corner */}
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  w="40px"
                  h="40px"
                  borderTopLeftRadius="24px"
                  bg={useColorModeValue('gray.50', 'gray.900')}
                  opacity={isHovered ? 1 : 0}
                  transition="opacity 0.3s ease"
                >
                  <Box
                    position="absolute"
                    bottom="8px"
                    right="8px"
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bgGradient={accentGradient}
                  />
                </Box>
              </MotionBox>
            );
          })}
        </MotionFlex>
      </Box>

      {/* Mobile scroll indicator */}
      <Flex
        justify="center"
        mt={5}
        display={{ base: 'flex', md: 'none' }}
        gap={1.5}
      >
        {categories.slice(0, Math.min(categories.length, 6)).map((_: any, i: number) => (
          <MotionBox
            key={i}
            h="5px"
            borderRadius="full"
            bg={i === activeIndex ? 'purple.500' : useColorModeValue('gray.300', 'gray.600')}
            animate={{
              width: i === activeIndex ? '20px' : '5px',
              opacity: i === activeIndex ? 1 : 0.4,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </Flex>

      {/* Bottom decorative line */}
      <Box
        position="absolute"
        bottom={0}
        left="10%"
        right="10%"
        h="1px"
        bgGradient={`linear(to-r, transparent, ${useColorModeValue('purple.200', 'purple.800')}, transparent)`}
        opacity={0.3}
      />
    </Box>
  );
});

export default CategorySection;