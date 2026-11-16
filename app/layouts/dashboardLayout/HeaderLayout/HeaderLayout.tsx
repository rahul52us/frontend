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
      <Flex align="center" justify="space-between" h="52px" px={3}>
        <HStack spacing={2.5}>
          <Flex
            w="36px"
            h="36px"
            borderRadius="14px"
            bgGradient="linear(135deg, var(--color-primary, #065F68) 0%, var(--color-secondary, #2A8A94) 100%)"
            align="center"
            justify="center"
            boxShadow="0 6px 16px var(--color-primary-glow, rgba(6, 95, 104, 0.22))"
            color="white"
          >
            {isSuperAdmin ? <FaShieldAlt size={15} /> : <FaStore size={15} />}
          </Flex>
          <Box maxW="180px">
            <Text fontSize="10px" color={textMuted} fontWeight="600" lineHeight="1">
              {isSuperAdmin ? "Control Center" : "Welcome back"}
            </Text>
            <Text mt={0.5} fontSize="sm" color={textPrimary} fontWeight="800" lineHeight="1" noOfLines={1}>
              {displayName}
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2} align="center">
          <IconButton
            aria-label="Search dashboard"
            icon={<FaSearch size={14} />}
            bg={iconBg}
            color={textPrimary}
            border="1px solid"
            borderColor={iconBorder}
            borderRadius="12px"
            boxSize="36px"
            minW="36px"
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
      shadow={'sm'}
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
