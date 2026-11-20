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
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { FiShield, FiLock, FiUserCheck, FiFileText, FiMail } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
  return (
    <Box minH="100vh" bg="#0B0F17" color="white" py={{ base: 12, md: 16 }}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" pb={4}>
            <Badge colorScheme="cyan" px={3} py={1} rounded="full" mb={3} textTransform="uppercase">
              DPDP Act 2023 Compliant
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" letterSpacing="tight" mb={3}>
              Privacy Notice & Data Policy
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Last Updated: November 2026 • Pursuant to the Digital Personal Data Protection Act (DPDP Act, 2023)
            </Text>
          </Box>

          <Divider borderColor="whiteAlpha.200" />

          {/* Core Principles Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box p={5} rounded="xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
              <Icon as={FiShield} color="#00E5FF" boxSize={6} mb={3} />
              <Heading as="h4" size="sm" mb={2}>Data Minimisation</Heading>
              <Text fontSize="xs" color="gray.400">
                We only collect information strictly required to deliver your orders and manage services.
              </Text>
            </Box>
            <Box p={5} rounded="xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
              <Icon as={FiLock} color="#00E5FF" boxSize={6} mb={3} />
              <Heading as="h4" size="sm" mb={2}>No Card Storage</Heading>
              <Text fontSize="xs" color="gray.400">
                Card and bank details are processed directly via PCI-DSS certified gateways (Razorpay).
              </Text>
            </Box>
            <Box p={5} rounded="xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
              <Icon as={FiUserCheck} color="#00E5FF" boxSize={6} mb={3} />
              <Heading as="h4" size="sm" mb={2}>Right to Erasure</Heading>
              <Text fontSize="xs" color="gray.400">
                You retain full rights to correct, request deletion, or withdraw consent at any time.
              </Text>
            </Box>
          </SimpleGrid>

          {/* Section 1 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#00E5FF">
              1. What Personal Data We Collect
            </Heading>
            <VStack align="stretch" spacing={3} color="gray.300" fontSize="sm">
              <Text>
                In compliance with Section 6 of the DPDP Act 2023, Business Sahayata collects the following personal data only after obtaining your specific consent:
              </Text>
              <Box as="ul" pl={6}>
                <li><strong>Identity Information:</strong> Full name, username, and contact phone number.</li>
                <li><strong>Shipping & Delivery Details:</strong> Physical shipping address, pin code, and landmark.</li>
                <li><strong>Account Credentials:</strong> Securely hashed passwords (we never see or store plain text passwords).</li>
                <li><strong>Order & Transaction History:</strong> Item lists, order references, invoice values, and payment status.</li>
              </Box>
            </VStack>
          </Box>

          {/* Section 2 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#00E5FF">
              2. Payment Data & Third-Party Security
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed">
              We <strong>do not store</strong> any credit card, debit card numbers, CVV codes, or net-banking credentials on our servers. All digital payments are handled through <strong>Razorpay Payment Gateway</strong>, a certified PCI-DSS Level 1 compliant provider governed by Reserve Bank of India (RBI) regulations.
            </Text>
          </Box>

          {/* Section 3 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#00E5FF">
              3. Purpose of Processing (Why We Need Your Data)
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed" mb={3}>
              Under the DPDP Act principle of Purpose Limitation, your personal information is used exclusively for:
            </Text>
            <Box as="ul" pl={6} color="gray.300" fontSize="sm">
              <li>Processing and delivering your orders.</li>
              <li>Dispatch notifications, order updates, and digital invoices.</li>
              <li>Preventing fraudulent transactions and platform security.</li>
            </Box>
          </Box>

          {/* Section 4 */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="whiteAlpha.100">
            <Heading as="h2" size="md" mb={4} color="#00E5FF">
              4. Your Rights as a Data Principal
            </Heading>
            <Text color="gray.300" fontSize="sm" lineHeight="relaxed" mb={3}>
              Under Sections 11, 12, and 13 of the Digital Personal Data Protection Act 2023, you have the following rights:
            </Text>
            <Box as="ul" pl={6} color="gray.300" fontSize="sm">
              <li><strong>Right to Access:</strong> Request a summary of personal data being processed.</li>
              <li><strong>Right to Correction & Erasure:</strong> Request correction of inaccurate data or deletion of your account and personal data.</li>
              <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent for future data processing at any point.</li>
              <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your rights in case of death or incapacity.</li>
            </Box>
          </Box>

          {/* Section 5: Grievance Officer */}
          <Box p={6} rounded="2xl" bg="whiteAlpha.05" border="1px solid" borderColor="cyan.800">
            <HStack mb={3}>
              <Icon as={FiMail} color="#00E5FF" boxSize={5} />
              <Heading as="h2" size="md" color="#00E5FF">
                5. Grievance Redressal & Data Protection Officer (DPO)
              </Heading>
            </HStack>
            <Text color="gray.300" fontSize="sm" mb={3}>
              Pursuant to Section 13 of the DPDP Act 2023, if you have any questions, concerns, or wish to exercise your rights of erasure or data rectification, please contact our Grievance Officer:
            </Text>
            <Box bg="blackAlpha.500" p={4} rounded="xl" border="1px solid" borderColor="whiteAlpha.200" fontSize="sm">
              <Text><strong>Designation:</strong> Data Protection & Grievance Officer</Text>
              <Text><strong>Platform:</strong> Business Sahayata</Text>
              <Text><strong>Email:</strong> support@businesssahayata.com / privacy@businesssahayata.com</Text>
              <Text><strong>Response Window:</strong> Within 48 business hours</Text>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

