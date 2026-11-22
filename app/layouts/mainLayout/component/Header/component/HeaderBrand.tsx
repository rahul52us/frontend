"use client";

import {
  Box,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

export const HeaderBrand: React.FC = () => {
  const router = useRouter();

  return (
    <Flex
      as="button"
      onClick={() => router.push("/")}
      align="center"
      gap={2.5}
      textAlign="left"
      _focus={{ outline: "none" }}
    >
      <Image
        src="/images/logo3.jpg"
        alt="Business Sahayata"
        h={{ base: "30px", md: "38px" }}
        w="auto"
        objectFit="contain"
        borderRadius="md"
      />
      <Box display={{ base: "block", sm: "block" }}>
        <Text
          fontWeight="800"
          fontSize={{ base: "13px", md: "md" }}
          bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
          bgClip="text"
          letterSpacing="tight"
          lineHeight="1.1"
        >
          Business Sahayata
        </Text>
        <Text
          display={{ base: "none", lg: "block" }}
          fontSize="10px"
          color="gray.500"
          fontWeight="medium"
        >
          Local Marketplace
        </Text>
      </Box>
    </Flex>
  );
};

export default HeaderBrand;

