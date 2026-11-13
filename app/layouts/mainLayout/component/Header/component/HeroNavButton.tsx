"use client";

import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";

interface HeroNavButtonProps {
  onClick?: () => void;
}

const HeroNavButton: React.FC<HeroNavButtonProps> = ({ onClick }) => {
  const router = useRouter();

  const handleLogin = () => {
    if (onClick) onClick();
    router.push("/login");
  };

  return (
    <Button
      size="sm"
      w={{ base: "full", md: "auto" }}
      px={4}
      h="34px"
      borderRadius="full"
      bgGradient="linear(to-r, blue.600, purple.600)"
      color="white"
      fontWeight="600"
      fontSize="xs"
      letterSpacing="0.2px"
      leftIcon={<Icon as={FiUser} boxSize={3.5} />}
      boxShadow="sm"
      _hover={{
        bgGradient: "linear(to-r, blue.700, purple.700)",
        boxShadow: "md",
        transform: "translateY(-1px)",
      }}
      _active={{
        transform: "translateY(0)",
        boxShadow: "xs",
      }}
      transition="all 0.15s ease"
      onClick={handleLogin}
    >
      Sign In
    </Button>
  );
};

export default HeroNavButton;