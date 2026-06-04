"use client";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";

const JoinCommunitySection = () => {
  return (
    <Box py={{ base: "40px", md: "60px" }} px={{ base: 4, md: 8 }} bg="gray.50">
      <Box maxW="840px" mx="auto" textAlign="center">
        <Stack spacing={5} align="center">
          <Heading size="xl">Join Our Community</Heading>
          <Text fontSize="lg" color="gray.600">
            Become part of a supportive community focused on growth, collaboration, and success.
          </Text>
          <Button colorScheme="brand" size="lg">
            Join Now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default JoinCommunitySection;
