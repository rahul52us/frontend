"use client";

import { SearchIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  Flex,
  Text,
  IconButton,
  useOutsideClick,
  useColorModeValue,
  VStack,
  Badge,
  Spinner,
  Kbd,
  chakra,
  HStack,
} from "@chakra-ui/react";
import { useState, useRef, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(chakra.div);

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // NEW THEME COLORS
  const accentColor = "#00BFFF"; // Skyblue
  
  // Backgrounds adjusted for Midnight/Skyblue aesthetic
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.95)", "rgba(10, 20, 35, 0.95)");
  const itemHoverBg = useColorModeValue("blue.50", "whiteAlpha.100");
  const inputBg = useColorModeValue("white", "rgba(255, 255, 255, 0.05)");
  const dropdownBorderColor = useColorModeValue("blue.100", "whiteAlpha.200");
  const tagBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const footerBg = useColorModeValue("gray.50", "rgba(0, 0, 0, 0.2)");

  useOutsideClick({ ref, handler: () => setShowDropdown(false) });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length <= 1) {
          setFilteredResults([]);
          return;
        }
        setIsLoading(true);
        setTimeout(() => {
          const results = [
            { id: 1, name: "Premium Wireless Headphones", category: "Audio", price: 299, rating: 4.9, img: "🎧" },
            { id: 2, name: "Minimalist Leather Watch", category: "Accessories", price: 150, rating: 4.7, img: "⌚" },
            { id: 3, name: "Smart Fitness Tracker", category: "Electronics", price: 89, rating: 4.5, img: "⌚" },
          ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setFilteredResults(results);
          setIsLoading(false);
        }, 600);
      }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedFetch(val);
    setShowDropdown(true);
  };

  return (
    <Box position="relative" w={{ base: "full", md: "600px" }} ref={ref} mx="auto">
      {/* GLOW EFFECT */}
      <Box
        position="absolute"
        inset="-2px"
        bgGradient={`linear(to-r, ${accentColor}, #0077FF, ${accentColor})`}
        borderRadius="2xl"
        filter="blur(15px)"
        opacity={showDropdown ? 0.3 : 0}
        transition="opacity 0.4s"
        zIndex={0}
      />

      <InputGroup size="lg" zIndex={1}>
        <InputLeftElement pointerEvents="none" h="full">
          <MotionBox
            animate={{ 
              scale: query ? 1.2 : 1,
              rotate: isLoading ? 360 : 0 
            }}
            transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          >
            {isLoading ? (
              <Spinner size="xs" thickness="2px" color={accentColor} />
            ) : (
              <SearchIcon color={query ? accentColor : "gray.400"} transition="0.3s" />
            )}
          </MotionBox>
        </InputLeftElement>

        <Input
          ref={inputRef}
          placeholder="What are you looking for today?"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          h="60px"
          pl="50px"
          pr="100px"
          bg={inputBg}
          border="1px solid"
          borderColor={showDropdown ? accentColor : "transparent"}
          borderRadius="xl"
          fontSize="16px"
          fontWeight="500"
          color={useColorModeValue("black", "white")}
          boxShadow="0 4px 12px rgba(0,0,0,0.05)"
          _focus={{
            boxShadow: `0 0 20px rgba(0, 191, 255, 0.2)`,
            borderColor: accentColor,
          }}
          transition="all 0.3s"
        />

        <InputRightElement width="100px" h="full" pr={2}>
          <HStack spacing={2}>
            {query && (
              <IconButton
                variant="ghost"
                aria-label="clear"
                icon={<CloseIcon boxSize={2.5} />}
                size="xs"
                onClick={() => setQuery("")}
                borderRadius="full"
              />
            )}
            <Kbd bg="transparent" border="1px solid" borderColor="whiteAlpha.300" color="gray.500" fontSize="10px">
              ⌘K
            </Kbd>
          </HStack>
        </InputRightElement>
      </InputGroup>

      <AnimatePresence>
        {showDropdown && (
          <MotionBox
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            position="absolute"
            top="70px"
            left={0}
            right={0}
            bg={glassBg}
            backdropFilter="blur(20px)"
            borderRadius="2xl"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            border="1px solid"
            borderColor={dropdownBorderColor}
            zIndex={100}
            overflow="hidden"
          >
            <VStack align="stretch" spacing={0}>
              {query.length > 1 ? (
                <Box maxH="400px" overflowY="auto" py={2}>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item, i) => (
                      <MotionBox
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Flex
                          p={4}
                          mx={2}
                          borderRadius="xl"
                          align="center"
                          justify="space-between"
                          cursor="pointer"
                          _hover={{ bg: itemHoverBg, transform: "translateX(8px)" }}
                          transition="all 0.2s"
                        >
                          <HStack spacing={4}>
                            <Center boxSize="50px" bg="blue.500" borderRadius="lg" fontSize="20px">
                              {item.img}
                            </Center>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold" fontSize="15px" color={useColorModeValue("black", "white")}>{item.name}</Text>
                              <Text fontSize="12px" color="gray.500">{item.category}</Text>
                            </VStack>
                          </HStack>
                          <VStack align="end" spacing={1}>
                            <Text fontWeight="800" fontSize="lg" color={accentColor}>${item.price}</Text>
                            <HStack spacing={1}>
                              <StarIcon boxSize={2} color="yellow.400" />
                              <Text fontSize="10px" fontWeight="bold" color="gray.500">{item.rating}</Text>
                            </HStack>
                          </VStack>
                        </Flex>
                      </MotionBox>
                    ))
                  ) : (
                    <Box p={10} textAlign="center">
                      <Text color="gray.500">No results for &quot;{query}&quot;</Text>
                    </Box>
                  )
                  }
                </Box>
              ) : (
                <Box p={5}>
                  <Text fontSize="xs" fontWeight="bold" color="blue.400" mb={4} textTransform="uppercase" letterSpacing="widest">
                    Quick Suggestions
                  </Text>
                  <Flex wrap="wrap" gap={3}>
                    {["Trending", "New Arrivals", "Best Sellers", "Discounts"].map((tag) => (
                      <Badge
                        key={tag}
                        px={4}
                        py={2}
                        borderRadius="full"
                        cursor="pointer"
                        bg={tagBg}
                        color={useColorModeValue("gray.600", "whiteAlpha.800")}
                        _hover={{ bg: accentColor, color: "white", boxShadow: `0 0 15px ${accentColor}` }}
                        transition="0.2s"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}
              
              <Flex bg={footerBg} p={3} justify="center" borderTop="1px solid" borderColor={dropdownBorderColor}>
                <Text fontSize="10px" color="gray.500">
                  Press <Kbd fontSize="9px">↑↓</Kbd> to navigate • <Kbd fontSize="9px">Enter</Kbd> to select
                </Text>
              </Flex>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

const Center = chakra(Flex, {
  baseStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchInput;