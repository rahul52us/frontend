"use client";

import {
  Box,
  Fade,
  Grid,
  GridItem,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { footerData } from "./components/footerData";

// Dynamically imported components for smaller initial JS bundle & lazy evaluation
const BrandColumn = dynamic(() => import("./components/BrandColumn"), {
  ssr: true,
});

const ContactSection = dynamic(() => import("./components/ContactSection"), {
  ssr: true,
});

const MobileFooterAccordion = dynamic(
  () => import("./components/MobileFooterAccordion"),
  { ssr: false }
);

const NewsletterBanner = dynamic(() => import("./components/NewsletterBanner"), {
  ssr: true,
});

const PaymentSecurityStrip = dynamic(
  () => import("./components/PaymentSecurityStrip"),
  { ssr: true }
);

const FooterBottomRow = dynamic(() => import("./components/FooterBottomRow"), {
  ssr: true,
});

export interface FooterProps {
  hideBottomNav?: boolean;
}

const socialLinks = [
  { icon: FaFacebookF, name: "Facebook", url: "#" },
  { icon: FaInstagram, name: "Instagram", url: "#" },
  { icon: FaTwitter, name: "Twitter", url: "#" },
  { icon: FaLinkedinIn, name: "LinkedIn", url: "#" },
];

export const Footer: React.FC<FooterProps> = ({ hideBottomNav = false }) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const toast = useToast();

  // Color Mode Tokens
  const bg = useColorModeValue("white", "gray.950");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const accentColor = "var(--color-primary)";
  const borderColor = useColorModeValue("gray.100", "gray.800");

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubscribe = useCallback(
    (e?: React.FormEvent) => {
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
    },
    [email, toast]
  );

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
      <Box
        px={{ base: 3, md: 8 }}
        pt={{ base: 5, md: 8 }}
        pb={{
          base: hideBottomNav
            ? "16px"
            : "calc(var(--mobile-bottom-nav-height, 56px) + 24px)",
          md: 6,
        }}
      >
        {/* 1. Newsletter Banner */}
        <NewsletterBanner
          email={email}
          setEmail={setEmail}
          isSubscribing={isSubscribing}
          handleSubscribe={handleSubscribe}
        />

        {/* 2. Main Footer Grid: Balanced 4-Column on Desktop + Mobile Accordion */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2.4fr 1.3fr 1.5fr 2fr",
          }}
          gap={{ base: 5, lg: 10 }}
          pb={{ base: 5, md: 7 }}
          alignItems="start"
        >
          {/* Column 1: Brand Info & App Downloads */}
          <GridItem>
            <BrandColumn socialLinks={socialLinks} />
          </GridItem>

          {/* Mobile Accordions (Client only) */}
          <GridItem display={{ base: "block", lg: "none" }}>
            <MobileFooterAccordion contactSectionStyles={contactSectionStyles} />
          </GridItem>

          {/* Desktop Columns: Quick Links & Services */}
          {footerData.sections.map((section) => (
            <GridItem key={section.title} display={{ base: "none", lg: "block" }}>
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

          {/* Desktop Column: Contact Details */}
          <GridItem display={{ base: "none", lg: "block" }} sx={contactSectionStyles}>
            <ContactSection contactInfo={footerData.contactInfo} />
          </GridItem>
        </Grid>

        {/* 3. Payment & Security Strip */}
        <PaymentSecurityStrip />

        {/* 4. Copyright & Legal Links */}
        <FooterBottomRow onScrollToTop={scrollToTop} />
      </Box>

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

export default React.memo(Footer);
