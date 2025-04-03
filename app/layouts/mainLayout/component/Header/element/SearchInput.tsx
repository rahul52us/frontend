'use client'
import { SearchIcon, CloseIcon, ChevronDownIcon, StarIcon } from "@chakra-ui/icons";
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
  Divider,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import { keyframes } from "@emotion/react";

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const placeholderFade = keyframes`
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
`;

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const ref = useRef(null);
  const inputRef = useRef(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const accentColor = "purple.500";

  useOutsideClick({
    ref,
    handler: () => setShowDropdown(false),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRecentSearches(JSON.parse(localStorage.getItem("recentSearches") || "[]"));
    }
  }, []);

  const popularSearches = [
    { term: "Fresh Fruits", trending: true },
    { term: "Milk Products", trending: false },
    { term: "Snacks", trending: true },
    { term: "Vegetables", trending: false },
  ];

  const placeholderSuggestions = [
    "Search for products",
    "Find your brands",
    "Explore deals",
    "Discover more",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderSuggestions]);

  const fetchSearchResults = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length <= 1) {
        setFilteredResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const mockApiCall = new Promise((resolve) => {
          setTimeout(() => {
            const results = [
              { id: 1, name: "Apple iPhone 13", category: "electronics", price: 799, rating: 4.5 },
              { id: 2, name: "Leather Jacket", category: "fashion", price: 199, rating: 4.2 },
              { id: 3, name: "Smart TV", category: "electronics", price: 499, rating: 4.7 },
              { id: 4, name: "Running Shoes", category: "fashion", price: 89, rating: 4.0 },
            ].filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            resolve(results);
          }, 300);
        });

        const results : any = await mockApiCall;
        setFilteredResults(results);
      } catch ({}) {
      } finally {
        setIsLoading(false);
      }
    }, 200),
    []
  );

  const handleSearch = (value) => {
    setQuery(value);
    fetchSearchResults(value);
    setShowDropdown(true);
  };

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm) return;
    const updatedSearches = [searchTerm, ...recentSearches.filter((item) => item !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedSearches);

    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };


  const handleSelect = (value) => {
    setQuery(value);
    saveSearch(value);
    setShowDropdown(false);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query) {
      handleSelect(query);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current.blur();
    }
  };

  return (
    <Box
      position="relative"
      w={{ base: "full", md: "600px" }}
      ref={ref}
      mx={{ base: 2, md: 4 }}
    >
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon
            color={query ? accentColor : "gray.400"}
            transition="all 0.3s ease"
            transform={query ? "scale(1.1)" : "scale(1)"}
          />
        </InputLeftElement>

        <Input
          ref={inputRef}
          placeholder={placeholderSuggestions[placeholderIndex]}
          borderRadius="full"
          borderWidth="2px"
          borderColor={query ? accentColor : borderColor}
          bg={bgColor}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          _focus={{
            borderColor: accentColor,
            boxShadow: `0 0 0 3px ${accentColor}30`,
            bg: "white",
          }}
          _hover={{
            borderColor: query ? accentColor : "gray.300",
          }}
          _placeholder={{
            color: "gray.500",
            animation: `${placeholderFade} 2.5s infinite`,
            fontStyle: "italic"
          }}
          transition="all 0.3s ease"
          fontSize="md"
          py={6}
          px={12}
          pr="5rem"
          fontWeight="medium"
          boxShadow="sm"
        />

        {query && (
          <InputRightElement width="5rem">
            {isLoading ? (
              <Spinner size="sm" color={accentColor} thickness="2px" />
            ) : (
              <IconButton
                icon={<CloseIcon boxSize={4} />}
                aria-label="Clear Search"
                size="md"
                variant="ghost"
                color="gray.500"
                _hover={{ color: accentColor, bg: "gray.100" }}
                transition="all 0.3s ease"
                onClick={() => {
                  setQuery("");
                  setFilteredResults([]);
                  inputRef.current.focus();
                }}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>

      {showDropdown && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={3}
          bg={bgColor}
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.1)"
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          maxH="500px"
          overflowY="auto"
          zIndex={20}
          p={4}
          animation={`${slideIn} 0.25s ease-out`}
        >
          <VStack align="stretch" spacing={4}>
            {query.length <= 1 && recentSearches.length > 0 && (
              <>
                <Flex justify="space-between" align="center" px={2}>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Recent Searches
                  </Text>
                  <Text
                    fontSize="xs"
                    color={accentColor}
                    cursor="pointer"
                    _hover={{ textDecoration: "underline", color: "purple.700" }}
                    transition="all 0.2s"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem("recentSearches");
                    }}
                  >
                    Clear All
                  </Text>
                </Flex>
                {recentSearches.map((search, index) => (
                  <Flex
                    key={index}
                    px={4}
                    py={3}
                    align="center"
                    borderRadius="lg"
                    _hover={{ bg: hoverBg, transform: "translateX(4px)" }}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    bg="gray.50"
                    onClick={() => handleSelect(search)}
                  >
                    <SearchIcon mr={4} color={accentColor} boxSize={5} />
                    <Text fontSize="md" fontWeight="medium" color="gray.700">
                      {search}
                    </Text>
                  </Flex>
                ))}
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {query.length > 1 ? (
              isLoading ? (
                <Flex justify="center" p={6}>
                  <Spinner color={accentColor} size="lg" thickness="3px" />
                </Flex>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <Flex
                    key={result.id}
                    px={4}
                    py={3}
                    justify="space-between"
                    borderRadius="lg"
                    _hover={{ bg: hoverBg, transform: "scale(1.02)" }}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    bg="gray.50"
                    onClick={() => handleSelect(result.name)}
                  >
                    <Flex align="center" gap={4}>
                      <Box
                        w={10}
                        h={10}
                        bg="gray.200"
                        borderRadius="md"
                        flexShrink={0}
                        position="relative"
                        _after={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bg: "gray.300",
                          opacity: 0,
                          transition: "all 0.2s",
                          _hover: { opacity: 0.1 },
                        }}
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" fontSize="md" color="gray.800">
                          {result.name}
                        </Text>
                        <Flex align="center" gap={2}>
                          <StarIcon color="yellow.400" boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            {result.rating} • <Text as="span" fontWeight="medium">{result.category}</Text>
                          </Text>
                        </Flex>
                      </VStack>
                    </Flex>
                    <Badge
                      colorScheme="purple"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="bold"
                      bg={`${accentColor}10`}
                      color={accentColor}
                    >
                      ${result.price}
                    </Badge>
                  </Flex>
                ))
              ) : (
                <Text px={4} py={3} color="gray.500" fontSize="md" fontStyle="italic">
                  No results found
                </Text>
              )
            ) : (
              <>
                <Text
                  px={2}
                  fontSize="sm"
                  color="gray.600"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Popular Searches
                </Text>
                {popularSearches.map((search, index) => (
                  <Flex
                    key={index}
                    px={4}
                    py={3}
                    align="center"
                    borderRadius="lg"
                    _hover={{ bg: hoverBg, transform: "translateX(4px)" }}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    bg="gray.50"
                    onClick={() => handleSelect(search.term)}
                  >
                    <ChevronDownIcon mr={4} color={accentColor} boxSize={6} />
                    <Text fontSize="md" fontWeight="medium" color="gray.700">
                      {search.term}
                    </Text>
                    {search.trending && (
                      <Badge
                        ml={3}
                        colorScheme="red"
                        variant="solid"
                        fontSize="0.75em"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                      >
                        Trending
                      </Badge>
                    )}
                  </Flex>
                ))}
              </>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SearchInput;