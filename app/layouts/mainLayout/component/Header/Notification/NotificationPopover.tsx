"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import stores from "../../../../../store/stores";

const NotificationPopover = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {
    auth: { user },
    notificationStore: {
      items,
      unreadCount,
      loading,
      page,
      totalPages,
      status,
      fetchList,
      markRead,
      markAllRead,
    },
  } = stores;

  const handleOpen = async () => {
    await fetchList({
      status,
      page: 1,
      force: true,
    });
  };

  const setFilter = async (nextStatus: "all" | "unread") => {
    await fetchList({
      status: nextStatus,
      page: 1,
    });
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    if (status === "unread") {
      await fetchList({ status: "unread", page: 1 });
    }
  };

  const handleItemClick = async (item: any) => {
    if (!item?.isRead) {
      await markRead(item._id);
    }

    if (item?.actionUrl) {
      const hasCompany = Boolean(user?.company?._id || user?.company);
      const isSuperAdmin = user?.type === "superAdmin" || user?.role === "superAdmin";
      const isSellerLike = user?.type === "seller" || user?.type === "admin" || isSuperAdmin;
      const isBuyerLike = !isSellerLike && !hasCompany;

      if (item.actionUrl === "/dashboard/orders" && isBuyerLike) {
        router.push("/account?tab=orders");
        return;
      }

      router.push(item.actionUrl);
    }
  };

  const handlePageChange = async (nextPage: number) => {
    await fetchList({
      status,
      page: nextPage,
    });
  };

  const renderTime = (value?: string) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Popover placement="bottom-end" onOpen={handleOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent
        w="360px"
        borderRadius="lg"
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="700" color="gray.800">
              Notifications
            </Text>
            <Text fontSize="xs" color="gray.500">
              Unread: {unreadCount}
            </Text>
          </Flex>

          <HStack spacing={2}>
            <Button
              size="xs"
              variant={status === "all" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              size="xs"
              variant={status === "unread" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
            <Button size="xs" variant="ghost" ml="auto" onClick={handleMarkAllRead} isDisabled={unreadCount === 0}>
              Mark all read
            </Button>
          </HStack>
        </Box>

        <PopoverBody p={0} maxH="420px" overflowY="auto">
          {loading ? (
            <Flex py={8} justify="center">
              <Spinner size="sm" color="blue.500" />
            </Flex>
          ) : items.length === 0 ? (
            <Box py={10} textAlign="center">
              <Text fontSize="sm" color="gray.500">
                No notifications
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align="stretch">
              {items.map((item, index) => (
                <Box
                  key={item._id}
                  px={4}
                  py={3}
                  cursor="pointer"
                  bg={item.isRead ? "white" : "blue.50"}
                  _hover={{ bg: item.isRead ? "gray.50" : "blue.100" }}
                  transition="background 0.15s ease"
                  onClick={() => handleItemClick(item)}
                >
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontSize="sm" fontWeight={item.isRead ? "500" : "700"} color="gray.800" noOfLines={1}>
                      {item.title}
                    </Text>
                    <Text fontSize="xs" color="gray.400" ml={2} whiteSpace="nowrap">
                      {renderTime(item.createdAt)}
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="gray.600" lineHeight="1.5" noOfLines={2}>
                    {item.message}
                  </Text>

                  {index !== items.length - 1 && <Divider mt={3} />}
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>

        <Box borderTop="1px solid" borderColor="gray.200" px={4} py={2}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" color="gray.500">
              Page {page} of {Math.max(totalPages, 1)}
            </Text>
            <HStack spacing={2}>
              <Button size="xs" variant="outline" onClick={() => handlePageChange(page - 1)} isDisabled={page <= 1 || loading}>
                Prev
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                isDisabled={page >= totalPages || totalPages === 0 || loading}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        </Box>
      </PopoverContent>
    </Popover>
  );
});

export default NotificationPopover;
