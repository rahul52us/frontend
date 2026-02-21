"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Input,
  Icon,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail } from 'react-icons/fi';

const NewsLetter = () => {
  return (
    <Box position="relative" py={{ base: 6, md: 10 }} bg="gray.50" borderY="1px solid" borderColor="gray.100">
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 4, lg: 8 }}
          align="center"
          justify="space-between"
          textAlign={{ base: "center", lg: "left" }}
        >
          {/* Left: Heading */}
          <HStack spacing={4} align="center">
            <Box
              p={2.5}
              bg="gray.900"
              borderRadius="lg"
              color="white"
              display={{ base: "none", md: "block" }}
            >
              <Icon as={FiSend} boxSize={4} />
            </Box>
            <VStack align={{ base: "center", lg: "flex-start" }} spacing={0}>
              <Heading size="sm" fontWeight="800" color="gray.900" letterSpacing="-0.02em">
                Stay in the Circle
              </Heading>
              <Text color="gray.500" fontSize="xs" fontWeight="600" display={{ base: "none", sm: "block" }}>
                Curated collections and private events.
              </Text>
            </VStack>
          </HStack>

          {/* Right: Ultra-Compact Input Row */}
          <Flex
            as="form"
            w={{ base: "full", lg: "auto" }}
            maxW={{ base: "full", sm: "400px", lg: "450px" }}
            bg="white"
            p={1}
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            align="center"
          >
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiMail size={16} />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="Email address"
                variant="unstyled"
                px={2}
                fontSize="sm"
                fontWeight="600"
                _placeholder={{ color: "gray.400" }}
              />
            </InputGroup>
            <Button
              bg="gray.900"
              color="white"
              size="sm"
              px={6}
              h="36px"
              borderRadius="lg"
              fontWeight="800"
              fontSize="xs"
              _hover={{ bg: "black" }}
              flexShrink={0}
            >
              JOIN
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default NewsLetter;