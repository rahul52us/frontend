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
  const searchUrlSyncTimerRef = useRef<number | null>(null);

  const productSearchParam =
    searchParams.get("q") || searchParams.get("search") || "";

  // Synchronize input with URL query when on search page, or clear when navigating home
  useEffect(() => {
    if (pathname?.startsWith("/search") || pathname?.startsWith("/products")) {
      setQuery(productSearchParam);
      layout.setProductSearchQuery(productSearchParam);
    } else if (pathname === "/" || pathname === "/home") {
      if (!productSearchParam) {
        setQuery("");
        layout.setProductSearchQuery("");
      }
    }
  }, [layout, pathname, productSearchParam]);

  // Rotate animated placeholders
  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % placeholderSuggestions.length
      );
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const getSearchHref = useCallback((searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      return "/search";
    }
    return `/search?q=${encodeURIComponent(trimmed)}`;
  }, []);

  const clearSyncTimer = useCallback(() => {
    if (searchUrlSyncTimerRef.current) {
      window.clearTimeout(searchUrlSyncTimerRef.current);
      searchUrlSyncTimerRef.current = null;
    }
  }, []);

  // Live URL sync ONLY when user is already on the dedicated /search page
  const queueUrlSync = useCallback(
    (value: string) => {
      if (!pathname?.startsWith("/search")) {
        return;
      }

      clearSyncTimer();
      searchUrlSyncTimerRef.current = window.setTimeout(() => {
        const trimmed = value.trim();
        const href = getSearchHref(trimmed);
        if (typeof window !== "undefined") {
          window.history.replaceState(window.history.state, "", href);
        } else {
          router.replace(href, { scroll: false });
        }
        searchUrlSyncTimerRef.current = null;
      }, 400);
    },
    [clearSyncTimer, getSearchHref, pathname, router]
  );

  const handleSearchChange = (value: string) => {
    setQuery(value);
    layout.setProductSearchQuery(value);
    queueUrlSync(value);
  };

  useEffect(() => clearSyncTimer, [clearSyncTimer]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedSearch = String(
      formData.get("q") || formData.get("search") || query || ""
    ).trim();

    setQuery(submittedSearch);
    layout.setProductSearchQuery(submittedSearch);
    clearSyncTimer();

    // Redirect user to the dedicated Search Results page on Enter
    const targetHref = getSearchHref(submittedSearch);
    router.push(targetHref);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    layout.setProductSearchQuery("");
    clearSyncTimer();
    if (pathname?.startsWith("/search")) {
      router.replace("/search", { scroll: false });
    }
    inputRef.current?.focus();
  };

  return (
    <Box position="relative" w="full">
      <Box as="form" action="/search" method="get" onSubmit={handleSubmit}>
        <InputGroup size="md" w="full">
          <InputLeftElement
            pointerEvents="none"
            h={{ base: "36px", md: "38px" }}
            w="38px"
          >
            <SearchIcon
              boxSize={3.5}
              color={query ? "var(--color-primary)" : "var(--color-text-muted)"}
              transition="color 0.2s ease"
            />
          </InputLeftElement>

          <Input
            ref={inputRef}
            name="q"
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={placeholderSuggestions[placeholderIndex]}
            h={{ base: "36px", md: "38px" }}
            pl="36px"
            pr={query ? "36px" : "14px"}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="normal"
            color="var(--color-text)"
            bg={query ? "var(--color-surface)" : "var(--color-surface-hover)"}
            borderRadius="full"
            borderWidth="1px"
            borderColor={query ? "var(--color-primary)" : "var(--color-border)"}
            _hover={{
              borderColor: "var(--color-primary)",
              bg: "var(--color-surface)",
            }}
            _focus={{
              bg: "var(--color-surface)",
              borderColor: "var(--color-primary)",
              boxShadow: "0 0 0 3px rgba(6, 95, 104, 0.2)",
            }}
            _placeholder={{
              color: "var(--color-text-muted)",
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
                color="var(--color-text-muted)"
                _hover={{ color: "var(--color-text)", bg: "var(--color-surface-hover)" }}
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
