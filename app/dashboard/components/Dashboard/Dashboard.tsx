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

  const tabs = [
    { id: "sales", label: "Analytics", icon: FaChartLine },
    { id: "customer", label: "Customers", icon: FaUsers },
    { id: "inventory", label: "Inventory", icon: FaBoxes },
  ];

  return (
    <Box>
      {/* Top Tabs */}
      <Box
        bg={tabBg}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="sm"
      >
        <Flex mx="auto" px={{ base: 4, md: 2 }} align="center" h="50px">
          <HStack spacing={1}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  px={{ base: 4, md: 6 }}
                  h="44px"
                  borderRadius="md"
                  color={isActive ? "blue.600" : "gray.600"}
                  fontWeight="600"
                  bg={isActive ? "blue.50" : "transparent"}
                  _hover={{ bg: isActive ? "blue.100" : hoverBg }}
                  position="relative"
                >
                  <HStack spacing={2}>
                    <Icon as={tab.icon} boxSize={4} />
                    <Text fontSize="sm">{tab.label}</Text>
                  </HStack>

                  {isActive && (
                    <Box
                      position="absolute"
                      bottom="0"
                      left="20%"
                      right="20%"
                      height="2px"
                      bg="blue.500"
                      borderRadius="full"
                    />
                  )}
                </Button>
              );
            })}
          </HStack>
        </Flex>
      </Box>

      {/* Content */}
      <Box maxW="1600px" mx="auto" px={{ base: 4, md: 2 }}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
