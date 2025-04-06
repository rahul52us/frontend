"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Heading,
  Flex,
  HStack,
  Divider,
  Center,
  Text,
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
  const {
    companyStore: { updateCompanyDetails },
    auth: { openNotification, user },
  } = stores;

  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { shopTitle } = useParams();
  const {
    shopStore: { getSingleShop },
  } = stores;

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const data = await getSingleShop({ title: user?.company?.name, status : user?.company?.shopStatus });

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
            ?  data.data.gallery.map(item => ({
                  file: item.file?.url ? [item.file] : [],
                  title: item.title || '',
                }))
            : []

          setInitialValues({
            ...initialValues,
            ...data?.data,
            coverImage: coverImage,
            logo: logo,
            gallery:gallery
          });
        }
      } catch ({}) {
        setError("Failed to fetch shop data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopTitle, getSingleShop]);

  const handleImageProcessing = async (imageFile : any, isAdd : any, isDeleted) => {
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
              const processedFile = await handleImageProcessing(item.file, true, false);
              return processedFile
                ? { file: processedFile, title: item.title }
                : null;
            } else {
              return { file: Array.isArray(item.file) ? item.file[0] : item.file , title: item.title };
            }
          })
      );

      formData.gallery = updatedGallery.filter(Boolean);

      updateCompanyDetails({...formData, _id : user?.company?._id, shopStatus : 'active'})
        .then((data: any) => {
          openNotification({
            title: "Successfully Updated",
            message: data.message,
            type: "success"
          });
          toast({
            title: "Shop Saved",
            description: "Your shop details have been updated successfully.",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        })
        .catch((err) => {
          openNotification({
            title: "Update Failed",
            message: err?.data?.message,
            type: getStatusType(err.status),
          });
          toast({
            title: "Error",
            description: err?.data?.message || "Failed to save shop details.",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        })
        .finally(() => setSubmitting(false));
    } catch ({}) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  if (loading) {
    return (
      <Center minH="80vh">
        <SpinnerLoader size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="80vh">
        <Text fontSize="lg" color="red.500">
          {error}
        </Text>
      </Center>
    );
  }

  return (
    <Box
      // maxW={{ base: "100%", md: "container.md", lg: "container.lg" }}
      mx="auto"
      // my={{ base: 6, md: 8 }}
      p={{ base: 3, md: 4 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
      border="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading
            as="h3"
            size={{ base: "sm", md: "sm" }}
            color="gray.800"
            fontWeight="bold"
            letterSpacing="wide"
            textTransform="uppercase"
            textAlign={{ base: "center", md: "left" }}
          >
            Create Your Shop
          </Heading>
        </HStack>
        <Divider borderColor="gray.300" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          {({ values, errors, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                <Tabs
                  variant="soft-rounded"
                  colorScheme="blue"
                  isLazy
                  bg="gray.50"
                  borderRadius="lg"
                  p={2}
                >
                  <TabList
                    overflowX={{ base: "scroll", md: "auto" }}
                    overflowY="hidden"
                    whiteSpace="nowrap"
                    position="sticky"
                    top={0}
                    bg="gray.50"
                    zIndex={1}
                    py={2}
                    px={1}
                    borderBottom="1px"
                    borderColor="gray.200"
                  >
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Shop Details
                    </Tab>
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Main Location
                    </Tab>
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Additional Locations
                    </Tab>
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Gallery
                    </Tab>
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Contact Info
                    </Tab>
                    <Tab
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      px={{ base: 4, md: 6 }}
                      py={2}
                      borderRadius="full"
                      _selected={{ bg: "blue.500", color: "white" }}
                      _hover={{ bg: "blue.100" }}
                    >
                      Operating Hours
                    </Tab>
                  </TabList>
                  <TabPanels
                    bg="white"
                    borderRadius="lg"
                    boxShadow="sm"
                    p={{ base: 2, md: 4 }}
                    mt={2}
                  >
                    <TabPanel>
                      <ShopDetailsSection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>
                    <TabPanel>
                      <MainLocationSection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>

                    <TabPanel>
                      <AdditionalLocationsSection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>
                    <TabPanel>
                      <GallerySection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ContactInfoSection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>
                    <TabPanel>
                      <OperatingHoursSection
                        values={values}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        showError={showError}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <Flex
                  justify={{ base: "center", md: "flex-end" }}
                  mt={{ base: 6, md: 8 }}
                  flexWrap="wrap"
                  gap={4}
                >
                  <Button
                    type="submit"
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 7 }}
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    onClick={() => setShowError(true)}
                    bgGradient="linear(to-r, blue.500, blue.600)"
                    color="white"
                    _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                    _active={{ bgGradient: "linear(to-r, blue.700, blue.800)" }}
                    borderRadius="full"
                    boxShadow="md"
                    fontWeight="bold"
                    w={{ base: "full", sm: "auto" }}
                  >
                    Save Shop
                  </Button>
                </Flex>
              </Form>
            );
          }}
        </Formik>
      </VStack>
    </Box>
  );
});

export default ShopForm;
