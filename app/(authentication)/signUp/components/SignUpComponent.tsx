"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Heading,
  HStack,
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
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import {
  FiCamera,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import stores from "../../../store/stores";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  getOptionalGstError,
  normalizeGstNumber,
} from "../../../config/utils/gstValidation";
import { readFileAsBase64 } from "../../../config/utils/utils";
import { createCompanyCode } from "../../../dashboard/shop/component/utils/companyCode";

const MotionBox = motion(Box);
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const FALLBACK_CENTER = { lat: 28.6139, lng: 77.209 };
const mapContainerStyle = { width: "100%", height: "100%" };
const phoneRegex = /^\d{10}$/;

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
    { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfdbfe" }] },
  ],
};

type Intent = "user" | "seller";

const userSteps = [
  {
    title: "Let's get started",
    subtitle: "Enter your phone number to join the platform.",
    icon: FiPhone,
  },
  {
    title: "Tell us about you",
    subtitle: "We just need a couple of details to create your account.",
    icon: FiUser,
  },
  {
    title: "Verify OTP",
    subtitle: "Enter the OTP sent to your phone number.",
    icon: CheckIcon,
  },
];

const sellerSteps = [
  {
    title: "Let's get started",
    subtitle: "Enter the phone number you want to use for seller access.",
    icon: FiPhone,
  },
  {
    title: "Tell us about your shop",
    subtitle: "Add the basics buyers need to recognize your business.",
    icon: FiShoppingBag,
  },
  {
    title: "Set your shop location",
    subtitle: "Drop a pin on the map so nearby buyers can find you.",
    icon: FiMapPin,
  },
  {
    title: "Contact details",
    subtitle: "Add the public phone and optional email for your shop.",
    icon: FiMail,
  },
  {
    title: "Show your shop",
    subtitle: "Upload your logo, storefront photo, or some product images.",
    icon: FiCamera,
  },
  {
    title: "Verify OTP",
    subtitle: "We have sent an OTP to your phone number.",
    icon: CheckIcon,
  },
];

const panelStyles = {
  bg: "white",
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "3xl",
  boxShadow: "0 28px 90px rgba(15, 23, 42, 0.08)",
};

const primaryButtonStyles = {
  bgGradient: "linear(to-r, teal.500, cyan.500)",
  color: "white",
  h: "56px",
  borderRadius: "full",
  fontWeight: "700",
  _hover: { bgGradient: "linear(to-r, teal.600, cyan.600)" },
  _active: { transform: "scale(0.98)" },
};

const inputStyles = {
  h: "58px",
  borderRadius: "2xl",
  borderColor: "gray.200",
  _focusVisible: { borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" },
};

const fieldCardStyles = {
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "2xl",
  bg: "white",
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.04)",
  p: 5,
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

const CenteredBox = ({ children, ...props }: any) => (
  <Flex align="center" justify="center" {...props}>
    {children}
  </Flex>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <Text mt={2} fontSize="sm" color="red.500">
      {message}
    </Text>
  ) : null;

const getErrorText = (error: any) =>
  String(
    error?.message ||
      error?.data?.message ||
      error?.response?.data?.message ||
      error?.response?.data ||
      error ||
      "",
  ).toLowerCase();

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

  return (
    <Box {...fieldCardStyles}>
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
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="teal.200"
            borderRadius="2xl"
            py={8}
            px={6}
            textAlign="center"
            bg="teal.50"
          >
            <Text fontSize="sm" color="gray.600">
              Tap to upload image
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
          <Button variant="outline" borderRadius="full" onClick={() => inputRef.current?.click()}>
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

const SignUpForm = observer(() => {
  const router = useRouter();
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const { auth, companyStore } = stores;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [intent, setIntent] = useState<Intent>("user");
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);

  const [userData, setUserData] = useState({
    phone: "",
    name: "",
    email: "",
  });

  const [sellerData, setSellerData] = useState({
    storeName: "",
    gstNumber: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      coordinates: [0, 0],
    },
    contactPhone: "",
    logo: { file: [], isAdd: 0, isDeleted: 0 },
    coverImage: { file: [], isAdd: 0, isDeleted: 0 },
    gallery: [] as Array<{ file: File; title: string; isAdd: number }>,
  });

  const steps = intent === "seller" ? sellerSteps : userSteps;
  const activeStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isOtpStep = stepIndex === steps.length - 1;
  const selectedCoordinates = sellerData.location.coordinates;
  const selectedPoint = hasPickedCoordinates(selectedCoordinates)
    ? { lng: Number(selectedCoordinates[0]), lat: Number(selectedCoordinates[1]) }
    : null;

  const mapCenter = useMemo(() => {
    if (selectedPoint) {
      return { lat: selectedPoint.lat, lng: selectedPoint.lng };
    }
    return FALLBACK_CENTER;
  }, [selectedPoint]);

  useEffect(() => {
    setSellerData((prev) => ({
      ...prev,
      contactPhone: prev.contactPhone || userData.phone,
    }));
  }, [userData.phone]);

  const setIntentSelection = (nextIntent: Intent) => {
    setIntent(nextIntent);
    setStepIndex(0);
    setToken("");
    setOtp("");
    setErrors({});
  };

  const setSellerFieldValue = (path: string, value: any) => {
    setSellerData((prev: any) => {
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

  const hydrateSellerLocation = (lat: number, lng: number) => {
    setSellerFieldValue("location.coordinates", [Number(lng.toFixed(6)), Number(lat.toFixed(6))]);

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
      setSellerData((prev) => ({
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
        hydrateSellerLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
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
    hydrateSellerLocation(lat, lng);
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};

    if (stepIndex === 0 && !phoneRegex.test(userData.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (intent === "user" && stepIndex === 1) {
      if (!userData.name.trim()) nextErrors.name = "Full name is required.";
      if (!isValidEmail(userData.email)) nextErrors.email = "Enter a valid email address.";
    }

    if (intent === "seller" && stepIndex === 1) {
      if (!userData.name.trim()) nextErrors.name = "Owner name is required.";
      if (!sellerData.storeName.trim()) nextErrors.storeName = "Store name is required.";
      const gstError = getOptionalGstError(sellerData.gstNumber);
      if (gstError) nextErrors.gstNumber = gstError;
    }

    if (intent === "seller" && stepIndex === 2) {
      if (!hasPickedCoordinates(sellerData.location.coordinates)) nextErrors.coordinates = "Pick your shop location on the map.";
      if (!sellerData.location.address.trim()) nextErrors.address = "Address is required.";
      if (!sellerData.location.city.trim()) nextErrors.city = "City is required.";
      if (!sellerData.location.state.trim()) nextErrors.state = "State is required.";
      if (!sellerData.location.country.trim()) nextErrors.country = "Country is required.";
    }

    if (intent === "seller" && stepIndex === 3) {
      if (!phoneRegex.test(sellerData.contactPhone.trim())) nextErrors.contactPhone = "Enter a valid 10-digit store phone number.";
      if (!isValidEmail(userData.email)) nextErrors.email = "Enter a valid email address.";
    }

    if (isOtpStep && otp.trim().length < 6) {
      nextErrors.otp = "Enter the 6-digit OTP.";
    }

    return nextErrors;
  };

  const handleImageProcessing = async (file?: File | null) => {
    if (!file) return null;
    const buffer = await readFileAsBase64(file);
    return {
      buffer,
      filename: file.name,
      type: file.type,
      isAdd: 1,
      isDeleted: 0,
    };
  };

  const createSellerCompany = async () => {
    const basePayload: any = {
      name: sellerData.storeName.trim(),
      description: sellerData.description.trim(),
      about: sellerData.description.trim(),
      gstNumber: normalizeGstNumber(sellerData.gstNumber) || undefined,
      location: sellerData.location,
      contactInfo: {
        phone: sellerData.contactPhone.trim() || userData.phone.trim(),
        email: userData.email.trim() || undefined,
      },
      userId: auth.user?._id,
    };

    const logoFile = Array.isArray(sellerData.logo.file) ? sellerData.logo.file[0] : null;
    const coverFile = Array.isArray(sellerData.coverImage.file) ? sellerData.coverImage.file[0] : null;
    const logo = await handleImageProcessing(logoFile);
    const coverImage = await handleImageProcessing(coverFile);
    if (logo) basePayload.logo = logo;
    if (coverImage) basePayload.coverImage = coverImage;

    if (sellerData.gallery.length) {
      const gallery = await Promise.all(
        sellerData.gallery.map(async (item) => {
          const fileData = await handleImageProcessing(item.file);
          return fileData ? { file: fileData, title: item.title } : null;
        })
      );
      basePayload.gallery = gallery.filter(Boolean);
    }

    const phoneForCode = sellerData.contactPhone.trim() || userData.phone.trim();
    let lastError: any = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await companyStore.createCompany({
          ...basePayload,
          companyCode: createCompanyCode(basePayload.name, phoneForCode, attempt),
        });
        return;
      } catch (error: any) {
        lastError = error;
        const message = error?.message || error?.data?.message || "";
        if (/company code already exists/i.test(message)) continue;
        throw error;
      }
    }

    throw lastError;
  };

  const submitRegistration = async () => {
    setLoading(true);
    try {
      const payload = {
        name: userData.name.trim() || undefined,
        phone: userData.phone.trim(),
        email: userData.email.trim() || undefined,
        onboardingIntent: intent,
      };

      const data = await auth.register(payload);
      if (data?.token) {
        setToken(data.token);
        setStepIndex(steps.length - 1);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the OTP.",
          status: "success",
        });
      }
    } catch (error: any) {
      const errorText = getErrorText(error);
      if (errorText.includes("user with this mobile number already exists")) {
        setErrors({ phone: "This mobile number is already registered. Please sign in instead." });
        setStepIndex(0);
        toast({
          title: "Number already exists",
          description: "Please use a different mobile number or sign in.",
          status: "warning",
        });
        return;
      }
      toast({
        title: "Registration Failed",
        description: error?.message || "Something went wrong.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const nextErrors = validateCurrentStep();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (stepIndex === 0) {
      setLoading(true);
      try {
        const availability = await auth.checkSignupPhoneAvailability(userData.phone.trim());
        if (!availability?.available) {
          setErrors({ phone: "This mobile number is already registered. Please sign in instead." });
          toast({
            title: "Number already exists",
            description: "Please use a different mobile number or sign in.",
            status: "warning",
          });
          return;
        }
      } catch (error: any) {
        toast({
          title: "Unable to verify phone number",
          description: error?.message || "Please try again.",
          status: "error",
        });
        return;
      } finally {
        setLoading(false);
      }
    }

    const isLastPreOtpStep = stepIndex === steps.length - 2;
    if (isLastPreOtpStep) {
      await submitRegistration();
      return;
    }

    setStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleVerify = async () => {
    const nextErrors = validateCurrentStep();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token missing. Please try registering again.");
      }

      await auth.verifyRegisterOtp({
        token,
        otp,
      });

      if (intent === "seller") {
        try {
          await createSellerCompany();
          toast({
            title: "Seller onboarding complete",
            description: "Your seller account is ready.",
            status: "success",
          });
          router.push("/dashboard");
          return;
        } catch (companyError: any) {
          toast({
            title: "Account verified",
            description:
              companyError?.message ||
              "Your account is ready. Please finish shop setup from the seller dashboard.",
            status: "warning",
            duration: 4000,
          });
          router.push("/dashboard/shop");
          return;
        }
      }

      toast({
        title: "Account created",
        description: "Your account is ready to use.",
        status: "success",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error?.message || "Invalid OTP.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) return;
    if (isOtpStep) setOtp("");
    setErrors({});
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const renderPhoneStep = () => (
    <VStack align="stretch" spacing={6}>
      <Box {...fieldCardStyles}>
        <Text fontSize="sm" color="gray.500" mb={3}>
          I want to join as
        </Text>
        <SimpleGrid columns={2} spacing={3}>
          <Button
            variant={intent === "user" ? "solid" : "outline"}
            colorScheme="teal"
            borderRadius="2xl"
            h="52px"
            onClick={() => setIntentSelection("user")}
          >
            Buyer / User
          </Button>
          <Button
            variant={intent === "seller" ? "solid" : "outline"}
            colorScheme="blue"
            borderRadius="2xl"
            h="52px"
            onClick={() => setIntentSelection("seller")}
          >
            Seller
          </Button>
        </SimpleGrid>
      </Box>

      <Box {...fieldCardStyles}>
        <FormControl isRequired>
          <FormLabel color="gray.700" fontWeight="600">
            Phone Number
          </FormLabel>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={userData.phone}
            onChange={(event) => setUserData((prev) => ({ ...prev, phone: event.target.value.replace(/\D/g, "").slice(0, 10) }))}
            placeholder="Enter 10-digit mobile number"
            {...inputStyles}
          />
          <FieldError message={errors.phone} />
        </FormControl>
      </Box>
    </VStack>
  );

  const renderUserProfileStep = () => (
    <VStack align="stretch" spacing={5}>
      <Box {...fieldCardStyles}>
        <FormControl isRequired>
          <FormLabel color="gray.700" fontWeight="600">
            Full Name
          </FormLabel>
          <Input
            value={userData.name}
            onChange={(event) => setUserData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Your name"
            {...inputStyles}
          />
          <FieldError message={errors.name} />
        </FormControl>
      </Box>

      <Box {...fieldCardStyles}>
        <FormControl>
          <FormLabel color="gray.700" fontWeight="600">
            Email
          </FormLabel>
          <Input
            type="email"
            value={userData.email}
            onChange={(event) => setUserData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Optional email"
            {...inputStyles}
          />
          <FieldError message={errors.email} />
        </FormControl>
      </Box>
    </VStack>
  );

  const renderSellerBasicsStep = () => (
    <VStack align="stretch" spacing={5}>
      <Box {...fieldCardStyles}>
        <FormControl isRequired>
          <FormLabel color="gray.700" fontWeight="600">
            Owner Name
          </FormLabel>
          <Input
            value={userData.name}
            onChange={(event) => setUserData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Your full name"
            {...inputStyles}
          />
          <FieldError message={errors.name} />
        </FormControl>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Box {...fieldCardStyles}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="600">
              Store Name
            </FormLabel>
            <Input
              value={sellerData.storeName}
              onChange={(event) => setSellerData((prev) => ({ ...prev, storeName: event.target.value }))}
              placeholder="Ex. Sharma Electronics"
              {...inputStyles}
            />
            <FieldError message={errors.storeName} />
          </FormControl>
        </Box>

        <Box {...fieldCardStyles}>
          <FormControl>
            <FormLabel color="gray.700" fontWeight="600">
              GST Number
            </FormLabel>
            <Input
              value={sellerData.gstNumber}
              onChange={(event) =>
                setSellerData((prev) => ({
                  ...prev,
                  gstNumber: normalizeGstNumber(event.target.value),
                }))
              }
              placeholder="Optional"
              {...inputStyles}
            />
            <FieldError message={errors.gstNumber} />
          </FormControl>
        </Box>
      </SimpleGrid>

      <Box {...fieldCardStyles}>
        <FormControl>
          <FormLabel color="gray.700" fontWeight="600">
            About Your Shop
          </FormLabel>
          <Textarea
            value={sellerData.description}
            onChange={(event) => setSellerData((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="What do you sell? What makes your store special?"
            minH="140px"
            borderRadius="2xl"
            borderColor="gray.200"
            _focusVisible={{ borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" }}
          />
        </FormControl>
      </Box>
    </VStack>
  );

  const renderSellerLocationStep = () => (
    <VStack align="stretch" spacing={5}>
      <Box {...fieldCardStyles}>
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={3}
        >
          <Box>
            <Text fontSize="md" fontWeight="700" color="gray.900">
              Choose shop location
            </Text>
            <Text fontSize="sm" color="gray.500">
              Tap the map to place your shop. We will fill the address when possible.
            </Text>
          </Box>
          <Button
            leftIcon={<FiNavigation />}
            variant="outline"
            borderRadius="full"
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
        <FieldError message={errors.coordinates} />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Box {...fieldCardStyles}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="600">
              Address
            </FormLabel>
            <Input
              value={sellerData.location.address}
              onChange={(event) => setSellerFieldValue("location.address", event.target.value)}
              placeholder="Shop address"
              {...inputStyles}
            />
            <FieldError message={errors.address} />
          </FormControl>
        </Box>

        <Box {...fieldCardStyles}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="600">
              City
            </FormLabel>
            <Input
              value={sellerData.location.city}
              onChange={(event) => setSellerFieldValue("location.city", event.target.value)}
              placeholder="City"
              {...inputStyles}
            />
            <FieldError message={errors.city} />
          </FormControl>
        </Box>

        <Box {...fieldCardStyles}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="600">
              State
            </FormLabel>
            <Input
              value={sellerData.location.state}
              onChange={(event) => setSellerFieldValue("location.state", event.target.value)}
              placeholder="State"
              {...inputStyles}
            />
            <FieldError message={errors.state} />
          </FormControl>
        </Box>

        <Box {...fieldCardStyles}>
          <FormControl>
            <FormLabel color="gray.700" fontWeight="600">
              Postal Code
            </FormLabel>
            <Input
              value={sellerData.location.postalCode}
              onChange={(event) => setSellerFieldValue("location.postalCode", event.target.value)}
              placeholder="Postal code"
              {...inputStyles}
            />
          </FormControl>
        </Box>

        <Box {...fieldCardStyles} gridColumn={{ base: "span 1", md: "span 2" }}>
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="600">
              Country
            </FormLabel>
            <Input
              value={sellerData.location.country}
              onChange={(event) => setSellerFieldValue("location.country", event.target.value)}
              placeholder="Country"
              {...inputStyles}
            />
            <FieldError message={errors.country} />
          </FormControl>
        </Box>
      </SimpleGrid>
    </VStack>
  );

  const renderSellerContactStep = () => (
    <VStack align="stretch" spacing={5}>
      <Box {...fieldCardStyles}>
        <FormControl isRequired>
          <FormLabel color="gray.700" fontWeight="600">
            Store Phone
          </FormLabel>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={sellerData.contactPhone}
            onChange={(event) =>
              setSellerData((prev) => ({
                ...prev,
                contactPhone: event.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            placeholder="Public shop phone"
            {...inputStyles}
          />
          <FieldError message={errors.contactPhone} />
        </FormControl>
      </Box>

      <Box {...fieldCardStyles}>
        <FormControl>
          <FormLabel color="gray.700" fontWeight="600">
            Email
          </FormLabel>
          <Input
            type="email"
            value={userData.email}
            onChange={(event) => setUserData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Optional email"
            {...inputStyles}
          />
          <FieldError message={errors.email} />
        </FormControl>
      </Box>
    </VStack>
  );

  const renderSellerPhotosStep = () => (
    <VStack align="stretch" spacing={5}>
      <UploadCard
        title="Shop logo"
        helper="This appears across the dashboard and your shop listing."
        files={sellerData.logo.file}
        onFileChange={(file) =>
          setSellerData((prev) => ({
            ...prev,
            logo: { file: file ? [file] : [], isAdd: file ? 1 : 0, isDeleted: file ? 0 : 1 },
          }))
        }
        onRemove={() =>
          setSellerData((prev) => ({
            ...prev,
            logo: { file: [], isAdd: 0, isDeleted: 1 },
          }))
        }
      />

      <UploadCard
        title="Cover image"
        helper="A wide banner image for your shop profile."
        files={sellerData.coverImage.file}
        onFileChange={(file) =>
          setSellerData((prev) => ({
            ...prev,
            coverImage: { file: file ? [file] : [], isAdd: file ? 1 : 0, isDeleted: file ? 0 : 1 },
          }))
        }
        onRemove={() =>
          setSellerData((prev) => ({
            ...prev,
            coverImage: { file: [], isAdd: 0, isDeleted: 1 },
          }))
        }
      />

      <Box {...fieldCardStyles}>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Text fontSize="md" fontWeight="700" color="gray.900">
              Gallery photos
            </Text>
            <Text fontSize="sm" color="gray.500">
              Optional storefront or product images.
            </Text>
          </Box>

          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              const nextItems = files.map((file) => ({
                file,
                title: file.name.replace(/\.[^/.]+$/, ""),
                isAdd: 1,
              }));
              setSellerData((prev) => ({
                ...prev,
                gallery: [...prev.gallery, ...nextItems],
              }));
              event.target.value = "";
            }}
            border="none"
            p={0}
            sx={{
              "::file-selector-button": {
                background: "linear-gradient(90deg, #14b8a6, #06b6d4)",
                color: "#ffffff",
                borderRadius: "9999px",
                height: "48px",
                fontWeight: 700,
                border: "none",
                padding: "0 18px",
                marginRight: "12px",
                cursor: "pointer",
              },
            }}
          />

          {sellerData.gallery.length ? (
            <VStack spacing={3} align="stretch">
              {sellerData.gallery.map((item, index) => (
                <Box
                  key={`${item.title}-${index}`}
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
                        setSellerData((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, currentIndex) => currentIndex !== index),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No gallery images selected yet.
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  );

  const renderOtpStep = () => (
    <VStack spacing={8} align="center">
      <Text textAlign="center" color="gray.600">
        Enter the OTP sent to {userData.phone}
      </Text>
      <HStack>
        <PinInput otp type="number" value={otp} onChange={setOtp} size="lg" focusBorderColor="teal.500">
          <PinInputField inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
        </PinInput>
      </HStack>
      <FieldError message={errors.otp} />
      <Text fontSize="sm" color="gray.500" textAlign="center">
        You can go back if you want to change the phone number or signup details.
      </Text>
    </VStack>
  );

  const renderCurrentStep = () => {
    if (stepIndex === 0) return renderPhoneStep();
    if (intent === "user" && stepIndex === 1) return renderUserProfileStep();
    if (intent === "seller" && stepIndex === 1) return renderSellerBasicsStep();
    if (intent === "seller" && stepIndex === 2) return renderSellerLocationStep();
    if (intent === "seller" && stepIndex === 3) return renderSellerContactStep();
    if (intent === "seller" && stepIndex === 4) return renderSellerPhotosStep();
    return renderOtpStep();
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%)" py={{ base: 6, md: 10 }}>
      <Container maxW="container.md">
        <Box {...panelStyles} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align="center">
              <Circle size="42px" bg="white" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  borderRadius="full"
                  onClick={handleBack}
                  isDisabled={stepIndex === 0}
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
                Step {stepIndex + 1}/{steps.length}
              </Badge>
            </Flex>

            <Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="teal" h="6px" />

            <HStack spacing={3} align="center">
              <Circle size="50px" bg="teal.50" color="teal.600">
                <Icon as={activeStep.icon as any} boxSize={5} />
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

            <AnimatePresence mode="wait">
              <MotionBox
                key={`${intent}-${stepIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.24 }}
              >
                {renderCurrentStep()}
              </MotionBox>
            </AnimatePresence>

            <Button
              w="full"
              {...primaryButtonStyles}
              onClick={isOtpStep ? handleVerify : handleContinue}
              isLoading={loading}
            >
              {isOtpStep ? "Verify & Continue" : "Continue"}
            </Button>

            <Text textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Button variant="link" color="teal.600" onClick={() => router.push("/login")}>
                Sign in
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
});

export default SignUpForm;
