"use client";
import {
  Box,
  Container,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MotionBox = motion(Box);

const StickyNav = ({ shopData }: any) => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "products", label: "Products" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const section = document.getElementById(id);
    if (section) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = section.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <Box
      position="sticky"
      top={{ base: "80px", md: "84px" }}
      zIndex="90"
      w="full"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h="14" alignItems="center" px={4} overflowX="auto" css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          <HStack spacing={4}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Box
                  key={tab.id}
                  position="relative"
                  cursor="pointer"
                  onClick={() => scrollToSection(tab.id)}
                  px={5}
                  py={2}
                  borderRadius="full"
                  transition="all 0.2s"
                >
                  {isActive && (
                    <MotionBox
                      layoutId="activePill"
                      position="absolute"
                      inset="0"
                      bg="blue.600"
                      borderRadius="full"
                      zIndex="0"
                    />
                  )}
                  <Text
                    position="relative"
                    zIndex="1"
                    fontSize="xs"
                    fontWeight="bold"
                    color={isActive ? "white" : "gray.500"}
                    transition="color 0.2s"
                    letterSpacing="wide"
                    whiteSpace="nowrap"
                  >
                    {tab.label}
                  </Text>
                </Box>
              );
            })}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default StickyNav;
