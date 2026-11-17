"use client";

import { Flex, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import HeaderNavbar from "./component/HeaderNavbar/HeaderNavbar";
import HeaderLogo from "./component/Logo/HeaderLogo";
import { headerHeight } from "../../../component/config/utils/variable";
import { dashboardPalette } from "../dashboardPalette";

const HeaderLayout = observer(() => {
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;

  const bgHeader = useColorModeValue(
    "#FFFFFF",
    "#0B1120"
  );
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.8)",
    "rgba(255, 255, 255, 0.08)"
  );
  const boxShadow = useColorModeValue(
    "0 10px 40px -10px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02)",
    "0 10px 40px -10px rgba(0,0,0,0.5)"
  );
  const textColor = useColorModeValue("gray.800", dashboardPalette.text);

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      minH={{ base: "52px", md: headerHeight }}
      h={{ base: "52px", md: headerHeight }}
      px={{ base: 3, md: 5 }}
      py={{ base: 2, md: 3 }}
      gap={{ base: 3, md: 4 }}
      bg={bgHeader}
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow={boxShadow}
      color={textColor}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex flex="1" minW={0} align="center" gap={{ base: 2, md: 3 }}>
        <HeaderLogo />
      </Flex>
      <HeaderNavbar />
    </Flex>
  );
});

export default HeaderLayout;
