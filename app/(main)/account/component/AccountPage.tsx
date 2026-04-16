import { Avatar, Box, Button, Card, CardBody, Flex, Grid, Text, VStack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FaBox, FaChartBar, FaHome, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa";
import { AddressesSection } from "./AddressSection/AddressSection";
// import { OrdersSection } from "./OrderSection/OrderSection";
import OrdersSection from "./OrderSection/OrderSection";
import { ProfileSection } from "./ProfileSection/ProfileSection";
import SidebarButton from "./SidebarButton/SidebarButton";
import { WalletSection } from "./WalletSection/WalletSection";
import BuyerDashboard from "./BuyerDashboard/BuyerDashboard";
import stores from "../../../store/stores";

const AccountPage = observer(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || "details";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams?.get('tab') || "details";
    setActiveTab(tab);
  }, [searchParams]);
  const accentColor = useColorModeValue("purple.500", "purple.200");
  const activeBorder = `2px solid ${useColorModeValue("purple.500", "purple.200")}`;
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();

  const { user: authUser, logout } = stores.auth;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const user = {
    ...authUser,
    name: authUser?.name || "User",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    avatar: authUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'User')}&background=6B46C1&color=fff&size=128`,
  };

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`);
  };

  const menuItems = [
    { label: "Profile Details", icon: <FaUser size="18px" />, tab: "details" },
    { label: "Dashboard", icon: <FaChartBar size="18px" />, tab: "dashboard" },
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
                  onClick={() => handleTabChange(tab)}
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
                onClick={onLogoutOpen}
              >
                Logout
              </Button>
            </VStack>
          </Card>
        </VStack>

        {/* Main Content */}
        <Card borderRadius="2xl" boxShadow="lg" bg={useColorModeValue("white", "gray.700")}>
          <CardBody p={8}>
            {activeTab === "details" && <ProfileSection user={user} />}
            {activeTab === "dashboard" && <BuyerDashboard />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "addresses" && <AddressesSection />}
            {activeTab === "wallet" && <WalletSection />}
          </CardBody>
        </Card>
      </Grid>

      <ConfirmationModal
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonProps={{ colorScheme: "red" }}
      />
    </Box>
  );
});

export default AccountPage;