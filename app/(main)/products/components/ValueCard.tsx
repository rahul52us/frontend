import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

const CreativeCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const height = useBreakpointValue({ base: '50vh', md: '60vh' });

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -45 : 45,
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
      h={height}
      w="100%"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        //   whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Banner ${currentIndex + 1}`}
            w="100%"
            h="100%"
            objectFit="cover"
            borderRadius="2xl"
            boxShadow="xl"
            filter="auto"
            brightness="0.85"
            _hover={{ brightness: '0.95' }}
            transition={'filter 0.3s ease-in-out'}
            saturate="1.1"
          />
        </MotionBox>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={8} />}
        position="absolute"
        left={4}
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="blackAlpha.400"
        _hover={{ bg: 'blackAlpha.600' }}
        color="white"
        backdropFilter="blur(10px)"
        onClick={handlePrev}
      />

      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={8} />}
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        borderRadius="full"
        bg="blackAlpha.400"
        _hover={{ bg: 'blackAlpha.600' }}
        color="white"
        backdropFilter="blur(10px)"
        onClick={handleNext}
      />

      {/* Progress Indicator */}
      <Box
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        display="flex"
        gap={2}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            w={currentIndex === index ? '32px' : '8px'}
            h="8px"
            bg={currentIndex === index ? 'whiteAlpha.800' : 'whiteAlpha.400'}
            borderRadius="full"
            transition="all 0.3s ease"
            overflow="hidden"
            position="relative"
          >
            {currentIndex === index && (
              <MotionBox
                position="absolute"
                top={0}
                left={0}
                h="100%"
                bg="whiteAlpha.600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, linear: true }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CreativeCarousel;