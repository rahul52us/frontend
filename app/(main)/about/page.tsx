'use client';

import { Heading, Text, Button, VStack } from "@chakra-ui/react";

export default function AboutPage() {
  return (
    <VStack spacing={6} align="center" p={8}>
      <Heading as="h1" size="2xl" textAlign="center" color="brand.primary">
        About Us
      </Heading>
      <Text fontSize="lg" color="brand.secondary" textAlign="center">
        Welcome to MetaMind! We are dedicated to creating cutting-edge web experiences using modern technologies.
      </Text>
      <Text fontSize="md" color="gray.600" textAlign="center">
        Our mission is to bring creativity and functionality together to deliver projects that exceed expectations.
      </Text>
      <Button variant="solid" colorScheme="teal" size="lg" mt={4}>
        Learn More
      </Button>
    </VStack>
  );
}
