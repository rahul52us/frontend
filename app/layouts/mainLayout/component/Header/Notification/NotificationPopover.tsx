"use client";

import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  VStack,
  Divider,
  Flex,
  Circle,
} from "@chakra-ui/react";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  isRead?: boolean;
  time?: string;
}

const dummyNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Order Shipped",
    message: "Your order #1234 has been shipped",
    time: "2h ago",
    isRead: false,
  },
  {
    id: 2,
    title: "New Offer",
    message: "Get 20% off on selected items",
    time: "1 day ago",
    isRead: true,
  },
];

const NotificationPopover = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent
        w="320px"
        borderRadius="lg"
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        {/* HEADER */}
        <Box
          px={4}
          py={3}
          bg="gray.50"
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="sm" fontWeight="600" color="gray.800">
            Notifications
          </Text>
        </Box>

        <PopoverBody p={0}>
          {dummyNotifications.length === 0 ? (
            <Box py={10} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                You’re all caught up 🎉
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {dummyNotifications.map((item, index) => (
                <Box
                  key={item.id}
                  px={4}
                  py={3.5}
                  cursor="pointer"
                  bg={item.isRead ? "white" : "blue.50"}
                  _hover={{ bg: item.isRead ? "gray.50" : "blue.100" }}
                  transition="background 0.15s ease"
                >
                  <Flex gap={3} align="flex-start">
                    {/* Unread dot */}
                    {!item.isRead && (
                      <Circle
                        size="8px"
                        bg="blue.500"
                        mt={2}
                        flexShrink={0}
                      />
                    )}

                    <Box flex="1">
                      <Flex justify="space-between" align="center">
                        <Text
                          fontSize="sm"
                          fontWeight={item.isRead ? "500" : "600"}
                          color="gray.800"
                        >
                          {item.title}
                        </Text>

                        {item.time && (
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            whiteSpace="nowrap"
                          >
                            {item.time}
                          </Text>
                        )}
                      </Flex>

                      <Text
                        fontSize="xs"
                        color="gray.600"
                        mt={1}
                        lineHeight="1.4"
                      >
                        {item.message}
                      </Text>
                    </Box>
                  </Flex>

                  {index !== dummyNotifications.length - 1 && (
                    <Divider mt={3} />
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
