import React, { useState } from "react";
import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Icon,
  HStack,
  Button,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaUsers,
  FaBoxes,
} from "react-icons/fa";

// Tab Components
import AnalyticsTab from "./tabs/AnalyticsTab";
import CustomersTab from "./tabs/CustomersTab";
import InventoryTab from "./tabs/InventoryTab";

const theme = extendTheme({
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Montserrat', sans-serif",
  },
  colors: {
    brand: {
      50: "#e0f2fe",
      100: "#bae6fd",
      200: "#7dd3fc",
      500: "#0ea5e9",
      600: "#0284c7",
      900: "#0c4a6e",
    },
  },
});

const MotionBox = motion(Box);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("sales");

  const tabs = [
    { id: "sales", label: "Analytics", icon: FaChartLine },
    { id: "customer", label: "Customers", icon: FaUsers },
    { id: "inventory", label: "Inventory", icon: FaBoxes },
  ];

  return (
    <ChakraProvider theme={theme}>
      <Box bg="brand.50" minH="100vh" pb={10}>
        {/* Tab Navigation */}
        <Box
          bg="white"
          borderBottom="1px solid"
          borderColor="brand.100"
          position="sticky"
          top={0}
          zIndex={100}
        >
          <Flex
            maxW="1600px"
            mx="auto"
            px={{ base: 4, md: 8 }}
            justify="flex-start"
            overflowX="auto"
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              "-ms-overflow-style": "none",
              "scrollbar-width": "none",
            }}
          >
            <HStack spacing={0}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="unstyled"
                  onClick={() => setActiveTab(tab.id)}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={{ base: 4, md: 6 }}
                  py={4}
                  minW="fit-content"
                  color={activeTab === tab.id ? "brand.600" : "gray.400"}
                  borderBottom="3px solid"
                  borderColor={
                    activeTab === tab.id ? "brand.500" : "transparent"
                  }
                  _hover={{ color: "brand.500" }}
                  transition="all 0.2s"
                  whiteSpace="nowrap"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="600"
                >
                  <Icon as={tab.icon} boxSize={{ base: 4, md: 5 }} />
                  <Text>{tab.label}</Text>
                </Button>
              ))}
            </HStack>
          </Flex>
        </Box>

        {/* Content Area */}
        <Box maxW="1600px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "sales" && <AnalyticsTab />}
              {activeTab === "customer" && <CustomersTab />}
              {activeTab === "inventory" && <InventoryTab />}
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;