"use client";

import {
  Box,
  Heading,
  HStack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { memo } from "react";

type ShopAboutProps = {
  shopData: {
    about?: string;
    tags?: string[];
    name?: string;
  };
};

const ShopAbout: React.FC<ShopAboutProps> = memo(({ shopData }) => {
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const tagBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const tagColor = useColorModeValue("blue.600", "blue.300");

  const aboutText =
    shopData?.about || "This shop hasn't added a description yet.";

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      p={{ base: 6, md: 8 }}
      boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack align="stretch" spacing={4}>
        <Heading
          as="h2"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="800"
          color={textPrimary}
          letterSpacing="-0.02em"
        >
          Our story
        </Heading>

        <Text
          color={textMuted}
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="tall"
          whiteSpace="pre-line"
        >
          {aboutText}
        </Text>

        {shopData?.tags && shopData.tags.length > 0 && (
          <HStack spacing={2} flexWrap="wrap" pt={2}>
            {shopData.tags.map((tag: string, idx: number) => (
              <Tag
                key={`${tag}-${idx}`}
                size="md"
                borderRadius="full"
                variant="subtle"
                bg={tagBg}
                color={tagColor}
                fontWeight="semibold"
                px={3}
                py={1.5}
                fontSize="xs"
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
});

ShopAbout.displayName = "ShopAbout";

export default ShopAbout;
