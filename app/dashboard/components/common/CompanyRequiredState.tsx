"use client";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

type CompanyRequiredStateProps = {
  message?: string;
};

const CompanyRequiredState: React.FC<CompanyRequiredStateProps> = ({
  message = "Please create your shop first",
}) => {
  const router = useRouter();

  return (
    <Box minH="65vh" display="flex" alignItems="center" justifyContent="center" px={4}>
      <VStack spacing={4} textAlign="center" maxW="lg">
        <Heading size="md" color="gray.700">
          {message}
        </Heading>
        <Text color="gray.500">
          Complete shop setup to access buyers, orders, products, and other seller features.
        </Text>
        <Button colorScheme="blue" onClick={() => router.push("/dashboard/shop")}>
          Create Shop
        </Button>
      </VStack>
    </Box>
  );
};

export default CompanyRequiredState;

