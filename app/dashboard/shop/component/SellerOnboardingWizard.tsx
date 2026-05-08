"use client";

import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
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
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiCamera, FiLayers, FiMail, FiMapPin, FiNavigation, FiPhone, FiShoppingBag } from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  getOptionalGstError,
  normalizeGstNumber,
} from "../../../config/utils/gstValidation";
import { createCompanyCode } from "./utils/companyCode";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import { useMerchantFormSx } from "./merchantTheme";

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
    id: "identity",
    title: "Identity",
    subtitle: "Tell buyers what your shop is called and add business details.",
    icon: FiShoppingBag,
  },
  {
    id: "categories",
    title: "Categories",
    subtitle: "Choose the product categories your shop will sell in.",
    icon: FiLayers,
  },
  {
    id: "location",
    title: "Location",
    subtitle: "Drop a pin on the map so nearby buyers can discover your store.",
    icon: FiMapPin,
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Add the phone and optional email buyers can use to reach you.",
    icon: FiMail,
  },
  {
    id: "media",
    title: "Media",
    subtitle: "Upload your logo, cover, or product photos. You can skip and add them later.",
    icon: FiCamera,
  },
];

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
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cPage = useColorModeValue("#F4F7FE", dashboardPalette.page);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const cSuccess = useColorModeValue("green.500", dashboardPalette.success);
  const shellBg = useColorModeValue("white", dashboardPalette.shell);
  const merchantFormSx = useMerchantFormSx();

  const primaryButtonSx = {
    bg: cAccent,
    color: "white",
    _hover: { bg: cAccentStrong },
    _active: { transform: "scale(0.98)" },
    borderRadius: "18px",
    h: "56px",
    fontWeight: "700",
  };

  const getFieldShellStyles = () => ({
    borderRadius: "24px",
    borderWidth: "1px",
    borderColor: cBorder,
    bg: shellBg,
    boxShadow: useColorModeValue("sm", "0 18px 42px rgba(0, 0, 0, 0.24)"),
  });

  const fieldInputSx = {
    h: "58px",
    borderRadius: "16px",
    bg: cSurfaceSoft,
    borderColor: cBorderStrong,
    color: cText,
    _placeholder: { color: cTextSoft },
    _focusVisible: {
      borderColor: cAccent,
      boxShadow: `0 0 0 1px ${cAccent}`,
    },
  };

  const fieldTextareaSx = {
    borderRadius: "16px",
    bg: cSurfaceSoft,
    borderColor: cBorderStrong,
    color: cText,
    _placeholder: { color: cTextSoft },
    _focusVisible: {
      borderColor: cAccent,
      boxShadow: `0 0 0 1px ${cAccent}`,
    },
  };

  const router = useRouter();
  const toast = useToast({ position: "top-right", duration: 3000, isClosable: true });
  const { categoryStore } = stores;
  const [stepIndex, setStepIndex] = useState(0);
  const [formValues, setFormValues] = useState(initialValues);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    setFormValues({
      ...initialValues,
      categories: Array.isArray(initialValues.categories) ? initialValues.categories : [],
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

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await categoryStore.getAllCategories();
        const nextCategories = response?.data || categoryStore.categories || [];
        if (isMounted) {
          setCategoryOptions(Array.isArray(nextCategories) ? nextCategories : []);
        }
      } finally {
        if (isMounted) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [categoryStore]);

  const activeStep = onboardingSteps[stepIndex];
  const activeStepId = activeStep.id;
  const progress = ((stepIndex + 1) / onboardingSteps.length) * 100;
  const rootCategoryOptions = useMemo(
    () => categoryOptions.filter((category) => !category.parent && category.isActive !== false),
    [categoryOptions],
  );
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

    if (activeStepId === "identity" && !formValues.name?.trim()) {
      errors.name = "Store name is required.";
    }
    if (activeStepId === "identity") {
      const gstError = getOptionalGstError(formValues.gstNumber);
      if (gstError) {
        errors.gstNumber = gstError;
      }
    }

    if (activeStepId === "categories" && !(formValues.categories || []).length) {
      errors.categories = "Select at least one category.";
    }

    if (activeStepId === "location") {
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

    if (activeStepId === "contact") {
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
            <Text fontSize="md" fontWeight="700" color={cText}>
              {title}
            </Text>
            <Text fontSize="sm" color={cTextSoft}>
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
              borderColor={cBorderStrong}
              borderRadius="22px"
              py={8}
              px={6}
              textAlign="center"
              bg={useColorModeValue("gray.50", "rgba(255,255,255,0.02)")}
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ borderColor: cAccent, bg: cSurfaceSoft }}
              _focusVisible={{ outline: "none", boxShadow: `0 0 0 3px ${cAccentSoft}` }}
              onClick={openPicker}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openPicker();
                }
              }}
            >
              <Text fontSize="sm" fontWeight="600" color={cText}>
                Tap to upload image
              </Text>
              <Text mt={1} fontSize="xs" color={cTextSoft}>
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
              borderColor={cBorderStrong}
              color={cAccentStrong}
              _hover={{ bg: cAccentSoft }}
              onClick={openPicker}
            >
              {hasFiles ? "Replace" : "Upload"}
            </Button>
            {hasFiles ? (
              <Button
                variant="ghost"
                borderRadius="16px"
                color={cDanger}
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

  return (
    <Box
      minH="100vh"
      bg={cPage}
      py={{ base: 6, md: 10 }}
      sx={merchantFormSx}
    >
      <Container maxW="container.lg">
        <Box
          bg={shellBg}
          borderRadius="32px"
          borderWidth="1px"
          borderColor={cBorder}
          boxShadow={useColorModeValue("sm", "0 30px 90px rgba(0, 0, 0, 0.30)")}
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
        >
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align="center">
              <Circle
                size="42px"
                bg={cSurfaceSoft}
                borderWidth="1px"
                borderColor={cBorder}
                boxShadow="sm"
              >
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  borderRadius="full"
                  onClick={goBack}
                  color={cText}
                  _hover={{ bg: cAccentSoft, color: cAccentStrong }}
                />
              </Circle>
              <Badge
                bg="rgba(214, 183, 114, 0.10)"
                color={cAccentStrong}
                borderRadius="md"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="700"
                border="1px solid"
                borderColor={cBorder}
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
                <Circle size="50px" bg="rgba(214, 183, 114, 0.10)" color={cAccent}>
                  <Icon as={activeStep.icon} boxSize={5} />
                </Circle>
                <Box>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.28em"
                    color={cTextSoft}
                  >
                    Building Your Shop
                  </Text>
                  <Heading
                    mt={2}
                    fontSize={{ base: "3xl", md: "4xl" }}
                    color={cText}
                    lineHeight="1.05"
                    fontWeight="500"
                  >
                    {activeStep.title}
                  </Heading>
                  <Text color={cTextMuted} fontSize={{ base: "sm", md: "md" }}>
                    {activeStep.subtitle}
                  </Text>
                </Box>
              </HStack>
            </Stack>

            {activeStepId === "identity" ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl isRequired>
                    <FormLabel color={cTextMuted} fontWeight="600">
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
                      <FormLabel color={cTextMuted} fontWeight="600">
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
                    <Text fontSize="sm" color={cTextSoft}>
                      Company Code
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color={cText}>
                      {formValues.companyCode || "Will be generated"}
                    </Text>
                    <Text mt={2} fontSize="sm" color={cTextSoft}>
                      We generate this automatically so sellers do not need to fill it manually.
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl>
                    <FormLabel color={cTextMuted} fontWeight="600">
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

            {activeStepId === "categories" ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontSize="md" fontWeight="700" color={cText}>
                        Select shop categories
                      </Text>
                      <Text fontSize="sm" color={cTextSoft}>
                        These categories will control what you can select while adding products later.
                      </Text>
                    </Box>

                    {categoryLoading ? (
                      <HStack color={cTextMuted}>
                        <Spinner size="sm" color={cAccent} />
                        <Text fontSize="sm">Loading categories...</Text>
                      </HStack>
                    ) : rootCategoryOptions.length === 0 ? (
                      <Box
                        borderWidth="1px"
                        borderColor={cBorderStrong}
                        borderRadius="20px"
                        p={5}
                        bg={cSurfaceSoft}
                      >
                        <Text fontSize="sm" color={cTextMuted}>
                          No categories are available yet. Please ask superadmin to add categories before completing seller onboarding.
                        </Text>
                      </Box>
                    ) : (
                      <CheckboxGroup
                        value={formValues.categories || []}
                        onChange={(selected) => setFieldValue("categories", selected)}
                      >
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                          {rootCategoryOptions.map((category) => {
                            const isSelected = (formValues.categories || []).includes(category.name);
                            return (
                              <Checkbox
                                key={category._id}
                                value={category.name}
                                borderWidth="1px"
                                borderColor={isSelected ? cAccent : cBorderStrong}
                                bg={isSelected ? cAccentSoft : cSurfaceSoft}
                                borderRadius="18px"
                                px={4}
                                py={3}
                                color={isSelected ? cAccentStrong : cTextMuted}
                                fontWeight="700"
                                _hover={{ borderColor: cAccent, color: cAccentStrong }}
                              >
                                {category.name}
                              </Checkbox>
                            );
                          })}
                        </SimpleGrid>
                      </CheckboxGroup>
                    )}

                    <FieldError message={stepErrors.categories} />

                    {(formValues.categories || []).length ? (
                      <HStack spacing={2} flexWrap="wrap">
                        {(formValues.categories || []).map((categoryName: string) => (
                          <Badge
                            key={categoryName}
                            bg="rgba(214, 183, 114, 0.12)"
                            color={cAccentStrong}
                            border="1px solid"
                            borderColor={cBorder}
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {categoryName}
                          </Badge>
                        ))}
                      </HStack>
                    ) : null}
                  </VStack>
                </Box>
              </VStack>
            ) : null}

            {activeStepId === "location" ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <Flex
                    justify="space-between"
                    align={{ base: "start", lg: "center" }}
                    direction={{ base: "column", lg: "row" }}
                    gap={3}
                  >
                    <Box>
                      <Text fontSize="md" fontWeight="700" color={cText}>
                        Choose shop location
                      </Text>
                      <Text fontSize="sm" color={cTextSoft}>
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
                      borderColor={cBorderStrong}
                      color={cAccentStrong}
                      _hover={{ bg: cAccentSoft }}
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
                    borderColor={cBorderStrong}
                    bg={cSurfaceSoft}
                  >
                    {!GOOGLE_MAPS_API_KEY ? (
                      <CenteredBox h="100%">
                        <Text fontSize="sm" color={cTextMuted} textAlign="center">
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
                        <Text fontSize="sm" color={cTextSoft}>
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
                      bg={selectedPoint ? "rgba(70, 201, 139, 0.14)" : cAccentSoft}
                      color={selectedPoint ? cSuccess : cAccentStrong}
                      border="1px solid"
                      borderColor={selectedPoint ? "rgba(70, 201, 139, 0.24)" : cBorder}
                    >
                      {selectedPoint ? "Pin selected" : "Pin not selected"}
                    </Badge>
                    {selectedPoint ? (
                      <Text fontSize="sm" color={cTextSoft}>
                        {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                      </Text>
                    ) : null}
                  </HStack>
                  <FieldError message={stepErrors.coordinates} />
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <Box p={5} {...getFieldShellStyles()}>
                    <FormControl isRequired>
                      <FormLabel color={cTextMuted} fontWeight="600">
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
                      <FormLabel color={cTextMuted} fontWeight="600">
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
                      <FormLabel color={cTextMuted} fontWeight="600">
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
                    <FormControl isRequired>
                      <FormLabel color={cTextMuted} fontWeight="600">
                        Postal Code
                      </FormLabel>
                      <Input
                        value={formValues.location?.postalCode || ""}
                        onChange={(event) => setFieldValue("location.postalCode", event.target.value)}
                        placeholder="PIN Code"
                        sx={fieldInputSx}
                      />
                    </FormControl>
                  </Box>
                </SimpleGrid>
              </VStack>
            ) : null}

            {activeStepId === "contact" ? (
              <VStack align="stretch" spacing={5}>
                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl isRequired>
                    <FormLabel color={cTextMuted} fontWeight="600">
                      Phone Number
                    </FormLabel>
                    <HStack>
                      <Circle size="52px" bg={cSurfaceSoft} border="1px solid" borderColor={cBorder}>
                        <Icon as={FiPhone} color={cAccent} />
                      </Circle>
                      <Input
                        value={formValues.contactInfo?.phone || ""}
                        onChange={(event) => setFieldValue("contactInfo.phone", event.target.value)}
                        placeholder="Contact phone"
                        sx={fieldInputSx}
                      />
                    </HStack>
                    <FieldError message={stepErrors.phone} />
                  </FormControl>
                </Box>

                <Box p={5} {...getFieldShellStyles()}>
                  <FormControl>
                    <FormLabel color={cTextMuted} fontWeight="600">
                      Email Address
                    </FormLabel>
                    <HStack>
                      <Circle size="52px" bg={cSurfaceSoft} border="1px solid" borderColor={cBorder}>
                        <Icon as={FiMail} color={cAccent} />
                      </Circle>
                      <Input
                        value={formValues.contactInfo?.email || ""}
                        onChange={(event) => setFieldValue("contactInfo.email", event.target.value)}
                        placeholder="Business email (optional)"
                        sx={fieldInputSx}
                      />
                    </HStack>
                    <FieldError message={stepErrors.email} />
                  </FormControl>
                </Box>
              </VStack>
            ) : null}

            {activeStepId === "media" ? (
              <VStack align="stretch" spacing={6}>
                <UploadCard
                  title="Shop Logo"
                  helper="Upload a square logo for your shop brand."
                  files={formValues.logo?.file}
                  onFileChange={(file) => setFieldValue("logo", { file: file ? [file] : [], isAdd: 1 })}
                  onRemove={() => setFieldValue("logo", { file: [], isDeleted: 1 })}
                />

                <UploadCard
                  title="Cover Image"
                  helper="Add a beautiful wide banner for your shop profile."
                  files={formValues.coverImage?.file}
                  onFileChange={(file) => setFieldValue("coverImage", { file: file ? [file] : [], isAdd: 1 })}
                  onRemove={() => setFieldValue("coverImage", { file: [], isDeleted: 1 })}
                />

                <Box p={5} {...getFieldShellStyles()}>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontSize="md" fontWeight="700" color={cText}>
                        Shop Gallery
                      </Text>
                      <Text fontSize="sm" color={cTextSoft}>
                        Upload up to 10 photos of your products or store interior.
                      </Text>
                    </Box>

                    {formValues.gallery?.length > 0 ? (
                      <ShowFileUploadFile
                        files={formValues.gallery.map((g: any) => g.file)}
                        removeFile={(index) => {
                          const next = [...formValues.gallery];
                          next.splice(index, 1);
                          setFieldValue("gallery", next);
                        }}
                        edit={false}
                      />
                    ) : null}

                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        handleGalleryFilesSelected(Array.from(event.target.files || []));
                        event.target.value = "";
                      }}
                      style={{ display: "none" }}
                    />

                    <Button
                      variant="outline"
                      borderRadius="16px"
                      borderColor={cBorderStrong}
                      color={cAccentStrong}
                      _hover={{ bg: cAccentSoft }}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      Add Photos to Gallery
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            ) : null}

            <Flex justify="space-between" pt={4}>
              <Button
                variant="ghost"
                borderRadius="18px"
                px={8}
                h="56px"
                color={cTextMuted}
                _hover={{ bg: cSurfaceSoft, color: cText }}
                onClick={goBack}
              >
                Back
              </Button>
              <Button
                {...primaryButtonSx}
                px={10}
                isLoading={submitting}
                onClick={stepIndex === onboardingSteps.length - 1 ? handleFinalSubmit : goNext}
              >
                {stepIndex === onboardingSteps.length - 1 ? "Finish & Launch" : "Continue"}
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default SellerOnboardingWizard;
