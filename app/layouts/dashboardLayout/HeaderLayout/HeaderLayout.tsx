"use client"; // Add this for client-side component in Next.js

import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import HeaderNavbar from "./component/HeaderNavbar/HeaderNavbar";
import HeaderLogo from "./component/Logo/HeaderLogo";
import { observer } from "mobx-react-lite";
import { headerHeight, headerPadding } from "../../../component/config/utils/variable";
import { dashboardPalette } from "../dashboardPalette";


const HeaderLayout = observer(() => {
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");
  const borderColor = useColorModeValue("gray.200", dashboardPalette.border);

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      height={headerHeight}
      padding={headerPadding}
      bg="transparent"
      borderBottom="1px solid"
      borderBottomColor={borderColor}
    >
      <Flex width={isLargerThan1020 ? "85%" : "95%"}>
        <HeaderLogo />
      </Flex>
      <HeaderNavbar />
    </Flex>
  );
});

export default HeaderLayout;
