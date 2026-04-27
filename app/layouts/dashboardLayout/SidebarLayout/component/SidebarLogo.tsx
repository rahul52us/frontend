"use client";

import { Box, Flex , Text, Tooltip } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import NextImage from "next/image";
import { headerHeight } from "../../../../component/config/utils/variable";
import stores from "../../../../store/stores";
import { dashboard } from "../../../../config/utils/routes";
import { useRouter } from "next/navigation";
import { WEBSITE_TITLE } from "../../../../config/utils/variables";
import { dashboardPalette } from "../../dashboardPalette";

const SidebarLogo: React.FC = observer(() => {
  const router = useRouter()
  const {
    layout: { isCallapse },
  } = stores;
  const brandMark = WEBSITE_TITLE
    ? WEBSITE_TITLE
        .split(/[\s-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("·")
    : "B·A";

  return (
    <Flex
      bg={dashboardPalette.shell}
      justifyContent={isCallapse ? "center" : undefined}
      flexDirection={isCallapse ? "column" : undefined}
      alignItems="center"
      height={headerHeight}
      borderBottom="1px solid"
      borderBottomColor={dashboardPalette.border}
    >
      <Box
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999999}
        onClick={() => router.push(dashboard.home)}
      >
        {isCallapse ? (
          <Text fontWeight={700} fontSize="lg" color={dashboardPalette.accentStrong}>
            {brandMark}
          </Text>
        ) : (
          <Flex alignItems="center" columnGap={4} maxW="100%" px={4} ml={2}>
            <Box display="none" position="relative" width={isCallapse ? "35px" : "50px"} height={isCallapse ? "35px" : "50px"}>
              <NextImage
                src={"/images/whiteLogo.png"}
                alt={WEBSITE_TITLE}
                fill
                style={{ objectFit: "contain", borderRadius: "50%" }}
              />
            </Box>
            <Tooltip
              label={WEBSITE_TITLE}
              hasArrow
              isDisabled={false}
            >
              <Box>
                <Text
                  textAlign="left"
                  fontSize="32px"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  lineHeight="0.95"
                  letterSpacing="0.08em"
                  color={dashboardPalette.accentStrong}
                  noOfLines={1}
                  isTruncated
                >
                  {brandMark}
                </Text>
                <Text
                  mt={1}
                  fontSize="xs"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color={dashboardPalette.textSoft}
                  noOfLines={1}
                >
                  Merchant Studio
                </Text>
              </Box>
            </Tooltip>
          </Flex>
        )}
      </Box>
    </Flex>
  );
});

export default SidebarLogo;
