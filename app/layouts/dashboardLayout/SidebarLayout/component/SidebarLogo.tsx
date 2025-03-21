"use client";

import { Box, Flex , Text, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import NextImage from "next/image";
import { headerHeight } from "../../../../component/config/utils/variable";
import stores from "../../../../store/stores";
import { dashboard } from "../../../../config/utils/routes";
import { useRouter } from "next/navigation";
import { WEBSITE_TITLE } from "../../../../config/utils/variables";

const SidebarLogo: React.FC = observer(() => {
  const router = useRouter()
  const {
    layout: { isCallapse },
    themeStore: { themeConfig },
  } = stores;

  return (
    <Flex
      bgColor={useColorModeValue(
        themeConfig.colors.custom.light.primary,
        themeConfig.colors.custom.dark.primary
      )}
      justifyContent={isCallapse ? "center" : undefined}
      flexDirection={isCallapse ? "column" : undefined}
      alignItems="center"
      height={headerHeight}
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
          <Text fontWeight={600} fontSize="lg">
            {`${WEBSITE_TITLE?.charAt(0).toUpperCase()}.${WEBSITE_TITLE?.slice(-1).toUpperCase()}`}
          </Text>
        ) : (
          <Flex alignItems="center" columnGap={4} maxW="100%" px={2} ml={3}>
            {/* Company Logo with fallback and dynamic sizing */}
            <Box display="none" position="relative" width={isCallapse ? "35px" : "50px"} height={isCallapse ? "35px" : "50px"}>
              <NextImage
                src={"/images/whiteLogo.png"}
                alt={WEBSITE_TITLE}
                fill
                style={{ objectFit: "contain", borderRadius: "50%" }}
              />
            </Box>
            {/* Truncated Company Name with Tooltip */}
            <Tooltip
              label={WEBSITE_TITLE}
              hasArrow
              isDisabled={false}
            >
              <Text
                textAlign="center"
                fontSize="lg"
                fontWeight="bold"
                noOfLines={1}
                isTruncated
              >
                {WEBSITE_TITLE}
              </Text>
            </Tooltip>
          </Flex>
        )}
      </Box>
    </Flex>
  );
});

export default SidebarLogo;
