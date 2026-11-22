"use client";

import {
  Badge,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaAmazonPay, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { FiCheckCircle, FiShield } from "react-icons/fi";
import { SiGooglepay, SiPhonepe } from "react-icons/si";

const paymentMethods = [
  { name: "UPI", icon: FaAmazonPay },
  { name: "GPay", icon: SiGooglepay },
  { name: "PhonePe", icon: SiPhonepe },
  { name: "Visa", icon: FaCcVisa },
  { name: "Mastercard", icon: FaCcMastercard },
  { name: "COD", icon: FiCheckCircle },
];

export const PaymentSecurityStrip: React.FC = () => {
  const subtleBg = useColorModeValue("#F8FAFC", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const borderColor = useColorModeValue("gray.100", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
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
  );
};

export default React.memo(PaymentSecurityStrip);

