"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Checkbox,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { memo } from "react";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";

export const AddressForm = memo(({ currentAddress, onSubmit }: { currentAddress?: any; onSubmit: any }) => {
  return (
    <form onSubmit={onSubmit} id="address-form">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
            Address Label / Name
          </FormLabel>
          <Input
            name="name"
            placeholder="e.g. Home, Work, Parents"
            defaultValue={currentAddress?.name || ""}
            rounded="lg"
            fontSize="sm"
            bg="var(--color-surface)"
            borderColor="var(--color-border)"
            color="var(--color-text)"
            _placeholder={{ color: "var(--color-text-muted)" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
            Phone Number
          </FormLabel>
          <Input
            name="phone"
            type="tel"
            placeholder="10-digit mobile number"
            defaultValue={currentAddress?.phone || ""}
            rounded="lg"
            fontSize="sm"
            bg="var(--color-surface)"
            borderColor="var(--color-border)"
            color="var(--color-text)"
            _placeholder={{ color: "var(--color-text-muted)" }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
            Address Line 1 (House/Flat No., Building)
          </FormLabel>
          <Input
            name="line1"
            placeholder="Street address or flat number"
            defaultValue={currentAddress?.line1 || currentAddress?.addressLine1 || ""}
            rounded="lg"
            fontSize="sm"
            bg="var(--color-surface)"
            borderColor="var(--color-border)"
            color="var(--color-text)"
            _placeholder={{ color: "var(--color-text-muted)" }}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
            Address Line 2 (Area, Landmark) (Optional)
          </FormLabel>
          <Input
            name="line2"
            placeholder="Area, colony or nearby landmark"
            defaultValue={currentAddress?.line2 || currentAddress?.addressLine2 || ""}
            rounded="lg"
            fontSize="sm"
            bg="var(--color-surface)"
            borderColor="var(--color-border)"
            color="var(--color-text)"
            _placeholder={{ color: "var(--color-text-muted)" }}
          />
        </FormControl>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
              City
            </FormLabel>
            <Input
              name="city"
              placeholder="City"
              defaultValue={currentAddress?.city || ""}
              rounded="lg"
              fontSize="sm"
              bg="var(--color-surface)"
              borderColor="var(--color-border)"
              color="var(--color-text)"
              _placeholder={{ color: "var(--color-text-muted)" }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
              State
            </FormLabel>
            <Input
              name="state"
              placeholder="State"
              defaultValue={currentAddress?.state || ""}
              rounded="lg"
              fontSize="sm"
              bg="var(--color-surface)"
              borderColor="var(--color-border)"
              color="var(--color-text)"
              _placeholder={{ color: "var(--color-text-muted)" }}
            />
          </FormControl>
        </Grid>

        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
              PIN / Postal Code
            </FormLabel>
            <Input
              name="postalCode"
              placeholder="6-digit PIN"
              defaultValue={currentAddress?.postalCode || ""}
              rounded="lg"
              fontSize="sm"
              bg="var(--color-surface)"
              borderColor="var(--color-border)"
              color="var(--color-text)"
              _placeholder={{ color: "var(--color-text-muted)" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
              Country
            </FormLabel>
            <Input
              name="country"
              placeholder="India"
              defaultValue={currentAddress?.country || "India"}
              rounded="lg"
              fontSize="sm"
              bg="var(--color-surface)"
              borderColor="var(--color-border)"
              color="var(--color-text)"
              _placeholder={{ color: "var(--color-text-muted)" }}
            />
          </FormControl>
        </Grid>

        <FormControl pt={1}>
          <Checkbox
            name="isDefault"
            defaultChecked={Boolean(currentAddress?.isDefault)}
            colorScheme="brand"
            color="var(--color-text)"
            fontSize="sm"
          >
            Set as default delivery address
          </Checkbox>
        </FormControl>
      </VStack>
    </form>
  );
});
AddressForm.displayName = "AddressForm";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress?: any;
  isEditing?: boolean;
  handleSubmit: (e: any) => Promise<any> | void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  isEditing,
  handleSubmit,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const title = isEditing ? "Edit Address" : "Add New Address";

  const formElement = (
    <AddressForm currentAddress={currentAddress} onSubmit={handleSubmit} />
  );

  const footerButton = (
    <Button
      type="submit"
      form="address-form"
      colorScheme="brand"
      width="full"
      h="44px"
      rounded="xl"
      fontWeight="700"
    >
      {isEditing ? "Save Changes" : "Save Address"}
    </Button>
  );

  if (isMobile) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        footer={footerButton}
        contentProps={{ maxH: "88dvh" }}
        bodyProps={{ overflowY: "auto", px: 4 }}
      >
        {formElement}
      </BottomSheetDrawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" p={2} boxShadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100" py={3.5}>
          {title}
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody py={4} maxH="65vh" overflowY="auto">
          {formElement}
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.100" py={3}>
          {footerButton}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(AddressModal);
