import {
  Box,
  Container,
  Divider,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  VStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Badge,
  useToast,
  IconButton,
  Fade,
  ScaleFade,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiArrowUp,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import { FaApple, FaGooglePlay, FaCcVisa, FaCcMastercard, FaAmazonPay, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiGooglepay, SiPhonepe } from "react-icons/si";
import ContactSection from "./components/ContactSection";
import FooterSection from "./components/FooterSection";
import { footerData } from "./components/footerData";
import Conditions from "./components/Conditions";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const toast = useToast();

  // Color mode values
  const bg = useColorModeValue("white", "gray.900");
  const trustBg = useColorModeValue(
    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    "linear-gradient(135deg, #1a202c 0%, #171923 100%)"
  );
  const newsletterBg = useColorModeValue(
    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("gray.700", "gray.300");

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      toast({
        title: "Subscribed! 🎉",
        description: "You're now subscribed to our newsletter.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  const trustBadges = [
    { icon: FiTruck, label: "Free Shipping", desc: "On orders over ₹499", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
    { icon: FiShield, label: "Secure Payment", desc: "100% protected", gradient: "linear-gradient(135deg, #10b981, #34d399)" },
    { icon: FiRefreshCw, label: "Easy Returns", desc: "30-day policy", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
    { icon: FiCheckCircle, label: "Verified Sellers", desc: "Trusted vendors", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)" },
  ];

  const paymentMethods = [
    { name: "Visa", icon: FaCcVisa },
    { name: "Mastercard", icon: FaCcMastercard },
    { name: "RuPay", icon: SiGooglepay },
    { name: "UPI", icon: FaAmazonPay },
    { name: "Paytm", icon: SiPhonepe },
    { name: "COD", icon: FiCheckCircle },
  ];

  const socialLinks = [
    { icon: FaFacebookF, name: "Facebook", url: "#" },
    { icon: FaTwitter, name: "Twitter", url: "#" },
    { icon: FaInstagram, name: "Instagram", url: "#" },
    { icon: FaLinkedinIn, name: "LinkedIn", url: "#" },
  ];

  return (
    <Box bg={bg} color={textColor} position="relative" overflowX="hidden">
      {/* Gradient top border */}
      <Box h="1px" w="full" bgGradient="linear(to-r, transparent, blue.400, purple.500, pink.500, blue.400, transparent)" />

      {/* Trust Bar */}
      <Box bg={trustBg} borderBottom="1px solid" borderColor={borderColor} py={10}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 6, md: 8 }}>
            {trustBadges.map((badge, idx) => (
              <ScaleFade key={badge.label} initialScale={0.9} in={true} delay={idx * 0.1}>
                <HStack
                  spacing={4}
                  p={4}
                  borderRadius="2xl"
                  bg={cardBg}
                  shadow="sm"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-6px)", shadow: "xl", borderColor: accentColor, borderWidth: "1px" }}
                  border="1px solid"
                  borderColor="transparent"
                >
                  <Box
                    p={3}
                    borderRadius="xl"
                    bgGradient={badge.gradient}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <badge.icon size={20} color="white" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color={headingColor}>{badge.label}</Text>
                    <Text fontSize="xs" color={mutedText}>{badge.desc}</Text>
                  </Box>
                </HStack>
              </ScaleFade>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box bg={newsletterBg} py={12} position="relative" overflow="hidden">
        <Container maxW="7xl" px={{ base: 4, md: 8 }} position="relative" zIndex={2}>
          <Stack direction={{ base: "column", lg: "row" }} align="center" justify="space-between" spacing={{ base: 8, lg: 12 }}>
            <VStack align={{ base: "center", lg: "flex-start" }} spacing={3} flex={1}>
              <HStack spacing={2}>
                <FiHeart size={24} color="#f472b6" />
                <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="extrabold" color="white">
                  Join the Family
                </Heading>
              </HStack>
              <Text fontSize="md" color="blue.100" textAlign={{ base: "center", lg: "left" }} maxW="lg">
                Get exclusive deals, early access to sales, and ₹500 welcome voucher!
              </Text>
            </VStack>

            <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "full", lg: "auto" }} maxW={{ lg: "480px" }} flex={1}>
              <InputGroup size="lg">
                <Input
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  border="2px solid"
                  borderColor="whiteAlpha.300"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.600" }}
                  _focus={{ borderColor: "white", bg: "whiteAlpha.300", boxShadow: "0 0 0 3px rgba(255,255,255,0.2)" }}
                  borderRadius="2xl"
                  h={12}
                  pr="120px"
                  transition="all 0.3s"
                />
                <InputRightElement h={12} pr={1.5} w="auto">
                  <Button
                    h={9}
                    px={5}
                    bg="white"
                    color="blue.600"
                    borderRadius="xl"
                    fontWeight="bold"
                    _hover={{ bg: "gray.100", transform: "scale(1.02)" }}
                    onClick={handleSubscribe}
                    isLoading={isSubscribing}
                  >
                    Subscribe
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Footer */}
      <Container maxW="7xl" py={{ base: 14, md: 20 }} px={{ base: 4, md: 8 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 6 }} spacingX={{ base: 8, lg: 10 }} spacingY={{ base: 12, lg: 8 }}>
          {/* Brand Column */}
          <VStack align="flex-start" spacing={6} gridColumn={{ sm: "span 2", lg: "span 1.5" }}>
            <Box>
              <Heading
                as="h3"
                fontSize="2xl"
                fontWeight="extrabold"
                bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
                bgClip="text"
              >
                {footerData.companyInfo.name}
              </Heading>
              <HStack spacing={1} mt={2}>
                {[...Array(5)].map((_, i) => <FiStar key={i} size={12} color="#facc15" />)}
                <Text fontSize="xs" color={mutedText} ml={2}>50k+ happy customers</Text>
              </HStack>
            </Box>
            <Text fontSize="sm" lineHeight="1.8" color={textColor} maxW="280px">
              India's most trusted local marketplace. Connect with verified sellers, shop with confidence, and enjoy lightning-fast delivery.
            </Text>

            {/* App Download Buttons */}
            <VStack align="flex-start" spacing={4} pt={2} w="full">
              <Text fontSize="xs" fontWeight="bold" color={mutedText} textTransform="uppercase" letterSpacing="widest">
                Download Our App
              </Text>
              <HStack spacing={3}>
                <Box
                  as="button"
                  h="52px"
                  px={4}
                  borderRadius="xl"
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-3px)", shadow: "lg", borderColor: accentColor }}
                >
                  <FaApple size={20} color={headingColor === "white" ? "white" : "#1a202c"} />
                  <Box textAlign="left">
                    <Text fontSize="9px" color={mutedText}>Download on the</Text>
                    <Text fontSize="14px" fontWeight="bold" color={headingColor}>App Store</Text>
                  </Box>
                </Box>
                <Box
                  as="button"
                  h="52px"
                  px={4}
                  borderRadius="xl"
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-3px)", shadow: "lg", borderColor: accentColor }}
                >
                  <FaGooglePlay size={18} color={headingColor === "white" ? "white" : "#1a202c"} />
                  <Box textAlign="left">
                    <Text fontSize="9px" color={mutedText}>GET IT ON</Text>
                    <Text fontSize="14px" fontWeight="bold" color={headingColor}>Google Play</Text>
                  </Box>
                </Box>
              </HStack>
            </VStack>
          </VStack>

          {/* Footer Sections */}
          {footerData.sections.map((section) => (
            <VStack key={section.title} align="flex-start" spacing={5}>
              <Text fontSize="xs" fontWeight="bold" color={headingColor} textTransform="uppercase" letterSpacing="widest" borderLeft="2px solid" borderLeftColor={accentColor} pl={3}>
                {section.title}
              </Text>
              <VStack align="flex-start" spacing={3}>
                {section.links.map((link: any) => (
                  <Link key={link.name} href={link.href} fontSize="sm" color={textColor} _hover={{ color: accentColor, transform: "translateX(4px)" }} transition="all 0.2s">
                    {link.name}
                  </Link>
                ))}
              </VStack>
            </VStack>
          ))}

          {/* Contact Column */}
          <VStack align="flex-start" spacing={5}>
            <Text fontSize="xs" fontWeight="bold" color={headingColor} textTransform="uppercase" letterSpacing="widest" borderLeft="2px solid" borderLeftColor={accentColor} pl={3}>
              Contact Us
            </Text>
            <Box w="full">
              <ContactSection contactInfo={footerData.contactInfo} />
            </Box>
            <Box w="full">
              <Conditions />
            </Box>

            {/* Social Icons */}
            <HStack spacing={3} pt={2}>
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.url} isExternal aria-label={social.name}>
                  <Box
                    w={10}
                    h={10}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="xl"
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    color={mutedText}
                    transition="all 0.3s"
                    _hover={{
                      bgGradient: `linear(to-br, ${accentColor}, purple.500)`,
                      color: "white",
                      transform: "translateY(-4px)",
                      borderColor: "transparent",
                    }}
                  >
                    <social.icon size={18} />
                  </Box>
                </Link>
              ))}
            </HStack>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* Payment Methods */}
      <Box bg={trustBg} borderTop="1px solid" borderBottom="1px solid" borderColor={borderColor} py={6}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <Stack direction={{ base: "column", md: "row" }} align="center" justify="space-between" spacing={5}>
            <HStack spacing={4} wrap="wrap" justify="center">
              <Text fontSize="sm" fontWeight="semibold" color={headingColor}>Secure Payments:</Text>
              {paymentMethods.map((method) => (
                <Badge
                  key={method.name}
                  variant="solid"
                  bg="whiteAlpha.900"
                  color="gray.700"
                  border="1px solid"
                  borderColor={borderColor}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.05)", shadow: "md", borderColor: accentColor }}
                >
                  <method.icon size={14} />
                  {method.name}
                </Badge>
              ))}
            </HStack>
            <HStack spacing={2}>
              <FiShield size={14} color="#22c55e" />
              <Text fontSize="xs" color={mutedText}><Text as="span" color="green.600" fontWeight="bold">100% Secure</Text> · SSL Encrypted</Text>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Divider borderColor={borderColor} />

      {/* Bottom Bar */}
      <Box py={6} px={{ base: 4, md: 8 }}>
        <Container maxW="7xl">
          <Stack direction={{ base: "column", md: "row" }} align="center" justify="space-between" spacing={{ base: 4, md: 0 }}>
            <Text fontSize="xs" color={mutedText}>
              &copy; {new Date().getFullYear()} <Text as="span" color={headingColor} fontWeight="semibold">{footerData.companyInfo.name}</Text>.
              All rights reserved. Crafted with ❤️ in India
            </Text>
            <HStack spacing={6} divider={<Box w="1px" h="3" bg={borderColor} />}>
              {footerData.legalLinks.map((link) => (
                <Link key={link.name} href={link.href} fontSize="xs" color={mutedText} _hover={{ color: accentColor }}>{link.name}</Link>
              ))}
              <Link onClick={scrollToTop} fontSize="xs" color={mutedText} _hover={{ color: accentColor }} display="flex" alignItems="center" gap={1} cursor="pointer">
                <FiArrowUp size={12} /> Back to Top
              </Link>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Back to Top Button */}
      <Fade in={showBackToTop}>
        <IconButton
          aria-label="Back to top"
          icon={<FiArrowUp />}
          position="fixed"
          bottom="24px"
          right="24px"
          zIndex={99}
          borderRadius="full"
          size="lg"
          bgGradient={`linear(to-r, ${accentColor}, purple.500)`}
          color="white"
          _hover={{ transform: "scale(1.1)", shadow: "xl" }}
          transition="all 0.3s"
          onClick={scrollToTop}
        />
      </Fade>
    </Box>
  );
};