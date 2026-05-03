// import { CheckIcon } from "@chakra-ui/react/dist/types/alert/alert-icons";
import { CheckIcon } from "@chakra-ui/icons";
import { FiCamera, FiMail, FiMapPin, FiPhone, FiShoppingBag, FiUser } from "react-icons/fi";

export const userSteps = [
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

export const sellerSteps = [
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

export const panelStyles = {
  bg: { base: "white", md: "white" },
  borderWidth: { base: "0px", md: "1px" },
  borderColor: { base: "transparent", md: "gray.200" },
  borderRadius: { base: "0", md: "3xl" },
  boxShadow: { base: "none", md: "0 28px 90px rgba(15, 23, 42, 0.08)" },
};

export const primaryButtonStyles = {
  bgGradient: "linear(to-r, blue.500, blue.600)",
  color: "white",
  h: { base: "44px", md: "48px" },
  borderRadius: "lg",
  fontWeight: "600",
  fontSize: { base: "sm", md: "md" },
  _hover: { bgGradient: "linear(to-r, blue.600, blue.700)", transform: "translateY(-1px)", boxShadow: "md" },
  _active: { transform: "scale(0.98)" },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const inputStyles = {
  h: { base: "42px", md: "48px" },
  borderRadius: "lg",
  borderColor: "gray.200",
  bg: "gray.50",
  _focusVisible: { borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)", bg: "white" },
  _hover: { borderColor: "gray.300" },
  fontSize: { base: "sm", md: "md" },
  px: 3,
};

export const fieldCardStyles = {
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "lg",
  bg: "white",
  boxShadow: "sm",
  p: { base: 3, md: 5 },
};

export const textareaStyles = {
  minH: { base: "80px", md: "120px" },
  borderRadius: "lg",
  borderColor: "gray.200",
  bg: "gray.50",
  _focusVisible: { borderColor: "blue.500", boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)", bg: "white" },
  _hover: { borderColor: "gray.300" },
  fontSize: { base: "sm", md: "md" },
  p: 3,
};

export const mapOptions: google.maps.MapOptions = {
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