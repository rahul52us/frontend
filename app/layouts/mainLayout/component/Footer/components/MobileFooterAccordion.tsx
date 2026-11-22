"use client";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import ContactSection from "./ContactSection";
import { footerData } from "./footerData";

interface MobileFooterAccordionProps {
  contactSectionStyles: any;
}

export const MobileFooterAccordion: React.FC<MobileFooterAccordionProps> = ({
  contactSectionStyles,
}) => {
  const headingColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = "var(--color-primary)";
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
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
  );
};

export default React.memo(MobileFooterAccordion);

