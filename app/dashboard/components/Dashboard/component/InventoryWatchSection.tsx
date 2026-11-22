import React from "react";
import {
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { FiArrowUpRight, FiCheckCircle, FiPackage } from "react-icons/fi";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import {
  MerchantBadge,
  merchantFadeUp,
  MerchantPanel,
  MerchantSectionHeader,
} from "../../common/merchantDashboardUI";
import { getLowStockThreshold } from "../../../products/utils/stockThreshold";

interface DashboardProduct {
  _id: string;
  name?: string;
  stock?: number;
  lowStockThreshold?: number;
  threshold?: number;
  reorderLevel?: number;
  minStock?: number;
  updatedAt?: string;
  createdAt?: string;
}

interface InventoryWatchSectionProps {
  lowStockItems: DashboardProduct[];
  lowStockCount: number;
  loading: boolean;
  surfaceBg: string;
  shellBg: string;
  borderCol: string;
  textCol: string;
  textMuted: string;
  onManageInventory: () => void;
}

export const InventoryWatchSection: React.FC<InventoryWatchSectionProps> = React.memo(({
  lowStockItems,
  lowStockCount,
  loading,
  surfaceBg,
  shellBg,
  borderCol,
  textCol,
  textMuted,
  onManageInventory,
}) => {
  return (
    <MerchantPanel animation={merchantFadeUp(620)}>
      <MerchantSectionHeader
        title="Inventory Watch & Low Stock"
        subtitle="Real-time stock depletion and restocking alerts"
        right={
          <HStack spacing={2}>
            <MerchantBadge
              tone={lowStockCount > 0 ? "danger" : "success"}
              fontSize="xs"
              px={2.5}
              py={0.5}
            >
              {loading ? "..." : `${lowStockCount} low stock`}
            </MerchantBadge>
            <Button
              size="xs"
              variant="ghost"
              colorScheme="brand"
              rightIcon={<FiArrowUpRight />}
              onClick={onManageInventory}
            >
              Manage Inventory
            </Button>
          </HStack>
        }
      />

      {loading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} h="72px" borderRadius="16px" />
          ))}
        </SimpleGrid>
      ) : lowStockItems.length === 0 ? (
        <Box
          py={8}
          textAlign="center"
          bg={shellBg}
          borderRadius="16px"
          border="1px dashed"
          borderColor={borderCol}
        >
          <Icon as={FiCheckCircle} boxSize={5} color={dashboardPalette.success} mb={1.5} />
          <Text fontSize="sm" fontWeight="700" color={textCol} mb={0.5}>
            Inventory is healthy
          </Text>
          <Text fontSize="xs" color={textMuted}>
            No items currently below their reorder thresholds.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
          {lowStockItems.map((item) => {
            const stock = Number(item.stock || 0);
            const threshold = getLowStockThreshold(item);
            const isCritical = stock <= 0;

            return (
              <Flex
                key={item._id}
                align="center"
                justify="space-between"
                p={3.5}
                border="1.5px solid"
                borderColor={isCritical ? "red.300" : borderCol}
                borderRadius="16px"
                bg={surfaceBg}
                transition="all 0.2s ease"
                _hover={{
                  borderColor: isCritical ? "red.400" : dashboardPalette.accent,
                  transform: "translateY(-1px)",
                }}
              >
                <HStack spacing={3} minW={0}>
                  <Circle
                    size="40px"
                    borderRadius="12px"
                    bg={isCritical ? "rgba(239, 107, 107, 0.14)" : "rgba(245, 158, 11, 0.14)"}
                    color={isCritical ? dashboardPalette.danger : dashboardPalette.warning}
                    flexShrink={0}
                  >
                    <Icon as={FiPackage} boxSize={4} />
                  </Circle>
                  <Box minW={0}>
                    <Text fontSize="sm" fontWeight="700" color={textCol} noOfLines={1}>
                      {item.name || "Product"}
                    </Text>
                    <Text fontSize="xs" color={textMuted}>
                      Threshold: {threshold} units
                    </Text>
                  </Box>
                </HStack>

                <Box textAlign="right" flexShrink={0}>
                  <Text
                    fontSize="lg"
                    fontWeight="900"
                    color={isCritical ? dashboardPalette.danger : dashboardPalette.warning}
                    lineHeight="1"
                  >
                    {stock}
                  </Text>
                  <MerchantBadge
                    tone={isCritical ? "danger" : "warning"}
                    fontSize="9px"
                    px={1.5}
                    py={0}
                    mt={1}
                  >
                    {isCritical ? "Out of Stock" : "Low Stock"}
                  </MerchantBadge>
                </Box>
              </Flex>
            );
          })}
        </SimpleGrid>
      )}
    </MerchantPanel>
  );
});

InventoryWatchSection.displayName = "InventoryWatchSection";
export default InventoryWatchSection;

