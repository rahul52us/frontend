"use client";

import React from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import CustomInput from "../../component/config/component/customInput/CustomInput";

const MotionVStack = motion(VStack);

interface SignupValues {
  name: string;
  email?: string;
  phone: string;
  category: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email address").optional(),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  category: Yup.string().required("Category is required"),
});

const categories = [
  { label: "Technology", value: "Technology" },
  { label: "Business", value: "Business" },
  { label: "Health", value: "Health" },
  { label: "Education", value: "Education" },
  { label: "Other", value: "Other" },
];

const SignupForm: React.FC = () => {
  const initialValues: SignupValues = {
    name: "",
    email: "",
    phone: "",
    category: "",
  };

  const handleSubmit = (values: SignupValues, actions: any) => {
    console.log("Signup values:", values);
    actions.setSubmitting(false);
    actions.resetForm();
  };

  // Dynamic colors based on color mode
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      px={{ base: 4, md: 0 }}
      py={{ base: 4, md: 0 }}
      w="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >

      <MotionVStack
        spacing={{ base: 4, md: 2 }}
        align="stretch"
        maxW="100%"
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        p={{ base: 6, md: 8 }}
        borderRadius="lg"
        boxShadow={{ base: "md", "md": "lg" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box textAlign="center" mb={{ base: 2, md: 2 }}>
          <Heading
            size={{ base: "lg", md: "xl" }}
            fontWeight="extrabold"
            color={labelColor}
            bgGradient="linear(to-r, green.500, green.300)"
            bgClip="text"
          >
            Join BusinessSahayata
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color={textColor} mt={2}>
            Sign up to unlock your business potential
          </Text>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue, errors }) => {
            return(
            <Form>
              <VStack spacing={{ base: 4, md: 4 }}>
                {/* Name Field */}
                <CustomInput
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your name"
                  required
                  labelcolor={labelColor}
                  value={values.name}
                  error={errors.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("name", e.target.value)
                  }
                  style={{
                    backgroundColor: inputBg,
                    borderColor: "gray.200",
                    borderRadius: "md",
                    boxShadow: "sm",
                    transition: "all 0.2s",
                  }}
                  showError
                />

                {/* Email Field */}
                <CustomInput
                  type="text"
                  name="email"
                  label="Email (Optional)"
                  placeholder="Enter your email"
                  labelcolor={labelColor}
                  value={values.email}
                  error={errors.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.value)
                    setFieldValue("email", e.target.value)
                  }
                  }
                  style={{
                    backgroundColor: inputBg,
                    borderColor: "gray.200",
                    borderRadius: "md",
                    boxShadow: "sm",
                    transition: "all 0.2s",
                  }}
                  showError
                />

                {/* Phone Field */}
                <CustomInput
                  type="number"
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter 10-digit phone"
                  required
                  error={errors.phone}
                  labelcolor={labelColor}
                  value={values.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("phone", e.target.value)
                  }
                  style={{
                    backgroundColor: inputBg,
                    borderColor: "gray.200",
                    borderRadius: "md",
                    boxShadow: "sm",
                    transition: "all 0.2s",
                  }}
                  showError
                />

                {/* Category Field */}
                <CustomInput
                  type="select"
                  name="category"
                  label="Business Category"
                  placeholder="Select your category"
                  required
                  labelcolor={labelColor}
                  error={errors.category}
                  options={categories}
                  value={categories.find((cat) => cat.value === values.category)}
                  onChange={(option: any) =>
                    setFieldValue("category", option ? option.value : "")
                  }
                  isSearchable={false}
                  style={{
                    backgroundColor: inputBg,
                    borderColor: "gray.200",
                    borderRadius: "md",
                    boxShadow: "sm",
                    transition: "all 0.2s",
                  }}
                  showError
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  bgGradient="linear(to-r, green.500, green.600)"
                  color="white"
                  size={{ base: "md", md: "lg" }}
                  isLoading={isSubmitting}
                  width="full"
                  mt={{ base: 4, md: 6 }}
                  fontWeight="bold"
                  rounded="md"
                  boxShadow="md"
                  _hover={{
                    bgGradient: "linear(to-r, green.600, green.700)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.3s"
                >
                  Sign Up Now
                </Button>
              </VStack>
            </Form>
          )}}
        </Formik>
      </MotionVStack>
    </Box>
  );
};

export default SignupForm;