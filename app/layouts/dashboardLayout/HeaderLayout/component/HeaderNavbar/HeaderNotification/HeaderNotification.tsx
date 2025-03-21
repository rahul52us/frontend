"use client"; // Add this for client-side component in Next.js

import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabIndicator,
  TabPanel,
  Image,
  Portal,
} from "@chakra-ui/react";
import { BellIcon, CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";

// Define the Notification interface
interface Notification {
  id: number;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  time: string;
  designation: string;
  read: boolean;
  type: string;
}

// Define props interface if needed in the future

const notifications: Notification[] = [
  {
    id: 1,
    userName: "Sara Salah",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    action: "raised issue on the",
    target: "Purchase Order No:PR-0003",
    time: "2m",
    designation: "Software Engineer",
    read: false,
    type: "inbox",
  },
  {
    id: 3,
    userName: "Jane Doe",
    userAvatar:
      "https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    action: "Liked your reply on",
    target: "Test with TDD",
    time: "1h",
    designation: "QA Engineer",
    read: false,
    type: "inbox",
  },
  {
    id: 4,
    userName: "Abigail Bennett",
    userAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80",
    action: "placed new Purchase Order",
    target: "",
    time: "3h",
    designation: "Designer",
    read: true,
    type: "team",
  },
  {
    id: 6,
    userName: "Emily Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    action: "placed new Purchase Order",
    target: "",
    time: "1h",
    designation: "Product Manager",
    read: true,
    type: "inbox",
  },
  {
    id: 7,
    userName: "Jessica Williams",
    userAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80",
    action: "placed new Purchase Order",
    target: "",
    time: "4h",
    designation: "Designer",
    read: true,
    type: "inbox",
  },
  {
    id: 8,
    userName: "David Jones",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    action: "raised issue on the",
    target: "Purchase Order No:PR-0005",
    time: "10m",
    designation: "Software Engineer",
    read: false,
    type: "inbox",
  },
  {
    id: 9,
    userName: "Patricia Miller",
    userAvatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    action: "placed new Purchase Order",
    target: "",
    time: "5h",
    designation: "Product Manager",
    read: true,
    type: "inbox",
  },
  {
    id: 10,
    userName: "Anna Davis",
    userAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80",
    action: "placed new Purchase Order",
    target: "",
    time: "7h",
    designation: "Designer",
    read: true,
    type: "team",
  },
];

const NotificationComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("All");

  const filterNotifications = (
    notifications: Notification[],
    type: string
  ): Notification[] => {
    if (selectedItem === "Unread") {
      return notifications.filter(
        (notification) => !notification.read && notification.type === type
      );
    } else if (selectedItem === "Read") {
      return notifications.filter(
        (notification) => notification.read && notification.type === type
      );
    } else {
      return notifications.filter((notification) => notification.type === type);
    }
  };

  const filteredInboxNotifications = filterNotifications(notifications, "inbox");
  const filteredTeamNotifications = filterNotifications(notifications, "team");

  const inboxCount = filteredInboxNotifications.length;
  const teamCount = filteredTeamNotifications.length;

  const handleModalClose = () => {
    setDropdownOpen(false);
    setSelectedItem("All");
  };

  const renderNotificationItem = (notification: Notification, index: number) => (
    <MenuItem
      key={index}
      display="flex"
      alignItems="center"
      py={3}
      px={{ base: 4, md: 5 }}
      borderBottom="1px solid"
      borderColor="gray.200"
      zIndex={999999}
    >
      <Avatar src={notification.userAvatar} size="md" mr={3} />
      <Box>
        <Text fontSize="sm">
          <Text as="span" fontWeight="bold" color="gray.700">
            {notification.userName}
          </Text>{" "}
          {notification.action}{" "}
          {notification.target && (
            <Text as="span" fontWeight="bold" color="gray.700">
              {notification.target}
            </Text>
          )}
          .
        </Text>
        <Text fontSize="sm" color="gray.500">
          {notification.time} {"  "} •
          <Text as="span" ml={2}>
            {notification.designation}
          </Text>
        </Text>
      </Box>
    </MenuItem>
  );

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      mr={1}
      zIndex={9999999999}
    >
      <Menu isOpen={dropdownOpen} onClose={handleModalClose}>
        <MenuButton
          as={IconButton}
          icon={<BellIcon />}
          isRound={true}
          position="relative"
          bg="transparent"
          variant="ghost"
          fontSize="2xl"
          color="white"
          _hover={{ color: "blue.500", bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
          aria-label="chat-message-icons"
          _focus={{ boxShadow: "outline" }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-1px"
          right="-1px"
          px={1.5}
        >
          {notifications.length}
        </Badge>
        <Portal>
          <MenuList
            py={0}
            borderRadius="10px"
            mx={1}
            width={{ base: "22rem", md: "24rem" }}
            zIndex={99999999}
          >
            <Flex
              p={2}
              gap="4"
              align="center"
              justify="space-between"
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="20px" fontWeight="600" px={2}>
                Notifications
              </Text>
              <Menu placement="bottom-end">
                <MenuButton>
                  <Text fontSize="16px">
                    {selectedItem} <ChevronDownIcon />{" "}
                  </Text>
                </MenuButton>
                <MenuList minW="8rem" fontSize="sm">
                  <MenuItem
                    justifyContent="space-between"
                    onClick={() => setSelectedItem("All")}
                    gap={6}
                  >
                    All {selectedItem === "All" && <CheckIcon />}
                  </MenuItem>
                  <MenuItem
                    justifyContent="space-between"
                    onClick={() => setSelectedItem("Unread")}
                    gap={6}
                  >
                    Unread {selectedItem === "Unread" && <CheckIcon />}
                  </MenuItem>
                  <MenuItem
                    justifyContent="space-between"
                    onClick={() => setSelectedItem("Read")}
                    gap={6}
                  >
                    Read {selectedItem === "Read" && <CheckIcon />}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Tabs position="relative" variant="unstyled" py={3}>
              <TabList px={2}>
                <Tab gap={2}>
                  <Text>Inbox</Text>
                  <Text px={1.5} bg="teal.100" borderRadius="8px">
                    {inboxCount}
                  </Text>
                </Tab>
                <Tab gap={2}>
                  <Text>Team</Text>
                  <Text px={1.5} bg="teal.100" borderRadius="5px">
                    {teamCount}
                  </Text>
                </Tab>
              </TabList>
              <TabIndicator height="4px" bg="teal.500" borderTopRadius="10px" />
              <TabPanels
                mt={1}
                borderTop="1px solid"
                borderColor="gray.200"
                h="18rem"
                overflowY="auto"
                className="customScrollBar"
              >
                <TabPanel py={2} px={0}>
                  {inboxCount > 0 ? (
                    filteredInboxNotifications.map((notification, index) =>
                      renderNotificationItem(notification, index)
                    )
                  ) : (
                    <Flex flexDirection="column" alignItems="center">
                      <Image src={""} w="300px" alt=""/>
                      <Text fontSize="lg" fontWeight="700">
                        No Notifications
                      </Text>
                    </Flex>
                  )}
                </TabPanel>
                <TabPanel py={2} px={0}>
                  {teamCount > 0 ? (
                    filteredTeamNotifications.map((notification, index) =>
                      renderNotificationItem(notification, index)
                    )
                  ) : (
                    <Flex flexDirection="column" alignItems="center">
                      <Image src={""} w="220px" alt=""/>
                      <Text fontSize="lg" fontWeight="700">
                        No Notifications
                      </Text>
                    </Flex>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MenuList>
        </Portal>
      </Menu>
    </Flex>
  );
};

export default NotificationComponent;