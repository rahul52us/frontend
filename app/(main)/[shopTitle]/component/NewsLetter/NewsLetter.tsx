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
import { FiSend, FiSmartphone } from 'react-icons/fi';

const MotionBox = motion(Box);

const NewsLetter = () => {
  return (
    <Box position="relative" py={12} bg="gray.50" borderY="1px solid" borderColor="gray.100">
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 8, lg: 12 }}
          align="center"
          justify="space-between"
        >
          {/* Left: Heading & Context */}
          <HStack spacing={6} flex={1} align="center">
            <Box
              p={3}
              bg="gray.900"
              borderRadius="xl"
              color="white"
              display={{ base: "none", md: "block" }}
            >
              <Icon as={FiSend} boxSize={5} />
            </Box>
            <VStack align="flex-start" spacing={1}>
              <Heading size="md" fontWeight="800" color="gray.900" letterSpacing="-0.02em">
                Stay in the Circle
              </Heading>
              <Text color="gray.500" fontSize="sm" fontWeight="500">
                Early access to collections and private events.
              </Text>
            </VStack>
          </HStack>

          {/* Right: Input Strip */}
          <Flex
            as="form"
            direction={{ base: "column", sm: "row" }}
            gap={3}
            w={{ base: "full", lg: "auto" }}
            maxW={{ lg: "500px" }}
            flex={1}
          >
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.400" h="full">
                <FiSmartphone size={18} />
              </InputLeftElement>
              <Input
                type="tel"
                placeholder="Mobile Number"
                borderRadius="xl"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                fontSize="sm"
                _focus={{
                  borderColor: "gray.900",
                  boxShadow: "none"
                }}
                fontWeight="600"
              />
            </InputGroup>
            <Button
              bg="gray.900"
              color="white"
              size="lg"
              px={8}
              borderRadius="xl"
              fontWeight="800"
              fontSize="sm"
              _hover={{ bg: "black" }}
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