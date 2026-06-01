import {
  Box,
  Container,
  Divider,
  Grid,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  Heading,
  HStack,
  Badge,
} from "@chakra-ui/react";
import React from "react";
import { FaHeart } from "react-icons/fa";
import ContactSection from "./components/ContactSection";
import FooterSection from "./components/FooterSection";
import { footerData } from "./components/footerData";
import Conditions from "./components/Conditions";

export const Footer: React.FC = () => {
  // Lovable, friendly color scheme: light blue background, dark text
  const bgColor = useColorModeValue("blue.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const headingColor = useColorModeValue("blue.700", "blue.300");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const dividerColor = useColorModeValue("blue.200", "gray.700");
  const supportTextColor = useColorModeValue("gray.700", "gray.300");
  const linkHoverColor = useColorModeValue("blue.600", "blue.300");
  const socialBg = useColorModeValue("white", "gray.700");
  const socialHoverBg = useColorModeValue("blue.100", "gray.600");
  const copyrightColor = useColorModeValue("gray.600", "gray.400");
  const badgeBg = useColorModeValue("blue.100", "blue.900");
  const badgeColor = useColorModeValue("blue.700", "blue.200");

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTopRadius={{ base: "24px", md: "40px" }}
      py={{ base: "8", md: "10" }}
      borderTop="1px solid"
      borderColor={dividerColor}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative wave / heart pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="4px"
        bgGradient="linear(90deg, #60a5fa, #93c5fd, #bfdbfe)"
      />
      <Box
        position="absolute"
        bottom="20px"
        right="20px"
        opacity="0.1"
        pointerEvents="none"
      >
        <Icon as={FaHeart} boxSize="100px" color="blue.400" />
      </Box>
      <Box
        position="absolute"
        top="20px"
        left="20px"
        opacity="0.08"
        pointerEvents="none"
      >
        <Icon as={FaHeart} boxSize="80px" color="blue.500" />
      </Box>

      <Container as={Stack} maxW={{ lg: "90%" }} px={{ base: 4, md: 8 }}>
        {/* Support Banner - Friendly & warm */}
        <Box
          mb={8}
          p={{ base: 4, md: 6 }}
          bg="white"
          borderRadius="2xl"
          textAlign="center"
          boxShadow="sm"
          border="1px solid"
          borderColor="blue.100"
        >
          <HStack spacing={2} justify="center" mb={2}>
            <Badge bg={badgeBg} color={badgeColor} px={3} py={1} borderRadius="full">
              💙 We're here for you
            </Badge>
          </HStack>
          <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" color={supportTextColor}>
            Need assistance? For immediate support, please contact us at{" "}
            <strong style={{ color: accentColor }}>Customer Support: 1800-123-4567</strong> or visit our{" "}
            <strong style={{ color: accentColor }}>Help Center</strong> for FAQs and guidance. If you have any issues with your orders or need assistance with our platform, our team is here to help.
            Alternatively, you can reach out via email at{" "}
            <strong style={{ color: accentColor }}>support@businesssahayata.com</strong>.
          </Text>
        </Box>

        {/* Footer Sections Grid */}
        <SimpleGrid
          templateColumns={{
            base: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          }}
          spacing={{ base: 6, md: 8 }}
        >
          {footerData.sections.map((section) => (
            <FooterSection key={section.title} section={section} />
          ))}

          <Box>
            <Conditions />
          </Box>

          <Box>
            <ContactSection contactInfo={footerData.contactInfo} />
            {/* Social Links - Clean, friendly */}
            <Stack
              direction="row"
              spacing={3}
              mt={4}
              justify={{ base: "center", md: "flex-start" }}
            >
              {footerData.companyInfo.socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  isExternal
                  _hover={{ textDecoration: "none" }}
                >
                  <Box
                    boxSize={9}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    rounded="full"
                    bg={socialBg}
                    color={accentColor}
                    transition="all 0.2s"
                    boxShadow="sm"
                    _hover={{
                      bg: socialHoverBg,
                      transform: "translateY(-3px)",
                      color: linkHoverColor,
                      boxShadow: "md",
                    }}
                  >
                    <Icon as={social.icon} boxSize="55%" />
                  </Box>
                </Link>
              ))}
            </Stack>
            {/* Made with love note */}
            <Text fontSize="xs" color={copyrightColor} mt={3} textAlign={{ base: "center", md: "left" }}>
              Made with <Icon as={FaHeart} color="red.400" boxSize={2.5} mx={1} /> for our community
            </Text>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Bottom Bar */}
      <Box pt={8} mt={4}>
        <Divider borderColor={dividerColor} />
        <Grid
          pt={6}
          gap={6}
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr 1fr",
          }}
          textAlign={{ base: "center", lg: "left" }}
          alignItems="center"
          justifyContent="center"
        >
          <Box display={{ base: "none", sm: "block" }}></Box>
          <Text fontSize={{ base: "xs", sm: "sm" }} textAlign="center" color={copyrightColor}>
            © {new Date().getFullYear()}{" "}
            <Text as="span" color={accentColor} fontWeight="600">
              {footerData.companyInfo.name}
            </Text>{" "}
            . All rights reserved.
          </Text>

          <Stack
            direction="row"
            spacing={4}
            justify={{ base: "center", lg: "flex-end" }}
            align="center"
            wrap="wrap"
          >
            {footerData.legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  href={link.href}
                  fontSize={{ base: "xs", sm: "sm" }}
                  color={copyrightColor}
                  _hover={{ color: linkHoverColor }}
                >
                  {link.name}
                </Link>
                {index < footerData.legalLinks.length - 1 && (
                  <Text fontSize="xs" color={dividerColor}>/</Text>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Grid>
      </Box>
    </Box>
  );
};