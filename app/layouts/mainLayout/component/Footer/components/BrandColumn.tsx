"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { footerData } from "./footerData";

interface BrandColumnProps {
  socialLinks: Array<{ icon: any; name: string; url: string }>;
}

export const BrandColumn: React.FC<BrandColumnProps> = ({ socialLinks }) => {
  const subtleBg = useColorModeValue("#F8FAFC", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const accentColor = "var(--color-primary)";
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
    <VStack align="flex-start" spacing={3}>
      <HStack justify="space-between" w="full" align="center">
        <Box>
          <Heading
            as="h3"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="800"
            bgGradient="linear(to-r, var(--color-primary), var(--color-secondary))"
            bgClip="text"
            lineHeight="1.2"
          >
            {footerData.companyInfo.name}
          </Heading>
          <HStack spacing={1} mt={1}>
            <Icon as={FiStar} boxSize={3} color="amber.400" />
            <Text fontSize="11px" fontWeight="700" color={headingColor}>
              4.9
            </Text>
            <Text fontSize="11px" color={mutedText}>
              • 50k+ happy local shoppers
            </Text>
          </HStack>
        </Box>

        {/* Mobile Social Icons */}
        <HStack spacing={1.5} display={{ base: "flex", lg: "none" }}>
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              isExternal
              aria-label={social.name}
            >
              <Flex
                w="30px"
                h="30px"
                align="center"
                justify="center"
                borderRadius="lg"
                bg={subtleBg}
                border="1px solid"
                borderColor={borderColor}
                color={mutedText}
                _hover={{ color: accentColor, borderColor: accentColor }}
              >
                <social.icon size={13} />
              </Flex>
            </Link>
          ))}
        </HStack>
      </HStack>

      <Text fontSize="xs" lineHeight="1.6" color={textColor} maxW="320px">
        India&apos;s trusted local marketplace. Connect with verified
        neighborhood sellers and enjoy fast doorstep delivery.
      </Text>

      {/* App Store Buttons */}
      <HStack spacing={2} pt={0.5}>
        <Button
          size="xs"
          h="34px"
          px={3}
          borderRadius="xl"
          bg={subtleBg}
          border="1px solid"
          borderColor={borderColor}
          leftIcon={<FaGooglePlay size={12} color="#2563EB" />}
          _hover={{ borderColor: accentColor, bg: cardBg }}
        >
          <Box textAlign="left">
            <Text fontSize="7px" color={mutedText} lineHeight="1">
              GET IT ON
            </Text>
            <Text fontSize="10px" fontWeight="700" color={headingColor}>
              Google Play
            </Text>
          </Box>
        </Button>

        <Button
          size="xs"
          h="34px"
          px={3}
          borderRadius="xl"
          bg={subtleBg}
          border="1px solid"
          borderColor={borderColor}
          leftIcon={<FaApple size={14} color="#1E293B" />}
          _hover={{ borderColor: accentColor, bg: cardBg }}
        >
          <Box textAlign="left">
            <Text fontSize="7px" color={mutedText} lineHeight="1">
              Download on
            </Text>
            <Text fontSize="10px" fontWeight="700" color={headingColor}>
              App Store
            </Text>
          </Box>
        </Button>
      </HStack>

      {/* Desktop Social Icons */}
      <HStack spacing={2} pt={1} display={{ base: "none", lg: "flex" }}>
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            isExternal
            aria-label={social.name}
          >
            <Flex
              w="30px"
              h="30px"
              align="center"
              justify="center"
              borderRadius="lg"
              bg={subtleBg}
              border="1px solid"
              borderColor={borderColor}
              color={mutedText}
              transition="all 0.2s"
              _hover={{
                bg: "blue.600",
                color: "white",
                transform: "translateY(-2px)",
                borderColor: "blue.600",
              }}
            >
              <social.icon size={13} />
            </Flex>
          </Link>
        ))}
      </HStack>
    </VStack>
  );
};

export default React.memo(BrandColumn);

