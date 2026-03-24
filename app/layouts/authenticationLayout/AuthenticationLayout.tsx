'use client';

import { Box, Flex, Image } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isSignUpPage = pathname === '/signUp';

  return (
    <Flex
      minHeight="100vh"
      direction={{ base: 'column', xl: 'row' }}
      justifyContent="center"
      alignItems="stretch"
      bg="gray.50"
      px={{ base: 0, md: 4, xl: 6 }}
      py={{ base: 0, md: 4, xl: 6 }}
      gap={{ base: 0, xl: 8, '2xl': 10 }}
    >
      {/* Left Section - Background Image */}
      <Box
        position="relative"
        bgImage="/images/auth/bgImage.png"
        minH="calc(100vh - 48px)"
        flex="1"
        maxW="820px"
        bgSize="cover"
        bgPosition="center"
        rounded="xl"
        display={isSignUpPage ? { base: 'none', '2xl': 'flex' } : { base: 'none', xl: 'flex' }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
        overflow="hidden"
      >
        <Image
          src="/images/whiteLogo.png"
          alt="top psychologist in noida"
          position="absolute"
          top={4}
          left={8}
          width={{ base: '60px', md: '160px' }}
        />
        <Image
          src="/images/auth/gridImages.png"
          alt="Top Clinical Psychologist Doctors in Noida"
          width={{ base: '50%', md: '70%' }}
          maxW="400px"
        />
      </Box>

      {/* Right Section - Form Content */}
      <Box
        bg={isSignUpPage ? 'transparent' : 'white'}
        p={isSignUpPage ? 0 : { base: 6, md: 8 }}
        borderRadius={isSignUpPage ? 'none' : 'md'}
        width="100%"
        maxW={isSignUpPage ? { base: '100%', md: '860px', xl: '780px' } : { base: '100%', md: '620px' }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight={{ md: 'auto' }}
        mx="auto"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AuthenticationLayout;
