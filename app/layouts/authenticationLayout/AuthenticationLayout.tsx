'use client';

import { Box, Flex, useBreakpointValue, useColorModeValue, VStack, Text, Icon } from '@chakra-ui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine } from 'react-icons/fa'; // Growth-focused icon for business

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('white', 'gray.200');



  return (
    <MotionFlex
      h="100vh"
      direction={{ base: 'column', md: 'row' }}
      bg={bgColor}
      overflow="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section - Business-Type Design with Animated Background */}
      {!isMobile && (
        <MotionBox
          flex={{ md: '0 0 50%', lg: '0 0 55%' }}
          h="100vh"
          position="relative"
          bg="gray.800" // Neutral, sleek base
          overflow="hidden"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={{ md: 8, lg: 10 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Background Image with Enhanced Motion */}
          <MotionBox
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgImage="url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" // Business team collaboration
            bgSize="cover"
            bgPosition="center"
            opacity={0.7}
            // variants={bgImageVariants}
            initial="initial"
            animate="animate"
            zIndex={0}
          >
            {/* Neutral Overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-b, rgba(26, 32, 44, 0.5), rgba(26, 32, 44, 0.9))"
              zIndex={1}
            />
          </MotionBox>

          {/* Subtle Floating Accent Shapes */}
          <MotionBox
            position="absolute"
            top="10%"
            left="15%"
            w="50px"
            h="50px"
            bg="white"
            opacity={0.2}
            borderRadius="full"
            initial={{ y: -10 }}
            animate={{ y: 10 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            zIndex={1}
          />
          <MotionBox
            position="absolute"
            bottom="15%"
            right="20%"
            w="30px"
            h="30px"
            bg="white"
            opacity={0.15}
            clipPath="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" // Diamond shape
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            zIndex={1}
          />

          {/* Content */}
          <VStack spacing={6} zIndex={2} textAlign="center" color={textColor} maxW="80%">
            {/* Logo with Icon */}
            <MotionBox
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Flex align="center" justify="center" mb={2}>
                <Icon
                  as={FaChartLine}
                  w={10}
                  h={10}
                  color={textColor}
                  mr={4}
                  filter="drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))"
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.1)' }}
                />
                <Text
                  fontSize={{ md: '2xl', lg: '3xl' }}
                  fontWeight="bold"
                  filter="drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))"
                  transition="all 0.4s ease"
                  _hover={{
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0 0 18px rgba(255, 255, 255, 0.7))',
                  }}
                >
                  BusinessSahayata
                </Text>
              </Flex>
            </MotionBox>

            {/* Headline */}
            <MotionBox
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Text
                fontSize={{ md: '3xl', lg: '4xl' }}
                fontWeight="extrabold"
                lineHeight="tight"
                textShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
              >
                Elevate Your Business
              </Text>
              <Text
                fontSize={{ md: 'md', lg: 'lg' }}
                fontWeight="medium"
                opacity={0.9}
                mt={3}
                maxW="90%"
                lineHeight="relaxed"
              >
                Partner with us for tailored growth and expert support.
              </Text>
            </MotionBox>

            {/* CTA */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Flex
                align="center"
                justify="center"
                bg="white"
                color="gray.800"
                px={5}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                boxShadow="0 4px 15px rgba(255, 255, 255, 0.3)"
                transition="all 0.3s"
                _hover={{
                  bg: 'gray.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(255, 255, 255, 0.5)',
                }}
                cursor="pointer"
              >
                Start Growing
                <Icon as={FaChartLine} ml={2} w={4} h={4} />
              </Flex>
            </MotionBox>
          </VStack>

          {/* Bottom Accent Line */}
          <MotionBox
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="8vh"
            bgGradient="linear(to-t, gray.900, transparent)"
            opacity={0.6}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            zIndex={1}
          />
        </MotionBox>
      )}

      {/* Right Section - Form Content */}
      <MotionBox
        flex={1}
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 0, md: 6 }}
        px={{ base: 2, md: 0 }}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box
          p={{ base: 4, md: 6, lg: 2 }}
          width={{ base: '100%', md: '90%', lg: '90%' }}
          maxH="100vh"
          overflowY="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          transition="all 0.3s"
        >
          {children}
        </Box>
      </MotionBox>
    </MotionFlex>
  );
};

export default AuthenticationLayout;