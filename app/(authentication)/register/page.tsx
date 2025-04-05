"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  Fade,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import CustomInput from "../../component/config/component/customInput/CustomInput";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import { getStatusType } from "../../component/config/utils/function";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const signupSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  companyName: Yup.string().min(3,'Company Name minium should of 3 character').required("Company Name is required").trim(),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  category: Yup.string().required("Category is required"),
});

const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const categories = [
  { label: "Technology", value: "Technology" },
  { label: "Business", value: "Business" },
  { label: "Health", value: "Health" },
  { label: "Education", value: "Education" },
  { label: "Other", value: "Other" },
];

const SignupForm = observer(() => {
  const {
    auth: { register, verifyRegisterOtp, openNotification },
  } = stores;
  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState({ form: false, otp: false });
  const [signInfo, setSignInfo] = useState(null);
  const [otpTimer, setOtpTimer] = useState(60);
  const router = useRouter();

  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const buttonGradient = "linear(to-r, blue.500, purple.600)"; // Matching LoginForm

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("signInfo");
    const savedStep = sessionStorage.getItem("step");
    if (savedInfo) setSignInfo(JSON.parse(savedInfo));
    if (savedStep) setStep(parseInt(savedStep, 10));
  }, []);

  useEffect(() => {
    if (step === 2 && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, otpTimer]);

  const handleSignupSubmit = (values, actions) => {
    register(values)
      .then((dt) => {
        openNotification({
          title: "OTP Sent",
          message: `OTP sent to ${values.phone}`,
          type: "success",
        });
        setSignInfo({ ...values, token: dt?.token });
        sessionStorage.setItem("signInfo", JSON.stringify({ ...values, token: dt?.token }));
        sessionStorage.setItem("step", "2");
        setStep(2);
        setOtpTimer(60);
      })
      .catch((err) => {
        openNotification({
          title: "Signup Failed",
          message: err.message,
          type: getStatusType(err?.statusCode),
        });
      })
      .finally(() => actions.setSubmitting(false));
  };

  const handleOtpSubmit = (values : any, actions : any) => {
    verifyRegisterOtp({ ...values, token: signInfo?.token })
      .then(() => {
        openNotification({
          title: "Signup Successful",
          message: "Welcome to BusinessSahayata!",
          type: "success",
        });
        sessionStorage.clear();
        router.push("/dashboard/shop");
      })
      .catch((err) => {
        openNotification({
          title: "Invalid OTP",
          message: err.message,
          type: getStatusType(err?.statusCode),
        });
      })
      .finally(() => actions.setSubmitting(false));
  };

  return (
    <Box overflow={'hidden'}>
      <Fade in>
        <MotionCard
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          bg={cardBg}
          borderRadius="3xl"
          boxShadow="2xl"
          overflow="hidden"
          border="1px"
          borderColor={useColorModeValue("gray.100", "gray.700")}
        >
          <Box bgGradient={buttonGradient} h="8px" width="100%" />
          <CardBody p={{ base: 6, md: 10 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <VStack spacing={4}>
                <Heading
                  size={{ base: "lg", md: "xl" }}
                  fontWeight="extrabold"
                  textAlign="center"
                  color={headingColor}
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip="text"
                >
                  {step === 1 ? "Join BusinessSahayata" : "Verify Your OTP"}
                </Heading>
                <Text
                  textAlign="center"
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                  maxW="sm"
                >
                  {step === 1
                    ? "Sign up to unlock your business potential"
                    : `A 6-digit OTP was sent to ${signInfo?.phone?.slice(0, 2)}******${signInfo?.phone?.slice(-2)}`}
                </Text>
                <Formik
                  initialValues={
                    step === 1
                      ? { name: "", email: "", phone: "", category: "", companyName: "edukateus" }
                      : { otp: "" }
                  }
                  validationSchema={step === 1 ? signupSchema : otpSchema}
                  onSubmit={step === 1 ? handleSignupSubmit : handleOtpSubmit}
                >
                  {({ values, isSubmitting, setFieldValue, errors } : any) => (
                    <Form style={{ width: "100%" }}>
                      <VStack spacing={6} width="full">
                        {step === 1 ? (
                          <>
                            <CustomInput
                              type="text"
                              name="name"
                              label="Full Name"
                              placeholder="Enter your full name"
                              required
                              value={values.name}
                              showError={showError.form}
                              onChange={(e) => setFieldValue("name", e.target.value)}
                              error={errors.name}
                            />
                            <CustomInput
                              type="text"
                              name="email"
                              label="Email (Optional)"
                              placeholder="Enter your email"
                              value={values.email}
                              showError={showError.form}
                              onChange={(e) => setFieldValue("email", e.target.value)}
                              error={errors.email}
                            />
                            <CustomInput
                              type="number"
                              name="phone"
                              label="Phone Number"
                              placeholder="Enter phone number"
                              required
                              value={values.phone}
                              showError={showError.form}
                              onChange={(e) => setFieldValue("phone", e.target.value)}
                              error={errors.phone}
                            />
                            <CustomInput
                              type="text"
                              name="companyName"
                              label="Company Name"
                              required={true}
                              placeholder="Enter your Shop Name"
                              value={values.companyName}
                              showError={showError.form}
                              onChange={(e) => setFieldValue("companyName", e.target.value)}
                              error={errors.companyName}
                            />
                            <CustomInput
                              type="select"
                              name="category"
                              label="Business Category"
                              placeholder="Select category"
                              required
                              isPortal={true}
                              options={categories}
                              showError={showError.form}
                              value={categories.find((cat) => cat.value === values.category)}
                              onChange={(option) =>
                                setFieldValue("category", option ? option.value : "")
                              }
                              error={errors.category}
                            />
                          </>
                        ) : (
                          <Flex justifyContent="center">
                          <CustomInput
                            type="otp"
                            name="otp"
                            label="OTP Code"
                            placeholder="••••••"
                            required
                            value={values.otp}
                            showError={showError.otp}
                            onChange={(e) => setFieldValue("otp", e)}
                            error={errors.otp}
                          />
                          </Flex>
                        )}
                        <Button
                          type="submit"
                          bgGradient={buttonGradient}
                          color="white"
                          isLoading={isSubmitting}
                          width="full"
                          size="lg"
                          borderRadius="lg"
                          fontWeight="bold"
                          py={6}
                          _hover={{
                            bgGradient: "linear(to-r, blue.600, purple.700)", // Matching LoginForm
                            transform: "translateY(-2px)",
                          }}
                          _active={{ transform: "translateY(0)" }}
                          transition="all 0.2s ease-out"
                          _loading={{ opacity: 0.8 }}
                          onClick={() => setShowError((prev) => ({ ...prev, [step === 2 ? "otp" : "form"]: true }))}
                        >
                          {step === 1 ? "Sign Up " : "Verify & Join"}
                        </Button>
                      </VStack>
                    </Form>
                  )}
                </Formik>
                {step === 2 && (
                  <VStack spacing={4}>
                    <HStack justify="right" spacing={2}>
                      <Button
                        variant="link"
                        color="blue.500" // Matching LoginForm
                        size="sm"
                        isDisabled={otpTimer > 0}
                        onClick={() => {
                          setStep(1);
                          setOtpTimer(60);
                          handleSignupSubmit(signInfo, { setSubmitting: () => {} });
                        }}
                      >
                        Resend {otpTimer > 0 ? `in ${otpTimer}s` : "Now"}
                      </Button>
                    </HStack>
                    <Text color={textColor} fontSize="sm">
                      OTP expires in{" "}
                      <Text as="span" color="blue.500" fontWeight="bold">
                        {otpTimer}s
                      </Text>
                    </Text>
                  </VStack>
                )}
                <HStack justify="center" spacing={2}>
                  <Text color={textColor} fontSize="sm">
                    Already have an account?
                  </Text>
                  <Button
                    variant="link"
                    color="blue.500" // Matching LoginForm
                    size="sm"
                    fontWeight="medium"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          </CardBody>
        </MotionCard>
      </Fade>
    </Box>
  );
});

export default SignupForm;