import {
  Box, Stack, Text, UnorderedList, ListItem,
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel
} from '@chakra-ui/react';
import React from 'react';

const businessCategories = [
  "Grocery Stores",
  "Electronics & Appliances",
  "Clothing & Fashion",
  "Automobile & Accessories",
  "Restaurants & Cafes",
  "Furniture & Home Decor",
  "Beauty & Wellness",
  "Healthcare & Pharmacies",
  "Books & Stationery",
  "Sports & Fitness",
  "Toys & Games",
  "Handmade & Artisanal"
];

const Conditions = () => {
  return (
    <Box mb={2}>
      {/* Desktop Version (Unchanged) */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Stack align={'flex-start'} mt={2}>
          <Text fontWeight={'400'} fontSize={'lg'} mb={1}>
            Business Categories
          </Text>
          <UnorderedList listStyleType={'none'} ml={0}>
            {businessCategories.map((category, index) => (
              <ListItem fontSize={'sm'} ml={0} mt={3} display="block" key={index}>
                {category}
              </ListItem>
            ))}
          </UnorderedList>
        </Stack>
      </Box>

      {/* Mobile Version with Accordion */}
      <Box display={{ base: 'block', md: 'none' }} mt={2}>
        <Accordion allowToggle>
          <AccordionItem border="none">
            <AccordionButton _hover={{ bg: 'transparent' }} _expanded={{ bg: 'transparent' }}>
              <Box flex="1" textAlign="left" fontWeight={'400'} fontSize={'lg'}>
                Business Categories
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <UnorderedList listStyleType={'none'} ml={0}>
                {businessCategories.map((category, index) => (
                  <ListItem fontSize={'sm'} ml={0} mt={2} display="block" key={index}>
                    {category}
                  </ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Conditions;
