"use client";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import stores from "../../../../../store/stores";

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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { layout } = stores;
  const inputRef = useRef<HTMLInputElement>(null);
  const productsUrlSyncTimerRef = useRef<number | null>(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = "purple.500";
  const productSearchParam = searchParams.get("search") || searchParams.get("q") || "";

  useEffect(() => {
    if (pathname?.startsWith("/products")) {
      setQuery(productSearchParam);
      layout.setProductSearchQuery(productSearchParam);
    }
  }, [layout, pathname, productSearchParam]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const getProductsSearchHref = useCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearch = searchTerm.trim();

    params.delete("q");

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    const queryString = params.toString();
    return `/products${queryString ? `?${queryString}` : ""}`;
  }, [searchParams]);

  const updateProductsSearch = useCallback((
    value: string,
    mode: "replace" | "push" = "replace"
  ) => {
    const trimmedValue = value.trim();
    const isProductsPage = pathname?.startsWith("/products");

    if (!trimmedValue && !isProductsPage) {
      return;
    }

    const href = getProductsSearchHref(trimmedValue);

    if (mode === "push") {
      router.push(href);
      return;
    }

    if (isProductsPage && typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", href);
      return;
    }

    router.replace(href, { scroll: false });
  }, [getProductsSearchHref, pathname, router]);

  const clearProductsUrlSyncTimer = useCallback(() => {
    if (productsUrlSyncTimerRef.current) {
      window.clearTimeout(productsUrlSyncTimerRef.current);
      productsUrlSyncTimerRef.current = null;
    }
  }, []);

  const queueProductsUrlSync = useCallback((value: string) => {
    if (!pathname?.startsWith("/products")) {
      return;
    }

    clearProductsUrlSyncTimer();
    productsUrlSyncTimerRef.current = window.setTimeout(() => {
      updateProductsSearch(value);
      productsUrlSyncTimerRef.current = null;
    }, 450);
  }, [clearProductsUrlSyncTimer, pathname, updateProductsSearch]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    layout.setProductSearchQuery(value);
    queueProductsUrlSync(value);
  };

  useEffect(() => clearProductsUrlSyncTimer, [clearProductsUrlSyncTimer]);

  useEffect(() => {
    if (pathname?.startsWith("/products") || !query.trim()) {
      return undefined;
    }

    if (document.activeElement !== inputRef.current) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      updateProductsSearch(query, "push");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [pathname, query, updateProductsSearch]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedSearch = String(formData.get("search") || "").trim();

    setQuery(submittedSearch);
    layout.setProductSearchQuery(submittedSearch);
    clearProductsUrlSyncTimer();
    updateProductsSearch(submittedSearch, "push");
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    layout.setProductSearchQuery("");
    clearProductsUrlSyncTimer();
    updateProductsSearch("");
    inputRef.current?.focus();
  };

  return (
    <Box position="relative" w="full" mx={{ base: 2, md: 4 }}>
      <Box as="form" action="/products" method="get" onSubmit={handleSubmit}>
        <InputGroup size="lg" w="full">
          <InputLeftElement pointerEvents="none">
            <SearchIcon
              color={query ? accentColor : "gray.400"}
              transition="all 0.3s ease"
              transform={query ? "scale(1.1)" : "scale(1)"}
            />
          </InputLeftElement>

          <Input
            ref={inputRef}
            name="search"
            placeholder={placeholderSuggestions[placeholderIndex]}
            borderRadius="full"
            borderWidth="2px"
            borderColor={query ? accentColor : borderColor}
            bg={bgColor}
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
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
              fontStyle: "italic",
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
              <IconButton
                icon={<CloseIcon boxSize={4} />}
                aria-label="Clear Search"
                size="md"
                variant="ghost"
                color="gray.500"
                _hover={{ color: accentColor, bg: "gray.100" }}
                transition="all 0.3s ease"
                onClick={clearSearch}
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>
    </Box>
  );
});

export default SearchInput;
