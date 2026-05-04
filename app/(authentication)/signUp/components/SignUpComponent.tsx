"use client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  PinInput,
  PinInputField,
  Progress,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import { Autocomplete, GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  FiCamera,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiImage,
  FiNavigation,
  FiPackage,
  FiPhone,
  FiShoppingBag,
  FiShoppingCart,
  FiUser
} from "react-icons/fi";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  getOptionalGstError,
  normalizeGstNumber,
} from "../../../config/utils/gstValidation";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import { createCompanyCode } from "../../../dashboard/shop/component/utils/companyCode";
import stores from "../../../store/stores";
import GalleryBlock from "./GalleryBlock";
import UploadBlock from "./UploadBlock";
import { fieldCardStyles, inputStyles, mapOptions, sellerSteps, textareaStyles, userSteps } from "./utils/constant";

const MotionBox = motion(Box);
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const GOOGLE_MAPS_LIBRARIES: any = ["places"];
const FALLBACK_CENTER = { lat: 28.6139, lng: 77.209 };
const mapContainerStyle = { width: "100%", height: "100%" };
const phoneRegex = /^\d{10}$/;

type Intent = "user" | "seller";

const isValidEmail = (email: string) => {
  if (!email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};



// Each step gets a color theme + left-panel content
const stepMeta: Record<string, {
  bg: string;
  accent: string;
  softAccent: string;
  tagline: string;
  points: { icon: any; text: string }[];
  illustration: React.ReactNode;
}> = {
  "Let's get started": {
    bg: "#EFF6FF",
    accent: "#3B82F6",
    softAccent: "#BFDBFE",
    tagline: "Buy & sell, locally.",
    points: [
      { icon: FiShoppingCart, text: "Browse shops near you" },
      { icon: FiCheck,        text: "Fast, secure checkout" },
      { icon: FiPackage,      text: "Track your orders" },
    ],
    illustration: (
      <Image
        src="/images/register/step1.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Tell us about you": {
    bg: "#F5F3FF",
    accent: "#7C3AED",
    softAccent: "#DDD6FE",
    tagline: "Your profile, your identity.",
    points: [
      { icon: FiUser,  text: "Personalised experience" },
      { icon: FiCheck, text: "Saved addresses & orders" },
      { icon: FiPhone, text: "One number, everything" },
    ],
    illustration: (
      <Image
        src="/images/register/users.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Tell us about your shop": {
    bg: "#ECFDF5",
    accent: "#059669",
    softAccent: "#A7F3D0",
    tagline: "Build your storefront.",
    points: [
      { icon: FiShoppingBag, text: "Your shop, your brand" },
      { icon: FiCheck,       text: "GST ready invoicing" },
      { icon: FiPackage,     text: "Manage listings easily" },
    ],
    illustration: (
      <Image
        src="/images/register/about-shop.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Set your shop location": {
    bg: "#F0FDFA",
    accent: "#0D9488",
    softAccent: "#99F6E4",
    tagline: "Put your shop on the map.",
    points: [
      { icon: FiNavigation, text: "Auto-detect your location" },
      { icon: FiCheck,      text: "Buyers find you faster" },
      { icon: FiPhone,      text: "Accurate delivery zones" },
    ],
    illustration: (
       <Image
        src="/images/register/location.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Contact details": {
    bg: "#ECFEFF",
    accent: "#0891B2",
    softAccent: "#A5F3FC",
    tagline: "Stay connected with buyers.",
    points: [
      { icon: FiPhone, text: "Dedicated store number" },
      { icon: FiCheck, text: "Order notifications" },
      { icon: FiUser,  text: "Build buyer trust" },
    ],
    illustration: (
       <Image
        src="/images/register/contact.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Show your shop": {
    bg: "#FFF7ED",
    accent: "#EA580C",
    softAccent: "#FED7AA",
    tagline: "A picture sells a thousand words.",
    points: [
      { icon: FiImage,       text: "Logo & cover image" },
      { icon: FiCamera,      text: "Real shop photos" },
      { icon: FiCheckCircle, text: "Build instant trust" },
    ],
    illustration: (
        <Image
        src="/images/register/business.svg"
        alt="Get started"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Verify OTP": {
    bg: "#F0FDF4",
    accent: "#16A34A",
    softAccent: "#BBF7D0",
    tagline: "Almost there!",
    points: [
      { icon: FiCheck,       text: "One-time verification" },
      { icon: FiPhone,       text: "Sent to your mobile" },
      { icon: FiCheckCircle, text: "Secure & instant" },
    ],
    illustration: (
      <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
        <circle cx="130" cy="100" r="72" fill="#DCFCE7" />
        <circle cx="130" cy="100" r="50" fill="#BBF7D0" />
        <circle cx="130" cy="100" r="32" fill="#16A34A" />
        <path d="M114 100 L124 110 L146 88" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="60" y="178" width="140" height="12" rx="6" fill="#BBF7D0" />
        <rect x="90" y="196" width="80" height="10" rx="5" fill="#DCFCE7" />
      </svg>
    ),
  },
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
      p={{ base: 3, md: 5 }}
    >
      <VStack align="stretch" spacing={{ base: 2, md: 4 }}>
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          spacing={2}
        >
          <HStack align="center" spacing={3}>
            <Circle size={{ base: "32px", md: "46px" }} bg="white" color={`${accentColor}.600`} boxShadow="sm" flexShrink={0}>
              <Icon as={icon} boxSize={{ base: 3.5, md: 5 }} />
            </Circle>
            <Box>
              <Text fontSize={{ base: "xs", md: "md" }} fontWeight="700" color="gray.900">
                {title}
              </Text>
              <Text fontSize="xs" color="gray.500" display={{ base: "none", md: "block" }}>
                {helper}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme={hasFiles ? "green" : accentScheme} borderRadius="full" px={{ base: 2, md: 3 }} py={0.5} fontSize={{ base: "9px", md: "xs" }}>
            {hasFiles ? "Added" : badgeText}
          </Badge>
        </Stack>

        {hasFiles ? (
          <Box borderWidth="1px" borderColor={`${accentColor}.100`} borderRadius="xl" bg="white" px={3} py={1}>
            <ShowFileUploadFile files={files} removeFile={onRemove} edit={false} />
          </Box>
        ) : (
          <Box
            role="button"
            tabIndex={0}
            borderWidth="1px"
            borderStyle="dashed"
            borderColor={`${accentColor}.200`}
            borderRadius="xl"
            py={{ base: 3, md: 8 }}
            px={{ base: 3, md: 6 }}
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
            <VStack spacing={1}>
              <Icon as={icon} boxSize={{ base: 4, md: 5 }} color={`${accentColor}.600`} />
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="700" color="gray.800">
                Upload image
              </Text>
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

        <Stack direction="row" spacing={2}>
          <Button size="xs" colorScheme="blue" variant={hasFiles ? "outline" : "solid"} borderRadius="full" onClick={openPicker} flex={1} h="32px">
            {hasFiles ? "Replace" : "Choose"}
          </Button>
          {hasFiles ? (
            <Button size="xs" variant="ghost" colorScheme="red" borderRadius="full" onClick={onRemove} h="32px">
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
    libraries: GOOGLE_MAPS_LIBRARIES,
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

  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handlePreviewImage = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      onImageModalOpen();
    }
  };
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

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const steps = intent === "seller" ? sellerSteps : userSteps;
  const activeStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isOtpStep = stepIndex === steps.length - 1;
  const isSellerPhotosStep = intent === "seller" && stepIndex === 4;
  const selectedCoordinates = sellerData.location.coordinates;
  const selectedPoint = hasPickedCoordinates(selectedCoordinates)
    ? { lng: Number(selectedCoordinates[0]), lat: Number(selectedCoordinates[1]) }
    : null;

  const meta = useMemo(() => stepMeta[activeStep.title] ?? stepMeta["Let's get started"], [activeStep.title]);

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
}, [isOtpStep, stepIndex]);

  // useEffect(() => {
  //   if (stepIndex === 0) {
  //     focusPhoneInput(180);
  //     return;
  //   }

  //   if (isOtpStep) {
  //     focusOtpInput(220);
  //   }
  // }, [intent, isOtpStep, stepIndex]);

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

  // const setIntentSelection = (nextIntent: Intent) => {
  //   setIntent(nextIntent);
  //   setStepIndex(0);
  //   setToken("");
  //   setOtp("");
  //   setErrors({});
  //   setIsContactPhoneCustomized(false);
  //   focusPhoneInput();
  // };

  const setIntentSelection = (nextIntent: Intent) => {
  setIntent(nextIntent);
  setStepIndex(0);
  setToken("");
  setOtp("");
  setErrors({});
  setIsContactPhoneCustomized(false);
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

  const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        hydrateSellerLocation(lat, lng);
      } else {
        toast({
          title: "Location not found",
          description: "Please select a valid location from the dropdown.",
          status: "warning",
        });
      }
    }
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
    return buildBase64ImageUpload(file, { isAdd: 1, isDeleted: 0 });
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



const [isPhoneFocused, setIsPhoneFocused] = useState(false);

const roleOptions = [
  {
    value: "user",
    label: "Buyer",
    sub: "Browse & purchase",
    icon: FiShoppingCart,
    active: {
      bg: "blue.50",
      border: "#3B82F6",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      text: "blue.800",
      subText: "blue.500",
      dot: "#3B82F6",
    },
  },
  {
    value: "seller",
    label: "Seller",
    sub: "List & sell",
    icon: FiPackage,
    active: {
      bg: "teal.50",
      border: "#0D9488",
      iconBg: "#CCFBF1",
      iconColor: "#0F766E",
      text: "teal.800",
      subText: "teal.500",
      dot: "#0D9488",
    },
  },
];

 const renderPhoneStep = () => (
  <VStack align="stretch" spacing={{ base: 5, md: 6 }}>

    {/* ── Role Selector ── */}
    <Box>
      <Text
        fontSize="xs"
        fontWeight="700"
        color="gray.500"
        mb={3}
      >
        I want to join as
      </Text>

      <HStack spacing={{ base: 2, md: 4 }}>
        {roleOptions.map(({ value, label, sub, icon: Icon, active: a }: any) => {
          const isActive = intent === value;
          return (
            <Box
              key={value}
              as="button"
              type="button"
              flex={1}
              onClick={() => setIntentSelection(value)}
              border="2px solid"
              borderColor={isActive ? a.border : "gray.100"}
              borderRadius="xl"
              bg={isActive ? a.bg : "white"}
              p={{ base: 2.5, md: 4 }}
              cursor="pointer"
              transition="all 0.2s ease"
              boxShadow={isActive ? `0 2px 10px ${a.border}20` : "none"}
              _hover={{ borderColor: isActive ? a.border : "gray.200" }}
              textAlign="left"
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                <Flex
                  w={{ base: "32px", md: "40px" }}
                  h={{ base: "32px", md: "40px" }}
                  borderRadius="lg"
                  bg={isActive ? a.iconBg : "gray.50"}
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon
                    size={isActive ? 18 : 16}
                    color={isActive ? a.iconColor : "#9CA3AF"}
                  />
                </Flex>

                <Box flex={1}>
                  <Text
                    fontWeight="700"
                    fontSize={{ base: "xs", md: "sm" }}
                    color={isActive ? a.text : "gray.700"}
                    lineHeight="1.2"
                  >
                    {label}
                  </Text>
                  <Text
                    display={{ base: "none", md: "block" }}
                    fontSize="xs"
                    color={isActive ? a.subText : "gray.400"}
                    mt="2px"
                    fontWeight="500"
                  >
                    {sub}
                  </Text>
                </Box>
              </HStack>
            </Box>
          );
        })}
      </HStack>
    </Box>

    {/* ── Phone Input ── */}
    <FormControl isRequired>
      <FormLabel
        color="gray.600"
        fontWeight="600"
        fontSize="sm"
        mb={2}
      >
        Phone Number
      </FormLabel>

      <HStack
        spacing={0}
        border="1.5px solid"
        borderColor={isPhoneFocused ? "blue.500" : "gray.200"}
        borderRadius="xl"
        overflow="hidden"
        transition="all 0.2s ease"
        bg="white"
      >
        {/* Country code pill */}
        <Flex
          align="center"
          px={4}
          h="48px"
          bg={isPhoneFocused ? "blue.50" : "gray.50"}
          borderRight="1.5px solid"
          borderColor={isPhoneFocused ? "blue.200" : "gray.200"}
          transition="all 0.2s ease"
          flexShrink={0}
          gap={2}
        >
          <Text fontSize="md" fontWeight="500" color={isPhoneFocused ? "blue.700" : "gray.600"}>
            IN +91
          </Text>
          <Icon as={FiChevronDown} color={isPhoneFocused ? "blue.500" : "gray.400"} />
        </Flex>

        {/* Actual input */}
        <Input
          ref={phoneInputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userData.phone}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              phone: e.target.value.replace(/\D/g, "").slice(0, 10),
            }))
          }
          onFocus={() => setIsPhoneFocused(true)}
          onBlur={() => setIsPhoneFocused(false)}
          placeholder="Enter 10-digit mobile number"
          border="none"
          borderRadius={0}
          h="48px"
          fontSize="md"
          _focus={{ boxShadow: "none", border: "none" }}
          _placeholder={{ color: "gray.300", fontSize: "sm" }}
          px={4}
        />
      </HStack>

      <FieldError message={errors.phone} />
    </FormControl>
  </VStack>
);


const renderUserProfileStep = () => (
  <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
    <FormControl isRequired>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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

    <FormControl>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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
  </VStack>
);

const renderSellerBasicsStep = () => (
  <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
    <FormControl isRequired>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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

    <FormControl isRequired>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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

    <FormControl>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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

    <FormControl>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
        About Your Shop
      </FormLabel>
      <Textarea
        value={sellerData.description}
        onChange={(event) => setSellerData((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="What do you sell? What makes your store special?"
        {...textareaStyles}
      />
    </FormControl>
  </VStack>
);

  const renderSellerLocationStep = () => (
  <VStack align="stretch" spacing={6}>
    {/* Map Card */}
    <Box
      borderRadius="2xl"
      overflow="hidden"
      border="1.5px solid"
      borderColor="gray.200"
    >
      {/* Card Header */}
      <Box px={4} pt={4} pb={3} bg="gray.50">
        <Text fontSize="md" fontWeight="700" color="gray.900" lineHeight="1.3">
          Shop location
        </Text>
        <Text fontSize="sm" color="gray.500" mt={0.5}>
          Tap the map to pin your shop, or search below.
        </Text>
      </Box>

      {/* Map Container */}
      <Box
        h={{ base: "280px", md: "380px" }}
        bg="blue.50"
        position="relative"
        borderTopWidth="1px"
        borderColor="gray.200"
      >
        {!GOOGLE_MAPS_API_KEY ? (
          <CenteredBox h="100%">
            <Text fontSize="sm" color="gray.500" textAlign="center" px={6}>
              Add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the map.
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
            <Spinner size="sm" color="blue.400" />
          </CenteredBox>
        ) : (
          <>
            {/* Search Bar — floated top */}
            <Box
              position="absolute"
              top={3}
              left={3}
              right={3}
              zIndex={2}
            >
              <Box
                bg="white"
                borderRadius="xl"
                boxShadow="0 2px 8px rgba(0,0,0,0.12)"
                overflow="hidden"
              >
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <Input
                    placeholder="Search for a location…"
                    h="44px"
                    border="none"
                    fontSize="sm"
                    bg="transparent"
                    _focus={{ boxShadow: "none" }}
                    px={4}
                  />
                </Autocomplete>
              </Box>
            </Box>

            {/* Use Current Location — floated bottom-right */}
            <Box position="absolute" bottom={3} right={3} zIndex={2}>
              <IconButton
                aria-label="Use current location"
                icon={<FiNavigation />}
                onClick={() => detectCurrentLocation()}
                isLoading={detectingLocation || geocoding}
                bg="white"
                color="blue.600"
                borderRadius="xl"
                boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                h="44px"
                w="44px"
                minW="44px"
                _hover={{ bg: "blue.50" }}
                _active={{ bg: "blue.100" }}
              />
            </Box>

            {/* Pin Status Badge — floated bottom-left */}
            <Box position="absolute" bottom={3} left={3} zIndex={2}>
              <HStack
                bg="white"
                borderRadius="full"
                px={3}
                py={1.5}
                spacing={1.5}
                boxShadow="0 1px 4px rgba(0,0,0,0.12)"
              >
                <Box
                  w="7px"
                  h="7px"
                  borderRadius="full"
                  bg={selectedPoint ? "green.400" : "gray.300"}
                  flexShrink={0}
                />
                <Text fontSize="xs" fontWeight="600" color={selectedPoint ? "green.700" : "gray.500"}>
                  {selectedPoint
                    ? `${selectedPoint.lat.toFixed(4)}, ${selectedPoint.lng.toFixed(4)}`
                    : "No pin selected"}
                </Text>
              </HStack>
            </Box>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={selectedPoint ? 15 : 11}
              options={{
                ...mapOptions,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
              }}
              onClick={handleMapClick}
            >
              {selectedPoint && (
                <MarkerF position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }} />
              )}
            </GoogleMap>
          </>
        )}
      </Box>

      {/* Coordinates error */}
      {errors.coordinates && (
        <Box px={4} pb={2}>
          <FieldError message={errors.coordinates} />
        </Box>
      )}
    </Box>

    {/* Address Fields */}
    <Box>
      <Text fontSize="sm" fontWeight="700" color="gray.900" mb={4}>
        Address details
      </Text>

      <VStack spacing={4} align="stretch">
        {/* Address — full width */}
        <FormControl isRequired>
          <FormLabel
            color="gray.600"
            fontWeight="600"
            fontSize="xs"
            mb={1}
            textTransform="uppercase"
            letterSpacing="0.04em"
          >
            Address
          </FormLabel>
          <Input
            value={sellerData.location.address}
            onChange={(e) => setSellerFieldValue("location.address", e.target.value)}
            placeholder="Street address"
            size="lg"
            borderRadius="xl"
            borderColor="gray.200"
            bg="gray.50"
            h="52px"
            fontSize="sm"
            _hover={{ borderColor: "gray.300", bg: "white" }}
            _focus={{ borderColor: "blue.400", bg: "white", boxShadow: "0 0 0 3px rgba(66,153,225,0.12)" }}
            {...inputStyles}
          />
          <FieldError message={errors.address} />
        </FormControl>

        {/* City + State — side by side */}
        <SimpleGrid columns={2} spacing={3}>
          <FormControl isRequired>
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="xs"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.04em"
            >
              City
            </FormLabel>
            <Input
              value={sellerData.location.city}
              onChange={(e) => setSellerFieldValue("location.city", e.target.value)}
              placeholder="City"
              size="lg"
              borderRadius="xl"
              borderColor="gray.200"
              bg="gray.50"
              h="52px"
              fontSize="sm"
              _hover={{ borderColor: "gray.300", bg: "white" }}
              _focus={{ borderColor: "blue.400", bg: "white", boxShadow: "0 0 0 3px rgba(66,153,225,0.12)" }}
              {...inputStyles}
            />
            <FieldError message={errors.city} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="xs"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.04em"
            >
              State
            </FormLabel>
            <Input
              value={sellerData.location.state}
              onChange={(e) => setSellerFieldValue("location.state", e.target.value)}
              placeholder="State"
              size="lg"
              borderRadius="xl"
              borderColor="gray.200"
              bg="gray.50"
              h="52px"
              fontSize="sm"
              _hover={{ borderColor: "gray.300", bg: "white" }}
              _focus={{ borderColor: "blue.400", bg: "white", boxShadow: "0 0 0 3px rgba(66,153,225,0.12)" }}
              {...inputStyles}
            />
            <FieldError message={errors.state} />
          </FormControl>
        </SimpleGrid>

        {/* Postal Code + Country — side by side */}
        <SimpleGrid columns={2} spacing={3}>
          <FormControl>
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="xs"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.04em"
            >
              Postal code
            </FormLabel>
            <Input
              value={sellerData.location.postalCode}
              onChange={(e) => setSellerFieldValue("location.postalCode", e.target.value)}
              placeholder="000000"
              size="lg"
              borderRadius="xl"
              borderColor="gray.200"
              bg="gray.50"
              h="52px"
              fontSize="sm"
              _hover={{ borderColor: "gray.300", bg: "white" }}
              _focus={{ borderColor: "blue.400", bg: "white", boxShadow: "0 0 0 3px rgba(66,153,225,0.12)" }}
              {...inputStyles}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel
              color="gray.600"
              fontWeight="600"
              fontSize="xs"
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.04em"
            >
              Country
            </FormLabel>
            <Input
              value={sellerData.location.country}
              onChange={(e) => setSellerFieldValue("location.country", e.target.value)}
              placeholder="Country"
              size="lg"
              borderRadius="xl"
              borderColor="gray.200"
              bg="gray.50"
              h="52px"
              fontSize="sm"
              _hover={{ borderColor: "gray.300", bg: "white" }}
              _focus={{ borderColor: "blue.400", bg: "white", boxShadow: "0 0 0 3px rgba(66,153,225,0.12)" }}
              {...inputStyles}
            />
            <FieldError message={errors.country} />
          </FormControl>
        </SimpleGrid>
      </VStack>
    </Box>
  </VStack>
);

const renderSellerContactStep = () => (
  <VStack align="stretch" spacing={{ base: 4, md: 5 }}>
    <FormControl isRequired>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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

    <FormControl>
      <FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>
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
  </VStack>
);

  const renderSellerPhotosStep = () => {
    const completedMediaCount =
      Number(Boolean(sellerData.logo.file.length)) +
      Number(Boolean(sellerData.coverImage.file.length)) +
      Number(Boolean(sellerData.gallery.length));

    return (
      <VStack align="stretch" spacing={6}>

        {/* Header */}
        <Box>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
            Final step
          </Badge>

          <Heading mt={3} fontSize={{ base: "lg", md: "xl" }}>
            Add photos to your shop
          </Heading>

          <Text mt={1} fontSize="sm" color="gray.500">
            Shops with real images get more trust and clicks.
          </Text>

          <Text mt={2} fontSize="xs" color="gray.400">
            {completedMediaCount}/3 completed
          </Text>
        </Box>

        {/* Upload sections */}
        <VStack spacing={4} align="stretch">

          <UploadBlock
            title="Shop logo"
            description="Used across your shop and listings"
            icon={FiShoppingBag}
            files={sellerData.logo.file}
            onPreview={() => handlePreviewImage(sellerData.logo.file[0] || null)}
            onFileChange={(file) =>
              setSellerData((prev) => ({
                ...prev,
                logo: {
                  file: file ? [file] : [],
                  isAdd: file ? 1 : 0,
                  isDeleted: file ? 0 : 1,
                },
              }))
            }
            onRemove={() =>
              setSellerData((prev) => ({
                ...prev,
                logo: { file: [], isAdd: 0, isDeleted: 1 },
              }))
            }
          />

          <UploadBlock
            title="Cover image"
            description="Wide image of your shop or setup"
            icon={FiImage}
            files={sellerData.coverImage.file}
            onPreview={() => handlePreviewImage(sellerData.coverImage.file[0] || null)}
            onFileChange={(file) =>
              setSellerData((prev) => ({
                ...prev,
                coverImage: {
                  file: file ? [file] : [],
                  isAdd: file ? 1 : 0,
                  isDeleted: file ? 0 : 1,
                },
              }))
            }
            onRemove={() =>
              setSellerData((prev) => ({
                ...prev,
                coverImage: { file: [], isAdd: 0, isDeleted: 1 },
              }))
            }
          />

          <GalleryBlock
            gallery={sellerData.gallery}
            setSellerData={setSellerData}
            galleryInputRef={galleryInputRef}
            handleGalleryFilesSelected={handleGalleryFilesSelected}
            onPreview={(index) => handlePreviewImage(sellerData.gallery[index]?.file || null)}
          />
        </VStack>
      </VStack>
    );
  };

  const renderOtpStep = () => (
    <VStack spacing={{ base: 4, md: 8 }} align="center">
      <Text textAlign="center" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
        Enter the OTP sent to {userData.phone}
      </Text>
      <HStack>
        <PinInput
          otp
          type="number"
          value={otp}
          onChange={handleOtpChange}
          size="lg"
          focusBorderColor="blue.500"
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
      <Text fontSize="xs" color="gray.500" textAlign="center">
        You can go back if you want to change the phone number or signup details.
      </Text>
    </VStack>
  );

  const renderCurrentStep = () => {
    switch (activeStep.title) {
      case "Let's get started":
        return renderPhoneStep();
      case "Tell us about you":
        return renderUserProfileStep();
      case "Tell us about your shop":
        return renderSellerBasicsStep();
      case "Set your shop location":
        return renderSellerLocationStep();
      case "Contact details":
        return renderSellerContactStep();
      case "Show your shop":
        return renderSellerPhotosStep();
      case "Verify OTP":
        return renderOtpStep();
      default:
        return renderPhoneStep();
    }
  };

  return (
     <MotionBox
    w="full"
  minH="100vh"
  h={{ base: "auto", md: "100vh" }}
  overflow={{ base: "visible", md: "hidden" }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Flex minH="100vh" direction={{ base: "column", md: "row" }}>

        {/* ─── LEFT PANEL (desktop only) ─── */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w={{ md: "400px", xl: "42%" }}
          flexShrink={0}
          position="sticky"
          top={0}
          h="100vh"
          bg={meta.bg}
          transition="background 0.4s ease"
          px={{ md: 10, xl: 14 }}
          py={12}
          overflow="hidden"
          bgGradient={`linear(to-br, ${meta.bg}, ${meta.softAccent}30)`}
        >
        
          <Box
            position="absolute"
            top="-10%"
            left="-10%"
            w="350px"
            h="350px"
            bg={meta.accent}
            opacity="0.08"
            filter="blur(80px)"
            borderRadius="full"
            zIndex={0}
          />
          <Box
            position="absolute"
            bottom="-5%"
            right="-10%"
            w="400px"
            h="400px"
            bg={meta.accent}
            opacity="0.1"
            filter="blur(100px)"
            borderRadius="full"
            zIndex={0}
          />
          <Box
            position="absolute"
            top="45%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="500px"
            h="500px"
            bg="white"
            opacity="0.5"
            filter="blur(60px)"
            borderRadius="full"
            zIndex={0}
          />

        
          <HStack spacing={2} mb="auto" zIndex={1}>
            <Box
              w="32px" h="32px" borderRadius="8px"
              bg={meta.accent} display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${meta.accent}40`}
            >
              <Icon as={FiShoppingBag} color="white" boxSize={4} />
            </Box>
            <Text fontWeight="800" fontSize="lg" color="gray.800" letterSpacing="-0.02em">
              YourApp
            </Text>
          </HStack>

    
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" gap={10} zIndex={1} w="full">
            <Box
              w="100%" maxW={{ md: "300px", xl: "360px" }} mx="auto"
              transition="all 0.4s ease"
            >
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeStep.title}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {meta.illustration}
                </MotionBox>
              </AnimatePresence>
            </Box>

            <AnimatePresence mode="wait">
              <MotionBox
                key={`text-${activeStep.title}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <Text
                  fontSize={{ md: "2xl", xl: "3xl" }} fontWeight="800" color="gray.900"
                  letterSpacing="-0.03em" lineHeight="1.2" mb={5}
                >
                  {meta.tagline}
                </Text>
                <VStack align="stretch" spacing={3.5}>
                  {meta.points.map((point, i) => (
                    <HStack key={i} spacing={4} align="center">
                      <Flex
                        w="32px" h="32px" borderRadius="10px" flexShrink={0}
                        bg="white"
                        boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                        align="center" justify="center"
                      >
                        <Icon as={point.icon} boxSize={4} color={meta.accent} />
                      </Flex>
                      <Text fontSize="md" fontWeight="600" color="gray.700">
                        {point.text}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </MotionBox>
            </AnimatePresence>
          </Box>

      
          <VStack align="stretch" spacing={3} mt="auto" pt={8} zIndex={1}>
            <HStack justify="space-between" align="center">
              <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.05em">
                Step {stepIndex + 1} of {steps.length}
              </Text>
              <Text fontSize="xs" fontWeight="600" color={meta.accent}>
                {Math.round(progress)}% Completed
              </Text>
            </HStack>
            <HStack spacing={1.5} w="full">
              {steps.map((_, i) => (
                <Box
                  key={i}
                  h="4px"
                  flex={i === stepIndex ? 2 : 1}
                  borderRadius="full"
                  bg={i === stepIndex ? meta.accent : (i < stepIndex ? `${meta.accent}80` : "whiteAlpha.600")}
                  transition="all 0.3s ease"
                  boxShadow={i < stepIndex ? "inset 0 1px 2px rgba(0,0,0,0.1)" : "none"}
                />
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* ─── RIGHT PANEL (form) ─── */}
        <Box
          flex={1}
          h={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          bg="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          position="relative"
          sx={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {/* ─── Mobile Header ─── */}
          <Box
            display={{ base: "block", md: "none" }}
            w="full"
            bg="white"
            position="sticky"
            top={0}
            zIndex={20}
            pt="calc(env(safe-area-inset-top, 0px) + 8px)"
            px={5}
            pb={2}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Box>
                {stepIndex > 0 && (
                  <IconButton
                    aria-label="Go back"
                    icon={<ArrowBackIcon />}
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    onClick={handleBack}
                    bg="gray.50"
                  />
                )}
              </Box>
              <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.05em" ml="auto">
                Step {stepIndex + 1} of {steps.length}
              </Text>
            </Flex>
            <Progress
              value={progress}
              size="xs"
              borderRadius="full"
              colorScheme={intent === "seller" ? "teal" : "blue"}
              bg="gray.100"
            />
          </Box>

          <Box
            w="full"
            maxW={{ base: "full", md: "520px", xl: "650px" }}
            display="flex"
            flexDirection="column"
            pt={{ base: 4, md: 10 }}
            pb={{ base: "140px", md: 12 }}
            px={{ base: 5, md: 8 }}
            my={{ md: "auto" }}
          >
            <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
              
              {/* Desktop Header / Mobile Title */}
              <HStack align="flex-start" spacing={3}>
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="md"
                  borderRadius="full"
                  onClick={handleBack}
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                  mt={1.5}
                  flexShrink={0}
                  display={{ base: "none", md: stepIndex > 0 ? "flex" : "none" }}
                />
                <Box>
                  <Heading fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }} color="gray.900" fontWeight="800" letterSpacing="-0.02em" mb={2}>
                    {activeStep.title}
                  </Heading>
                  <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                    {activeStep.subtitle}
                  </Text>
                </Box>
              </HStack>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <MotionBox
                  key={`${intent}-${stepIndex}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {renderCurrentStep()}
                </MotionBox>
              </AnimatePresence>

              {/* Desktop CTA & Footer */}
              <VStack spacing={5} mt={4} display={{ base: "none", md: "flex" }}>
                <Button
                  w="full"
                  h="56px"
                  bg={meta.accent}
                  color="white"
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{ bg: meta.accent, opacity: 0.9, transform: "translateY(-1px)", boxShadow: "lg" }}
                  _active={{ bg: meta.accent, transform: "translateY(0)" }}
                  transition="all 0.3s ease"
                  onClick={isOtpStep ? () => void handleVerify() : handleContinue}
                  isLoading={loading}
                >
                  {isOtpStep ? "Verify & Continue" : "Continue"}
                  {!isOtpStep && <Icon as={FiChevronRight} ml={2} />}
                </Button>

                <Text textAlign="center" color="gray.500" fontSize="sm" fontWeight="500">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    color={meta.accent}
                    fontWeight="700"
                    fontSize="sm"
                    isDisabled={isRouteTransitioning}
                    onClick={() => navigateWithAnimation("/login")}
                  >
                    Sign in
                  </Button>
                </Text>
              </VStack>

            </VStack>
          </Box>

          {/* ─── Mobile Sticky Footer ─── */}
          <Box
            display={{ base: "block", md: "none" }}
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            px={5}
            pt={3}
            pb="calc(env(safe-area-inset-bottom, 0px) + 12px)"
            zIndex={30}
          >
            <VStack spacing={2}>
              <Button
                w="full"
                h="46px"
                bg={meta.accent}
                color="white"
                fontSize="sm"
                fontWeight="700"
                borderRadius="lg"
                onClick={isOtpStep ? () => void handleVerify() : handleContinue}
                isLoading={loading}
                _hover={{ bg: meta.accent, opacity: 0.9 }}
                _active={{ bg: meta.accent, transform: "scale(0.98)" }}
                transition="all 0.3s ease"
              >
                {isOtpStep ? "Verify & Continue" : "Continue"}
                {!isOtpStep && <Icon as={FiChevronRight} ml={2} />}
              </Button>
              <Text textAlign="center" color="gray.500" fontSize="xs" fontWeight="600">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  color={meta.accent}
                  fontWeight="700"
                  fontSize="xs"
                  onClick={() => navigateWithAnimation("/login")}
                >
                  Sign in
                </Button>
              </Text>
            </VStack>
          </Box>
        </Box>

        {/* Image Preview Modal */}
        <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} isCentered size="xl">
          <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(8px)" />
          <ModalContent bg="transparent" boxShadow="none" mx={4}>
            <ModalCloseButton color="white" zIndex={10} bg="blackAlpha.500" borderRadius="full" />
            <ModalBody p={0}>
              <Flex justify="center" align="center">
                {previewImageUrl && (
                  <Image
                    src={previewImageUrl}
                    alt="Preview"
                    maxH="80vh"
                    objectFit="contain"
                    borderRadius="2xl"
                    boxShadow="2xl"
                  />
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

      </Flex>
    </MotionBox>
    
    //   minH="100vh"
    //   bgGradient={{ base: "none", md: "linear(to-b, #f8fafc 0%, #ffffff 45%, #eff6ff 100%)" }}
    //   bg={{ base: "white", md: "transparent" }}
    //   pt={{ base: "calc(env(safe-area-inset-top, 0px) + 4px)", md: 6 }}
    //   pb={{ base: "calc(env(safe-area-inset-bottom, 0px) + 8px)", md: 6 }}
    //   display="flex"
    //   alignItems={{ base: "flex-start", md: "center" }}
    //   initial={{ opacity: 0, y: 24, scale: 0.98 }}
    //   animate={{ opacity: 1, y: 0, scale: 1 }}
    //   transition={{ duration: 0.4, ease: "easeOut" }}
    // >
    //   <Container
    //     maxW={{ base: "full", md: "container.lg", xl: "760px" }}
    //     px={{ base: 0, md: 6 }}
    //     display="flex"
    //     alignItems={{ base: "flex-start", md: "center" }}
    //     justifyContent="center"
    //     minH={{ base: "100vh", md: "calc(100vh - 48px)" }}
    //     pt={{ base: "0px", md: 0 }}
    //   >
    //     <Box
    //       {...panelStyles}
    //       boxShadow={panelStyles.boxShadow}
    //       borderWidth={panelStyles.borderWidth}
    //       px={{ base: 3, md: 8, xl: 9 }}
    //       py={{ base: 3, md: 8, xl: 9 }}
    //       w="full"
    //     >
    //       <VStack align="stretch" spacing={{ base: 4, md: 8 }}>
    //         <Flex justify="space-between" align="center" gap={2} mb={{ base: -2, md: 0 }} display={{ base: "none", md: "flex" }}>
    //           <IconButton
    //             aria-label="Go back"
    //             icon={<ArrowBackIcon />}
    //             variant="ghost"
    //             size="sm"
    //             borderRadius="full"
    //             onClick={handleBack}
    //             isDisabled={stepIndex === 0}
    //             display={stepIndex === 0 ? "none" : "flex"}
    //           />
    //           <Box>
    //             <Badge
    //               bg="blue.50"
    //               color="blue.600"
    //               borderRadius="md"
    //               px={3}
    //               py={1}
    //               fontSize="xs"
    //               fontWeight="700"
    //             >
    //               Step {stepIndex + 1}/{steps.length}
    //             </Badge>
    //           </Box>
    //         </Flex>

    //         <Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="blue" h="6px" display={{ base: "none", md: "block" }} />

    //         <Stack
    //           direction={isSellerPhotosStep ? { base: "row", md: "column" } : "row"}
    //           spacing={{ base: 2, md: 4 }}
    //           align="center"
    //           justify={isSellerPhotosStep ? { base: "flex-start", md: "center" } : undefined}
    //         >
    //           <IconButton
    //             aria-label="Go back"
    //             icon={<ArrowBackIcon />}
    //             variant="ghost"
    //             size="sm"
    //             borderRadius="full"
    //             onClick={handleBack}
    //             isDisabled={stepIndex === 0}
    //             display={{ base: stepIndex === 0 ? "none" : "flex", md: "none" }}
    //             mr={1}
    //           />
    //           <Circle size={{ base: "0px", md: "50px" }} bg="blue.50" color="blue.600" display={{ base: "none", md: "flex" }}>
    //             <Icon as={activeStep.icon as any} boxSize={5} />
    //           </Circle>
    //           <Box flex="1" minW={0} textAlign={isSellerPhotosStep ? { base: "left", md: "center" } : "left"}>
    //             <Heading fontSize={{ base: "lg", sm: "xl", md: "3xl" }} color="gray.900" lineHeight="1.2">
    //               {activeStep.title}
    //             </Heading>
    //             <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={1}>
    //               {activeStep.subtitle}
    //             </Text>
    //           </Box>
    //         </Stack>

    //         <AnimatePresence mode="wait">
    //           <MotionBox
    //             key={`${intent}-${stepIndex}`}
    //             initial={{ opacity: 0, y: 20 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             exit={{ opacity: 0, y: -20 }}
    //             transition={{ duration: 0.24 }}
    //           >
    //             {renderCurrentStep()}
    //           </MotionBox>
    //         </AnimatePresence>

    //         <Button
    //           w="full"
    //           {...primaryButtonStyles}
    //           onClick={isOtpStep ? () => void handleVerify() : handleContinue}
    //           isLoading={loading}
    //         >
    //           {isOtpStep ? "Verify & Continue" : "Continue"}
    //         </Button>

    //         <Text textAlign="center" color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={{ base: -2, md: 0 }}>
    //           Already have an account?{" "}
    //           <Button
    //             type="button"
    //             variant="link"
    //             color="blue.600"
    //             fontSize={{ base: "xs", md: "sm" }}
    //             isDisabled={isRouteTransitioning}
    //             onClick={() => navigateWithAnimation("/login")}
    //           >
    //             Sign in
    //           </Button>
    //         </Text>
    //       </VStack>
    //     </Box>
    //   </Container>
    // </MotionBox>
  );
});
export default SignUpForm;