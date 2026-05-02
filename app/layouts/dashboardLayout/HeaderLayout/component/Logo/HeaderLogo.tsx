"use client"; // Add this for client-side component in Next.js

import { Box, Flex, IconButton, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import stores from "../../../../../store/stores";
import SearchBar from "../HeaderNavbar/SearchBar/SearchBar";
import { dashboardPalette } from "../../../dashboardPalette";

const HeaderLogo = observer(() => {
  const isLargerThanXl = useBreakpointValue({ lg: true }) ?? false;

  const {
    layout: { fullScreenMode, openDashSidebarFun, isCallapse },
  } = stores;

  // Theme-aware tokens
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" display="flex" ml={2}>
      {isLargerThanXl && (
        <Flex alignItems="center">
          <IconButton
            variant="ghost"
            aria-label="Collapse Sidebar"
            fontSize="2xl"
            color={cText}
            bg={cSurfaceAlt}
            border="1px solid"
            borderColor={cBorder}
            _hover={{ color: cAccent, bg: cSurfaceSoft }}
            _active={{ bg: cSurfaceSoft }}
            icon={
              isCallapse ? (
                <BiRightArrowAlt fontSize={25} />
              ) : (
                <BiLeftArrowAlt fontSize={25} />
              )
            }
            size="md"
            borderRadius="12px"
            sx={{ marginRight: "1.5rem" }}
            onClick={() => {
              openDashSidebarFun();
            }}
            transition="all 0.2s"
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