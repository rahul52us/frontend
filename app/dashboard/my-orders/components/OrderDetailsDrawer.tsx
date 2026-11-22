"use client";

import {
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
  Circle,
} from "@chakra-ui/react";
import React from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { OrderData } from "../types";

interface OrderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
  loading: boolean;
}

const getStatusBadge = (status: string) => {
  const norm = String(status || "").toLowerCase();
  switch (norm) {
    case "delivered":
    case "completed":
      return { label: "Delivered", colorScheme: "green" };
    case "shipped":
      return { label: "Dispatched", colorScheme: "blue" };
    case "processing":
    case "in-progress":
      return { label: "Processing", colorScheme: "orange" };
    case "cancelled":
    case "returned":
      return { label: "Cancelled", colorScheme: "red" };
    default:
      return { label: "Order Placed", colorScheme: "purple" };
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  isOpen,
  onClose,
  order,
  loading,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const softBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  if (!order && !loading) return null;

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="md"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent bg={cardBg} style={{ maxWidth: "520px" }}>
        <DrawerHeader
          borderBottom="1px solid"
          borderColor={borderColor}
          py={3.5}
          px={{ base: 4, md: 5 }}
        >
          <Flex align="center" justify="space-between" w="100%">
            <HStack spacing={3} align="center" minW={0} flex="1">
              <Circle size="38px" bg={softBg} border="1px solid" borderColor={borderColor} flexShrink={0}>
                <Icon as={FiShoppingBag} color="brand.500" boxSize={4} />
              </Circle>
              <Box minW={0}>
                <Text fontSize="15px" fontWeight="800" color={textPrimary} noOfLines={1}>
                  Order Details
                </Text>
                <Text fontSize="11px" color={textMuted} noOfLines={1}>
                  #{order?.orderId || ""}
                </Text>
              </Box>
            </HStack>

            <IconButton
              aria-label="Close details"
              icon={<Icon as={FiX} boxSize={4} />}
              size="sm"
              w="34px"
              h="34px"
              borderRadius="10px"
              variant="ghost"
              color={textMuted}
              bg={softBg}
              border="1px solid"
              borderColor={borderColor}
              _hover={{ color: textPrimary, bg: useColorModeValue("gray.100", "gray.700") }}
              _focus={{ boxShadow: "none" }}
              onClick={onClose}
              flexShrink={0}
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody px={{ base: 4, md: 5 }} py={4} className="customScrollBar">
          {loading ? (
            <VStack spacing={4} align="stretch" py={8}>
              <Skeleton h="24px" borderRadius="md" />
              <Skeleton h="80px" borderRadius="xl" />
              <Skeleton h="120px" borderRadius="xl" />
              <Skeleton h="160px" borderRadius="xl" />
            </VStack>
          ) : order ? (
            <VStack spacing={4} align="stretch">
              {/* Status & Date Card */}
              <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="12px" fontWeight="700" color={textMuted}>
                    Order Status
                  </Text>
                  <Badge
                    colorScheme={getStatusBadge(order.orderStatus).colorScheme}
                    borderRadius="full"
                    px={2.5}
                    py={0.5}
                    fontSize="10px"
                    fontWeight="800"
                    textTransform="uppercase"
                  >
                    {getStatusBadge(order.orderStatus).label}
                  </Badge>
                </Flex>
                <HStack spacing={3} fontSize="11px" color={textMuted} wrap="wrap">
                  <HStack spacing={1}>
                    <Icon as={FiCalendar} />
                    <Text>Placed: {formatDate(order.createdAt)}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={FiClock} />
                    <Text>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </HStack>
                </HStack>
              </Box>

              {/* Vendor Store Details */}
              <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2.5}>
                  Sold by Merchant
                </Text>
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={order.company?.name || "Store"}
                    src={order.company?.logo?.url || undefined}
                    borderRadius="12px"
                  />
                  <Box minW={0}>
                    <Text fontSize="14px" fontWeight="800" color={textPrimary} noOfLines={1}>
                      {order.company?.name || "Merchant Store"}
                    </Text>
                    <Text fontSize="11px" color={textMuted}>
                      Code: {order.company?.companyCode || "Verified Store"}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                  <HStack spacing={2} mb={1.5} color={textPrimary}>
                    <Icon as={FiMapPin} color="brand.500" />
                    <Text fontSize="12px" fontWeight="800">
                      Delivery Address
                    </Text>
                  </HStack>
                  <Text fontSize="12px" color={textMuted} pl={6}>
                    {[
                      order.shippingAddress.name,
                      order.shippingAddress.addressLine1 || order.shippingAddress.address,
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  {order.shippingAddress.phone && (
                    <Text fontSize="11px" color={textMuted} pl={6} mt={1}>
                      Contact: {order.shippingAddress.phone}
                    </Text>
                  )}
                </Box>
              )}

              {/* Ordered Items List */}
              <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2.5}>
                  Purchased Items ({order.items?.length || 0})
                </Text>
                <VStack spacing={2.5} align="stretch">
                  {order.items?.map((item: any, i: number) => (
                    <Flex
                      key={i}
                      justify="space-between"
                      align="center"
                      p={2.5}
                      bg={cardBg}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <HStack spacing={3} minW={0}>
                        <Avatar
                          size="sm"
                          src={item.productImage}
                          name={item.productName}
                          borderRadius="8px"
                          flexShrink={0}
                        />
                        <Box minW={0}>
                          <Text fontSize="12px" fontWeight="700" color={textPrimary} noOfLines={1}>
                            {item.productName}
                          </Text>
                          <Text fontSize="11px" color={textMuted}>
                            Qty: {item.quantity} × {formatCurrency(Number(item.unitPrice || 0))}
                          </Text>
                        </Box>
                      </HStack>
                      <Text fontSize="13px" fontWeight="800" color={textPrimary} flexShrink={0}>
                        {formatCurrency(Number(item.total || item.unitPrice * item.quantity || 0))}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>

              {/* Order Status History Timeline */}
              {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
                <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                  <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={3}>
                    Order Activity & Timeline
                  </Text>
                  <VStack align="stretch" spacing={0} position="relative">
                    {order.statusHistory.map((hist: any, hIdx: number) => {
                      const isLast = hIdx === (order.statusHistory?.length || 0) - 1;
                      const histDate = hist.timestamp ? new Date(hist.timestamp) : null;
                      return (
                        <Flex key={hIdx} position="relative" pb={isLast ? 0 : 3.5}>
                          {!isLast && (
                            <Box
                              position="absolute"
                              left="11px"
                              top="20px"
                              bottom="0"
                              w="2px"
                              bg="brand.500"
                              opacity={0.3}
                            />
                          )}
                          <Circle
                            size="24px"
                            bg={hIdx === 0 ? "brand.500" : "blue.500"}
                            color="white"
                            mr={3}
                            flexShrink={0}
                            zIndex={1}
                          >
                            <Icon as={FiCheckCircle} boxSize={3} />
                          </Circle>
                          <Box minW={0} flex="1">
                            <Flex justify="space-between" align="center" gap={2} mb={0.5}>
                              <Text fontSize="12px" fontWeight="800" color={textPrimary} textTransform="capitalize">
                                {String(hist.status || "Updated").replace(/-/g, " ")}
                              </Text>
                              {histDate && (
                                <Text fontSize="10px" color={textMuted} flexShrink={0}>
                                  {histDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}{" "}
                                  {histDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </Text>
                              )}
                            </Flex>
                            {hist.remarks && (
                              <Text fontSize="11px" color={textMuted}>
                                {hist.remarks}
                              </Text>
                            )}
                          </Box>
                        </Flex>
                      );
                    })}
                  </VStack>
                </Box>
              )}

              {/* Payment & Price Summary */}
              {(() => {
                const itemsTotal = Array.isArray(order.items)
                  ? order.items.reduce((sum: number, it: any) => sum + Number(it.total || it.unitPrice * it.quantity || 0), 0)
                  : 0;
                const subtotal = Number(order.subtotal || itemsTotal || 0);
                const totalPaid = Number(order.quote?.price?.value || order.total || itemsTotal || 0);

                const quoteBreakup = Array.isArray(order.quote?.breakup) ? order.quote.breakup : [];
                const taxItem = quoteBreakup.find((b: any) => b.title_type === "tax");
                const deliveryItem = quoteBreakup.find((b: any) => b.title_type === "delivery");
                const discountItem = quoteBreakup.find((b: any) => b.title_type === "discount");

                const deliveryCharge = Number(order.deliveryCharges || deliveryItem?.price?.value || 0);
                const discount = Number(order.discount || discountItem?.price?.value || 0);
                const tax = Number(order.tax || taxItem?.price?.value || 0);

                return (
                  <Box p={3.5} borderRadius="16px" bg={softBg} border="1px solid" borderColor={borderColor}>
                    <Text fontSize="11px" fontWeight="800" color={textMuted} textTransform="uppercase" mb={2}>
                      Payment & Breakdown
                    </Text>
                    <VStack spacing={1.5} align="stretch" fontSize="12px">
                      <Flex justify="space-between" color={textMuted}>
                        <Text>Items Subtotal</Text>
                        <Text>{formatCurrency(subtotal)}</Text>
                      </Flex>
                      {deliveryCharge > 0 && (
                        <Flex justify="space-between" color={textMuted}>
                          <Text>Delivery Charges</Text>
                          <Text>{formatCurrency(deliveryCharge)}</Text>
                        </Flex>
                      )}
                      {discount > 0 && (
                        <Flex justify="space-between" color="green.500">
                          <Text>Discount</Text>
                          <Text>-{formatCurrency(discount)}</Text>
                        </Flex>
                      )}
                      {tax > 0 && (
                        <Flex justify="space-between" color={textMuted}>
                          <Text>Taxes</Text>
                          <Text>{formatCurrency(tax)}</Text>
                        </Flex>
                      )}
                      <Divider my={1} borderColor={borderColor} />
                      <Flex justify="space-between" fontSize="14px" fontWeight="900" color={textPrimary}>
                        <Text>Total Amount</Text>
                        <Text>{formatCurrency(totalPaid)}</Text>
                      </Flex>
                      <Flex justify="space-between" fontSize="11px" color={order.paymentStatus === "paid" ? "green.600" : "blue.500"} fontWeight="700">
                        <Text>Payment Mode</Text>
                        <Text textTransform="uppercase">
                          {order.paymentMethod || "ONLINE"} • {order.paymentStatus || "SUCCESS"}
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>
                );
              })()}
            </VStack>
          ) : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

