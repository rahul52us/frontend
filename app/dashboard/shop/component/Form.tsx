"use client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaMap,
  FaMapMarkerAlt,
  FaPhone,
  FaStore,
} from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
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
import { useMerchantFormSx } from "./merchantTheme";
import OperatingHoursSection from "./OperatingHoursSection";
import SellerOnboardingWizard from "./SellerOnboardingWizard";
import ShopDetailsSection from "./ShopDetailsSection";
import { createCompanyCode } from "./utils/companyCode";
import { createEmptyShopFormData } from "./utils/constant";
import { validationSchema } from "./utils/validation";

// Section accent colors — each step gets a unique but harmonious hue
const SECTION_COLORS = [
  { gradient: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", glow: "rgba(59,130,246,0.22)", soft: "rgba(59,130,246,0.10)", text: "#60A5FA" },   // Shop Details — Blue
  { gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)", glow: "rgba(16,185,129,0.22)", soft: "rgba(16,185,129,0.10)", text: "#34D399" },  // Main Location — Mint
  { gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", glow: "rgba(139,92,246,0.22)", soft: "rgba(139,92,246,0.10)", text: "#A78BFA" }, // Additional — Violet
  { gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", glow: "rgba(99,102,241,0.22)", soft: "rgba(99,102,241,0.10)",  text: "#818CF8" }, // Gallery — Indigo
  { gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)", glow: "rgba(6,182,212,0.22)",  soft: "rgba(6,182,212,0.10)",  text: "#22D3EE" },  // Contact — Cyan
  { gradient: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)", glow: "rgba(244,63,94,0.22)",  soft: "rgba(244,63,94,0.10)",  text: "#FB7185" },   // Hours — Rose
];

const SectionHeader = ({ activeSection, sections }) => {
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cBorder = useColorModeValue("blue.100", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cPage = useColorModeValue("white", dashboardPalette.page);
  const shellBg = useColorModeValue("white", dashboardPalette.shellElevated);
  const currentColor = SECTION_COLORS[activeSection] || SECTION_COLORS[0];

  return (
    <Box
      px={{ base: 5, md: 6 }}
      py={{ base: 6, md: 7 }}
      bg={shellBg}
      borderRadius="28px"
      border="1px solid"
      borderColor={cBorder}
      boxShadow={useColorModeValue(
        `0 4px 24px ${currentColor.glow}`,
        `0 28px 60px rgba(0,0,0,0.28), 0 0 0 1px ${currentColor.glow}`
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Subtle colored top accent bar */}
      <Box
        position="absolute"
        insetX={0}
        top={0}
        h="3px"
        bgGradient={currentColor.gradient}
        opacity={0.8}
      />
      {/* Soft radial glow in corner */}
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="160px"
        h="160px"
        borderRadius="full"
        bg={currentColor.soft}
        filter="blur(28px)"
        pointerEvents="none"
      />

      <Flex
        justify="space-between"
        align={{ base: "start", lg: "center" }}
        direction={{ base: "column", lg: "row" }}
        gap={6}
        position="relative"
        zIndex={1}
      >
        <HStack spacing={4} align="center">
          {/* Section icon with gradient background */}
          <Box
            w="52px"
            h="52px"
            borderRadius="18px"
            bgGradient={currentColor.gradient}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 8px 20px ${currentColor.glow}`}
            flexShrink={0}
          >
            <Icon as={sections[activeSection]?.icon || FiLayers} boxSize={6} color="white" />
          </Box>
          <VStack align="start" spacing={0.5}>
            <Text
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.32em"
              color={cTextSoft}
              fontWeight="700"
            >
              Shop Configuration · Step {activeSection + 1} of {sections.length}
            </Text>
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="800"
              lineHeight="1.1"
              color={cText}
              letterSpacing="-0.02em"
            >
              {sections[activeSection]?.title}
            </Heading>
            <Text fontSize="sm" color={cTextMuted} mt={0.5}>
              Fill in the details below and click Next to continue.
            </Text>
          </VStack>
        </HStack>

        {/* Colorful step badge */}
        <Badge
          px={4}
          py={2}
          borderRadius="full"
          bgGradient={currentColor.gradient}
          color="white"
          border="none"
          textTransform="uppercase"
          letterSpacing="0.14em"
          fontSize="xs"
          fontWeight="800"
          alignSelf={{ base: "flex-start", lg: "center" }}
          boxShadow={`0 4px 14px ${currentColor.glow}`}
        >
          Step {activeSection + 1}
        </Badge>
      </Flex>

      {/* Step progress dots */}
      <HStack mt={6} spacing={2} position="relative" zIndex={1}>
        {sections.map((section, index) => {
          const isCurrent = index === activeSection;
          const isCompleted = index < activeSection;
          const stepColor = SECTION_COLORS[index] || SECTION_COLORS[0];

          return (
            <Flex key={section.title} align="center" gap={2}>
              <Box
                w={isCurrent ? "32px" : "10px"}
                h="10px"
                borderRadius="full"
                bg={
                  isCompleted
                    ? stepColor.gradient
                    : isCurrent
                      ? stepColor.gradient
                      : useColorModeValue("gray.200", "rgba(255,255,255,0.08)")
                }
                bgGradient={isCurrent || isCompleted ? stepColor.gradient : undefined}
                boxShadow={isCurrent ? `0 0 8px ${stepColor.glow}` : "none"}
                transition="all 0.3s ease"
                title={section.title}
              />
            </Flex>
          );
        })}
        <Text fontSize="xs" color={cTextSoft} fontWeight="600" ml={2}>
          {sections.filter((_, i) => i < activeSection).length} of {sections.length} done
        </Text>
      </HStack>
    </Box>
  );
};

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

  return {
    ...defaults,
    ...shopData,
    tags: normalizeStringArray(shopData?.tags),
    categories: normalizeStringArray(shopData?.categories),
    paymentMethods: normalizeStringArray(shopData?.paymentMethods),
    description: shopData?.description || defaults.description,
    about: shopData?.about || shopData?.description || defaults.about,
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
    matches: (errors: any) => Boolean(errors?.gallery),
  },
  {
    index: 4,
    matches: (errors: any) => Boolean(errors?.contactInfo),
  },
  {
    index: 5,
    matches: (errors: any) => Boolean(errors?.operatingHours || errors?.closedDates),
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

const normalizeErrorPath = (path: string) =>
  path.replace(/\.\d+/g, "");

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
      const fieldName = fieldLabelMap[fieldPath] || fieldLabelMap[locationMatch[2].replace(/\.\d+/g, "")] || "Location Field";
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
          return !path.startsWith("location") && !path.startsWith("multipleLocations") && !path.startsWith("gallery") && !path.startsWith("contactInfo") && !path.startsWith("operatingHours") && !path.startsWith("closedDates");
        case 1:
          return path.startsWith("location");
        case 2:
          return path.startsWith("multipleLocations");
        case 3:
          return path.startsWith("gallery");
        case 4:
          return path.startsWith("contactInfo");
        case 5:
          return path.startsWith("operatingHours") || path.startsWith("closedDates");
        default:
          return false;
      }
    })
    .map(({ label }) => label);

  return Array.from(new Set(labels));
};

const ShopForm = observer(() => {
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.500", dashboardPalette.textSoft);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cPage = useColorModeValue("#F4F7FE", dashboardPalette.page);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);
  const cWarning = useColorModeValue("orange.500", dashboardPalette.warning);
  const merchantFormSx = useMerchantFormSx();
  const sidebarBg = useColorModeValue("white", dashboardPalette.shellElevated);
  
                            
  const [initialValues, setInitialValues] = useState(() => createEmptyShopFormData());
  const [activeSection, setActiveSection] = useState(0);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Track mode
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

  const sections = [
    { title: "Shop Details", icon: FaStore, component: ShopDetailsSection },
    { title: "Main Location", icon: FaMapMarkerAlt, component: MainLocationSection },
    { title: "Additional Locations", icon: FaMap, component: AdditionalLocationsSection },
    { title: "Gallery", icon: FaImages, component: GallerySection },
    { title: "Contact Info", icon: FaPhone, component: ContactInfoSection },
    { title: "Operating Hours", icon: FaClock, component: OperatingHoursSection },
  ];

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
      // If user has no company linked, assume creation mode
      if (!user?.company) {
        const emptyData = createEmptyShopFormData();
        setIsUpdateMode(false);
        setInitialValues({
          ...emptyData,
          contactInfo: {
            ...emptyData.contactInfo,
            phone: user?.phone || "",
            email: user?.email || "",
          },
        });
        setLoading(false);
        return;
      }

      // If user has company, fetch data and switch to update mode
      try {
        const companyId = user?.company?._id || (typeof user?.company === "string" ? user.company : "");
        const data = companyId
          ? await getSingleShopById(companyId)
          : await getSingleShop({
              title: user?.company?.name,
              status: user?.company?.shopStatus,
            });

        if (!data?.data) {
          // Fallback to creation mode if not found (shouldn't happen if user.company exists, but safe fallback)
          setIsUpdateMode(false);
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
            ? shopData.gallery.map((item) => ({ file: item.file?.url ? [item.file] : [], title: item.title || "" }))
            : [];

          setInitialValues({ ...shopData, coverImage, logo, gallery });
        }
      } catch {
        // If error (e.g. 404), assume creation mode is safer than blocking
        setIsUpdateMode(false);
        // setError("Failed to fetch shop data."); 
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
    } else if (isDeleted) {
      return { isDeleted, isAdd: isAdd || 0 };
    }
    return null;
  };

  const buildCompanyPayload = async (values) => {
    const formData = { ...values };

    const logoData = await handleImageProcessing(formData.logo?.file, formData.logo?.isAdd, formData.logo?.isDeleted);
    const coverImageData = await handleImageProcessing(formData.coverImage?.file, formData.coverImage?.isAdd, formData.coverImage?.isDeleted);

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
    formData.about = formData.about || formData.description || "";
    formData.gstNumber = normalizeGstNumber(formData.gstNumber) || undefined;

    return formData;
  };

  const createCompanyFromOnboarding = async (values) => {
    const createData = await buildCompanyPayload(values);
    delete createData._id;

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
        await createCompany({ ...createData, userId: user?._id });
        openNotification({ title: "Congratulations!", message: "Shop created successfully!", type: "success" });
        // Hard reload or redirect to ensure user state is refreshed
        window.location.reload();
      }

    } catch (err) {
      openNotification({
        title: isUpdateMode ? "Update Failed" : "Creation Failed",
        message: err?.data?.message || "Something went wrong",
        type: getStatusType(err.status || 500),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Center minH="80vh"><SpinnerLoader size="xl" /></Center>;

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

  if (!isUpdateMode) {
    return (
      <SellerOnboardingWizard
        initialValues={initialValues}
        accountPhone={user?.phone}
        accountEmail={user?.email}
        onSubmit={createCompanyFromOnboarding}
      />
    );
  }

  return (
    <Container maxW="100%" px={{ base: 4, md: 8, lg: 10 }} py={{ base: 4, md: 6 }} sx={merchantFormSx}>
      {reviewBanner ? (
        <Alert
          status={reviewBanner.status}
          borderRadius="22px"
          mb={5}
          alignItems="flex-start"
          bg={cSurfaceAlt}
          border="1px solid"
          borderColor={reviewBanner.status === "error" ? "rgba(239, 107, 107, 0.24)" : cBorder}
          color={cText}
          shadow={'md'}
        >
          <AlertIcon mt={1} color={reviewBanner.status === "error" ? cDanger : cAccentStrong} />
          <Box>
            <AlertTitle color={cText}>{reviewBanner.title}</AlertTitle>
            <AlertDescription color={cTextMuted}>{reviewBanner.description}</AlertDescription>
          </Box>
        </Alert>
      ) : null}
      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        {/* ── Sidebar navigation ── */}
        <Box
          w={{ base: "100%", lg: "300px" }}
          borderRadius="28px"
          p={5}
          border="1px solid"
          borderColor={cBorder}
          bg={sidebarBg}
          boxShadow={useColorModeValue(
            "0 4px 24px rgba(37,99,235,0.06)",
            "0 24px 60px rgba(0,0,0,0.32)"
          )}
          alignSelf="flex-start"
          position={{ base: "static", lg: "sticky" }}
          top={{ lg: "24px" }}
        >
          <VStack align="stretch" spacing={2}>
            <Text
              fontWeight="800"
              fontSize="10px"
              color={cTextSoft}
              mb={1}
              textTransform="uppercase"
              letterSpacing="0.26em"
            >
              {isUpdateMode ? "Edit Sections" : "Setup Steps"}
            </Text>
            <Divider borderColor={cBorder} mb={1} />

            {sections.map((section, index) => {
              const isActive = activeSection === index;
              const isCompleted = !isUpdateMode && index < activeSection;
              const isDisabled = !isUpdateMode && index > activeSection;
              const stepColor = SECTION_COLORS[index] || SECTION_COLORS[0];

              return (
                <Button
                  key={index}
                  variant="unstyled"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap={3}
                  minH="56px"
                  fontWeight={isActive ? "700" : "500"}
                  color={isActive ? cText : cTextMuted}
                  bg={isActive ? stepColor.soft : "transparent"}
                  _hover={{
                    bg: isActive ? stepColor.soft : useColorModeValue("gray.50", "rgba(255,255,255,0.03)"),
                    transform: "translateX(3px)",
                  }}
                  onClick={() => !isDisabled && setActiveSection(index)}
                  borderRadius="16px"
                  px={3}
                  py={3}
                  isDisabled={isDisabled}
                  transition="all 0.2s ease"
                  border="1px solid"
                  borderColor={isActive ? stepColor.text : "transparent"}
                  borderLeftWidth={isActive ? "3px" : "1px"}
                  opacity={isDisabled ? 0.38 : 1}
                >
                  {/* Colored icon circle */}
                  <Box
                    w="36px"
                    h="36px"
                    borderRadius="12px"
                    bg={isActive ? stepColor.gradient : useColorModeValue("gray.100", "rgba(255,255,255,0.05)")}
                    bgGradient={isActive ? stepColor.gradient : undefined}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    boxShadow={isActive ? `0 4px 12px ${stepColor.glow}` : "none"}
                    transition="all 0.2s"
                  >
                    <Icon
                      as={section.icon}
                      boxSize={4}
                      color={isActive ? "white" : isCompleted ? stepColor.text : cTextSoft}
                    />
                  </Box>
                  <Box textAlign="left" flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight={isActive ? "700" : "500"} noOfLines={1}>
                      {section.title}
                    </Text>
                    <Text fontSize="10px" color={isActive ? stepColor.text : cTextSoft} fontWeight="600">
                      {isCompleted ? "✓ Completed" : isActive ? "In progress" : `Step ${index + 1}`}
                    </Text>
                  </Box>
                  {isCompleted && (
                    <Box
                      w="8px" h="8px"
                      borderRadius="full"
                      bg={stepColor.gradient}
                      bgGradient={stepColor.gradient}
                      flexShrink={0}
                    />
                  )}
                </Button>
              );
            })}

            {/* Progress bar with gradient */}
            <Box mt={3} px={1}>
              <Flex justify="space-between" mb={1.5}>
                <Text fontSize="10px" color={cTextSoft} fontWeight="700" textTransform="uppercase" letterSpacing="0.12em">
                  Progress
                </Text>
                <Text fontSize="10px" color={cTextSoft} fontWeight="700">
                  {activeSection + 1}/{sections.length}
                </Text>
              </Flex>
              <Box h="6px" borderRadius="full" bg={useColorModeValue("gray.100", "rgba(255,255,255,0.06)")} overflow="hidden">
                <Box
                  h="full"
                  w={`${((activeSection + 1) / sections.length) * 100}%`}
                  bgGradient="linear(to-r, #3B82F6, #8B5CF6)"
                  borderRadius="full"
                  transition="width 0.4s ease"
                  boxShadow="0 0 8px rgba(99,102,241,0.5)"
                />
              </Box>
            </Box>
          </VStack>
        </Box>

        <Box
          flex={1}
          borderRadius="30px"
          boxShadow="0 20px 28px rgba(0, 0, 0, 0.22)"
          p={{ base: 1, md: 2 }}
          border="1px solid"
          borderColor={cBorder}
          bg={useColorModeValue("white", dashboardPalette.shell)}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ values, errors, setFieldValue, isSubmitting, submitForm, validateForm }) => {
              const ActiveSectionComponent = sections[activeSection].component;
              const currentSectionFieldLabels = getSectionFieldLabels(errors, activeSection);

              const handleAttemptSubmit = async () => {
                setShowError(true);
                const validationErrors = await validateForm();
                const firstErrorSection = resolveFirstErrorSection(validationErrors);

                if (firstErrorSection !== null) {
                  setActiveSection(firstErrorSection);
                  const fieldLabels = getSectionFieldLabels(validationErrors, firstErrorSection);
                  openNotification({
                    title: "Please review the highlighted fields",
                    message:
                      fieldLabels.length > 0
                        ? `Missing or invalid: ${fieldLabels.slice(0, 4).join(", ")}${fieldLabels.length > 4 ? "..." : ""}`
                        : `Some required details are missing in ${sections[firstErrorSection]?.title}.`,
                    type: "warning",
                  });
                  return;
                }

                submitForm();
              };

              // Debug validation errors
              if (Object.keys(errors).length > 0 && showError) {
                // eslint-disable-next-line no-console
                console.log("Validation Errors:", errors);
              }

              return (
                <Form>
                  <VStack spacing={5} align="stretch">
                    <SectionHeader activeSection={activeSection} sections={sections} />
                    {showError && currentSectionFieldLabels.length > 0 ? (
                      <Alert
                        status="warning"
                        borderRadius="22px"
                        alignItems="flex-start"
                        bg={cSurfaceAlt}
                        border="1px solid"
                        borderColor={cBorder}
                        color={cText}
                      >
                        <AlertIcon mt={1} color={cAccentStrong} />
                        <Box>
                          <AlertTitle color={cText}>Please update these fields</AlertTitle>
                          <AlertDescription color={cTextMuted}>
                            {currentSectionFieldLabels.join(", ")}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    ) : null}
                    <ActiveSectionComponent
                      values={values}
                      errors={errors}
                      setFieldValue={setFieldValue}
                      showError={showError}
                    />

                    <Flex justify="flex-end">
                      <Button
                        size="md"
                        variant="outline"
                        borderRadius="18px"
                        borderColor={cBorderStrong}
                        color={cAccentStrong}
                        _hover={{ bg: cAccentSoft, borderColor: cAccent }}
                        isLoading={isSubmitting}
                        onClick={handleAttemptSubmit}
                      >
                        Save Section
                      </Button>
                    </Flex>

                    <Flex justify="space-between" pt={4}>
                  <Button
                        onClick={() => setActiveSection((prev) => Math.max(0, prev - 1))}
                        isDisabled={activeSection === 0}
                        variant="outline"
                        borderRadius="18px"
                        borderColor={cBorderStrong}
                        color={cTextMuted}
                        leftIcon={<Icon as={FaChevronLeft} boxSize={3} />}
                        _hover={{ bg: useColorModeValue("gray.50", "rgba(255,255,255,0.04)"), color: cText }}
                      >
                        Previous
                      </Button>
                      {activeSection < sections.length - 1 ? (
                        <Button
                          onClick={() => setActiveSection((prev) => Math.min(sections.length - 1, prev + 1))}
                          borderRadius="18px"
                          bgGradient="linear(to-r, #3B82F6, #6366F1)"
                          color="white"
                          _hover={{ bgGradient: "linear(to-r, #2563EB, #4F46E5)", transform: "translateY(-1px)", boxShadow: "0 8px 20px rgba(59,130,246,0.34)" }}
                          _active={{ transform: "scale(0.98)" }}
                          rightIcon={<Icon as={FaChevronRight} boxSize={3} />}
                          boxShadow="0 4px 14px rgba(59,130,246,0.26)"
                        >
                          Next Section
                        </Button>
                      ) : (
                        <Button
                          isLoading={isSubmitting}
                          borderRadius="18px"
                          bgGradient="linear(to-r, #2563EB, #3B82F6)"
                          color="white"
                          _hover={{ bgGradient: "linear(to-r, #1D4ED8, #2563EB)", transform: "translateY(-1px)", boxShadow: "0 8px 20px rgba(37,99,235,0.38)" }}
                          _active={{ transform: "scale(0.98)" }}
                          leftIcon={<Icon as={FaStore} boxSize={4} />}
                          onClick={handleAttemptSubmit}
                          boxShadow="0 4px 14px rgba(37,99,235,0.30)"
                        >
                          {isUpdateMode ? "Save Shop" : "Create Shop"}
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Flex>
    </Container>
  );
});
export default ShopForm;