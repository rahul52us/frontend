"use client";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Circle,
  Tooltip,
  Badge,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiFacebook, FiGlobe, FiPhoneCall, FiMail } from 'react-icons/fi';

const MotionBox = motion(Box);

const ContactSection = ({ shopData }: any) => {
  const socials = [
    { name: "Instagram", icon: FiInstagram, link: shopData.contactInfo?.socialMedia?.instagram || shopData.socialLinks?.instagram, color: "#E1306C" },
    { name: "Twitter", icon: FiTwitter, link: shopData.contactInfo?.socialMedia?.twitter || shopData.socialLinks?.twitter, color: "#1DA1F2" },
    { name: "Facebook", icon: FiFacebook, link: shopData.contactInfo?.socialMedia?.facebook || shopData.socialLinks?.facebook, color: "#4267B2" },
    { name: "Website", icon: FiGlobe, link: shopData.contactInfo?.website || shopData.socialLinks?.website, color: "#4A5568" },
  ].filter(s => s.link);

  return (
    <Box position="relative" py={12} bg="white" id="contact">
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 12, lg: 20 }}
          align="start"
        >
          {/* Left: Contact Info */}
          <VStack align="flex-start" spacing={10} flex={1}>
            <VStack align="flex-start" spacing={2}>
              <Badge
                variant="outline"
                color="blue.600"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="2xs"
                letterSpacing="0.1em"
                fontWeight="800"
                borderColor="blue.100"
              >
                CONTACT US
              </Badge>
              <Heading size="xl" fontWeight="800" color="gray.900" letterSpacing="-0.02em">
                Get in Touch
              </Heading>
              <Text color="gray.500" fontWeight="500">
                Connect with us for inquiries or appointments.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={8} w="full">
              <Link href={`tel:${shopData.contactInfo?.phone}`} _hover={{ textDecoration: "none" }}>
                <HStack spacing={4} align="center">
                  <Circle size="48px" bg="gray.900" color="white">
                    <Icon as={FiPhoneCall} boxSize={5} />
                  </Circle>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="xs" fontWeight="800" color="gray.400" letterSpacing="0.05em">CALL US</Text>
                    <Text fontWeight="800" color="gray.900">{shopData.contactInfo?.phone}</Text>
                  </VStack>
                </HStack>
              </Link>

              <Link href={`mailto:${shopData.contactInfo?.email}`} _hover={{ textDecoration: "none" }}>
                <HStack spacing={4} align="center">
                  <Circle size="48px" bg="blue.600" color="white">
                    <Icon as={FiMail} boxSize={5} />
                  </Circle>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="xs" fontWeight="800" color="gray.400" letterSpacing="0.05em">EMAIL</Text>
                    <Text fontWeight="800" color="gray.900" noOfLines={1}>{shopData.contactInfo?.email}</Text>
                  </VStack>
                </HStack>
              </Link>
            </SimpleGrid>
          </VStack>

          {/* Right: Social Orbit */}
          <VStack align={{ base: "flex-start", lg: "flex-end" }} spacing={8} flex={1} w="full">
            <VStack align={{ base: "flex-start", lg: "flex-end" }} spacing={2}>
              <Text fontSize="xs" fontWeight="800" color="gray.400" letterSpacing="0.1em">FOLLOW OUR JOURNEY</Text>
              <HStack spacing={4}>
                {socials.map((social, index) => (
                  <Tooltip key={index} label={social.name.toUpperCase()} hasArrow>
                    <Circle
                      as="a"
                      href={social.link}
                      target="_blank"
                      size="56px"
                      bg="gray.50"
                      color="gray.400"
                      border="1px solid"
                      borderColor="gray.100"
                      transition="all 0.2s"
                      _hover={{
                        color: "white",
                        bg: "gray.900",
                        transform: "translateY(-2px)",
                        borderColor: "gray.900"
                      }}
                    >
                      <Icon as={social.icon} boxSize={5} />
                    </Circle>
                  </Tooltip>
                ))}
              </HStack>
            </VStack>

            <Box
              p={6}
              borderRadius="24px"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
              w="full"
              maxW={{ lg: "sm" }}
            >
              <HStack spacing={4}>
                <Circle size="40px" bg="blue.50" color="blue.600">
                  <Icon as={FiGlobe} boxSize={5} />
                </Circle>
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="2xs" fontWeight="800" color="gray.400">OFFICIAL WEBSITE</Text>
                  <Link href={shopData.contactInfo?.website || "#"} isExternal fontWeight="700" color="gray.900" fontSize="sm">
                    Visit Site
                  </Link>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactSection;
