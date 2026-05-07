"use client";

import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Portal,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data?: any;
}

const getProductImage = (product: any) =>
  product?.images?.[0]?.preview ||
  product?.images?.[0] ||
  "https://via.placeholder.com/600x600?text=Product";

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
}) => {
  const overlayBg = useColorModeValue("rgba(15, 23, 42, 0.32)", "rgba(2, 6, 23, 0.62)");
  const surface = useColorModeValue("white", dashboardPalette.surface);
  const surfaceMuted = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const border = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const text = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);
  const danger = useColorModeValue("#DC2626", dashboardPalette.danger);
  const dangerSoft = useColorModeValue("rgba(239, 68, 68, 0.10)", dashboardPalette.dangerSoft);
  const shadow = useColorModeValue("0 26px 48px rgba(15, 23, 42, 0.18)", "0 32px 60px rgba(0, 0, 0, 0.36)");
  const deleteHover = useColorModeValue("#B91C1C", "#EF4444");

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !data) {
    return null;
  }

  const categoryName = typeof data.category === "object" ? data.category?.name : data.category;

  return (
    <Portal>
      <Box
        position="fixed"
        inset={0}
        zIndex={1500}
        bg={overlayBg}
        backdropFilter="blur(10px)"
        display="flex"
        alignItems={{ base: "flex-end", md: "center" }}
        justifyContent="center"
        onClick={onClose}
      >
        <Box
          w="full"
          maxW={{ base: "100%", md: "480px" }}
          bg={surface}
          borderTopRadius={{ base: "28px", md: "30px" }}
          borderBottomRadius={{ base: 0, md: "30px" }}
          borderWidth="1px"
          borderColor={border}
          boxShadow={{ base: "none", md: shadow }}
          p={{ base: 4, md: 6 }}
          onClick={(event) => event.stopPropagation()}
        >
          <Box
            mx="auto"
            mb={4}
            display={{ base: "block", md: "none" }}
            h="5px"
            w="44px"
            borderRadius="full"
            bg={border}
          />

          <HStack align="start" justify="space-between" spacing={3}>
            <VStack align="start" spacing={1} flex="1">
              <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em" color={danger}>
                Delete product
              </Text>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" color={text} lineHeight="1.15">
                Delete this product?
              </Text>
              <Text fontSize="sm" color={textMuted}>
                {data?.name} will be moved to trash and hidden from your active catalog.
              </Text>
            </VStack>

            <IconButton
              aria-label="Close delete dialog"
              icon={<CloseIcon boxSize={3} />}
              size="sm"
              borderRadius="full"
              variant="ghost"
              color={textMuted}
              onClick={onClose}
            />
          </HStack>

          <HStack
            mt={5}
            spacing={4}
            align="stretch"
            p={3}
            borderRadius="24px"
            bg={surfaceMuted}
            borderWidth="1px"
            borderColor={border}
          >
            <Image
              src={getProductImage(data)}
              alt={data?.name || "Product image"}
              boxSize={{ base: "72px", md: "84px" }}
              borderRadius="18px"
              objectFit="cover"
            />

            <VStack align="start" spacing={1} flex="1" minW={0}>
              <Text fontSize="sm" fontWeight="700" color={text} noOfLines={2}>
                {data?.name}
              </Text>
              {categoryName ? (
                <Text fontSize="xs" color={textMuted}>
                  {categoryName}
                  {data?.brand ? ` • ${data.brand}` : ""}
                </Text>
              ) : null}
              <Text fontSize="sm" fontWeight="700" color={text}>
                Rs {Number(data?.price || 0).toLocaleString("en-IN")}
              </Text>
              <Text fontSize="xs" color={textMuted}>
                Stock: {Number(data?.stock || 0)}
              </Text>
            </VStack>
          </HStack>

          <Box
            mt={4}
            borderRadius="22px"
            borderWidth="1px"
            borderColor="rgba(239, 68, 68, 0.18)"
            bg={dangerSoft}
            px={4}
            py={3.5}
          >
            <HStack spacing={2} align="start">
              <FaTrash color={danger} />
              <VStack align="start" spacing={0.5}>
                <Text fontSize="sm" fontWeight="700" color={danger}>
                  This action cannot be undone
                </Text>
                <Text fontSize="sm" color={textMuted}>
                  You can restore it later only if your backend keeps deleted products in trash.
                </Text>
              </VStack>
            </HStack>
          </Box>

          <HStack mt={6} spacing={3}>
            <Button
              flex="1"
              h="48px"
              borderRadius="full"
              variant="outline"
              borderColor={border}
              color={text}
              bg={surface}
              _hover={{ bg: surfaceMuted }}
              onClick={onClose}
            >
              Keep
            </Button>
            <Button
              flex="1"
              h="48px"
              borderRadius="full"
              bg={danger}
              color="white"
              _hover={{ bg: deleteHover }}
              _active={{ transform: "scale(0.98)" }}
              onClick={onConfirm}
            >
              Delete
            </Button>
          </HStack>
        </Box>
      </Box>
    </Portal>
  );
};

export default DeleteProductDialog;
