import {
  SimpleGrid,
  Button,
  Box,
  Grid,
  GridItem,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import {
  insertUniqueFile,
  removeDataByIndex,
} from "../../../config/utils/utils";
import ShowFileUploadFile from "../../../component/common/ShowFileUploadFile/ShowFileUploadFile";

const Form = ({
  initialData,
  onSubmit,
  isOpen,
  onClose,
  thumbnail,
  setThumbnail,
}: any) => {
  const [formData, setFormData] = useState<any>({
    title: "",
    name: "",
    username: "",
    experience: "",
    expertise: [],
    availability: undefined,
    time: "",
    link:"",
    charges: "",
    bio: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    code: "",
    qualifications: "",
    professionalInfo: "",
    pic: undefined,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validationSchema = Yup.object({
    title: Yup.mixed().required("Title is required"),
    link: Yup.mixed().required("Link is required"),
    pic: Yup.mixed(),
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    expertise: Yup.array()
      .min(1, "At least one expertise tag is required")
      .required("Expertise is required"),
    time: Yup.string().required("Time is required"),
    charges: Yup.number()
      .required("Charges are required")
      .positive("Charges must be a positive number")
      .typeError("Charges must be a valid number"),
    bio: Yup.string().required("Bio is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    phoneNumber: Yup.string()
      .matches(
        /^(?:\+?[0-9]{1,3})?[-.\s]?[0-9]{10}$/,
        "Phone number is not valid"
      )
      .required("Phone number is required"),
    code: Yup.string().optional(),
    qualifications: Yup.string().required("Qualifications are required"),
    professionalInfo: Yup.string().required(
      "Professional Information is required"
    ),
  });

  return (
    isOpen && (
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={async (values: any) => {
          onSubmit(values);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
          touched,
        }: any) => {


          return (
            <FormikForm onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="space-between" mb={4}>
                <Text fontSize="lg" fontWeight="semibold">
                  {initialData?.username ? "Edit Therapist" : "Add Therapist"}
                </Text>
                <Button colorScheme="red" size="sm" onClick={onClose}>
                  Close
                </Button>
              </Box>

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={6}
                mb={6}
                alignItems="center"
              >
                {/* Section 1: Personal Info */}
                <GridItem colSpan={2}>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Personal Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {thumbnail.length === 0 ? (
                      <CustomInput
                        type="file-drag"
                        name="thumbnail"
                        value={thumbnail}
                        isMulti={false}
                        onChange={(e: any) => {
                          insertUniqueFile(
                            setThumbnail,
                            thumbnail,
                            e.target.files
                          );
                        }}
                      />
                    ) : (
                      <Box mt={-3} mb={3}>
                        <ShowFileUploadFile
                          files={thumbnail}
                          removeFile={(_: any, index: number) =>
                            setThumbnail(removeDataByIndex(thumbnail, index))
                          }
                        />
                      </Box>
                    )}{" "}
                    <CustomInput
                      label="Title"
                      name="title"
                      type="select"
                      options={[
                        { label: "Mr.", value: "Mr." },
                        { label: "Mrs.", value: "Mrs." },
                        { label: "Ms.", value: "Ms." },
                        { label: "Dr.", value: "Dr." },
                      ]}
                      value={values.title}
                      onChange={(e: any) => setFieldValue("title", e)}
                      error={errors.title && touched.title}
                      showError={errors.title && touched.title}
                    />
                    <CustomInput
                      label="Name"
                      name="name"
                      placeholder="Enter Name"
                      value={values.name}
                      onChange={handleChange}
                      error={errors.name && touched.name}
                      showError={errors.name && touched.name}
                    />
                    <CustomInput
                      label="Username"
                      name="username"
                      placeholder="Enter Username"
                      value={values.username}
                      onChange={handleChange}
                      error={errors.username && touched.username}
                      showError={errors.username && touched.username}
                    />
                    <CustomInput
                      label="Phone Number"
                      name="phoneNumber"
                      type="text"
                      placeholder="Enter Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      error={errors.phoneNumber && touched.phoneNumber}
                      showError={errors.phoneNumber && touched.phoneNumber}
                    />
                    <CustomInput
                      label="Code"
                      name="code"
                      placeholder="Enter Code"
                      value={values.code}
                      onChange={handleChange}
                      error={errors.code && touched.code}
                      showError={errors.code && touched.code}
                    />
                    <CustomInput
                      label="Link"
                      name="link"
                      placeholder="Enter Name"
                      value={values.link}
                      onChange={handleChange}
                      error={errors.link && touched.link}
                      showError={errors.link && touched.link}
                    />
                    <CustomInput
                      label="Bio"
                      name="bio"
                      type="textarea"
                      placeholder="Enter Bio"
                      value={values.bio}
                      onChange={handleChange}
                      error={errors.bio && touched.bio}
                      showError={errors.bio && touched.bio}
                      style={{ width: "100%" }} // Ensures bio takes 100% width
                    />
                  </SimpleGrid>
                </GridItem>

                {/* Section 2: Professional Info */}
                <GridItem colSpan={2}>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Professional Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <CustomInput
                      label="Experience"
                      name="experience"
                      placeholder="Enter Experience"
                      value={values.experience}
                      onChange={handleChange}
                      error={errors.experience && touched.experience}
                      showError={errors.experience && touched.experience}
                    />
                    <CustomInput
                      label="Expertise"
                      name="expertise"
                      placeholder="Add Expertise"
                      value={values.expertise}
                      onChange={(newTags: any) =>
                        setFieldValue("expertise", newTags)
                      }
                      type="tags"
                      error={errors.expertise && touched.expertise}
                      showError={errors.expertise && touched.expertise}
                    />
                    <CustomInput
                      label="Qualifications"
                      name="qualifications"
                      placeholder="Enter Qualifications"
                      value={values.qualifications}
                      onChange={handleChange}
                      error={errors.qualifications && touched.qualifications}
                      showError={
                        errors.qualifications && touched.qualifications
                      }
                    />
                    <CustomInput
                      label="Charges"
                      name="charges"
                      placeholder="Enter Charges"
                      value={values.charges}
                      onChange={handleChange}
                      error={errors.charges && touched.charges}
                      showError={errors.charges && touched.charges}
                    />
                    <CustomInput
                      label="Professional Information"
                      name="professionalInfo"
                      placeholder="Enter Professional Information"
                      value={values.professionalInfo}
                      onChange={handleChange}
                      error={
                        errors.professionalInfo && touched.professionalInfo
                      }
                      showError={
                        errors.professionalInfo && touched.professionalInfo
                      }
                    />
                  </SimpleGrid>
                </GridItem>

                {/* Section 3: Availability and Password */}
                <GridItem colSpan={2}>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Availability & Authentication
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <CustomInput
                      label="Availability"
                      name="availability"
                      placeholder="Add Availability"
                      value={values.availability}
                      onChange={(newTags: any) =>
                        setFieldValue("availability", newTags)
                      }
                      type="select"
                      isMulti
                      options={[
                        { label: "Online", value: "online" },
                        { label: "In-Person", value: "inPerson" },
                      ]}
                      error={errors.availability && touched.availability}
                      showError={errors.availability && touched.availability}
                    />
                    <CustomInput
                      label="Time"
                      name="time"
                      placeholder="Enter Time (e.g., 9 AM, 3:30 PM)"
                      value={values.time}
                      onChange={handleChange}
                      error={errors.time && touched.time}
                      showError={errors.time && touched.time}
                    />
                    <CustomInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      value={values.password}
                      onChange={handleChange}
                      error={errors.password && touched.password}
                      showError={errors.password && touched.password}
                    />
                    <CustomInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword && touched.confirmPassword}
                      showError={
                        errors.confirmPassword && touched.confirmPassword
                      }
                    />
                  </SimpleGrid>
                </GridItem>
              </Grid>

              <Flex justifyContent="flex-end" mt={4}>
                <Flex gap={4}>
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={onClose}
                    _hover={{ bg: "red.500" }}
                    width="auto" // Use auto width for the close button to avoid stretching
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
                    width="auto" // Same for the submit button, ensuring it doesn't stretch
                  >
                    {initialData?.username ? "Update" : "Add"} Therapist
                  </Button>
                </Flex>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    )
  );
};

export default Form;