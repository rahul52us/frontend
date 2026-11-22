"use client";

import {
  Button,
  Checkbox,
  Circle,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { FiCompass, FiMapPin } from "react-icons/fi";
import BottomSheetDrawer from "../../../../../component/common/Drawer/BottomSheetDrawer";

export const AddressForm = memo(
  ({
    currentAddress,
    onSubmit,
  }: {
    currentAddress?: any;
    onSubmit: any;
  }) => {
    const toast = useToast();
    const [isDetecting, setIsDetecting] = useState(false);

    // Form field states for automatic fill
    const [formData, setFormData] = useState({
      name: currentAddress?.name || "",
      phone: currentAddress?.phone || "",
      line1: currentAddress?.line1 || currentAddress?.addressLine1 || "",
      line2: currentAddress?.line2 || currentAddress?.addressLine2 || "",
      city: currentAddress?.city || "",
      state: currentAddress?.state || "",
      postalCode: currentAddress?.postalCode || "",
      country: currentAddress?.country || "India",
      isDefault: Boolean(currentAddress?.isDefault),
    });

    useEffect(() => {
      if (currentAddress) {
        setFormData({
          name: currentAddress?.name || "",
          phone: currentAddress?.phone || "",
          line1: currentAddress?.line1 || currentAddress?.addressLine1 || "",
          line2: currentAddress?.line2 || currentAddress?.addressLine2 || "",
          city: currentAddress?.city || "",
          state: currentAddress?.state || "",
          postalCode: currentAddress?.postalCode || "",
          country: currentAddress?.country || "India",
          isDefault: Boolean(currentAddress?.isDefault),
        });
      }
    }, [currentAddress]);

    // Handle GPS Auto-detect and Autofill Form Fields
    const handleAutoFillGPS = () => {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation not supported",
          description: "Your browser does not support GPS location.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await res.json();
            const addr = data.address || {};

            const detectedCity =
              addr.city || addr.town || addr.village || addr.suburb || "Gwalior";
            const detectedState = addr.state || "Madhya Pradesh";
            const detectedPostal = addr.postcode || "474001";
            const detectedRoad =
              [addr.house_number, addr.road, addr.neighbourhood]
                .filter(Boolean)
                .join(", ") || addr.suburb || "Main Road";
            const detectedArea = addr.suburb || addr.city_district || "";

            setFormData((prev) => ({
              ...prev,
              name: prev.name || "Current Location",
              line1: detectedRoad,
              line2: detectedArea,
              city: detectedCity,
              state: detectedState,
              postalCode: detectedPostal,
              country: addr.country || "India",
            }));

            toast({
              title: "Location detected & autofilled!",
              description: `${detectedCity}, ${detectedPostal}`,
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
          } catch (err) {
            toast({
              title: "Couldn't fetch address details",
              description: "Please enter your address manually.",
              status: "warning",
              duration: 3000,
            });
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          setIsDetecting(false);
          toast({
            title: "GPS Permission Denied",
            description: "Please enable location permission in browser.",
            status: "warning",
            duration: 3500,
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    return (
      <form onSubmit={onSubmit} id="address-form">
        <VStack spacing={3.5} align="stretch">
          {/* Quick GPS Auto-detect Button */}
          <HStack
            as="button"
            type="button"
            onClick={handleAutoFillGPS}
            p={3}
            borderRadius="xl"
            border="1.5px dashed"
            borderColor="var(--color-primary)"
            bg="var(--color-primary-soft)"
            _hover={{ opacity: 0.9, transform: "scale(1.01)" }}
            transition="all 0.2s ease"
            w="full"
            justify="space-between"
            cursor="pointer"
          >
            <HStack spacing={2.5}>
              <Circle size="30px" bg="var(--color-primary)" color="white">
                {isDetecting ? (
                  <Spinner size="xs" color="white" />
                ) : (
                  <Icon as={FiCompass} boxSize={3.5} />
                )}
              </Circle>
              <VStack align="flex-start" spacing={0} textAlign="left">
                <Text fontSize="12.5px" fontWeight="800" color="var(--color-primary)">
                  {isDetecting ? "Detecting GPS location..." : "Use Current Location (Auto-fill)"}
                </Text>
                <Text fontSize="10.5px" color="gray.500">
                  Tap to autofill house, area, city & PIN automatically
                </Text>
              </VStack>
            </HStack>
            <Text fontSize="11px" fontWeight="700" color="var(--color-primary)">
              📍 GPS
            </Text>
          </HStack>

          <FormControl isRequired>
            <FormLabel fontWeight="600" fontSize="xs" color="var(--color-text)">
              Address Label / Name
            </FormLabel>
            <Input
              name="name"
              placeholder="e.g. Home, Work, Parents"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              Address Line 1 (House/Flat No., Road)
            </FormLabel>
            <Input
              name="line1"
              placeholder="Street address or flat number"
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
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
              value={formData.line2}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
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
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
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
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
              isChecked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
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
  }
);
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

  if (isMobile) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? "Edit Address" : "Add New Address"}
        footer={
          <Button
            type="submit"
            form="address-form"
            colorScheme="brand"
            bg="var(--color-primary)"
            color="white"
            w="full"
            size="md"
            rounded="xl"
          >
            Save Address
          </Button>
        }
      >
        <AddressForm currentAddress={currentAddress} onSubmit={handleSubmit} />
      </BottomSheetDrawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="var(--color-surface)"
        borderColor="var(--color-border)"
        borderWidth="1px"
        rounded="2xl"
        p={2}
      >
        <ModalHeader fontSize="lg" fontWeight="bold" color="var(--color-text)">
          {isEditing ? "Edit Address" : "Add New Address"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={2}>
          <AddressForm currentAddress={currentAddress} onSubmit={handleSubmit} />
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} rounded="xl" size="md">
            Cancel
          </Button>
          <Button
            type="submit"
            form="address-form"
            colorScheme="brand"
            bg="var(--color-primary)"
            color="white"
            rounded="xl"
            size="md"
          >
            Save Address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddressModal;
