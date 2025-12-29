"use client";

import { Box, Button, Icon, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiLogIn } from "react-icons/fi";
import React from "react";

const HeroNavButton: React.FC = () => {
  const router = useRouter();

  const glowColor = useColorModeValue("blue.400", "teal.300");

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={() => router.push("/login")}
        size="md"
        px={6}
        py={5}
        fontWeight="semibold"
        letterSpacing="wide"
        borderRadius="full"
        leftIcon={<Icon as={FiLogIn} boxSize={5} />}
        color="white"
        bgGradient="linear(to-r, teal.400, blue.500)"
        boxShadow={`0 0 0px ${glowColor}`}
        _hover={{
          bgGradient: "linear(to-r, blue.500, teal.400)",
          transform: "translateY(-2px) scale(1.08)",
          boxShadow: `0 0 25px ${glowColor}`,
        }}
        _active={{
          transform: "scale(0.96)",
          boxShadow: `0 0 15px ${glowColor}`,
        }}
        transition="all 0.35s ease"
      >
        Sign In
      </Button>
    </Box>
  );
};

export default HeroNavButton;
