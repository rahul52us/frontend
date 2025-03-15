import { Box, Container, Flex, HStack, Link as ChakraLink } from "@chakra-ui/react";
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

  // Function to handle smooth scrolling with correct offset
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    const navHeight = navRef.current?.offsetHeight || 100; // Default offset if nav height is unavailable
    if (section) {
      const topPosition = section.offsetTop - navHeight - 120; // Ensuring extra space
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Box
        ref={navRef}
        position="sticky"
        top="7.5rem"
        zIndex="40"
        w="full"
        bg="white"
        boxShadow={isScrolled ? "sm" : "none"}
        borderBottom="1px"
        borderColor="gray.200"
        display={{ base: "none", md: "block" }}
        transition="box-shadow 0.3s ease"
      >
        <Container maxW="container.xl">
          <Flex h="14" alignItems="center">
            <Flex mr="4">
              <ChakraLink mr="6" display="flex" alignItems="center" fontWeight="medium">
                {shopData.name}
              </ChakraLink>
              <HStack as="nav" spacing="6" fontSize="sm" fontWeight="medium" display={{ base: "none", md: "flex" }}>
                <ChakraLink onClick={() => scrollToSection("about")} _hover={{ color: "blue.500" }} cursor="pointer">
                  About
                </ChakraLink>
                <ChakraLink onClick={() => scrollToSection("gallery")} _hover={{ color: "blue.500" }} cursor="pointer">
                  Gallery
                </ChakraLink>
                <ChakraLink onClick={() => scrollToSection("products")} _hover={{ color: "blue.500" }} cursor="pointer">
                  Products
                </ChakraLink>
                <ChakraLink onClick={() => scrollToSection("location")} _hover={{ color: "blue.500" }} cursor="pointer">
                  Location
                </ChakraLink>
                <ChakraLink onClick={() => scrollToSection("contact")} _hover={{ color: "blue.500" }} cursor="pointer">
                  Contact
                </ChakraLink>
              </HStack>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default StickyNav;
