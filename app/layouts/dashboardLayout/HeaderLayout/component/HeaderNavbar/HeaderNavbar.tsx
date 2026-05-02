"use client"; // Add this for client-side component in Next.js

import { Flex, IconButton, useColorModeValue, useMediaQuery } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import HeaderProfile from "./HeaderProfile/HeaderProfile";
import HeaderNotification from "./HeaderNotification/HeaderNotification";
import HeaderThemeSwitch from "./HeaderThemeSwitch/HeaderThemeSwitch";
// import HeaderChatMessage from "./HeaderChatMessage/HeaderChatMessage";
// import CartContainer from "./CartContainer/CartContainer";
import stores from "../../../../../store/stores";
import { dashboardPalette } from "../../../dashboardPalette";

const HeaderNavbar = observer(() => {
  const {
    layout: { setOpenMobileSideDrawer },
  } = stores;
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");

  // Theme-aware tokens
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);

  return (
    <Flex
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      width={isLargerThan1020 ? "auto" : "10%"}
      gap={3}
      color={cText}
    >
      {isLargerThan1020 ? (
        <>
          <HeaderThemeSwitch />
          <HeaderNotification />
          <HeaderProfile />
        </>
      ) : (
        <IconButton
          aria-label="Open Sidebar"
          fontSize="xl"
          bg={cSurfaceAlt}
          color={cText}
          border="1px solid"
          borderColor={cBorder}
          _hover={{ color: cAccentStrong, bg: cSurfaceSoft }}
          _active={{ bg: cSurfaceSoft }}
          icon={
            <FaBars
              cursor="pointer"
              onClick={() => setOpenMobileSideDrawer(true)}
            />
          }
          borderRadius="12px"
        />
      )}
    </Flex>
  );
});

export default HeaderNavbar;
