"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaPlus } from "react-icons/fa";
import ConfirmationModal from "../../../../component/common/ConfirmationModal/ConfirmationModal";
import GetCurrentLocation from "../../../../component/common/Locations/GetCurrentLocation";
import stores from "../../../../store/stores";
import AddressCard from "./AddressCard/AddressCard";
import AddressModal from "./AddressModal/AddressModal";

export const AddressesSection = observer(() => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { auth } = stores;

  // Local state for modal management
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme tokens (hoisted above any early return)
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const emptyBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const emptyBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const emptyTileBg = useColorModeValue("purple.50", "whiteAlpha.100");
  const emptyTileColor = useColorModeValue("purple.500", "purple.200");

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
    setIsDeleting(true);
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
      setIsDeleting(false);
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
      isDefault: data.isDefault === "on",
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

  const isInitialLoading = auth.isLoading && auth.addresses.length === 0;

  // Default address first, then the rest in their existing order
  const sortedAddresses = [...auth.addresses].sort(
    (a: any, b: any) => Number(!!b.isDefault) - Number(!!a.isDefault)
  );

  const gridColumns = { base: "1fr", lg: "repeat(2, 1fr)" };

  return (
    <Box>
      {/* <GetCurrentLocation /> */}

      {/* Header */}
      <Flex justify="space-between" align="center" gap={3} mb={5}>
        <Box minW={0}>
          <Heading as="h2" size="md" color={headingColor}>
            My addresses
          </Heading>
          <Text fontSize="sm" color={mutedColor} mt={0.5}>
            Where we deliver your orders
          </Text>
        </Box>

        {sortedAddresses.length > 0 && (
          <Button
            leftIcon={<FaPlus size="12px" />}
            colorScheme="purple"
            size="sm"
            h={10}
            px={4}
            rounded="full"
            flexShrink={0}
            onClick={handleAddNew}
          >
            Add new
          </Button>
        )}
      </Flex>

      {/* Loading skeletons */}
      {isInitialLoading && (
        <Grid templateColumns={gridColumns} gap={{ base: 3, md: 5 }}>
          <Skeleton h="190px" rounded="2xl" />
          <Skeleton h="190px" rounded="2xl" />
        </Grid>
      )}

      {/* Empty state */}
      {!isInitialLoading && sortedAddresses.length === 0 && (
        <VStack
          spacing={3}
          py={10}
          px={6}
          bg={emptyBg}
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={emptyBorder}
          rounded="2xl"
          textAlign="center"
        >
          <Flex
            boxSize={14}
            align="center"
            justify="center"
            rounded="2xl"
            bg={emptyTileBg}
            color={emptyTileColor}
          >
            <Icon as={FaMapMarkedAlt} boxSize={6} />
          </Flex>
          <Box>
            <Text fontWeight="bold" color={headingColor}>
              No saved addresses
            </Text>
            <Text fontSize="sm" color={mutedColor} mt={1}>
              Add an address to check out faster.
            </Text>
          </Box>
          <Button
            leftIcon={<FaPlus size="12px" />}
            colorScheme="purple"
            h={12}
            px={6}
            rounded="xl"
            w={{ base: "full", sm: "auto" }}
            onClick={handleAddNew}
          >
            Add address
          </Button>
        </VStack>
      )}

      {/* Address list */}
      {!isInitialLoading && sortedAddresses.length > 0 && (
        <Grid templateColumns={gridColumns} gap={{ base: 3, md: 5 }}>
          {sortedAddresses.map((address: any) => (
            <AddressCard
              key={address._id || address.id}
              address={address}
              handleEdit={handleEdit}
              handleSetDefault={handleSetDefault}
              handleDelete={handleDeleteClick}
            />
          ))}
        </Grid>
      )}

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
          title="Delete address"
          message={`Are you sure you want to delete ${deletingAddress.name}?`}
          confirmText="Delete"
          confirmButtonProps={{ colorScheme: "red", isLoading: isDeleting }}
          cancelText="Cancel"
        />
      )}
    </Box>
  );
});