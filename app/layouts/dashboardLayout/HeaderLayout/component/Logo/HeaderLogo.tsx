"use client"; // Add this for client-side component in Next.js

import { Box, Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import stores from "../../../../../store/stores";
import SearchBar from "../HeaderNavbar/SearchBar/SearchBar";

const HeaderLogo = observer(() => {
  const isLargerThanXl = useBreakpointValue({ lg: true }) ?? false; // Added default value for SSR

  const {
    layout: { fullScreenMode, openDashSidebarFun, isCallapse },
  } = stores;

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" display="flex" ml={2}>
      {isLargerThanXl && (
        <Flex alignItems="center">
          <IconButton
            variant="ghost"
            aria-label="Arrow"
            fontSize="2xl"
            color="white"
            _hover={{ color: "blue.500", bg: "gray.700" }}
            _active={{ bg: "gray.800" }}
            icon={
              isCallapse ? (
                <BiRightArrowAlt fontSize={25} />
              ) : (
                <BiLeftArrowAlt fontSize={25} />
              )
            }
            size="lg"
            sx={{ marginRight: "1rem", marginTop: "2px" }}
            onClick={() => {
              openDashSidebarFun();
            }}
          />
          <IconButton
            icon={
              fullScreenMode ? (
                <BiRightArrowAlt fontSize={25} />
              ) : (
                <BiLeftArrowAlt fontSize={25} />
              )
            }
            onClick={() => openDashSidebarFun()}
            variant="ghost"
            size="lg"
            sx={{ marginRight: "1rem", marginTop: "2px" }}
            aria-label="open the drawer button"
            display="none"
          />
        </Flex>
      )}
      <SearchBar />
      <Box></Box>
      {/* <Input
        type="text"
        value=""
        placeholder="Search here"
        w={isLargerThanXl ? "90%" : "95%"}
      /> */}
    </Flex>
  );
});

export default HeaderLogo;