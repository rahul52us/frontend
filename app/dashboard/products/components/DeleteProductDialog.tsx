import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import FormModel from "../../../component/common/FormModel/FormModel";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data?: any;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
}) => {
  if (!data) return null;

  const { name, category, price, stock, brand, images } = data;

  return (
    <FormModel open={isOpen} close={onClose} isCentered>
      <Box
        bg={dashboardPalette.shell}
        borderRadius="24px"
        border="1px solid"
        borderColor={dashboardPalette.border}
        p={5}
      >
        <Stack spacing={5}>
          <Box>
            <Text
              fontSize="xl"
              fontWeight="500"
              color={dashboardPalette.text}
              fontFamily='Georgia, "Times New Roman", serif'
            >
              Delete Product
            </Text>
            <Text mt={1} color={dashboardPalette.textMuted} fontSize="sm">
              This only changes the visual confirmation screen. The delete logic stays exactly the same.
            </Text>
          </Box>

          <Flex gap={4} align="center">
            <Image
              src={images?.[0]}
              alt={name}
              boxSize="84px"
              objectFit="cover"
              borderRadius="16px"
              border="1px solid"
              borderColor={dashboardPalette.borderStrong}
            />

            <Box flex="1">
              <Text fontSize="lg" fontWeight="600" color={dashboardPalette.text}>
                {name}
              </Text>

              <Flex gap={2} mt={2} wrap="wrap">
                <Badge bg={dashboardPalette.accentSoft} color={dashboardPalette.accentStrong}>
                  {category?.name || category}
                </Badge>
                {brand ? (
                  <Badge variant="outline" color={dashboardPalette.textMuted} borderColor={dashboardPalette.borderStrong}>
                    {brand}
                  </Badge>
                ) : null}
                <Badge
                  bg={stock > 0 ? "rgba(70, 201, 139, 0.14)" : "rgba(239, 107, 107, 0.14)"}
                  color={stock > 0 ? dashboardPalette.success : dashboardPalette.danger}
                >
                  Stock: {stock}
                </Badge>
              </Flex>

              <Text mt={2} fontWeight="700" color={dashboardPalette.accentStrong}>
                Rs {price}
              </Text>
            </Box>
          </Flex>

          <Box
            bg="rgba(239, 107, 107, 0.10)"
            border="1px solid"
            borderColor="rgba(239, 107, 107, 0.24)"
            p={4}
            borderRadius="16px"
          >
            <Text color={dashboardPalette.danger} fontSize="sm" fontWeight="700">
              This action cannot be undone
            </Text>
            <Text fontSize="sm" color={dashboardPalette.textMuted} mt={1}>
              Deleting this product will permanently remove it from your store.
            </Text>
          </Box>

          <HStack justify="flex-end" gap={3}>
            <Button
              onClick={onClose}
              variant="outline"
              borderRadius="16px"
              borderColor={dashboardPalette.borderStrong}
              color={dashboardPalette.textMuted}
              _hover={{ bg: "rgba(255,255,255,0.04)", color: dashboardPalette.text }}
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              borderRadius="16px"
              bg={dashboardPalette.danger}
              color="white"
              _hover={{ bg: "#ff7a7a" }}
            >
              Delete Product
            </Button>
          </HStack>
        </Stack>
      </Box>
    </FormModel>
  );
};

export default DeleteProductDialog;
