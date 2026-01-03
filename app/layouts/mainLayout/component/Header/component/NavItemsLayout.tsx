"use client";

import { Flex, Box, useColorModeValue, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems } from "../utils/constant";
import NavItem from "../element/NavItem";
import { FiZap } from "react-icons/fi";

const MotionBox = motion(Box);

const NavItemsLayout: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // THEME COLORS
  const accentColor = "#00BFFF"; // Skyblue
  // Adjusted background for a better glass effect in dark mode
  const navBg = useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(2, 12, 27, 0.8)");
  const activePillBg = useColorModeValue("#00BFFF", "#00BFFF"); 
  const borderColor = useColorModeValue("blue.100", "whiteAlpha.200");

  return (
    <Flex
      as="nav"
      direction={{ base: "column", md: "row" }}
      alignItems="center"
      position="relative"
      bg={navBg}
      backdropFilter="blur(15px)"
      p={2}
      borderRadius="full"
      border="1px solid"
      borderColor={borderColor}
      // Shadow updated to match Skyblue theme
      boxShadow={`0 10px 30px -10px rgba(0, 191, 255, 0.3)`}
      gap={0}
      isolation="isolate"
    >
      <AnimatePresence>
        {hoveredIndex !== null && (
          <MotionBox
            layoutId="nav-pill"
            position="absolute"
            zIndex={0}
            bg={activePillBg}
            borderRadius="full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { type: "spring", stiffness: 400, damping: 30 } 
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            top={2}
            bottom={2}
            // Logic to calculate pill position roughly (if dynamic width is needed, Framer layoutId handles it)
            left={{ base: "8px", md: "auto" }} 
            right={{ base: "8px", md: "auto" }}
          />
        )}
      </AnimatePresence>

      {navItems.map((item, index) => (
        <Box
          key={item.title}
          position="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          w={{ base: "full", md: "auto" }}
        >
          <MotionBox
            position="relative"
            zIndex={1}
            px={8}
            py={3}
            cursor="pointer"
            whileTap={{ scale: 0.95 }}
          >
            <Box
              // Text becomes white when background pill is Skyblue
              color={hoveredIndex === index ? "white" : "whiteAlpha.600"}
              transition="color 0.3s ease"
              fontWeight="medium"
            >
              <NavItem item={item} onClose={onClose || (() => {})} />
            </Box>

            {hoveredIndex === index && (
              <MotionBox
                position="absolute"
                top="-2px"
                right="2px"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 180, scale: 1 }}
              >
                {/* Zap icon updated to a brighter yellow for skyblue contrast */}
                <Icon as={FiZap} color="yellow.200" boxSize={3} />
              </MotionBox>
            )}
          </MotionBox>
        </Box>
      ))}
    </Flex>
  );
};

export default NavItemsLayout;