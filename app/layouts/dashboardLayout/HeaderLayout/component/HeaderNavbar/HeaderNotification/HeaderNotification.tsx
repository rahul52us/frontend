import { BellIcon, CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
// import stores from "../../../../../store/stores";
// import { dashboardPalette } from "../../../../../layouts/dashboardLayout/dashboardPalette";
import { formatDistanceToNow } from "date-fns";
import stores from "../../../../../../store/stores";
import { dashboardPalette } from "../../../../dashboardPalette";

type HeaderNotificationProps = {
  buttonVariant?: "round" | "mobileSquare";
  badgeVariant?: "count" | "dot";
};

const HeaderNotification = observer(({
  buttonVariant = "round",
  badgeVariant = "count",
}: HeaderNotificationProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("All");

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
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cAccentGlow = useColorModeValue("rgba(37, 99, 235, 0.1)", dashboardPalette.accentGlow);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const isMobileSquare = buttonVariant === "mobileSquare";

  const handleOpen = async () => {
    setDropdownOpen(true);
    await fetchList({
      status: selectedItem === "Unread" ? "unread" : "all",
      page: 1,
      force: true,
    });
  };

  const setFilter = async (filter: string) => {
    setSelectedItem(filter);
    await fetchList({
      status: filter === "Unread" ? "unread" : "all",
      page: 1,
    });
  };

  const handleMarkRead = async (id: string) => {
    await markRead(id);
  };

  const renderTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderNotificationItem = (item: any, index: number) => (
    <MenuItem
      key={item._id}
      display="flex"
      alignItems="center"
      py={4}
      px={5}
      bg="transparent"
      _hover={{ bg: cSurfaceSoft }}
      transition="all 0.2s"
      onClick={() => handleMarkRead(item._id)}
    >
      <Box position="relative">
        <Avatar size="md" mr={4} border="2px solid" borderColor={cBorder} name={item.title} />
        {!item.isRead && (
          <Box 
            position="absolute" 
            top={0} 
            right={3} 
            boxSize="10px" 
            bg={cAccent} 
            borderRadius="full" 
            border="2px solid" 
            borderColor={cSurface} 
          />
        )}
      </Box>
      <Box flex={1}>
        <Text fontSize="sm" color={cText} lineHeight="1.4">
          <Text as="span" fontWeight="800" color={cAccent}>
            {item.title}
          </Text>{" "}
          <Text as="span" fontWeight="500">{item.message}</Text>
        </Text>
        <Flex align="center" mt={1} gap={2}>
          <Text fontSize="11px" fontWeight="600" color={cTextMuted}>
            {renderTime(item.createdAt)}
          </Text>
        </Flex>
      </Box>
    </MenuItem>
  );

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      mr={isMobileSquare ? 0 : 2}
      zIndex={999}
    >
      <Menu isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} placement="bottom-end">
        <MenuButton
          as={IconButton}
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
            transform: isMobileSquare ? "none" : "rotate(15deg)"
          }}
          _active={{ bg: cSurfaceSoft }}
          aria-label="notifications"
          onClick={handleOpen}
          transition="all 0.2s"
          border="1px solid"
          borderColor={cBorder}
          boxSize={isMobileSquare ? "40px" : undefined}
          minW={isMobileSquare ? "40px" : undefined}
        />
        {unreadCount > 0 && (
          <Badge
            bg={cDanger}
            color="white"
            borderRadius="full"
            position="absolute"
            top={isMobileSquare ? "7px" : "-2px"}
            right={isMobileSquare ? "7px" : "-2px"}
            boxSize={badgeVariant === "dot" ? "10px" : "18px"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={badgeVariant === "dot" ? "0px" : "10px"}
            fontWeight="800"
            border="2px solid"
            borderColor={cShell}
          >
            {badgeVariant === "dot" ? "" : unreadCount}
          </Badge>
        )}
        <Portal>
          <MenuList
            py={0}
            borderRadius="24px"
            width={{ base: "320px", md: "400px" }}
            bg={cSurface}
            border="1px solid"
            borderColor={cBorder}
            boxShadow={useColorModeValue(
              "0 12px 40px rgba(0,0,0,0.12)",
              "0 24px 60px rgba(0,0,0,0.45)"
            )}
            overflow="hidden"
            zIndex={1000}
          >
            <Flex
              p={5}
              align="center"
              justify="space-between"
              bg={cSurfaceAlt}
              borderBottom="1px solid"
              borderColor={cBorder}
            >
              <Text fontSize="lg" fontWeight="800" color={cText}>
                Notifications
              </Text>
              <Menu placement="bottom-end">
                <MenuButton 
                  as={Text} 
                  fontSize="xs" 
                  fontWeight="700" 
                  color={cAccent} 
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                >
                  {selectedItem} <ChevronDownIcon />
                </MenuButton>
                <MenuList 
                  minW="120px" 
                  borderRadius="16px" 
                  p={1} 
                  bg={cSurface}
                  borderColor={cBorder}
                  boxShadow="lg"
                >
                  {["All", "Unread", "Read"].map((item) => (
                    <MenuItem
                      key={item}
                      fontSize="xs"
                      fontWeight="700"
                      borderRadius="10px"
                      onClick={() => setFilter(item)}
                      _hover={{ bg: cSurfaceSoft }}
                      display="flex"
                      justifyContent="space-between"
                    >
                      {item} {selectedItem === item && <CheckIcon color={cAccent} />}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            
            <Tabs position="relative" variant="unstyled">
              <TabList px={4} pt={3} borderBottom="1px solid" borderColor={cBorder}>
                <Tab 
                  fontSize="xs" 
                  fontWeight="800" 
                  color={cTextMuted} 
                  _selected={{ color: cAccent }}
                  pb={3}
                  gap={2}
                >
                  Activity
                </Tab>
              </TabList>
              <TabIndicator 
                mt="-1px" 
                height="3px" 
                bg={cAccent} 
                borderRadius="full" 
              />
              
              <TabPanels maxH="400px" overflowY="auto" className="customScrollBar">
                <TabPanel p={0}>
                  {loading ? (
                    <Flex py={12} justify="center">
                      <Spinner color={cAccent} />
                    </Flex>
                  ) : items.length > 0 ? (
                    items.map((n: any, i: number) => renderNotificationItem(n, i))
                  ) : (
                    <Flex py={12} direction="column" align="center">
                      <Icon as={BellIcon} boxSize={10} color={cSurfaceSoft} mb={3} />
                      <Text fontSize="sm" fontWeight="700" color={cTextMuted}>
                        No notifications yet
                      </Text>
                    </Flex>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            <Box p={4} bg={cSurfaceAlt} textAlign="center" borderTop="1px solid" borderColor={cBorder}>
              <Text 
                fontSize="xs" 
                fontWeight="800" 
                color={cAccent} 
                cursor="pointer"
                onClick={markAllRead}
                _hover={{ textDecoration: "underline" }}
              >
                Mark all as read
              </Text>
            </Box>
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
});

export default HeaderNotification;
