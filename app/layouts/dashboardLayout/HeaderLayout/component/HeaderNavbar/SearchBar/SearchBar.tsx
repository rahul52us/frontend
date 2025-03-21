"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  InputGroup,
  Input,
  InputLeftElement,
  List,
  ListItem,
  Flex,
  Text,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Link from "next/link";
import { sidebarData } from "../../../../SidebarLayout/utils/SidebarItems";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearchDebounced = debounce((query: string) => handleSearch(query), 100);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setResults([]);
      return;
    }

    const filtered = sidebarData.filter((item: any) =>
      item?.name?.toLowerCase()?.includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  // Function to highlight the searched term
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text as="span" key={index} color="yellow.500" fontWeight="bold">
          {part}
        </Text>
      ) : (
        <Text as="span" key={index}>
          {part}
        </Text>
      )
    );
  };


  return (
    <Box position="relative" width="300px" ref={dropdownRef}>
      <InputGroup>
        <InputLeftElement>
          <FaSearch color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Start typing to search..."
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 4px teal" }}
          _hover={{ borderColor: "gray.400" }}
          borderRadius="full"
          px={4}
          py={2}
          value={searchQuery}
          onChange={(e) => handleSearchDebounced(e.target.value)}
        />
      </InputGroup>

      {results.length > 0 && (
        <List
          bg="white"
          mt={2}
          borderRadius="lg"
          boxShadow="xl"
          position="absolute"
          width="100%"
          zIndex={100}
          border="1px solid"
          borderColor="gray.200"
          maxHeight="300px"
          overflowY="auto"
          overflowX="hidden"
        >
          {results.map((result: any, index: number) => (
            <ListItem
              key={result.url}
              px={4}
              py={3}
              _hover={{
                bg: "teal.50",
                cursor: "pointer",
                transform: "scale(1.01)",
                transition: "transform 0.2s ease-in-out",
              }}
              borderBottom={index < results.length - 1 ? "1px solid" : "none"}
              borderColor="gray.100"
            >
              <Link
                href={result.url}
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                }}
              >
                <Flex align="center" gap={4}>
                  <Box fontSize="24px" color="teal.500">
                    {result.icon}
                  </Box>
                  <Text fontWeight="semibold" fontSize="md" color="gray.700">
                    {highlightText(result.name, searchQuery)}
                  </Text>
                </Flex>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;
