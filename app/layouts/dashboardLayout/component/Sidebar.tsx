'use client'
import React from "react";
import NextLink from "next/link";
import { Box, VStack, Link as ChakraLink, Icon, Text , Flex } from "@chakra-ui/react";
import { AtSignIcon, SettingsIcon, CalendarIcon } from "@chakra-ui/icons";
import { WEBSITE_TITLE } from "../../../config/utils/variables";

const Sidebar: React.FC = () => {
  const navItems = [
    { label: "Overview", icon: AtSignIcon, href: "/dashboard" },
    { label: "Therapist", icon: CalendarIcon, href: "/dashboard/therapist" },
    { label: "FAQs", icon: CalendarIcon, href: "/dashboard/faqs" },
    { label: "Contacts", icon: CalendarIcon, href: "/dashboard/contacts" },
    { label: "Blogs", icon: CalendarIcon, href: "/dashboard/blogs" },
    { label: "Testimonials", icon: CalendarIcon, href: "/dashboard/testimonials" },
    { label: "Content Sections", icon: CalendarIcon, href: "/dashboard/content-section" },
  ];

  return (
    <Box as="aside" color="white" h="100vh" p="3" boxShadow="lg" borderRight="1px" position="relative">
      {/* Logo Section */}
      <Box cursor="pointer" mb="4" textAlign="center" borderBottom="1.2px solid gray" mt={-2}>
        {WEBSITE_TITLE}
      </Box>

      <Flex direction="column" justifyContent="space-between" h="full">
        {/* Navigation Items */}
        <VStack align="start" spacing="4" flex="1" w="full">
          {navItems.map((item) => (
            <ChakraLink
              as={NextLink}
              key={item.label}
              href={item.href}
              w="full"
              display="flex"
              alignItems="center"
              py="3"
              px="4"
              borderRadius="md"
              transition="background-color 0.3s ease"
              _hover={{
                bg: "blue.600",
                color: "white",
                textDecoration: "none",
              }}
              _focus={{ boxShadow: "none" }}
            >
              <Icon as={item.icon} boxSize="6" mr="3" />
              <Text fontSize="lg">{item.label}</Text>
            </ChakraLink>
          ))}

          {/* Settings at the Bottom */}
          <Box position="absolute" bottom="0" right="0" p="4" w="full">
            <ChakraLink
              as={NextLink}
              href="/settings"
              w="full"
              display="flex"
              alignItems="center"
              py="3"
              px="4"
              borderRadius="md"
              transition="background-color 0.3s ease"
              _hover={{ bg: "blue.600", color: "white", textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
            >
              <Icon as={SettingsIcon} boxSize="6" mr="3" />
              <Text fontSize="lg">Settings</Text>
            </ChakraLink>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Sidebar;
