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
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEnvelope, FaExclamationCircle, FaInfoCircle, FaPhoneAlt, FaSave, FaUser, FaUserEdit, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa";
import stores from "../../../../store/stores";

export function ProfileSection({ user }: { user: any }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email || "",
    phone: user.phone || "",
    alternatePhone: user.alternatePhone || "",
    alternateEmail: user.alternateEmail || "",
    facebook: user.socialLinks?.facebook || "",
    instagram: user.socialLinks?.instagram || "",
    twitter: user.socialLinks?.twitter || "",
    linkedin: user.socialLinks?.linkedin || "",
    website: user.socialLinks?.website || "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    alternatePhone: "",
    alternateEmail: "",
  });

  // Validation function
  const validateForm = () => {
    const newErrors = { email: "", phone: "", alternatePhone: "", alternateEmail: "" };
    let isValid = true;

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Phone validation
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 characters.";
      isValid = false;
    }

    // Alternate Phone validation
    if (formData.alternatePhone && formData.alternatePhone.length < 10) {
      newErrors.alternatePhone = "Alternate phone number must be at least 10 characters.";
      isValid = false;
    }

    // Alternate Email validation
    if (formData.alternateEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alternateEmail)) {
      newErrors.alternateEmail = "Please enter a valid alternate email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const updateData: { phone?: string; email?: string } = {};
        if (formData.phone && formData.phone !== user.phone) {
          updateData.phone = formData.phone;
        }
        if (formData.email && formData.email !== user.email) {
          updateData.email = formData.email;
        }

        // Alternate contacts
        if (formData.alternatePhone !== (user.alternatePhone || "")) {
          (updateData as any).alternatePhone = formData.alternatePhone;
        }
        if (formData.alternateEmail !== (user.alternateEmail || "")) {
          (updateData as any).alternateEmail = formData.alternateEmail;
        }

        // Social Links
        const socialLinks: any = {};
        if (formData.facebook !== (user.socialLinks?.facebook || "")) socialLinks.facebook = formData.facebook;
        if (formData.instagram !== (user.socialLinks?.instagram || "")) socialLinks.instagram = formData.instagram;
        if (formData.twitter !== (user.socialLinks?.twitter || "")) socialLinks.twitter = formData.twitter;
        if (formData.linkedin !== (user.socialLinks?.linkedin || "")) socialLinks.linkedin = formData.linkedin;
        if (formData.website !== (user.socialLinks?.website || "")) socialLinks.website = formData.website;

        if (Object.keys(socialLinks).length > 0) {
          (updateData as any).socialLinks = socialLinks;
        }

        if (Object.keys(updateData).length === 0) {
          toast({
            title: "No changes",
            description: "No changes were made to your profile.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }

        await stores.auth.updateProfile(updateData);

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error?.message || "Failed to update profile. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            Update your contact information
          </Text>
        </Box>

        {/* Name Display (Read Only) */}
        <Card variant="elevated" p={6} borderRadius="xl">
          <FormControl>
            <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
              <Icon as={FaUser} mr={2} />
              Full Name
            </FormLabel>
            <Text fontSize="lg" fontWeight="medium" color={useColorModeValue('gray.800', 'gray.200')}>
              {user.name}
            </Text>
            <FormHelperText fontSize={'xs'} color={useColorModeValue('gray.500', 'gray.400')} mt={2}>
              <Icon as={FaInfoCircle} mr={2} />
              Name cannot be changed
            </FormHelperText>
          </FormControl>
        </Card>

        {/* Form Section */}
        <Box as="form" onSubmit={handleSubmit} w="full">
          <VStack spacing={4} align="stretch">
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
                    placeholder="9876543210"
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

            {/* Alternate Contact Section */}
            <Box pb={2} borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Text fontSize="md" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.300')}>
                Alternate Contact Information
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Alternate Email Field */}
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl isInvalid={!!errors.alternateEmail}>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaEnvelope} mr={2} />
                    Alternate Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="alternate@example.com"
                    name="alternateEmail"
                    value={formData.alternateEmail}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                  <FormErrorMessage fontSize="sm" mt={1}>
                    <Icon as={FaExclamationCircle} mr={2} />
                    {errors.alternateEmail}
                  </FormErrorMessage>
                </FormControl>
              </Card>

              {/* Alternate Phone Field */}
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl isInvalid={!!errors.alternatePhone}>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaPhoneAlt} mr={2} />
                    Alternate Phone
                  </FormLabel>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                  <FormErrorMessage fontSize="sm" mt={1}>
                    <Icon as={FaExclamationCircle} mr={2} />
                    {errors.alternatePhone}
                  </FormErrorMessage>
                </FormControl>
              </Card>
            </SimpleGrid>

            {/* Social Media Section */}
            <Box pb={2} borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <Text fontSize="md" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.300')}>
                Social Media Links
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaFacebook} mr={2} /> Facebook
                  </FormLabel>
                  <Input
                    placeholder="https://facebook.com/username"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                </FormControl>
              </Card>
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaInstagram} mr={2} /> Instagram
                  </FormLabel>
                  <Input
                    placeholder="https://instagram.com/username"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                </FormControl>
              </Card>
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaTwitter} mr={2} /> Twitter (X)
                  </FormLabel>
                  <Input
                    placeholder="https://twitter.com/username"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                </FormControl>
              </Card>
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaLinkedin} mr={2} /> LinkedIn
                  </FormLabel>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                </FormControl>
              </Card>
              <Card variant="elevated" p={6} borderRadius="xl">
                <FormControl>
                  <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')}>
                    <Icon as={FaGlobe} mr={2} /> Website
                  </FormLabel>
                  <Input
                    placeholder="https://yourwebsite.com"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    focusBorderColor="blue.400"
                    variant="flushed"
                  />
                </FormControl>
              </Card>
            </SimpleGrid>

            {/* Submit Button */}
            <Flex justify={'end'} pt={2}>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isLoading}
                leftIcon={<FaSave />}
                w={{ base: 'full', md: 'auto' }}
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