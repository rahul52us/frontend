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
  Container,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import CustomInput from "../../component/config/component/customInput/CustomInput";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import { getStatusType } from "../../component/config/utils/function";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const phoneSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
});

const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const LoginForm = observer(() => {
  const {
    auth: { login, verifyLoginOtp, openNotification },
  } = stores;
  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState({ form: false, otp: false });
  const [loginInfo, setLoginInfo] = useState(null);
  const [otpTimer, setOtpTimer] = useState(60);
  const router = useRouter();


  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("loginInfo");
    const savedStep = sessionStorage.getItem("step");
    if (savedInfo) setLoginInfo(JSON.parse(savedInfo));
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

  const handleLoginSubmit = (values, actions) => {
    login({ ...values, token: loginInfo?.token })
      .then((dt) => {
        openNotification({
          title: "OTP Sent",
          message: dt.message,
          type: "success",
        });
        setLoginInfo({ ...values, token: dt?.token });
        sessionStorage.setItem("loginInfo", JSON.stringify({ ...values, token: dt?.token }));
        sessionStorage.setItem("step", "2");
        setStep(2);
        setOtpTimer(60);
      })
      .catch((err) => {
        openNotification({
          title: "Login Failed",
          message: err.message,
          type: getStatusType(err?.statusCode),
        });
      })
      .finally(() => actions.setSubmitting(false));
  };

  const handleOtpSubmit = (values, actions) => {
    verifyLoginOtp({ ...values, token: loginInfo?.token })
      .then((dt) => {
        openNotification({
          title: "Login Successful",
          message: dt.message,
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
    <Container maxW="container.sm" py={{ base: 8, md: 12 }}>
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
          <Box
            bgGradient="linear(to-r, blue.500, purple.600)"
            h="8px"
            width="100%"
          />
          <CardBody p={{ base: 6, md: 10 }}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <VStack spacing={8}>
                <Heading
                  size={{ base: "lg", md: "xl" }}
                  fontWeight="extrabold"
                  textAlign="center"
                  color={headingColor}
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip="text"
                >
                  {step === 1 ? ` Welcome Back` : "Verify Your OTP"}
                </Heading>
                <Text
                  textAlign="center"
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                  maxW="sm"
                >
                  {step === 1
                    ? "Enter your phone number to receive a secure OTP"
                    : `A 6-digit OTP was sent to ${loginInfo?.phone?.slice(0, 2)}******${loginInfo?.phone?.slice(-2)}`}
                </Text>
                <Formik
                  initialValues={step === 1 ? { phone: "" } : { otp: "" }}
                  validationSchema={step === 1 ? phoneSchema : otpSchema}
                  onSubmit={step === 1 ? handleLoginSubmit : handleOtpSubmit}
                >
                  {({ values, isSubmitting, setFieldValue, errors }: any) => (
                    <Form style={{ width: "100%" }}>
                      <VStack spacing={6} width="full">
                        <CustomInput
                          type={step === 1 ? "number" : "otp"}
                          name={step === 1 ? "phone" : "otp"}
                          label={step === 1 ? "Phone Number" : "OTP Code"}
                          placeholder={step === 1 ? "Enter phone number" : "••••••"}
                          required
                          value={step === 1 ? values.phone : values.otp}
                          showError={step === 1 ? showError.form : showError.otp}
                          onChange={(e) =>
                            setFieldValue(step === 1 ? "phone" : "otp", step === 1 ? e.target.value : e)
                          }
                          error={step === 1 ? errors.phone : errors.otp}
                        />
                        <Button
                          type="submit"
                          bgGradient="linear(to-r, blue.500, purple.600)"
                          color="white"
                          isLoading={isSubmitting}
                          width="full"
                          size="lg"
                          borderRadius="lg"
                          fontWeight="bold"
                          py={6}
                          _hover={{
                            bgGradient: "linear(to-r, blue.600, purple.700)",
                            transform: "translateY(-2px)",
                          }}
                          _active={{ transform: "translateY(0)" }}
                          transition="all 0.2s ease-out"
                          _loading={{ opacity: 0.8 }}
                          onClick={() => setShowError((prev) => ({ ...prev, [step === 2 ? "otp" : "form"]: true }))}
                        >
                          {step === 1 ? "Send OTP" : "Verify & Login"}
                        </Button>
                      </VStack>
                    </Form>
                  )}
                </Formik>
                {step === 2 && (
                  <VStack spacing={4}>
                    <HStack justify="center" spacing={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Icon as={FiArrowLeft} />}
                        onClick={() => {
                          setStep(1);
                          setOtpTimer(60);
                        }}
                        color={textColor}
                        _hover={{ color: "blue.500" }}
                      >
                        Change Number
                      </Button>
                      <Text color={textColor} fontSize="sm">|</Text>
                      <Button
                        variant="link"
                        color="blue.500"
                        size="sm"
                        isDisabled={otpTimer > 0}
                        onClick={() => {
                          setStep(1);
                          setOtpTimer(60);
                          handleLoginSubmit({ phone: loginInfo?.phone }, { setSubmitting: () => { } });
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
                    Don’t have an account?
                  </Text>
                  <Button
                    variant="link"
                    color="blue.500"
                    size="sm"
                    fontWeight="medium"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          </CardBody>
        </MotionCard>
      </Fade>
    </Container>
  );
});

export default LoginForm;