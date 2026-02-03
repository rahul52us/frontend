import { Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { FaBox, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    delivered: { color: "green", icon: FaCheckCircle },
    cancelled: { color: "red", icon: FaTimesCircle },
    arriving: { color: "orange", icon: FaTruck },
    created: { color: "blue", icon: FaBox },
    confirmed: { color: "purple", icon: FaBox },
  };

  const statusLabels: any = {
    created: "Placed",
  }

  const { color, icon } = statusColors[status] || {
    color: "gray",
    icon: FaBox,
  };

  return (
    <Badge colorScheme={color} px={3} py={1} borderRadius="md">
      <HStack spacing={2}>
        <Icon as={icon} />
        <Text textTransform="capitalize">{statusLabels[status] || status}</Text>
      </HStack>
    </Badge>
  );
};

export default OrderStatusBadge;
