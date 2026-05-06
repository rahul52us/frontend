import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import {
  FALLBACK_CENTER,
  getSelectedPoint,
  GOOGLE_MAPS_API_KEY,
  hasPickedCoordinates,
  mapContainerStyle,
  mapOptions,
  parseAddressComponents,
} from "./utils/locationPicker";
import {
  MerchantSectionCard,
  MerchantTextField,
  useMerchantTone,
} from "./merchantTheme";

const MainLocationSection = ({ values, errors, setFieldValue, showError }) => {
  const toast = useToast();
  const tone = useMerchantTone("green");
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
    <MerchantSectionCard
      icon={FiMapPin}
      title="Main Location"
      description="Drop a pin so nearby buyers can find you, then fine-tune the address if needed."
      tint="green"
    >
      <VStack spacing={6} align="stretch">
        <Box
          overflow="hidden"
          borderRadius={{ base: "22px", md: "24px" }}
          border="1px solid"
          borderColor={tone.border}
          bg={tone.soft}
        >
          <Box
            position="relative"
            h={{ base: "220px", sm: "250px", md: "300px" }}
            bg={tone.soft}
          >
            <Box
              position="absolute"
              inset={0}
              opacity={0.55}
              backgroundImage="linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.24) 49%, rgba(255,255,255,0.24) 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.14) 49%, rgba(255,255,255,0.14) 51%, transparent 52%)"
              backgroundSize="38px 38px"
              pointerEvents="none"
            />

            {!GOOGLE_MAPS_API_KEY || loadError || !isLoaded ? (
              <Flex
                h="100%"
                direction="column"
                align="center"
                justify="center"
                px={6}
                gap={3}
                textAlign="center"
                position="relative"
                zIndex={1}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="54px"
                  w="54px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.92)"
                >
                  <FiMapPin size={24} color={tone.iconColor} />
                </Box>
                <Text fontSize="sm" fontWeight="600" color="var(--dashboard-text)">
                  {!GOOGLE_MAPS_API_KEY
                    ? "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map picker."
                    : loadError
                      ? "Google Maps failed to load. You can still fill the address manually."
                      : "Loading map..."}
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

            <Button
              size="sm"
              leftIcon={<FiNavigation />}
              position="absolute"
              bottom={3}
              right={3}
              borderRadius="full"
              px={4}
              bg="rgba(255,255,255,0.95)"
              color={tone.text}
              border="1px solid"
              borderColor="rgba(255,255,255,0.42)"
              _hover={{ bg: "white" }}
              _active={{ transform: "scale(0.98)" }}
              onClick={detectCurrentLocation}
              isLoading={detectingLocation || geocoding}
              zIndex={2}
            >
              Use my location
            </Button>
          </Box>
        </Box>

        <HStack spacing={3} flexWrap="wrap">
          <Badge
            px={3}
            py={1.5}
            borderRadius="full"
            bg={selectedPoint ? "rgba(34, 197, 94, 0.14)" : tone.soft}
            color={selectedPoint ? "var(--dashboard-success)" : tone.text}
            border="1px solid"
            borderColor={selectedPoint ? "rgba(34, 197, 94, 0.24)" : tone.border}
          >
            {selectedPoint ? "Pin selected" : "Pin not selected"}
          </Badge>
          {selectedPoint ? (
            <Text fontSize="sm" color="var(--dashboard-text-soft)">
              {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
            </Text>
          ) : null}
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box gridColumn={{ md: "span 2" }}>
            <MerchantTextField
              label="Address line"
              name="location.address"
              required
              placeholder="Street, building, landmark"
              value={location.address || ""}
              onChange={(event) => setFieldValue("location.address", event.target.value)}
              showError={showError}
              error={locationErrors.address}
            />
          </Box>
          <MerchantTextField
            label="City"
            name="location.city"
            required
            placeholder="City"
            value={location.city || ""}
            onChange={(event) => setFieldValue("location.city", event.target.value)}
            showError={showError}
            error={locationErrors.city}
          />
          <MerchantTextField
            label="State"
            name="location.state"
            required
            placeholder="State"
            value={location.state || ""}
            onChange={(event) => setFieldValue("location.state", event.target.value)}
            showError={showError}
            error={locationErrors.state}
          />
          <MerchantTextField
            label="Postal code"
            name="location.postalCode"
            required
            placeholder="000000"
            inputMode="numeric"
            value={location.postalCode || ""}
            onChange={(event) => setFieldValue("location.postalCode", event.target.value)}
            showError={showError}
            error={locationErrors.postalCode}
          />
          <MerchantTextField
            label="Country"
            name="location.country"
            required
            placeholder="Country"
            value={location.country || ""}
            onChange={(event) => setFieldValue("location.country", event.target.value)}
            showError={showError}
            error={locationErrors.country}
          />
          <MerchantTextField
            label="Latitude"
            name="location.coordinates[1]"
            placeholder="28.6139"
            value={latitudeValue}
            onChange={(event) => setFieldValue("location.coordinates[1]", event.target.value)}
            showError={showError}
            error={coordinatesErrors[1]}
          />
          <MerchantTextField
            label="Longitude"
            name="location.coordinates[0]"
            placeholder="77.2090"
            value={longitudeValue}
            onChange={(event) => setFieldValue("location.coordinates[0]", event.target.value)}
            showError={showError}
            error={coordinatesErrors[0]}
          />
        </SimpleGrid>
      </VStack>
    </MerchantSectionCard>
  );
};

export default MainLocationSection;
