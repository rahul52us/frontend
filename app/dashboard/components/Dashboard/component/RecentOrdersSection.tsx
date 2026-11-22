import React from "react";
import {
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  Stack,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { FiArrowUpRight, FiClock, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import {
  MerchantBadge,
  merchantFadeUp,
  MerchantPanel,
  MerchantSectionHeader,
} from "../../common/merchantDashboardUI";
import { normalizeOrderStatusKey } from "../../../../utils/orderStatus";

export type DashboardOrder = {
  _id?: string;
  orderId?: string;
  orderStatus?: string;
  createdAt?: string;
  total?: number;
  user?: { name?: string };
  quote?: { price?: { value?: number | string } };
  items?: any[];
};

const getOrderAmount = (order: DashboardOrder) =>
  Number(order.quote?.price?.value || order.total || 0);

const getOrderStatusTone = (status?: string): "success" | "warning" | "accent" | "danger" | "soft" => {
  const normalized = normalizeOrderStatusKey(status);
  if (normalized === "delivered") return "success";
  if (normalized === "shipped" || normalized === "processing") return "accent";
  if (normalized === "cancelled") return "danger";
  return "warning";
};

interface RecentOrdersSectionProps {
  orders: DashboardOrder[];
  loading: boolean;
  surfaceBg: string;
  shellBg: string;
  borderCol: string;
  textCol: string;
  textMuted: string;
  formatCurrency: (value: number) => string;
  formatRelativeTime: (time?: string) => string;
  onViewAll: () => void;
}

export const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = React.memo(({
  orders,
  loading,
  surfaceBg,
  shellBg,
  borderCol,
  textCol,
  textMuted,
  formatCurrency,
  formatRelativeTime,
  onViewAll,
}) => {
  return (
    <MerchantPanel animation={merchantFadeUp(450)}>
      <MerchantSectionHeader
        title="Recent Orders"
        subtitle="Latest orders placed by customers"
        right={
          <HStack spacing={2}>
            <MerchantBadge tone="soft" fontSize="xs" px={2.5} py={0.5}>
              {loading ? "..." : `${orders.length} recent`}
            </MerchantBadge>
            <Button
              size="xs"
              variant="ghost"
              colorScheme="brand"
              rightIcon={<FiArrowUpRight />}
              onClick={onViewAll}
            >
              View All
            </Button>
          </HStack>
        }
      />

      {loading ? (
        <Stack spacing={2.5}>
          {[0, 1, 2, 3].map((i) => (
            <Flex key={i} align="center" gap={3} p={3} borderRadius="16px" bg={shellBg}>
              <Skeleton w="42px" h="42px" borderRadius="12px" flexShrink={0} />
              <Box flex="1">
                <Skeleton h="14px" w="60%" borderRadius="md" mb={2} />
                <Skeleton h="12px" w="40%" borderRadius="md" />
              </Box>
              <Skeleton h="24px" w="70px" borderRadius="full" />
            </Flex>
          ))}
        </Stack>
      ) : orders.length === 0 ? (
        <Box
          py={10}
          textAlign="center"
          bg={shellBg}
          borderRadius="16px"
          border="1px dashed"
          borderColor={borderCol}
        >
          <Circle size="46px" bg={surfaceBg} mx="auto" mb={2.5} border="1px solid" borderColor={borderCol}>
            <Icon as={FiShoppingCart} boxSize={5} color={dashboardPalette.accentStrong} />
          </Circle>
          <Text fontSize="sm" fontWeight="700" color={textCol} mb={1}>
            No orders received yet
          </Text>
          <Text fontSize="xs" color={textMuted} maxW="280px" mx="auto">
            Incoming orders from buyers will appear here in real-time.
          </Text>
        </Box>
      ) : (
        <Stack spacing={2}>
          {orders.slice(0, 5).map((order) => {
            const amount = getOrderAmount(order);
            const tone = getOrderStatusTone(order.orderStatus);

            return (
              <Flex
                key={order._id || order.orderId}
                p={3.5}
                borderRadius="16px"
                border="1px solid"
                borderColor={borderCol}
                bg={surfaceBg}
                align="center"
                justify="space-between"
                gap={3}
                transition="all 0.2s ease"
                _hover={{
                  borderColor: dashboardPalette.accent,
                  transform: "translateY(-1px)",
                }}
              >
                <HStack spacing={3} minW={0} flex="1">
                  <Circle
                    size="40px"
                    borderRadius="12px"
                    bg={dashboardPalette.accentSoft}
                    color={dashboardPalette.accentStrong}
                    flexShrink={0}
                  >
                    <Icon as={FiShoppingBag} boxSize={4} />
                  </Circle>
                  <Box minW={0}>
                    <Text fontSize="sm" fontWeight="700" color={textCol} noOfLines={1}>
                      {order.user?.name || "Customer Order"}
                    </Text>
                    <HStack spacing={1.5} color={textMuted} fontSize="xs">
                      <Text fontWeight="600">{order.orderId || order._id}</Text>
                      <Text>•</Text>
                      <HStack spacing={1}>
                        <Icon as={FiClock} boxSize={3} />
                        <Text>{formatRelativeTime(order.createdAt)}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                </HStack>

                <Box textAlign="right" flexShrink={0}>
                  <Text fontSize="sm" fontWeight="800" color={textCol}>
                    {formatCurrency(amount)}
                  </Text>
                  <MerchantBadge tone={tone} fontSize="10px" px={2} py={0.5} mt={0.5} textTransform="capitalize">
                    {order.orderStatus || "Placed"}
                  </MerchantBadge>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </MerchantPanel>
  );
});

RecentOrdersSection.displayName = "RecentOrdersSection";
export default RecentOrdersSection;

