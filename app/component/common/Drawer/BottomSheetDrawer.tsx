import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import useRegisterOverlay from "../../../hooks/useRegisterOverlay";

type BottomSheetDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: string;
  overlayBg?: string;
  showHandle?: boolean;
  bodyProps?: any;
  contentProps?: any;
  headerProps?: any;
  footerProps?: any;
  drawerProps?: any;
};

const BottomSheetDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "full",
  overlayBg = "blackAlpha.600",
  showHandle = true,
  bodyProps,
  contentProps,
  headerProps,
  footerProps,
  drawerProps,
}: BottomSheetDrawerProps) => {
  // Register bottom sheet drawer for native back button dismissal
  useRegisterOverlay(isOpen, onClose, 'bottom_sheet_drawer');

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size={size} {...drawerProps}>
      <DrawerOverlay bg={overlayBg} backdropFilter="blur(4px)" />
      <DrawerContent
        borderTopRadius="24px"
        overflow="hidden"
        h="100dvh"
        maxH="100dvh"
        w="100vw"
        maxW="100vw"
        pt="var(--safe-area-top, env(safe-area-inset-top, 0px))"
        pb={footer ? "env(safe-area-inset-bottom, 0px)" : "max(env(safe-area-inset-bottom, 0px), 12px)"}
        bg="var(--color-shell, #FFFFFF)"
        display="flex"
        flexDirection="column"
        boxShadow="0 -10px 40px rgba(0, 0, 0, 0.25)"
        {...contentProps}
      >
        {showHandle ? (
          <Box
            alignSelf="center"
            mt={3}
            mb={title ? 1 : 0}
            w="44px"
            h="5px"
            borderRadius="full"
            bg="var(--color-border)"
          />
        ) : null}

        {title ? (
          <DrawerHeader
            borderBottomWidth="1px"
            borderBottomColor="var(--color-border)"
            fontWeight="800"
            fontSize="lg"
            py={3}
            px={4}
            bg="var(--color-surface, #FFFFFF)"
            {...headerProps}
          >
            {title}
          </DrawerHeader>
        ) : null}

        <DrawerCloseButton
          top="calc(var(--safe-area-top, env(safe-area-inset-top, 0px)) + 10px)"
          right={4}
          zIndex={10}
        />

        <DrawerBody py={3} px={4} flex="1" overflowY="auto" {...bodyProps}>
          {children}
        </DrawerBody>

        {footer ? (
          <DrawerFooter
            borderTopWidth="1px"
            borderTopColor="var(--color-border)"
            gap={3}
            py={3}
            px={4}
            bg="var(--color-surface, #FFFFFF)"
            {...footerProps}
          >
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};

export default BottomSheetDrawer;
