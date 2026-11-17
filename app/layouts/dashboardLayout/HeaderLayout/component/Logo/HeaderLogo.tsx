"use client";

import { Flex, IconButton, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import stores from "../../../../../store/stores";
import SearchBar from "../HeaderNavbar/SearchBar/SearchBar";
import { dashboardPalette } from "../../../dashboardPalette";

const HeaderLogo = observer(() => {
  const isLargerThanLg = useBreakpointValue({ base: false, lg: true }) ?? false;

  const {
    layout: { openDashSidebarFun, isCallapse },
  } = stores;

  const toggleBtnBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const toggleBtnHoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const toggleBtnActiveBg = useColorModeValue("blackAlpha.200", "whiteAlpha.300");
  const toggleBtnColor = useColorModeValue("gray.700", "gray.200");
  const toggleBtnBorder = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.08)");

  return (
    <Flex width={{ base: "100%", md: "auto" }} minW={0} alignItems="center" gap={{ base: 2, md: 3 }} flexShrink={0}>
      {isLargerThanLg && (
        <Flex alignItems="center" flexShrink={0}>
          <IconButton
            aria-label="Toggle sidebar"
            icon={
              isCallapse ? (
                <BiRightArrowAlt fontSize={21} />
              ) : (
                <BiLeftArrowAlt fontSize={21} />
              )
            }
            onClick={() => openDashSidebarFun()}
            isRound
            bg={toggleBtnBg}
            color={toggleBtnColor}
            border="1px solid"
            borderColor={toggleBtnBorder}
            w="38px"
            h="38px"
            minW="38px"
            _hover={{
              bg: toggleBtnHoverBg,
              color: "var(--color-primary, #065F68)",
              transform: "scale(1.05)",
            }}
            _active={{
              bg: toggleBtnActiveBg,
              transform: "scale(0.96)",
            }}
            transition="all 0.2s ease"
          />
        </Flex>
      )}
      <SearchBar />
    </Flex>
  );
});

export default HeaderLogo;
