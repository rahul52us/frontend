"use client";

import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Circle,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCamera, FiMail, FiMapPin, FiNavigation, FiPhone, FiShoppingBag } from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  getOptionalGstError,
  normalizeGstNumber,
} from "../../../config/utils/gstValidation";
import { createCompanyCode } from "./utils/companyCode";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const FALLBACK_CENTER = { lat: 28.6139, lng: 77.209 };
const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfdbfe" }] },
  ],
};

const onboardingSteps = [
  {
    title: "Store basics",
    subtitle: "Tell buyers what your shop is called and add business details.",
    icon: FiShoppingBag,
  },
  {
    title: "Shop location",
    subtitle: "Drop a pin on the map so nearby buyers can discover your store.",
    icon: FiMapPin,
  },
  {
    title: "Contact info",
    subtitle: "Add the phone and optional email buyers can use to reach you.",
    icon: FiMail,
  },
  {
    title: "Shop pictures",
    subtitle: "Upload your logo, cover, or product photos. You can skip and add them later.",
    icon: FiCamera,
  },
];

const primaryButtonSx = {
  bgGradient: "linear(to-r, #14b8a6, #06b6d4)",
  color: "white",
  _hover: { bgGradient: "linear(to-r, #0d9488, #0891b2)" },
  _active: { transform: "scale(0.98)" },
  borderRadius: "full",
  h: "56px",
  fontWeight: "700",
};

const getFieldShellStyles = () => ({
  borderRadius: "2xl",
  borderWidth: "1px",
  borderColor: "gray.200",
  bg: "white",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
});

const isValidEmail = (email: string) => {
  if (!email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const hasPickedCoordinates = (coordinates: any) => {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return false;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  return Number.isFinite(lng) && Number.isFinite(lat) && !(lng === 0 && lat === 0);
};

const parseAddressComponents = (components: google.maps.GeocoderAddressComponent[] = []) => {
  const findComponent = (...types: string[]) =>
    components.find((component) => types.every((type) => component.types.includes(type)))?.long_name || "";

  return {
    city:
      findComponent("locality", "political") ||
      findComponent("sublocality", "sublocality_level_1", "political") ||
      findComponent("administrative_area_level_2", "political"),
    state: findComponent("administrative_area_level_1", "political"),
    postalCode: findComponent("postal_code"),
    country: findComponent("country", "political"),
  };
};

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <Text mt={2} fontSize="sm" color="red.500">
      {message}
    </Text>
  ) : null;

const CenteredBox = ({ children, ...props }: any) => (
  <Flex align="center" justify="center" {...props}>
    {children}
  </Flex>
);

const UploadCard = ({
  title,
  helper,
  files,
  onFileChange,
  onRemove,
}: {
  title: string;
  helper: string;
  files: any;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasFiles = Boolean(files && ((Array.isArray(files) && files.length) || !Array.isArray(files)));
  const openPicker = () => inputRef.current?.click();

  return (
    <Box p={5} {...getFieldShellStyles()}>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontSize="md" fontWeight="700" color="gray.900">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {helper}
          </Text>
        </Box>

        {hasFiles ? (
          <ShowFileUploadFile files={files} removeFile={onRemove} edit={false} />
        ) : (
          <Box
            role="button"
            tabIndex={0}
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="teal.200"
            borderRadius="2xl"
            py={8}
            px={6}
            textAlign="center"
            bg="teal.50"
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ borderColor: "teal.400", bg: "teal.100" }}
            _focusVisible={{ outline: "none", boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.22)" }}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
          >
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Tap to upload image
            </Text>
            <Text mt={1} fontSize="xs" color="gray.500">
              JPG, PNG or WEBP
            </Text>
          </Box>
        )}

        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          display="none"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            onFileChange(file);
            event.target.value = "";
          }}
        />

        <HStack spacing={3}>
          <Button variant="outline" borderRadius="full" onClick={openPicker}>
            {hasFiles ? "Replace" : "Upload"}
          </Button>
          {hasFiles ? (
            <Button variant="ghost" colorScheme="red" borderRadius="full" onClick={onRemove}>
              Remove
            </Button>
          ) : null}
        </HStack>
      </VStack>
    </Box>
  );
};

type SellerOnboardingWizardProps = {
  initialValues: any;
  accountPhone?: string;
  accountEmail?: string;
  onSubmit: (values: any) => Promise<void>;
};

const SellerOnboardingWizard = ({
  initialValues,
  accountPhone,
  accountEmail,
  onSubmit,
}: SellerOnboardingWizardProps) => {
  const router = useRouter();
  const toast = useToast({ position: "top-right", duration: 3000, isClosable: true });
  const [stepIndex, setStepIndex] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    setFormValues({
      ...initialValues,
      companyCode:
        initialValues.companyCode ||
        createCompanyCode(initialValues.name || "", initialValues.contactInfo?.phone || accountPhone || ""),
      contactInfo: {
        ...initialValues.contactInfo,
        phone: initialValues.contactInfo?.phone || accountPhone || "",
        email: initialValues.contactInfo?.email || accountEmail || "",
      },
    });
  }, [accountEmail, accountPhone, initialValues]);

  const activeStep = onboardingSteps[stepIndex];
  const progress = ((stepIndex + 1) / onboardingSteps.length) * 100;
  const coordinates = formValues.location?.coordinates || [0, 0];
  const selectedPoint = hasPickedCoordinates(coordinates)
    ? { lng: Number(coordinates[0]), lat: Number(coordinates[1]) }
    : null;

  const mapCenter = useMemo(() => {
    if (selectedPoint) {
      return { lat: selectedPoint.lat, lng: selectedPoint.lng };
    }
    return FALLBACK_CENTER;
  }, [selectedPoint]);

  const setFieldValue = (path: string, value: any) => {
    setFormValues((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i += 1) {
        const key = keys[i];
        if (cursor[key] === undefined) {
          cursor[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
        }
        cursor = cursor[key];
      }
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const hydrateLocationFromCoordinates = (lat: number, lng: number) => {
    setFieldValue("location.coordinates", [Number(lng.toFixed(6)), Number(lat.toFixed(6))]);

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
      setFormValues((prev: any) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [Number(lng.toFixed(6)), Number(lat.toFixed(6))],
          address: result.formatted_address || prev.location.address,
          city: parsed.city || prev.location.city,
          state: parsed.state || prev.location.state,
          postalCode: parsed.postalCode || prev.location.postalCode,
          country: parsed.country || prev.location.country,
        },
      }));
    });
  };

  const detectCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Geolocation is not supported on this device.",
        status: "warning",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        hydrateLocationFromCoordinates(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        toast({
          title: "Unable to fetch location",
          description: error.message || "Please pick the location manually on the map.",
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
    hydrateLocationFromCoordinates(lat, lng);
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    if (stepIndex === 0 && !formValues.name?.trim()) {
      errors.name = "Store name is required.";
    }
    if (stepIndex === 0) {
      const gstError = getOptionalGstError(formValues.gstNumber);
      if (gstError) {
        errors.gstNumber = gstError;
      }
    }

    if (stepIndex === 1) {
      if (!hasPickedCoordinates(formValues.location?.coordinates)) {
        errors.coordinates = "Pick your shop location on the map.";
      }
      if (!formValues.location?.address?.trim()) {
        errors.address = "Address is required.";
      }
      if (!formValues.location?.city?.trim()) {
        errors.city = "City is required.";
      }
      if (!formValues.location?.state?.trim()) {
        errors.state = "State is required.";
      }
      if (!formValues.location?.country?.trim()) {
        errors.country = "Country is required.";
      }
    }

    if (stepIndex === 2) {
      if (!formValues.contactInfo?.phone?.trim()) {
        errors.phone = "Contact phone is required.";
      }
      if (!isValidEmail(formValues.contactInfo?.email || "")) {
        errors.email = "Enter a valid email address.";
      }
    }

    return errors;
  };

  const goNext = () => {
    const errors = validateCurrentStep();
    setStepErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setStepIndex((prev) => Math.min(onboardingSteps.length - 1, prev + 1));
  };

  const goBack = () => {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepErrors({});
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFinalSubmit = async () => {
    const errors = validateCurrentStep();
    setStepErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const preparedValues = {
        ...formValues,
        companyCode: createCompanyCode(
          formValues.name || "",
          formValues.contactInfo?.phone || accountPhone || "",
        ),
      };
      await onSubmit(preparedValues);
      toast({
        title: "Shop onboarding complete",
        description: "Your shop has been created and is now pending review.",
        status: "success",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Unable to create shop",
        description: error?.message || "Please review the details and try again.",
        status: "error",
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGalleryFilesSelected = (files: File[]) => {
    if (!files.length) return;

    const nextItems = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      isAdd: 1,
    }));

    setFieldValue("gallery", [...(formValues.gallery || []), ...nextItems]);
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%)"
      py={{ base: 6, md: 10 }}
    >
      <Container maxW="container.sm">
        <Box
          bg="whiteAlpha.900"
          borderRadius="3xl"
          borderWidth="1px"
          borderColor="teal.100"
          boxShadow="0 30px 90px rgba(15, 23, 42, 0.10)"
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
        >
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align="center">
              <Circle size="42px" bg="white" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  borderRadius="full"
                  onClick={goBack}
                />
              </Circle>
              <Badge
                bg="teal.50"
                color="teal.600"
                borderRadius="md"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="700"
              >
                Step {stepIndex + 1}/{onboardingSteps.length}
              </Badge>
            </Flex>

            <Box>
              <Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="teal" h="6px" />
            </Box>

            <Stack spacing={4}>
              <HStack spacing={3} align="center">
                <Circle size="50px" bg="teal.50" color="teal.600">
                  <Icon as={activeStep.icon} boxSize={5} />
                </Circle>
                <Box>
                  <Heading fontSize={{ base: "3xl", md: "4xl" }} color="gray.900" lineHeight="1.1">
                    {activeStep.title}
                  </Heading>
                  <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                    {activeStep.subtitle}
                  </Text>
                </Box>
              </HStack>
            </Stack>

            {stepIndex === 0 ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="600">
                      Store Name
                    </FormLabel>
                    <Input
                      value={formValues.name || ""}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        setFieldValue("name", nextName);
                        setFieldValue(
                          "companyCode",
                          createCompanyCode(nextName, formValues.contactInfo?.phone || accountPhone || ""),
                        );
                      }}
                      placeholder="Ex. Gupta General Store"
                      h="58px"
                      borderRadius="2xl"
                      borderColor="gray.200"
                      _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                    />
                    <FieldError message={stepErrors.name} />
                  </FormControl>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="600">
                        GST Number
                      </FormLabel>
                      <Input
                        value={formValues.gstNumber || ""}
                        onChange={(event) => setFieldValue("gstNumber", normalizeGstNumber(event.target.value))}
                        placeholder="Optional"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                      <FieldError message={stepErrors.gstNumber} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <Text fontSize="sm" color="gray.500">
                      Company Code
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="gray.800">
                      {formValues.companyCode || "Will be generated"}
                    </Text>
                    <Text mt={2} fontSize="sm" color="gray.500">
                      We generate this automatically so sellers do not need to fill it manually.
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl>
                    <FormLabel color="gray.700" fontWeight="600">
                      About Your Shop
                    </FormLabel>
                    <Textarea
                      value={formValues.description || ""}
                      onChange={(event) => {
                        setFieldValue("description", event.target.value);
                        if (!formValues.about) {
                          setFieldValue("about", event.target.value);
                        }
                      }}
                      placeholder="Tell buyers what you sell, your specialities, or the area you serve."
                      minH="140px"
                      borderRadius="2xl"
                      borderColor="gray.200"
                      _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                    />
                  </FormControl>
                </Box>
              </VStack>
            ) : null}

            {stepIndex === 1 ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <Flex
                    justify="space-between"
                    align={{ base: "start", lg: "center" }}
                    direction={{ base: "column", lg: "row" }}
                    gap={3}
                  >
                    <Box>
                      <Text fontSize="md" fontWeight="700" color="gray.900">
                        Choose shop location
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Tap the map to place your shop. We will auto-fill the address when possible.
                      </Text>
                    </Box>
                    <Button
                      leftIcon={<FiNavigation />}
                      variant="outline"
                      borderRadius="full"
                      w={{ base: "full", lg: "auto" }}
                      minH="48px"
                      px={5}
                      justifyContent="center"
                      textAlign="center"
                      whiteSpace="nowrap"
                      flexShrink={0}
                      alignSelf={{ base: "stretch", lg: "center" }}
                      onClick={detectCurrentLocation}
                      isLoading={geocoding}
                    >
                      Use current location
                    </Button>
                  </Flex>

                  <Box
                    mt={5}
                    h={{ base: "260px", md: "320px" }}
                    borderRadius="2xl"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="teal.100"
                    bg="teal.50"
                  >
                    {!GOOGLE_MAPS_API_KEY ? (
                      <CenteredBox h="100%">
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the map picker.
                        </Text>
                      </CenteredBox>
                    ) : loadError ? (
                      <CenteredBox h="100%">
                        <Text fontSize="sm" color="red.500" textAlign="center">
                          Failed to load Google Maps.
                        </Text>
                      </CenteredBox>
                    ) : !isLoaded ? (
                      <CenteredBox h="100%">
                        <Text fontSize="sm" color="gray.500">
                          Loading map...
                        </Text>
                      </CenteredBox>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={selectedPoint ? 15 : 11}
                        options={mapOptions}
                        onClick={handleMapClick}
                      >
                        {selectedPoint ? <MarkerF position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }} /> : null}
                      </GoogleMap>
                    )}
                  </Box>

                  <HStack mt={4} spacing={3} wrap="wrap">
                    <Badge colorScheme={selectedPoint ? "green" : "teal"} px={3} py={1} borderRadius="full">
                      {selectedPoint ? "Pin selected" : "Pin not selected"}
                    </Badge>
                    {selectedPoint ? (
                      <Text fontSize="sm" color="gray.500">
                        {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                      </Text>
                    ) : null}
                  </HStack>
                  <FieldError message={stepErrors.coordinates} />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700" fontWeight="600">
                        Address
                      </FormLabel>
                      <Input
                        value={formValues.location?.address || ""}
                        onChange={(event) => setFieldValue("location.address", event.target.value)}
                        placeholder="Shop address"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                      <FieldError message={stepErrors.address} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700" fontWeight="600">
                        City
                      </FormLabel>
                      <Input
                        value={formValues.location?.city || ""}
                        onChange={(event) => setFieldValue("location.city", event.target.value)}
                        placeholder="City"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                      <FieldError message={stepErrors.city} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700" fontWeight="600">
                        State
                      </FormLabel>
                      <Input
                        value={formValues.location?.state || ""}
                        onChange={(event) => setFieldValue("location.state", event.target.value)}
                        placeholder="State"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                      <FieldError message={stepErrors.state} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="600">
                        Postal Code
                      </FormLabel>
                      <Input
                        value={formValues.location?.postalCode || ""}
                        onChange={(event) => setFieldValue("location.postalCode", event.target.value)}
                        placeholder="Postal code"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()} gridColumn={{ base: "span 1", md: "span 2" }}>
                    <FormControl isRequired>
                      <FormLabel color="gray.700" fontWeight="600">
                        Country
                      </FormLabel>
                      <Input
                        value={formValues.location?.country || ""}
                        onChange={(event) => setFieldValue("location.country", event.target.value)}
                        placeholder="Country"
                        h="58px"
                        borderRadius="2xl"
                        borderColor="gray.200"
                        _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                      />
                      <FieldError message={stepErrors.country} />
                    </FormControl>
                  </Box>
                </SimpleGrid>
              </VStack>
            ) : null}

            {stepIndex === 2 ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <HStack spacing={3} mb={4}>
                    <Circle size="42px" bg="teal.50" color="teal.600">
                      <Icon as={FiPhone} />
                    </Circle>
                    <Box>
                      <Text fontWeight="700" color="gray.900">
                        Contact phone
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        This is what buyers will see on your shop profile.
                      </Text>
                    </Box>
                  </HStack>
                  <Input
                    value={formValues.contactInfo?.phone || ""}
                    onChange={(event) => setFieldValue("contactInfo.phone", event.target.value)}
                    placeholder="Phone number"
                    h="58px"
                    borderRadius="2xl"
                    borderColor="gray.200"
                    _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                  />
                  <FieldError message={stepErrors.phone} />
                </Box>

                <Box p={5} {...getFieldShellStyles()}>
                  <HStack spacing={3} mb={4}>
                    <Circle size="42px" bg="teal.50" color="teal.600">
                      <Icon as={FiMail} />
                    </Circle>
                    <Box>
                      <Text fontWeight="700" color="gray.900">
                        Email address
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Optional. Useful for invoices and buyer communication.
                      </Text>
                    </Box>
                  </HStack>
                  <Input
                    value={formValues.contactInfo?.email || ""}
                    onChange={(event) => setFieldValue("contactInfo.email", event.target.value)}
                    placeholder="Optional email"
                    h="58px"
                    borderRadius="2xl"
                    borderColor="gray.200"
                    _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
                  />
                  <FieldError message={stepErrors.email} />
                </Box>

                <Box p={5} {...getFieldShellStyles()}>
                  <Text fontWeight="700" color="gray.900">
                    What buyers will get from this
                  </Text>
                  <Divider my={4} />
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <HStack align="start">
                      <CheckIcon mt={1} color="green.500" />
                      <Text fontSize="sm" color="gray.600">
                        Easier order follow-up and payment coordination
                      </Text>
                    </HStack>
                    <HStack align="start">
                      <CheckIcon mt={1} color="green.500" />
                      <Text fontSize="sm" color="gray.600">
                        Better trust when buyers see verified contact details
                      </Text>
                    </HStack>
                  </Grid>
                </Box>
              </VStack>
            ) : null}

            {stepIndex === 3 ? (
              <VStack align="stretch" spacing={5}>
                <UploadCard
                  title="Shop logo"
                  helper="This appears across the dashboard and your shop listing."
                  files={formValues.logo?.file}
                  onFileChange={(file) =>
                    setFieldValue("logo", {
                      ...formValues.logo,
                      file: file ? [file] : [],
                      isAdd: file ? 1 : 0,
                      isDeleted: file ? 0 : 1,
                    })
                  }
                  onRemove={() =>
                    setFieldValue("logo", {
                      ...formValues.logo,
                      file: [],
                      isAdd: 0,
                      isDeleted: 1,
                    })
                  }
                />

                <UploadCard
                  title="Cover image"
                  helper="A wide banner image for your shop profile."
                  files={formValues.coverImage?.file}
                  onFileChange={(file) =>
                    setFieldValue("coverImage", {
                      ...formValues.coverImage,
                      file: file ? [file] : [],
                      isAdd: file ? 1 : 0,
                      isDeleted: file ? 0 : 1,
                    })
                  }
                  onRemove={() =>
                    setFieldValue("coverImage", {
                      ...formValues.coverImage,
                      file: [],
                      isAdd: 0,
                      isDeleted: 1,
                    })
                  }
                />

                <Box p={5} {...getFieldShellStyles()}>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontSize="md" fontWeight="700" color="gray.900">
                        Shop gallery
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Optional photos of your store, shelves, or products.
                      </Text>
                    </Box>

                    <Input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      display="none"
                      onChange={(event) => {
                        handleGalleryFilesSelected(Array.from(event.target.files || []));
                        event.target.value = "";
                      }}
                    />

                    <Box
                      role="button"
                      tabIndex={0}
                      borderWidth="1px"
                      borderStyle="dashed"
                      borderColor="teal.200"
                      borderRadius="2xl"
                      py={7}
                      px={6}
                      bg="teal.50"
                      textAlign="center"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ borderColor: "teal.400", bg: "teal.100" }}
                      _focusVisible={{ outline: "none", boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.22)" }}
                      onClick={() => galleryInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          galleryInputRef.current?.click();
                        }
                      }}
                    >
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        Tap to choose gallery images
                      </Text>
                      <Text mt={1} fontSize="xs" color="gray.500">
                        Upload multiple storefront or product photos
                      </Text>
                    </Box>

                    <HStack spacing={3} flexWrap="wrap">
                      <Button
                        colorScheme="teal"
                        borderRadius="full"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        Add Photos
                      </Button>
                      <Text fontSize="sm" color="gray.500">
                        {(formValues.gallery || []).length
                          ? `${formValues.gallery.length} photo${formValues.gallery.length > 1 ? "s" : ""} selected`
                          : "No gallery images selected yet."}
                      </Text>
                    </HStack>

                    {(formValues.gallery || []).length ? (
                      <VStack spacing={3} align="stretch">
                        {formValues.gallery.map((item: any, index: number) => (
                          <Box
                            key={`${item.title || "gallery"}-${index}`}
                            borderWidth="1px"
                            borderColor="teal.100"
                            bg="teal.50"
                            borderRadius="2xl"
                            px={4}
                            py={3}
                          >
                            <Flex
                              justify="space-between"
                              align={{ base: "start", md: "center" }}
                              direction={{ base: "column", md: "row" }}
                              gap={3}
                            >
                              <Box>
                                <Text fontWeight="600" color="gray.800">
                                  {item.title || item.file?.name || `Photo ${index + 1}`}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {item.file?.name || "Selected image"}
                                </Text>
                              </Box>
                              <Button
                                variant="ghost"
                                colorScheme="red"
                                borderRadius="full"
                                onClick={() =>
                                  setFieldValue(
                                    "gallery",
                                    formValues.gallery.filter((_: any, currentIndex: number) => currentIndex !== index),
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </Flex>
                          </Box>
                        ))}
                      </VStack>
                    ) : null}
                  </VStack>
                </Box>
              </VStack>
            ) : null}

            <Box pt={4}>
              <Button
                w="full"
                {...primaryButtonSx}
                onClick={stepIndex === onboardingSteps.length - 1 ? handleFinalSubmit : goNext}
                isLoading={submitting}
              >
                {stepIndex === onboardingSteps.length - 1 ? "Create shop" : "Continue"}
              </Button>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default SellerOnboardingWizard;
