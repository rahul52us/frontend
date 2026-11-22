"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiArrowRight, FiUsers } from "react-icons/fi";
import { SellerConnection } from "./types";
import { formatCurrency } from "./utils";

interface ConnectedSellersListProps {
  connections: SellerConnection[];
  onOpenDrawer: (connection: SellerConnection) => void;
}

export const ConnectedSellersList: React.FC<ConnectedSellersListProps> = ({
  connections,
  onOpenDrawer,
}) => {
  if (connections.length === 0) {
    return (
      <Box
        bg="var(--color-surface)"
        borderRadius="2xl"
        p={8}
        borderWidth="1px"
        borderColor="var(--color-border)"
        textAlign="center"
      >
        <Icon as={FiUsers} boxSize={12} color="var(--color-text-secondary)" mb={3} />
        <Heading size="sm" color="var(--color-text-primary)">
          No Seller Connections Yet
        </Heading>
        <Text fontSize="xs" color="var(--color-text-secondary)" mt={1} maxW="360px" mx="auto">
          When sellers add you to their ledger or shop customer list, their ledger details will appear here.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={3}>
      {connections.map((conn) => {
        const shop = conn.sellerShop;
        const balance = conn.outstandingBalance;
        const isPositiveBalance = balance > 0;
        const balanceColor = isPositiveBalance ? "red.400" : "green.400";

        return (
          <Box
            key={conn.profileId}
            bg="var(--color-surface)"
            borderRadius="xl"
            p={4}
            borderWidth="1px"
            borderColor="var(--color-border)"
            cursor="pointer"
            onClick={() => onOpenDrawer(conn)}
            _hover={{ borderColor: "var(--color-primary)", shadow: "sm" }}
          >
            <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
              <HStack spacing={3}>
                <Avatar
                  size="md"
                  name={shop?.name || conn.displayName || "Shop"}
                  src={shop?.logo || undefined}
                  borderRadius="lg"
                />
                <Box>
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="800" color="var(--color-text-primary)">
                      {shop?.name || conn.displayName || "Seller"}
                    </Text>
                    <Badge colorScheme={conn.partyType === "supplier" ? "purple" : "blue"} borderRadius="full" px={2} py={0.5} fontSize="10px">
                      {conn.partyType}
                    </Badge>
                  </HStack>
                  <Text fontSize="xs" color="var(--color-text-secondary)">
                    {[shop?.city, shop?.state].filter(Boolean).join(", ") || "India"}
                  </Text>
                  {shop?.phone && (
                    <Text fontSize="xs" color="var(--color-text-secondary)">
                      📞 {shop.phone}
                    </Text>
                  )}
                </Box>
              </HStack>

              <Flex align="center" justify="space-between" w={{ base: "100%", sm: "auto" }} gap={4}>
                <Box textAlign={{ base: "left", sm: "right" }}>
                  <Text fontSize="10px" color="var(--color-text-secondary)" textTransform="uppercase" fontWeight="700">
                    Khata Balance
                  </Text>
                  <Text fontSize="md" fontWeight="900" color={balanceColor}>
                    {formatCurrency(balance)}
                  </Text>
                </Box>
                <Button size="xs" colorScheme="teal" variant="ghost" rightIcon={<FiArrowRight />}>
                  View Khata
                </Button>
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
};

