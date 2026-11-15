'use client';

import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ThemeModeMenu } from '../../theme/ThemeModeSwitcher';

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isRegistrationPage = pathname === '/register' || pathname === '/signUp';
  const isImmersiveAuthPage = pathname === '/login' || isRegistrationPage;

  const bgPage = useColorModeValue('gray.50', 'var(--color-bg)');
  const bgCard = useColorModeValue('white', 'var(--color-surface)');
  const borderCard = useColorModeValue('gray.200', 'var(--color-border)');

  return (
    <Box
      position="relative"
      minHeight="100vh"
      bg={bgPage}
      pt="var(--safe-area-top, env(safe-area-inset-top, 0px))"
      pb={0}
      transition="background-color 0.2s ease"
    >
      {/* Top right Theme Switcher on Auth Pages */}
      <Box
        position="fixed"
        top="max(16px, calc(16px + var(--safe-area-top, env(safe-area-inset-top, 0px))))"
        right={4}
        zIndex={100}
      >
        <ThemeModeMenu size="sm" />
      </Box>

      <Flex
        minHeight="100vh"
        direction={{ base: 'column', xl: 'row' }}
        justifyContent="center"
        alignItems="stretch"
        bg={isImmersiveAuthPage ? 'transparent' : bgPage}
        px={isImmersiveAuthPage ? 0 : { base: 0, md: 4, xl: 6 }}
        py={isImmersiveAuthPage ? 0 : { base: 0, md: 4, xl: 6 }}
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
          display={isImmersiveAuthPage ? 'none' : { base: 'none', xl: 'flex' }}
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
          bg={isImmersiveAuthPage ? 'transparent' : bgCard}
          border={isImmersiveAuthPage ? 'none' : '1px solid'}
          borderColor={borderCard}
          boxShadow={isImmersiveAuthPage ? 'none' : 'sm'}
          p={isImmersiveAuthPage ? 0 : { base: 6, md: 8 }}
          borderRadius={isImmersiveAuthPage ? 'none' : '2xl'}
          width="100%"
          maxW={isImmersiveAuthPage ? '100%' : { base: '100%', md: '620px' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minHeight={{ md: 'auto' }}
          mx="auto"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default AuthenticationLayout;
