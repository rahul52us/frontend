import { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const images = [
  '/images/heroImage1.webp',
  '/images/heroImage2.webp',
  '/images/heroImage3.webp',
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 

    return () => clearInterval(interval);
  }, []);

  const variants = {
    enter: {
      opacity: 0,
      scale: 1,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.42, 0, 0.58, 1], // Smoother cubic-bezier easing
      },
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.42, 0, 0.58, 1], // Matching easing for a consistent feel
      },
    },
  };

  return (
    <Flex
      justify="center"
      position="relative"
      h={{ base: '320px', md: '400px', xl: '450px' }}
      w="100%"
      overflow="hidden"
    >
      {images.map((image, index) => (
        <MotionBox
          key={image}
          position="absolute"
          w={{ base: '85%', md: '75%', lg: '100%' }}
          h="100%"
          initial="enter"
          animate={index === currentIndex ? 'center' : 'exit'}
          variants={variants}
          style={{
            filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.04))',
          }}
        >
          <Box
            as="img"
            src={image}
            alt={`Hero Image ${index + 1}`}
            w="100%"
            h="100%"
            objectFit="contain"
            borderRadius="lg"
          />
        </MotionBox>
      ))}

      {/* Dots Indicator */}
      {/* <Flex
        position="absolute"
        bottom="4"
        gap={2}
        zIndex={2}
      >
        {images.map((_, index) => (
          <MotionBox
            key={index}
            w="10px"
            h="10px"
            borderRadius="full"
            bg={currentIndex === index ? 'white' : 'whiteAlpha.600'}
            cursor="pointer"
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Flex> */}
    </Flex>
  );
};

export default HeroCarousel;
