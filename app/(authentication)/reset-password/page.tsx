'use client'

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate password reset
    toast({
      title: "Password Reset Successful",
      description: "You can now log in with your new password.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setFormData({ newPassword: '', confirmPassword: '' });
  };

  return (
    <>
      <Heading mb={4} size="lg" color="teal.600">
        Reset Password
      </Heading>
      <Text mb={8} color="gray.500">
        Enter your new password below.
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="newPassword" mb={4}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleInputChange}
            focusBorderColor="teal.500"
            required
          />
        </FormControl>
        <FormControl id="confirmPassword" mb={6}>
          <FormLabel>Confirm New Password</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            focusBorderColor="teal.500"
            required
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          w="full"
          isDisabled={!formData.newPassword || !formData.confirmPassword}
        >
          Reset Password
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;
