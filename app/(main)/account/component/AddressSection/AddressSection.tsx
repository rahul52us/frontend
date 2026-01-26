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
  VStack,
  Spinner,
  Center
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import AddressCard from "./AddressCard/AddressCard";
import AddressModal from "./AddressModal/AddressModal";
import GetCurrentLocation from "../../../../component/common/Locations/GetCurrentLocation";
import stores from "../../../../store/stores";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";

export const AddressesSection = observer(() => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { auth } = stores;

  // Local state for modal management
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<any>(null);

  useEffect(() => {
    if (auth.token && auth.addresses.length === 0) {
      auth.fetchAddresses();
    }
  }, [auth.token, auth.addresses.length, auth]);

  const handleAddNew = () => {
    setCurrentAddress(null);
    setIsEditing(false);
    onOpen();
  };

  const handleEdit = (address: any) => {
    setCurrentAddress(address);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteClick = (address: any) => {
    setDeletingAddress(address);
  };

  const confirmDelete = async () => {
    if (!deletingAddress) return;
    try {
      await auth.deleteAddress(deletingAddress._id || deletingAddress.id);
      toast({
        title: "Address removed",
        description: "The address has been removed from your account.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({ title: "Failed to delete address", status: "error" });
    } finally {
      setDeletingAddress(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    const address = auth.addresses.find((a: any) => (a._id || a.id) === id);
    if (address) {
      try {
        await auth.updateAddress(id, { ...address, isDefault: true });
        toast({
          title: "Default address updated",
          description: "Your default address has been updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch {
        // console.error(e); // Removed
        toast({ title: "Failed to set default", status: "error" });
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = Object.fromEntries(formData.entries());

    const addressData = {
      name: data.name,
      phone: data.phone,
      addressLine1: data.line1,
      line1: data.line1,
      addressLine2: data.line2,
      line2: data.line2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      isDefault: data.isDefault === "on"
    };

    try {
      if (isEditing && currentAddress) {
        await auth.updateAddress(currentAddress._id || currentAddress.id, addressData);
        toast({
          title: "Address updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await auth.addAddress(addressData);
        toast({
          title: "Address added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch {
      toast({ title: "Operation failed", description: "Could not save address", status: "error" });
    }
  };

  if (auth.isLoading && auth.addresses.length === 0) {
    return <Center py={10}><Spinner /></Center>;
  }

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
        {auth.addresses.map((address: any) => (
          <AddressCard
            key={address._id || address.id}
            address={address}
            handleEdit={handleEdit}
            handleSetDefault={handleSetDefault}
            handleDelete={handleDeleteClick}
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

      {deletingAddress && (
        <ConfirmationModal
          isOpen={!!deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={confirmDelete}
          title="Delete Address"
          message={`Are you sure you want to delete ${deletingAddress.name}?`}
          confirmText="Delete"
          confirmButtonProps={{ colorScheme: "red" }}
          cancelText="Cancel"
        />
      )}
    </Box>
  );
});
