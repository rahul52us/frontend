// Updated ShopForm with:
// - Static sidebar on all screens
// - Save Section button per step
// - Clean buttons
// - Supports both CREATE (POST) and UPDATE (PUT)

"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  VStack,
  Heading,
  Flex,
  Divider,
  Center,
  Text,
  useColorModeValue,
  Container,
  HStack,
  Icon,
  Progress,
  Badge,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import { getStatusType } from "../../../component/config/utils/function";
import ShopDetailsSection from "./ShopDetailsSection";
import MainLocationSection from "./MainLocationSection";
import AdditionalLocationsSection from "./AdditionalLocationsSection";
import ContactInfoSection from "./ContactInfoSection";
import OperatingHoursSection from "./OperatingHoursSection";
import GallerySection from "./GallerySection";
import SpinnerLoader from "../../../component/common/Loader/SpinnerLoader";
import { normalizeGstNumber } from "../../../config/utils/gstValidation";
import { useParams } from "next/navigation";
import { createEmptyShopFormData } from "./utils/constant";
import {
  FaStore,
  FaMapMarkerAlt,
  FaMap,
  FaImages,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import { validationSchema } from "./utils/validation";
import { buildBase64ImageUpload } from "../../../config/utils/imageUpload";
import SellerOnboardingWizard from "./SellerOnboardingWizard";
import { createCompanyCode } from "./utils/companyCode";

const SectionHeader = ({ activeSection, sections }) => {
  const progress = ((activeSection + 1) / sections.length) * 100;
  const iconColor = useColorModeValue("white", "gray.900");

  return (
    <Box
      px={{ base: 4, md: 4 }}
      py={{ base: 6, md: 4 }}
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="md"
      position="relative"
    >
      {/* Top Progress Bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        h="3px"
        w={`${progress}%`}
        bgGradient="linear(to-r, blue.500, teal.400)"
        borderTopRadius="full"
        transition="width 0.3s ease"
        zIndex={1}
      />

      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        zIndex={2}
        position="relative"
      >
        <HStack spacing={4} align="center">
          <Box
            bg="blue.500"
            p={3}
            rounded="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="lg"
            color={iconColor}
          >
            <Icon as={sections[activeSection]?.icon || FiLayers} boxSize={6} />
          </Box>
          <VStack align="start" spacing={0}>
            <Heading
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color="gray.800"
            >
              Building Your Shop
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {sections[activeSection]?.title}
            </Text>
          </VStack>
        </HStack>

        <Badge
          variant="solid"
          colorScheme="teal"
          fontSize="sm"
          px={4}
          py={1}
          rounded="full"
          whiteSpace="nowrap"
          boxShadow="sm"
          alignSelf={{ base: "flex-start", md: "center" }}
        >
          {sections[activeSection]?.title}
        </Badge>
      </Flex>
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
    <Container maxW="container.2xl" py={4}>
      {reviewBanner ? (
        <Alert status={reviewBanner.status} variant="left-accent" borderRadius="xl" mb={4} alignItems="flex-start">
          <AlertIcon mt={1} />
          <Box>
            <AlertTitle>{reviewBanner.title}</AlertTitle>
            <AlertDescription>{reviewBanner.description}</AlertDescription>
          </Box>
        </Alert>
      ) : null}
      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        {/* Static Sidebar */}
        <Box w={{ base: "100%", md: "280px" }} borderRadius="xl" boxShadow="md" p={4} border="1px solid" borderColor="gray.200">
          <VStack align="stretch" spacing={3} px={2}>
            <Text fontWeight="bold" fontSize="lg" color="gray.700" mb={1}>
              {isUpdateMode ? "Edit Sections" : "Creation Steps"}
            </Text>
            <Divider borderColor="gray.300" mb={2} />

            {sections.map((section, index) => {
              const isActive = activeSection === index;
              // Disable navigation in creation mode to force linear flow
              const isDisabled = !isUpdateMode && index > activeSection;

              return (
                <Button
                  key={index}
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<Icon as={section.icon} boxSize={5} />}
                  fontWeight={isActive ? "bold" : "normal"}
                  color={isActive ? "blue.600" : "gray.700"}
                  bg={isActive ? "blue.50" : "transparent"}
                  _hover={{
                    bg: "blue.50",
                    transform: "translateX(2px)",
                  }}
                  _active={{
                    bg: "blue.100",
                  }}
                  size="md"
                  onClick={() => !isDisabled && setActiveSection(index)}
                  borderRadius="md"
                  px={3}
                  py={2}
                  isDisabled={isDisabled}
                  transition="all 0.2s ease"
                >
                  {section.title}
                </Button>
              );
            })}

            <Progress
              mt={3}
              size="sm"
              value={(activeSection + 1) * (100 / sections.length)}
              borderRadius="full"
              colorScheme="blue"
              bg="gray.100"
              hasStripe
            />
          </VStack>

        </Box>

        {/* Main Form */}
        <Box flex={1} borderRadius="2xl" boxShadow="xl" p={2} border="1px solid" borderColor="gray.200">
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
                  <VStack spacing={4} align="stretch">
                    <SectionHeader activeSection={activeSection} sections={sections} />
                    {showError && currentSectionFieldLabels.length > 0 ? (
                      <Alert status="warning" variant="left-accent" borderRadius="xl" alignItems="flex-start">
                        <AlertIcon mt={1} />
                        <Box>
                          <AlertTitle>Please update these fields</AlertTitle>
                          <AlertDescription>
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

                    {/* Inline Save Section */}
                    <Flex justify="flex-end">
                      <Button
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        isLoading={isSubmitting}
                        onClick={handleAttemptSubmit}
                      >
                        Save Section
                      </Button>
                    </Flex>

                    {/* Navigation */}
                    <Flex justify="space-between" pt={4}>
                      <Button
                        onClick={() => setActiveSection((prev) => Math.max(0, prev - 1))}
                        isDisabled={activeSection === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      {activeSection < sections.length - 1 ? (
                        <Button
                          onClick={() => setActiveSection((prev) => Math.min(sections.length - 1, prev + 1))}
                          colorScheme="blue"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          isLoading={isSubmitting}
                          colorScheme="blue"
                          onClick={handleAttemptSubmit}
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
