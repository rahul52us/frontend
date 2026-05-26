"use client";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const HeroNavButton = () => {
  const router = useRouter();

  return (
    <Box display="flex" gap={2}>
      <Button
        size="md"
        bgGradient="linear(to-r, blue.500, teal.400)"
        color="white"
        fontWeight="semibold"
        boxShadow="lg"
        _hover={{
          transform: "scale(1.03)",
          boxShadow: "xl",
          opacity: 0.95,
        }}
        _active={{ transform: "scale(0.98)" }}
        transition="all 0.2s ease"
        onClick={() => router.push("/login")}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default HeroNavButton;
