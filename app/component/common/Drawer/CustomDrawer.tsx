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
        borderRadius="0px"
        borderLeftWidth={{ base: "0px", md: "1px" }}
        borderColor={border}
        boxShadow={{ base: "none", md: sheetShadow }}
        overflow="hidden"
        maxW={{ base: "100%", md: resolvedWidth }}
        w={{ base: "100%", md: resolvedWidth }}
        h={{ base: "100dvh", md: "100dvh" }}
        maxH={{ base: "100dvh", md: "100dvh" }}
        pt={0}
        pb={0}
        ml="auto"
        display="flex"
        flexDirection="column"
        {...contentProps}
      >
        <ContentContainer {...containerDefaultProps}>
          {/* HEADER */}
          {hasHeaderContent ? (
            <Box
              px={{ base: 4, md: 6 }}
              pt={{ base: "calc(12px + var(--safe-area-top, env(safe-area-inset-top, 0px)))", md: 4 }}
              pb={{ base: 3, md: 4 }}
              borderBottomWidth={showDivider ? "1px" : "0px"}
              borderBottomColor={border}
              bg={useColorModeValue("white", "var(--color-surface, #0B1120)")}
              position="relative"
              flexShrink={0}
              {...headerProps}
            >
              {/* Drag Handle on mobile */}
              {(!isDesktop || resolvedPlacement === "bottom") && showDragHandle && (
                <Box
                  mx="auto"
                  mb={2.5}
                  h="4px"
                  w="36px"
                  borderRadius="full"
                  bg={borderStrong}
                  opacity={0.6}
                />
              )}

              <Flex justify="space-between" align="center" gap={3}>
                <HStack spacing={{ base: 2.5, md: 3 }} align="center" flex="1" minW={0}>
                  {icon ? (
                    <Center
                      boxSize={{ base: "38px", md: "42px" }}
                      borderRadius="12px"
                      bg="var(--color-primary-light, #e6f4f5)"
                      color="var(--color-primary, #065F68)"
                      border="1px solid"
                      borderColor="var(--color-primary-border, rgba(6, 95, 104, 0.28))"
                      flexShrink={0}
                    >
                      {React.isValidElement(icon) ? (
                        icon
                      ) : (
                        <Icon as={icon} boxSize={5} />
                      )}
                    </Center>
                  ) : (
                    <Box
                      w="3.5px"
                      h="20px"
                      borderRadius="full"
                      bg="var(--color-primary, #065F68)"
                      flexShrink={0}
                    />
                  )}

                  <Box minW={0} flex="1">
                    {categoryTag && (
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        color="var(--color-primary, #065F68)"
                        lineHeight="1"
                        mb={0.5}
                      >
                        {categoryTag}
                      </Text>
                    )}

                    {title && (
                      typeof title === "string" ? (
                        <Text
                          fontSize={{ base: "md", md: "17px" }}
                          fontWeight="700"
                          letterSpacing="-0.01em"
                          color={text}
                          lineHeight="1.25"
                          noOfLines={1}
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
                          mt={0.5}
                          fontSize="xs"
                          color={textMuted}
                          maxW="2xl"
                          lineHeight="1.3"
                          noOfLines={{ base: 1, md: 2 }}
                        >
                          {subtitle}
                        </Text>
                      ) : (
                        subtitle
                      )
                    )}
                  </Box>
                </HStack>

                <HStack spacing={1.5} align="center" flexShrink={0}>
                  {headerActions}
                  <DrawerCloseButton
                    position="relative"
                    top="auto"
                    right="auto"
                    m="0"
                    w="32px"
                    h="32px"
                    minW="32px"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="var(--merchant-text-muted)"
                    bg="var(--merchant-surface-alt)"
                    border="1px solid"
                    borderColor="var(--merchant-border-strong)"
                    transition="all 0.15s ease"
                    _hover={{
                      bg: "red.50",
                      color: "red.500",
                      borderColor: "red.200",
                      transform: "scale(1.05)",
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    onClick={handleCloseDrawer}
                    {...closeButtonProps}
                  />
                </HStack>
              </Flex>
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
              pt={{ base: 3, md: 3.5 }}
              pb={{ base: "max(12px, env(safe-area-inset-bottom, 0px))", md: 3.5 }}
              borderTopWidth={showDivider ? "1px" : "0px"}
              borderTopColor={border}
              bg={useColorModeValue("white", "var(--color-surface, #0B1120)")}
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
