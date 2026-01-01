"use client";

import { Box, Button, Icon, chakra } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import React from "react";
import { motion } from "framer-motion";

// MotionBox removed as it was unused and causing ESLint errors

const HeroNavButton: React.FC = () => {
  const router = useRouter();
  const accentColor = "#FF6F61";

  return (
    <Box display="flex" alignItems="center">
      <Button
        onClick={() => router.push("/login")}
        size="md"
        h="45px"
        px={7}
        fontWeight="800"
        fontSize="13px"
        letterSpacing="1.2px"
        textTransform="uppercase"
        borderRadius="full"
        leftIcon={<Icon as={FiUser} boxSize={4} />}
        color="white"
        bg={accentColor}
        position="relative"
        overflow="hidden"
        variant="solid"
        border="1px solid"
        borderColor="orange.300"
        boxShadow="0 4px 14px 0 rgba(255, 111, 97, 0.39)"
        _hover={{
          bg: accentColor,
          transform: "translateY(-1px)",
          boxShadow: "0 6px 20px rgba(255, 111, 97, 0.45)",
          _before: {
            left: "120%", // Triggers shimmer on hover
          }
        }}
        _active={{
          transform: "scale(0.98)",
        }}
        // Using _before for the shimmer effect
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent)",
          transition: "all 0.6s",
        }}
        transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
      >
        <chakra.span position="relative" zIndex={1}>
          Sign In
        </chakra.span>

        {/* Subtle pulse effect */}
        <Box
          as={motion.div}
          position="absolute"
          inset={0}
          rounded="full"
          border="2px solid"
          borderColor={accentColor}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          } as any}
        />
      </Button>
    </Box>
  );
};

export default HeroNavButton;