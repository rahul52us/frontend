"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiMapPin, FiNavigation } from "react-icons/fi";

const LocationSection = ({ shopData }: any) => {
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const mapBorder = useColorModeValue("gray.200", "gray.700");
  const btnBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const btnColor = useColorModeValue("blue.600", "blue.300");

  const loc = shopData?.location;
  const address = [
    loc?.address,
    loc?.city,
    loc?.state,
    loc?.postalCode || loc?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const displayAddress =
    address || shopData?.address || "Address not specified";

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    displayAddress
  )}`;

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    displayAddress
  )}&output=embed`;

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      p={{ base: 5, md: 7 }}
      boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor={borderColor}
      w="full"
      h="full"
    >
      <VStack align="stretch" spacing={4} justify="space-between" h="full">
        {/* Header & Address */}
        <Flex align="start" gap={3}>
          <Box
            p={2.5}
            borderRadius="xl"
            bg="var(--color-surface-hover)"
            color="var(--color-primary)"
            flexShrink={0}
            mt={0.5}
          >
            <Icon as={FiMapPin} boxSize={5} />
          </Box>
          <Box minW={0} flex={1}>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="800"
              color={textPrimary}
              letterSpacing="-0.01em"
            >
              Address
            </Heading>
            <Text fontSize="sm" color={textMuted} mt={1} lineHeight="tall">
              {displayAddress}
            </Text>
          </Box>
        </Flex>

        {/* Embedded Map */}
        <Box
          h={{ base: "190px", md: "210px" }}
          w="full"
          borderRadius="2xl"
          overflow="hidden"
          border="1px solid"
          borderColor={mapBorder}
          position="relative"
          bg="gray.100"
        >
          <iframe
            title="Shop Location Map"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        {/* Get Directions Button */}
        <Button
          as="a"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<FiNavigation />}
          w="full"
          h="44px"
          borderRadius="full"
          bg={btnBg}
          color={btnColor}
          fontWeight="bold"
          fontSize="sm"
          _hover={{ bg: "blue.100", transform: "scale(1.01)" }}
          _active={{ transform: "scale(0.98)" }}
          transition="all 0.2s ease"
        >
          Get directions
        </Button>
      </VStack>
    </Box>
  );
};

export default LocationSection;
