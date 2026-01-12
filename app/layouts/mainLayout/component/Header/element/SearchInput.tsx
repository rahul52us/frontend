"use client";
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
  Image as ChakraImage,
} from "@chakra-ui/react";
import { useState, useRef, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import { keyframes } from "@emotion/react";
import { observer } from "mobx-react-lite";
import stores from "../../../../../store/stores";
import { useRouter } from "next/navigation";

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

const placeholderSuggestions = [
  "Search for products",
  "Find your brands",
  "Explore deals",
  "Discover more",
];

const SearchInput = observer(() => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSearchResults = useMemo(
    () => debounce(async (searchQuery) => {
      if (searchQuery.length <= 1) {
        setFilteredResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await stores.shopStore.searchGlobalProducts({
          search: searchQuery,
          limit: 5,
        });
        const results = response.data?.products || [];
        setFilteredResults(results);
      } catch {
        setFilteredResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    []
  );

  const handleSearch = (value: string) => {
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


  const handleSelect = (item: any) => {
    // If item is a string (from recent/popular searches), set query and search
    // If item is a product object, navigate to product page

    if (typeof item === 'string') {
      setQuery(item);
      fetchSearchResults(item);
      saveSearch(item);
      // showDropdown remains true or re-opens to show results for the string
    } else {
      // Product selection
      setQuery(item.name);
      saveSearch(item.name);
      setShowDropdown(false);
      if (inputRef.current) inputRef.current.blur();
      router.push(`/product/${item._id}`);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && query) {
      // Perform search on Enter
      handleSelect(query);
      setShowDropdown(false);
      if (inputRef.current) inputRef.current.blur();
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
      if (inputRef.current) inputRef.current.blur();
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
                  if (inputRef.current) inputRef.current.focus();
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
                    key={result._id}
                    px={4}
                    py={3}
                    justify="space-between"
                    borderRadius="lg"
                    _hover={{ bg: hoverBg, transform: "scale(1.02)" }}
                    cursor="pointer"
                    transition="all 0.2s ease"
                    bg="gray.50"
                    onClick={() => handleSelect(result)}
                  >
                    <Flex align="center" gap={4}>
                      <Box
                        w={10}
                        h={10}
                        bg="gray.200"
                        borderRadius="md"
                        flexShrink={0}
                        position="relative"
                      // actual image
                      // backgroundImage={`url(${result.images?.[0]?.url || ''})`} 
                      // backgroundSize="cover"
                      >
                        {result.images && result.images.length > 0 && (
                          <ChakraImage src={result.images[0]} alt={result.name} w="100%" h="100%" objectFit="cover" borderRadius="4px" />
                        )}
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" fontSize="md" color="gray.800">
                          {result.name}
                        </Text>
                        <Flex align="center" gap={2}>
                          {/* Rating might not be in the product object directly, adjust if needed */}
                          {result.rating && (
                            <>
                              <StarIcon color="yellow.400" boxSize={4} />
                              <Text fontSize="sm" color="gray.600">
                                {result.rating}
                              </Text>
                            </>
                          )}
                          <Text as="span" fontSize="sm" color="gray.500" fontWeight="medium">{result.category}</Text>
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
                      ₹{result.price}
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
});

export default SearchInput;