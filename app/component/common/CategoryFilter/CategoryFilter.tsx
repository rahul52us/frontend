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
  Center
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'transition',
});

interface Category {
  id: number;
  name: string;
  image: string;
  color: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1610438250910-01cb769c1334?w=200&q=80', color: '#3182CE' },
  { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1587467512961-120760940315?w=200&q=80', color: '#D53F8C' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=200&q=80', color: '#38A169' },
  { id: 4, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=200&q=80', color: '#805AD5' },
  { id: 5, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', color: '#E53E3E' },
  { id: 6, name: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', color: '#DD6B20' },
  { id: 7, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80', color: '#319795' },
  { id: 8, name: 'Toys', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=200&q=80', color: '#D69E2E' },
  { id: 9, name: 'Fitness', image: 'https://images.unsplash.com/photo-1655869443567-492f48ee8d77?w=200&q=80', color: '#00B5D8' },
];

const CategoryFilter: React.FC = () => {
  const [selected, setSelected] = useState<number>(1);
  const activeColor = categories.find(c => c.id === selected)?.color || '#3182CE';

  const dockBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(15, 15, 20, 0.6)");
  const borderCol = useColorModeValue("whiteAlpha.800", "whiteAlpha.100");

  return (
    <Center py={10} px={4} position="relative">
      {/* 1. BACKGROUND AMBIENCE - Subtle pulse of the active color */}
      <MotionBox
        animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" } as any}
        position="absolute"
        w="500px"
        h="150px"
        bg={activeColor}
        filter="blur(80px)"
        borderRadius="full"
        zIndex={0}
      />

      {/* 2. THE DOCK */}
      <MotionBox
        layout
        bg={dockBg}
        backdropFilter="blur(20px) saturate(160%)"
        p={1.5}
        borderRadius="28px"
        border="1px solid"
        borderColor={borderCol}
        boxShadow="0 20px 40px -15px rgba(0,0,0,0.1)"
        position="relative"
        zIndex={1}
      >
        <HStack spacing={1} align="center">
          {categories.map((category) => {
            const isActive = selected === category.id;

            return (
              <Box 
                key={category.id} 
                onClick={() => setSelected(category.id)}
                position="relative"
              >
                <MotionBox
                  layout
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  transition={{ type: "spring", stiffness: 350, damping: 28 } as any}
                  px={isActive ? 4 : 2}
                  py={2}
                  borderRadius="22px"
                  zIndex={2}
                  position="relative"
                >
                  {/* LIQUID ACTIVE PILL - This slides smoothly between items */}
                  {isActive && (
                    <MotionBox
                      layoutId="active-pill"
                      position="absolute"
                      inset={0}
                      bg={`${category.color}15`}
                      borderRadius="20px"
                      border="1px solid"
                      borderColor={`${category.color}30`}
                      zIndex={-1}
                    />
                  )}

                  {/* ICON - Transforms from circle to squircle */}
                  <MotionBox
                    layout
                    w="34px"
                    h="34px"
                    borderRadius={isActive ? "12px" : "full"}
                    overflow="hidden"
                    flexShrink={0}
                    transition={{ type: "spring", stiffness: 400, damping: 25 } as any}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      filter={isActive ? "none" : "grayscale(0.6) opacity(0.7)"}
                      transform={isActive ? "scale(1.15)" : "scale(1)"}
                      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    />
                  </MotionBox>

                  {/* TEXT REVEAL - "Springy" and clean */}
                  <AnimatePresence mode="popLayout">
                    {isActive && (
                      <MotionBox
                        initial={{ opacity: 0, width: 0, x: -8 }}
                        animate={{ opacity: 1, width: "auto", x: 0 }}
                        exit={{ opacity: 0, width: 0, x: -8 }}
                        transition={{ duration: 0.3, ease: "easeOut" } as any}
                        style={{ overflow: 'hidden' }}
                      >
                        <Text
                          ml={3}
                          fontSize="xs"
                          fontWeight="800"
                          color={category.color}
                          whiteSpace="nowrap"
                          textTransform="uppercase"
                          letterSpacing="1px"
                          filter={`drop-shadow(0 0 8px ${category.color}40)`}
                        >
                          {category.name}
                        </Text>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </MotionBox>
              </Box>
            );
          })}
        </HStack>
      </MotionBox>
    </Center>
  );
};

export default CategoryFilter;