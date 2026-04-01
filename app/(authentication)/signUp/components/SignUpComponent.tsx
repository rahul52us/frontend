"use client";

import React, { startTransition, useEffect, useMemo, useRef, useState } from "react";
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
  FiCheckCircle,
  FiImage,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiShoppingBag,
  FiUploadCloud,
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
  icon,
  badgeText,
  formatHint,
  accentColor,
}: {
  title: string;
  helper: string;
  files: any;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  icon: any;
  badgeText: string;
  formatHint: string;
  accentColor: "teal" | "blue";
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasFiles = Boolean(files && ((Array.isArray(files) && files.length) || !Array.isArray(files)));
  const openPicker = () => inputRef.current?.click();
  const accentScheme = accentColor === "blue" ? "blue" : "teal";

  return (
    <Box
      {...fieldCardStyles}
      borderColor={hasFiles ? `${accentColor}.200` : fieldCardStyles.borderColor}
      bg={hasFiles ? "white" : `${accentColor}.50`}
    >
      <VStack align="stretch" spacing={4}>
        <Stack
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          spacing={3}
        >
          <HStack align="flex-start" spacing={4}>
            <Circle size="46px" bg="white" color={`${accentColor}.600`} boxShadow="sm" flexShrink={0}>
              <Icon as={icon} boxSize={5} />
            </Circle>
            <Box>
              <Text fontSize="md" fontWeight="700" color="gray.900">
                {title}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {helper}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme={hasFiles ? "green" : accentScheme} borderRadius="full" px={3} py={1}>
            {hasFiles ? "Added" : badgeText}
          </Badge>
        </Stack>

        {hasFiles ? (
          <Box borderWidth="1px" borderColor={`${accentColor}.100`} borderRadius="2xl" bg="white" px={4} py={1}>
            <ShowFileUploadFile files={files} removeFile={onRemove} edit={false} />
          </Box>
        ) : (
          <Box
            role="button"
            tabIndex={0}
            borderWidth="1px"
            borderStyle="dashed"
            borderColor={`${accentColor}.200`}
            borderRadius="2xl"
            py={8}
            px={6}
            textAlign="center"
            bg="white"
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ borderColor: `${accentColor}.400`, bg: `${accentColor}.50` }}
            _focusVisible={{ outline: "none", boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.22)" }}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
          >
            <VStack spacing={3}>
              <Circle size="50px" bg={`${accentColor}.50`} color={`${accentColor}.600`}>
                <Icon as={icon} boxSize={5} />
              </Circle>
              <Box>
                <Text fontSize="sm" fontWeight="700" color="gray.800">
                  Upload an image
                </Text>
                <Text mt={1} fontSize="sm" color="gray.500">
                  {formatHint}
                </Text>
              </Box>
            </VStack>
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

        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button colorScheme="teal" variant={hasFiles ? "outline" : "solid"} borderRadius="full" onClick={openPicker}>
            {hasFiles ? "Replace image" : "Choose image"}
          </Button>
          {hasFiles ? (
            <Button variant="ghost" colorScheme="red" borderRadius="full" onClick={onRemove}>
              Remove
            </Button>
          ) : null}
        </Stack>
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
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [isContactPhoneCustomized, setIsContactPhoneCustomized] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const navigationTimeoutRef = useRef<number | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const otpAutoSubmitRef = useRef("");
  const autoLocationAttemptedRef = useRef(false);

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
  const isSellerPhotosStep = intent === "seller" && stepIndex === 4;
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
    if (intent !== "seller" || isContactPhoneCustomized) {
      return;
    }

    setSellerData((prev) => {
      if (prev.contactPhone === userData.phone) {
        return prev;
      }

      return {
        ...prev,
        contactPhone: userData.phone,
      };
    });
  }, [intent, isContactPhoneCustomized, userData.phone]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const focusPhoneInput = (delay = 0) => {
    const runFocus = () => {
      phoneInputRef.current?.focus();
      phoneInputRef.current?.select?.();
    };

    if (delay > 0) {
      window.setTimeout(runFocus, delay);
      return;
    }

    window.requestAnimationFrame(runFocus);
  };

  const focusOtpInput = (delay = 0) => {
    const runFocus = () => {
      otpInputRef.current?.focus();
      otpInputRef.current?.select?.();
    };

    if (delay > 0) {
      window.setTimeout(runFocus, delay);
      return;
    }

    window.requestAnimationFrame(runFocus);
  };

  useEffect(() => {
    if (stepIndex === 0) {
      focusPhoneInput(180);
      return;
    }

    if (isOtpStep) {
      focusOtpInput(220);
    }
  }, [intent, isOtpStep, stepIndex]);

  useEffect(() => {
    const isSellerLocationStep = intent === "seller" && stepIndex === 2;
    const canAttemptAutoLocation = !GOOGLE_MAPS_API_KEY || isLoaded || Boolean(loadError);

    if (!isSellerLocationStep || !canAttemptAutoLocation) {
      return;
    }

    if (hasPickedCoordinates(sellerData.location.coordinates) || autoLocationAttemptedRef.current) {
      return;
    }

    autoLocationAttemptedRef.current = true;
    detectCurrentLocation({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent, stepIndex, isLoaded, loadError, sellerData.location.coordinates]);

  useEffect(() => {
    if (!isOtpStep || otp.trim().length < 6) {
      otpAutoSubmitRef.current = "";
    }
  }, [isOtpStep, otp]);

  const setIntentSelection = (nextIntent: Intent) => {
    setIntent(nextIntent);
    setStepIndex(0);
    setToken("");
    setOtp("");
    setErrors({});
    setIsContactPhoneCustomized(false);
    focusPhoneInput();
  };

  const navigateWithAnimation = (href: string) => {
    if (isRouteTransitioning) return;

    setIsRouteTransitioning(true);

    if (navigationTimeoutRef.current) {
      window.clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
    }, 220);
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

  const detectCurrentLocation = ({ silent = false }: { silent?: boolean } = {}) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      if (!silent) {
        toast({
          title: "Location unavailable",
          description: "Geolocation is not supported on this device.",
          status: "warning",
        });
      }
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingLocation(false);
        hydrateSellerLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setDetectingLocation(false);
        if (!silent) {
          toast({
            title: "Unable to fetch location",
            description: error.message || "Please place the pin manually on the map.",
            status: "error",
          });
        }
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

  const validateCurrentStep = (otpValue = otp) => {
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

    if (isOtpStep && otpValue.trim().length < 6) {
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
        focusOtpInput(260);
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

  const handleOtpChange = (value: string) => {
    setOtp(value);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    const nextOtp = value.trim();
    if (nextOtp.length < 6 || !isOtpStep || loading || !token) {
      return;
    }

    if (otpAutoSubmitRef.current === nextOtp) {
      return;
    }

    otpAutoSubmitRef.current = nextOtp;
    void handleVerify(nextOtp);
  };

  const handleVerify = async (otpValue = otp) => {
    const normalizedOtp = otpValue.trim();
    const nextErrors = validateCurrentStep(normalizedOtp);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token missing. Please try registering again.");
      }

      await auth.verifyRegisterOtp({
        token,
        otp: normalizedOtp,
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

  const handleGalleryFilesSelected = (files: File[]) => {
    if (!files.length) return;

    const nextItems = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      isAdd: 1,
    }));

    setSellerData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...nextItems],
    }));
  };

  const renderPhoneStep = () => (
    <VStack align="stretch" spacing={6}>
      <Box {...fieldCardStyles}>
        <Text fontSize="sm" color="gray.500" mb={3}>
          I want to join as
        </Text>
        <SimpleGrid columns={2} spacing={3}>
          <Button
            type="button"
            variant={intent === "user" ? "solid" : "outline"}
            colorScheme="teal"
            borderRadius="2xl"
            h="52px"
            onClick={() => setIntentSelection("user")}
          >
            Buyer / User
          </Button>
          <Button
            type="button"
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
            ref={phoneInputRef}
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

      <VStack align="stretch" spacing={5}>
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
      </VStack>

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
          align={{ base: "start", lg: "center" }}
          direction={{ base: "column", lg: "row" }}
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
            w={{ base: "full", lg: "auto" }}
            minH="48px"
            px={5}
            justifyContent="center"
            textAlign="center"
            whiteSpace="nowrap"
            flexShrink={0}
            alignSelf={{ base: "stretch", lg: "center" }}
            onClick={() => detectCurrentLocation()}
            isLoading={detectingLocation || geocoding}
            loadingText="Detecting location"
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
            onChange={(event) => {
              const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 10);
              setSellerData((prev) => ({
                ...prev,
                contactPhone: nextPhone,
              }));
              setIsContactPhoneCustomized(Boolean(nextPhone) && nextPhone !== userData.phone);
            }}
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

  const renderSellerPhotosStep = () => {
    const completedMediaCount =
      Number(Boolean(sellerData.logo.file.length)) +
      Number(Boolean(sellerData.coverImage.file.length)) +
      Number(Boolean(sellerData.gallery.length));

    return (
      <VStack align="stretch" spacing={5}>
        <Box
          borderWidth="1px"
          borderColor="teal.100"
          borderRadius="3xl"
          bgGradient="linear(to-br, teal.50, blue.50)"
          px={{ base: 5, md: 6 }}
          py={{ base: 5, md: 6 }}
        >
          <VStack align="stretch" spacing={5}>
            <Stack
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              spacing={4}
            >
              <Box maxW="2xl">
                <Badge colorScheme="teal" borderRadius="full" px={3} py={1}>
                  Final touch
                </Badge>
                <Heading mt={3} fontSize={{ base: "xl", md: "2xl" }} color="gray.900">
                  Show buyers what your shop looks like
                </Heading>
                <Text mt={2} color="gray.600">
                  A clear logo, a wide cover image, and a few real photos help people trust your shop faster. You can update any of these later.
                </Text>
              </Box>
              <Badge colorScheme={completedMediaCount >= 2 ? "green" : "blue"} borderRadius="full" px={4} py={2}>
                {completedMediaCount}/3 sections added
              </Badge>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              <Box bg="whiteAlpha.800" borderRadius="2xl" px={4} py={3}>
                <Text fontSize="sm" fontWeight="700" color="gray.800">
                  Logo
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Best for your listing image and brand identity.
                </Text>
              </Box>
              <Box bg="whiteAlpha.800" borderRadius="2xl" px={4} py={3}>
                <Text fontSize="sm" fontWeight="700" color="gray.800">
                  Cover image
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Great for storefronts, shelves, or your signature setup.
                </Text>
              </Box>
              <Box bg="whiteAlpha.800" borderRadius="2xl" px={4} py={3}>
                <Text fontSize="sm" fontWeight="700" color="gray.800">
                  Gallery
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Add 2-4 extra photos so buyers can quickly understand your shop.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
          <UploadCard
            title="Shop logo"
            helper="This appears across the dashboard and your shop listing."
            files={sellerData.logo.file}
            icon={FiShoppingBag}
            badgeText="Recommended"
            formatHint="Square logos with clean backgrounds look best. JPG, PNG or WEBP."
            accentColor="teal"
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
            icon={FiImage}
            badgeText="Recommended"
            formatHint="Use a wide photo of your storefront, shelves, or key products."
            accentColor="blue"
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
        </SimpleGrid>

        <Box {...fieldCardStyles} borderColor="teal.100">
          <VStack align="stretch" spacing={4}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              spacing={3}
            >
              <HStack align="flex-start" spacing={4}>
                <Circle size="46px" bg="teal.50" color="teal.600" flexShrink={0}>
                  <Icon as={FiUploadCloud} boxSize={5} />
                </Circle>
                <Box>
                  <Text fontSize="md" fontWeight="700" color="gray.900">
                    Gallery photos
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Add real storefront or product shots to make your listing feel trustworthy and complete.
                  </Text>
                </Box>
              </HStack>
              <Badge colorScheme={sellerData.gallery.length ? "green" : "teal"} borderRadius="full" px={3} py={1}>
                {sellerData.gallery.length ? `${sellerData.gallery.length} selected` : "Optional"}
              </Badge>
            </Stack>

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
              py={8}
              px={6}
              bgGradient="linear(to-br, teal.50, blue.50)"
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
              <VStack spacing={3}>
                <Circle size="50px" bg="white" color="teal.600" boxShadow="sm">
                  <Icon as={FiCamera} boxSize={5} />
                </Circle>
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="gray.800">
                    Add storefront or product photos
                  </Text>
                  <Text mt={1} fontSize="sm" color="gray.500">
                    Upload multiple JPG, PNG, or WEBP images. Real photos usually work better than posters or flyers.
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Stack
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              spacing={3}
            >
              <Button colorScheme="teal" borderRadius="full" onClick={() => galleryInputRef.current?.click()}>
                {sellerData.gallery.length ? "Add more photos" : "Choose photos"}
              </Button>
              <Text fontSize="sm" color="gray.500">
                Best results: 2-4 photos covering your storefront, shelves, team, or best-selling products.
              </Text>
            </Stack>

            {sellerData.gallery.length ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {sellerData.gallery.map((item, index) => (
                  <Box
                    key={`${item.title}-${index}`}
                    borderWidth="1px"
                    borderColor="teal.100"
                    bg="teal.50"
                    borderRadius="2xl"
                    px={4}
                    py={4}
                  >
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between" align="center">
                        <Badge colorScheme="teal" borderRadius="full" px={3} py={1}>
                          Photo {index + 1}
                        </Badge>
                        <Icon as={FiCheckCircle} color="teal.600" boxSize={5} />
                      </HStack>
                      <Box>
                        <Text fontWeight="600" color="gray.800">
                          {item.title || item.file?.name || `Photo ${index + 1}`}
                        </Text>
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {item.file?.name || "Selected image"}
                        </Text>
                      </Box>
                      <Button
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="full"
                        alignSelf="flex-start"
                        onClick={() =>
                          setSellerData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((_, currentIndex) => currentIndex !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <Box borderWidth="1px" borderColor="gray.100" borderRadius="2xl" bg="gray.50" px={4} py={4}>
                <Text fontSize="sm" color="gray.500">
                  No gallery photos added yet. Even a couple of real shop photos can make your listing feel much stronger.
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    );
  };

  const renderOtpStep = () => (
    <VStack spacing={8} align="center">
      <Text textAlign="center" color="gray.600">
        Enter the OTP sent to {userData.phone}
      </Text>
      <HStack>
        <PinInput
          otp
          type="number"
          value={otp}
          onChange={handleOtpChange}
          size="lg"
          focusBorderColor="teal.500"
          autoFocus={isOtpStep}
        >
          <PinInputField ref={otpInputRef} inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" />
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
    <MotionBox
      minH={{ base: "100vh", md: "auto" }}
      bgGradient="linear(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%)"
      py={{ base: 0, md: 2, xl: 4 }}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={
        isRouteTransitioning
          ? { opacity: 0, x: 24, scale: 0.98 }
          : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <Container maxW={{ base: "full", md: "container.lg", xl: "760px" }} px={0}>
        <Box
          {...panelStyles}
          borderRadius={{ base: "none", md: "3xl" }}
          boxShadow={{ base: "none", md: panelStyles.boxShadow }}
          borderWidth={{ base: "0px", md: panelStyles.borderWidth }}
          px={{ base: 5, md: 8, xl: 9 }}
          py={{ base: 6, md: 8, xl: 9 }}
        >
          <VStack align="stretch" spacing={8}>
            <Flex justify="space-between" align={{ base: "start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
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

            <Stack
              direction={isSellerPhotosStep ? "column" : { base: "column", sm: "row" }}
              spacing={4}
              align={isSellerPhotosStep ? "center" : { base: "flex-start", sm: "center" }}
              justify={isSellerPhotosStep ? "center" : undefined}
            >
              <Circle size="50px" bg="teal.50" color="teal.600">
                <Icon as={activeStep.icon as any} boxSize={5} />
              </Circle>
              <Box flex="1" minW={0} textAlign={isSellerPhotosStep ? "center" : "left"}>
                <Heading fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }} color="gray.900" lineHeight="1.1">
                  {activeStep.title}
                </Heading>
                <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                  {activeStep.subtitle}
                </Text>
              </Box>
            </Stack>

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
              onClick={isOtpStep ? () => void handleVerify() : handleContinue}
              isLoading={loading}
            >
              {isOtpStep ? "Verify & Continue" : "Continue"}
            </Button>

            <Text textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                color="teal.600"
                isDisabled={isRouteTransitioning}
                onClick={() => navigateWithAnimation("/login")}
              >
                Sign in
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </MotionBox>
  );
});

export default SignUpForm;
