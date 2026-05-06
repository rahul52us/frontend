import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { FieldArray } from "formik";
import { FaPlus } from "react-icons/fa";
import { FiMap, FiMapPin, FiNavigation, FiTrash2 } from "react-icons/fi";
import {
  FALLBACK_CENTER,
  getSelectedPoint,
  GOOGLE_MAPS_API_KEY,
  mapContainerStyle,
  mapOptions,
  parseAddressComponents,
} from "./utils/locationPicker";
import {
  MerchantSectionCard,
  MerchantTextField,
  useMerchantTone,
} from "./merchantTheme";

const BranchCard = ({
  index,
  location,
  errors,
  setFieldValue,
  showError,
  remove,
  isLoaded,
  loadError,
}) => {
  const toast = useToast();
  const tone = useMerchantTone("violet");
  const coordinates = location.coordinates || ["", ""];
  const coordinateErrors = errors?.coordinates || [];
  const selectedPoint = getSelectedPoint(coordinates);
  const isPlaceholderCoordinate =
    Array.isArray(coordinates) &&
    coordinates.length >= 2 &&
    Number(coordinates[0]) === 0 &&
    Number(coordinates[1]) === 0;
  const longitudeValue = isPlaceholderCoordinate ? "" : coordinates[0] ?? "";
  const latitudeValue = isPlaceholderCoordinate ? "" : coordinates[1] ?? "";
  const mapCenter = selectedPoint
    ? { lat: selectedPoint.lat, lng: selectedPoint.lng }
    : FALLBACK_CENTER;
  const [detectingLocation, setDetectingLocation] = React.useState(false);
  const [geocoding, setGeocoding] = React.useState(false);

  const hydrateLocation = React.useCallback(
    (lat: number, lng: number) => {
      const nextLng = Number(lng.toFixed(6));
      const nextLat = Number(lat.toFixed(6));
      setFieldValue(`multipleLocations[${index}].coordinates`, [nextLng, nextLat]);
      setFieldValue(`multipleLocations[${index}].coordinates[0]`, nextLng);
      setFieldValue(`multipleLocations[${index}].coordinates[1]`, nextLat);

      if (!window.google?.maps) {
        return;
      }

      setGeocoding(true);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setGeocoding(false);
        if (status !== "OK" || !results?.length) {
          return;
        }

        const result = results[0];
        const parsed = parseAddressComponents(result.address_components || []);
        setFieldValue(
          `multipleLocations[${index}].address`,
          result.formatted_address || location.address || ""
        );
        setFieldValue(
          `multipleLocations[${index}].city`,
          parsed.city || location.city || ""
        );
        setFieldValue(
          `multipleLocations[${index}].state`,
          parsed.state || location.state || ""
        );
        setFieldValue(
          `multipleLocations[${index}].postalCode`,
          parsed.postalCode || location.postalCode || ""
        );
        setFieldValue(
          `multipleLocations[${index}].country`,
          parsed.country || location.country || ""
        );
      });
    },
    [
      index,
      location.address,
      location.city,
      location.country,
      location.postalCode,
      location.state,
      setFieldValue,
    ]
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
    if (typeof lat !== "number" || typeof lng !== "number") {
      return;
    }
    hydrateLocation(lat, lng);
  };

  return (
    <Box
      border="1px solid"
      borderColor={tone.border}
      borderRadius="24px"
      bg={tone.soft}
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
    >
      <VStack spacing={5} align="stretch">
        <Flex justify="space-between" align="center">
          <Badge
            px={3}
            py={1.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.78)"
            color={tone.text}
            border="1px solid"
            borderColor={tone.border}
          >
            Branch {index + 1}
          </Badge>
          <IconButton
            aria-label="Remove branch"
            icon={<FiTrash2 />}
            variant="ghost"
            color="var(--dashboard-danger)"
            borderRadius="full"
            _hover={{ bg: "rgba(239, 68, 68, 0.10)" }}
            onClick={() => remove(index)}
          />
        </Flex>

        <Box
          overflow="hidden"
          borderRadius="22px"
          border="1px solid"
          borderColor={tone.border}
          bg="rgba(255,255,255,0.52)"
        >
          <Box
            position="relative"
            h={{ base: "190px", md: "230px" }}
            bg={tone.soft}
          >
            {!GOOGLE_MAPS_API_KEY || loadError || !isLoaded ? (
              <Flex
                h="100%"
                direction="column"
                align="center"
                justify="center"
                px={6}
                gap={3}
                textAlign="center"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="46px"
                  w="46px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.92)"
                >
                  <FiMap size={20} color={tone.iconColor} />
                </Box>
                <Text fontSize="sm" fontWeight="600" color="var(--dashboard-text)">
                  {!GOOGLE_MAPS_API_KEY
                    ? "Map picker is unavailable until the Google Maps key is configured."
                    : loadError
                      ? "Google Maps failed to load."
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
            bg={selectedPoint ? "rgba(34, 197, 94, 0.14)" : "rgba(255,255,255,0.82)"}
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
              name={`multipleLocations[${index}].address`}
              placeholder="Street, building, landmark"
              value={location.address || ""}
              onChange={(event) =>
                setFieldValue(`multipleLocations[${index}].address`, event.target.value)
              }
              showError={showError}
              error={errors?.address}
            />
          </Box>
          <MerchantTextField
            label="City"
            name={`multipleLocations[${index}].city`}
            placeholder="City"
            value={location.city || ""}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].city`, event.target.value)
            }
            showError={showError}
            error={errors?.city}
          />
          <MerchantTextField
            label="State"
            name={`multipleLocations[${index}].state`}
            placeholder="State"
            value={location.state || ""}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].state`, event.target.value)
            }
            showError={showError}
            error={errors?.state}
          />
          <MerchantTextField
            label="Postal code"
            name={`multipleLocations[${index}].postalCode`}
            placeholder="000000"
            inputMode="numeric"
            value={location.postalCode || ""}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].postalCode`, event.target.value)
            }
            showError={showError}
            error={errors?.postalCode}
          />
          <MerchantTextField
            label="Country"
            name={`multipleLocations[${index}].country`}
            placeholder="Country"
            value={location.country || ""}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].country`, event.target.value)
            }
            showError={showError}
            error={errors?.country}
          />
          <MerchantTextField
            label="Latitude"
            name={`multipleLocations[${index}].coordinates[1]`}
            placeholder="28.6139"
            value={latitudeValue}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].coordinates[1]`, event.target.value)
            }
            showError={showError}
            error={coordinateErrors?.[1]}
          />
          <MerchantTextField
            label="Longitude"
            name={`multipleLocations[${index}].coordinates[0]`}
            placeholder="77.2090"
            value={longitudeValue}
            onChange={(event) =>
              setFieldValue(`multipleLocations[${index}].coordinates[0]`, event.target.value)
            }
            showError={showError}
            error={coordinateErrors?.[0]}
          />
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

const AdditionalLocationsSection = ({ values, errors, setFieldValue, showError }) => {
  const tone = useMerchantTone("violet");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return (
    <MerchantSectionCard
      icon={FiMap}
      title="Additional Branches"
      description="Add other outlets or pickup points if you operate from multiple locations."
      tint="violet"
    >
      <FieldArray name="multipleLocations">
        {({ push, remove }) => (
          <VStack spacing={4} align="stretch">
            {values.multipleLocations?.length ? (
              values.multipleLocations.map((location, index) => (
                <BranchCard
                  key={index}
                  index={index}
                  location={location}
                  errors={errors.multipleLocations?.[index]}
                  setFieldValue={setFieldValue}
                  showError={showError}
                  remove={remove}
                  isLoaded={isLoaded}
                  loadError={loadError}
                />
              ))
            ) : (
              <Box
                border="1px dashed"
                borderColor={tone.border}
                borderRadius="24px"
                bg={tone.soft}
                px={6}
                py={8}
                textAlign="center"
              >
                <Flex justify="center" mb={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="48px"
                    w="48px"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.82)"
                  >
                    <FiMapPin size={22} color={tone.iconColor} />
                  </Box>
                </Flex>
                <Text fontSize="md" fontWeight="700" color="var(--dashboard-text)">
                  No branches yet
                </Text>
                <Text mt={1} fontSize="sm" color="var(--dashboard-text-soft)">
                  Add a branch if you have other pickup points or extra storefronts.
                </Text>
              </Box>
            )}

            <Button
              leftIcon={<FaPlus />}
              variant="outline"
              borderRadius="18px"
              borderStyle="dashed"
              borderColor={tone.border}
              color={tone.text}
              w="full"
              minH="52px"
              bg="transparent"
              _hover={{ bg: tone.soft }}
              onClick={() =>
                push({
                  address: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "",
                  coordinates: [0, 0],
                })
              }
            >
              Add branch
            </Button>
          </VStack>
        )}
      </FieldArray>
    </MerchantSectionCard>
  );
};

export default AdditionalLocationsSection;
