'use client';
import {  Button, Flex, VStack, Stack, Card, SimpleGrid, Box } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Form, Formik } from "formik";
import { useState } from "react";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import testimonialValidation from "../utils/validation";
import { removeDataByIndex } from "../../../config/utils/utils";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";

interface TestimonialFormProps {
  initialValues: { name: string; profession: string; description: string; image?: any };
  onSubmit: any;
  close: () => void;
  isEdit?:boolean
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ initialValues, onSubmit, close, isEdit }) => {
  const [showError, setShowError] = useState(false);

  return (
    <Card p={8} borderRadius={10} bg="white" boxShadow="lg">
      <Formik
        initialValues={initialValues}
        validationSchema={testimonialValidation}
        onSubmit={(values, actions) => {
          onSubmit({ ...values }, actions);
        }}
      >
        {({ handleChange, values, errors, isSubmitting, setFieldValue } : any) => (
          <Form>
            <VStack spacing={6} align="center">
              {/* Image Upload Section */}
              <Stack direction="column" align="center">
              <Flex>
                  {values?.image?.file?.length === 0 ? (
                    <CustomInput
                      type="file-drag"
                      name="image"
                      value={values.image}
                      isMulti={true}
                      accept="image/*"
                      onChange={(e: any) => {
                        setFieldValue("image", {
                          ...values.image,
                          file: e.target.files[0],
                          isAdd: 1,
                        });
                      }}
                      showError={showError}
                      error={errors.image}
                    />
                  ) : (
                    <Box mt={-5} width="100%">
                      <ShowFileUploadFile
                        files={values.image?.file}
                        removeFile={() => {
                          setFieldValue("image", {
                            ...values.image,
                            file: removeDataByIndex(values.image, 0),
                            isDeleted: 1,
                          });
                        }}
                        edit={isEdit}
                      />
                    </Box>
                  )}
                </Flex>
              </Stack>

              {/* Form Fields */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <CustomInput
                  name="name"
                  placeholder="Enter the Name"
                  label="Name"
                  onChange={handleChange}
                  value={values.name}
                  error={errors.name}
                  showError={showError}
                />
                <CustomInput
                  name="profession"
                  placeholder="Write Your Profession"
                  label="Profession"
                  onChange={handleChange}
                  value={values.profession}
                  error={errors.profession}
                  showError={showError}
                />
              </SimpleGrid>

              {/* Description Field */}
              <CustomInput
                name="description"
                placeholder="Description"
                label="Description"
                type="textarea"
                error={errors.description}
                onChange={handleChange}
                value={values.description}
                rows={4}
                showError={showError}
              />

              {/* Action Buttons */}
              <Flex justifyContent="end" w="full" mt={4}>
                <Button leftIcon={<FaTimes />} mr={3} onClick={close} variant="outline" colorScheme="red">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  leftIcon={<FaCheck />}
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  onClick={() => setShowError(true)}
                >
                  Save
                </Button>
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default TestimonialForm;