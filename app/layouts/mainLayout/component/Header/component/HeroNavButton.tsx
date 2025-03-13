"use client";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import CustomButton from "../../../../../component/common/CustomButton/CustomButton";

const HeroNavButton = () => {
  const router = useRouter();

  return (
    <Box display="flex" gap={2}>
      <CustomButton
        width="auto"
        size="md"
        variant="outline"
        borderColor="transparent" // Make border transparent for a smooth gradient look
        color="transparent" // Make text transparent to show the gradient
        bgGradient="linear(to-r, teal.500, blue.500)" // Smooth gradient
        backgroundClip="text" // Make background clip the text color
        onClick={() => router.push('/login')}
      >
        Sign In
      </CustomButton>
    </Box>
  );
};

export default HeroNavButton;
