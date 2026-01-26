import { Avatar, Box, Button, Card, CardBody, Flex, Grid, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaBox, FaHome, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa";
import { AddressesSection } from "./AddressSection/AddressSection";
// import { OrdersSection } from "./OrderSection/OrderSection";
import OrdersSection from "./OrderSection/OrderSection";
import { ProfileSection } from "./ProfileSection/ProfileSection";
import SidebarButton from "./SidebarButton/SidebarButton";
import { WalletSection } from "./WalletSection/WalletSection";
import stores from "../../../store/stores";

const AccountPage = observer(() => {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = searchParams?.get('tab') || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const accentColor = useColorModeValue("purple.500", "purple.200");
  const activeBorder = `2px solid ${useColorModeValue("purple.500", "purple.200")}`;

  const { user: authUser, logout } = stores.auth;

  const user = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    avatar: authUser?.avatar || "/placeholder.svg?height=80&width=80",
  };

  const menuItems = [
    { label: "Profile Details", icon: <FaUser size="18px" />, tab: "profile" },
    { label: "Orders", icon: <FaBox size="18px" />, tab: "orders" },
    { label: "Addresses", icon: <FaHome size="18px" />, tab: "addresses" },
    { label: "Wallet", icon: <FaWallet size="18px" />, tab: "wallet" },
  ];

  return (
    <Box maxW="container.xl" mx="auto" py={12} px={4} bg={useColorModeValue("gray.50", "gray.800")}>
      <Grid templateColumns={{ base: "1fr", md: "320px 1fr" }} gap={8}>
        {/* Sidebar */}
        <VStack spacing={6} align="stretch" position={'sticky'} top={44} h={'fit-content'}>
          <Card borderRadius="2xl" boxShadow="md">
            <CardBody>
              <Flex align="center" gap={4}>
                <Avatar
                  name={user.name}
                  src={user.avatar || "/placeholder.svg"}
                  size="lg"
                  border={activeBorder}
                  p={0.5}
                  bg="white"
                />
                <Box>
                  <Text fontWeight="bold" fontSize="lg" letterSpacing="wide">
                    {user.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {user.phone}
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>

          <Card borderRadius="2xl" boxShadow="lg" py={2}>
            <VStack spacing={1} align="stretch" p={2}>
              {menuItems.map(({ label, icon, tab }) => (
                <SidebarButton
                  key={tab}
                  label={label}
                  icon={icon}
                  isActive={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  color={accentColor}
                />
              ))}

              {/* Logout button without a divider */}
              <Button
                variant="ghost"
                justifyContent="flex-start"
                h={14}
                borderRadius="lg"
                color="red.500"
                _hover={{ color: "red.600", bg: "red.50" }}
                leftIcon={<FaSignOutAlt size="18px" />}
                fontWeight={600}
                transition="all 0.2s"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </VStack>
          </Card>
        </VStack>

        {/* Main Content */}
        <Card borderRadius="2xl" boxShadow="lg" bg={useColorModeValue("white", "gray.700")}>
          <CardBody p={8}>
            {activeTab === "profile" && <ProfileSection user={user} />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "addresses" && <AddressesSection />}
            {activeTab === "wallet" && <WalletSection />}
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
});

export default AccountPage;