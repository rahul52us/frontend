"use client";

import { Box, IconButton, Badge } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import NotificationPopover from "./NotificationPopover";
import { observer } from "mobx-react-lite";
import stores from "../../../../../store/stores";

interface NotificationBellProps {
  count?: number;
}

const NotificationBell = ({ count }: NotificationBellProps) => {
  const unreadCount = stores.notificationStore.unreadCount;
  const badgeCount = typeof count === "number" ? count : unreadCount;

  return (
    <NotificationPopover>
      <Box
        position="relative"
        px={1}
        py={1}
        borderRadius="md"
        _hover={{ bg: "gray.50" }}
      >
        <IconButton
          icon={<FiBell size={20} />}   // ✅ SAME icon size as cart
          aria-label="Notifications"
          size="md"                     // ✅ SAME size
          variant="ghost"               // ✅ SAME variant
          color="blue.600"              // ✅ SAME color
        />

        {badgeCount > 0 && (
          <Badge
            position="absolute"
            top="-2px"
            right="-2px"
            bg="red.500"
            color="white"
            borderRadius="full"
            fontSize="0.7em"             // ✅ SAME scale as cart badge
            px={2}
          >
            {badgeCount}
          </Badge>
        )}
      </Box>
    </NotificationPopover>
  );
};

export default observer(NotificationBell);
