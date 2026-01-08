import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef } from "react";
import DrawerLoader from "../Loader/DrawerLoader";
import stores from "../../../store/stores";

interface CustomDrawerProps {
  open: boolean;
  title?: string;
  close: any;
  children: any;
  size?: string;
  props?: any;
  width?: any;
  loading?: boolean;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  title,
  open,
  close,
  size,
  children,
  width,
  loading = false,
  props,
}) => {
  const {
    themeStore: { themeConfig },
  } = stores;
  const drawerRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const headerBgColor = useColorModeValue(
    themeConfig.colors.custom.light.primary,
    themeConfig.colors.custom.dark.primary
  );
  const headerTextColor = colorMode === "dark" ? "white" : "white";
  const handleCloseDrawer = () => {
    close();
  };

  return (
    <Drawer
      isOpen={open}
      placement="right"
      onClose={handleCloseDrawer}
      size={size ? size : "xl"}
      finalFocusRef={drawerRef}
      {...props}
    >
      <DrawerOverlay />
      <DrawerContent
        css={{
          width: width ? (isDesktop ? width : undefined) : undefined,
          maxWidth: width ? (isDesktop ? width : undefined) : undefined,
          transition: "transform 0.1s ease-out",
          padding: 0,
          transform: open ? "translateX(0)" : "translateX(100%)",
          ...props,
        }}
      >
        {title && (
          <Flex
            justify="space-between"
            alignItems="center"
            p={4}
            bg={headerBgColor}
            color={headerTextColor}
            fontWeight="bold"
          >
            <Text fontSize="xl" cursor="pointer">{title}</Text>
            <DrawerCloseButton
              color={headerTextColor}
              bg="red.500"
              _hover={{ color: "#00000" }}
              size="lg"
              mt={1}
            />
          </Flex>
        )}
        <Divider />
        <DrawerBody
          style={{ overflowY: "auto", padding: isDesktop ? "15px" : "6px" }}
        >
          <DrawerLoader loading={loading}>
            <div style={{ maxHeight: "calc(100vh - 245px)" }}>{children}</div>
          </DrawerLoader>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
