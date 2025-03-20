"use client";

import { useState } from "react";
import { FaSave } from "react-icons/fa";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";

export function ProfileSection({ user }: { user: any }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: "I love shopping for the latest tech gadgets and fashion items!",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  // Validation function
  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", bio: "" };
    let isValid = true;

    // Name validation
    if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone validation
    if (formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 characters.";
      isValid = false;
    }

    // Bio validation (optional)
    if (formData.bio.length > 160) {
      newErrors.bio = "Bio must be less than 160 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 1000);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <VStack spacing={6} align="start">
        <Box>
          <Heading as="h2" size="md" fontWeight="bold">
            Profile Details
          </Heading>
          <Text color="gray.500" mt={2}>
            Update your personal information and how we can reach you
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit} w="full">
          <VStack spacing={6} align="start">
            {/* Name Field */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Your name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            {/* Email Field */}
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormHelperText>
                This is the email we&apos;ll use for order confirmations.
              </FormHelperText>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            {/* Phone Field */}
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                placeholder="Your phone number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <FormHelperText>
                Used for delivery updates and account verification.
              </FormHelperText>
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            {/* Bio Field */}
            <FormControl isInvalid={!!errors.bio}>
              <FormLabel>Bio</FormLabel>
              <Textarea
                placeholder="Tell us a little bit about yourself"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                resize="none"
              />
              <FormHelperText>
                This will be displayed on your public profile.
              </FormHelperText>
              <FormErrorMessage>{errors.bio}</FormErrorMessage>
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              leftIcon={<FaSave />}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}