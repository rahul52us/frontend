import {
  Box,
  Container,
  Divider,
  Grid,
  Icon,
  Image,
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

// Removed empty interface
export const Footer: React.FC = () => {
  const textColor = useColorModeValue("white", "white");

  return (
    <Box bg={"#065F68"} color={textColor} borderTopRadius={{ base: "24px", md: "40px" }} py={{ base: "8", md: 14 }}>
      <Container as={Stack} maxW={{ lg: "90%" }} px={{ base: 4, md: 8 }}>
      <Box mb={6} textAlign={{ base: "center", md: "left" }} w={{ base: "100%", md: "80%", lg: "75%" }} mx="auto">
          <Text textAlign="center" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
          We’re not a crisis service. For immediate help, call <strong> Lifeline at 1800-891-4416 </strong> (TeleMANAS- mental health crisis service)/ <strong>Call 112</strong>  (National emergency number)/ <strong>Call 1098</strong> (Child Helpline)/ <strong>Call 1091</strong>  (Women Helpline)/ Go to the nearest emergency room of your choice.
            {/* <br /> */}
            {/* {footerData.companyInfo.crisisNumber}. */}
          </Text>
        </Box>
        <SimpleGrid
          templateColumns={{
            base: "1fr", // Stacks items on small screens
            sm: "1fr 1fr", // Two columns on small screens
            md: "1fr 1fr 1fr", // Standard grid layout on medium and larger screens
            lg: "1fr 1fr 1fr 1fr", // Standard grid layout on medium and larger screens
          }}
          spacing={{ base: 3, md: 4 }}
        >
          {/* Company Info */}
          {/* <Stack
            spacing={{ base: 4, md: 4 }}
            align={{ base: "center", md: "flex-start" }}
          >
            <Box textAlign={{ base: "center", md: "left" }}>
              <Image
                src="/images/whiteLogo.png"
                alt="logo"
                h={{ base: "70px", lg: "100px" }}
                mx={{ base: "auto", md: 0 }}
              />
              <Text pl={1} fontSize={{ base: "lg", md: "xl", lg: "2xl" }} mt={-2}>
                {footerData.companyInfo.tagline}
              </Text>
            </Box>
            <Stack
              direction="row"
              spacing={4}
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
                    bg="#FFFFFF1C"
                    _hover={{ color: "gray.300" }}
                  >
                    <Icon as={social.icon} boxSize="60%" />
                  </Box>
                </Link>
              ))}
            </Stack>
          </Stack> */}

          {/* Sections */}
          {footerData.sections.map((section) => (
            <FooterSection key={section.title} section={section} />
          ))}

          <Box>
            <Conditions/>
          </Box>
          {/* Contact Info */}
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
                    bg="#FFFFFF1C"
                    _hover={{ color: "gray.300" }}
                  >
                    <Icon as={social.icon} boxSize="60%" />
                  </Box>
                </Link>
              ))}
            </Stack>
          </Box>

        </SimpleGrid>

        {/* Crisis Notice */}
        {/* <Box pt={{ base: 4, md: 10 }} pb={2} textAlign={{ base: "center", md: "left" }} w={{ base: "100%", md: "80%", lg: "70%" }} mx="auto">
          <Text textAlign="center" fontSize={{ base: "sm", md: "lg" }} lineHeight="1.6">
            We’re not a crisis service. For immediate help, call Lifeline at <strong>1800-891-4416</strong> (TeleMANAS – mental health crisis service) or call <strong>112</strong> (National emergency number), <strong>1098</strong> (Child Helpline), <strong>1091</strong> (Women Helpline), or go to the nearest emergency room of your choice.
            <br />
            {footerData.companyInfo.crisisNumber}.
          </Text>
        </Box> */}

      </Container>

      <Box>
        <Divider borderColor={"#FFFFFF33"} />
        <Grid
          pt={6}
          gap={4}
          templateColumns={{
            base: "1fr", // Single column on small screens
            lg: "1fr 1fr 1fr", // Three columns on medium and larger screens
          }}
          textAlign={{ base: "center", lg: "left" }}
          alignItems={"center"}
        >
          <Box display={{ base: "none", sm: "block" }}>
            <Image
              position={"absolute"}
              h={"260px"}
              bottom={0}
              left={0}
              src="/images/footerImage.png"
              alt="Who are some good psychiatrists in Noida?"
              mixBlendMode={"multiply"}
            />
          </Box>
          <Text fontSize={{ base: "xs", sm: "sm" }} textAlign={'center'}>
            ©{new Date().getFullYear()}{" "}
            <Text as={"span"} color={"#DF837C"}>
              {footerData.companyInfo.name}
            </Text>{" "}
            . All rights reserved.
          </Text>
          <Stack
            direction="row" // Always a horizontal row
            spacing={2} // Small spacing between items
            justify={{ base: "center", lg: "flex-end" }} // Align to the right
            align="center" // Vertically center items
            wrap="wrap" // Wrap items if needed on very small screens
            pr={{ md: 8 }}
          >
            {footerData.legalLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  href={link.href}
                  _hover={{ color: "gray.300" }}
                  fontSize={{ base: "xs", sm: "sm" }} // Smaller font size for better scaling
                >
                  {link.name}
                </Link>
                {index < footerData.legalLinks.length - 1 && (
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }} // Match separator size with links
                  >
                    /
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Stack>
        </Grid>
      </Box>
    </Box>
  );
};
