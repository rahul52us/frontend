"use client";

import {
  Box,
  Circle,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  FiFacebook,
  FiGlobe,
  FiInstagram,
  FiMail,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";

const ContactSection = ({ shopData }: any) => {
  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.100");

  const phone = shopData?.contactInfo?.phone;
  const email = shopData?.contactInfo?.email;
  const website =
    shopData?.contactInfo?.website || shopData?.socialLinks?.website;

  const socials = [
    {
      name: "Instagram",
      icon: FiInstagram,
      link:
        shopData?.contactInfo?.socialMedia?.instagram ||
        shopData?.socialLinks?.instagram,
      color: "#E1306C",
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      link:
        shopData?.contactInfo?.socialMedia?.facebook ||
        shopData?.socialLinks?.facebook,
      color: "#1877F2",
    },
    {
      name: "Twitter",
      icon: FiTwitter,
      link:
        shopData?.contactInfo?.socialMedia?.twitter ||
        shopData?.socialLinks?.twitter,
      color: "#1DA1F2",
    },
  ].filter((s) => s.link);

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      p={{ base: 5, md: 6 }}
      boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor={borderColor}
      w="full"
    >
      <VStack align="stretch" spacing={3}>
        <Heading
          as="h3"
          fontSize="md"
          fontWeight="800"
          color={textPrimary}
          letterSpacing="-0.01em"
          mb={1}
        >
          Contact information
        </Heading>

        {phone && (
          <Link
            href={`tel:${phone}`}
            borderRadius="xl"
            px={3}
            py={2.5}
            transition="all 0.2s"
            _hover={{ textDecoration: "none", bg: rowHoverBg }}
          >
            <HStack spacing={3}>
              <Circle size="34px" bg="blue.50" color="blue.600">
                <Icon as={FiPhone} boxSize={4} />
              </Circle>
              <Box minW={0} flex={1}>
                <Text fontSize="xs" color={textMuted} fontWeight="bold">
                  PHONE
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textPrimary}
                  noOfLines={1}
                >
                  {phone}
                </Text>
              </Box>
            </HStack>
          </Link>
        )}

        {email && (
          <Link
            href={`mailto:${email}`}
            borderRadius="xl"
            px={3}
            py={2.5}
            transition="all 0.2s"
            _hover={{ textDecoration: "none", bg: rowHoverBg }}
          >
            <HStack spacing={3}>
              <Circle size="34px" bg="purple.50" color="purple.600">
                <Icon as={FiMail} boxSize={4} />
              </Circle>
              <Box minW={0} flex={1}>
                <Text fontSize="xs" color={textMuted} fontWeight="bold">
                  EMAIL
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textPrimary}
                  noOfLines={1}
                >
                  {email}
                </Text>
              </Box>
            </HStack>
          </Link>
        )}

        {website && (
          <Link
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            borderRadius="xl"
            px={3}
            py={2.5}
            transition="all 0.2s"
            _hover={{ textDecoration: "none", bg: rowHoverBg }}
          >
            <HStack spacing={3}>
              <Circle size="34px" bg="teal.50" color="teal.600">
                <Icon as={FiGlobe} boxSize={4} />
              </Circle>
              <Box minW={0} flex={1}>
                <Text fontSize="xs" color={textMuted} fontWeight="bold">
                  WEBSITE
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={textPrimary}
                  noOfLines={1}
                >
                  {website.replace(/^https?:\/\//, "")}
                </Text>
              </Box>
            </HStack>
          </Link>
        )}

        {socials.length > 0 && (
          <>
            <Divider my={1} borderColor={borderColor} />
            <Box px={3} pt={1}>
              <Text fontSize="xs" fontWeight="bold" color={textMuted} mb={2}>
                SOCIAL MEDIA
              </Text>
              <HStack spacing={3}>
                {socials.map((social) => (
                  <Tooltip
                    key={social.name}
                    label={social.name}
                    placement="top"
                  >
                    <Circle
                      as="a"
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="36px"
                      bg="gray.100"
                      color={social.color}
                      _hover={{
                        transform: "scale(1.1)",
                        boxShadow: "md",
                      }}
                      transition="all 0.2s"
                    >
                      <Icon as={social.icon} boxSize={4} />
                    </Circle>
                  </Tooltip>
                ))}
              </HStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ContactSection;
