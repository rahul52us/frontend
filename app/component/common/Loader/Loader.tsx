'use client';
import React, { useEffect, useState } from "react";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

export interface LoaderProps {
  fullPage?: boolean;
  message?: string;
  spinnerSize?: "sm" | "md" | "lg" | "xl";
  bg?: string;
  textColor?: string;
  delay?: number;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Loader: React.FC<LoaderProps> = ({
  fullPage = false,
  message,
  spinnerSize = "xl",
  bg = "gray.100",
  textColor = "gray.700",
  delay = 0,
}) => {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!visible) {
    return null;
  }

  const content = (
    <Flex
      direction="column"
      align="center"
      justify="center"
      animation={`${fadeIn} 0.5s ease-in-out`}
    >
      <Spinner size={spinnerSize} aria-label="Loading" />
      {message && (
        <Box mt={3}>
          <Text fontSize="lg" color={textColor}>
            {message}
          </Text>
        </Box>
      )}
    </Flex>
  );

  return fullPage ? (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg={bg}
      animation={`${fadeIn} 0.5s ease-in-out`}
    >
      {content}
    </Flex>
  ) : (
    content
  );
};

export default Loader;
