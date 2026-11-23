import React, { useRef } from "react";
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import DrawerLoader from "../Loader/DrawerLoader";
import useRegisterOverlay from "../../../hooks/useRegisterOverlay";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

export interface CustomDrawerProps {
  // Visibility & dismissal
  open?: boolean;
  isOpen?: boolean;
  close?: () => void | any;
  onClose?: () => void | any;

  // Header content
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  categoryTag?: React.ReactNode;
  icon?: any;
  headerActions?: React.ReactNode;

  // Sizing & Placement
  size?: string;
  width?: any;
  placement?: "top" | "right" | "bottom" | "left";

  // Slots
  subHeader?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;

  // State & Loading
  loading?: boolean;

  // Decorators
  showDivider?: boolean;
  showDragHandle?: boolean;

  // Form / container wrapper (e.g. Formik's Form)
  contentWrapper?: React.ComponentType<any>;
  contentWrapperProps?: any;

  // Pass-through Chakra props
  props?: any;
  overlayProps?: any;
  contentProps?: any;
  headerProps?: any;
  bodyProps?: any;
  footerProps?: any;
  subHeaderProps?: any;
  closeButtonProps?: any;
  finalFocusRef?: any;
}

const CustomDrawer: React.FC<CustomDrawerProps> = observer(({
  title,
  subtitle,
  categoryTag,
  icon,
  headerActions,
  open,
  isOpen,
  close,
  onClose,
  size,
  width,
  placement,
  subHeader,
  footer,
  children,
  loading = false,
  showDivider = true,
  showDragHandle = true,
  contentWrapper,
  contentWrapperProps,
  props,
  overlayProps,
  contentProps,
  headerProps,
  bodyProps,
  footerProps,
  subHeaderProps,
  closeButtonProps,
  finalFocusRef,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useBreakpointValue({ base: false, md: true }, { ssr: false, fallback: "md" });

  const isDrawerOpen = Boolean(isOpen !== undefined ? isOpen : open);
  const resolvedPlacement = placement || (isDesktop ? "right" : "bottom");

  const overlayBg = useColorModeValue("rgba(15, 23, 42, 0.45)", "rgba(2, 6, 23, 0.75)");
  const shell = dashboardPalette.shell;
  const surface = dashboardPalette.surface;
  const surfaceMuted = dashboardPalette.surfaceAlt;
  const border = dashboardPalette.border;
  const borderStrong = dashboardPalette.borderStrong;
  const text = dashboardPalette.text;
  const textMuted = dashboardPalette.textMuted;
  const accentStrong = dashboardPalette.accentStrong;

  const sheetShadow = useColorModeValue(
    "0 28px 60px rgba(6, 95, 104, 0.16), 0 10px 24px rgba(15, 23, 42, 0.08)",
    "0 40px 72px rgba(2, 6, 23, 0.45)"
  );

  const heroGradient = useColorModeValue(
    "linear-gradient(135deg, var(--color-primary, #065F68) 0%, var(--color-secondary, #2A8A94) 100%)",
    "linear-gradient(135deg, var(--color-primary-hover, #055159) 0%, var(--color-primary, #065F68) 100%)"
  );

  const handleCloseDrawer = () => {
    if (onClose) {
      onClose();
    } else if (close) {
      close();
    }
  };

  // Register drawer for native back button dismissal on mobile devices
  useRegisterOverlay(isDrawerOpen, handleCloseDrawer, "custom_drawer");

  const getResolvedWidth = () => {
    if (width) return width;
    switch (size) {
      case "xs":
        return "340px";
      case "sm":
        return "420px";
      case "md":
        return "520px";
      case "lg":
        return "620px";
      case "xl":
        return "680px";
      case "2xl":
        return "760px";
      case "3xl":
        return "880px";
      case "full":
        return "100%";
      default:
        return "760px";
    }
  };

  const resolvedWidth = getResolvedWidth();

  // Container to optionally wrap children (e.g. Formik Form)
  const ContentContainer: any = contentWrapper || Flex;
  const containerDefaultProps = contentWrapper
    ? {
        style: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        ...contentWrapperProps,
      }
    : {
        direction: "column",
        h: "100%",
        overflow: "hidden",
        ...contentWrapperProps,
      };

  const hasHeaderContent = Boolean(
    title || subtitle || categoryTag || icon || headerActions
  );

  return (
    <Drawer
      isOpen={isDrawerOpen}
      placement={resolvedPlacement}
      onClose={handleCloseDrawer}
      size={size || (isDesktop ? "2xl" : "full")}
      finalFocusRef={finalFocusRef || drawerRef}
      trapFocus={false}
      blockScrollOnMount={false}
      preserveScrollBarGap
      {...props}
    >
      <DrawerOverlay
        bg={overlayBg}
        backdropFilter="blur(4px)"
        {...overlayProps}
      />

      <DrawerContent
        bg={shell}
        borderRadius={
          resolvedPlacement === "bottom"
            ? { base: "28px 28px 0 0", md: "28px 28px 0 0" }
            : { base: "28px 28px 0 0", md: "32px 0 0 32px" }
        }
        borderWidth="1px"
        borderColor={border}
        boxShadow={{ base: "none", md: sheetShadow }}
        overflow="hidden"
        maxW={{ base: "100%", md: resolvedWidth }}
        w={{ base: "100%", md: resolvedWidth }}
        h={{ base: "100dvh", md: "100dvh" }}
        maxH={{ base: "100dvh", md: "100dvh" }}
        pt={{ base: "var(--safe-area-top, env(safe-area-inset-top, 0px))", md: 0 }}
        pb={{ base: "max(env(safe-area-inset-bottom, 0px), 8px)", md: 0 }}
        ml="auto"
        display="flex"
        flexDirection="column"
        {...contentProps}
      >
        <ContentContainer {...containerDefaultProps}>
          {/* HEADER */}
          {hasHeaderContent ? (
            <Box
              px={{ base: 4, md: 7 }} py={{ base: 4, md: 5.5 }}
              borderBottomWidth={showDivider ? "1px" : "0px"}
              borderBottomColor={border}
              bg={surface}
              position="relative"
              flexShrink={0}
              {...headerProps}
            >
              {/* Drag Handle on mobile */}
              {(!isDesktop || resolvedPlacement === "bottom") && showDragHandle && (
                <Box
                  mx="auto"
                  mb={3}
                  h="5px"
                  w="44px"
                  borderRadius="full"
                  bg={borderStrong}
                  opacity={0.7}
                />
              )}

              <HStack justify="space-between" align="center" spacing={3}>
                <HStack spacing={{ base: 3, md: 4 }} align="center" flex="1" minW={0}>
                  {icon && (
                    <Center
                      boxSize={{ base: "42px", md: "52px" }}
                      borderRadius={{ base: "16px", md: "18px" }}
                      bgGradient={heroGradient}
                      color="white"
                      boxShadow="0 10px 24px rgba(6, 95, 104, 0.22)"
                      flexShrink={0}
                    >
                      {React.isValidElement(icon) ? (
                        icon
                      ) : (
                        <Icon as={icon} boxSize={{ base: 4, md: 5 }} />
                      )}
                    </Center>
                  )}

                  <Box minW={0} flex="1">
                    {categoryTag && (
                      <Text
                        fontSize="11px"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.14em"
                        color={accentStrong}
                        lineHeight="1.2"
                      >
                        {categoryTag}
                      </Text>
                    )}

                    {title && (
                      typeof title === "string" ? (
                        <Text
                          mt={categoryTag ? 1 : 0}
                          fontSize={{ base: "xl", md: "22px" }}
                          fontWeight="700"
                          color={text}
                          lineHeight="1.2"
                        >
                          {title}
                        </Text>
                      ) : (
                        title
                      )
                    )}

                    {subtitle && (
                      typeof subtitle === "string" ? (
                        <Text
                          mt={1.5}
                          fontSize={{ base: "xs", md: "sm" }}
                          color={textMuted}
                          maxW="2xl"
                          lineHeight="1.4"
                        >
                          {subtitle}
                        </Text>
                      ) : (
                        subtitle
                      )
                    )}
                  </Box>
                </HStack>

                <HStack spacing={2} align="center" flexShrink={0}>
                  {headerActions}
                  <DrawerCloseButton
                    position="relative"
                    top="auto"
                    right="auto"
                    m="0"
                    w="38px"
                    h="38px"
                    minW="38px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="var(--merchant-text, #ffffff)"
                    bg="var(--merchant-surface-alt, rgba(255, 255, 255, 0.08))"
                    _hover={{
                      bg: "var(--merchant-surface-soft, rgba(255, 255, 255, 0.16))",
                      color: "#ffffff",
                    }}
                    onClick={handleCloseDrawer}
                    {...closeButtonProps}
                  />
                </HStack>
              </HStack>
            </Box>
          ) : (
            <DrawerCloseButton
              position="absolute"
              top={3}
              right={3}
              zIndex={10}
              borderRadius="full"
              size="md"
              color="var(--merchant-text, #ffffff)" bg="var(--merchant-surface-alt, rgba(255, 255, 255, 0.08))" _hover={{ bg: "var(--merchant-surface-soft, rgba(255, 255, 255, 0.16))", color: "#ffffff" }}
              onClick={handleCloseDrawer}
              {...closeButtonProps}
            />
          )}

          {/* SUBHEADER SLOT */}
          {subHeader && (
            <Box
              borderBottomWidth={showDivider ? "1px" : "0px"}
              borderBottomColor={border}
              bg={surface}
              flexShrink={0}
              {...subHeaderProps}
            >
              {subHeader}
            </Box>
          )}

          {/* BODY */}
          <DrawerBody
            px={{ base: 4, md: 5 }}
            py={{ base: 3, md: 5 }}
            bg={shell}
            overflowY="auto"
            flex="1"
            {...bodyProps}
          >
            <DrawerLoader loading={loading}>
              {children}
            </DrawerLoader>
          </DrawerBody>

          {/* FOOTER */}
          {footer && (
            <DrawerFooter
              px={{ base: 4, md: 5 }}
              py={{ base: 3.5, md: 4 }}
              borderTopWidth={showDivider ? "1px" : "0px"}
              borderTopColor={border}
              bg={surface}
              flexShrink={0}
              {...footerProps}
            >
              {footer}
            </DrawerFooter>
          )}
        </ContentContainer>
      </DrawerContent>
    </Drawer>
  );
});

export default CustomDrawer;
