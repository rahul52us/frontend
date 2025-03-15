import { Box, Button, Container, Flex, Heading, Text, Input } from '@chakra-ui/react';
import React from 'react';

const NewsLetter = () => {
  return (
    <Box py={{base : 2, md : 8}} px={{base : 2, md : 6}} bgGradient="linear(to-r, blue.100, blue.50)">
      <Container maxW="container.lg">
        <Box py={8} px={8} textAlign="center">
          <Heading as="h2" size="xl" mb={4} color="blue.700" fontWeight="bold">
            Stay Updated!
          </Heading>
          <Text color="gray.600" fontSize="lg" mb={6}>
            Subscribe to receive updates on new products, exclusive offers, and the latest news.
          </Text>
          <Flex
            direction={{ base: "column", md: "row" }}
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              size="lg"
              borderRadius="full"
              borderColor="gray.300"
              focusBorderColor="blue.500"
              _placeholder={{ color: "gray.500" }}
              bg="gray.50"
              shadow="sm"
              maxW="400px"
            />
            <Button
              colorScheme="blue"
              size="lg"
              px={8}
              borderRadius="full"
              shadow="md"
              _hover={{ bg: "blue.600", transform: "scale(1.05)", transition: "0.3s ease-in-out" }}
            >
              Subscribe
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsLetter;