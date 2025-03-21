"use client"; // Add this directive since this is a client component

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getSidebarDataByRole, sidebarFooterData } from "./utils/SidebarItems";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation"; // Replace useNavigate with Next.js useRouter
import SidebarLogo from "./component/SidebarLogo";
import stores from "../../../store/stores";
import { mediumSidebarWidth, sidebarWidth } from "../../../component/config/utils/variable";

// Define interfaces with TypeScript
export interface SidebarItem {
  id: number;
  name: string;
  icon: React.ReactElement; // Changed JSX.Element to React.ReactElement
  url: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  onItemClick: any;
  onLeafItemClick: any;
  openMobileSideDrawer: boolean;
  setOpenMobileSideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const renderIcon = (depth: number, icon: any, colorMode: string) => {
  const iconColor = colorMode === "light" ? "gray.800" : "gray.200";

  if (depth === 1) {
    return (
      <Text fontSize={"18px"} mr={2} color={iconColor}>
        -
      </Text>
    );
  }
  if (depth > 1) {
    return (
      <Text fontSize={"18px"} mr={2} color={iconColor}>
        ◦
      </Text>
    );
  }
  return <Icon as={icon.type} boxSize={5} color={iconColor} />;
};

const findPathToActiveItem = (
  items: SidebarItem[],
  activeItemId: number
): number[] => {
  const path: number[] = [];

  const findPath = (
    items: SidebarItem[],
    id: number,
    currentPath: number[]
  ): boolean => {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (item.id === id) {
        path.push(...currentPath, index);
        return true;
      }
      if (item.children) {
        if (findPath(item.children, id, [...currentPath, index])) {
          return true;
        }
      }
    }
    return false;
  };

  findPath(items, activeItemId, []);
  return path;
};

const SidebarPopover = observer(({
  item,
  depth,
  onClick,
  onLeafClick,
  isCollapsed,
  activeItemId,
}: {
  item: SidebarItem;
  depth: number;
  onClick: any;
  onLeafClick: any;
  isCollapsed: boolean;
  activeItemId: number | null;
}) => {
  const {
    themeStore: { themeConfig },
  } = stores;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { colorMode } = useColorMode();

  const handleMouseEnter = () => {
    if (item.children && item.children.length > 0 && isCollapsed) {
      setIsPopoverOpen(true);
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    if (!item.children) {
      onLeafClick(item);
    } else {
      onClick(item);
    }
  };

  const isActive = (
    item: SidebarItem,
    activeItemId: number | null
  ): boolean => {
    if (item.id === activeItemId) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => isActive(child, activeItemId));
    }
    return false;
  };

  const itemIsActive = isActive(item, activeItemId);

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClose={() => setIsPopoverOpen(false)}
      placement="right-start"
      closeOnBlur={false}
      trigger="hover"
    >
      <PopoverTrigger>
        <Flex
          align={"center"}
          width={"100%"}
          onMouseEnter={handleMouseEnter}
          onClick={handleItemClick}
        >
          <Flex
            align="center"
            justify={depth === 0 ? "center" : "unset"}
            width={"100%"}
            cursor="pointer"
            py={depth === 0 ? 3 : 1}
            bg={
              itemIsActive
                ? useColorModeValue("blue.50", "blue.900")
                : "transparent"
            }
            color={
              itemIsActive
                ? useColorModeValue(
                    themeConfig.colors.custom.light.primary,
                    themeConfig.colors.custom.dark.primary
                  )
                : "inherit"
            }
            fontWeight={itemIsActive ? "600" : "inherit"}
            _hover={{
              bg: useColorModeValue("blue.50", "blue.700"),
              color: useColorModeValue(
                themeConfig.colors.custom.light.primary,
                themeConfig.colors.custom.dark.primary
              ),
            }}
          >
            {renderIcon(depth, item.icon, colorMode)}
            {depth > 0 && (
              <Flex flex={1} align={"center"} justify={"space-between"}>
                <Text ml={2} fontSize={"sm"}>
                  {item.name}
                </Text>
                {item.children && (
                  <ChevronRightIcon
                    ml={2}
                    color={colorMode === "light" ? "gray.800" : "gray.200"}
                  />
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </PopoverTrigger>
      {item.children && (
        <Portal>
          <PopoverContent
            zIndex={15}
            w={"200px"}
            onMouseEnter={handleMouseEnter}
            bg={useColorModeValue("white", "gray.800")}
          >
            <PopoverArrow />
            <PopoverHeader bg={useColorModeValue("blue.50", "blue.900")}>
              <Flex
                align="center"
                justify="space-between"
                width="100%"
                pl={2}
                my={0}
                cursor="pointer"
              >
                <Flex align="center" py={0}>
                  <Text
                    color={useColorModeValue(
                      themeConfig.colors.custom.light.primary,
                      "gray.200"
                    )}
                    fontSize="sm"
                    fontWeight={600}
                    ml={depth === 0 ? 5 : 2}
                  >
                    {item.name}
                  </Text>
                </Flex>
                {item.children && (
                  <ChevronDownIcon
                    color={useColorModeValue(
                      themeConfig.colors.custom.light.primary,
                      "gray.200"
                    )}
                    fontSize="19px"
                    fontWeight={600}
                  />
                )}
              </Flex>
            </PopoverHeader>
            <PopoverBody>
              <VStack align="start" spacing={1}>
                {item.children.map((child) => (
                  <SidebarPopover
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    onClick={onClick}
                    onLeafClick={onLeafClick}
                    isCollapsed={isCollapsed}
                    activeItemId={activeItemId}
                  />
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      )}
    </Popover>
  );
});

const SidebarAccordion = observer(({
  items,
  depth = 0,
  onClick,
  onLeafClick,
  activeItemId,
  expandedPath,
}: {
  items: SidebarItem[];
  depth?: number;
  onClick: any;
  onLeafClick: any;
  activeItemId: number | null;
  expandedPath: number[];
}) => {
  const {
    themeStore: { themeConfig },
  } = stores;

  const { colorMode } = useColorMode();

  const activeBg = useColorModeValue(
    themeConfig.colors.custom.light.primary,
    "blue.900"
  );
  const hoverBg = useColorModeValue("blue.50", "blue.700");
  const hoverColor = useColorModeValue("teal.700", "teal.300");
  const primaryColor = useColorModeValue(
    themeConfig.colors.custom.light.primary,
    themeConfig.colors.custom.dark.primary
  );

  const expandedIndex =
    expandedPath.length > depth ? expandedPath[depth] : null;

  const isActive = (item: SidebarItem): boolean => {
    if (item.id === activeItemId) {
      return true;
    }
    if (item.children) {
      return item.children.some(isActive);
    }
    return false;
  };

  return (
    <Accordion
      width={"100%"}
      px={3}
      allowMultiple
      defaultIndex={expandedIndex !== null ? [expandedIndex] : []}
    >
      {items.map((item) => {
        const itemIsActive = isActive(item);
        return (
          <AccordionItem key={item.id} border="none" width={"100%"}>
            {() => (
              <>
                <AccordionButton
                  my={1.5}
                  px={1}
                  borderRadius={"10px"}
                  bg={itemIsActive ? activeBg : "transparent"}
                  color={itemIsActive ? primaryColor : "inherit"}
                  fontWeight={itemIsActive ? "600" : "inherit"}
                  _hover={{
                    bg: hoverBg,
                    color: hoverColor,
                    fontWeight: "600",
                    boxShadow: "rgb(0 0 0 / 10%) 0px 0px 5px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.children) {
                      onLeafClick(item);
                    } else {
                      onClick(item);
                    }
                  }}
                >
                  <Flex
                    align="center"
                    justify="space-between"
                    width="100%"
                    pl={2}
                    my={0}
                    cursor="pointer"
                    color={
                      activeItemId === item.id
                        ? useColorModeValue(
                            themeConfig.colors.custom.light.primary,
                            themeConfig.colors.custom.dark.primary
                          )
                        : "inherit"
                    }
                    fontWeight={activeItemId === item.id ? "600" : "inherit"}
                  >
                    <Flex align="center">
                      {renderIcon(depth, item.icon, colorMode)}
                      <Text
                        fontSize="sm"
                        color={colorMode === "dark" ? "white" : "black"}
                        ml={depth === 0 ? 5 : 2}
                      >
                        {item.name}
                      </Text>
                    </Flex>
                    {item.children && (
                      <AccordionIcon
                        color={
                          colorMode === "light" ? "gray.800" : "gray.200"
                        }
                      />
                    )}
                  </Flex>
                </AccordionButton>
                {item.children && (
                  <AccordionPanel pl={4} pr={0} pb={0} mt={"-5px"}>
                    <VStack align="start" spacing={0}>
                      <SidebarAccordion
                        items={item.children}
                        depth={depth + 1}
                        onClick={onClick}
                        onLeafClick={onLeafClick}
                        activeItemId={activeItemId}
                        expandedPath={expandedPath}
                      />
                    </VStack>
                  </AccordionPanel>
                )}
              </>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
});

const SidebarLayout: React.FC<SidebarProps> = observer(({
  isCollapsed,
  onItemClick,
  onLeafItemClick,
  openMobileSideDrawer,
  setOpenMobileSideDrawer,
}) => {
  const {
    auth: { user },
  } = stores;
  const router = useRouter(); // Replace useNavigate with useRouter
  const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false;
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBgColor = useColorModeValue("gray.200", "gray.700");
  const [sidebarData, setSidebarData] = useState<SidebarItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<number | null>(() => {
    if (typeof window !== "undefined") { // Add check for client-side
      const storedActiveItemId = localStorage.getItem("activeSidebarItemId");
      return storedActiveItemId ? parseInt(storedActiveItemId, 10) : 1;
    }
    return 1;
  });
  const { colorMode } = useColorMode();

  useEffect(() => {
    setSidebarData(getSidebarDataByRole(["user", user.role]));
  }, [user]);

  useEffect(() => {
    if (activeItemId !== null && typeof window !== "undefined") {
      localStorage.setItem("activeSidebarItemId", activeItemId.toString());
    }
  }, [activeItemId]);

  const handleLeafItemClick = (item: SidebarItem) => {
    setActiveItemId(item.id);
    onLeafItemClick(item);
    router.push(item.url); // Replace navigate with router.push
  };

  useEffect(() => {
    if (!isMobile) {
      setOpenMobileSideDrawer(false);
    }
  }, [isMobile, setOpenMobileSideDrawer]);

  const expandedPath =
    activeItemId !== null
      ? findPathToActiveItem(sidebarData, activeItemId)
      : [];

  return (
    <>
      <Drawer
        isOpen={openMobileSideDrawer}
        placement="right"
        onClose={() => setOpenMobileSideDrawer(false)} // Changed to false directly
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            variant="ghost"
            fontSize="xl"
            color="white"
            _hover={{ color: "blue.500", bg: "gray.700" }}
            _active={{ bg: "gray.800" }}
            mt={2}
            _focus={{ boxShadow: "none" }}
          />
          <SidebarLogo />
          <DrawerBody px={2} className="customScrollBar">
            <SidebarAccordion
              items={sidebarData}
              onClick={onItemClick}
              onLeafClick={handleLeafItemClick}
              activeItemId={activeItemId}
              expandedPath={expandedPath}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {!isMobile && (
        <Box
          pos={"fixed"}
          top={0}
          bottom={0}
          left={0}
          width={isCollapsed ? mediumSidebarWidth : sidebarWidth}
          minH={"100vh"}
          transition="width 0.3s"
          color="gray.700"
          zIndex={50000}
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRight="1px"
          boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
          borderRightColor={borderColor}
          className="customScrollBar"
        >
          <Box
            position="sticky"
            top={0}
            zIndex={11}
            bg={"white"}
            borderBottom={"1px solid"}
            borderBottomColor={headerBgColor}
            boxShadow="0px 10px 10px -10px rgba(0, 0, 0, 0.1)"
          >
            <SidebarLogo />
          </Box>
          <Box
            overflowY="auto"
            overflowX={"hidden"}
            className="customScrollBar"
            height="calc(100vh - 165px)"
          >
            {isCollapsed ? (
              <VStack align="start" spacing={3}>
                {sidebarData.map((item) => (
                  <SidebarPopover
                    key={item.id}
                    item={item}
                    depth={0}
                    onClick={onItemClick}
                    onLeafClick={handleLeafItemClick}
                    isCollapsed={isCollapsed}
                    activeItemId={activeItemId}
                  />
                ))}
              </VStack>
            ) : (
              <SidebarAccordion
                items={sidebarData}
                onClick={onItemClick}
                onLeafClick={handleLeafItemClick}
                activeItemId={activeItemId}
                expandedPath={expandedPath}
              />
            )}
          </Box>
          <Box
            position="fixed"
            bottom={0}
            left={0}
            width={isCollapsed ? mediumSidebarWidth : sidebarWidth}
            transition="width 0.3s"
            py={4}
            zIndex={11}
            overflowX={"hidden"}
          >
            {isCollapsed ? (
              <VStack align="start" spacing={3}>
                {sidebarFooterData.map((item) => (
                  <SidebarPopover
                    key={item.id}
                    item={item}
                    depth={0}
                    onClick={onItemClick}
                    onLeafClick={handleLeafItemClick}
                    isCollapsed={isCollapsed}
                    activeItemId={activeItemId}
                  />
                ))}
              </VStack>
            ) : (
              <SidebarAccordion
                items={sidebarFooterData}
                onClick={onItemClick}
                onLeafClick={handleLeafItemClick}
                activeItemId={activeItemId}
                expandedPath={expandedPath}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
});

export default SidebarLayout;