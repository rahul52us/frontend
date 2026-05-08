"use client";

import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Divider,
  Box,
  Text,
  VStack,
  Icon,
  Portal,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  FaCog,
  FaPalette,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaHome,
  FaLock,
} from "react-icons/fa";
import stores from "../../../../../../store/stores";
import { authentication, dashboard, main } from "../../../../../../config/utils/routes";
import { useRouter, usePathname } from "next/navigation";
import { WEBSITE_TITLE } from "../../../../../../config/utils/variables";
import ChangePasswordModal from "./component/ChangePasswordModal";
import { dashboardPalette } from "../../../../dashboardPalette";

const HeaderProfile = observer(() => {
  const { auth: { doLogout } } = stores;
  const pathname = usePathname();
  const router = useRouter();
  const {
    auth: { user },
    themeStore: { setOpenThemeDrawer },
  } = stores;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reactive Theme Tokens
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cDangerSoft = useColorModeValue("red.50", "rgba(239, 107, 107, 0.10)");
  const cAvatarBorder = useColorModeValue("blue.200", "rgba(59, 130, 246, 0.28)");
  const shopLogoUrl =
    user?.company && typeof user.company === "object"
      ? user.company?.logo?.url
      : undefined;
  const hasCompany = Boolean(user?.company && typeof user.company === "object" && user.company?._id);
  const isBuyerOnlyUser = user?.type !== "seller" && !hasCompany;
  const menuAvatarSrc = shopLogoUrl || user?.pic?.url || undefined;
  const menuAvatarName =
    (user?.company && typeof user.company === "object" && user.company?.name) || user?.name;

  return user ? (
    <>
      <Menu closeOnSelect={false} placement="bottom-end" >
        <MenuButton
          as={IconButton}
          aria-label="User Menu"
          icon={
            <Avatar
              src={menuAvatarSrc}
              size="sm"
              borderRadius={10}
              name={menuAvatarName}
              border="1px solid"
              borderColor={cAvatarBorder}
            />
          }
          size="sm"
          variant="ghost"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
          _hover={{ bg: cSurfaceSoft }}
        />
        <Portal>
          <MenuList
            minWidth="220px"
            boxShadow="0 18px 38px rgba(0, 0, 0, 0.35)"
            borderRadius="2xl"
            zIndex={99}
            p={2}
            bg={cSurfaceAlt}
            border="1px solid"
            borderColor={cBorder}
            color={cText}
          >
            <VStack spacing={2}>
              <Box textAlign="center">
                <Avatar src={menuAvatarSrc} size="lg" name={menuAvatarName} border="1px solid" borderColor={cAvatarBorder} />
                <Text mt={2} fontWeight="bold" color={cText}>{user?.name}</Text>
                <Text mt={0.5} fontWeight="xl" fontSize="sm" cursor="pointer" color={cTextMuted}>
                  {WEBSITE_TITLE?.split('-').join(' ')}
                </Text>
              </Box>
              <Divider borderColor={cBorderStrong} />
              {user && pathname !== main.home && (
                <MenuItem onClick={() => router.push(main.home)} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
                  <FaHome style={{ marginRight: "8px" }} /> Home
                </MenuItem>
              )}
              <MenuItem onClick={() => router.push(dashboard.home)} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
                <FaCog style={{ marginRight: "8px" }} /> {isBuyerOnlyUser ? "Dashboard" : user?.company?.name}
              </MenuItem>
              <MenuItem onClick={onOpen} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
                <FaLock style={{ marginRight: "8px" }} /> Change Password
              </MenuItem>
              <MenuItem onClick={setOpenThemeDrawer} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
                <FaPalette style={{ marginRight: "8px" }} /> Customize Theme
              </MenuItem>
              <Divider borderColor={cBorderStrong} />
              <MenuItem
                onClick={() => {
                  doLogout();
                  router.push(authentication.login);
                }}
                bg="transparent"
                borderRadius="xl"
                _hover={{ bg: cDangerSoft }}
              >
                <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
              </MenuItem>
            </VStack>
          </MenuList>
        </Portal>
      </Menu>
      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
    </>
  ) : (
    <Menu closeOnSelect={false} placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label="User Menu"
        icon={<Avatar size="sm" borderRadius="full" />}
        size="sm"
        variant="ghost"
        bg={cSurfaceAlt}
        border="1px solid"
        borderColor={cBorder}
      />
      <Portal>
        <MenuList minWidth="220px" boxShadow="0 18px 38px rgba(0, 0, 0, 0.35)" borderRadius="2xl" zIndex={10} p={2} bg={cSurfaceAlt} border="1px solid" borderColor={cBorder} color={cText}>
          <VStack spacing={2}>
            <MenuItem onClick={() => router.push(authentication.login)} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
              <Icon as={FaUser} boxSize={6} mr={2} color={cAccent} />
              <Text>Login</Text>
            </MenuItem>
            <MenuItem onClick={() => router.push(authentication.createOrganisationStep1)} bg="transparent" borderRadius="xl" _hover={{ bg: cSurfaceSoft }}>
              <Icon as={FaKey} boxSize={6} mr={2} color={cAccent} />
              <Text>Create New Account</Text>
            </MenuItem>
          </VStack>
        </MenuList>
      </Portal>
    </Menu>
  );
});

export default HeaderProfile;
