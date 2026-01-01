"use client";

import { Flex, chakra, Box, Text } from "@chakra-ui/react";
import React from "react";
import { motion } from "framer-motion";
import { navItems } from "../utils/constant";
import NavItem from "../element/NavItem";

interface NavItemType {
  title: string;
  link: string;
}

const MotionBox = chakra(motion.div);

const NavItemsLayout: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <Flex
      as="nav"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 2 }} // Tighter gap for the "pill" effect
      alignItems="center"
      justifyContent="center"
      w={{ base: "full", md: "auto" }}
    >
      {navItems.map((item: NavItemType, index: number) => (
        <MotionBox
          key={item.title}
          role="group"
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          w={{ base: "full", md: "auto" }}
          position="relative"
          variants={{
            initial: { opacity: 0, x: -15 },
            animate: { 
              opacity: 1, 
              x: 0, 
              transition: { 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: index * 0.08 
              } 
            },
            hover: { y: -2 },
            tap: { scale: 0.95 }
          }}
        >
          {/* 🌟 UNIQUE: The "Velvet Glow" Hover Background */}
          <Box
            as={motion.div}
            position="absolute"
            inset={0}
            bgGradient="linear(to-r, orange.400, pink.400)"
            filter="blur(12px)"
            rounded="full"
            zIndex={-1}
            opacity="0"
            variants={{
              hover: { opacity: 0.15, scale: 1.1 }
            }}
            transition="0.3s ease-out"
          />

          {/* 💊 UNIQUE: The Pill Container */}
          <Flex
            align="center"
            justify={{ base: "space-between", md: "center" }}
            px={{ base: 6, md: 5 }}
            py={{ base: 4, md: 2 }}
            position="relative"
            bg="transparent"
            _groupHover={{ bg: { base: "whiteAlpha.900", md: "transparent" } }}
            rounded="full"
            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          >
            <Box zIndex={1}>
              <NavItem
                item={item}
                onClose={onClose || (() => {})}
              />
            </Box>

            {/* ✨ UNIQUE: Floating Indicator (Desktop) */}
            <Box
              as={motion.div}
              display={{ base: "none", md: "block" }}
              position="absolute"
              bottom="6px"
              w="5px"
              h="5px"
              bg="orange.400"
              rounded="full"
              initial={{ opacity: 0, scale: 0 }}
              variants={{
                hover: { opacity: 1, scale: 1.5, y: 0 }
              }}
              transition={{ type: "spring", stiffness: 300 } as any}
            />

            {/* 📱 Mobile Chevron (Unique to Mobile Drawer) */}
            <Box display={{ base: "block", md: "none" }} opacity="0.3">
               <Text fontSize="xl">→</Text>
            </Box>
          </Flex>
          
          {/* Subtle line for mobile separation */}
          <Box 
            display={{ base: "block", md: "none" }} 
            h="1px" 
            bg="gray.50" 
            mx={6} 
          />
        </MotionBox>
      ))}
    </Flex>
  );
};

export default NavItemsLayout;