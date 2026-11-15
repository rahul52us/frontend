"use client";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaLocationDot, FaPlus, FaTrash, FaPen } from "react-icons/fa6";
import { AddressForm } from "../../../../(main)/account/component/AddressSection/AddressModal/AddressModal";
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import BottomSheetDrawer from "../../../common/Drawer/BottomSheetDrawer";
import useRegisterOverlay from "../../../../hooks/useRegisterOverlay";

interface Address {
  _id?: string;
  id?: string;
  name: string;
  fullName?: string;
  addressLine1: string;
  addressLine2?: string;
  line1?: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  phone?: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: any[];
  selectedAddress: string;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: (address: any) => Promise<any> | void;
  onUpdateAddress?: (id: string, address: any) => Promise<any> | void;
  onDeleteAddress?: (id: string) => Promise<any> | void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  onUpdateAddress,
  onDeleteAddress,
}) => {
  // Register address modal for native back button dismissal with priority over parent drawer
  useRegisterOverlay(isOpen, onClose, 'delivery_address_modal', 5);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deletingAddress, setDeletingAddress] = useState<any>(null);
  const [tempSelectedAddress, setTempSelectedAddress] = useState<string>(selectedAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tempSelectedAddress when modal opens or selectedAddress changes
  useEffect(() => {
    setTempSelectedAddress(selectedAddress);
  }, [selectedAddress, isOpen]);

  // Reset internal states when modal closes
  const handleClose = () => {
    setIsAddingNewAddress(false);
    setIsEditingMode(false);
    setEditingAddress(null);
    onClose();
  };

  const handleEditClick = (address: any) => {
    setEditingAddress(address);
    setIsEditingMode(true);
    setIsAddingNewAddress(false);
  };

  const handleBackToList = () => {
    setIsAddingNewAddress(false);
    setIsEditingMode(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const newAddress = {
      name: (formData.get("name") as string) || "Home",
      phone: (formData.get("phone") as string) || "",
      addressLine1: (formData.get("line1") as string) || "",
      line1: (formData.get("line1") as string) || "",
      line2: (formData.get("line2") as string) || undefined,
      addressLine2: (formData.get("line2") as string) || undefined,
      city: (formData.get("city") as string) || "",
      state: (formData.get("state") as string) || "",
      postalCode: (formData.get("postalCode") as string) || "",
      country: (formData.get("country") as string) || "India",
      isDefault: formData.get("isDefault") === "on",
    };

    try {
      setIsSubmitting(true);
      if (isEditingMode && onUpdateAddress && editingAddress) {
        const id = editingAddress._id || editingAddress.id;
        await onUpdateAddress(id, newAddress);
      } else {
        await onAddNewAddress(newAddress);
      }
      handleBackToList();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAddress = () => {
    if (tempSelectedAddress) {
      onSelectAddress(tempSelectedAddress);
    }
    handleClose();
  };

  const isFormMode = isAddingNewAddress || isEditingMode;

  const titleText = isAddingNewAddress
    ? "Add New Address"
    : isEditingMode
    ? "Edit Address"
    : "Select Delivery Address";

  // Reusable Body Content
  const renderBodyContent = () => {
    if (isFormMode) {
      return (
        <Box py={2}>
          <AddressForm
            currentAddress={isEditingMode ? editingAddress : undefined}
            onSubmit={handleSaveAddress}
          />
        </Box>
      );
    }

    return (
      <Box py={2}>
        {addresses.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Icon as={FaLocationDot} boxSize={8} color="var(--color-primary)" mb={3} />
            <Text fontWeight="600" color="var(--color-text)" fontSize="md">
              No addresses saved yet
            </Text>
            <Text fontSize="xs" color="var(--color-text-muted)" mt={1} mb={4}>
              Add your delivery address to proceed with checkout.
            </Text>
          </Box>
        ) : (
          <RadioGroup
            value={tempSelectedAddress ? tempSelectedAddress.toString() : ""}
            onChange={(val) => setTempSelectedAddress(val)}
          >
            <Stack spacing={3}>
              {addresses.map((address: any, idx: number) => {
                const addrId = address._id || address.id || String(idx);
                const isChecked = tempSelectedAddress === addrId;

                return (
                  <Box
                    key={addrId}
                    borderWidth="1.5px"
                    borderRadius="xl"
                    p={3.5}
                    cursor="pointer"
                    transition="all 0.15s ease"
                    borderColor={isChecked ? "var(--color-primary)" : "var(--color-border)"}
                    bg={isChecked ? "var(--color-primary-soft)" : "var(--color-surface)"}
                    boxShadow={isChecked ? "0 2px 8px rgba(6, 95, 104, 0.15)" : "none"}
                    onClick={() => setTempSelectedAddress(addrId)}
                    position="relative"
                  >
                    <Flex align="flex-start" gap={3}>
                      <Radio
                        value={addrId}
                        colorScheme="brand"
                        mt={1}
                        size="md"
                      />

                      <Box flex="1" minW={0} pr={14}>
                        <HStack spacing={2} align="center">
                          <Text fontWeight="700" fontSize="sm" color="var(--color-text)">
                            {address.name || "Delivery Address"}
                          </Text>
                          {address.isDefault && (
                            <Badge
                              colorScheme="brand"
                              variant="subtle"
                              fontSize="2xs"
                              px={1.5}
                              rounded="md"
                            >
                              Default
                            </Badge>
                          )}
                        </HStack>

                        <Text fontSize="xs" color="var(--color-text-muted)" mt={1} lineHeight="1.4">
                          {[
                            address.addressLine1 || address.line1,
                            address.addressLine2 || address.line2,
                            address.city,
                            address.state,
                            address.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>

                        {address.phone && (
                          <Text fontSize="2xs" color="var(--color-text-muted)" mt={1}>
                            Phone: {address.phone}
                          </Text>
                        )}
                      </Box>
                    </Flex>

                    {/* Action buttons (Edit & Delete) */}
                    <HStack
                      position="absolute"
                      top={3}
                      right={3}
                      spacing={1}
                    >
                      <IconButton
                        aria-label="Edit address"
                        icon={<FaPen size={11} />}
                        size="xs"
                        variant="ghost"
                        colorScheme="brand"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(address);
                        }}
                      />
                      {onDeleteAddress && (
                        <IconButton
                          aria-label="Delete address"
                          icon={<FaTrash size={11} />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingAddress(address);
                          }}
                        />
                      )}
                    </HStack>
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        )}

        {/* Add New Address Button */}
        <Button
          leftIcon={<FaPlus size={12} />}
          variant="outline"
          colorScheme="brand"
          w="full"
          h="44px"
          rounded="xl"
          mt={3.5}
          fontWeight="600"
          fontSize="sm"
          onClick={() => {
            setEditingAddress(null);
            setIsEditingMode(false);
            setIsAddingNewAddress(true);
          }}
        >
          Add New Address
        </Button>
      </Box>
    );
  };

  // Reusable Footer Content
  const renderFooterContent = () => {
    if (isFormMode) {
      return (
        <Button
          type="submit"
          form="address-form"
          colorScheme="brand"
          w="full"
          h="46px"
          rounded="xl"
          fontWeight="700"
          isLoading={isSubmitting}
        >
          {isEditingMode ? "Save Changes" : "Save Address"}
        </Button>
      );
    }

    return (
      <Button
        colorScheme="brand"
        w="full"
        h="46px"
        rounded="xl"
        fontWeight="700"
        isDisabled={addresses.length === 0 || !tempSelectedAddress}
        onClick={handleSelectAddress}
      >
        Deliver to this Address
      </Button>
    );
  };

  return (
    <>
      {/* ─── Mobile View: BottomSheetDrawer ─── */}
      {isMobile ? (
        <BottomSheetDrawer
          isOpen={isOpen}
          onClose={handleClose}
          showHandle={true}
          title={
            <Flex align="center" gap={2}>
              {isFormMode && (
                <IconButton
                  aria-label="Back to address list"
                  icon={<ChevronLeftIcon boxSize={6} />}
                  size="xs"
                  variant="ghost"
                  onClick={handleBackToList}
                />
              )}
              <Text fontSize="md" fontWeight="700">
                {titleText}
              </Text>
            </Flex>
          }
          footer={renderFooterContent()}
          contentProps={{
            maxH: "88dvh",
          }}
          bodyProps={{
            overflowY: "auto",
            px: 4,
          }}
        >
          {renderBodyContent()}
        </BottomSheetDrawer>
      ) : (
        /* ─── Desktop View: Centered Modal ─── */
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <ModalContent borderRadius="2xl" overflow="hidden">
            <ModalHeader borderBottomWidth="1px" borderColor="var(--color-border)" py={4}>
              <Flex align="center" justify="space-between">
                <Flex align="center" gap={2}>
                  {isFormMode && (
                    <IconButton
                      aria-label="Back to address list"
                      icon={<ChevronLeftIcon boxSize={6} />}
                      size="xs"
                      variant="ghost"
                      onClick={handleBackToList}
                    />
                  )}
                  <Text fontSize="lg" fontWeight="700">
                    {titleText}
                  </Text>
                </Flex>
                <ModalCloseButton position="static" />
              </Flex>
            </ModalHeader>

            <ModalBody py={4} maxH="65vh" overflowY="auto">
              {renderBodyContent()}
            </ModalBody>

            <ModalFooter borderTopWidth="1px" borderColor="var(--color-border)" py={3}>
              {renderFooterContent()}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAddress && (
        <ConfirmationModal
          isOpen={!!deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={async () => {
            if (deletingAddress && onDeleteAddress) {
              const id = deletingAddress._id || deletingAddress.id;
              await onDeleteAddress(id);
              setDeletingAddress(null);
            }
          }}
          title="Delete Address"
          message={`Are you sure you want to remove the address "${deletingAddress.name}"?`}
          confirmText="Delete"
          confirmButtonProps={{ colorScheme: "red" }}
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default AddressModal;
