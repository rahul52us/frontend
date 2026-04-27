"use client"; // Add this for client-side component in Next.js

import { Flex, IconButton, useMediaQuery } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import HeaderProfile from "./HeaderProfile/HeaderProfile";
// import HeaderNotification from "./HeaderNotification/HeaderNotification";
import HeaderThemeSwitch from "./HeaderThemeSwitch/HeaderThemeSwitch";
// import HeaderChatMessage from "./HeaderChatMessage/HeaderChatMessage";
// import CartContainer from "./CartContainer/CartContainer";
import stores from "../../../../../store/stores";
import NotificationBell from "../../../../../layouts/mainLayout/component/Header/Notification/NotificationBell";
import { dashboardPalette } from "../../../dashboardPalette";

const HeaderNavbar = observer(() => {
  const {
    layout: { setOpenMobileSideDrawer },
  } = stores;
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");

  return (
    <Flex
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      width={isLargerThan1020 ? "auto" : "10%"}
      gap={2}
      color={dashboardPalette.text}
    >
      {isLargerThan1020 ? (
        <>
          {/* <HeaderLanguageSwitch /> */}
          <HeaderThemeSwitch />
          <NotificationBell />
          {/* <HeaderChatMessage />
          <HeaderNotification />
          <CartContainer /> */}
          <HeaderProfile />
        </>
      ) : (
        <IconButton
          aria-label="Arrow"
          fontSize="xl"
          bg={dashboardPalette.surfaceAlt}
          color={dashboardPalette.text}
          border="1px solid"
          borderColor={dashboardPalette.border}
          _hover={{ color: dashboardPalette.accentStrong, bg: dashboardPalette.surfaceSoft }}
          _active={{ bg: dashboardPalette.surface }}
          icon={
            <FaBars
              cursor="pointer"
              onClick={() => setOpenMobileSideDrawer(true)}
            />
          }
        />
      )}
    </Flex>
  );
});

export default HeaderNavbar;
