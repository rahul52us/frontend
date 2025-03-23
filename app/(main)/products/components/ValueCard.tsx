import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

const CreativeCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Reduced responsive height
  const height = useBreakpointValue({ base: '30vh', sm: '35vh', md: '45vh', lg: '50vh' });
  const arrowSize = useBreakpointValue({ base: 6, sm: 8, md: 10 });
  const arrowOffset = useBreakpointValue({ base: 2, md: 4 });

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  // Animation variants for seamless continuity
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Box
      position="relative"
      h={height} // Updated height applied here
      w="100%"
      maxW="100%"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      borderRadius="3xl"
      boxShadow="xl"
      bg="gray.900"
    >
      <AnimatePresence custom={direction} initial={false}>
        <MotionBox
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          position="absolute"
          w="100%"
          h="100%"
          cursor="pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            w="100%"
            h="100%"
            // objectFit="cover"
            borderRadius="3xl"
            boxShadow="2xl"
            filter="brightness(0.95) contrast(1.1) saturate(1.3)"
            _hover={{ filter: "brightness(1.05) contrast(1.15) saturate(1.4)" }}
            transition="filter 0.5s ease-in-out, transform 0.5s ease-in-out"
            loading="lazy"
          />
          {/* Overlay for depth */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            bg="blackAlpha.300"
            borderRadius="3xl"
            transition="opacity 0.5s ease-in-out"
            _groupHover={{ opacity: 0.2 }}
            opacity={0.4}
          />
        </MotionBox>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={arrowSize} />}
        position="absolute"
        left={arrowOffset}
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="whiteAlpha.200"
        color="white"
        _hover={{ bg: "whiteAlpha.400", transform: "translateY(-50%) scale(1.15)" }}
        _active={{ bg: "whiteAlpha.500" }}
        backdropFilter="blur(15px)"
        boxShadow="lg"
        size={{ base: "sm", md: "md" }}
        onClick={handlePrev}
        zIndex={2}
        transition="all 0.3s ease"
      />

      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={arrowSize} />}
        position="absolute"
        right={arrowOffset}
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="whiteAlpha.200"
        color="white"
        _hover={{ bg: "whiteAlpha.400", transform: "translateY(-50%) scale(1.15)" }}
        _active={{ bg: "whiteAlpha.500" }}
        backdropFilter="blur(15px)"
        boxShadow="lg"
        size={{ base: "sm", md: "md" }}
        onClick={handleNext}
        zIndex={2}
        transition="all 0.3s ease"
      />

      {/* Progress Indicator */}
      <Box
        position="absolute"
        bottom={{ base: 3, md: 5 }}
        left="50%"
        transform="translateX(-50%)"
        display="flex"
        gap={{ base: 1.5, md: 2.5 }}
        bg="blackAlpha.400"
        backdropFilter="blur(10px)"
        p={1.5}
        borderRadius="full"
        boxShadow="md"
        zIndex={2}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            w={currentIndex === index ? { base: '28px', md: '36px' } : '10px'}
            h={{ base: "7px", md: "9px" }}
            bg={currentIndex === index ? 'white' : 'whiteAlpha.600'}
            borderRadius="full"
            transition="all 0.4s ease"
            position="relative"
            overflow="hidden"
            _hover={{ bg: 'whiteAlpha.800' }}
          >
            {currentIndex === index && (
              <MotionBox
                position="absolute"
                top={0}
                left={0}
                h="100%"
                bg="gray.200"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: "linear" }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CreativeCarousel;