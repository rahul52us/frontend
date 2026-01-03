"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Image, 
  Text, 
  useColorModeValue,
  chakra,
  shouldForwardProp,
  HStack,
  Center,
  VStack
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'transition',
});

// CONSTANTS FOR SILKY SMOOTH PHYSICS
const SMOOTH_SPRING = { type: "spring", stiffness: 120, damping: 14, mass: 0.8 };
const ICON_SPRING = { type: "spring", stiffness: 200, damping: 25 };

interface Category {
  id: number;
  name: string;
  image: string;
  color: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1610438250910-01cb769c1334?w=200&q=80', color: '#00D2FF' },
  { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=200&q=80', color: '#FF0080' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=200&q=80', color: '#00FF87' },
  { id: 4, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200&q=80', color: '#7928CA' },
  { id: 5, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', color: '#FF4D4D' },
  { id: 6, name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', color: '#F9CB28' },
  { id: 7, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', color: '#20E2D7' },
  { id: 8, name: 'Toys', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=200&q=80', color: '#FF9472' },
  { id: 9, name: 'Fitness', image: 'https://images.unsplash.com/photo-1655869443567-492f48ee8d77?w=200&q=80', color: '#4facfe' },
];

const CategoryFilter: React.FC = () => {
  const [selected, setSelected] = useState<number>(1);
  
  // --- TOP LEVEL HOOKS ---
  const activeCategory = categories.find(c => c.id === selected);
  const activeColor = activeCategory?.color || '#3182CE';

  const dockBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(10, 10, 15, 0.6)");
  const borderCol = useColorModeValue("whiteAlpha.800", "whiteAlpha.100");
  const dockShadow = useColorModeValue(
    "0 30px 60px -15px rgba(0,0,0,0.1)",
    "0 30px 60px -15px rgba(0,0,0,0.5)"
  );
  
  // Extracted values used in the loop
  const pillBg = useColorModeValue("white", "whiteAlpha.200");
  const labelColor = useColorModeValue("gray.800", "white");

  return (
    <Center py={28} px={4} position="relative" w="full" overflow="hidden">
      {/* 1. KINETIC BACKGROUND GLOW */}
      <MotionBox
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" } as any}
        position="absolute"
        w="1200px"
        h="500px"
        bg={`radial-gradient(circle, ${activeColor}40 0%, transparent 70%)`}
        filter="blur(140px)"
        zIndex={0}
        pointerEvents="none"
      />

      {/* 2. THE FLOATING DOCK */}
      <MotionBox
        layout
        bg={dockBg}
        backdropFilter="blur(40px) saturate(200%)"
        p={2.5}
        borderRadius="40px"
        border="1px solid"
        borderColor={borderCol}
        boxShadow={dockShadow}
        position="relative"
        zIndex={1}
      >
        <HStack spacing={1} align="center">
          {categories.map((category) => {
            const isThisActive = selected === category.id;

            return (
              <Box 
                key={category.id} 
                onClick={() => setSelected(category.id)}
                position="relative"
              >
                <MotionBox
                  layout
                  whileHover={{ 
                    y: -10, 
                    scale: 1.1,
                  }}
                  whileTap={{ scale: 0.94 }}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  px={isThisActive ? 6 : 3}
                  py={3}
                  borderRadius="32px"
                  zIndex={2}
                  position="relative"
                  transition={SMOOTH_SPRING as any}
                >
                  {/* LIQUID ACTIVE PILL */}
                  {isThisActive && (
                    <MotionBox
                      layoutId="smooth-pill"
                      position="absolute"
                      inset={0}
                      bg={pillBg}
                      borderRadius="30px"
                      boxShadow={`0 10px 30px -5px ${category.color}60`}
                      zIndex={-1}
                      transition={SMOOTH_SPRING as any}
                    />
                  )}

                  {/* ICON - High Fidelity Squircle */}
                  <MotionBox
                    layout
                    w={isThisActive ? "46px" : "42px"}
                    h={isThisActive ? "46px" : "42px"}
                    borderRadius={isThisActive ? "16px" : "full"}
                    overflow="hidden"
                    border="2px solid"
                    borderColor={isThisActive ? category.color : "transparent"}
                    transition={ICON_SPRING as any}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      filter={isThisActive ? "none" : "grayscale(0.4) brightness(0.9)"}
                      transform={isThisActive ? "scale(1.2)" : "scale(1)"}
                      transition="all 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                    />
                  </MotionBox>

                  {/* LABEL - Smooth Fade & Slide */}
                  <AnimatePresence mode="wait">
                    {isThisActive && (
                      <MotionBox
                        initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                        transition={{ duration: 0.4, ease: "easeOut" } as any}
                      >
                        <VStack align="start" spacing={-1} ml={4}>
                          <Text
                            fontSize="9px"
                            fontWeight="bold"
                            color={category.color}
                            textTransform="uppercase"
                            letterSpacing="1.5px"
                          >
                            Explore
                          </Text>
                          <Text
                            fontSize="md"
                            fontWeight="800"
                            color={labelColor}
                            whiteSpace="nowrap"
                            letterSpacing="-0.5px"
                          >
                            {category.name}
                          </Text>
                        </VStack>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </MotionBox>
              </Box>
            );
          })}
        </HStack>
      </MotionBox>

      {/* 3. REFLECTION POOL */}
      <MotionBox
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scaleX: [0.8, 1, 0.8]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" } as any}
        position="absolute"
        bottom="15%"
        w="300px"
        h="20px"
        bg={`radial-gradient(ellipse at center, ${activeColor}50, transparent 70%)`}
        filter="blur(15px)"
        zIndex={0}
      />
    </Center>
  );
};

export default CategoryFilter;