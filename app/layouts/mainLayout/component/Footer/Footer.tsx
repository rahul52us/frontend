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
} from "@chakra-ui/react";
import React from "react";
import ContactSection from "./components/ContactSection";
import FooterSection from "./components/FooterSection";
import { footerData } from "./components/footerData";
import Conditions from "./components/Conditions";

export const Footer: React.FC = () => {
  const textColor = useColorModeValue("white", "white"); // White text for readability

  return (
    <Box
      bg="linear-gradient(to right, #2b5876, #4e4376)" // Darker blue and purple gradient for strong contrast
      color={textColor}
      borderTopRadius={{ base: "24px", md: "40px" }}
      py={{ base: "8", md: "6" }} // Increased padding for more spacing
    >
      <Container as={Stack} maxW={{ lg: "90%" }} px={{ base: 4, md: 8 }}>
        <Box mb={6} textAlign="center" w="100%" mx="auto">
        <Text fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
  Need assistance? For immediate support, please contact us at{" "}
  <strong>Customer Support: 1800-123-4567</strong> or visit our{" "}
  <strong>Help Center</strong> for FAQs and guidance. If you have any issues with your orders or need assistance with our platform, our team is here to help.
  Alternatively, you can reach out via email at <strong>support@businesssahayata.com</strong>.
</Text>

        </Box>

        <SimpleGrid
          templateColumns={{
            base: "1fr", // Stacks items on small screens
            sm: "1fr 1fr", // Two columns on small screens
            md: "1fr 1fr 1fr", // Three columns on medium screens
            lg: "1fr 1fr 1fr 1fr", // Four columns on large screens
          }}
          spacing={{ base: 6, md: 8 }} // Increased spacing for better readability
        >
          {footerData.sections.map((section) => (
            <FooterSection key={section.title} section={section} />
          ))}

          <Box>
            <Conditions />
          </Box>

          <Box>
            <ContactSection contactInfo={footerData.contactInfo} />
            <Stack
              direction="row"
              spacing={4}
              ml={{ base: -3, md: 5 }}
              mt={2}
              justify={{ base: "center", md: "flex-start" }}
            >
              {footerData.companyInfo.socialLinks.map((social) => (
                <Link key={social.name} href={social.url}>
                  <Box
                    boxSize={7}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    rounded="full"
                    bg="rgba(255, 255, 255, 0.2)" // Slightly transparent social icons
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.4)", // Light hover effect for social icons
                      color: "gray.300",
                    }}
                  >
                    <Icon as={social.icon} boxSize="60%" />
                  </Box>
                </Link>
              ))}
            </Stack>
          </Box>
        </SimpleGrid>
      </Container>

      <Box pt={6}>
        <Divider borderColor={"#FFFFFF66"} /> {/* Subtle divider with opacity */}
        <Grid
          pt={6}
          gap={6} // Increased gap for better space
          templateColumns={{
            base: "1fr", // Single column on small screens
            lg: "1fr 1fr 1fr", // Three columns on medium and larger screens
          }}
          textAlign={{ base: "center", lg: "left" }}
          alignItems={"center"}
          justifyContent={"center"} // Centers horizontally
          alignContent={"center"} // Centers vertically within grid
        >
          <Box display={{ base: "none", sm: "block" }}></Box>
          <Text fontSize={{ base: "xs", sm: "sm" }} textAlign="center">
            ©{new Date().getFullYear()}{" "}
            <Text as={"span"} color={"#FF6F61"}> {/* Soft coral accent color */}
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
            pr={{ md: 8 }}
          >
            {footerData.legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link href={link.href} _hover={{ color: "gray.300" }} fontSize={{ base: "xs", sm: "sm" }}>
                  {link.name}
                </Link>
                {index < footerData.legalLinks.length - 1 && (
                  <Text fontSize={{ base: "xs", sm: "sm" }}>/</Text>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Grid>
      </Box>
    </Box>
  );
};
