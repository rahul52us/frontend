"use client";

import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  // keyframes,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { FaCheck, FaHome, FaKey, FaLock, FaPalette, FaSignOutAlt, FaThLarge, FaUser } from "react-icons/fa";
import { authentication, dashboard, main } from "../../../../../../config/utils/routes";
import stores from "../../../../../../store/stores";
import { ThemeModeSwitcher } from "../../../../../../theme/ThemeModeSwitcher";
import { dashboardPalette } from "../../../../dashboardPalette";
import ChangePasswordModal from "./component/ChangePasswordModal";
import { keyframes } from "@emotion/react";

/* ---------- animation ---------- */
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

/* ---------- tones for icon tiles ---------- */
type Tone = "blue" | "purple" | "orange" | "red" | "teal";
const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: "rgba(59, 130, 246, 0.14)", fg: "#3b82f6" },
  purple: { bg: "rgba(139, 92, 246, 0.14)", fg: "#8b5cf6" },
  orange: { bg: "rgba(249, 115, 22, 0.14)", fg: "#f97316" },
  red: { bg: "rgba(239, 68, 68, 0.14)", fg: "#ef4444" },
  teal: { bg: "rgba(20, 184, 166, 0.14)", fg: "#0d9488" },
};

/* ---------- preset brand theme colors ---------- */
const PRESET_THEME_COLORS = [
  { name: "Teal Brand", code: "#065F68" },
  { name: "Classic Blue", code: "#094a82" },
  { name: "Ocean Blue", code: "#007acc" },
  { name: "Emerald", code: "#10b981" },
  { name: "Amber Yellow", code: "#d97706" },
  { name: "Sunset Orange", code: "#ea580c" },
  { name: "Crimson Red", code: "#e11d48" },
  { name: "Royal Purple", code: "#7c3aed" },
];

/* ---------- quick action tile (icon on top, label below) ---------- */
type TileProps = {
  icon: IconType;
  label: string;
  tone: Tone;
  onClick: () => void;
  textColor: string;
  tileBg: string;
  hoverBg: string;
};

const Tile = ({ icon, label, tone, onClick, textColor, tileBg, hoverBg }: TileProps) => (
  <MenuItem
    onClick={onClick}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap={1.5}
    h="auto"
    py={2.5}
    px={1}
    borderRadius="16px"
    bg={tileBg}
    color={textColor}
    transition="all 0.15s ease"
    _hover={{ bg: hoverBg }}
    _focus={{ bg: hoverBg }}
    _active={{ transform: "scale(0.95)" }}
  >
    <Flex w="34px" h="34px" borderRadius="12px" bg={TONES[tone].bg} color={TONES[tone].fg} align="center" justify="center">
      <Icon as={icon} boxSize={3.5} />
    </Flex>
    <Text fontSize="11px" fontWeight="600" noOfLines={1} maxW="full" lineHeight="short">
      {label}
    </Text>
  </MenuItem>
);

/* ---------- slim row ---------- */
type RowProps = {
  icon: IconType;
  label: string;
  tone: Tone;
  onClick: () => void;
  textColor: string;
  hoverBg: string;
  danger?: boolean;
};

const Row = ({ icon, label, tone, onClick, textColor, hoverBg, danger }: RowProps) => (
  <MenuItem
    onClick={onClick}
    display="flex"
    alignItems="center"
    gap={2.5}
    px={2.5}
    py={2}
    borderRadius="14px"
    bg="transparent"
    color={danger ? TONES[tone].fg : textColor}
    transition="all 0.15s ease"
    _hover={{ bg: hoverBg }}
    _focus={{ bg: hoverBg }}
    _active={{ transform: "scale(0.98)" }}
  >
    <Flex w="28px" h="28px" borderRadius="10px" bg={TONES[tone].bg} color={TONES[tone].fg} align="center" justify="center" flexShrink={0}>
      <Icon as={icon} boxSize={3} />
    </Flex>
    <Text fontSize="sm" fontWeight="600">
      {label}
    </Text>
  </MenuItem>
);

/* ---------- main ---------- */
const HeaderProfile = observer(() => {
  const {
    auth: { user, doLogout },
    themeStore: { setOpenThemeDrawer, setThemeConfig },
  } = stores;
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Active theme color state
  const [activePrimaryColor, setActivePrimaryColor] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("vendor_primary_theme_color") ||
        localStorage.getItem("business_primary_theme_color") ||
        "#065F68"
      );
    }
    return "#065F68";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("vendor_primary_theme_color") ||
        localStorage.getItem("business_primary_theme_color");
      if (stored) {
        setActivePrimaryColor(stored);
      }
    }
  }, []);

  const handleSelectThemeColor = (colorHex: string) => {
    setActivePrimaryColor(colorHex);
    if (typeof window !== "undefined") {
      localStorage.setItem("vendor_primary_theme_color", colorHex);
      localStorage.setItem("business_primary_theme_color", colorHex);
      document.documentElement.style.setProperty("--color-primary", colorHex);
      window.dispatchEvent(new Event("vendor_theme_color_changed"));
    }
    setThemeConfig("colors.custom.light.primary", colorHex);
    setThemeConfig("colors.custom.dark.primary", colorHex);
    // Notify companyStore if available
    try {
      const activeComp = (stores.companyStore as any)?.companyDetails;
      if (activeComp) {
        activeComp.primaryThemeColor = colorHex;
      }
    } catch {}
  };

  // Reactive Theme Tokens
  const cSurface = useColorModeValue("rgba(255,255,255,0.92)", "rgba(24,26,32,0.92)");
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cTileBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.200", dashboardPalette.borderStrong);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cDangerSoft = useColorModeValue("red.50", "rgba(239, 107, 107, 0.10)");
  const cAvatarBorder = useColorModeValue("blue.200", "rgba(59, 130, 246, 0.28)");
  const cShadow = useColorModeValue("0 14px 34px rgba(15, 23, 42, 0.16)", "0 14px 34px rgba(0, 0, 0, 0.5)");

  const company = user?.company && typeof user.company === "object" ? user.company : undefined;
  const hasCompany = Boolean(company?._id);
  const isBuyerOnlyUser = user?.type !== "seller" && !hasCompany;
  const menuAvatarSrc = company?.logo?.url || user?.pic?.url || undefined;
  const menuAvatarName = company?.name || user?.name;
  const dashboardLabel = isBuyerOnlyUser ? "Dashboard" : company?.name || "Dashboard";
  const showHome = pathname !== main.home;

  const handleLogout = () => {
    doLogout();
    router.push(authentication.login);
  };

  const tileProps = { textColor: cText, tileBg: cTileBg, hoverBg: cSurfaceSoft };
  const rowProps = { textColor: cText, hoverBg: cSurfaceSoft };

  return (
    <>
      <Menu placement="bottom-end" gutter={8} isLazy>
        <MenuButton
          as={IconButton}
          aria-label="User Menu"
          icon={
            user ? (
              <Avatar
                src={menuAvatarSrc}
                name={menuAvatarName}
                size="sm"
                borderRadius="full"
                border="2px solid"
                borderColor={cAvatarBorder}
              />
            ) : (
              <Avatar size="sm" borderRadius="full" />
            )
          }
          size="sm"
          variant="ghost"
          borderRadius="full"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={cBorder}
          transition="all 0.18s ease"
          _hover={{ bg: cSurfaceSoft, transform: "scale(1.05)" }}
          _active={{ transform: "scale(0.94)" }}
        />
        <Portal>
          <MenuList
            w={{ base: "232px", md: "270px" }}
            minW="0"
            p={2}
            zIndex={99}
            bg={cSurface}
            color={cText}
            backdropFilter="blur(18px) saturate(1.4)"
            border="1px solid"
            borderColor={cBorderStrong}
            borderRadius="22px"
            boxShadow={cShadow}
            sx={{ transformOrigin: "top right" }}
            animation={`${popIn} 0.2s cubic-bezier(0.2, 0.9, 0.3, 1) both`}
          >
            {user ? (
              <>
                {/* compact profile header */}
                <Flex align="center" gap={2.5} px={1.5} pt={0.5} pb={2.5}>
                  <Avatar
                    src={menuAvatarSrc}
                    name={menuAvatarName}
                    size="md"
                    borderRadius="16px"
                    border="2px solid"
                    borderColor={cAvatarBorder}
                  />
                  <Box minW={0} flex="1">
                    <Text fontWeight="800" fontSize="sm" noOfLines={1}>
                      {user?.name}
                    </Text>
                    <Flex align="center" gap={1.5} mt={0.5}>
                      <Badge
                        colorScheme={isBuyerOnlyUser ? "blue" : "purple"}
                        borderRadius="full"
                        px={2}
                        fontSize="9px"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        {isBuyerOnlyUser ? "Buyer" : "Seller"}
                      </Badge>
                      {company?.name && (
                        <Text fontSize="11px" color={cTextMuted} noOfLines={1}>
                          {company.name}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Flex>

                {/* quick actions */}
                <SimpleGrid columns={showHome ? 3 : 2} spacing={1.5}>
                  {showHome && (
                    <Tile {...tileProps} icon={FaHome} label="Home" tone="blue" onClick={() => router.push(main.home)} />
                  )}
                  <Tile
                    {...tileProps}
                    icon={FaThLarge}
                    label={dashboardLabel}
                    tone="purple"
                    onClick={() => router.push(dashboard.home)}
                  />
                  <Tile {...tileProps} icon={FaLock} label="Password" tone="orange" onClick={onOpen} />
                </SimpleGrid>

                {/* theme mode */}
                <Box mt={1.5} px={2.5} py={2} borderRadius="16px" bg={cTileBg}>
                  <Text
                    fontSize="9px"
                    fontWeight="700"
                    color={cTextMuted}
                    mb={1.5}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Theme Mode
                  </Text>
                  <ThemeModeSwitcher />
                </Box>

                {/* color theme palette */}
                <Box mt={1.5} px={2.5} py={2} borderRadius="16px" bg={cTileBg}>
                  <Flex align="center" justify="space-between" mb={1.5}>
                    <Text
                      fontSize="9px"
                      fontWeight="700"
                      color={cTextMuted}
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Theme Color
                    </Text>
                    <Box
                      as="button"
                      onClick={setOpenThemeDrawer}
                      fontSize="10px"
                      fontWeight="600"
                      color="blue.400"
                      _hover={{ textDecoration: "underline" }}
                    >
                      More
                    </Box>
                  </Flex>
                  <SimpleGrid columns={4} spacing={1.5}>
                    {PRESET_THEME_COLORS.map((item) => {
                      const isSelected =
                        activePrimaryColor.toLowerCase() === item.code.toLowerCase();
                      return (
                        <Tooltip key={item.code} label={item.name} fontSize="10px" hasArrow>
                          <Box
                            as="button"
                            onClick={() => handleSelectThemeColor(item.code)}
                            w="100%"
                            h="26px"
                            borderRadius="8px"
                            bg={item.code}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            border={isSelected ? "2px solid white" : "1px solid rgba(0,0,0,0.15)"}
                            boxShadow={
                              isSelected
                                ? `0 0 0 2px ${item.code}, 0 2px 6px rgba(0,0,0,0.25)`
                                : "none"
                            }
                            transition="all 0.15s ease"
                            _hover={{ transform: "scale(1.08)" }}
                          >
                            {isSelected && <FaCheck size={10} color="white" />}
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </SimpleGrid>
                </Box>

                {/* customize theme drawer trigger */}
                <Box mt={1.5}>
                  <Row
                    {...rowProps}
                    icon={FaPalette}
                    label="Customize Theme"
                    tone="teal"
                    onClick={setOpenThemeDrawer}
                  />
                </Box>

                {/* logout */}
                <Box mt={1.5}>
                  <Row
                    {...rowProps}
                    hoverBg={cDangerSoft}
                    icon={FaSignOutAlt}
                    label="Logout"
                    tone="red"
                    danger
                    onClick={handleLogout}
                  />
                </Box>
              </>
            ) : (
              <>
                <Row {...rowProps} icon={FaUser} label="Login" tone="blue" onClick={() => router.push(authentication.login)} />
                <Row
                  {...rowProps}
                  icon={FaKey}
                  label="Create New Account"
                  tone="purple"
                  onClick={() => router.push(authentication.createOrganisationStep1)}
                />
              </>
            )}
          </MenuList>
        </Portal>
      </Menu>

      {user && <ChangePasswordModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
});

export default HeaderProfile;