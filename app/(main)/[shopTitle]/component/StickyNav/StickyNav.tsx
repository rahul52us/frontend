"use client";
import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Tab,
  TabList,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const StickyNav = ({ shopData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const navHeight = navRef.current?.offsetHeight || 100;
    if (section) {
      const topPosition = section.offsetTop - navHeight - 120;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };

  const tabs = [
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "products", label: "Products" },
    { id: "location", label: "Location" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Desktop Navigation */}
      <Box
        ref={navRef}
        position="sticky"
        top="7.5rem"
        zIndex="40"
        w="full"
        bg="white"
        boxShadow={isScrolled ? "md" : "none"}
        borderBottom="1px"
        borderColor="gray.100"
        transition="box-shadow 0.3s ease"
      >
        <Container maxW="container.xl">
          <Flex h="16" alignItems="center" justifyContent="space-between" px={4}>
            <ChakraLink
              fontWeight="extrabold"
              fontSize="xl"
              color="gray.800"
              _hover={{ color: "teal.600" }}
            >
              {shopData.name}
            </ChakraLink>

            {/* Desktop Tabs */}
            <HStack
              as="nav"
              spacing={8}
              fontSize="md"
              fontWeight="semibold"
              display={{ base: "none", md: "flex" }}
            >
              {tabs.map((tab) => (
                <ChakraLink
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  color="gray.600"
                  position="relative"
                  _hover={{
                    color: "teal.600",
                  }}
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "-4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "0%",
                    height: "2px",
                    bg: "teal.600",
                    transition: "width 0.3s ease",
                  }}
                  cursor="pointer"
                  pb={1}
                >
                  {tab.label}
                </ChakraLink>
              ))}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation */}
      <Box
        display={{ base: "block", md: "none" }}
        position="sticky"
        top="6rem"
        zIndex="40"
        bg="white"
        borderBottom="1px"
        borderColor="gray.100"
        boxShadow={isScrolled ? "md" : "none"}
        transition="box-shadow 0.3s ease"
      >
        <Tabs variant="unstyled" colorScheme="teal" size="md">
          <TabList
            overflowX="auto"
            whiteSpace="nowrap"
            px={4}
            py={3}
            gap={3}
            sx={{
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "teal.300",
                borderRadius: "2px",
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                flexShrink={0}
                bg="gray.50"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="medium"
                color="gray.700"
                _hover={{
                  bg: "teal.50",
                  color: "teal.700",
                }}
                _selected={{
                  bg: "teal.500",
                  color: "white",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
                transition="all 0.2s ease"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
    </>
  );
};

export default StickyNav;