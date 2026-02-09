"use client";
import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button, Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup, Stack,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { AddressForm } from '../../../../(main)/account/component/AddressSection/AddressModal/AddressModal';
import ConfirmationModal from '../../../common/ConfirmationModal/ConfirmationModal';

interface Address {
  _id: string; // Backend uses _id
  name: string;
  fullName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: any[]; // Relaxing type to any for now to avoid conflicts with backend schema or update interface below
  selectedAddress: string;
  onSelectAddress: any;
  onAddNewAddress: any;
  isEditing?: boolean;
  currentAddress?: Address;
  onUpdateAddress?: any;
  onDeleteAddress?: any; // New prop
}

const AddressModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
  onUpdateAddress,
  onDeleteAddress
}: AddressModalProps) => {
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deletingAddress, setDeletingAddress] = useState<any>(null);
  const [tempSelectedAddress, setTempSelectedAddress] = useState<any>(selectedAddress)

  const handleEditClick = (address: any) => {
    setEditingAddress(address);
    setIsEditingMode(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    const newAddress = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      addressLine1: formData.get('line1') as string,
      line1: formData.get('line1') as string, // Keep for legacy if needed, but addressLine1 is main
      line2: formData.get('line2') as string || undefined,
      addressLine2: formData.get('line2') as string || undefined,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      isDefault: formData.get('isDefault') === 'on'
    }

    if (isEditingMode && onUpdateAddress && editingAddress) {
      await onUpdateAddress(editingAddress._id, newAddress);
      setIsEditingMode(false);
      setEditingAddress(null);
    } else {
      await onAddNewAddress(newAddress)
      setIsAddingNewAddress(false)
    }
  }

  const handleSelectAddress = () => {
    onSelectAddress(tempSelectedAddress)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px">
          <Flex gap={2} align="center">
            {(isAddingNewAddress || isEditingMode) && (

              <Icon as={ChevronLeftIcon} onClick={() => {
                setIsAddingNewAddress(false);
                setIsEditingMode(false);
                setEditingAddress(null);
              }} cursor="pointer" />
            )}
            <Text fontSize="lg" fontWeight="bold">
              {isAddingNewAddress || isEditingMode ?
                (isEditingMode ? "Edit Address" : "Add New Address") :
                "Select Delivery Address"}
            </Text>
            <ModalCloseButton />
          </Flex>
        </ModalHeader>

        <ModalBody py={4}>
          {!(isAddingNewAddress || isEditingMode) ? (
            <>
              <RadioGroup
                value={tempSelectedAddress ? tempSelectedAddress.toString() : ""}
                onChange={(value) => setTempSelectedAddress(value)}
              >
                <Stack spacing={4}>
                  {addresses.map((address: any, idx: number) => (
                    <Box
                      key={address._id || address.id || idx}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                      cursor="pointer"
                      _hover={{ borderColor: 'purple.300' }}
                      borderColor={(address._id || address.id) === tempSelectedAddress ? 'purple.500' : 'gray.200'}
                      position="relative"
                    >
                      <Radio value={address._id || address.id} spacing={3} w="full">
                        <Box ml={2}>
                          <Flex justify="space-between">
                            <Text fontWeight="bold">{address.name}</Text>
                            {address.isDefault && (
                              <Box bg="purple.100" px={2} py={1} borderRadius="md">
                                <Text fontSize="xs" color="purple.800">Default</Text>
                              </Box>
                            )}
                          </Flex>
                          <Text fontSize="sm" color="gray.600" mt={1}>
                            {address.addressLine1 || address.line1}{address.addressLine2 || address.line2 ? `, ${address.addressLine2 || address.line2}` : ''}
                          </Text>
                          <Text fontSize="sm" color="gray.600" mt={1}>
                            {address.city}, {address.state} {address.postalCode}
                          </Text>
                          <Text fontSize="sm" color="gray.600" mt={1}>
                            {address.country}
                          </Text>
                        </Box>
                      </Radio>
                      <Flex position="absolute" top={4} right={4} gap={2}>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditClick(address);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (onDeleteAddress) setDeletingAddress(address);
                          }}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>

              <Button
                leftIcon={<Icon as={FaPlus} />}
                variant="outline"
                colorScheme="purple"
                w="full"
                mt={4}
                onClick={() => setIsAddingNewAddress(true)}
              >
                Add New Address
              </Button>
            </>
          ) : (
            <AddressForm
              currentAddress={isEditingMode ? editingAddress : undefined}
              onSubmit={handleSaveAddress}
            />
          )}
        </ModalBody>

        {!(isAddingNewAddress || isEditingMode) ? (
          <ModalFooter borderTopWidth="1px">
            <Button
              colorScheme="purple"
              w="full"
              onClick={handleSelectAddress}
            >
              Deliver to this Address
            </Button>
          </ModalFooter>
        ) : (
          <ModalFooter borderTopWidth="1px">
            <Button
              type="submit"
              form="address-form"
              colorScheme="purple"
              w="full"
            >
              {isEditingMode ? "Save Changes" : "Add Address"}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>

      {/* Delete Confirmation Modal */}
      {deletingAddress && (
        <ConfirmationModal
          isOpen={!!deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={async () => {
            if (deletingAddress && onDeleteAddress) {
              await onDeleteAddress(deletingAddress._id || deletingAddress.id);
              setDeletingAddress(null);
            }
          }}
          title="Delete Address"
          message={`Are you sure you want to delete ${deletingAddress.name}?`}
          confirmText="Delete"
          confirmButtonProps={{ colorScheme: "red" }}
          cancelText="Cancel"
        />
      )}
    </Modal>
  )
}

export default AddressModal