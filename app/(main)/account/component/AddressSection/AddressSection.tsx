"use client";

import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AddressCard from "./AddressCard/AddressCard";
import AddressModal from "./AddressModal/AddressModal";
import { initialAddresses } from "./utils/constant";
import GetCurrentLocation from "../../../../component/common/Locations/GetCurrentLocation";

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
      }))
    );
    toast({
      title: "Default address updated",
      description: "Your default address has been updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = Object.fromEntries(formData.entries());
    data.isDefault = data.isDefault === "on";

    if (isEditing && currentAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === currentAddress.id
            ? { ...data, id: currentAddress.id }
            : data.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
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
        const updatedAddresses = data.isDefault
          ? prev.map((addr) => ({ ...addr, isDefault: false }))
          : [...prev];
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
      <GetCurrentLocation />
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading as="h2" size="md" fontWeight="bold">
            My Addresses
          </Heading>
          <Text color="gray.500">
            Manage your shipping and billing addresses
          </Text>
        </Box>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
        gap={6}
      >
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

      <AddressModal
        isOpen={isOpen}
        onClose={onClose}
        currentAddress={currentAddress}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
});
