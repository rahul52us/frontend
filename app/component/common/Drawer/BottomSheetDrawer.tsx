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
import React, { useEffect, useRef, useState } from "react";
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

const SPRING = "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)";
const DISMISS = "transform 0.24s cubic-bezier(0.32, 0.72, 0, 1)";

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
  useRegisterOverlay(isOpen, onClose, "bottom_sheet_drawer");

  const resolvedSize = drawerProps?.size ?? size;
  const isFull = resolvedSize === "full";

  const [sheetEl, setSheetEl] = useState<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Native-feel swipe to dismiss
  useEffect(() => {
    if (!sheetEl || !isOpen) return;

    let startX = 0;
    let startY = 0;
    let originY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let offset = 0;
    let eligible = false;
    let decided = false;
    let dragging = false;
    let closing = false;

    const setY = (y: number, transition: string) => {
      sheetEl.style.transition = transition;
      sheetEl.style.transform = y ? `translate3d(0, ${y}px, 0)` : "";
    };

    const hasScrolledAncestor = (target: HTMLElement | null) => {
      let node = target;
      while (node && node !== sheetEl) {
        if (node.scrollTop > 0) return true;
        node = node.parentElement;
      }
      return false;
    };

    const onStart = (e: TouchEvent) => {
      if (closing || e.touches.length !== 1) {
        eligible = false;
        return;
      }
      const t = e.touches[0];
      const target = e.target as HTMLElement;
      startX = t.clientX;
      startY = t.clientY;
      lastY = t.clientY;
      lastT = e.timeStamp;
      velocity = 0;
      offset = 0;
      decided = false;
      dragging = false;

      const inDragZone = !!target.closest("[data-sheet-drag-zone]");
      eligible = inDragZone || !hasScrolledAncestor(target);
    };

    const onMove = (e: TouchEvent) => {
      if (!eligible || closing) return;
      const t = e.touches[0];

      if (!decided) {
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        decided = true;
        if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
          dragging = true;
          originY = t.clientY; // start from here so there's no jump
        } else {
          eligible = false;
          return;
        }
      }

      if (!dragging) return;
      if (e.cancelable) e.preventDefault();

      offset = Math.max(0, t.clientY - originY);
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = (t.clientY - lastY) / dt;
      lastY = t.clientY;
      lastT = e.timeStamp;

      setY(offset, "none");
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;

      const height = sheetEl.getBoundingClientRect().height;
      const shouldClose =
        velocity > 0.55 || (offset > Math.min(height * 0.3, 160) && velocity > -0.2);

      if (shouldClose) {
        closing = true;
        sheetEl.style.transition = DISMISS;
        sheetEl.style.transform = "translate3d(0, calc(100% + 24px), 0)";
        window.setTimeout(() => onCloseRef.current(), 200);
      } else {
        setY(0, SPRING);
      }
    };

    sheetEl.addEventListener("touchstart", onStart, { passive: true });
    sheetEl.addEventListener("touchmove", onMove, { passive: false });
    sheetEl.addEventListener("touchend", onEnd, { passive: true });
    sheetEl.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      sheetEl.removeEventListener("touchstart", onStart);
      sheetEl.removeEventListener("touchmove", onMove);
      sheetEl.removeEventListener("touchend", onEnd);
      sheetEl.removeEventListener("touchcancel", onEnd);
    };
  }, [sheetEl, isOpen]);

  const hasDragZone = showHandle || !!title;

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      size={size}
      {...drawerProps}
    >
      <DrawerOverlay bg={overlayBg} backdropFilter="blur(4px)" />
      <DrawerContent
        bg="transparent"
        boxShadow="none"
        overflow="visible"
        w="100vw"
        maxW="100vw"
        h={isFull ? "100dvh" : "auto"}
        maxH={isFull ? "100dvh" : undefined}
        {...contentProps}
      >
        <Box
          ref={setSheetEl}
          display="flex"
          flexDirection="column"
          w="100%"
          h={isFull ? "100%" : "auto"}
          maxH="inherit"
          overflow="hidden"
          position="relative"
          borderTopRadius={isFull ? "0" : "24px"}
          bg="var(--color-shell, #FFFFFF)"
          boxShadow={isFull ? "none" : "0 -10px 40px rgba(0, 0, 0, 0.25)"}
          pt={isFull ? "var(--safe-area-top, env(safe-area-inset-top, 0px))" : 0}
          pb={
            footer
              ? "env(safe-area-inset-bottom, 0px)"
              : "max(env(safe-area-inset-bottom, 0px), 8px)"
          }
          willChange="transform"
        >
          {hasDragZone ? (
            <Box data-sheet-drag-zone flexShrink={0} sx={{ touchAction: "none" }}>
              {showHandle ? (
                <Box
                  mx="auto"
                  mt="8px"
                  mb={title ? "2px" : "6px"}
                  w="36px"
                  h="4px"
                  borderRadius="full"
                  bg="var(--color-border)"
                />
              ) : null}

              {title ? (
                <DrawerHeader
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  borderBottomWidth="1px"
                  borderBottomColor="var(--color-border)"
                  fontWeight="700"
                  fontSize="md"
                  lineHeight="1.2"
                  py={2}
                  pl={4}
                  pr={2}
                  minH="40px"
                  bg="var(--color-surface, #FFFFFF)"
                  {...headerProps}
                >
                  <Box minW={0} flex="1" noOfLines={1}>
                    {title}
                  </Box>
                  <DrawerCloseButton
                    position="static"
                    size="sm"
                    flexShrink={0}
                    borderRadius="full"
                  />
                </DrawerHeader>
              ) : null}
            </Box>
          ) : null}

          {!title ? (
            <DrawerCloseButton
              top={
                isFull
                  ? "calc(var(--safe-area-top, env(safe-area-inset-top, 0px)) + 8px)"
                  : "8px"
              }
              right={3}
              size="sm"
              zIndex={10}
              borderRadius="full"
            />
          ) : null}

          <DrawerBody
            py={3}
            px={4}
            flex="1"
            overflowY="auto"
            sx={{ overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch" }}
            {...bodyProps}
          >
            {children}
          </DrawerBody>

          {footer ? (
            <DrawerFooter
              flexShrink={0}
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
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomSheetDrawer;