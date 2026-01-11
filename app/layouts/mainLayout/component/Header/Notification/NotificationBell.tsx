"use client";

import { Box, IconButton, Badge } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import NotificationPopover from "./NotificationPopover";

interface NotificationBellProps {
  count?: number;
}

const NotificationBell = ({ count = 0 }: NotificationBellProps) => {
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

        {count > 0 && (
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
            {count}
          </Badge>
        )}
      </Box>
    </NotificationPopover>
  );
};

export default NotificationBell;