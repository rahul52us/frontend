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

  interface Address {
    id: number;
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }

  interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    addresses: Address[];
    selectedAddress: number;
    onSelectAddress: any;
    onAddNewAddress: any;
    isEditing?: boolean;
    currentAddress?: Address;
  }

  const AddressModal = ({
    isOpen,
    onClose,
    addresses,
    selectedAddress,
    onSelectAddress,
    onAddNewAddress,
    isEditing = false,
    currentAddress
  }: AddressModalProps) => {
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
    const [tempSelectedAddress, setTempSelectedAddress] = useState(selectedAddress)

    const handleSaveAddress = async (e: React.FormEvent) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget as HTMLFormElement)

      const newAddress = {
        name: formData.get('name') as string,
        line1: formData.get('line1') as string,
        line2: formData.get('line2') as string || undefined,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
        isDefault: formData.get('isDefault') === 'on'
      }

      await onAddNewAddress(newAddress)
      setIsAddingNewAddress(false)
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
                {isAddingNewAddress &&  (

                    <Icon as={ChevronLeftIcon} onClick={() => setIsAddingNewAddress(false)} cursor="pointer" />
                )}
              <Text fontSize="lg" fontWeight="bold">
                {isAddingNewAddress || isEditing ?
                  (isEditing ? "Edit Address" : "Add New Address") :
                  "Select Delivery Address"}
              </Text>
              <ModalCloseButton />
            </Flex>
          </ModalHeader>

          <ModalBody py={4}>
            {!(isAddingNewAddress || isEditing) ? (
              <>
                <RadioGroup
                  value={tempSelectedAddress.toString()}
                  onChange={(value) => setTempSelectedAddress(parseInt(value))}
                >
                  <Stack spacing={4}>
                    {addresses.map(address => (
                      <Box
                        key={address.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        cursor="pointer"
                        _hover={{ borderColor: 'purple.300' }}
                        borderColor={address.id === tempSelectedAddress ? 'purple.500' : 'gray.200'}
                      >
                        <Radio value={address.id.toString()} spacing={3} w="full">
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
                              {address.line1}{address.line2 ? `, ${address.line2}` : ''}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              {address.city}, {address.state} {address.postalCode}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              {address.country}
                            </Text>
                          </Box>
                        </Radio>
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
                currentAddress={isEditing ? currentAddress : undefined}
                onSubmit={handleSaveAddress}
              />
            )}
          </ModalBody>

          {!(isAddingNewAddress || isEditing) ? (
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
                {isEditing ? "Save Changes" : "Add Address"}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    )
  }

  export default AddressModal