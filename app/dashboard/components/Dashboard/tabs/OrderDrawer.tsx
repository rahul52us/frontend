import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Select,
  Image,
  useToast,
  Grid,
  GridItem,
  Flex,
  Heading,
  Circle,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaCreditCard } from "react-icons/fa";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import stores from "../../../../store/stores";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const formatCurrency = (amount: any) => {
  const numericAmount = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const getOrderStatusMeta = (status: string) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "delivered") {
    return {
      label: "Delivered",
      bg: "rgba(70, 201, 139, 0.14)",
      color: dashboardPalette.success,
      borderColor: "rgba(70, 201, 139, 0.22)",
    };
  }

  if (normalized === "cancelled") {
    return {
      label: "Cancelled",
      bg: "rgba(239, 107, 107, 0.14)",
      color: dashboardPalette.danger,
      borderColor: "rgba(239, 107, 107, 0.24)",
    };
  }

  if (normalized === "created") {
    return {
      label: "Placed",
      bg: dashboardPalette.accentSoft,
      color: dashboardPalette.accentStrong,
      borderColor: dashboardPalette.border,
    };
  }

  return {
    label: status || "Pending",
    bg: "rgba(214, 183, 114, 0.08)",
    color: dashboardPalette.warning,
    borderColor: dashboardPalette.border,
  };
};

const selectStyles = {
  bg: dashboardPalette.surfaceAlt,
  border: "1px solid",
  borderColor: dashboardPalette.borderStrong,
  color: dashboardPalette.text,
  borderRadius: "16px",
  iconColor: dashboardPalette.textSoft,
  _hover: { borderColor: dashboardPalette.accent },
  _focusVisible: {
    borderColor: dashboardPalette.accent,
    boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
  },
  sx: {
    option: {
      backgroundColor: "#ffffff",
      color: dashboardPalette.page,
    },
  },
};

const infoCardStyles = {
  bg: dashboardPalette.shell,
  border: "1px solid",
  borderColor: dashboardPalette.border,
  borderRadius: "24px",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
};

const OrderDrawer: React.FC<OrderDrawerProps> = observer(
  ({ isOpen, onClose, order }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const toast = useToast();
    const { orderStore } = stores;

    if (!order) return null;

    const handleStatusUpdate = async (newStatus: string) => {
      setIsUpdating(true);
      try {
        const data = await orderStore.updateOrderStatus(order._id, newStatus);
        if (data.success) {
          toast({ title: "Status updated", status: "success" });
        } else {
          toast({
            title: "Failed update",
            description: data.message,
            status: "error",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Something went wrong",
          status: "error",
        });
      } finally {
        setIsUpdating(false);
      }
    };

    const handleItemStatusUpdate = async (
      itemId: string,
      newStatus: string
    ) => {
      setIsUpdating(true);
      try {
        const data = await orderStore.updateOrderItemStatus(
          order._id,
          itemId,
          newStatus
        );
        if (data.success) {
          toast({ title: "Item Status updated", status: "success" });
        } else {
          toast({
            title: "Failed update",
            description: data.message,
            status: "error",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Something went wrong",
          status: "error",
        });
      } finally {
        setIsUpdating(false);
      }
    };

    const currentOrder = order;
    const orderStatusMeta = getOrderStatusMeta(currentOrder?.orderStatus);
    const shippingAddress = [
      currentOrder?.shippingAddress?.addressLine1,
      currentOrder?.shippingAddress?.addressLine2,
      currentOrder?.shippingAddress?.city,
      currentOrder?.shippingAddress?.state,
      currentOrder?.shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <CustomDrawer
        open={isOpen}
        close={onClose}
        title={`Order #${currentOrder?.orderId}`}
        size="xl"
        loading={!currentOrder}
        showDivider={false}
        contentProps={{
          bg: dashboardPalette.page,
          color: dashboardPalette.text,
          borderLeft: "1px solid",
          borderLeftColor: dashboardPalette.border,
        }}
        headerProps={{
          bg: dashboardPalette.shell,
          color: dashboardPalette.text,
          borderBottom: "1px solid",
          borderBottomColor: dashboardPalette.border,
          px: 6,
          py: 5,
        }}
        closeButtonProps={{
          color: dashboardPalette.text,
          bg: dashboardPalette.surfaceAlt,
          border: "1px solid",
          borderColor: dashboardPalette.borderStrong,
          borderRadius: "12px",
          _hover: {
            bg: dashboardPalette.surfaceSoft,
            color: dashboardPalette.accentStrong,
          },
        }}
        bodyProps={{
          bg: dashboardPalette.page,
          px: { base: 3, md: 4 },
          py: 4,
        }}
      >
        <VStack spacing={5} align="stretch">
          <Box {...infoCardStyles} p={{ base: 4, md: 5 }}>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Box>
                <HStack spacing={3} mb={3}>
                  <Circle size="11" bg="rgba(214, 183, 114, 0.12)">
                    <Icon as={FaShoppingBag} color={dashboardPalette.accentStrong} />
                  </Circle>
                  <Badge
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    bg={orderStatusMeta.bg}
                    color={orderStatusMeta.color}
                    border="1px solid"
                    borderColor={orderStatusMeta.borderColor}
                    textTransform="capitalize"
                  >
                    {orderStatusMeta.label}
                  </Badge>
                </HStack>
                <Heading
                  size="md"
                  color={dashboardPalette.text}
                  fontWeight="600"
                  mb={1}
                >
                  {formatCurrency(
                    currentOrder?.quote?.price?.value || currentOrder?.total
                  )}
                </Heading>
                <Text color={dashboardPalette.textMuted}>
                  {currentOrder?.items?.length || 0} items in this order
                </Text>
              </Box>

              <Box minW={{ md: "240px" }}>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color={dashboardPalette.textSoft}
                  textTransform="uppercase"
                  letterSpacing="0.14em"
                  mb={2}
                >
                  Update Order Status
                </Text>
                <Select
                  size="md"
                  isDisabled={isUpdating}
                  value={currentOrder?.orderStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  {...selectStyles}
                >
                  <option value="created">Created</option>
                  <option value="in-progress">In Progress</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </Box>
            </Flex>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <Box {...infoCardStyles} p={{ base: 4, md: 5 }} h="100%">
                <HStack spacing={3} mb={4}>
                  <Circle size="10" bg="rgba(214, 183, 114, 0.12)">
                    <Icon as={FaUser} color={dashboardPalette.accentStrong} />
                  </Circle>
                  <Box>
                    <Text color={dashboardPalette.text} fontWeight="600">
                      Customer Details
                    </Text>
                    <Text color={dashboardPalette.textSoft} fontSize="sm">
                      Contact information for this order
                    </Text>
                  </Box>
                </HStack>
                <VStack align="start" spacing={1}>
                  <Text color={dashboardPalette.text} fontWeight="600">
                    {currentOrder?.user?.name || "Unknown customer"}
                  </Text>
                  <Text color={dashboardPalette.textMuted} fontSize="sm">
                    {currentOrder?.user?.email || "No email available"}
                  </Text>
                  <Text color={dashboardPalette.textMuted} fontSize="sm">
                    {currentOrder?.user?.phone || "No phone number available"}
                  </Text>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <Box {...infoCardStyles} p={{ base: 4, md: 5 }} h="100%">
                <HStack spacing={3} mb={4}>
                  <Circle size="10" bg="rgba(214, 183, 114, 0.12)">
                    <Icon
                      as={FaMapMarkerAlt}
                      color={dashboardPalette.accentStrong}
                    />
                  </Circle>
                  <Box>
                    <Text color={dashboardPalette.text} fontWeight="600">
                      Shipping Address
                    </Text>
                    <Text color={dashboardPalette.textSoft} fontSize="sm">
                      Delivery location saved with the order
                    </Text>
                  </Box>
                </HStack>
                <Text color={dashboardPalette.textMuted} fontSize="sm" lineHeight="1.7">
                  {shippingAddress || "No shipping address available"}
                </Text>
              </Box>
            </GridItem>
          </Grid>

          <Box {...infoCardStyles} p={{ base: 4, md: 5 }}>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={2}
              mb={4}
            >
              <Box>
                <Heading size="sm" color={dashboardPalette.text}>
                  Order Items
                </Heading>
                <Text color={dashboardPalette.textSoft} fontSize="sm" mt={1}>
                  Update fulfillment status per item when needed.
                </Text>
              </Box>
              <Badge
                px={3}
                py={1.5}
                borderRadius="full"
                bg={dashboardPalette.surfaceAlt}
                color={dashboardPalette.textMuted}
                border="1px solid"
                borderColor={dashboardPalette.borderStrong}
              >
                {currentOrder?.items?.length || 0} Items
              </Badge>
            </Flex>

            <VStack spacing={3} align="stretch">
              {currentOrder?.items?.map((item: any, index: number) => {
                const fulfillment = currentOrder?.fulfillments?.find(
                  (f: any) => f.id === item.fulfillment_id
                );
                const itemStatus = fulfillment?.status || "pending";
                const itemStatusMeta = getOrderStatusMeta(itemStatus);

                return (
                  <Box
                    key={index}
                    bg={dashboardPalette.surface}
                    border="1px solid"
                    borderColor={dashboardPalette.borderStrong}
                    borderRadius="20px"
                    p={{ base: 3, md: 4 }}
                  >
                    <Flex
                      justify="space-between"
                      align={{ base: "start", lg: "center" }}
                      direction={{ base: "column", lg: "row" }}
                      gap={4}
                    >
                      <HStack spacing={4} align="start">
                        <Image
                          src={
                            item.productImage || "https://via.placeholder.com/72"
                          }
                          boxSize="72px"
                          objectFit="cover"
                          borderRadius="16px"
                          alt={item.productName}
                          bg={dashboardPalette.surfaceAlt}
                        />
                        <Box>
                          <Text
                            color={dashboardPalette.text}
                            fontWeight="700"
                            mb={1}
                          >
                            {item.productName}
                          </Text>
                          <Text color={dashboardPalette.textMuted} fontSize="sm">
                            Qty: {item.quantity} | Variant:{" "}
                            {Array.isArray(item.variant) && item.variant.length > 0
                              ? item.variant.join(", ")
                              : "N/A"}
                          </Text>
                          <Text
                            mt={2}
                            color={dashboardPalette.accentStrong}
                            fontWeight="700"
                          >
                            {formatCurrency(item.total)}
                          </Text>
                        </Box>
                      </HStack>

                      <Box minW={{ lg: "180px" }} w={{ base: "full", lg: "auto" }}>
                        <Badge
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          bg={itemStatusMeta.bg}
                          color={itemStatusMeta.color}
                          border="1px solid"
                          borderColor={itemStatusMeta.borderColor}
                          mb={2}
                          textTransform="capitalize"
                        >
                          {itemStatusMeta.label}
                        </Badge>
                        <Select
                          size="sm"
                          isDisabled={isUpdating}
                          value={itemStatus}
                          onChange={(e) =>
                            handleItemStatusUpdate(
                              item.fulfillment_id,
                              e.target.value
                            )
                          }
                          {...selectStyles}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </Select>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>

          <Box {...infoCardStyles} p={{ base: 4, md: 5 }}>
            <HStack spacing={3} mb={4}>
              <Circle size="10" bg="rgba(214, 183, 114, 0.12)">
                <Icon as={FaCreditCard} color={dashboardPalette.accentStrong} />
              </Circle>
              <Box>
                <Text color={dashboardPalette.text} fontWeight="600">
                  Payment Summary
                </Text>
                <Text color={dashboardPalette.textSoft} fontSize="sm">
                  Billing snapshot for this order
                </Text>
              </Box>
            </HStack>

            <VStack spacing={3} align="stretch">
              <Flex justify="space-between" align="center">
                <Text color={dashboardPalette.textMuted}>Total Amount</Text>
                <Text color={dashboardPalette.accentStrong} fontWeight="700" fontSize="lg">
                  {formatCurrency(
                    currentOrder?.quote?.price?.value || currentOrder?.total
                  )}
                </Text>
              </Flex>
              <Divider borderColor={dashboardPalette.borderStrong} />
              <Flex justify="space-between" align="center">
                <Text color={dashboardPalette.textMuted}>Payment Method</Text>
                <Text color={dashboardPalette.text} textTransform="uppercase" fontWeight="600">
                  {currentOrder?.paymentMethod || "N/A"}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </CustomDrawer>
    );
  }
);

export default OrderDrawer;
