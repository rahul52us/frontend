import { BellIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import stores from "../../../../../../store/stores";
import { dashboardPalette } from "../../../../dashboardPalette";

type HeaderNotificationProps = {
  buttonVariant?: "round" | "mobileSquare";
  badgeVariant?: "count" | "dot";
};

type FilterType = "All" | "Unread" | "Read";

const FILTERS: FilterType[] = ["All", "Unread", "Read"];

const HeaderNotification = observer(
  ({
    buttonVariant = "round",
    badgeVariant = "count",
  }: HeaderNotificationProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");

    const isMobile = useBreakpointValue({ base: true, md: false });
    const isMobileSquare = buttonVariant === "mobileSquare";

    const {
      notificationStore: {
        items,
        unreadCount,
        loading,
        fetchList,
        markRead,
        markAllRead,
      },
    } = stores;

    // Theme-aware tokens
    const cShell = useColorModeValue("white", dashboardPalette.shell);
    const cSurface = useColorModeValue("white", dashboardPalette.surface);
    const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
    const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
    const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
    const cText = useColorModeValue("gray.800", dashboardPalette.text);
    const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
    const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
    const cAccentGlow = useColorModeValue(
      "rgba(37, 99, 235, 0.06)",
      dashboardPalette.accentGlow
    );
    const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
    const cShadow = useColorModeValue(
      "0 16px 40px rgba(0, 0, 0, 0.12)",
      "0 24px 60px rgba(0, 0, 0, 0.5)"
    );

    const mapFilterToStatus = (filter: FilterType) => {
      if (filter === "Unread") return "unread";
      if (filter === "Read") return "read";
      return "all";
    };

    const handleOpen = async () => {
      setIsOpen(true);
      await fetchList({
        // status: mapFilterToStatus(selectedFilter),
        page: 1,
        force: true,
      });
    };

    const handleClose = () => setIsOpen(false);

    const handleFilterChange = async (filter: FilterType) => {
      setSelectedFilter(filter);
      await fetchList({
        // status: mapFilterToStatus(filter),
        page: 1,
      });
    };

    const handleMarkRead = async (id: string, isRead?: boolean) => {
      if (!isRead) {
        await markRead(id);
      }
    };

    const renderTime = (value?: string) => {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return formatDistanceToNow(date, { addSuffix: true });
    };

    const triggerButton = (
      <Box position="relative" display="inline-flex">
        <IconButton
          icon={<BellIcon />}
          isRound={!isMobileSquare}
          borderRadius={isMobileSquare ? "14px" : "full"}
          bg={cSurfaceAlt}
          variant="ghost"
          fontSize={isMobileSquare ? "lg" : "xl"}
          color={isMobileSquare ? cText : cTextMuted}
          _hover={{
            color: cAccent,
            bg: cSurfaceSoft,
            transform: isMobileSquare ? "none" : "rotate(12deg)",
          }}
          _active={{ bg: cSurfaceSoft }}
          aria-label="Notifications"
          onClick={handleOpen}
          transition="all 0.2s"
          border="1px solid"
          borderColor={cBorder}
          boxSize={isMobileSquare ? "40px" : undefined}
          minW={isMobileSquare ? "40px" : undefined}
        />
        {unreadCount > 0 && (
          <Badge
            pointerEvents="none"
            bg={cDanger}
            color="white"
            borderRadius="full"
            position="absolute"
            top={isMobileSquare ? "6px" : "-3px"}
            right={isMobileSquare ? "6px" : "-3px"}
            minW={badgeVariant === "dot" ? "10px" : "18px"}
            h={badgeVariant === "dot" ? "10px" : "18px"}
            px={badgeVariant === "dot" ? 0 : 1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={badgeVariant === "dot" ? "0px" : "10px"}
            fontWeight="800"
            border="2px solid"
            borderColor={cShell}
          >
            {badgeVariant === "dot" ? "" : unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Box>
    );

    const notificationContent = (
      <Flex direction="column" maxH={isMobile ? "82vh" : "520px"} bg={cSurface}>
        {/* Mobile Drag Handle */}
        {isMobile && (
          <Flex justify="center" pt={3} pb={1}>
            <Box w="36px" h="4px" borderRadius="full" bg={cBorder} />
          </Flex>
        )}

        {/* Header */}
        <Flex
          px={{ base: 4, md: 5 }}
          pt={isMobile ? 2 : 4}
          pb={3}
          align="center"
          justify="space-between"
        >
          <HStack spacing={2}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="800" color={cText}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Badge
                bg={cAccentGlow}
                color={cAccent}
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="11px"
                fontWeight="700"
              >
                {unreadCount} new
              </Badge>
            )}
          </HStack>

          {unreadCount > 0 && (
            <Button
              size="xs"
              variant="ghost"
              color={cAccent}
              leftIcon={<CheckIcon boxSize="10px" />}
              fontWeight="700"
              borderRadius="full"
              _hover={{ bg: cAccentGlow }}
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </Flex>

        {/* Segmented Filter Pills */}
        <Box px={{ base: 4, md: 5 }} pb={3} borderBottom="1px solid" borderColor={cBorder}>
          <HStack
            spacing={1}
            bg={cSurfaceAlt}
            p="4px"
            borderRadius="12px"
            border="1px solid"
            borderColor={cBorder}
          >
            {FILTERS.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <Button
                  key={filter}
                  flex={1}
                  size="xs"
                  h="30px"
                  borderRadius="8px"
                  fontWeight={isActive ? "700" : "600"}
                  bg={isActive ? cSurface : "transparent"}
                  color={isActive ? cText : cTextMuted}
                  boxShadow={isActive ? "xs" : "none"}
                  _hover={{
                    bg: isActive ? cSurface : cSurfaceSoft,
                    color: cText,
                  }}
                  transition="all 0.15s"
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter}
                </Button>
              );
            })}
          </HStack>
        </Box>

        {/* Notification List */}
        <Box
          flex={1}
          overflowY="auto"
          className="customScrollBar"
          px={{ base: 2, md: 3 }}
          py={2}
        >
          {loading ? (
            <Flex py={14} justify="center" align="center" direction="column" gap={3}>
              <Spinner color={cAccent} size="md" thickness="3px" />
              <Text fontSize="xs" color={cTextMuted} fontWeight="600">
                Loading notifications...
              </Text>
            </Flex>
          ) : items.length > 0 ? (
            <Flex direction="column" gap={1}>
              {items.map((item: any) => {
                const isUnread = !item.isRead;
                return (
                  <Flex
                    key={item._id}
                    role="button"
                    tabIndex={0}
                    align="flex-start"
                    gap={3}
                    p={3}
                    borderRadius="14px"
                    bg={isUnread ? cAccentGlow : "transparent"}
                    _hover={{ bg: cSurfaceSoft }}
                    _active={{ transform: "scale(0.99)" }}
                    transition="all 0.15s"
                    cursor="pointer"
                    onClick={() => handleMarkRead(item._id, item.isRead)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleMarkRead(item._id, item.isRead);
                      }
                    }}
                  >
                    <Avatar
                      size="sm"
                      mt="2px"
                      name={item.title}
                      border="1px solid"
                      borderColor={cBorder}
                    />

                    <Box flex={1} minW={0}>
                      <Flex justify="space-between" align="flex-start" gap={2}>
                        <Text
                          fontSize="sm"
                          fontWeight={isUnread ? "700" : "600"}
                          color={cText}
                          noOfLines={1}
                        >
                          {item.title}
                        </Text>
                        {isUnread && (
                          <Box
                            flexShrink={0}
                            mt="6px"
                            boxSize="8px"
                            borderRadius="full"
                            bg={cAccent}
                          />
                        )}
                      </Flex>

                      <Text
                        fontSize="xs"
                        color={cTextMuted}
                        lineHeight="1.45"
                        mt={0.5}
                        noOfLines={2}
                      >
                        {item.message}
                      </Text>

                      <Text
                        fontSize="11px"
                        fontWeight="600"
                        color={cTextMuted}
                        opacity={0.8}
                        mt={1.5}
                      >
                        {renderTime(item.createdAt)}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          ) : (
            <Flex py={14} px={4} direction="column" align="center" textAlign="center">
              <Flex
                boxSize="48px"
                borderRadius="full"
                bg={cSurfaceAlt}
                align="center"
                justify="center"
                mb={3}
              >
                <Icon as={BellIcon} boxSize={5} color={cTextMuted} />
              </Flex>
              <Text fontSize="sm" fontWeight="700" color={cText}>
                You&apos;re all caught up
              </Text>
              <Text fontSize="xs" color={cTextMuted} mt={1}>
                No {selectedFilter !== "All" ? selectedFilter.toLowerCase() : ""} notifications to show.
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    );

    return (
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        mr={isMobileSquare ? 0 : 2}
        zIndex={999}
      >
        {isMobile ? (
          <>
            {triggerButton}
            <Drawer isOpen={isOpen} placement="bottom" onClose={handleClose}>
              <DrawerOverlay backdropFilter="blur(4px)" bg="blackAlpha.500" />
              <DrawerContent
                borderTopRadius="24px"
                overflow="hidden"
                bg={cSurface}
                borderTop="1px solid"
                borderColor={cBorder}
              >
                <DrawerBody p={0}>{notificationContent}</DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Popover
            isOpen={isOpen}
            onClose={handleClose}
            placement="bottom-end"
            isLazy
          >
            <PopoverTrigger>{triggerButton}</PopoverTrigger>
            <Portal>
              <PopoverContent
                w="400px"
                borderRadius="20px"
                bg={cSurface}
                border="1px solid"
                borderColor={cBorder}
                boxShadow={cShadow}
                overflow="hidden"
                _focus={{ outline: "none" }}
                zIndex={1000}
              >
                <PopoverBody p={0}>{notificationContent}</PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        )}
      </Flex>
    );
  }
);

export default HeaderNotification;