// Updated ShopForm with:
// - Static sidebar on all screens
// - Save Section button per step
// - Clean buttons
// - Supports both CREATE (POST) and UPDATE (PUT)

"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
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
import { useParams, useRouter } from "next/navigation";
import { dummyData } from "./utils/constant";
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
import { readFileAsBase64 } from "../../../config/utils/utils";

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

const ShopForm = observer(() => {
  const [initialValues, setInitialValues] = useState(dummyData);
  const [activeSection, setActiveSection] = useState(0);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Track mode

  const {
    companyStore: { updateCompanyDetails, createCompany },
    auth: { openNotification, user },
    shopStore: { getSingleShop },
  } = stores;

  const { shopTitle } = useParams();
  const router = useRouter();

  const sections = [
    { title: "Shop Details", icon: FaStore, component: ShopDetailsSection },
    { title: "Main Location", icon: FaMapMarkerAlt, component: MainLocationSection },
    { title: "Additional Locations", icon: FaMap, component: AdditionalLocationsSection },
    { title: "Gallery", icon: FaImages, component: GallerySection },
    { title: "Contact Info", icon: FaPhone, component: ContactInfoSection },
    { title: "Operating Hours", icon: FaClock, component: OperatingHoursSection },
  ];

  useEffect(() => {
    const fetchShopData = async () => {
      // If user has no company linked, assume creation mode
      if (!user?.company) {
        setIsUpdateMode(false);
        setLoading(false);
        return;
      }

      // If user has company, fetch data and switch to update mode
      try {
        const data = await getSingleShop({
          title: user?.company?.name,
          status: user?.company?.shopStatus,
        });

        if (!data?.data) {
          // Fallback to creation mode if not found (shouldn't happen if user.company exists, but safe fallback)
          setIsUpdateMode(false);
        } else {
          setIsUpdateMode(true);
          const coverImage = data.data.coverImage?.url ? { file: [data.data.coverImage] } : { file: [] };
          const logo = data.data.logo?.url ? { file: [data.data.logo] } : { file: [] };
          const gallery = Array.isArray(data.data.gallery)
            ? data.data.gallery.map((item) => ({ file: item.file?.url ? [item.file] : [], title: item.title || "" }))
            : [];

          setInitialValues((prev) => ({ ...prev, ...data.data, coverImage, logo, gallery }));
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
  }, [shopTitle, getSingleShop, user, user?.company]);

  const handleImageProcessing = async (imageFile, isAdd, isDeleted) => {
    if (imageFile && imageFile.length !== 0 && isAdd) {
      return await readFileAsBase64(imageFile).then((buffer) => ({
        buffer,
        filename: imageFile.name,
        type: imageFile.type,
        isDeleted: isDeleted || 0,
        isAdd: isAdd || 0,
      }));
    } else if (isDeleted) {
      return { isDeleted, isAdd: isAdd || 0 };
    }
    return null;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const formData = { ...values };

      const logoData = await handleImageProcessing(formData.logo?.file, formData.logo?.isAdd, formData.logo?.isDeleted);
      const coverImageData = await handleImageProcessing(formData.coverImage?.file, formData.coverImage?.isAdd, formData.coverImage?.isDeleted);

      if (logoData) formData.logo = logoData;
      if (coverImageData) formData.coverImage = coverImageData;

      const updatedGallery = await Promise.all(
        formData.gallery.map(async (item) => {
          if (item.isAdd) {
            const processed = await handleImageProcessing(item.file, true, false);
            return processed ? { file: processed, title: item.title } : null;
          }
          return { file: Array.isArray(item.file) ? item.file[0] : item.file, title: item.title };
        })
      );

      formData.gallery = updatedGallery.filter(Boolean);

      if (isUpdateMode) {
        await updateCompanyDetails({ ...formData, _id: user?.company?._id, shopStatus: "active" });
        openNotification({ title: "Success", message: "Shop details updated.", type: "success" });
      } else {
        // CREATE MODE - Remove _id from dummy data
        const { _id, ...createData } = formData;
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
  if (error) return <Center minH="80vh"><Text color="red.500">{error}</Text></Center>;

  return (
    <Container maxW="container.2xl" py={4}>
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
            {({ values, errors, setFieldValue, isSubmitting, submitForm }) => {
              // Debug validation errors
              if (Object.keys(errors).length > 0 && showError) {
                console.log("Validation Errors:", errors);
              }

              return (
                <Form>
                  <VStack spacing={4} align="stretch">
                    <SectionHeader activeSection={activeSection} sections={sections} />
                    {sections[activeSection].component({ values, errors, setFieldValue, showError })}

                    {/* Inline Save Section */}
                    <Flex justify="flex-end">
                      <Button
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        isLoading={isSubmitting}
                        onClick={() => {
                          setShowError(true);
                          submitForm();
                        }}
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
                          type="submit"
                          isLoading={isSubmitting}
                          colorScheme="blue"
                          onClick={() => setShowError(true)}
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
