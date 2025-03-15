"use client";

import React, { useState } from "react";
import { Formik, FieldArray, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  VStack,
  Button,
  IconButton,
  Grid,
  GridItem,
  HStack,
  Text,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";
import {
  readFileAsBase64,
  removeDataByIndex,
} from "../../../config/utils/utils";
import stores from "../../../store/stores";
import { getStatusType } from "../../../component/config/utils/function";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
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
  operatingHours: Yup.object({
    monday: Yup.string().optional(),
    tuesday: Yup.string().optional(),
    wednesday: Yup.string().optional(),
    thursday: Yup.string().optional(),
    friday: Yup.string().optional(),
    saturday: Yup.string().optional(),
    sunday: Yup.string().optional(),
  }),
});

const ShopForm = observer(() => {
  const [showError, setShowError] = useState(false);
  const {
    companyStore: { updateCompanyDetails },
    auth: { openNotification },
  } = stores;

  const initialValues = {
    name: "",
    description: "",
    logo: { file: [] },
    coverImage: { file: [] },
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      coordinates: [0, 0],
    },
    multipleLocations: [
      {
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        coordinates: [0, 0], // [longitude, latitude]
      },
    ],
    contactInfo: {
      phone: "",
      email: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
      },
    },
    operatingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
  }


  return (
    <Box
      p={{ base: 4, md: 8 }}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData: any = {
              ...values,
            };
            if (
              formData?.logo?.file &&
              formData?.logo?.file?.length !== 0 &&
              formData?.logo?.isAdd
            ) {
              const buffer = await readFileAsBase64(formData?.logo?.file);
              const fileData = {
                buffer: buffer,
                filename: formData?.logo?.file?.name,
                type: formData?.logo?.file?.type,
                isDeleted: formData?.logo?.isDeleted || 0,
                isAdd: formData?.logo?.isAdd || 0,
              };
              formData.logo = fileData;
            } else {
              if (formData?.logo?.isDeleted) {
                const fileData = {
                  isDeleted: formData?.logo?.isDeleted || 0,
                  isAdd: formData?.logo?.isAdd || 0,
                };
                formData.logo = fileData;
              }
            }

            if (
              formData?.coverImage?.file &&
              formData?.coverImage?.file?.length !== 0 &&
              formData?.coverImage?.isAdd
            ) {
              const buffer = await readFileAsBase64(formData?.coverImage?.file);
              const fileData = {
                buffer: buffer,
                filename: formData?.coverImage?.file?.name,
                type: formData?.coverImage?.file?.type,
                isDeleted: formData?.coverImage?.isDeleted || 0,
                isAdd: formData?.coverImage?.isAdd || 0,
              };
              formData.coverImage = fileData;
            } else {
              if (formData?.coverImage?.isDeleted) {
                const fileData = {
                  isDeleted: formData?.coverImage?.isDeleted || 0,
                  isAdd: formData?.coverImage?.isAdd || 0,
                };
                formData.coverImage = fileData;
              }
            }

            updateCompanyDetails(formData)
              .then((data: any) => {
                openNotification({
                  title: "Successfully Updated",
                  message: `${data.message}`,
                  type: "success",
                });
              })
              .catch((err: any) => {
                openNotification({
                  title: "Update Failed",
                  message: err?.data?.message,
                  type: getStatusType(err.status),
                });
              })
              .finally(() => {
                setSubmitting(false);
              });
          } catch ({}) {
            // console.error("Error creating shop:", error);
          }
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }: any) => (
          <Form>
            <VStack spacing={8} align="stretch">
              {/* Shop Details */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
                  Shop Details
                </Text>
                <Flex mt={4} mb={6}>
                  {values?.logo?.file?.length === 0 ? (
                    <CustomInput
                      type="file-drag"
                      name="logo"
                      value={values.logo}
                      isMulti={true}
                      accept="image/*"
                      onChange={(e: any) => {
                        setFieldValue("logo", {
                          ...values.logo,
                          file: e.target.files[0],
                          isAdd: 1,
                        });
                      }}
                      showError={showError}
                      error={errors.logo}
                    />
                  ) : (
                    <Box mt={-5} width="100%">
                      <ShowFileUploadFile
                        files={values.logo?.file}
                        removeFile={() => {
                          setFieldValue("logo", {
                            ...values.logo,
                            file: removeDataByIndex(values.logo, 0),
                            isDeleted: 1,
                          });
                        }}
                        edit={true}
                      />
                    </Box>
                  )}
                </Flex>
                <VStack spacing={4}>
                  <CustomInput
                    label="Shop Name"
                    name="name"
                    required
                    error={errors.name}
                    value={values.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    showError={showError}
                  />
                  <CustomInput
                    label="Description"
                    name="description"
                    type="textarea"
                    required
                    error={errors.description}
                    value={values.description}
                    onChange={(e) =>
                      setFieldValue("description", e.target.value)
                    }
                    showError={showError}
                  />
                  <Flex mt={4} width="100%">
                    {values?.coverImage?.file?.length === 0 ? (
                      <CustomInput
                        type="file-drag"
                        name="coverImage"
                        value={values.coverImage}
                        isMulti={true}
                        accept="image/*"
                        onChange={(e: any) => {
                          setFieldValue("coverImage", {
                            ...values.coverImage,
                            file: e.target.files[0],
                            isAdd: 1,
                          });
                        }}
                        showError={showError}
                        error={errors.coverImage}
                      />
                    ) : (
                      <Box width="100%">
                        <ShowFileUploadFile
                          files={values.coverImage?.file}
                          removeFile={() => {
                            setFieldValue("coverImage", {
                              ...values.coverImage,
                              file: removeDataByIndex(values.coverImage, 0),
                              isDeleted: 1,
                            });
                          }}
                          edit={true}
                        />
                      </Box>
                    )}
                  </Flex>
                </VStack>
              </Box>

              <Divider borderColor="gray.300" />

              {/* Main Shop Location */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
                  Main Shop Location
                </Text>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Address"
                      name="location.address"
                      required
                      error={errors.location?.address}
                      value={values.location.address}
                      onChange={(e) =>
                        setFieldValue("location.address", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="City"
                      name="location.city"
                      required
                      error={errors.location?.city}
                      value={values.location.city}
                      onChange={(e) =>
                        setFieldValue("location.city", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="State"
                      name="location.state"
                      required
                      error={errors.location?.state}
                      value={values.location.state}
                      onChange={(e) =>
                        setFieldValue("location.state", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Postal Code"
                      name="location.postalCode"
                      required
                      error={errors.location?.postalCode}
                      value={values.location.postalCode}
                      onChange={(e) =>
                        setFieldValue("location.postalCode", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Country"
                      name="location.country"
                      required
                      error={errors.location?.country}
                      value={values.location.country}
                      onChange={(e) =>
                        setFieldValue("location.country", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Longitude"
                      name="location.coordinates[0]"
                      required
                      error={errors.location?.coordinates?.[0]}
                      value={values.location.coordinates[0]}
                      onChange={(e) =>
                        setFieldValue("location.coordinates[0]", e.target.value)
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Latitude"
                      name="location.coordinates[1]"
                      required
                      error={errors.location?.coordinates?.[1]}
                      value={values.location.coordinates[1]}
                      onChange={(e) =>
                        setFieldValue("location.coordinates[1]", e.target.value)
                      }
                    />
                  </GridItem>
                </Grid>
              </Box>

              <Divider borderColor="gray.300" />

              {/* Additional Locations */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
                  Additional Locations
                </Text>
                <FieldArray name="multipleLocations">
                  {({ push, remove }) => (
                    <VStack spacing={6} align="stretch">
                      {values.multipleLocations.map((location, index) => (
                        <Box
                          key={index}
                          p={4}
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="md"
                          bg="gray.50"
                        >
                          <HStack justify="space-between" mb={4}>
                            <Text
                              fontSize="lg"
                              fontWeight="semibold"
                              color="teal.500"
                            >
                              Location {index + 1}
                            </Text>
                            <IconButton
                              aria-label="Remove Location"
                              icon={<FaMinus />}
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              onClick={() => remove(index)}
                            />
                          </HStack>
                          <Grid
                            templateColumns={{
                              base: "1fr",
                              md: "repeat(2, 1fr)",
                            }}
                            gap={6}
                          >
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="Address"
                                name={`multipleLocations[${index}].address`}
                                required
                                error={
                                  errors.multipleLocations?.[index]?.address
                                }
                                value={location.address}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].address`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="City"
                                name={`multipleLocations[${index}].city`}
                                required
                                error={errors.multipleLocations?.[index]?.city}
                                value={location.city}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].city`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="State"
                                name={`multipleLocations[${index}].state`}
                                required
                                error={errors.multipleLocations?.[index]?.state}
                                value={location.state}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].state`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="Postal Code"
                                name={`multipleLocations[${index}].postalCode`}
                                required
                                error={
                                  errors.multipleLocations?.[index]?.postalCode
                                }
                                value={location.postalCode}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].postalCode`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="Country"
                                name={`multipleLocations[${index}].country`}
                                required
                                error={
                                  errors.multipleLocations?.[index]?.country
                                }
                                value={location.country}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].country`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="Longitude"
                                name={`multipleLocations[${index}].coordinates[0]`}
                                required
                                error={
                                  errors.multipleLocations?.[index]
                                    ?.coordinates?.[0]
                                }
                                value={location.coordinates[0]}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].coordinates[0]`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                            <GridItem>
                              <CustomInput
                                showError={showError}
                                label="Latitude"
                                name={`multipleLocations[${index}].coordinates[1]`}
                                required
                                error={
                                  errors.multipleLocations?.[index]
                                    ?.coordinates?.[1]
                                }
                                value={location.coordinates[1]}
                                onChange={(e) =>
                                  setFieldValue(
                                    `multipleLocations[${index}].coordinates[1]`,
                                    e.target.value
                                  )
                                }
                              />
                            </GridItem>
                          </Grid>
                        </Box>
                      ))}
                      <Button
                        leftIcon={<FaPlus />}
                        colorScheme="teal"
                        variant="outline"
                        size="md"
                        w="fit-content"
                        onClick={() =>
                          push({
                            address: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            country: "",
                            coordinates: [0, 0], // [longitude, latitude]
                          })
                        }
                      >
                        Add Location
                      </Button>
                    </VStack>
                  )}
                </FieldArray>
              </Box>

              <Divider borderColor="gray.300" />

              {/* Contact Information */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
                  Contact Information
                </Text>
                <VStack spacing={4}>
                  <CustomInput
                    showError={showError}
                    label="Phone"
                    name="contactInfo.phone"
                    required
                    error={errors.contactInfo?.phone}
                    value={values.contactInfo.phone}
                    onChange={(e) =>
                      setFieldValue("contactInfo.phone", e.target.value)
                    }
                  />
                  <CustomInput
                    showError={showError}
                    label="Email"
                    name="contactInfo.email"
                    type="text"
                    error={errors.contactInfo?.email}
                    value={values.contactInfo.email}
                    onChange={(e) =>
                      setFieldValue("contactInfo.email", e.target.value)
                    }
                  />
                  <CustomInput
                    showError={showError}
                    label="Website"
                    name="contactInfo.website"
                    type="url"
                    error={errors.contactInfo?.website}
                    value={values.contactInfo.website}
                    onChange={(e) =>
                      setFieldValue("contactInfo.website", e.target.value)
                    }
                  />
                </VStack>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color="teal.500"
                  mt={6}
                  mb={4}
                >
                  Social Media Links
                </Text>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Facebook"
                      name="contactInfo.socialMedia.facebook"
                      type="url"
                      error={errors.contactInfo?.socialMedia?.facebook}
                      value={values.contactInfo.socialMedia.facebook}
                      onChange={(e) =>
                        setFieldValue(
                          "contactInfo.socialMedia.facebook",
                          e.target.value
                        )
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Instagram"
                      name="contactInfo.socialMedia.instagram"
                      type="url"
                      error={errors.contactInfo?.socialMedia?.instagram}
                      value={values.contactInfo.socialMedia.instagram}
                      onChange={(e) =>
                        setFieldValue(
                          "contactInfo.socialMedia.instagram",
                          e.target.value
                        )
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="Twitter"
                      name="contactInfo.socialMedia.twitter"
                      type="url"
                      error={errors.contactInfo?.socialMedia?.twitter}
                      value={values.contactInfo.socialMedia.twitter}
                      onChange={(e) =>
                        setFieldValue(
                          "contactInfo.socialMedia.twitter",
                          e.target.value
                        )
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="LinkedIn"
                      name="contactInfo.socialMedia.linkedin"
                      type="url"
                      error={errors.contactInfo?.socialMedia?.linkedin}
                      value={values.contactInfo.socialMedia.linkedin}
                      onChange={(e) =>
                        setFieldValue(
                          "contactInfo.socialMedia.linkedin",
                          e.target.value
                        )
                      }
                    />
                  </GridItem>
                  <GridItem>
                    <CustomInput
                      showError={showError}
                      label="YouTube"
                      name="contactInfo.socialMedia.youtube"
                      type="url"
                      error={errors.contactInfo?.socialMedia?.youtube}
                      value={values.contactInfo.socialMedia.youtube}
                      onChange={(e) =>
                        setFieldValue(
                          "contactInfo.socialMedia.youtube",
                          e.target.value
                        )
                      }
                    />
                  </GridItem>
                </Grid>
              </Box>

              <Divider borderColor="gray.300" />

              {/* Operating Hours */}
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={4}>
                  Operating Hours
                </Text>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <GridItem key={day}>
                      <CustomInput
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                        name={`operatingHours.${day}`}
                        value={values.operatingHours[day]}
                        showError={showError}
                        onChange={(e) =>
                          setFieldValue(`operatingHours.${day}`, e.target.value)
                        }
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w={{ base: "full", md: "fit-content" }}
                alignSelf="flex-end"
                mt={6}
                px={8}
                onClick={() => setShowError(true)}
                isLoading={isSubmitting}
              >
                Create Shop
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
});

export default ShopForm;