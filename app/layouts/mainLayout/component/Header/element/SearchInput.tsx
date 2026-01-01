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
} from "@chakra-ui/react";
import { useState, useRef, useEffect, useMemo } from "react"; // Removed unused useCallback
import debounce from "lodash/debounce";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = chakra(motion.div);

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accentColor = "#FF6F61";
  
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)");
  const inputBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const inputFocusBg = useColorModeValue("white", "gray.800");
  const dropdownBorder = useColorModeValue("whiteAlpha.900", "whiteAlpha.200");
  const itemHoverBg = useColorModeValue("white", "whiteAlpha.100");

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
            { id: 1, name: "Premium Wireless Headphones", category: "Audio", price: 299, rating: 4.9 },
            { id: 2, name: "Minimalist Leather Watch", category: "Accessories", price: 150, rating: 4.7 },
          ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setFilteredResults(results);
          setIsLoading(false);
        }, 400);
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
    <Box position="relative" w={{ base: "full", md: "550px" }} ref={ref} mx={4}>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <MotionBox
            animate={{
              rotate: query ? 90 : 0,
              color: query ? accentColor : "#A0AEC0",
            }}
          >
            <SearchIcon boxSize={4} />
          </MotionBox>
        </InputLeftElement>

        <Input
          ref={inputRef}
          placeholder="Search collections..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          variant="unstyled"
          h="50px"
          px="45px"
          borderRadius="xl"
          bg={inputBg}
          border="1px solid"
          borderColor="transparent"
          _focus={{
            borderColor: accentColor,
            bg: inputFocusBg,
            boxShadow: "0 0 20px rgba(255, 111, 97, 0.15)",
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          fontSize="15px"
          fontWeight="500"
        />

        <InputRightElement width="4.5rem">
          {query ? (
            isLoading ? (
              <Spinner size="xs" color={accentColor} />
            ) : (
              <IconButton
                variant="ghost"
                aria-label="clear"
                icon={<CloseIcon boxSize={3} />}
                size="xs"
                onClick={() => setQuery("")}
              />
            )
          ) : (
            <Kbd display={{ base: "none", md: "inline-block" }} py={0.5} opacity={0.6}>
              ⌘K
            </Kbd>
          )}
        </InputRightElement>
      </InputGroup>

      <AnimatePresence>
        {showDropdown && (
          <MotionBox
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            position="absolute"
            top="110%"
            left={0}
            right={0}
            bg={glassBg}
            backdropFilter="blur(12px)"
            borderRadius="2xl"
            boxShadow="0 20px 50px rgba(0,0,0,0.15)"
            border="1px solid"
            borderColor={dropdownBorder}
            zIndex={100}
            overflow="hidden"
            p={2}
          >
            <VStack align="stretch" spacing={1}>
              {query.length > 1 ? (
                filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <Flex
                      key={item.id}
                      p={3}
                      align="center"
                      justify="space-between"
                      borderRadius="xl"
                      cursor="pointer"
                      role="group"
                      _hover={{ bg: itemHoverBg }}
                      transition="0.2s"
                    >
                      <Flex align="center" gap={4}>
                        <Box boxSize="45px" bg="gray.200" borderRadius="lg" overflow="hidden" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="700" fontSize="14px">
                            {item.name}
                          </Text>
                          <Text fontSize="12px" color="gray.500">
                            {item.category}
                          </Text>
                        </VStack>
                      </Flex>
                      <Flex align="center" gap={3}>
                        <Text fontWeight="800" fontSize="14px" color={accentColor}>
                          ${item.price}
                        </Text>
                        <Icon as={StarIcon} color="orange.300" boxSize={3} />
                      </Flex>
                    </Flex>
                  ))
                ) : (
                  <Flex p={8} direction="column" align="center">
                    <Text color="gray.400" fontSize="14px">
                      No matches found for &quot;{query}&quot;
                    </Text>
                  </Flex>
                )
              ) : (
                <Box p={4}>
                  <Text
                    fontSize="11px"
                    fontWeight="800"
                    color="gray.400"
                    textTransform="uppercase"
                    mb={3}
                    letterSpacing="1px"
                  >
                    Trending Now
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {["AirPods", "Sneakers", "Summer Sale"].map((tag) => (
                      <Badge
                        key={tag}
                        px={3}
                        py={1}
                        borderRadius="full"
                        textTransform="none"
                        cursor="pointer"
                        _hover={{ bg: accentColor, color: "white" }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

const Icon = chakra(Box, {
  baseStyle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchInput;