'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { FiCheckCircle, FiFileText } from 'react-icons/fi';

export default function TermsOfServicePage() {
  return (
    <Box minH="100vh" bg="#0B0F17" color="white" py={{ base: 12, md: 16 }}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" pb={4}>
            <Badge colorScheme="purple" px={3} py={1} rounded="full" mb={3} textTransform="uppercase">
              Customer Agreement
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" letterSpacing="tight" mb={3}>
              Terms of Service
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Last Updated: November 2026 • Business Sahayata Marketplace
            </Text>
          </Box>

          <Divider borderColor="whiteAlpha.200" />

          {/* Section 1 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#A78BFA">
              1. Platform Services & Multi-Vendor Framework
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed">
              Business Sahayata connects registered buyers with verified suppliers, distributors, and merchants. Orders placed on the platform are fulfilled directly by the respective vendor or seller partners.
            </Text>
          </Box>

          {/* Section 2 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#A78BFA">
              2. Orders, Pricing & Payments
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed" mb={3}>
              All payments for orders must be executed either via Cash on Delivery (COD) where available or securely online via our authorized payment partner (Razorpay). Prices shown include applicable taxes unless specified otherwise.
            </Text>
          </Box>

          {/* Section 3 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#A78BFA">
              3. Data Privacy & Compliance (DPDP Act, 2023)
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed">
              By using our service and placing orders, you acknowledge that your personal information (name, address, telephone number) will be processed solely for the fulfillment and invoicing of your purchase in accordance with our Privacy Policy and the Digital Personal Data Protection Act, 2023.
            </Text>
          </Box>

          {/* Section 4 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#A78BFA">
              4. Cancellations, Returns & Refunds
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed">
              Eligible items qualify for returns or replacements in accordance with our 7-Day Easy Return policy. For damaged, defective, or incorrect items, claims must be logged within the designated return window.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

