"use client";

import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaCity, FaEdit, FaGlobeAmericas, FaHome, FaMapMarkerAlt, FaPlus, FaPlusCircle, FaTrash } from "react-icons/fa";
import AddressCard from "./AddressCard/AddressCard";

// Mock address data
const initialAddresses = [
  {
    id: 1,
    name: "Home",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: 2,
    name: "Work",
    line1: "456 Business Ave",
    line2: "Floor 12",
    city: "New York",
    state: "NY",
    postalCode: "10002",
    country: "United States",
    isDefault: false,
  },
];

export const AddressesSection = observer(() => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setCurrentAddress(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast({
      title: "Address removed",
      description: "The address has been removed from your account.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
    toast({
      title: "Default address updated",
      description: "Your default address has been updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data:any = Object.fromEntries(formData.entries());
    data.isDefault = data.isDefault === "on";

    if (isEditing && currentAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === currentAddress.id
            ? { ...data, id: currentAddress.id }
            : data.isDefault
              ? { ...addr, isDefault: false }
              : addr,
        ),
      );
      toast({
        title: "Address updated",
        description: "Your address has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add new address
      const newAddress = {
        ...data,
        id: Date.now(),
      };

      setAddresses((prev) => {
        const updatedAddresses = data.isDefault ? prev.map((addr) => ({ ...addr, isDefault: false })) : [...prev];
        return [...updatedAddresses, newAddress];
      });

      toast({
        title: "Address added",
        description: "Your new address has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading as="h2" size="md" fontWeight="bold">
            My Addresses
          </Heading>
          <Text color="gray.500">Manage your shipping and billing addresses</Text>
        </Box>
        {/* <Button leftIcon={<FaPlus />} onClick={handleAddNew}>
          Add New Address
        </Button> */}
      </Flex>

      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(2, 1fr)" }} gap={6}>
      {addresses.map((address) => (  
        <AddressCard  
          key={address.id}  
          address={address}  
          handleEdit={handleEdit}  
          handleSetDefault={handleSetDefault}  
          handleDelete={handleDelete}  
        />  
      ))}  
  
  {/* Add New Address Card */}
  <Card
    borderStyle="dashed"
    borderWidth="2px"
    borderColor="gray.200"
    _hover={{
      borderColor: "blue.300",
      bg: "blue.50",
      cursor: "pointer",
    }}
    transition="all 0.2s"
    boxShadow="none"
    borderRadius="xl"
    height="full"
    minH="120px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    onClick={handleAddNew}
  >
    <VStack color="gray.500" _hover={{ color: "blue.500" }}>
      <FaPlusCircle size={28} />
      <Text fontWeight="medium">Add New Address</Text>
    </VStack>
  </Card>
</Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Address" : "Add New Address"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} id="address-form">
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Address Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Home, Work, etc."
                    defaultValue={currentAddress?.name || ""}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Address Line 1</FormLabel>
                  <Input
                    name="line1"
                    placeholder="Street address"
                    defaultValue={currentAddress?.line1 || ""}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <Input
                    name="line2"
                    placeholder="Apartment, suite, unit, etc."
                    defaultValue={currentAddress?.line2 || ""}
                  />
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>City</FormLabel>
                    <Input name="city" placeholder="City" defaultValue={currentAddress?.city || ""} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>State/Province</FormLabel>
                    <Input name="state" placeholder="State" defaultValue={currentAddress?.state || ""} />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      name="postalCode"
                      placeholder="Postal code"
                      defaultValue={currentAddress?.postalCode || ""}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Country</FormLabel>
                    <Input
                      name="country"
                      placeholder="Country"
                      defaultValue={currentAddress?.country || ""}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <Checkbox name="isDefault" defaultChecked={currentAddress?.isDefault || false}>
                    Set as default address
                  </Checkbox>
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" form="address-form" colorScheme="blue">
              {isEditing ? "Save Changes" : "Add Address"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});