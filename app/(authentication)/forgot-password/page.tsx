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
} from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";
import CustomButton from "../../component/common/CustomButton/CustomButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

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
      <Heading mb={4} size="lg" color="teal.600" textAlign="center">
        Forgot Password
      </Heading>
      <Text mb={6} color="gray.500" textAlign="center">
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
            focusBorderColor="teal.500"
            required
          />
        </FormControl>
        <CustomButton size="md" width="100%" mt={2} isDisabled={!email}>
          Send Reset Link
        </CustomButton>
      </form>
      <Text mt={6} textAlign="center">
        Remembered your password?{" "}
        <Link
          href="/login"
          style={{ color: "teal", textDecoration: "underline" }}
        >
          Back to Login
        </Link>
      </Text>
    </Box>
  );
};

export default ForgotPassword;
