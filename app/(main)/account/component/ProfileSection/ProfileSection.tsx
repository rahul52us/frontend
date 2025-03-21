"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEnvelope, FaExclamationCircle, FaInfoCircle, FaPencilAlt, FaPhoneAlt, FaSave, FaUser, FaUserEdit } from "react-icons/fa";

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
    <VStack spacing={4} align="stretch">
      {/* Header Section */}
      <Box pb={4} borderBottomWidth="2px" borderColor={useColorModeValue('purple.100', 'blue.800')}>
        <Heading as="h2" size="md" fontWeight="extrabold" color={useColorModeValue('purple.600', 'blue.300')}>
          <Icon as={FaUserEdit} mr={3} />
          Profile Details
        </Heading>
        <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} mt={3}>
          Manage your personal information and communication preferences
        </Text>
      </Box>
  
      {/* Form Section */}
      <Box as="form" onSubmit={handleSubmit} w="full">
        <VStack spacing={4} align="stretch">
          {/* Name Field */}
          <Card variant="elevated" p={6} borderRadius="xl">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                <Icon as={FaUser} mr={2} />
                Full Name
              </FormLabel>
              <Input
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                focusBorderColor="blue.400"
                variant="flushed"
                // size="lg"
              />
              <FormErrorMessage fontSize="sm" mt={1}>
                <Icon as={FaExclamationCircle} mr={2} />
                {errors.name}
              </FormErrorMessage>
            </FormControl>
          </Card>
  
          {/* Contact Section */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Email Field */}
            <Card variant="elevated" p={6} borderRadius="xl">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                  <Icon as={FaEnvelope} mr={2} />
                  Email Address
                </FormLabel>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  focusBorderColor="blue.400"
                  variant="flushed"
                />
                <FormHelperText fontSize={'xs'} color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
                  <Icon as={FaInfoCircle} mr={2} />
                  Used for order confirmations and account security
                </FormHelperText>
                <FormErrorMessage fontSize="sm" mt={1}>
                  <Icon as={FaExclamationCircle} mr={2} />
                  {errors.email}
                </FormErrorMessage>
              </FormControl>
            </Card>
  
            {/* Phone Field */}
            <Card variant="elevated" p={6} borderRadius="xl">
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                  <Icon as={FaPhoneAlt} mr={2} />
                  Phone Number
                </FormLabel>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  focusBorderColor="blue.400"
                  variant="flushed"
                />
                <FormHelperText fontSize={'xs'} color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
                  <Icon as={FaInfoCircle} mr={2} />
                  Used for delivery updates and OTP verification
                </FormHelperText>
                <FormErrorMessage fontSize="sm" mt={1}>
                  <Icon as={FaExclamationCircle} mr={2} />
                  {errors.phone}
                </FormErrorMessage>
              </FormControl>
            </Card>
          </SimpleGrid>
  
          {/* Bio Field */}
          <Card variant="elevated" p={6} borderRadius="xl">
            <FormControl isInvalid={!!errors.bio}>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                <Icon as={FaPencilAlt} mr={2} />
                Personal Bio
              </FormLabel>
              <Textarea
                placeholder="Share something interesting about yourself..."
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                resize="vertical"
                focusBorderColor="blue.400"
                minH="100px"
              />
              <FormHelperText fontSize={'xs'} color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
                <Icon as={FaInfoCircle} mr={2} />
                This will be visible on your public profile
              </FormHelperText>
              <FormErrorMessage fontSize="sm" mt={1}>
                <Icon as={FaExclamationCircle} mr={2} />
                {errors.bio}
              </FormErrorMessage>
            </FormControl>
          </Card>
  
          {/* Submit Button */}
          <Flex justify={'end'} pt={2}>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              leftIcon={<FaSave />}
              // size="lg"
              w={{ base: 'full', md: 'auto' }}
              // px={10}
              fontWeight="bold"
              boxShadow="md"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              {isLoading ? "Saving Changes..." : "Update Profile"}
            </Button>
          </Flex>
        </VStack>
      </Box>
    </VStack>
  </Box>
  );
}