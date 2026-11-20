"use client";

import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import { FiTrendingUp } from "react-icons/fi";
import ShopSection from "../../../component/shopSection/ShopSection";

const ProductsListSection = () => {
  const pageBg = useColorModeValue("#F8FAFC", "gray.950");
  const titleColor = useColorModeValue("gray.900", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
    <Box bg={pageBg} py={{ base: 5, md: 8 }} overflow="hidden">
      <Box mb={{ base: 4, md: 6 }}>
        <HStack spacing={1.5} mb={1}>
          <Icon as={FiTrendingUp} color="var(--color-primary)" boxSize={3.5} />
          <Text
            fontSize="11px"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="wider"
            color="var(--color-primary)"
          >
            Curated For You
          </Text>
        </HStack>
        <Heading
          as="h2"
          fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
          fontWeight="800"
          color={titleColor}
          letterSpacing="tight"
          lineHeight="1.2"
        >
          Top Picks For You
        </Heading>
        <Text
          display={{ base: "none", sm: "block" }}
          fontSize="xs"
          color={mutedText}
          mt={0.5}
        >
          Handpicked everyday favorites from trusted local sellers
        </Text>
      </Box>

      <Box>
        <ShopSection enableInfiniteLoad={false} />
      </Box>
    </Box>
  );
};

export default memo(ProductsListSection);
