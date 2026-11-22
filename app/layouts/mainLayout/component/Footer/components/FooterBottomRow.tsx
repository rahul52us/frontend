"use client";

import {
  Box,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowUp } from "react-icons/fi";
import { footerData } from "./footerData";

interface FooterBottomRowProps {
  onScrollToTop: () => void;
}

export const FooterBottomRow: React.FC<FooterBottomRowProps> = ({
  onScrollToTop,
}) => {
  const headingColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = "var(--color-primary)";
  const borderColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      align="center"
      justify="space-between"
      pt={3.5}
      spacing={2}
      textAlign={{ base: "center", md: "left" }}
    >
      <Text fontSize="11px" color={mutedText}>
        &copy; {new Date().getFullYear()}{" "}
        <Text as="span" color={headingColor} fontWeight="700">
          {footerData.companyInfo.name}
        </Text>
        . All rights reserved. Crafted with ❤️ in India.
      </Text>

      <HStack
        spacing={{ base: 3, md: 5 }}
        flexWrap="wrap"
        justify="center"
        divider={<Box w="1px" h="10px" bg={borderColor} />}
      >
        {footerData.legalLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            fontSize="11px"
            color={mutedText}
            _hover={{ color: accentColor }}
          >
            {link.name}
          </Link>
        ))}
        <HStack
          as="button"
          onClick={onScrollToTop}
          spacing={1}
          fontSize="11px"
          fontWeight="600"
          color={accentColor}
          _hover={{ textDecoration: "underline" }}
        >
          <Icon as={FiArrowUp} boxSize={3} />
          <Text>Top</Text>
        </HStack>
      </HStack>
    </Stack>
  );
};

export default React.memo(FooterBottomRow);

