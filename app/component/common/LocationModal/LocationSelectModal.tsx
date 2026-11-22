"use client";

import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiCompass,
  FiMapPin,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import stores from "../../../store/stores";

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddNewAddress?: () => void;
}

export const LocationSelectModal = observer(
  ({ isOpen, onClose, onOpenAddNewAddress }: LocationSelectModalProps) => {
    const { auth } = stores;
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [isLocating, setIsLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchingCity, setIsSearchingCity] = useState(false);
    const [placePredictions, setPlacePredictions] = useState<any[]>([]);
    const [isSwitching, setIsSwitching] = useState<string | null>(null);

    const autocompleteServiceRef = useRef<any>(null);
    const geocoderRef = useRef<any>(null);

    // Dynamically load Google Maps Places Script
    useEffect(() => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.replace(/['"]/g, "");
      if (!apiKey) return;

      if (typeof window !== "undefined" && !(window as any).google?.maps?.places) {
        const existingScript = document.getElementById("google-maps-script");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "google-maps-script";
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.onload = () => {
            if ((window as any).google?.maps?.places) {
              autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
              geocoderRef.current = new (window as any).google.maps.Geocoder();
            }
          };
          document.head.appendChild(script);
        }
      } else if ((window as any).google?.maps?.places) {
        autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
        geocoderRef.current = new (window as any).google.maps.Geocoder();
      }
    }, []);

    // Fetch addresses if not already loaded
    useEffect(() => {
      if (isOpen && auth.token && auth.addresses.length === 0) {
        auth.fetchAddresses();
      }
    }, [isOpen, auth]);

    // Active ID: check User.defaultAddress or default flag
    const activeAddressId =
      auth.user?.defaultAddress?._id ||
      auth.user?.defaultAddress ||
      auth.addresses.find((a: any) => a.isDefault)?._id;

    // Filter saved addresses based on search query
    const filteredAddresses = auth.addresses.filter((addr: any) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (addr.name || addr.fullName || "").toLowerCase();
      const line1 = (addr.line1 || addr.addressLine1 || "").toLowerCase();
      const city = (addr.city || "").toLowerCase();
      const postal = (addr.postalCode || "").toLowerCase();
      return (
        name.includes(q) ||
        line1.includes(q) ||
        city.includes(q) ||
        postal.includes(q)
      );
    });

    // Google Places Autocomplete Query
    useEffect(() => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setPlacePredictions([]);
        return;
      }

      const timer = setTimeout(() => {
        if (autocompleteServiceRef.current) {
          setIsSearchingCity(true);
          autocompleteServiceRef.current.getPlacePredictions(
            {
              input: searchQuery.trim(),
              componentRestrictions: { country: "in" },
            },
            (predictions: any, status: any) => {
              setIsSearchingCity(false);
              if (
                status === (window as any).google?.maps?.places?.PlacesServiceStatus?.OK &&
                predictions
              ) {
                setPlacePredictions(predictions);
              } else {
                setPlacePredictions([]);
              }
            }
          );
        }
      }, 350);

      return () => clearTimeout(timer);
    }, [searchQuery]);

    // 1. Select a Saved Address & set as Default
    const handleSelectAddress = async (address: any) => {
      const addressId = address._id || address.id;
      if (!addressId) return;

      setIsSwitching(addressId);
      try {
        await auth.setDefaultAddress(addressId);
        toast({
          title: "Default delivery location updated",
          description: `Deliver to: ${address.city || address.name || "selected address"}`,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
        onClose();
      } catch (err: any) {
        toast({
          title: "Failed to switch location",
          description: err?.message || "Please try again",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSwitching(null);
      }
    };

    // 2. Select Google Place Prediction & Geocode to set Default
    const handleSelectGooglePlace = async (prediction: any) => {
      setIsLocating(true);
      try {
        if (!geocoderRef.current) {
          geocoderRef.current = new (window as any).google.maps.Geocoder();
        }

        geocoderRef.current.geocode(
          { placeId: prediction.place_id },
          async (results: any, status: any) => {
            if (status === "OK" && results?.[0]) {
              const res = results[0];
              const lat = res.geometry.location.lat();
              const lng = res.geometry.location.lng();

              let city = "";
              let state = "";
              let postalCode = "";
              let area = "";

              for (const comp of res.address_components) {
                if (comp.types.includes("locality")) city = comp.long_name;
                else if (!city && comp.types.includes("administrative_area_level_2"))
                  city = comp.long_name;
                if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
                if (comp.types.includes("postal_code")) postalCode = comp.long_name;
                if (comp.types.includes("sublocality") || comp.types.includes("neighborhood"))
                  area = comp.long_name;
              }

              const fullAddress = res.formatted_address;

              await auth.updateCurrentLocation({
                coordinates: [lng, lat],
                address: fullAddress,
                city: city || "Gwalior",
                state: state || "Madhya Pradesh",
                postalCode,
                area: area || city,
              });

              toast({
                title: "Location updated & set as default",
                description: `Deliver to: ${area || city}, ${city}`,
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top",
              });
              onClose();
            }
            setIsLocating(false);
          }
        );
      } catch {
        setIsLocating(false);
      }
    };

    // 3. Browser GPS "Use Current Location" (Google Maps Reverse Geocoding)
    const handleUseCurrentLocation = () => {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation not supported",
          description: "Your browser does not support GPS location.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            if (!geocoderRef.current && (window as any).google?.maps) {
              geocoderRef.current = new (window as any).google.maps.Geocoder();
            }

            if (geocoderRef.current) {
              geocoderRef.current.geocode(
                { location: { lat, lng } },
                async (results: any, status: any) => {
                  if (status === "OK" && results?.[0]) {
                    const res = results[0];
                    let city = "";
                    let state = "";
                    let postalCode = "";
                    let area = "";

                    for (const comp of res.address_components) {
                      if (comp.types.includes("locality")) city = comp.long_name;
                      else if (!city && comp.types.includes("administrative_area_level_2"))
                        city = comp.long_name;
                      if (comp.types.includes("administrative_area_level_1"))
                        state = comp.long_name;
                      if (comp.types.includes("postal_code")) postalCode = comp.long_name;
                      if (
                        comp.types.includes("sublocality") ||
                        comp.types.includes("neighborhood")
                      )
                        area = comp.long_name;
                    }

                    await auth.updateCurrentLocation({
                      coordinates: [lng, lat],
                      address: res.formatted_address,
                      city: city || "Gwalior",
                      state: state || "Madhya Pradesh",
                      postalCode,
                      area: area || city,
                    });

                    toast({
                      title: "Current location set as default",
                      description: `Deliver to: ${area || city}, ${city}`,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top",
                    });
                    onClose();
                  }
                  setIsLocating(false);
                }
              );
            } else {
              // Fallback
              await auth.updateCurrentLocation({
                coordinates: [lng, lat],
                city: "Gwalior",
                state: "Madhya Pradesh",
                address: "Detected via GPS",
              });
              onClose();
              setIsLocating(false);
            }
          } catch {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          toast({
            title: "GPS Permission Denied",
            description: "Please allow location access in your browser.",
            status: "warning",
            duration: 3500,
          });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    };

    const contentBody = (
      <VStack spacing={4} align="stretch" py={2}>
        {/* Google Places Search Input */}
        <Box>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              {isSearchingCity ? (
                <Spinner size="xs" color="var(--color-primary)" />
              ) : (
                <Icon as={FiSearch} color="gray.400" />
              )}
            </InputLeftElement>
            <Input
              placeholder="Search area, city or pincode via Google Maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="xl"
              bg={useColorModeValue("gray.50", "whiteAlpha.100")}
              borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
              _focus={{
                borderColor: "var(--color-primary)",
                boxShadow: "0 0 0 1px var(--color-primary)",
              }}
            />
          </InputGroup>

          {/* Google Places Predictions Dropdown */}
          {placePredictions.length > 0 && (
            <VStack
              mt={2}
              spacing={1}
              align="stretch"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
              boxShadow="lg"
              p={1.5}
            >
              <Text fontSize="10px" fontWeight="700" color="gray.400" px={2} pt={1}>
                GOOGLE MAPS RESULTS (TAP TO SET DEFAULT)
              </Text>
              {placePredictions.map((pred) => (
                <HStack
                  key={pred.place_id}
                  as="button"
                  onClick={() => handleSelectGooglePlace(pred)}
                  p={2}
                  borderRadius="lg"
                  _hover={{ bg: useColorModeValue("blue.50", "whiteAlpha.100") }}
                  transition="all 0.15s ease"
                  textAlign="left"
                  w="full"
                >
                  <Circle size="24px" bg="var(--color-primary-soft)" color="var(--color-primary)">
                    <Icon as={FiMapPin} boxSize={3} />
                  </Circle>
                  <Box minW={0} flex={1}>
                    <Text fontSize="12.5px" fontWeight="700" noOfLines={1}>
                      {pred.structured_formatting?.main_text || pred.description}
                    </Text>
                    <Text fontSize="10.5px" color="gray.500" noOfLines={1}>
                      {pred.structured_formatting?.secondary_text || pred.description}
                    </Text>
                  </Box>
                  <Text fontSize="10px" fontWeight="700" color="var(--color-primary)">
                    Select ▾
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* Action: Use Current Location (GPS) */}
        <HStack
          as="button"
          onClick={handleUseCurrentLocation}
          p={3.5}
          borderRadius="xl"
          border="1.5px solid"
          borderColor="var(--color-primary)"
          bg="var(--color-primary-soft)"
          _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
          transition="all 0.2s ease"
          w="full"
          justify="space-between"
          cursor="pointer"
        >
          <HStack spacing={3}>
            <Circle size="34px" bg="var(--color-primary)" color="white">
              {isLocating ? (
                <Spinner size="xs" color="white" />
              ) : (
                <Icon as={FiCompass} boxSize={4} />
              )}
            </Circle>
            <Box textAlign="left">
              <Text fontSize="13px" fontWeight="800" color="var(--color-primary)">
                {isLocating ? "Detecting location via GPS..." : "Use Current Location"}
              </Text>
              <Text fontSize="11px" color="gray.500">
                Detect precise location via Google Maps GPS
              </Text>
            </Box>
          </HStack>
          <Text fontSize="11px" fontWeight="700" color="var(--color-primary)">
            GPS 📍
          </Text>
        </HStack>

        <Divider borderColor={useColorModeValue("gray.100", "whiteAlpha.100")} />

        {/* Saved Addresses Section */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text
              fontSize="11px"
              fontWeight="800"
              color="gray.400"
              textTransform="uppercase"
              letterSpacing="0.6px"
            >
              Saved Addresses ({auth.addresses.length})
            </Text>
            {onOpenAddNewAddress && (
              <Button
                size="xs"
                variant="ghost"
                color="var(--color-primary)"
                leftIcon={<FiPlus />}
                onClick={() => {
                  onClose();
                  onOpenAddNewAddress();
                }}
              >
                Add New
              </Button>
            )}
          </Flex>

          {auth.addresses.length === 0 ? (
            <Box
              p={4}
              textAlign="center"
              borderRadius="xl"
              bg={useColorModeValue("gray.50", "whiteAlpha.50")}
            >
              <Text fontSize="12px" color="gray.500" mb={2}>
                No saved addresses found.
              </Text>
              {onOpenAddNewAddress && (
                <Button
                  size="xs"
                  colorScheme="brand"
                  bg="var(--color-primary)"
                  color="white"
                  onClick={() => {
                    onClose();
                    onOpenAddNewAddress();
                  }}
                >
                  + Add Address
                </Button>
              )}
            </Box>
          ) : (
            <VStack spacing={2} align="stretch" maxH="280px" overflowY="auto" pr={1}>
              {filteredAddresses.map((addr: any) => {
                const id = addr._id || addr.id;
                const isSelected = id === activeAddressId;
                const isLoadingThis = isSwitching === id;

                return (
                  <HStack
                    key={id}
                    as="button"
                    onClick={() => handleSelectAddress(addr)}
                    p={3}
                    borderRadius="xl"
                    border="1.5px solid"
                    borderColor={
                      isSelected
                        ? "var(--color-primary)"
                        : useColorModeValue("gray.200", "whiteAlpha.200")
                    }
                    bg={
                      isSelected
                        ? useColorModeValue("blue.50", "whiteAlpha.100")
                        : useColorModeValue("white", "whiteAlpha.50")
                    }
                    _hover={{
                      borderColor: "var(--color-primary)",
                      bg: useColorModeValue("blue.50", "whiteAlpha.100"),
                    }}
                    transition="all 0.15s ease"
                    justify="space-between"
                    w="full"
                    textAlign="left"
                    cursor="pointer"
                    role="group"
                  >
                    <HStack spacing={3} align="flex-start" minW={0} flex={1}>
                      <Circle
                        size="28px"
                        bg={isSelected ? "var(--color-primary)" : "gray.100"}
                        color={isSelected ? "white" : "gray.600"}
                        mt={0.5}
                        flexShrink={0}
                      >
                        <Icon as={FiMapPin} boxSize={3.5} />
                      </Circle>
                      <Box minW={0} flex={1}>
                        <HStack spacing={2}>
                          <Text fontSize="13px" fontWeight="700" noOfLines={1}>
                            {addr.name || addr.fullName || "Address"}
                          </Text>
                          {isSelected && (
                            <Badge
                              fontSize="9.5px"
                              fontWeight="800"
                              colorScheme="brand"
                              bg="var(--color-primary)"
                              color="white"
                              px={1.5}
                              py={0.2}
                              borderRadius="full"
                            >
                              DEFAULT
                            </Badge>
                          )}
                        </HStack>
                        <Text
                          fontSize="11.5px"
                          color="gray.500"
                          noOfLines={2}
                          mt={0.5}
                          lineHeight="1.3"
                        >
                          {[
                            addr.line1 || addr.addressLine1,
                            addr.city,
                            addr.state,
                            addr.postalCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      </Box>
                    </HStack>

                    {isLoadingThis ? (
                      <Spinner size="xs" color="var(--color-primary)" />
                    ) : isSelected ? (
                      <Circle size="20px" bg="var(--color-primary)" color="white">
                        <Icon as={FiCheck} boxSize={3} />
                      </Circle>
                    ) : null}
                  </HStack>
                );
              })}
            </VStack>
          )}
        </Box>
      </VStack>
    );

    if (isMobile) {
      return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent borderTopRadius="2xl" maxH="80vh">
            <DrawerCloseButton />
            <DrawerHeader pb={2} pt={4} fontSize="md" fontWeight="800">
              Select Delivery Location
            </DrawerHeader>
            <DrawerBody pb={6}>{contentBody}</DrawerBody>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalCloseButton />
          <ModalHeader pb={2} fontSize="md" fontWeight="800">
            Select Delivery Location
          </ModalHeader>
          <ModalBody pb={6}>{contentBody}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

export default LocationSelectModal;
