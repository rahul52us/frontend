import React from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Stack, Text, Link, Box } from '@chakra-ui/react';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSectionProps {
  section: {
    title: string;
    links: FooterLink[];
  };
}

const FooterSection: React.FC<FooterSectionProps> = ({ section }) => {
  return (
    <>
      {/* Desktop Version (Unchanged) */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Stack align="flex-start" mt={4}>
          <Text fontWeight="400" fontSize="lg" mb={1}>
            {section.title}
          </Text>
          {section.links.map((link) => (
            <Link
              key={link.name}
              mb={{ md: 2 }}
              href={link.href}
              fontSize={{ base: 'sm', md: '15px' }}
              _hover={{ color: 'gray.300' }}
            >
              {link.name}
            </Link>
          ))}
        </Stack>
      </Box>

      {/* Mobile Version with Accordion (Transparent Background) */}
      <Box display={{ base: 'block', md: 'none' }} mt={4}>
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton _hover={{ bg: 'transparent' }} _expanded={{ bg: 'transparent' }}>
              <Box flex="1" textAlign="left" fontWeight="400" fontSize="lg">
                {section.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Stack spacing={2}>
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    fontSize="sm"
                    _hover={{ color: 'gray.300' }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
};

export default FooterSection;
