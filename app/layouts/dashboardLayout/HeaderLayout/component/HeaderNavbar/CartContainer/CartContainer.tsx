'use client'
import {
  IconButton,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "../../../../../../component/Cart/component/CartDrawer/CartDrawer";
import stores from "../../../../../../store/stores";

const CartContainer = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartStore } = stores;
  console.log("CartContainer rendering. Items:", cartStore.cartItems.length, cartStore.cartItems);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Flex
        position="relative"
        justifyContent="center"
        alignItems="center"
        zIndex={999}
      >
        <IconButton
          icon={<FaShoppingCart />}
          fontSize="2xl"
          position="relative"
          bg="transparent"
          variant="ghost"
          color="white"
          _hover={{ color: "blue.500", bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
          aria-label="cart-icon"
          _focus={{ boxShadow: "outline" }}
          onClick={onOpen}
        />
        {cartStore.totalItems > 0 && (
          <Badge
            colorScheme="red"
            borderRadius="full"
            position="absolute"
            top="-3px"
            right="-4px"
          >
            {cartStore.totalItems}
          </Badge>
        )}
      </Flex>
      <CartDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default CartContainer;
