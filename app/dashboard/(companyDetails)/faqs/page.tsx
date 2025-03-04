"use client";

import React, { useMemo } from "react";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import Faq from "../faq/page";
import FaqHome from "../homeFaq/page";

const Page = () => {
  const tabData = useMemo(
    () => [
      { label: "FAQ", component: <Faq /> },
      { label: "FAQ Home", component: <FaqHome /> }
    ],
    []
  );

  const tabSize = useBreakpointValue({ base: "sm", md: "lg" });

  return (
    <Box p={4} maxWidth="1200px" mx="auto">
      <Tabs variant="line" colorScheme="teal" isLazy size={tabSize}>
        <TabList
          justifyContent="center"
          mb={4}
          gap={8} // Increased space between tabs for a clean look
        >
          {tabData.map((tab, index) => (
            <Tab
              key={index}
              fontSize="lg"
              fontWeight="bold"
              _selected={{
                color: "teal.500",
                borderBottom: "2px solid teal", // Clear underline for selected tab
              }}
              _hover={{
                color: "teal.400", // Hover color for better interaction feedback
              }}
              transition="color 0.2s ease"
              px={6} // Padding for each tab to make them more clickable
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabData.map((tab, index) => (
            <TabPanel key={index} p={4}>
              {tab.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Page;