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
  size = "xl",
  overlayBg = "blackAlpha.500",
  showHandle = true,
  bodyProps,
  contentProps,
  headerProps,
  footerProps,
  drawerProps,
}: BottomSheetDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size={size} {...drawerProps}>
      <DrawerOverlay bg={overlayBg} />
      <DrawerContent borderTopRadius="24px" overflow="hidden" {...contentProps}>
        {showHandle ? (
          <Box
            alignSelf="center"
            mt={3}
            mb={title ? 1 : 0}
            w="44px"
            h="5px"
            borderRadius="full"
            bg="gray.200"
          />
        ) : null}

        {title ? (
          <DrawerHeader borderBottomWidth="1px" borderBottomColor="gray.100" fontWeight="800" {...headerProps}>
            {title}
          </DrawerHeader>
        ) : null}

        <DrawerCloseButton top={showHandle ? 5 : 4} right={4} />

        <DrawerBody py={4} {...bodyProps}>
          {children}
        </DrawerBody>

        {footer ? (
          <DrawerFooter borderTopWidth="1px" borderTopColor="gray.100" gap={3} {...footerProps}>
            {footer}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
};

export default BottomSheetDrawer;
