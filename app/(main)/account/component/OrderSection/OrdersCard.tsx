import React, { memo, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderItem {
  item_id?: string;
  productImage?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  variant?: any;
}

interface OrderCardProps {
  order: any;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const orderItems: OrderItem[] = useMemo(() => order?.items || [], [order?.items]);
  const orderTotal = order?.quote?.price?.value || order?.total || 0;
  const deliveryAddress = order?.shippingAddress;
  const companyName = order?.company?.name;

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return "N/A";
    return new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [order?.createdAt]);

  const totalQuantity = useMemo(
    () => orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [orderItems]
  );

  return (
    <Box
      bg="var(--color-surface)"
      borderWidth="1px"
      borderColor="var(--color-border)"
      borderRadius={{ base: "xl", md: "2xl" }}
      boxShadow="sm"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{
        borderColor: "var(--color-border-strong)",
        boxShadow: "md",
      }}
    >
      {/* ─── Card Header (Compact, modern banner) ─── */}
      <Box
        px={{ base: 4, sm: 5, md: 6 }}
        py={{ base: 3.5, md: 4 }}
        bg="var(--color-surface-soft)"
        borderBottom="1px solid"
        borderColor="var(--color-border)"
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={2.5}
        >
          {/* Order ID & Date */}
          <HStack spacing={3} align="center" flexWrap="wrap">
            <Box
              p={2}
              borderRadius="lg"
              bg="var(--color-surface)"
              borderWidth="1px"
              borderColor="var(--color-border)"
              color="var(--color-primary)"
              display={{ base: "none", sm: "flex" }}
            >
              <Icon as={FiPackage} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0.5}>
              <HStack spacing={2}>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="800"
                  color="var(--color-text-primary)"
                  letterSpacing="-0.01em"
                >
                  Order #{order?.orderId}
                </Text>
                {companyName && (
                  <Badge
                    fontSize="2xs"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    bg="var(--color-surface)"
                    color="var(--color-text-secondary)"
                    borderWidth="1px"
                    borderColor="var(--color-border)"
                    textTransform="capitalize"
                    display={{ base: "none", md: "inline-flex" }}
                  >
                    {companyName}
                  </Badge>
                )}
              </HStack>
              <HStack spacing={1.5} color="var(--color-text-secondary)" fontSize="xs">
                <Icon as={FiClock} boxSize={3} />
                <Text>{formattedDate}</Text>
                <Text>•</Text>
                <Text>{orderItems.length} {orderItems.length === 1 ? "item" : "items"} ({totalQuantity} pcs)</Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Status Badge */}
          <Flex align="center" justify={{ base: "space-between", sm: "flex-end" }} gap={2}>
            <OrderStatusBadge status={order?.orderStatus || "pending"} />
          </Flex>
        </Flex>
      </Box>

      {/* ─── Card Body: Item Preview Row ─── */}
      <Box p={{ base: 4, sm: 5, md: 6 }}>
        <VStack align="stretch" spacing={3.5}>
          {orderItems.map((item, index) => (
            <Flex
              key={item.item_id || index}
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              gap={3.5}
              p={{ base: 3, sm: 3.5 }}
              borderRadius="xl"
              bg="var(--color-surface-soft)"
              borderWidth="1px"
              borderColor="var(--color-border)"
              transition="all 0.15s ease"
            >
              <HStack spacing={3.5} align="center" minW={0} flex={1}>
                {/* Product Thumbnail */}
                <Box
                  w={{ base: "60px", sm: "70px" }}
                  h={{ base: "60px", sm: "70px" }}
                  borderRadius="lg"
                  overflow="hidden"
                  bg="var(--color-surface)"
                  borderWidth="1px"
                  borderColor="var(--color-border)"
                  flexShrink={0}
                  p={1}
                >
                  <Image
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName || "Product"}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    fallbackSrc="https://via.placeholder.com/80"
                    loading="lazy"
                  />
                </Box>

                {/* Product Details */}
                <VStack align="start" spacing={1} minW={0} flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="var(--color-text-primary)"
                    noOfLines={2}
                    lineHeight="1.3"
                  >
                    {item.productName}
                  </Text>
                  <HStack spacing={2} fontSize="xs" color="var(--color-text-secondary)">
                    <Badge
                      borderRadius="full"
                      px={2}
                      py={0.2}
                      fontSize="2xs"
                      bg="var(--color-surface)"
                      color="var(--color-primary)"
                      borderWidth="1px"
                      borderColor="var(--color-border)"
                    >
                      Qty: {item.quantity}
                    </Badge>
                    <Text>
                      ₹{(item.unitPrice || 0).toLocaleString("en-IN")} each
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              {/* Line Price Tag */}
              <Flex
                align="center"
                justify={{ base: "flex-end", sm: "flex-end" }}
                gap={1}
                color="var(--color-text-primary)"
                fontWeight="800"
                fontSize="md"
              >
                <Icon as={FaRupeeSign} boxSize={3.5} />
                <Text>
                  {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                </Text>
              </Flex>
            </Flex>
          ))}
        </VStack>

        {/* ─── Expandable Details (Delivery Address, Payment Info) ─── */}
        <Collapse in={isExpanded} animateOpacity>
          <Box
            mt={4}
            pt={4}
            borderTop="1px dashed"
            borderColor="var(--color-border)"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {deliveryAddress && (
                <Box
                  p={3.5}
                  borderRadius="xl"
                  bg="var(--color-surface-soft)"
                  borderWidth="1px"
                  borderColor="var(--color-border)"
                >
                  <HStack spacing={2} color="var(--color-primary)" mb={1.5}>
                    <Icon as={FiMapPin} boxSize={3.5} />
                    <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                      Delivery Address
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="700" color="var(--color-text-primary)">
                    {deliveryAddress.name || deliveryAddress.contactName || "Default Address"}
                  </Text>
                  <Text fontSize="xs" color="var(--color-text-secondary)" mt={0.5} lineHeight="tall">
                    {[
                      deliveryAddress.address || deliveryAddress.street,
                      deliveryAddress.city,
                      deliveryAddress.state,
                      deliveryAddress.pinCode || deliveryAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  {deliveryAddress.phone && (
                    <Text fontSize="xs" color="var(--color-text-secondary)" mt={1}>
                      Phone: {deliveryAddress.phone}
                    </Text>
                  )}
                </Box>
              )}

              <Box
                p={3.5}
                borderRadius="xl"
                bg="var(--color-surface-soft)"
                borderWidth="1px"
                borderColor="var(--color-border)"
              >
                <HStack spacing={2} color="var(--color-primary)" mb={1.5}>
                  <Icon as={FiTruck} boxSize={3.5} />
                  <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.05em">
                    Order Summary
                  </Text>
                </HStack>
                <HStack justify="space-between" fontSize="xs" color="var(--color-text-secondary)" mb={1}>
                  <Text>Payment Method:</Text>
                  <Badge
                    textTransform="uppercase"
                    fontSize="3xs"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    colorScheme={order?.paymentMethod === "online" ? "green" : "blue"}
                  >
                    {order?.paymentMethod || "COD"}
                  </Badge>
                </HStack>
                <HStack justify="space-between" fontSize="xs" color="var(--color-text-secondary)">
                  <Text>Items Subtotal:</Text>
                  <Text fontWeight="600">
                    ₹{parseFloat(orderTotal.toString()).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </Text>
                </HStack>
              </Box>
            </SimpleGrid>
          </Box>
        </Collapse>

        <Divider my={4} borderColor="var(--color-border)" />

        {/* ─── Card Footer: Total Amount & Toggle Button ─── */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={3}
        >
          {/* Toggle Details Button */}
          <Button
            size="xs"
            variant="ghost"
            color="var(--color-text-secondary)"
            _hover={{ color: "var(--color-text-primary)", bg: "var(--color-surface-hover)" }}
            rightIcon={<Icon as={isExpanded ? FiChevronUp : FiChevronDown} />}
            onClick={() => setIsExpanded((prev) => !prev)}
            alignSelf={{ base: "flex-start", sm: "center" }}
          >
            {isExpanded ? "Hide Details" : "View Order Details"}
          </Button>

          {/* Total Amount Pill */}
          <HStack justify={{ base: "space-between", sm: "flex-end" }} spacing={3}>
            <Text fontSize="sm" color="var(--color-text-secondary)" fontWeight="600">
              Total Amount:
            </Text>
            <HStack
              spacing={1}
              px={3}
              py={1.5}
              borderRadius="lg"
              bg="var(--color-surface-soft)"
              borderWidth="1px"
              borderColor="var(--color-border)"
              color="var(--color-primary)"
            >
              <Icon as={FaRupeeSign} boxSize={3.5} />
              <Text fontSize="lg" fontWeight="900" lineHeight="1">
                {parseFloat(orderTotal.toString()).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </Text>
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default memo(observer(OrderCard));
