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
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiHome,
  FiMapPin,
  FiNavigation,
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

    const savedAddressesList = auth.addresses;

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

    // Helper to get contextual icon for address type
    const getAddressIcon = (name: string = "") => {
      const lower = name.toLowerCase();
      if (lower.includes("home") || lower.includes("house") || lower.includes("flat") || lower.includes("apt")) {
        return FiHome;
      }
      if (lower.includes("work") || lower.includes("office") || lower.includes("desk")) {
        return FiBriefcase;
      }
      if (lower.includes("current")) {
        return FiNavigation;
      }
      return FiMapPin;
    };

    // Color tokens
    const textPrimary = useColorModeValue("gray.800", "white");
    const textSecondary = useColorModeValue("gray.500", "gray.400");
    const searchBg = useColorModeValue("gray.50", "whiteAlpha.100");
    const itemBg = useColorModeValue("white", "whiteAlpha.50");
    const itemBorder = useColorModeValue("gray.100", "whiteAlpha.100");

    const contentBody = (
      <VStack spacing={4} align="stretch" pb={2} pt={1} position="relative">
        {/* Sleek Search Bar */}
        <Box position="relative">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none" pl={3.5} h="full">
              {isSearchingCity ? (
                <Spinner size="xs" color="var(--color-primary)" />
              ) : (
                <Icon as={FiSearch} color="gray.400" boxSize={4} />
              )}
            </InputLeftElement>
            <Input
              placeholder="Search area, landmark, city or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              borderRadius="16px"
              h="50px"
              pl="42px"
              fontSize="14px"
              bg={searchBg}
              border="1.5px solid transparent"
              _hover={{ bg: "gray.100", borderColor: "gray.200" }}
              _focus={{
                bg: "white",
                borderColor: "var(--color-primary)",
                boxShadow: "0 0 0 3px rgba(6, 95, 104, 0.12)",
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          </InputGroup>

          {/* Floating Dropdown for Google Search Results */}
          {placePredictions.length > 0 && (
            <VStack
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt={2}
              zIndex={50}
              spacing={1}
              align="stretch"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="20px"
              border="1px solid"
              borderColor={useColorModeValue("gray.100", "whiteAlpha.200")}
              boxShadow="0 24px 48px -12px rgba(0,0,0,0.25)"
              p={2.5}
              maxH="260px"
              overflowY="auto"
            >
              <Text fontSize="10px" fontWeight="800" color="gray.400" px={3} pt={1} pb={0.5} letterSpacing="0.8px">
                SUGGESTIONS FROM GOOGLE MAPS
              </Text>
              {placePredictions.map((pred) => (
                <HStack
                  key={pred.place_id}
                  as="button"
                  onClick={() => {
                    handleSelectGooglePlace(pred);
                    setPlacePredictions([]);
                    setSearchQuery("");
                  }}
                  p={2.5}
                  borderRadius="14px"
                  _hover={{ bg: "var(--color-primary-soft)" }}
                  transition="all 0.15s ease"
                  textAlign="left"
                  w="full"
                >
                  <Circle size="32px" bg="var(--color-primary-soft)" color="var(--color-primary)" flexShrink={0}>
                    <Icon as={FiMapPin} boxSize={4} />
                  </Circle>
                  <Box minW={0} flex={1}>
                    <Text fontSize="13.5px" fontWeight="700" color={textPrimary} noOfLines={1}>
                      {pred.structured_formatting?.main_text || pred.description}
                    </Text>
                    <Text fontSize="11px" color={textSecondary} noOfLines={1} mt={0.5}>
                      {pred.structured_formatting?.secondary_text || pred.description}
                    </Text>
                  </Box>
                  <Text fontSize="11px" fontWeight="700" color="var(--color-primary)">
                    Select ▾
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* Action: Use Current Location (GPS) Card */}
        <Box
          as="button"
          onClick={handleUseCurrentLocation}
          p={3.5}
          borderRadius="20px"
          bg="linear-gradient(135deg, rgba(6, 95, 104, 0.08) 0%, rgba(6, 95, 104, 0.02) 100%)"
          border="1px solid"
          borderColor="rgba(6, 95, 104, 0.18)"
          _hover={{
            borderColor: "var(--color-primary)",
            bg: "linear-gradient(135deg, rgba(6, 95, 104, 0.12) 0%, rgba(6, 95, 104, 0.04) 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 20px rgba(6, 95, 104, 0.12)",
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          w="full"
          cursor="pointer"
          textAlign="left"
        >
          <HStack justify="space-between" align="center">
            <HStack spacing={3.5} align="center">
              <Circle
                size="42px"
                bg="linear-gradient(135deg, var(--color-primary) 0%, #0d7a86 100%)"
                color="white"
                boxShadow="0 4px 14px rgba(6, 95, 104, 0.35)"
                flexShrink={0}
              >
                {isLocating ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <Icon as={FiNavigation} boxSize={4} />
                )}
              </Circle>
              <Box>
                <HStack spacing={2} align="center">
                  <Text fontSize="14px" fontWeight="800" color="var(--color-primary)">
                    {isLocating ? "Locating via GPS..." : "Use Current Location"}
                  </Text>
                  <Badge
                    bg="rgba(6, 95, 104, 0.15)"
                    color="var(--color-primary)"
                    fontSize="9.5px"
                    fontWeight="800"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                  >
                    GPS
                  </Badge>
                </HStack>
                <Text fontSize="11.5px" color="gray.500" mt={0.5}>
                  Detect live GPS location & set as default
                </Text>
              </Box>
            </HStack>

            <Button
              size="xs"
              variant="solid"
              bg="var(--color-primary)"
              color="white"
              borderRadius="full"
              px={3}
              h="28px"
              fontSize="11.5px"
              fontWeight="700"
              _hover={{ bg: "#0d7a86" }}
              rightIcon={<FiArrowRight />}
              flexShrink={0}
            >
              Detect
            </Button>
          </HStack>
        </Box>

        <Divider borderColor={useColorModeValue("gray.100", "whiteAlpha.100")} my={0.5} />

        {/* Saved Addresses Section */}
        <Box>
          <Flex justify="space-between" align="center" mb={2.5}>
            <Text
              fontSize="11px"
              fontWeight="800"
              color="gray.400"
              textTransform="uppercase"
              letterSpacing="0.8px"
            >
              Saved Addresses ({savedAddressesList.length})
            </Text>
            {onOpenAddNewAddress && (
              <Button
                size="xs"
                variant="ghost"
                color="var(--color-primary)"
                fontWeight="700"
                fontSize="12px"
                leftIcon={<FiPlus />}
                _hover={{ bg: "var(--color-primary-soft)" }}
                onClick={() => {
                  onClose();
                  onOpenAddNewAddress();
                }}
              >
                Add New
              </Button>
            )}
          </Flex>

          {savedAddressesList.length === 0 ? (
            <Box
              p={6}
              textAlign="center"
              borderRadius="20px"
              bg={useColorModeValue("gray.50", "whiteAlpha.50")}
              border="1px dashed"
              borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
            >
              <Circle size="42px" bg="gray.100" color="gray.400" mx="auto" mb={2}>
                <Icon as={FiMapPin} boxSize={4} />
              </Circle>
              <Text fontSize="13px" fontWeight="600" color="gray.600" mb={1}>
                No saved addresses found
              </Text>
              <Text fontSize="11.5px" color="gray.400" mb={3}>
                Add your home or office address for faster checkout
              </Text>
              {onOpenAddNewAddress && (
                <Button
                  size="xs"
                  colorScheme="brand"
                  bg="var(--color-primary)"
                  color="white"
                  borderRadius="full"
                  px={4}
                  py={3}
                  onClick={() => {
                    onClose();
                    onOpenAddNewAddress();
                  }}
                >
                  + Add New Address
                </Button>
              )}
            </Box>
          ) : (
            <VStack spacing={2} align="stretch" maxH="280px" overflowY="auto" pr={0.5}>
              {savedAddressesList.map((addr: any) => {
                const id = addr._id || addr.id;
                const isSelected = id === activeAddressId;
                const isLoadingThis = isSwitching === id;
                const IconComponent = getAddressIcon(addr.name || addr.fullName);

                return (
                  <HStack
                    key={id}
                    as="button"
                    onClick={() => handleSelectAddress(addr)}
                    p={3.5}
                    borderRadius="18px"
                    border="1.5px solid"
                    borderColor={isSelected ? "var(--color-primary)" : itemBorder}
                    bg={
                      isSelected
                        ? "linear-gradient(135deg, rgba(6, 95, 104, 0.08) 0%, rgba(6, 95, 104, 0.02) 100%)"
                        : itemBg
                    }
                    boxShadow={
                      isSelected
                        ? "0 4px 16px rgba(6,95,104,0.1)"
                        : "0 1px 3px rgba(0,0,0,0.02)"
                    }
                    _hover={{
                      borderColor: isSelected ? "var(--color-primary)" : "gray.300",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.18s ease"
                    justify="space-between"
                    w="full"
                    textAlign="left"
                    cursor="pointer"
                    role="group"
                  >
                    <HStack spacing={3.5} align="center" minW={0} flex={1}>
                      <Circle
                        size="38px"
                        bg={
                          isSelected
                            ? "linear-gradient(135deg, var(--color-primary) 0%, #0d7a86 100%)"
                            : useColorModeValue("gray.100", "whiteAlpha.200")
                        }
                        color={isSelected ? "white" : "gray.600"}
                        flexShrink={0}
                        transition="transform 0.2s"
                        _groupHover={{ transform: "scale(1.06)" }}
                        boxShadow={isSelected ? "0 2px 8px rgba(6,95,104,0.35)" : "none"}
                      >
                        <Icon as={IconComponent} boxSize={4} />
                      </Circle>
                      <Box minW={0} flex={1}>
                        <HStack spacing={2} align="center">
                          <Text
                            fontSize="13.5px"
                            fontWeight="800"
                            color={isSelected ? "var(--color-primary)" : textPrimary}
                            noOfLines={1}
                          >
                            {addr.name || addr.fullName || "Address"}
                          </Text>
                          {isSelected && (
                            <Badge
                              fontSize="9px"
                              fontWeight="800"
                              bg="var(--color-primary)"
                              color="white"
                              px={2}
                              py={0.2}
                              borderRadius="full"
                              letterSpacing="0.4px"
                            >
                              DELIVER HERE
                            </Badge>
                          )}
                        </HStack>
                        <Text
                          fontSize="11.5px"
                          color={textSecondary}
                          noOfLines={2}
                          mt={0.5}
                          lineHeight="1.4"
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
                      <Circle
                        size="22px"
                        bg="var(--color-primary)"
                        color="white"
                        boxShadow="0 2px 8px rgba(6,95,104,0.35)"
                        flexShrink={0}
                      >
                        <Icon as={FiCheck} boxSize={3.5} />
                      </Circle>
                    ) : (
                      <Circle
                        size="18px"
                        border="1.5px solid"
                        borderColor="gray.300"
                        _groupHover={{ borderColor: "var(--color-primary)" }}
                        flexShrink={0}
                      />
                    )}
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
          <DrawerOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
          <DrawerContent borderTopRadius="28px" maxH="85vh" p={2}>
            <DrawerCloseButton top={5} right={5} rounded="full" />
            <DrawerHeader pb={1} pt={4} px={4}>
              <Text fontSize="18px" fontWeight="800" color={textPrimary}>
                Select Delivery Location
              </Text>
              <Text fontSize="12px" color="gray.400" fontWeight="500">
                Choose or search your delivery destination
              </Text>
            </DrawerHeader>
            <DrawerBody pb={6} px={4}>{contentBody}</DrawerBody>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
        <ModalContent
          borderRadius="28px"
          overflow="hidden"
          p={2}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow="0 28px 64px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.04)"
        >
          <ModalCloseButton top={5} right={5} rounded="full" _hover={{ bg: "gray.100" }} />
          <ModalHeader pb={1} pt={4} px={4}>
            <Text fontSize="18px" fontWeight="800" color={textPrimary}>
              Select Delivery Location
            </Text>
            <Text fontSize="12px" color="gray.400" fontWeight="500">
              Choose or search your delivery destination
            </Text>
          </ModalHeader>
          <ModalBody pb={6} px={4}>{contentBody}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

export default LocationSelectModal;
