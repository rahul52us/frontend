"use client";

import { Box, Center, Flex, Icon, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import { TbExchange, TbRefresh, TbTruckDelivery } from "react-icons/tb";

export interface ServiceItem {
  type?: string;
  icon?: string;
  label: string;
}

interface ReturnExchangeProps {
  services: ServiceItem[];
}

const getIcon = (type?: string, icon?: string) => {
  const key = type || icon || "";
  switch (key.toLowerCase()) {
    case "return":
      return TbRefresh;
    case "exchange":
      return TbExchange;
    case "freeshipping":
    case "truck":
      return TbTruckDelivery;
    default:
      return TbExchange;
  }
};

const ReturnExchange: React.FC<ReturnExchangeProps> = memo(({ services }) => {
  if (!services || services.length === 0) return null;

  return (
    <Flex gap={3} wrap="wrap">
      {services.map((service, index) => (
        <Box
          key={`${service.type || service.icon || index}-${index}`}
          bgGradient="linear(to-br, purple.50, blue.50)"
          py={3}
          px={3}
          rounded="2xl"
          w={{ base: "110px", sm: "130px" }}
          shadow="xs"
          border="1px solid"
          borderColor="purple.100"
        >
          <Center>
            <Icon as={getIcon(service.type, service.icon)} fontSize="28px" color="blue.600" />
          </Center>
          <Text
            mt={2}
            fontWeight={600}
            color="gray.600"
            fontSize="2xs"
            textAlign="center"
            noOfLines={2}
          >
            {service.label}
          </Text>
        </Box>
      ))}
    </Flex>
  );
});

ReturnExchange.displayName = "ReturnExchange";

export default ReturnExchange;
