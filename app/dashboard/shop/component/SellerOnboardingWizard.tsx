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
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import { merchantFormSx } from "./merchantTheme";

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
    title: "Identity",
    subtitle: "Tell buyers what your shop is called and add business details.",
    icon: FiShoppingBag,
  },
  {
    title: "Location",
    subtitle: "Drop a pin on the map so nearby buyers can discover your store.",
    icon: FiMapPin,
  },
  {
    title: "Contact",
    subtitle: "Add the phone and optional email buyers can use to reach you.",
    icon: FiMail,
  },
  {
    title: "Media",
    subtitle: "Upload your logo, cover, or product photos. You can skip and add them later.",
    icon: FiCamera,
  },
];

const primaryButtonSx = {
  bg: dashboardPalette.accent,
  color: dashboardPalette.page,
  _hover: { bg: dashboardPalette.accentStrong },
  _active: { transform: "scale(0.98)" },
  borderRadius: "18px",
  h: "56px",
  fontWeight: "700",
};

const getFieldShellStyles = () => ({
  borderRadius: "24px",
  borderWidth: "1px",
  borderColor: dashboardPalette.border,
  bg: dashboardPalette.surface,
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.24)",
});

const fieldInputSx = {
  h: "58px",
  borderRadius: "16px",
  bg: dashboardPalette.surfaceSoft,
  borderColor: dashboardPalette.borderStrong,
  color: dashboardPalette.text,
  _placeholder: { color: dashboardPalette.textSoft },
  _focusVisible: {
    borderColor: dashboardPalette.accent,
    boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
  },
};

const fieldTextareaSx = {
  borderRadius: "16px",
  bg: dashboardPalette.surfaceSoft,
  borderColor: dashboardPalette.borderStrong,
  color: dashboardPalette.text,
  _placeholder: { color: dashboardPalette.textSoft },
  _focusVisible: {
    borderColor: dashboardPalette.accent,
    boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
  },
};

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
          <Text fontSize="md" fontWeight="700" color={dashboardPalette.text}>
            {title}
          </Text>
          <Text fontSize="sm" color={dashboardPalette.textSoft}>
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
            borderColor={dashboardPalette.borderStrong}
            borderRadius="22px"
            py={8}
            px={6}
            textAlign="center"
            bg={dashboardPalette.shellElevated}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ borderColor: dashboardPalette.accent, bg: dashboardPalette.surfaceSoft }}
            _focusVisible={{ outline: "none", boxShadow: `0 0 0 3px ${dashboardPalette.accentSoft}` }}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
          >
            <Text fontSize="sm" fontWeight="600" color={dashboardPalette.text}>
              Tap to upload image
            </Text>
            <Text mt={1} fontSize="xs" color={dashboardPalette.textSoft}>
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
          <Button
            variant="outline"
            borderRadius="16px"
            borderColor={dashboardPalette.borderStrong}
            color={dashboardPalette.accentStrong}
            _hover={{ bg: dashboardPalette.accentSoft }}
            onClick={openPicker}
          >
            {hasFiles ? "Replace" : "Upload"}
          </Button>
          {hasFiles ? (
            <Button
              variant="ghost"
              borderRadius="16px"
              color={dashboardPalette.danger}
              _hover={{ bg: "rgba(239, 107, 107, 0.12)" }}
              onClick={onRemove}
            >
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
      bg={dashboardPalette.page}
      py={{ base: 6, md: 10 }}
      sx={merchantFormSx}
    >
      <Container maxW="container.lg">
        <Box
          bg={dashboardPalette.shell}
          borderRadius="32px"
          borderWidth="1px"
          borderColor={dashboardPalette.border}
          boxShadow="0 30px 90px rgba(0, 0, 0, 0.30)"
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
        >
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align="center">
              <Circle
                size="42px"
                bg={dashboardPalette.surfaceSoft}
                borderWidth="1px"
                borderColor={dashboardPalette.border}
                boxShadow="sm"
              >
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  borderRadius="full"
                  onClick={goBack}
                  color={dashboardPalette.text}
                  _hover={{ bg: dashboardPalette.accentSoft, color: dashboardPalette.accentStrong }}
                />
              </Circle>
              <Badge
                bg="rgba(214, 183, 114, 0.10)"
                color={dashboardPalette.accentStrong}
                borderRadius="md"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="700"
                border="1px solid"
                borderColor={dashboardPalette.border}
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                Step {stepIndex + 1}/{onboardingSteps.length}
              </Badge>
            </Flex>

            <Box>
              <Progress value={progress} borderRadius="full" h="6px" />
            </Box>

            <Stack spacing={4}>
              <HStack spacing={3} align="center">
                <Circle size="50px" bg="rgba(214, 183, 114, 0.10)" color={dashboardPalette.accent}>
                  <Icon as={activeStep.icon} boxSize={5} />
                </Circle>
                <Box>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.28em"
                    color={dashboardPalette.textSoft}
                  >
                    Building Your Shop
                  </Text>
                  <Heading
                    mt={2}
                    fontSize={{ base: "3xl", md: "4xl" }}
                    color={dashboardPalette.text}
                    lineHeight="1.05"
                    fontWeight="500"
                    fontFamily='Georgia, "Times New Roman", serif'
                  >
                    {activeStep.title}
                  </Heading>
                  <Text color={dashboardPalette.textMuted} fontSize={{ base: "sm", md: "md" }}>
                    {activeStep.subtitle}
                  </Text>
                </Box>
              </HStack>
            </Stack>

            {stepIndex === 0 ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl isRequired>
                    <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
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
                      sx={fieldInputSx}
                    />
                    <FieldError message={stepErrors.name} />
                  </FormControl>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        GST Number
                      </FormLabel>
                      <Input
                        value={formValues.gstNumber || ""}
                        onChange={(event) => setFieldValue("gstNumber", normalizeGstNumber(event.target.value))}
                        placeholder="Optional"
                        sx={fieldInputSx}
                      />
                      <FieldError message={stepErrors.gstNumber} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <Text fontSize="sm" color={dashboardPalette.textSoft}>
                      Company Code
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color={dashboardPalette.text}>
                      {formValues.companyCode || "Will be generated"}
                    </Text>
                    <Text mt={2} fontSize="sm" color={dashboardPalette.textSoft}>
                      We generate this automatically so sellers do not need to fill it manually.
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl>
                    <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
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
                      sx={fieldTextareaSx}
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
                      <Text fontSize="md" fontWeight="700" color={dashboardPalette.text}>
                        Choose shop location
                      </Text>
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
                        Tap the map to place your shop. We will auto-fill the address when possible.
                      </Text>
                    </Box>
                    <Button
                      leftIcon={<FiNavigation />}
                      variant="outline"
                      borderRadius="16px"
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
                      borderColor={dashboardPalette.borderStrong}
                      color={dashboardPalette.accentStrong}
                      _hover={{ bg: dashboardPalette.accentSoft }}
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
                    borderColor={dashboardPalette.borderStrong}
                    bg={dashboardPalette.surfaceSoft}
                  >
                    {!GOOGLE_MAPS_API_KEY ? (
                      <CenteredBox h="100%">
                        <Text fontSize="sm" color={dashboardPalette.textMuted} textAlign="center">
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
                        <Text fontSize="sm" color={dashboardPalette.textSoft}>
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

                  <HStack mt={4} spacing={3} flexWrap="wrap">
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg={selectedPoint ? "rgba(70, 201, 139, 0.14)" : dashboardPalette.accentSoft}
                      color={selectedPoint ? dashboardPalette.success : dashboardPalette.accentStrong}
                      border="1px solid"
                      borderColor={selectedPoint ? "rgba(70, 201, 139, 0.24)" : dashboardPalette.border}
                    >
                      {selectedPoint ? "Pin selected" : "Pin not selected"}
                    </Badge>
                    {selectedPoint ? (
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
                        {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                      </Text>
                    ) : null}
                  </HStack>
                  <FieldError message={stepErrors.coordinates} />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        Address
                      </FormLabel>
                      <Input
                        value={formValues.location?.address || ""}
                        onChange={(event) => setFieldValue("location.address", event.target.value)}
                        placeholder="Shop address"
                        sx={fieldInputSx}
                      />
                      <FieldError message={stepErrors.address} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        City
                      </FormLabel>
                      <Input
                        value={formValues.location?.city || ""}
                        onChange={(event) => setFieldValue("location.city", event.target.value)}
                        placeholder="City"
                        sx={fieldInputSx}
                      />
                      <FieldError message={stepErrors.city} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        State
                      </FormLabel>
                      <Input
                        value={formValues.location?.state || ""}
                        onChange={(event) => setFieldValue("location.state", event.target.value)}
                        placeholder="State"
                        sx={fieldInputSx}
                      />
                      <FieldError message={stepErrors.state} />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        Postal Code
                      </FormLabel>
                      <Input
                        value={formValues.location?.postalCode || ""}
                        onChange={(event) => setFieldValue("location.postalCode", event.target.value)}
                        placeholder="Postal code"
                        sx={fieldInputSx}
                      />
                    </FormControl>
                  </Box>

                  <Box p={5} {...getFieldShellStyles()} gridColumn={{ base: "span 1", md: "span 2" }}>
                    <FormControl isRequired>
                      <FormLabel color={dashboardPalette.textMuted} fontWeight="600">
                        Country
                      </FormLabel>
                      <Input
                        value={formValues.location?.country || ""}
                        onChange={(event) => setFieldValue("location.country", event.target.value)}
                        placeholder="Country"
                        sx={fieldInputSx}
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
                    <Circle size="42px" bg="rgba(214, 183, 114, 0.10)" color={dashboardPalette.accent}>
                      <Icon as={FiPhone} />
                    </Circle>
                    <Box>
                      <Text fontWeight="700" color={dashboardPalette.text}>
                        Contact phone
                      </Text>
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
                        This is what buyers will see on your shop profile.
                      </Text>
                    </Box>
                  </HStack>
                  <Input
                    value={formValues.contactInfo?.phone || ""}
                    onChange={(event) => setFieldValue("contactInfo.phone", event.target.value)}
                    placeholder="Phone number"
                    sx={fieldInputSx}
                  />
                  <FieldError message={stepErrors.phone} />
                </Box>

                <Box p={5} {...getFieldShellStyles()}>
                  <HStack spacing={3} mb={4}>
                    <Circle size="42px" bg="rgba(214, 183, 114, 0.10)" color={dashboardPalette.accent}>
                      <Icon as={FiMail} />
                    </Circle>
                    <Box>
                      <Text fontWeight="700" color={dashboardPalette.text}>
                        Email address
                      </Text>
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
                        Optional. Useful for invoices and buyer communication.
                      </Text>
                    </Box>
                  </HStack>
                  <Input
                    value={formValues.contactInfo?.email || ""}
                    onChange={(event) => setFieldValue("contactInfo.email", event.target.value)}
                    placeholder="Optional email"
                    sx={fieldInputSx}
                  />
                  <FieldError message={stepErrors.email} />
                </Box>

                <Box p={5} {...getFieldShellStyles()}>
                  <Text fontWeight="700" color={dashboardPalette.text}>
                    What buyers will get from this
                  </Text>
                  <Divider my={4} />
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <HStack align="start">
                      <CheckIcon mt={1} color={dashboardPalette.success} />
                      <Text fontSize="sm" color={dashboardPalette.textMuted}>
                        Easier order follow-up and payment coordination
                      </Text>
                    </HStack>
                    <HStack align="start">
                      <CheckIcon mt={1} color={dashboardPalette.success} />
                      <Text fontSize="sm" color={dashboardPalette.textMuted}>
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
                      <Text fontSize="md" fontWeight="700" color={dashboardPalette.text}>
                        Shop gallery
                      </Text>
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
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
                      borderColor={dashboardPalette.borderStrong}
                      borderRadius="22px"
                      py={7}
                      px={6}
                      bg={dashboardPalette.shellElevated}
                      textAlign="center"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      _hover={{ borderColor: dashboardPalette.accent, bg: dashboardPalette.surfaceSoft }}
                      _focusVisible={{ outline: "none", boxShadow: `0 0 0 3px ${dashboardPalette.accentSoft}` }}
                      onClick={() => galleryInputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          galleryInputRef.current?.click();
                        }
                      }}
                    >
                      <Text fontSize="sm" fontWeight="600" color={dashboardPalette.text}>
                        Tap to choose gallery images
                      </Text>
                      <Text mt={1} fontSize="xs" color={dashboardPalette.textSoft}>
                        Upload multiple storefront or product photos
                      </Text>
                    </Box>

                    <HStack spacing={3} flexWrap="wrap">
                      <Button
                        borderRadius="16px"
                        bg={dashboardPalette.accent}
                        color={dashboardPalette.page}
                        _hover={{ bg: dashboardPalette.accentStrong }}
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        Add Photos
                      </Button>
                      <Text fontSize="sm" color={dashboardPalette.textSoft}>
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
                            borderColor={dashboardPalette.borderStrong}
                            bg="rgba(255,255,255,0.02)"
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
                                <Text fontWeight="600" color={dashboardPalette.text}>
                                  {item.title || item.file?.name || `Photo ${index + 1}`}
                                </Text>
                                <Text fontSize="sm" color={dashboardPalette.textSoft}>
                                  {item.file?.name || "Selected image"}
                                </Text>
                              </Box>
                              <Button
                                variant="ghost"
                                borderRadius="16px"
                                color={dashboardPalette.danger}
                                _hover={{ bg: "rgba(239, 107, 107, 0.12)" }}
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
