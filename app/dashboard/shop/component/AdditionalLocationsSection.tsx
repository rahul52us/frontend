import React from "react";
import {
  Badge,
  Box,
  VStack,
  Button,
  IconButton,
  Grid,
  GridItem,
  HStack,
  Text,
  Flex,
  useColorModeValue,
  Circle,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import { FieldArray } from "formik";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import {
  FALLBACK_CENTER,
  getSelectedPoint,
  GOOGLE_MAPS_API_KEY,
  mapContainerStyle,
  mapOptions,
  parseAddressComponents,
} from "./utils/locationPicker";

// Shared SectionCard wrapper
const SectionCard = ({ icon, title, description, children }) => {
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorder}
      overflow="hidden"
      boxShadow="md"
    >
      <Flex
        bg={headerBg}
        px={5}
        py={3}
        align="center"
        gap={3}
        borderBottom="1px solid"
        borderColor={cardBorder}
      >
        <Circle size="36px" bg={useColorModeValue("blue.100", "blue.600")}>
          <Icon as={icon} color="blue.600" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize="md" fontWeight="bold" color={textColor}>
            {title}
          </Text>
          {description && (
            <Text fontSize="xs" color="gray.500">
              {description}
            </Text>
          )}
        </Box>
      </Flex>
      <Box px={{ base: 4, md: 6 }} py={6}>
        {children}
      </Box>
    </Box>
  );
};

const AdditionalLocationCard = ({
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
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      bg="gray.50"
    >
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="semibold" color="teal.500">
          Location {index + 1}
        </Text>
        <IconButton
          aria-label="Remove Location"
          icon={<FaMinus />}
          size="sm"
          colorScheme="red"
          variant="outline"
          onClick={() => remove(index)}
        />
      </HStack>

      <VStack spacing={5} align="stretch">
        <Box>
          <Flex
            justify="space-between"
            align={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            mb={4}
          >
            <Box>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                Pick this branch on the map
              </Text>
              <Text fontSize="xs" color="gray.500">
                Click the map to drop a pin or use your current location.
              </Text>
            </Box>
            <Button
              leftIcon={<FiNavigation />}
              variant="outline"
              size="sm"
              borderRadius="full"
              onClick={detectCurrentLocation}
              isLoading={detectingLocation || geocoding}
            >
              Use current location
            </Button>
          </Flex>

          <Box
            h={{ base: "220px", md: "280px" }}
            borderRadius="2xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor="blue.100"
            bg="blue.50"
          >
            {!GOOGLE_MAPS_API_KEY ? (
              <Flex h="100%" align="center" justify="center" px={6}>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the map picker.
                </Text>
              </Flex>
            ) : loadError ? (
              <Flex h="100%" align="center" justify="center" px={6}>
                <Text fontSize="sm" color="red.500" textAlign="center">
                  Failed to load Google Maps.
                </Text>
              </Flex>
            ) : !isLoaded ? (
              <Flex h="100%" align="center" justify="center" px={6}>
                <Text fontSize="sm" color="gray.500" textAlign="center">
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
              colorScheme={selectedPoint ? "green" : "blue"}
              px={3}
              py={1}
              borderRadius="full"
            >
              {selectedPoint ? "Pin selected" : "Pin not selected"}
            </Badge>
            {selectedPoint ? (
              <Text fontSize="sm" color="gray.500">
                {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
              </Text>
            ) : null}
          </HStack>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Address"
              name={`multipleLocations[${index}].address`}
              required
              error={errors?.address}
              value={location.address || ""}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].address`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="City"
              name={`multipleLocations[${index}].city`}
              required
              error={errors?.city}
              value={location.city || ""}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].city`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="State"
              name={`multipleLocations[${index}].state`}
              required
              error={errors?.state}
              value={location.state || ""}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].state`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Postal Code"
              name={`multipleLocations[${index}].postalCode`}
              required
              error={errors?.postalCode}
              value={location.postalCode || ""}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].postalCode`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Country"
              name={`multipleLocations[${index}].country`}
              required
              error={errors?.country}
              value={location.country || ""}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].country`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Longitude"
              name={`multipleLocations[${index}].coordinates[0]`}
              required
              error={coordinateErrors?.[0]}
              value={longitudeValue}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].coordinates[0]`, e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <CustomInput
              showError={showError}
              label="Latitude"
              name={`multipleLocations[${index}].coordinates[1]`}
              required
              error={coordinateErrors?.[1]}
              value={latitudeValue}
              onChange={(e) =>
                setFieldValue(`multipleLocations[${index}].coordinates[1]`, e.target.value)
              }
            />
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

const AdditionalLocationsSection = ({ values, errors, setFieldValue, showError }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return (
    <SectionCard
      icon={FiMapPin}
      title="Additional Locations"
      description="Add multiple branches or delivery points"
    >
      <FieldArray name="multipleLocations">
        {({ push, remove }) => (
          <VStack spacing={6} align="stretch">
            {values.multipleLocations &&
              values.multipleLocations.length > 0 &&
              values.multipleLocations.map((location, index) => (
                <AdditionalLocationCard
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
              ))}
            <Button
              leftIcon={<FaPlus />}
              colorScheme="teal"
              variant="outline"
              size="md"
              w="fit-content"
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
              Add Location
            </Button>
          </VStack>
        )}
      </FieldArray>
    </SectionCard>
  );
};

export default AdditionalLocationsSection;
