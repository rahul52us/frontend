import React from "react";
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Badge,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { FiNavigation } from "react-icons/fi";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import {
  FALLBACK_CENTER,
  getSelectedPoint,
  GOOGLE_MAPS_API_KEY,
  hasPickedCoordinates,
  mapContainerStyle,
  mapOptions,
  parseAddressComponents,
} from "./utils/locationPicker";
import { MerchantSectionCard } from "./merchantTheme";

const MainLocationSection = ({ values, errors, setFieldValue, showError }) => {
  const toast = useToast();
  const location = values.location || {};
  const locationErrors = errors.location || {};
  const coordinates = location.coordinates || ["", ""];
  const coordinatesErrors = locationErrors.coordinates || [];
  const selectedPoint = getSelectedPoint(coordinates);
  const isPlaceholderCoordinate =
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    Number(coordinates[0]) === 0 &&
    Number(coordinates[1]) === 0;
  const longitudeValue = isPlaceholderCoordinate ? "" : coordinates[0] ?? "";
  const latitudeValue = isPlaceholderCoordinate ? "" : coordinates[1] ?? "";
  const savedAddress = [
    location.address,
    location.city,
    location.state,
    location.postalCode,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
  const mapCenter = selectedPoint
    ? { lat: selectedPoint.lat, lng: selectedPoint.lng }
    : FALLBACK_CENTER;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  const [detectingLocation, setDetectingLocation] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);
  const hydratedCoordinatesRef = React.useRef("");
  const hydratedAddressRef = React.useRef("");

  const hydrateLocation = React.useCallback(
    (lat: number, lng: number) => {
      const nextLng = Number(lng.toFixed(6));
      const nextLat = Number(lat.toFixed(6));
      setFieldValue("location.coordinates", [nextLng, nextLat]);
      setFieldValue("location.coordinates[0]", nextLng);
      setFieldValue("location.coordinates[1]", nextLat);

      if (!window.google?.maps) {
        return;
      }

      setGeocoding(true);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setGeocoding(false);
        if (status !== "OK" || !results?.length) return;

        const result = results[0];
        const parsed = parseAddressComponents(result.address_components || []);
        setFieldValue("location.address", result.formatted_address || location.address || "");
        setFieldValue("location.city", parsed.city || location.city || "");
        setFieldValue("location.state", parsed.state || location.state || "");
        setFieldValue("location.postalCode", parsed.postalCode || location.postalCode || "");
        setFieldValue("location.country", parsed.country || location.country || "");
      });
    },
    [location.address, location.city, location.country, location.postalCode, location.state, setFieldValue]
  );

  const detectCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Geolocation is not supported on this device.",
        status: "warning",
      });
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingLocation(false);
        hydrateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setDetectingLocation(false);
        toast({
          title: "Unable to fetch location",
          description: error.message || "Please place the pin manually on the map.",
          status: "error",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (typeof lat !== "number" || typeof lng !== "number") return;
    hydrateLocation(lat, lng);
  };

  React.useEffect(() => {
    if (!isLoaded || !selectedPoint || location.address || !window.google?.maps) {
      return;
    }

    const coordinateKey = `${selectedPoint.lat},${selectedPoint.lng}`;
    if (hydratedCoordinatesRef.current === coordinateKey) {
      return;
    }

    hydratedCoordinatesRef.current = coordinateKey;
    setGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: selectedPoint.lat, lng: selectedPoint.lng } },
      (results, status) => {
        setGeocoding(false);
        if (status !== "OK" || !results?.length) {
          return;
        }

        const result = results[0];
        const parsed = parseAddressComponents(result.address_components || []);
        setFieldValue("location.address", result.formatted_address || "");
        setFieldValue("location.city", parsed.city || location.city || "");
        setFieldValue("location.state", parsed.state || location.state || "");
        setFieldValue("location.postalCode", parsed.postalCode || location.postalCode || "");
        setFieldValue("location.country", parsed.country || location.country || "");
      }
    );
  }, [
    isLoaded,
    location.address,
    location.city,
    location.country,
    location.postalCode,
    location.state,
    selectedPoint,
    setFieldValue,
  ]);

  React.useEffect(() => {
    if (
      !isLoaded ||
      !savedAddress ||
      hasPickedCoordinates(coordinates) ||
      !window.google?.maps
    ) {
      return;
    }

    if (hydratedAddressRef.current === savedAddress) {
      return;
    }

    hydratedAddressRef.current = savedAddress;
    setGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: savedAddress }, (results, status) => {
      setGeocoding(false);
      const resultLocation = results?.[0]?.geometry?.location;
      if (status !== "OK" || !resultLocation) {
        return;
      }

      const lat = resultLocation.lat();
      const lng = resultLocation.lng();
      const nextLng = Number(lng.toFixed(6));
      const nextLat = Number(lat.toFixed(6));
      setFieldValue("location.coordinates", [nextLng, nextLat]);
      setFieldValue("location.coordinates[0]", nextLng);
      setFieldValue("location.coordinates[1]", nextLat);
    });
  }, [coordinates, isLoaded, savedAddress, setFieldValue]);

  return (
    <VStack spacing={8} align="stretch">
      <MerchantSectionCard
        icon={FiNavigation}
        title="Main Location"
        description="Pick your location on the map and fine-tune the address if needed"
      >
        <VStack spacing={6} align="stretch">
          <Box>
            <Flex
              justify="space-between"
              align={{ base: "start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={3}
              mb={4}
            >
              <Box>
                <Text fontSize="sm" fontWeight="600" color="var(--dashboard-text)">
                  Choose your shop location
                </Text>
                <Text fontSize="xs" color="var(--dashboard-text-soft)">
                  Tap the map to drop a pin, just like registration.
                </Text>
              </Box>
              <Button
                leftIcon={<FiNavigation />}
                variant="outline"
                size="sm"
                borderRadius="16px"
                borderColor="var(--dashboard-border-strong)"
                color="var(--dashboard-accent-strong)"
                _hover={{ bg: "var(--dashboard-accent-soft)" }}
                onClick={detectCurrentLocation}
                isLoading={detectingLocation || geocoding}
              >
                Use current location
              </Button>
            </Flex>

            <Box
              h={{ base: "240px", md: "300px" }}
              borderRadius="2xl"
              overflow="hidden"
              borderWidth="1px"
              borderColor="var(--dashboard-border-strong)"
              bg="var(--dashboard-surface-soft)"
            >
              {!GOOGLE_MAPS_API_KEY ? (
                <Flex h="100%" align="center" justify="center" px={6}>
                  <Text fontSize="sm" color="var(--dashboard-text-muted)" textAlign="center">
                    Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the map picker.
                  </Text>
                </Flex>
              ) : loadError ? (
                <Flex h="100%" align="center" justify="center" px={6}>
                  <Text fontSize="sm" color="var(--dashboard-danger, #ef6b6b)" textAlign="center">
                    Failed to load Google Maps.
                  </Text>
                </Flex>
              ) : !isLoaded ? (
                <Flex h="100%" align="center" justify="center" px={6}>
                  <Text fontSize="sm" color="var(--dashboard-text-soft)" textAlign="center">
                    Loading map...
                  </Text>
                </Flex>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={selectedPoint ? 15 : 11}
                  options={mapOptions}
                  onClick={handleMapClick}
                >
                  {selectedPoint ? (
                    <MarkerF position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }} />
                  ) : null}
                </GoogleMap>
              )}
            </Box>

            <HStack mt={3} spacing={3} flexWrap="wrap">
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg={selectedPoint ? "rgba(70, 201, 139, 0.14)" : "var(--dashboard-accent-soft)"}
                color={selectedPoint ? "var(--dashboard-success, #46c98b)" : "var(--dashboard-accent-strong)"}
                border="1px solid"
                borderColor={selectedPoint ? "rgba(70, 201, 139, 0.24)" : "var(--dashboard-border)"}
              >
                {selectedPoint ? "Pin selected" : "Pin not selected"}
              </Badge>
              {selectedPoint ? (
                <Text fontSize="sm" color="var(--dashboard-text-soft)">
                  {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                </Text>
              ) : null}
            </HStack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <CustomInput
              showError={showError}
              label="Address"
              name="location.address"
              required
              error={locationErrors.address}
              value={location.address || ""}
              onChange={(e) => setFieldValue("location.address", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="City"
              name="location.city"
              required
              error={locationErrors.city}
              value={location.city || ""}
              onChange={(e) => setFieldValue("location.city", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="State"
              name="location.state"
              required
              error={locationErrors.state}
              value={location.state || ""}
              onChange={(e) => setFieldValue("location.state", e.target.value)}
            />
            <CustomInput
              showError={showError}
              label="Postal Code"
              name="location.postalCode"
              required
              error={locationErrors.postalCode}
              value={location.postalCode || ""}
              onChange={(e) =>
                setFieldValue("location.postalCode", e.target.value)
              }
            />
            <CustomInput
              showError={showError}
              label="Country"
              name="location.country"
              required
              error={locationErrors.country}
              value={location.country || ""}
              onChange={(e) => setFieldValue("location.country", e.target.value)}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <CustomInput
              showError={showError}
              label="Longitude"
              name="location.coordinates[0]"
              required
              error={coordinatesErrors[0]}
              value={longitudeValue}
              onChange={(e) =>
                setFieldValue("location.coordinates[0]", e.target.value)
              }
            />
            <CustomInput
              showError={showError}
              label="Latitude"
              name="location.coordinates[1]"
              required
              error={coordinatesErrors[1]}
              value={latitudeValue}
              onChange={(e) =>
                setFieldValue("location.coordinates[1]", e.target.value)
              }
            />
          </SimpleGrid>
        </VStack>
      </MerchantSectionCard>
    </VStack>
  );
};

export default MainLocationSection;
