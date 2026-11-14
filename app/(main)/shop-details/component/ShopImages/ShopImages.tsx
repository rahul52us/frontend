"use client";

import {
  AspectRatio,
  Box,
  Heading,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const extractImageUrl = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item?.file?.url || item?.url || item?.src || "";
};

const ShopImages = ({ shopData }: { shopData: any }) => {
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const cardBorder = useColorModeValue("gray.100", "gray.750");

  const rawGallery =
    shopData?.gallery ||
    shopData?.images ||
    shopData?.photos ||
    shopData?.data?.gallery ||
    [];

  const gallery: string[] = Array.isArray(rawGallery)
    ? rawGallery.map(extractImageUrl).filter(Boolean)
    : [];

  if (gallery.length === 0) {
    return null;
  }

  return (
    <VStack align="stretch" spacing={4} w="full">
      <Box>
        <Heading
          as="h3"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="800"
          color={textPrimary}
          letterSpacing="-0.02em"
        >
          Photo gallery
        </Heading>
        <Text fontSize="sm" color={textMuted} mt={0.5}>
          Take a look inside the shop and explore recent highlights
        </Text>
      </Box>

      {/* Horizontal Snap Scroll Gallery */}
      <Box
        mx={{ base: -4, md: 0 }}
        px={{ base: 4, md: 0 }}
        overflowX="auto"
        display="flex"
        gap={{ base: 3, md: 4 }}
        css={{
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
        pb={2}
      >
        {gallery.map((url, index) => (
          <Box
            key={`${url}-${index}`}
            flexShrink={0}
            w={{ base: "72%", sm: "45%", md: "31%", lg: "24%" }}
            scrollSnapAlign="center"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor={cardBorder}
            bg="gray.100"
            boxShadow="0 4px 12px rgba(0,0,0,0.04)"
            transition="all 0.3s ease"
            _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
          >
            <AspectRatio ratio={4 / 5} w="full">
              <Image
                src={url}
                alt={`Shop photo ${index + 1}`}
                objectFit="cover"
                loading="lazy"
              />
            </AspectRatio>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default ShopImages;
