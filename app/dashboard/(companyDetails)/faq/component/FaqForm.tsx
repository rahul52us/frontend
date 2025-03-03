"use client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Grid,
  GridItem,
  Flex,
  DrawerCloseButton,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, FieldArray, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";
import stores from "../../../../store/stores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const FAQForm = observer(({ initialData, onSubmit, isOpen, onClose }: any) => {
  const {
    companyStore: { companyDetails },
  } = stores;
  const [initialFaqs, setInitialFaqs] = useState([])

  useEffect(() => {
    setInitialFaqs(companyDetails?.faq || [{ title: "", paragraph: "" }])
  },[companyDetails]
)
  const validationSchema = Yup.object({
    faqs: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().required("Title is required"),
          paragraph: Yup.string().required("Paragraph is required"),
        })
      )
      .min(1, "At least one FAQ is required"),
  });

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent w="70%" maxW="70%" boxShadow="xl" borderRadius="lg">
        <DrawerCloseButton />
        <DrawerHeader
          bg="teal.500"
          color="white"
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, blue.400, purple.400)"
        >
          {initialData?.username ? "Edit FAQ" : "Add FAQ"}
        </DrawerHeader>

        <DrawerBody>
          <Formik
            initialValues={{
              faqs:initialFaqs
            }}
            validationSchema={validationSchema}
            onSubmit={async (values: any) => {
              onSubmit(values);
            }}
            enableReinitialize={true}
          >
            {({
              values,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              errors,
              touched,
            }: any) => (
              <FormikForm onSubmit={handleSubmit}>
                <FieldArray name="faqs">
                  {({ remove, push }: any) => (
                    <>
                      {values.faqs.map((faq, index) => (
                        <Box
                          key={index}
                          mb={6}
                          p={4}
                          borderRadius="md"
                          boxShadow="sm"
                          bg="gray.50"
                        >
                          <Grid
                            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                            gap={6}
                          >
                            {/* Title Input */}
                            <GridItem colSpan={2}>
                              <FormControl
                                isInvalid={
                                  errors?.faqs?.[index]?.title &&
                                  touched?.faqs?.[index]?.title
                                }
                              >
                                <CustomInput
                                  label={`FAQ Title ${index + 1}`}
                                  name={`faqs[${index}].title`}
                                  placeholder="Enter FAQ Title"
                                  value={faq.title}
                                  onChange={(e: any) =>
                                    setFieldValue(
                                      `faqs[${index}].title`,
                                      e.target.value
                                    )
                                  }
                                />
                                <FormErrorMessage>
                                  {errors?.faqs?.[index]?.title}
                                </FormErrorMessage>
                              </FormControl>
                            </GridItem>

                            {/* Paragraph Input */}
                            <GridItem colSpan={2}>
                              <FormControl
                                isInvalid={
                                  errors?.faqs?.[index]?.paragraph &&
                                  touched?.faqs?.[index]?.paragraph
                                }
                              >
                                <CustomInput
                                  label={`FAQ Paragraph ${index + 1}`}
                                  name={`faqs[${index}].paragraph`}
                                  placeholder="Enter FAQ Paragraph"
                                  value={faq.paragraph}
                                  onChange={(e: any) =>
                                    setFieldValue(
                                      `faqs[${index}].paragraph`,
                                      e.target.value
                                    )
                                  }
                                  type="textarea"
                                />
                                <FormErrorMessage>
                                  {errors?.faqs?.[index]?.paragraph}
                                </FormErrorMessage>
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* Remove FAQ Button */}
                          {values.faqs.length > 1 && (
                            <Button
                              colorScheme="red"
                              onClick={() => remove(index)}
                              size="sm"
                              mt={4}
                              variant="outline"
                            >
                              Remove FAQ
                            </Button>
                          )}
                        </Box>
                      ))}

                      {/* Add FAQ Button */}
                      <Button
                        colorScheme="teal"
                        onClick={() => push({ title: "", paragraph: "" })}
                        size="sm"
                        variant="solid"
                      >
                        Add FAQ
                      </Button>
                    </>
                  )}
                </FieldArray>

                <Flex justifyContent="flex-end" mt={6} gap={4}>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={onClose}
                    _hover={{ bg: "red.500" }}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    size="lg"
                    _hover={{ bg: "teal.500" }}
                  >
                    {initialData?.username ? "Update FAQ" : "Add FAQ"}
                  </Button>
                </Flex>
              </FormikForm>
            )}
          </Formik>
        </DrawerBody>

        <DrawerFooter>
          {/* Any additional buttons or actions can go here */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

export default FAQForm;
