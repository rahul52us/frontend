import React from "react";
import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import {
  MerchantBadge,
  merchantFadeUp,
  MerchantPanel,
  MerchantSectionHeader,
} from "../../common/merchantDashboardUI";
import ShopHealthGauge from "./ShopHealthGauge";

interface ChecklistItem {
  label: string;
  done: boolean;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt?: string;
}

interface ShopReadinessSectionProps {
  percent: number;
  completed: number;
  total: number;
  items: ChecklistItem[];
  notifications?: NotificationItem[];
  loading: boolean;
  shellBg: string;
  borderCol: string;
  textCol: string;
  textMuted: string;
  formatRelativeTime: (time?: string) => string;
}

export const ShopReadinessSection: React.FC<ShopReadinessSectionProps> = React.memo(({
  percent,
  completed,
  total,
  items,
  notifications = [],
  loading,
  shellBg,
  borderCol,
  textCol,
  textMuted,
  formatRelativeTime,
}) => {
  return (
    <Stack spacing={{ base: 4, md: 6 }} minW={0}>
      {/* Shop Health & Setup Gauge */}
      <MerchantPanel animation={merchantFadeUp(520)}>
        <MerchantSectionHeader
          title="Shop Readiness"
          subtitle="Profile setup & operational compliance"
          mb={3}
        />

        <Flex direction="column" align="center" gap={4}>
          <ShopHealthGauge score={percent} loading={loading} />

          <Box w="full">
            <Flex justify="space-between" align="center" mb={1.5}>
              <Text fontSize="xs" fontWeight="700" color={textCol}>
                Setup Checklist
              </Text>
              <Text fontSize="xs" color={textMuted} fontWeight="600">
                {completed} of {total} done
              </Text>
            </Flex>

            <Progress
              value={percent}
              h="6px"
              borderRadius="full"
              bg={shellBg}
              colorScheme="brand"
              mb={3}
            />

            <VStack spacing={1.5} align="stretch">
              {items.map((item) => (
                <Flex
                  key={item.label}
                  align="center"
                  justify="space-between"
                  py={1.5}
                  px={2.5}
                  borderRadius="10px"
                  bg={item.done ? "transparent" : shellBg}
                >
                  <HStack spacing={2} minW={0}>
                    <Icon
                      as={item.done ? FiCheckCircle : FiClock}
                      color={item.done ? dashboardPalette.success : textMuted}
                      boxSize={3.5}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight={item.done ? "500" : "600"}
                      color={item.done ? textMuted : textCol}
                      textDecoration={item.done ? "line-through" : "none"}
                      noOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </HStack>
                  {item.done ? (
                    <MerchantBadge tone="success" fontSize="9px" px={1.5} py={0}>
                      Done
                    </MerchantBadge>
                  ) : (
                    <MerchantBadge tone="warning" fontSize="9px" px={1.5} py={0}>
                      Pending
                    </MerchantBadge>
                  )}
                </Flex>
              ))}
            </VStack>
          </Box>
        </Flex>
      </MerchantPanel>

      {/* Quick Notice Banner if any */}
      {notifications.length > 0 && (
        <MerchantPanel animation={merchantFadeUp(580)}>
          <MerchantSectionHeader
            title="Broadcast Notices"
            subtitle="Alerts from platform administration"
            mb={2}
          />
          <VStack spacing={2} align="stretch">
            {notifications.slice(0, 2).map((notif) => (
              <Box
                key={notif._id}
                p={3}
                borderRadius="14px"
                border="1px solid"
                borderColor={borderCol}
                bg={shellBg}
              >
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" fontWeight="700" color={textCol} noOfLines={1}>
                    {notif.title}
                  </Text>
                  <Text fontSize="10px" color={textMuted}>
                    {formatRelativeTime(notif.createdAt)}
                  </Text>
                </HStack>
                <Text fontSize="xs" color={textMuted} noOfLines={2}>
                  {notif.message}
                </Text>
              </Box>
            ))}
          </VStack>
        </MerchantPanel>
      )}
    </Stack>
  );
});

ShopReadinessSection.displayName = "ShopReadinessSection";
export default ShopReadinessSection;

