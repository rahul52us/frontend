"use client";

import {
  Box,
  Circle,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { memo } from "react";
import {
  FiFacebook,
  FiGlobe,
  FiInstagram,
  FiMail,
  FiPhone,
  FiTwitter,
} from "react-icons/fi";

const ContactSection = memo(({ shopData }: any) => {
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
              <Circle size="34px" bg="var(--color-surface-hover)" color="var(--color-primary)">
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
              <Circle size="34px" bg="var(--color-surface-hover)" color="var(--color-primary)">
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
              <Circle size="34px" bg="var(--color-surface-hover)" color="var(--color-primary)">
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
          <HStack spacing={3} pt={2}>
            {socials.map((s) => (
              <Link
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.2s"
              >
                <Circle size="36px" bg={rowHoverBg} color={s.color}>
                  <Icon as={s.icon} boxSize={4} />
                </Circle>
              </Link>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
