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
      width={isLargerThan1020 ? "8%" : "10%"}
    >
      {isLargerThan1020 ? (
        <>
          {/* <HeaderLanguageSwitch /> */}
          <HeaderThemeSwitch />
          {/* <HeaderChatMessage />
          <HeaderNotification />
          <CartContainer /> */}
          <HeaderProfile />
        </>
      ) : (
        <IconButton
          aria-label="Arrow"
          fontSize="xl"
          _hover={{ color: "blue.500", bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
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