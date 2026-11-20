import React, { memo } from "react";
import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { FaBox, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";
import { getOrderStatusMeta, normalizeOrderStatusKey } from "../../../../utils/orderStatus";

const statusColors: Record<string, { color: string; icon: any }> = {
  delivered: { color: "green", icon: FaCheckCircle },
  cancelled: { color: "red", icon: FaTimesCircle },
  processing: { color: "orange", icon: FaTruck },
  shipped: { color: "purple", icon: FaTruck },
  created: { color: "blue", icon: FaBox },
  initialized: { color: "gray", icon: FaBox },
};

const defaultStatus = {
  color: "gray",
  icon: FaBox,
};

interface OrderStatusBadgeProps {
  status?: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const normalizedStatus = normalizeOrderStatusKey(status);
  const meta = getOrderStatusMeta(status);
  const { color, icon } = statusColors[normalizedStatus] || defaultStatus;

  return (
    <Badge colorScheme={color} px={3} py={1} borderRadius="md">
      <HStack spacing={2}>
        <Icon as={icon} />
        <Text textTransform="capitalize">{meta.label}</Text>
      </HStack>
    </Badge>
  );
};

export default memo(OrderStatusBadge);
