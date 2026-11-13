"use client";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import stores from "../../../../../store/stores";

const placeholderSuggestions = [
  "Search products, brands, and more...",
  "Find local sellers near you...",
  "Explore today's exclusive deals...",
  "Discover trending items...",
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

  const productSearchParam =
    searchParams.get("search") || searchParams.get("q") || "";

  useEffect(() => {
    if (pathname?.startsWith("/products")) {
      setQuery(productSearchParam);
      layout.setProductSearchQuery(productSearchParam);
    }
  }, [layout, pathname, productSearchParam]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % placeholderSuggestions.length
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const getProductsSearchHref = useCallback(
    (searchTerm: string) => {
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
    },
    [searchParams]
  );

  const updateProductsSearch = useCallback(
    (value: string, mode: "replace" | "push" = "replace") => {
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
    },
    [getProductsSearchHref, pathname, router]
  );

  const clearProductsUrlSyncTimer = useCallback(() => {
    if (productsUrlSyncTimerRef.current) {
      window.clearTimeout(productsUrlSyncTimerRef.current);
      productsUrlSyncTimerRef.current = null;
    }
  }, []);

  const queueProductsUrlSync = useCallback(
    (value: string) => {
      if (!pathname?.startsWith("/products")) {
        return;
      }

      clearProductsUrlSyncTimer();
      productsUrlSyncTimerRef.current = window.setTimeout(() => {
        updateProductsSearch(value);
        productsUrlSyncTimerRef.current = null;
      }, 450);
    },
    [clearProductsUrlSyncTimer, pathname, updateProductsSearch]
  );

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    <Box position="relative" w="full">
      <Box as="form" action="/products" method="get" onSubmit={handleSubmit}>
        <InputGroup size="md" w="full">
          <InputLeftElement
            pointerEvents="none"
            h={{ base: "36px", md: "38px" }}
            w="38px"
          >
            <SearchIcon
              boxSize={3.5}
              color={query ? "blue.600" : "gray.400"}
              transition="color 0.2s ease"
            />
          </InputLeftElement>

          <Input
            ref={inputRef}
            name="search"
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={placeholderSuggestions[placeholderIndex]}
            h={{ base: "36px", md: "38px" }}
            pl="36px"
            pr={query ? "36px" : "14px"}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="normal"
            color="gray.800"
            bg={query ? "white" : "gray.50"}
            borderRadius="full"
            borderWidth="1px"
            borderColor={query ? "blue.500" : "gray.200"}
            _hover={{
              borderColor: query ? "blue.500" : "gray.300",
              bg: "white",
            }}
            _focus={{
              bg: "white",
              borderColor: "blue.500",
              boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
            }}
            _placeholder={{
              color: "gray.400",
              fontWeight: "normal",
            }}
            transition="all 0.15s ease"
          />

          {query && (
            <InputRightElement
              h={{ base: "36px", md: "38px" }}
              w="36px"
            >
              <IconButton
                icon={<CloseIcon boxSize={2} />}
                aria-label="Clear search"
                size="xs"
                variant="ghost"
                borderRadius="full"
                color="gray.400"
                _hover={{ color: "gray.700", bg: "gray.100" }}
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