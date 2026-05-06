"use client";

import { CheckIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaImages,
  FaMap,
  FaMapMarkerAlt,
  FaPhone,
  FaStore,
} from "react-icons/fa";
import SpinnerLoader from "../../../component/common/Loader/SpinnerLoader";
import { getStatusType } from "../../../component/config/utils/function";
import { normalizeGstNumber } from "../../../config/utils/gstValidation";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import stores from "../../../store/stores";
import AdditionalLocationsSection from "./AdditionalLocationsSection";
import ContactInfoSection from "./ContactInfoSection";
import GallerySection from "./GallerySection";
import MainLocationSection from "./MainLocationSection";
import {
  type MerchantSectionTint,
  useMerchantFormSx,
  useMerchantTone,
} from "./merchantTheme";
import OperatingHoursSection from "./OperatingHoursSection";
import ShopDetailsSection from "./ShopDetailsSection";
import { createCompanyCode } from "./utils/companyCode";
import { createEmptyShopFormData } from "./utils/constant";
import { validationSchema } from "./utils/validation";

type ShopSection = {
  id: string;
  label: string;
  headline: string;
  description: string;
  icon: any;
  component: any;
  tint: MerchantSectionTint;
};

const sections: ShopSection[] = [
  {
    id: "shop",
    label: "Shop",
    headline: "Set up your shop",
    description: "Tell buyers what your business is called and what you sell.",
    icon: FaStore,
    component: ShopDetailsSection,
    tint: "blue",
  },
  {
    id: "location",
    label: "Location",
    headline: "Main Location",
    description: "Drop a pin so nearby buyers can discover and reach your store.",
    icon: FaMapMarkerAlt,
    component: MainLocationSection,
    tint: "green",
  },
  {
    id: "branches",
    label: "Branches",
    headline: "Additional Branches",
    description: "Add other outlets or pickup points when your shop operates in more than one place.",
    icon: FaMap,
    component: AdditionalLocationsSection,
    tint: "violet",
  },
  {
    id: "contact",
    label: "Contact",
    headline: "Contact",
    description: "Share the best ways for buyers to reach you and discover you online.",
    icon: FaPhone,
    component: ContactInfoSection,
    tint: "cyan",
  },
  {
    id: "hours",
    label: "Hours",
    headline: "Operating Hours",
    description: "Set when you are open and mark any closed days.",
    icon: FaClock,
    component: OperatingHoursSection,
    tint: "amber",
  },
  {
    id: "gallery",
    label: "Gallery",
    headline: "Shop Gallery",
    description: "Upload a few visuals so buyers can quickly recognize your shop.",
    icon: FaImages,
    component: GallerySection,
    tint: "rose",
  },
];

const isFiniteCoordinate = (value: any) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue);
};

const isCoordinatePairString = (value: any) => {
  if (typeof value !== "string") return false;
  const parts = value.split(",").map((item) => Number(item.trim()));
  return parts.length === 2 && parts.every(Number.isFinite);
};

const normalizeCoordinates = (source: any, fallback: any = [0, 0]) => {
  const sourceCoordinates = Array.isArray(source?.coordinates)
    ? source.coordinates
    : Array.isArray(source)
      ? source
      : null;

  if (
    sourceCoordinates?.length >= 2 &&
    isFiniteCoordinate(sourceCoordinates[0]) &&
    isFiniteCoordinate(sourceCoordinates[1])
  ) {
    return [Number(sourceCoordinates[0]), Number(sourceCoordinates[1])];
  }

  if (isCoordinatePairString(source)) {
    const [lat, lng] = source.split(",").map((item) => Number(item.trim()));
    return [lng, lat];
  }

  if (
    Array.isArray(fallback) &&
    fallback.length >= 2 &&
    isFiniteCoordinate(fallback[0]) &&
    isFiniteCoordinate(fallback[1])
  ) {
    return [Number(fallback[0]), Number(fallback[1])];
  }

  return [0, 0];
};

const normalizeLocationForForm = (source: any, fallback: any) => {
  const sourceLocation =
    source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const fallbackLocation = fallback || {};

  return {
    ...fallbackLocation,
    ...sourceLocation,
    address:
      sourceLocation.address ||
      (!isCoordinatePairString(source) && typeof source === "string" ? source : "") ||
      fallbackLocation.address ||
      "",
    city: sourceLocation.city || fallbackLocation.city || "",
    state: sourceLocation.state || fallbackLocation.state || "",
    postalCode: sourceLocation.postalCode || fallbackLocation.postalCode || "",
    country: sourceLocation.country || fallbackLocation.country || "",
    coordinates: normalizeCoordinates(source, fallbackLocation.coordinates),
  };
};

const normalizeMultipleLocationsForForm = (source: any, fallback: any) => {
  const locations = Array.isArray(source) ? source : fallback;
  if (!Array.isArray(locations)) return [];

  return locations
    .map((location, index) =>
      normalizeLocationForForm(location, fallback?.[index] || fallback?.[0] || {})
    )
    .filter((location) => {
      const hasText = [location.address, location.city, location.state, location.postalCode, location.country]
        .some((value) => typeof value === "string" && value.trim().length > 0);
      const hasCoordinates =
        Array.isArray(location.coordinates) &&
        location.coordinates.length >= 2 &&
        (Number(location.coordinates[0]) !== 0 || Number(location.coordinates[1]) !== 0);

      return hasText || hasCoordinates;
    });
};

const normalizeStringArray = (source: any) => {
  if (Array.isArray(source)) {
    return source
      .map((item) => (typeof item === "string" ? item.trim() : String(item || "").trim()))
      .filter(Boolean);
  }

  if (typeof source === "string") {
    return source
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeShopDataForForm = (shopData: any) => {
  const defaults = createEmptyShopFormData();
  const description =
    typeof shopData?.description === "string" ? shopData.description : defaults.description;
  const rawAbout =
    typeof shopData?.about === "string" ? shopData.about : defaults.about;
  const about =
    rawAbout.trim() && rawAbout.trim() === description.trim() ? defaults.about : rawAbout;

  return {
    ...defaults,
    ...shopData,
    tags: normalizeStringArray(shopData?.tags),
    categories: normalizeStringArray(shopData?.categories),
    paymentMethods: normalizeStringArray(shopData?.paymentMethods),
    description,
    about,
    gstNumber: shopData?.gstNumber || defaults.gstNumber,
    returnPolicy: shopData?.returnPolicy || defaults.returnPolicy,
    location: normalizeLocationForForm(shopData?.location, defaults.location),
    multipleLocations: normalizeMultipleLocationsForForm(
      shopData?.multipleLocations,
      defaults.multipleLocations
    ),
    contactInfo: {
      ...defaults.contactInfo,
      ...(shopData?.contactInfo || {}),
      socialMedia: {
        ...defaults.contactInfo.socialMedia,
        ...(shopData?.contactInfo?.socialMedia || {}),
      },
    },
    bankDetails: {
      ...defaults.bankDetails,
      ...(shopData?.bankDetails || {}),
    },
  };
};

const sectionErrorMatchers = [
  {
    index: 0,
    matches: (errors: any) =>
      Boolean(
        errors?.name ||
        errors?.companyCode ||
        errors?.tags ||
        errors?.categories ||
        errors?.description ||
        errors?.about ||
        errors?.gstNumber ||
        errors?.bankDetails ||
        errors?.returnPolicy ||
        errors?.paymentMethods
      ),
  },
  {
    index: 1,
    matches: (errors: any) => Boolean(errors?.location),
  },
  {
    index: 2,
    matches: (errors: any) => Boolean(errors?.multipleLocations),
  },
  {
    index: 3,
    matches: (errors: any) => Boolean(errors?.contactInfo),
  },
  {
    index: 4,
    matches: (errors: any) => Boolean(errors?.operatingHours || errors?.closedDates),
  },
  {
    index: 5,
    matches: (errors: any) => Boolean(errors?.gallery),
  },
];

const resolveFirstErrorSection = (errors: any) => {
  const match = sectionErrorMatchers.find((section) => section.matches(errors));
  return match?.index ?? null;
};

const fieldLabelMap: Record<string, string> = {
  address: "Address",
  city: "City",
  state: "State",
  postalCode: "Postal Code",
  country: "Country",
  coordinates: "Map Pin / Coordinates",
  "coordinates.0": "Longitude",
  "coordinates.1": "Latitude",
  name: "Shop Name",
  companyCode: "Company Code",
  tags: "Tags",
  categories: "Categories",
  description: "Description",
  about: "About",
  gstNumber: "GST Number",
  "bankDetails.accountHolderName": "Account Holder Name",
  "bankDetails.accountNumber": "Account Number",
  "bankDetails.bankName": "Bank Name",
  "bankDetails.ifscCode": "IFSC Code",
  returnPolicy: "Return Policy",
  paymentMethods: "Payment Methods",
  "location.address": "Address",
  "location.city": "City",
  "location.state": "State",
  "location.postalCode": "Postal Code",
  "location.country": "Country",
  "location.coordinates": "Map Pin / Coordinates",
  "location.coordinates.0": "Longitude",
  "location.coordinates.1": "Latitude",
  gallery: "Gallery",
  "contactInfo.phone": "Phone",
  "contactInfo.email": "Email",
  "contactInfo.website": "Website",
  "contactInfo.socialMedia.facebook": "Facebook",
  "contactInfo.socialMedia.instagram": "Instagram",
  "contactInfo.socialMedia.twitter": "Twitter",
  "contactInfo.socialMedia.linkedin": "LinkedIn",
  "contactInfo.socialMedia.youtube": "YouTube",
  operatingHours: "Operating Hours",
  closedDates: "Closed Dates",
};

const flattenErrorPaths = (errors: any, parentPath = ""): string[] => {
  if (!errors) return [];

  if (typeof errors === "string") {
    return parentPath ? [parentPath] : [];
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((item, index) =>
      flattenErrorPaths(item, parentPath ? `${parentPath}.${index}` : `${index}`)
    );
  }

  if (typeof errors === "object") {
    return Object.entries(errors).flatMap(([key, value]) =>
      flattenErrorPaths(value, parentPath ? `${parentPath}.${key}` : key)
    );
  }

  return [];
};

const normalizeErrorPath = (path: string) => path.replace(/\.\d+/g, "");

const getFriendlyFieldLabel = (path: string) => {
  const normalized = normalizeErrorPath(path);
  if (fieldLabelMap[normalized]) {
    return fieldLabelMap[normalized];
  }

  if (normalized.startsWith("multipleLocations")) {
    const locationMatch = path.match(/multipleLocations\.(\d+)\.(.+)/);
    if (locationMatch) {
      const locationNumber = Number(locationMatch[1]) + 1;
      const fieldPath = `multipleLocations.${locationMatch[2].replace(/\.\d+/g, "")}`;
      const fieldName =
        fieldLabelMap[fieldPath] ||
        fieldLabelMap[locationMatch[2].replace(/\.\d+/g, "")] ||
        "Location Field";
      return `Location ${locationNumber}: ${fieldName}`;
    }

    return "Additional Location";
  }

  return normalized
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getSectionFieldLabels = (errors: any, sectionIndex: number) => {
  const paths = flattenErrorPaths(errors);
  const labels = paths
    .map((path) => ({
      path,
      label: getFriendlyFieldLabel(path),
    }))
    .filter(({ path }) => {
      switch (sectionIndex) {
        case 0:
          return !path.startsWith("location") &&
            !path.startsWith("multipleLocations") &&
            !path.startsWith("contactInfo") &&
            !path.startsWith("operatingHours") &&
            !path.startsWith("closedDates") &&
            !path.startsWith("gallery");
        case 1:
          return path.startsWith("location");
        case 2:
          return path.startsWith("multipleLocations");
        case 3:
          return path.startsWith("contactInfo");
        case 4:
          return path.startsWith("operatingHours") || path.startsWith("closedDates");
        case 5:
          return path.startsWith("gallery");
        default:
          return false;
      }
    })
    .map(({ label }) => label);

  return Array.from(new Set(labels));
};

const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const ShopFormHero = ({
  activeSection,
  activeSectionIndex,
  onSelect,
}: {
  activeSection: ShopSection;
  activeSectionIndex: number;
  onSelect: (index: number) => void;
}) => {
  const tone = useMerchantTone(activeSection.tint);
  const bg = useColorModeValue("white", dashboardPalette.shell);
  const borderColor = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const titleColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const mutedText = useColorModeValue("#64748B", dashboardPalette.textSoft);
  const stepText = useColorModeValue("#475569", dashboardPalette.textMuted);
  // const inactiveTrack = useColorModeValue("#E2E8F0", "rgba(138,170,200,0.20)");
  const total = sections.length;

  return (
    <Box
      as="header"
      bg={bg}
      rounded={'xl'}
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow={{ base: "none", md: "0 6px 20px rgba(15, 23, 42, 0.04)" }}
    >
      <Box px={{ base: 4, md: 4 }} py={{ base: 3, md: 4 }}>
        <Flex align="center" justify="space-between" gap={3}>
          <HStack spacing={2} fontSize="xs" fontWeight="600" color={stepText}>
            <Icon as={activeSection.icon} boxSize={3.5} color={tone.text} />
            <Text>Shop setup</Text>
          </HStack>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg={tone.soft}
            color={tone.text}
            border="1px solid"
            borderColor={tone.border}
            fontSize="11px"
            fontWeight="700"
            textTransform="none"
          >
            Step {activeSectionIndex + 1} of {total}
          </Badge>
        </Flex>

        <Flex
          mt={3}
          align={{ base: "start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={2}
        >
          <Box>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="700" color={titleColor} letterSpacing="-0.02em">
              {activeSection.headline}
            </Text>
            <Text display={{ base: "none", md: "block" }} mt={0.5} fontSize="sm" color={mutedText}>
              {activeSection.description}
            </Text>
          </Box>
          <Text fontSize="xs" fontWeight="600" color={mutedText}>
            {activeSectionIndex + 1}/{total}
          </Text>
        </Flex>

        {/* <HStack mt={3} spacing={1.5}>
          {sections.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const isCompleted = index < activeSectionIndex;

            return (
              <Button
                key={section.id}
                variant="unstyled"
                flex={1}
                h="6px"
                minW={0}
                borderRadius="full"
                bg={isActive || isCompleted ? tone.text : inactiveTrack}
                opacity={isCompleted ? 0.9 : 1}
                transition="all 0.2s ease"
                onClick={() => onSelect(index)}
                aria-label={`Go to step ${index + 1}: ${section.label}`}
              />
            );
          })}
        </HStack> */}

        <Flex mt={3} align="center" gap={{ base: 1.5, md: 2 }} display={{base:"none",md:"flex"}}>
          {sections.map((section, index) => {
            const isActive = index === activeSectionIndex;
            const isCompleted = index < activeSectionIndex;

            return (
              <Button
                key={section.id}
                variant="unstyled"
                minW={0}
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent={{ base: "center", md: "flex-start" }}
                gap={2}
                px={{ base: 0, md: 2 }}
                py={1}
                color={isActive ? titleColor : stepText}
                onClick={() => onSelect(index)}
              >
                <Flex
                  align="center"
                  justify="center"
                  h={{ base: "28px", md: "30px" }}
                  w={{ base: "28px", md: "30px" }}
                  borderRadius="full"
                  bg={isActive ? tone.soft : isCompleted ? tone.soft : "transparent"}
                  border="1px solid"
                  borderColor={isActive || isCompleted ? tone.border : borderColor}
                  color={isCompleted || isActive ? tone.text : mutedText}
                  transition="all 0.2s ease"
                  flexShrink={0}
                >
                  {isCompleted ? (
                    <CheckIcon boxSize={3} />
                  ) : (
                    <Icon as={section.icon} boxSize={3} />
                  )}
                </Flex>
                <Text display={{ base: "none", lg: "block" }} fontSize="xs" fontWeight="600" noOfLines={1}>
                  {section.label}
                </Text>
              </Button>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

const StickyActionBar = ({
  activeSection,
  activeSectionIndex,
  isLastStep,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
  isUpdateMode,
}: {
  activeSection: ShopSection;
  activeSectionIndex: number;
  isLastStep: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isUpdateMode: boolean;
}) => {
  const tone = useMerchantTone(activeSection.tint);
  const borderColor = useColorModeValue("rgba(226, 232, 240, 0.92)", dashboardPalette.border);
  const backBg = useColorModeValue("#FFFFFF", "rgba(23,37,64,0.92)");
  const backColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const stepInfoColor = useColorModeValue("#64748B", dashboardPalette.textSoft);

  return (
    <Box
      insetX={0}
      bottom={0}
      borderTop="1px solid"
      borderColor={borderColor}
    >
      <Box px={{ base: 4, md: 0 }}>
        <Flex
          align="center"
          justify="space-between"
          gap={{ base: 2, md: 3 }}
          py={{ base: 2.5, md: 3 }}
          // pb={{"calc(env(safe-area-inset-bottom) + 0.65rem)"}}
          wrap="nowrap"
        >
          <Button
            variant="outline"
            borderRadius="16px"
            minH={{ base: "42px", md: "44px" }}
            minW={{ base: "86px", sm: "96px" }}
            px={{ base: 3.5, md: 4 }}
            bg={backBg}
            borderColor="var(--dashboard-border-strong)"
            color={backColor}
            leftIcon={<FaChevronLeft size={13} />}
            onClick={onBack}
            isDisabled={activeSectionIndex === 0 || isSubmitting}
            _hover={{ bg: "var(--dashboard-surface-alt)", color: "var(--dashboard-text)" }}
            _disabled={{
              opacity: 0.5,
              color: stepInfoColor,
              borderColor: "var(--dashboard-border)",
            }}
          >
            Back
          </Button>

          <Text
            flex="0 1 auto"
            textAlign="center"
            fontSize="11px"
            fontWeight="600"
            color={stepInfoColor}
            display={{ base: "none", md: "block" }}
            px={2}
          >
            Step {activeSectionIndex + 1} / {sections.length} · {activeSection.label}
          </Text>

          {isLastStep ? (
            <Button
              minH={{ base: "42px", md: "44px" }}
              px={{ base: 4, sm: 6 }}
              minW={{ base: "112px", sm: "132px" }}
              borderRadius="16px"
              bg={tone.gradient}
              color="white"
              flexShrink={0}
              onClick={onSubmit}
              isLoading={isSubmitting}
              _hover={{ bg: tone.gradient, filter: "brightness(0.98)" }}
              _active={{ transform: "scale(0.98)" }}
            >
              {isUpdateMode ? "Save shop" : "Publish shop"}
            </Button>
          ) : (
            <Button
              minH={{ base: "36px", md: "44px" }}
              px={{ base: 4, sm: 6 }}
              minW={{ base: "112px", sm: "132px" }}
              borderRadius="16px"
              bg={tone.gradient}
              color="white"
              flexShrink={0}
              rightIcon={<FaChevronRight size={13} />}
              onClick={onNext}
              isDisabled={isSubmitting}
              _hover={{ bg: tone.gradient, filter: "brightness(0.98)" }}
              _active={{ transform: "scale(0.98)" }}
            >
              Next
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

const ShopForm = observer(() => {
  const cSurfaceAlt = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const cBorder = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const cText = useColorModeValue("#0F172A", dashboardPalette.text);
  const cTextMuted = useColorModeValue("#475569", dashboardPalette.textMuted);
  const cPage = useColorModeValue("white", dashboardPalette.page);
  const cDanger = useColorModeValue("#EF4444", dashboardPalette.danger);
  const cAccentStrong = useColorModeValue("#1D4ED8", dashboardPalette.accentStrong);
  const merchantFormSx = useMerchantFormSx();

  const [initialValues, setInitialValues] = useState(() => createEmptyShopFormData());
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [reviewMeta, setReviewMeta] = useState({
    reviewStatus: null as string | null,
    reviewRemarks: "",
  });

  const {
    companyStore: { updateCompanyDetails, createCompany },
    auth: { openNotification, user },
    shopStore: { getSingleShop, getSingleShopById },
  } = stores;

  const { shopTitle } = useParams();

  useEffect(() => {
    if (user?.company && typeof user.company === "object") {
      setReviewMeta({
        reviewStatus: user.company.reviewStatus || null,
        reviewRemarks: user.company.reviewRemarks || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchShopData = async () => {
      const emptyData = createEmptyShopFormData();
      const baseInitialValues = {
        ...emptyData,
        companyCode: createCompanyCode("", user?.phone || ""),
        contactInfo: {
          ...emptyData.contactInfo,
          phone: user?.phone || "",
          email: user?.email || "",
        },
      };

      if (!user?.company) {
        setIsUpdateMode(false);
        setInitialValues(baseInitialValues);
        setLoading(false);
        return;
      }

      try {
        const companyId = user?.company?._id || (typeof user?.company === "string" ? user.company : "");
        const data = companyId
          ? await getSingleShopById(companyId)
          : await getSingleShop({
              title: user?.company?.name,
              status: user?.company?.shopStatus,
            });

        if (!data?.data) {
          setIsUpdateMode(false);
          setInitialValues(baseInitialValues);
        } else {
          setIsUpdateMode(true);
          const shopData = normalizeShopDataForForm(data.data);
          setReviewMeta({
            reviewStatus: data.data?.reviewStatus || null,
            reviewRemarks: data.data?.reviewRemarks || "",
          });
          const coverImage = shopData.coverImage?.url ? { file: [shopData.coverImage] } : { file: [] };
          const logo = shopData.logo?.url ? { file: [shopData.logo] } : { file: [] };
          const gallery = Array.isArray(shopData.gallery)
            ? shopData.gallery.map((item) => ({
                file: item.file?.url ? [item.file] : [],
                title: item.title || "",
              }))
            : [];

          setInitialValues({
            ...baseInitialValues,
            ...shopData,
            companyCode: shopData.companyCode || createCompanyCode(shopData.name || "", shopData.contactInfo?.phone || user?.phone || ""),
            coverImage,
            logo,
            gallery,
          });
        }
      } catch {
        setIsUpdateMode(false);
        setInitialValues(baseInitialValues);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShopData();
    }
  }, [shopTitle, getSingleShop, getSingleShopById, user, user?.company]);

  const handleImageProcessing = async (imageFile, isAdd, isDeleted) => {
    if (imageFile && imageFile.length !== 0 && isAdd) {
      return buildBase64ImageUpload(imageFile, {
        isDeleted: isDeleted || 0,
        isAdd: isAdd || 0,
      });
    }

    if (isDeleted) {
      return { isDeleted, isAdd: isAdd || 0 };
    }

    return null;
  };

  const buildCompanyPayload = async (values) => {
    const formData = { ...values };

    const logoData = await handleImageProcessing(
      formData.logo?.file,
      formData.logo?.isAdd,
      formData.logo?.isDeleted
    );
    const coverImageData = await handleImageProcessing(
      formData.coverImage?.file,
      formData.coverImage?.isAdd,
      formData.coverImage?.isDeleted
    );

    if (logoData) formData.logo = logoData;
    if (coverImageData) formData.coverImage = coverImageData;

    const updatedGallery = await Promise.all(
      (formData.gallery || []).map(async (item) => {
        if (item.isAdd) {
          const processed = await handleImageProcessing(item.file, true, false);
          return processed ? { file: processed, title: item.title } : null;
        }
        return { file: Array.isArray(item.file) ? item.file[0] : item.file, title: item.title };
      })
    );

    formData.gallery = updatedGallery.filter(Boolean);
    formData.multipleLocations = (formData.multipleLocations || []).filter((location: any) => {
      const hasText = [location?.address, location?.city, location?.state, location?.postalCode, location?.country]
        .some((value) => typeof value === "string" && value.trim().length > 0);
      const coordinates = Array.isArray(location?.coordinates) ? location.coordinates : [];
      const hasCoordinates =
        coordinates.length >= 2 &&
        (Number(coordinates[0]) !== 0 || Number(coordinates[1]) !== 0);

      return hasText || hasCoordinates;
    });
    formData.about = typeof formData.about === "string" ? formData.about.trim() : "";
    formData.gstNumber = normalizeGstNumber(formData.gstNumber) || undefined;

    return formData;
  };

  const createCompanyWithRetry = async (createData) => {
    const contactPhone = createData?.contactInfo?.phone || user?.phone || "";
    let lastError: any = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const payload = {
          ...createData,
          companyCode: createCompanyCode(createData.name || "", contactPhone, attempt),
          userId: user?._id,
        };
        await createCompany(payload);
        return;
      } catch (err: any) {
        const message = err?.message || err?.data?.message || "";
        lastError = err;
        if (/company code already exists/i.test(message)) {
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const formData = await buildCompanyPayload(values);

      if (isUpdateMode) {
        const response = await updateCompanyDetails({ ...formData, _id: user?.company?._id });
        const updatedShop = response?.data?.data || {};
        const wasReviewReworkState = ["changes_requested", "rejected"].includes(reviewMeta.reviewStatus || "");
        setReviewMeta({
          reviewStatus: updatedShop.reviewStatus || reviewMeta.reviewStatus || null,
          reviewRemarks: updatedShop.reviewRemarks || "",
        });
        openNotification({
          title: "Success",
          message: wasReviewReworkState
            ? "Shop details updated and resubmitted for review."
            : "Shop details updated.",
          type: "success",
        });
      } else {
        const createData = { ...formData };
        delete createData._id;
        await createCompanyWithRetry(createData);
        openNotification({
          title: "Congratulations!",
          message: "Shop created successfully!",
          type: "success",
        });
        window.location.reload();
      }
    } catch (err) {
      openNotification({
        title: isUpdateMode ? "Update Failed" : "Creation Failed",
        message: err?.data?.message || err?.message || "Something went wrong",
        type: getStatusType(err.status || 500),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center minH="80vh">
        <SpinnerLoader size="xl" />
      </Center>
    );
  }

  const reviewBanner = (() => {
    switch (reviewMeta.reviewStatus) {
      case "pending":
        return {
          status: "warning" as const,
          title: "Shop under review",
          description:
            "Your shop is waiting for admin approval. You can still update your details while it is under review.",
        };
      case "changes_requested":
        return {
          status: "warning" as const,
          title: "Changes requested",
          description: reviewMeta.reviewRemarks
            ? `${reviewMeta.reviewRemarks} Save your changes to resubmit the shop for review.`
            : "Admin requested updates to your shop. Save your changes to resubmit it for review.",
        };
      case "rejected":
        return {
          status: "error" as const,
          title: "Review rejected",
          description: reviewMeta.reviewRemarks
            ? `${reviewMeta.reviewRemarks} Update your details and save again when you are ready to resubmit.`
            : "Your shop review was rejected. Update your details and save again when you are ready to resubmit.",
        };
      default:
        return null;
    }
  })();

  return (
    <Box minH="100vh" bg={cPage} pb={{ base: "4px", md: "10px" }} sx={merchantFormSx}>
      {reviewBanner ? (
        <Box px={{ base: 4, md: 0 }} pt={{ base: 3, md: 4 }}>
          <Alert
            status={reviewBanner.status}
            borderRadius={{ base: "20px", md: "24px" }}
            alignItems="flex-start"
            bg={cSurfaceAlt}
            border="1px solid"
            borderColor={reviewBanner.status === "error" ? "rgba(239, 68, 68, 0.24)" : cBorder}
            color={cText}
            boxShadow={{ base: "none", md: "sm" }}
          >
            <AlertIcon mt={1} color={reviewBanner.status === "error" ? cDanger : cAccentStrong} />
            <Box>
              <AlertTitle color={cText}>{reviewBanner.title}</AlertTitle>
              <AlertDescription color={cTextMuted}>{reviewBanner.description}</AlertDescription>
            </Box>
          </Alert>
        </Box>
      ) : null}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ values, errors, setFieldValue, isSubmitting, submitForm, validateForm }) => {
          const activeSection = sections[activeSectionIndex];
          const ActiveSectionComponent = activeSection.component;
          const currentSectionFieldLabels = getSectionFieldLabels(errors, activeSectionIndex);
          const isLastStep = activeSectionIndex === sections.length - 1;

          const goToSection = (index: number) => {
            setActiveSectionIndex(Math.min(Math.max(index, 0), sections.length - 1));
            scrollToTop();
          };

          const handleFinalSubmit = async () => {
            setShowError(true);
            const validationErrors = await validateForm();
            const firstErrorSection = resolveFirstErrorSection(validationErrors);

            if (firstErrorSection !== null) {
              goToSection(firstErrorSection);
              const fieldLabels = getSectionFieldLabels(validationErrors, firstErrorSection);
              openNotification({
                title: "Please review the highlighted fields",
                message:
                  fieldLabels.length > 0
                    ? `Missing or invalid: ${fieldLabels.slice(0, 4).join(", ")}${fieldLabels.length > 4 ? "..." : ""}`
                    : `Some required details are missing in ${sections[firstErrorSection]?.headline}.`,
                type: "warning",
              });
              return;
            }

            submitForm();
          };

          return (
            <Form>
              <ShopFormHero
                activeSection={activeSection}
                activeSectionIndex={activeSectionIndex}
                onSelect={goToSection}
              />

              <Box px={{ base: 0, md: 4 }} pt={{ base: 2, md: 4 }}>
                <VStack spacing={4} align="stretch">
                  {showError && currentSectionFieldLabels.length > 0 ? (
                    <Box px={{ base: 4, md: 0 }}>
                      <Alert
                        status="warning"
                        borderRadius={{ base: "20px", md: "24px" }}
                        alignItems="flex-start"
                        bg={cSurfaceAlt}
                        border="1px solid"
                        borderColor={cBorder}
                        color={cText}
                        boxShadow={{ base: "none", md: "sm" }}
                      >
                        <AlertIcon mt={1} color={cAccentStrong} />
                        <Box>
                          <AlertTitle color={cText}>Please update these fields</AlertTitle>
                          <AlertDescription color={cTextMuted}>
                            {currentSectionFieldLabels.join(", ")}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </Box>
                  ) : null}

                  <ActiveSectionComponent
                    values={values}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    showError={showError}
                    isUpdateMode={isUpdateMode}
                  />
                </VStack>
              </Box>

              <StickyActionBar
                activeSection={activeSection}
                activeSectionIndex={activeSectionIndex}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
                onBack={() => goToSection(activeSectionIndex - 1)}
                onNext={() => goToSection(activeSectionIndex + 1)}
                onSubmit={handleFinalSubmit}
                isUpdateMode={isUpdateMode}
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
});

export default ShopForm;
