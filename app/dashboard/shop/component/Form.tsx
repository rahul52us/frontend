"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { readFileAsBase64 } from "../../../config/utils/utils";
import stores from "../../../store/stores";
import { getStatusType } from "../../../component/config/utils/function";
import ShopDetailsSection from "./ShopDetailsSection";
import MainLocationSection from "./MainLocationSection";
import AdditionalLocationsSection from "./AdditionalLocationsSection";
import ContactInfoSection from "./ContactInfoSection";
import OperatingHoursSection from "./OperatingHoursSection";
import GallerySection from "./GallerySection";
import SpinnerLoader from "../../../component/common/Loader/SpinnerLoader";
import { useParams } from "next/navigation";
import { dummyData } from "./utils/constant";
import {
  FaStore,
  FaMapMarkerAlt,
  FaMap,
  FaImages,
  FaPhone,
  FaClock,
  FaBars,
} from "react-icons/fa";

// Validation Schema (unchanged)
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  about: Yup.string().required("Description is required").trim(),
  logo: Yup.mixed(),
  coverImage: Yup.mixed(),
  location: Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
    coordinates: Yup.array()
      .of(Yup.number().required("Coordinate value is required"))
      .length(
        2,
        "Coordinates must contain exactly 2 values: [longitude, latitude]"
      )
      .required("Coordinates are required"),
  }),
  multipleLocations: Yup.array().of(
    Yup.object({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      postalCode: Yup.string().required("Postal code is required"),
      country: Yup.string().required("Country is required"),
      coordinates: Yup.array()
        .of(Yup.number().required("Coordinate value is required"))
        .length(
          2,
          "Coordinates must contain exactly 2 values: [longitude, latitude]"
        )
        .required("Coordinates are required"),
    })
  ),
  gallery: Yup.array().of(Yup.mixed()),
  categories: Yup.array().of(Yup.string()),
  contactInfo: Yup.object({
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email format").optional(),
    website: Yup.string().url("Invalid website URL").optional(),
    socialMedia: Yup.object({
      facebook: Yup.string().url("Invalid URL").optional(),
      instagram: Yup.string().url("Invalid URL").optional(),
      twitter: Yup.string().url("Invalid URL").optional(),
      linkedin: Yup.string().url("Invalid URL").optional(),
      youtube: Yup.string().url("Invalid URL").optional(),
    }).optional(),
  }),
  operatingHours: Yup.array().of(
    Yup.object({
      day: Yup.string().required("Day is required"),
      open: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .optional(),
      close: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .optional(),
    })
  ),
  closedDates: Yup.array()
    .of(
      Yup.string().matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format (YYYY-MM-DD)"
      )
    )
    .optional(),
});

const ShopForm = observer(() => {
  const [initialValues, setInitialValues] = useState(dummyData);
  const [showError, setShowError] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const {
    companyStore: { updateCompanyDetails },
    auth: { openNotification, user },
  } = stores;

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { shopTitle } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    shopStore: { getSingleShop },
  } = stores;

  const sections = [
    {
      title: "Shop Details",
      icon: FaStore,
      component: ShopDetailsSection,
    },
    {
      title: "Main Location",
      icon: FaMapMarkerAlt,
      component: MainLocationSection,
    },
    {
      title: "Additional Locations",
      icon: FaMap,
      component: AdditionalLocationsSection,
    },
    {
      title: "Gallery",
      icon: FaImages,
      component: GallerySection,
    },
    {
      title: "Contact Info",
      icon: FaPhone,
      component: ContactInfoSection,
    },
    {
      title: "Operating Hours",
      icon: FaClock,
      component: OperatingHoursSection,
    },
  ];

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSingleShop({
          title: user?.company?.name,
          status: user?.company?.shopStatus,
        });

        if (!data?.data) {
          setError("Shop not found");
        } else {
          const coverImage = data?.data?.coverImage?.url
            ? { file: [data.data.coverImage] }
            : { file: [] };

          const logo = data?.data?.logo?.url
            ? { file: [data.data.logo] }
            : { file: [] };

          const gallery = data?.data?.gallery && Array.isArray(data.data.gallery)
            ? data.data.gallery.map((item) => ({
                file: item.file?.url ? [item.file] : [],
                title: item.title || "",
              }))
            : [];

          setInitialValues({
            ...initialValues,
            ...data?.data,
            coverImage: coverImage,
            logo: logo,
            gallery: gallery,
          });
        }
      } catch {
        setError("Failed to fetch shop data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopTitle, getSingleShop]);

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
      return { isDeleted: isDeleted || 0, isAdd: isAdd || 0 };
    }
    return null;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = { ...values };

      const logoData = await handleImageProcessing(
        formData?.logo?.file,
        formData?.logo?.isAdd,
        formData?.logo?.isDeleted
      );
      const coverImageData = await handleImageProcessing(
        formData?.coverImage?.file,
        formData?.coverImage?.isAdd,
        formData?.coverImage?.isDeleted
      );

      if (logoData) formData.logo = logoData;
      if (coverImageData) formData.coverImage = coverImageData;

      const updatedGallery = await Promise.all(
        formData.gallery
          .filter((item) => item.isAdd || !item.isAdd)
          .map(async (item) => {
            if (item.isAdd) {
              const processedFile = await handleImageProcessing(
                item.file,
                true,
                false
              );
              return processedFile
                ? { file: processedFile, title: item.title }
                : null;
            } else {
              return {
                file: Array.isArray(item.file) ? item.file[0] : item.file,
                title: item.title,
              };
            }
          })
      );

      formData.gallery = updatedGallery.filter(Boolean);

      updateCompanyDetails({
        ...formData,
        _id: user?.company?._id,
        shopStatus: "active",
      })
        .then((data : any) => {
          openNotification({
            title: "Successfully Updated",
            message: data.message,
            type: "success",
          });
          setActiveSection(0);
        })
        .catch((err) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
        })
        .finally(() => setSubmitting(false));
    } catch {
      openNotification({
        title: "Error",
        message: "An unexpected error occurred.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <Center minH="80vh" bg={bgColor}>
        <SpinnerLoader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="80vh" bg={bgColor}>
        <Text fontSize="xl" color="red.500" fontWeight="semibold">
          {error}
        </Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.2xl" py={{ base: 2, md: 2 }}>
      <Flex direction={{ base: "column", md: "row" }} gap={2}>
        {/* Sidebar for Desktop */}
        <Box
          display={{ base: "none", md: "block" }}
          w={{ md: "280px" }}
          bg={bgColor}
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor={borderColor}
          p={4}
          position="sticky"
          top={0}
          height="fit-content"
        >
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Form Sections
            </Text>
            {sections.map((section, index) => (
              <Button
                key={index}
                variant="ghost"
                justifyContent="flex-start"
                bg={activeSection === index ? "blue.50" : "transparent"}
                color={activeSection === index ? accentColor : textColor}
                _hover={{
                  bg: "blue.50",
                  transform: "translateX(5px)",
                }}
                transition="all 0.2s ease"
                borderRadius="md"
                p={3}
                onClick={() => setActiveSection(index)}
              >
                <HStack spacing={3}>
                  <Icon as={section.icon} boxSize={5} />
                  <Text fontWeight="medium">{section.title}</Text>
                </HStack>
              </Button>
            ))}
            <Progress
              value={(activeSection + 1) * (100 / sections.length)}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              mt={4}
            />
          </VStack>
        </Box>

        {/* Bottom Navigation for Mobile */}
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg={bgColor}
          borderTop="1px"
          borderColor={borderColor}
          p={3}
          zIndex={10}
        >
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              Step {activeSection + 1} of {sections.length}
            </Text>
            <IconButton
              aria-label="Open navigation"
              icon={<FaBars />}
              onClick={onOpen}
              colorScheme="blue"
              variant="outline"
              size="sm"
            />
          </HStack>
          <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius="xl">
              <DrawerCloseButton />
              <DrawerHeader fontSize="lg" color={textColor}>
                Form Sections
              </DrawerHeader>
              <DrawerBody pb={6}>
                <VStack align="stretch" spacing={2}>
                  {sections.map((section, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      justifyContent="flex-start"
                      bg={activeSection === index ? "blue.50" : "transparent"}
                      color={activeSection === index ? accentColor : textColor}
                      _hover={{ bg: "blue.50" }}
                      borderRadius="md"
                      p={3}
                      onClick={() => {
                        setActiveSection(index);
                        onClose();
                      }}
                    >
                      <HStack spacing={3}>
                        <Icon as={section.icon} boxSize={5} />
                        <Text fontWeight="medium">{section.title}</Text>
                      </HStack>
                    </Button>
                  ))}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          flex={1}
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
          p={{ base: 6, md: 2 }}
          transition="all 0.3s ease"
        >
          <VStack spacing={1} align="stretch">
            <Box p={4}>
            <Heading
              as="h1"
              size={{ base: "sm", md: "md" }}
              color={textColor}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              bgGradient="linear(to-r, blue.500, teal.400)"
              bgClip="text"
            >
              Build Your Shop
            </Heading>
            </Box>
            <Divider borderColor={borderColor} opacity={0.5} />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={onSubmit}
            >
              {({ values, errors, setFieldValue, isSubmitting }) => (
                <Form>
                  <Box
                    // bgGradient={bgGradient}
                    borderRadius="xl"
                    p={{ base: 4, md: 6 }}
                    boxShadow="md"
                    transition="all 0.3s ease"
                    _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
                  >
                    {sections[activeSection].component({
                      values,
                      errors,
                      setFieldValue,
                      showError,
                    })}
                  </Box>
                  <Flex
                    justify={{ base: "space-between", md: "flex-end" }}
                    mt={{ base: 6, md: 8 }}
                    gap={4}
                    flexWrap="wrap"
                  >
                    {activeSection > 0 && (
                      <Button
                        size={{ base: "md", md: "lg" }}
                        px={{ base: 8, md: 12 }}
                        py={{ base: 6, md: 7 }}
                        onClick={() => setActiveSection(activeSection - 1)}
                        bgGradient="linear(to-r, gray.400, gray.500)"
                        color="white"
                        _hover={{
                          bgGradient: "linear(to-r, gray.500, gray.600)",
                          transform: "translateY(-2px)",
                        }}
                        _active={{
                          bgGradient: "linear(to-r, gray.600, gray.700)",
                          transform: "translateY(0)",
                        }}
                        borderRadius="full"
                        boxShadow="lg"
                        fontWeight="bold"
                        w={{ base: "full", sm: "auto" }}
                        transition="all 0.3s ease"
                      >
                        Previous
                      </Button>
                    )}
                    {activeSection < sections.length - 1 ? (
                      <Button
                        size={{ base: "md", md: "lg" }}
                        px={{ base: 8, md: 12 }}
                        py={{ base: 6, md: 7 }}
                        onClick={() => setActiveSection(activeSection + 1)}
                        bgGradient="linear(to-r, blue.500, teal.400)"
                        color="white"
                        _hover={{
                          bgGradient: "linear(to-r, blue.600, teal.500)",
                          transform: "translateY(-2px)",
                        }}
                        _active={{
                          bgGradient: "linear(to-r, blue.700, teal.600)",
                          transform: "translateY(0)",
                        }}
                        borderRadius="full"
                        boxShadow="lg"
                        fontWeight="bold"
                        w={{ base: "full", sm: "auto" }}
                        transition="all 0.3s ease"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size={{ base: "md", md: "lg" }}
                        px={{ base: 8, md: 12 }}
                        py={{ base: 6, md: 7 }}
                        isLoading={isSubmitting}
                        loadingText="Saving..."
                        onClick={() => setShowError(true)}
                        bgGradient="linear(to-r, blue.500, teal.400)"
                        color="white"
                        _hover={{
                          bgGradient: "linear(to-r, blue.600, teal.500)",
                          transform: "translateY(-2px)",
                        }}
                        _active={{
                          bgGradient: "linear(to-r, blue.700, teal.600)",
                          transform: "translateY(0)",
                        }}
                        borderRadius="full"
                        boxShadow="lg"
                        fontWeight="bold"
                        w={{ base: "full", sm: "auto" }}
                        transition="all 0.3s ease"
                        _disabled={{
                          opacity: 0.6,
                          cursor: "not-allowed",
                          transform: "none",
                        }}
                      >
                        Save Shop
                      </Button>
                    )}
                  </Flex>
                </Form>
              )}
            </Formik>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
});

export default ShopForm;