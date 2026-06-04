"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";

const ContactUsFormSection = () => {
  return (
    <Box py={{ base: "40px", md: "60px" }} px={{ base: 4, md: 8 }}>
      <Box maxW="760px" mx="auto" bg="white" p={{ base: 6, md: 10 }} borderRadius="2xl" boxShadow="base">
        <Heading mb={6} textAlign="center" size="xl">
          Get in Touch
        </Heading>
        <Stack spacing={5}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter your name" />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Enter your email" />
          </FormControl>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea placeholder="Write your message" rows={6} />
          </FormControl>
          <Button colorScheme="brand" size="lg" type="submit">
            Send Message
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactUsFormSection;
