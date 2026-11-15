"use client";

import {
  FormControl,
  FormLabel,
  Input,
  Image,
  Heading,
  Text,
  useToast,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";
import CustomButton from "../../component/common/CustomButton/CustomButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const titleColor = useColorModeValue("var(--color-primary)", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const linkColor = useColorModeValue("var(--color-primary)", "var(--color-primary-text)");
  const inputBg = useColorModeValue("white", "var(--color-input-bg)");
  const inputBorder = useColorModeValue("gray.300", "var(--color-border-strong)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate sending reset password link
    toast({
      title: "Reset Link Sent",
      description: `A reset link has been sent to ${email}. Please check your email.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setEmail("");
  };

  return (
    <Box>
      <Image
        src="/images/logo.png"
        alt="Logo"
        mx="auto"
        mb={6}
        objectFit="cover"
      />
      <Heading mb={4} size="lg" color={titleColor} textAlign="center">
        Forgot Password
      </Heading>
      <Text mb={6} color={mutedText} textAlign="center">
        Enter your email address to receive a password reset link.
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" mb={6}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg={inputBg}
            borderColor={inputBorder}
            focusBorderColor="var(--color-primary)"
            required
          />
        </FormControl>
        <CustomButton size="md" width="100%" mt={2} isDisabled={!email}>
          Send Reset Link
        </CustomButton>
      </form>
      <Text mt={6} textAlign="center" color={mutedText}>
        Remembered your password?{" "}
        <Link
          href="/login"
          style={{ color: linkColor, textDecoration: "underline" }}
        >
          Back to Login
        </Link>
      </Text>
    </Box>
  );
};

export default ForgotPassword;
