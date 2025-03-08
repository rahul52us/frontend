'use client';

import { Box, Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  // const pathname = usePathname();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // if (pathname === '/register') {
  //   return <>{children}</>;
  // }

  return (
    <Flex
      minHeight="100vh"
      direction={{ base: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      p={5}
      gap={{ md: 8 ,xl:10}}
    >
      {/* Left Section - Background Image */}
      {!isMobile && (
        <Box
          position="relative"
          bgImage="/images/auth/bgImage.png"
          height={{ md: '90vh',xl:"94vh" }}
          width={{ md: '40%', lg: '45%' }}
          bgSize="cover"
          bgPosition="center"
          rounded="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
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
            maxW="450px"
          />
        </Box>
      )}

      {/* Right Section - Form Content */}
      <Box
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="md"
        width={{ base: '100%', md: '40%', lg: '45%' }}
        maxW="550px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        // boxShadow={{ base: 'none', md: 'lg' }}
        minHeight={{ md: 'auto' }}
        ml={4}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default AuthenticationLayout;