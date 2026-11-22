"use client";

import { Box, Flex, IconButton, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaBars } from "react-icons/fa";
import HeaderNotification from "./HeaderNotification/HeaderNotification";
import HeaderProfile from "./HeaderProfile/HeaderProfile";
import HeaderThemeSwitch from "./HeaderThemeSwitch/HeaderThemeSwitch";
import stores from "../../../../../store/stores";

const HeaderNavbar = observer(() => {
  const {
    layout: { setOpenMobileSideDrawer },
  } = stores;
  const [isLargerThan1020] = useMediaQuery("(min-width: 1024px)");

  const iconBtnBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const iconBtnHoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const iconBtnColor = useColorModeValue("gray.700", "gray.200");
  const iconBtnBorder = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.08)");

  return (
    <Flex
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      width="auto"
      gap={{ base: 2, md: 3 }}
      flexShrink={0}
    >
      <Box display={{ base: "none", md: "block" }}>
        <HeaderThemeSwitch />
      </Box>
      <HeaderNotification />
      <HeaderProfile />

      {!isLargerThan1020 && (
        <IconButton
          aria-label="Open navigation"
          fontSize="md"
          w="38px"
          h="38px"
          minW="38px"
          isRound
          bg={iconBtnBg}
          color={iconBtnColor}
          border="1px solid"
          borderColor={iconBtnBorder}
          _hover={{
            bg: iconBtnHoverBg,
            color: "var(--color-primary, #065F68)",
            transform: "scale(1.05)",
          }}
          _active={{ bg: iconBtnHoverBg, transform: "scale(0.96)" }}
          onClick={() => setOpenMobileSideDrawer(true)}
          icon={<FaBars />}
          transition="all 0.2s ease"
        />
      )}
    </Flex>
  );
});

export default HeaderNavbar;
