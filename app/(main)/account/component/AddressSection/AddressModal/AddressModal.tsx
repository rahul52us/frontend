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
  } from "@chakra-ui/react";
  
  export const AddressForm = ({ currentAddress, onSubmit }) => {
    return (
      <form onSubmit={onSubmit} id="address-form">
        <VStack spacing={5} align="stretch">
          <FormControl>
            <FormLabel fontWeight="bold">Address Name</FormLabel>
            <Input name="name" placeholder="Home, Work, etc." defaultValue={currentAddress?.name || ""} />
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold">Address Line 1</FormLabel>
            <Input name="line1" placeholder="Street address" defaultValue={currentAddress?.line1 || ""} />
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold">Address Line 2 (Optional)</FormLabel>
            <Input name="line2" placeholder="Apartment, suite, unit, etc." defaultValue={currentAddress?.line2 || ""} />
          </FormControl>
  
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)"}} gap={4}>
            <FormControl>
              <FormLabel fontWeight="bold">City</FormLabel>
              <Input name="city" placeholder="City" defaultValue={currentAddress?.city || ""} />
            </FormControl>
  
            <FormControl>
              <FormLabel fontWeight="bold">State/Province</FormLabel>
              <Input name="state" placeholder="State" defaultValue={currentAddress?.state || ""} />
            </FormControl>
          </Grid>
  
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)"}} gap={4}>
            <FormControl>
              <FormLabel fontWeight="bold">Postal Code</FormLabel>
              <Input name="postalCode" placeholder="Postal code" defaultValue={currentAddress?.postalCode || ""} />
            </FormControl>
  
            <FormControl>
              <FormLabel fontWeight="bold">Country</FormLabel>
              <Input name="country" placeholder="Country" defaultValue={currentAddress?.country || ""} />
            </FormControl>
          </Grid>
  
          <FormControl>
            <Checkbox name="isDefault" defaultChecked={currentAddress?.isDefault || false}>
              Set as default address
            </Checkbox>
          </FormControl>
        </VStack>
      </form>
    );
  };
  
  const AddressModal = ({ isOpen, onClose, currentAddress, isEditing, handleSubmit }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={4} boxShadow="xl">
          <ModalHeader>{isEditing ? "Edit Address" : "Add New Address"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddressForm currentAddress={currentAddress}  onSubmit={handleSubmit} />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" form="address-form" colorScheme="blue" width="full">
              {isEditing ? "Save Changes" : "Add Address"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default AddressModal;