"use client"; // Add this for client-side component in Next.js

import { Box, Flex, HStack, IconButton, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import HeaderNavbar from "./component/HeaderNavbar/HeaderNavbar";
import HeaderLogo from "./component/Logo/HeaderLogo";
import { observer } from "mobx-react-lite";
import { headerHeight, headerPadding } from "../../../component/config/utils/variable";
import { dashboardPalette } from "../dashboardPalette";
import stores from "../../../store/stores";
import { FaSearch, FaStore, FaShieldAlt } from "react-icons/fa";
import HeaderNotification from "./component/HeaderNavbar/HeaderNotification/HeaderNotification";
import HeaderProfile from "./component/HeaderNavbar/HeaderProfile/HeaderProfile";
import { usePathname } from "next/navigation";

const HeaderLayout = observer(() => {
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const isLargerThan1020 = useBreakpointValue({ base: false, xl: true }) ?? false;
  const pathname = usePathname() || "";
  const {
    auth: { user },
  } = stores;

  const iconBg = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const iconHoverBg = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const iconBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const textPrimary = useColorModeValue("gray.800", dashboardPalette.text);
  const textMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);

  const normalizedRoles = Array.isArray(user?.role)
    ? user.role.filter(Boolean)
    : [user?.role].filter(Boolean);

  const isSuperAdmin =
    user?.type === "superAdmin" ||
    user?.role === "superAdmin" ||
    normalizedRoles.includes("superAdmin") ||
    pathname.startsWith("/dashboard/super-admin");

  const displayName = isSuperAdmin
    ? user?.name || "Super Admin"
    : (user?.company && typeof user.company === "object" ? user.company.name : null) ||
      user?.companyName ||
      "Seller Dashboard";

  if (isMobile) {
    return (
      <Flex align="center" justify="space-between" h={headerHeight} px={4}>
        <HStack spacing={3}>
          <Flex
            w="40px"
            h="40px"
            borderRadius="18px"
            bgGradient={
              isSuperAdmin
                ? "linear(135deg, #7C3AED 0%, #C026D3 100%)"
                : "linear(135deg, #5B6CFF 0%, #C44AE8 100%)"
            }
            align="center"
            justify="center"
            boxShadow="0 12px 28px rgba(91, 108, 255, 0.22)"
            color="white"
          >
            {isSuperAdmin ? <FaShieldAlt size={16} /> : <FaStore size={16} />}
          </Flex>
          <Box maxW="180px">
            <Text fontSize="11px" color={textMuted} fontWeight="600" lineHeight="1">
              {isSuperAdmin ? "Control Center" : "Welcome back"}
            </Text>
            <Text mt={1} fontSize="sm" color={textPrimary} fontWeight="800" lineHeight="1" noOfLines={1}>
              {displayName}
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2} align="center">
          <IconButton
            aria-label="Search dashboard"
            icon={<FaSearch size={15} />}
            bg={iconBg}
            color={textPrimary}
            border="1px solid"
            borderColor={iconBorder}
            borderRadius="14px"
            boxSize="40px"
            minW="40px"
            _hover={{ bg: iconHoverBg }}
            _active={{ bg: iconHoverBg }}
          />
          <HeaderNotification buttonVariant="mobileSquare" badgeVariant="dot" />
          <HeaderProfile />
        </HStack>
      </Flex>
    );
  }

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      height={headerHeight}
      padding={headerPadding}
      bg="transparent"
    >
      <Flex width={isLargerThan1020 ? "85%" : "95%"}>
        <HeaderLogo />
      </Flex>
      <HeaderNavbar />
    </Flex>
  );
});

export default HeaderLayout;
