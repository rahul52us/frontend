import React, { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  HStack,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaUsers, FaBoxes } from "react-icons/fa";

import AnalyticsTab from "./tabs/AnalyticsTab";
import CustomersTab from "./tabs/CustomersTab";
import InventoryTab from "./tabs/InventoryTab";

const MotionBox = motion(Box);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("sales");

  const bg = useColorModeValue("gray.50", "gray.900");
  const tabBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeColor = "blue.600";
  const activeBg = useColorModeValue("blue.50", "blue.900");

  const tabs = [
    { id: "sales", label: "Analytics", icon: FaChartLine },
    { id: "customer", label: "Customers", icon: FaUsers },
    { id: "inventory", label: "Inventory", icon: FaBoxes },
  ];

  const hoverBgActive = useColorModeValue("blue.100", "blue.800");
  const hoverBgInactive = hoverBg;
  const activeBgHover = useColorModeValue("blue.100", "blue.800");

  return (
    <Box bg={bg}>
      {/* Sticky Tab Bar - Horizontal Scroll on Mobile */}
      <Box
        bg={tabBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        boxShadow="sm"
        overflowX="auto"
        overscrollBehaviorX="contain"
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Flex
          justify={{ base: "flex-start" }}
          mx="auto"
          px={{ base: 2, sm: 2, md: 2 }}
          py={2}
        >
          <HStack
            spacing={{ base: 1, sm: 2, md: 2 }}
            flexWrap="nowrap"
            flexShrink={0}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  minW={{ base: "64px", sm: "100px", md: "140px" }}
                  px={{ base: 2, sm: 2, md: 2 }}
                  py={{ base: 2, md: 3 }}
                  h="auto"
                  borderRadius="md"
                  color={isActive ? activeColor : "gray.600"}
                  fontWeight={isActive ? "bold" : "medium"}
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  bg={isActive ? activeBg : "transparent"}
                  _hover={{
                    bg: isActive ? hoverBgActive : hoverBgInactive,
                  }}
                  _active={{
                    bg: activeBgHover,
                  }}
                  position="relative"
                  flexShrink={0}
                  transition="all 0.2s"
                >
                  <HStack spacing={{ base: 1, sm: 2 }}>
                    <Icon as={tab.icon} boxSize={{ base: 4, md: 5 }} />
                    <Text
                      display={{ base: "none", sm: "block" }}
                      whiteSpace="nowrap"
                    >
                      {tab.label}
                    </Text>
                  </HStack>

                  {isActive && (
                    <Box
                      as={motion.div}
                      layoutId="activeTabIndicator"
                      position="absolute"
                      bottom="-2px"
                      left={{ base: "8%", sm: "12%" }}
                      right={{ base: "8%", sm: "12%" }}
                      height="3px"
                      bg="blue.500"
                      borderTopRadius="full"
                      initial={false}
                    />
                  )}
                </Button>
              );
            })}
          </HStack>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Box
        as="main"
        mx="auto"
        px={{ base: 2, sm: 2, md: 2, lg: 2 }}
        py={{ base: 2, md: 3, lg: 2 }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {activeTab === "sales" && <AnalyticsTab />}
            {activeTab === "customer" && <CustomersTab />}
            {activeTab === "inventory" && <InventoryTab />}
          </MotionBox>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Dashboard;