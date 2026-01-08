import React, { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  Badge,
  Divider,
  Stack,
} from "@chakra-ui/react";
import FormModel from "../../../component/common/FormModel/FormModel";

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
  const cancelRef = useRef(null);

  if (!data) return null;

  const {
    name,
    category,
    price,
    stock,
    brand,
    images
  } = data;

  return (
    <FormModel
      open={isOpen}
      close={onClose}
      title="Delete Product"
      isCentered
    >
      <Stack spacing={5}>
        {/* Product Preview */}
        <Flex gap={4} align="center">
          <Image
            src={images?.[0]}
            alt={name}
            boxSize="80px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
          />

          <Box flex="1">
            <Text fontSize="lg" fontWeight="bold">
              {name}
            </Text>

            <Flex gap={2} mt={1} wrap="wrap">
              <Badge colorScheme="purple">{category}</Badge>
              <Badge colorScheme="blue">{brand}</Badge>
              <Badge colorScheme={stock > 0 ? "green" : "red"}>
                Stock: {stock}
              </Badge>
            </Flex>

            <Text mt={2} fontWeight="semibold" color="gray.700">
              ₹ {price}
            </Text>
          </Box>
        </Flex>

        <Divider />

        {/* Warning Message */}
        <Box
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          p={3}
          borderRadius="md"
        >
          <Text color="red.600" fontSize="sm" fontWeight="semibold">
            ⚠ This action cannot be undone
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Deleting this product will permanently remove it from your store.
          </Text>
        </Box>

        {/* Action Buttons */}
        <Flex justify="flex-end" gap={3}>
          <Button ref={cancelRef} onClick={onClose} variant="outline">
            Cancel
          </Button>

          <Button colorScheme="red" onClick={onConfirm}>
            Delete Product
          </Button>
        </Flex>
      </Stack>
    </FormModel>
  );
};

export default DeleteProductDialog;
