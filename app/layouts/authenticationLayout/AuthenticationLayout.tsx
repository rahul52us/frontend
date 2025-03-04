'use client';

import { Box, Grid, useBreakpointValue, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Grid
      minHeight="100vh"
      maxH={'100vh'}
      templateColumns={'1fr 1fr'}
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      gap={{ md: 8, xl: 10 }}
      >
      {/* Left Section - Background Image */}
      {!isMobile && (
        <Box
          position="relative"
          bgImage="/images/signupBg.jpg"
          height={{ md: '90vh', xl: "100vh" }}
          width={{ md: '40%', lg: '100%' }}
          bgSize="cover"
          bgPosition="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
        >
          {/* Semi-transparent overlay */}
          <Box
            bg="blackAlpha.500"
            p={8} // Increased padding to make the box bigger
            py={12}
            borderRadius="xl" // Rounded corners for a modern look
            textAlign="center"
            backdropFilter="blur(12px)"
            // maxW="600px" // Set a max width for the box
            width="90%" // Make the box wider
          >
            <VStack spacing={6} alignItems="start">
              {/* Larger heading */}
              <Text fontSize="4xl" fontWeight="bold" color="white" lineHeight="1.2">
                Welcome to Our Platform
              </Text>

              {/* Structured text */}
              <VStack spacing={4} alignItems="start">
                <Text fontSize="lg" color="white" textAlign={'start'}>
                  Join us and explore a world of opportunities. Sign up now to get started!
                </Text>
                <Text fontSize="md" color="white" fontStyle="italic">
                  "The best way to predict the future is to create it."
                </Text>
                {/* <Text fontSize="md" color="white">
                  Already have an account?{' '}
                  <Text as="span" fontWeight="bold" color="blue.200">
                    Log in here.
                  </Text>
                </Text> */}
              </VStack>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Right Section - Form Content */}
      <Box
        p={{ base: 6, md: 8 }}
        borderRadius="md"
        width={{ base: '100%', md: '40%', lg: '90%' }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight={{ md: 'auto' }}
        ml={4}
      >
        {children}
      </Box>
    </Grid>
  );
};

export default AuthenticationLayout;