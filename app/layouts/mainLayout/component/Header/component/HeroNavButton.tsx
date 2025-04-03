"use client";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const HeroNavButton = () => {
  const router = useRouter();

  return (
    <Box display="flex" gap={2}>
      <Button
        size="md"
        variant="outline"
        border="2px solid transparent" // Keep border minimal initially
        fontWeight="medium"
        bgGradient="linear(to-r, teal.400, blue.500)"
        backgroundClip="text" // Apply gradient to text
        _hover={{
          color: "white",
          bgGradient: "linear(to-r, blue.500, teal.400)", // Reverse gradient on hover
          borderColor: "blue.400", // Add border effect
          transform: "scale(1.07)", // Slight scale-up effect
          boxShadow: "lg", // Add subtle shadow for depth
        }}
        transition="all 0.3s ease-in-out"
        onClick={() => router.push("/login")}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default HeroNavButton;
