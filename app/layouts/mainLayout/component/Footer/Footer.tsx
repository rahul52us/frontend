"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  FaAmazonPay,
  FaApple,
  FaCcMastercard,
  FaCcVisa,
  FaFacebookF,
  FaGooglePlay,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import {
  FiArrowUp,
  FiCheckCircle,
  FiMail,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { SiGooglepay, SiPhonepe } from "react-icons/si";
import ContactSection from "./components/ContactSection";
import { footerData } from "./components/footerData";
import NewsletterBanner from "./components/NewsletterBanner";

export interface FooterProps {
  hideBottomNav?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ hideBottomNav = false }) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const toast = useToast();

  // Hoisted Color Mode Tokens
  const bg = useColorModeValue("white", "gray.950");
  const subtleBg = useColorModeValue("#F8FAFC", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const accentColor = "var(--color-primary)";
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      toast({
        title: "Subscribed! 🎉",
        description: "You're now subscribed for local deals & offers.",
        status: "success",
        duration: 3500,
        isClosable: true,
        position: "top-right",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 800);
  };

  const paymentMethods = [
    { name: "UPI", icon: FaAmazonPay },
    { name: "GPay", icon: SiGooglepay },
    { name: "PhonePe", icon: SiPhonepe },
    { name: "Visa", icon: FaCcVisa },
    { name: "Mastercard", icon: FaCcMastercard },
    { name: "COD", icon: FiCheckCircle },
  ];

  const socialLinks = [
    { icon: FaFacebookF, name: "Facebook", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaLinkedinIn, name: "LinkedIn", url: "#" },
  ];

  // Uniform styling so <ContactSection /> matches the other column headings & links
  const contactSectionStyles = {
    "& h1, & h2, & h3, & h4, & > div > p:first-of-type": {
      fontSize: "xs",
      fontWeight: "800",
      color: headingColor,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "14px",
      lineHeight: "1.2",
    },
    "& a, & p, & span, & li": {
      fontSize: "xs",
      lineHeight: "1.6",
    },
    "& ul, & > div": {
      gap: "8px",
    },
  };

  return (
    <Box
      as="footer"
      bg={bg}
      color={textColor}
      borderTop="1px solid"
      borderColor={borderColor}
      position="relative"
      overflowX="hidden"
    >
      <Container
        maxW="8xl"
        px={{ base: 3, md: 8 }}
        pt={{ base: 5, md: 8 }}
        pb={{ base: hideBottomNav ? 4 : "64px", md: 6 }}
      >
  <NewsletterBanner email={email} setEmail={setEmail} isSubscribing={isSubscribing} handleSubscribe={handleSubscribe}  />

        {/* 2. Main Footer Content: Balanced 4-Column Desktop Grid + Mobile Accordion */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2.4fr 1.3fr 1.5fr 2fr",
          }}
          gap={{ base: 5, lg: 10 }}
          pb={{ base: 5, md: 7 }}
          alignItems="start"
        >
          {/* COLUMN 1: Brand Info, App Buttons & Social Icons */}
          <GridItem>
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

                {/* Mobile Social Icons (Inline on Mobile Only) */}
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

              <Text
                fontSize="xs"
                lineHeight="1.6"
                color={textColor}
                maxW="320px"
              >
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
          </GridItem>

          {/* MOBILE ONLY: Clean Collapsible Accordions */}
          <GridItem display={{ base: "block", lg: "none" }}>
            <Accordion allowMultiple borderColor={borderColor}>
              {footerData.sections.map((section) => (
                <AccordionItem key={section.title}>
                  <h2>
                    <AccordionButton py={2.5} px={1} _hover={{ bg: "transparent" }}>
                      <Box
                        flex="1"
                        textAlign="left"
                        fontSize="xs"
                        fontWeight="700"
                        color={headingColor}
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        {section.title}
                      </Box>
                      <AccordionIcon color={mutedText} />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={3} px={1} pt={0}>
                    <VStack align="flex-start" spacing={2}>
                      {section.links.map((link: any) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          fontSize="xs"
                          color={textColor}
                          _hover={{ color: accentColor }}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}

              <AccordionItem>
                <h2>
                  <AccordionButton py={2.5} px={1} _hover={{ bg: "transparent" }}>
                    <Box
                      flex="1"
                      textAlign="left"
                      fontSize="xs"
                      fontWeight="700"
                      color={headingColor}
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Contact Us
                    </Box>
                    <AccordionIcon color={mutedText} />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={3} px={1} pt={0}>
                  <Box w="full" sx={contactSectionStyles}>
                    <ContactSection contactInfo={footerData.contactInfo} />
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </GridItem>

          {/* COLUMNS 2 & 3 (Desktop): Quick Links & Services For Businesses */}
          {footerData.sections.map((section) => (
            <GridItem
              key={section.title}
              display={{ base: "none", lg: "block" }}
            >
              <VStack align="flex-start" spacing={3}>
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  color={headingColor}
                  textTransform="uppercase"
                  letterSpacing="0.06em"
                >
                  {section.title}
                </Text>
                <VStack align="flex-start" spacing={2}>
                  {section.links.map((link: any) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      fontSize="xs"
                      color={textColor}
                      _hover={{
                        color: accentColor,
                        transform: "translateX(2px)",
                      }}
                      transition="all 0.15s ease"
                    >
                      {link.name}
                    </Link>
                  ))}
                </VStack>
              </VStack>
            </GridItem>
          ))}

          {/* COLUMN 4 (Desktop): Contact Us */}
          <GridItem
            display={{ base: "none", lg: "block" }}
            sx={contactSectionStyles}
          >
            <ContactSection contactInfo={footerData.contactInfo} />
          </GridItem>
        </Grid>

        {/* 3. Compact Payment & Security Strip */}
        <Flex
          bg={subtleBg}
          borderRadius="xl"
          px={{ base: 3, md: 4 }}
          py={2.5}
          mb={4}
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={2.5}
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack
            spacing={1.5}
            overflowX="auto"
            w={{ base: "full", md: "auto" }}
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              color={headingColor}
              whiteSpace="nowrap"
              mr={1}
            >
              Payments:
            </Text>
            {paymentMethods.map((method) => (
              <Badge
                key={method.name}
                bg={cardBg}
                color={textColor}
                border="1px solid"
                borderColor={borderColor}
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="10px"
                fontWeight="600"
                display="flex"
                alignItems="center"
                gap={1}
                flexShrink={0}
                textTransform="none"
              >
                <method.icon size={11} />
                {method.name}
              </Badge>
            ))}
          </HStack>

          <HStack spacing={1.5} flexShrink={0}>
            <Icon as={FiShield} boxSize={3.5} color="green.500" />
            <Text fontSize="11px" color={mutedText}>
              <Text as="span" color="green.600" fontWeight="700">
                100% Secure
              </Text>{" "}
              · SSL Encrypted Checkout
            </Text>
          </HStack>
        </Flex>

        <Divider borderColor={borderColor} />

        {/* 4. Minimal Copyright & Legal Bottom Row */}
        <Stack
          direction={{ base: "column-reverse", md: "row" }}
          align="center"
          justify="space-between"
          pt={3.5}
          spacing={2}
          textAlign={{ base: "center", md: "left" }}
        >
          <Text fontSize="11px" color={mutedText}>
            &copy; {new Date().getFullYear()}{" "}
            <Text as="span" color={headingColor} fontWeight="700">
              {footerData.companyInfo.name}
            </Text>
            . All rights reserved. Crafted with ❤️ in India.
          </Text>

          <HStack
            spacing={{ base: 3, md: 5 }}
            flexWrap="wrap"
            justify="center"
            divider={<Box w="1px" h="10px" bg={borderColor} />}
          >
            {footerData.legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                fontSize="11px"
                color={mutedText}
                _hover={{ color: accentColor }}
              >
                {link.name}
              </Link>
            ))}
            <HStack
              as="button"
              onClick={scrollToTop}
              spacing={1}
              fontSize="11px"
              fontWeight="600"
              color={accentColor}
              _hover={{ textDecoration: "underline" }}
            >
              <Icon as={FiArrowUp} boxSize={3} />
              <Text>Top</Text>
            </HStack>
          </HStack>
        </Stack>
      </Container>

      {/* Floating Back to Top Button */}
      <Fade in={showBackToTop} unmountOnExit>
        <IconButton
          aria-label="Back to top"
          icon={<FiArrowUp size={15} />}
          position="fixed"
          bottom={{ base: hideBottomNav ? "20px" : "68px", md: "88px" }}
          right={{ base: "16px", md: "24px" }}
          zIndex={90}
          borderRadius="full"
          size="sm"
          w="36px"
          h="36px"
          bg="gray.900"
          color="white"
          boxShadow="lg"
          _hover={{ bg: "blue.600", transform: "translateY(-2px)" }}
          transition="all 0.2s"
          onClick={scrollToTop}
        />
      </Fade>
    </Box>
  );
};

export default Footer;