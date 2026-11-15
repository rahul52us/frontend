"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  // keyframes,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import {
  FiGrid,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import CartDrawer from "../../../../../component/Cart/component/CartDrawer/CartDrawer";
import WishlistDrawer from "../../../../../component/Wishlist/component/WishlistDrawer/WishlistDrawer";
import stores from "../../../../../store/stores";
import { ThemeModeSwitcher } from "../../../../../theme/ThemeModeSwitcher";

// Entrance animations (CSS, so they always run on mount)
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const riseIn = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// `backwards` = hidden only during the delay, fully normal styles afterwards
const anim = (name: any, index: number) =>
  `${name} 0.28s ${EASE} ${(0.03 + index * 0.035).toFixed(3)}s backwards`;

type RowProps = {
  label: string;
  icon: any;
  color: string;
  onClick: () => void;
  index: number;
  danger?: boolean;
};

const MenuRow = ({ label, icon, color, onClick, index, danger }: RowProps) => {
  const hoverBg = useColorModeValue(
    danger ? "red.50" : "gray.100",
    danger ? "rgba(239,68,68,0.16)" : "var(--color-surface-hover)"
  );
  const tileBg = useColorModeValue(`${color}.50`, `${color}.900`);
  const iconColor = useColorModeValue(`${color}.500`, `${color}.300`);
  const textColor = useColorModeValue(
    danger ? "red.500" : "gray.700",
    danger ? "red.300" : "var(--color-text)"
  );

  return (
    <MenuItem
      onClick={onClick}
      animation={anim(slideIn, index)}
      px={2}
      py={1.5}
      rounded="lg"
      bg="transparent"
      transition="background 0.18s ease, transform 0.18s ease"
      _hover={{ bg: hoverBg, transform: "translateX(3px)" }}
      _focus={{ bg: hoverBg }}
      _active={{ transform: "scale(0.98)" }}
    >
      <Flex align="center" gap={2.5} w="full">
        <Flex
          w="28px"
          h="28px"
          align="center"
          justify="center"
          rounded="lg"
          bg={tileBg}
          flexShrink={0}
        >
          <Icon as={icon} color={iconColor} boxSize={4} />
        </Flex>
        <Text fontSize="sm" fontWeight="500" color={textColor} noOfLines={1}>
          {label}
        </Text>
      </Flex>
    </MenuItem>
  );
};

const QuickTile = ({ label, icon, color, onClick, index }: Omit<RowProps, "danger">) => {
  const border = useColorModeValue("gray.200", "var(--color-border)");
  const bg = useColorModeValue(`${color}.50`, `${color}.900`);
  const iconColor = useColorModeValue(`${color}.500`, `${color}.300`);
  const textColor = useColorModeValue("gray.700", "var(--color-text)");

  return (
    <MenuItem
      onClick={onClick}
      animation={anim(riseIn, index)}
      flex={1}
      px={2.5}
      py={2}
      rounded="xl"
      bg={bg}
      border="1px solid"
      borderColor={border}
      transition="transform 0.18s ease, border-color 0.18s ease"
      _hover={{ bg, borderColor: iconColor, transform: "translateY(-2px)" }}
      _focus={{ bg, borderColor: iconColor }}
      _active={{ transform: "scale(0.96)" }}
    >
      <Flex align="center" justify="center" gap={2} w="full">
        <Icon as={icon} color={iconColor} boxSize={4} />
        <Text fontSize="xs" fontWeight="700" color={textColor}>
          {label}
        </Text>
      </Flex>
    </MenuItem>
  );
};

const UserMenu = observer(() => {
  const router = useRouter();
  const { user, logout } = stores.auth;
  const {
    isOpen: isWishlistOpen,
    onOpen: onWishlistOpen,
    onClose: onWishlistClose,
  } = useDisclosure();
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isSuperAdmin =
    user?.type === "superAdmin" ||
    user?.role === "superAdmin" ||
    (Array.isArray(user?.role) && user.role.includes("superAdmin"));
  const isSeller = user?.type === "seller";
  const roleLabel = isSuperAdmin ? "Admin" : isSeller ? "Seller" : null;

  // Theme tokens
  const bg = useColorModeValue("rgba(255,255,255,0.96)", "var(--color-surface)");
  const border = useColorModeValue("gray.200", "var(--color-border)");
  const text = useColorModeValue("gray.800", "var(--color-text)");
  const muted = useColorModeValue("gray.500", "var(--color-text-muted)");
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(139,92,246,0.10))",
    "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))"
  );
  const ringColor = useColorModeValue("white", "var(--color-surface)");
  const shadow = useColorModeValue(
    "0 18px 40px rgba(15,23,42,0.18)",
    "0 18px 40px rgba(0,0,0,0.55)"
  );

  // Running index so the stagger order matches what is rendered
  let i = 0;
  const next = () => i++;

  return (
    <>
      <Menu placement="bottom-end" gutter={8}>
        <MenuButton
          as={Button}
          variant="unstyled"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          minW={0}
          h="auto"
          rounded="full"
          transition="transform 0.2s ease"
          _hover={{ transform: "scale(1.06)" }}
          _active={{ transform: "scale(0.95)" }}
        >
          <Avatar
            size="sm"
            name={user?.name || "User"}
            src={user?.avatar}
            bg="brand.500"
            color="white"
            boxShadow={`0 0 0 2px ${ringColor}, 0 0 0 4px rgba(59,130,246,0.55)`}
          />
        </MenuButton>

        <MenuList
          w={{ base: "250px", md: "270px" }}
          maxW="calc(100vw - 16px)"
          bg={bg}
          backdropFilter="blur(14px)"
          border="1px solid"
          borderColor={border}
          rounded="2xl"
          boxShadow={shadow}
          overflow="hidden"
          p={0}
          zIndex={1500}
        >
          {/* Profile header */}
          <Box
            animation={anim(slideIn, next())}
            px={3.5}
            py={3}
            bg={headerBg}
            borderBottom="1px solid"
            borderColor={border}
          >
            <Flex align="center" gap={3}>
              <Avatar
                size="sm"
                name={user?.name || "User"}
                src={user?.avatar}
                bg="brand.500"
                color="white"
              />
              <Box minW={0} flex={1}>
                <Flex align="center" gap={2}>
                  <Text fontWeight="700" fontSize="sm" color={text} noOfLines={1}>
                    {user?.name || "User"}
                  </Text>
                  {roleLabel && (
                    <Badge
                      colorScheme={isSuperAdmin ? "red" : "orange"}
                      fontSize="9px"
                      rounded="md"
                      px={1.5}
                      flexShrink={0}
                    >
                      {roleLabel}
                    </Badge>
                  )}
                </Flex>
                <Text fontSize="xs" color={muted} noOfLines={1}>
                  {user?.email}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box p={1.5}>
            {/* Quick actions */}
            {!isSuperAdmin && (
              <Flex gap={1.5} mb={1.5}>
                <QuickTile
                  index={next()}
                  label="Cart"
                  icon={FiShoppingCart}
                  color="blue"
                  onClick={onCartOpen}
                />
                <QuickTile
                  index={next()}
                  label="Wishlist"
                  icon={FiHeart}
                  color="red"
                  onClick={onWishlistOpen}
                />
              </Flex>
            )}

            {/* Main links */}
            {!isSuperAdmin && (
              <>
                <MenuRow
                  index={next()}
                  label="Personal Details"
                  icon={FiUser}
                  color="teal"
                  onClick={() => router.push("/account?tab=profile")}
                />
                <MenuRow
                  index={next()}
                  label="Your Orders"
                  icon={FiShoppingBag}
                  color="purple"
                  onClick={() => router.push("/account?tab=orders")}
                />
                <MenuRow
                  index={next()}
                  label="Address Book"
                  icon={FiMapPin}
                  color="green"
                  onClick={() => router.push("/account?tab=addresses")}
                />
              </>
            )}

            {/* Role based links */}
            {isSuperAdmin ? (
              <>
                <MenuRow
                  index={next()}
                  label="Admin Dashboard"
                  icon={FiGrid}
                  color="orange"
                  onClick={() => router.push("/dashboard/super-admin/index")}
                />
                <MenuRow
                  index={next()}
                  label="Account Settings"
                  icon={FiUser}
                  color="red"
                  onClick={() => router.push("/super-admin/account")}
                />
              </>
            ) : isSeller ? (
              <MenuRow
                index={next()}
                label="Seller Dashboard"
                icon={FiGrid}
                color="orange"
                onClick={() => router.push("/dashboard")}
              />
            ) : (
              <>
                <MenuRow
                  index={next()}
                  label="Dashboard"
                  icon={FiGrid}
                  color="blue"
                  onClick={() => router.push("/dashboard")}
                />
                <MenuRow
                  index={next()}
                  label="Become a Seller"
                  icon={FiShoppingBag}
                  color="green"
                  onClick={() => router.push("/become-seller")}
                />
              </>
            )}
          </Box>

          <MenuDivider m={0} borderColor={border} />

          {/* Appearance */}
          <Box animation={anim(slideIn, next())} px={3.5} py={2}>
            <Flex align="center" justify="space-between" gap={3}>
              <Text
                fontSize="10px"
                fontWeight="700"
                color={muted}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Appearance
              </Text>
              <ThemeModeSwitcher size="sm" />
            </Flex>
          </Box>

          <MenuDivider m={0} borderColor={border} />

          {/* Logout */}
          <Box p={1.5}>
            <MenuRow
              index={next()}
              label="Logout"
              icon={FiLogOut}
              color="red"
              danger
              onClick={handleLogout}
            />
          </Box>
        </MenuList>
      </Menu>

      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
      <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />
    </>
  );
});

export default UserMenu;