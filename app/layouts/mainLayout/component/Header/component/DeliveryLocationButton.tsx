"use client";

import {
  Box,
  Circle,
  HStack,
  Icon,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiMapPin } from "react-icons/fi";

interface DeliveryLocationButtonProps {
  locality: string;
  fullAddress: string;
  onClick: () => void;
}

export const DeliveryLocationButton: React.FC<DeliveryLocationButtonProps> = ({
  locality,
  fullAddress,
  onClick,
}) => {
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const titleColor = useColorModeValue("gray.900", "white");

  return (
    <Tooltip
      label={`Deliver to: ${fullAddress}`}
      hasArrow
      placement="bottom-start"
      openDelay={250}
    >
      <HStack
        as="button"
        spacing={2}
        py={1.5}
        px={2.5}
        borderRadius="xl"
        _hover={{ bg: hoverBg }}
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        textAlign="left"
        cursor="pointer"
        _focus={{ outline: "none" }}
        role="group"
        onClick={onClick}
      >
        <Circle
          size="34px"
          bg="var(--color-primary-soft)"
          color="var(--color-primary)"
          flexShrink={0}
          transition="transform 0.2s ease"
          _groupHover={{ transform: "scale(1.08)" }}
        >
          <Icon as={FiMapPin} boxSize={3.5} />
        </Circle>
        <Box minW={0} lineHeight="1.15">
          <HStack spacing={1} align="center">
            <Text
              fontSize="12.5px"
              fontWeight="800"
              color={titleColor}
              letterSpacing="-0.2px"
            >
              Delivery in 15-30 mins
            </Text>
            <Text
              fontSize="10px"
              color="gray.400"
              transition="transform 0.2s"
              _groupHover={{ transform: "translateY(1px)", color: "var(--color-primary)" }}
            >
              ▼
            </Text>
          </HStack>
          <Text
            fontSize="11.5px"
            fontWeight="600"
            color="gray.500"
            noOfLines={1}
            maxW={{ base: "130px", md: "170px", lg: "220px" }}
          >
            {locality}
          </Text>
        </Box>
      </HStack>
    </Tooltip>
  );
};

export default DeliveryLocationButton;

