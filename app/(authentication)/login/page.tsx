"use client";

import React, { Suspense, startTransition, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Circle,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  PinInput,
  PinInputField,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiPhone } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import stores from "../../store/stores";
import { getStatusType } from "../../component/config/utils/function";

const MotionBox = motion(Box);
const phoneRegex = /^\d{10}$/;
const otpRegex = /^\d{6}$/;

const panelStyles = {
  bg: "white",
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "3xl",
  boxShadow: "0 28px 90px rgba(15, 23, 42, 0.08)",
};

const primaryButtonStyles = {
  bgGradient: "linear(to-r, teal.500, cyan.500)",
  color: "white",
  h: "56px",
  borderRadius: "full",
  fontWeight: "700",
  _hover: { bgGradient: "linear(to-r, teal.600, cyan.600)" },
  _active: { transform: "scale(0.98)" },
};

const inputStyles = {
  h: "58px",
  borderRadius: "2xl",
  borderColor: "gray.200",
  _focusVisible: { borderColor: "teal.400", boxShadow: "0 0 0 1px #14b8a6" },
};

const fieldCardStyles = {
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "2xl",
  bg: "white",
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.04)",
  p: 5,
};

const loginSteps = [
  {
    title: "Welcome back",
    subtitle: "Enter your phone number to receive a one-time password.",
    icon: FiPhone,
  },
  {
    title: "Verify OTP",
    subtitle: "Enter the 6-digit code sent to your phone.",
    icon: CheckIcon,
  },
];

type LoginInfo = {
  phone: string;
  token?: string;
};

const LoginFormContent = observer(() => {
  const {
    auth: { login, verifyLoginOtp, openNotification },
  } = stores;

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loginInfo, setLoginInfo] = useState<LoginInfo | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);

  const navigationTimeoutRef = useRef<number | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const otpAutoSubmitRef = useRef("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStep = loginSteps[step - 1];
  const progress = (step / loginSteps.length) * 100;
  const maskedPhone = loginInfo?.phone
    ? `${loginInfo.phone.slice(0, 2)}******${loginInfo.phone.slice(-2)}`
    : "";

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("loginInfo");
    const savedStep = sessionStorage.getItem("step");

    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo) as LoginInfo;
      setLoginInfo(parsedInfo);
      setPhone(parsedInfo.phone || "");
    }

    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    if (step === 2 && otpTimer > 0) {
      const timer = window.setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);

      return () => window.clearInterval(timer);
    }
  }, [otpTimer, step]);

  useEffect(() => {
    if (step !== 2 || otp.trim().length < 6) {
      otpAutoSubmitRef.current = "";
    }
  }, [otp, step]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        window.clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const focusPhoneInput = (delay = 0) => {
    const runFocus = () => {
      phoneInputRef.current?.focus();
      phoneInputRef.current?.select?.();
    };

    if (delay > 0) {
      window.setTimeout(runFocus, delay);
      return;
    }

    window.requestAnimationFrame(runFocus);
  };

  const focusOtpInput = (delay = 0) => {
    const runFocus = () => {
      otpInputRef.current?.focus();
      otpInputRef.current?.select?.();
    };

    if (delay > 0) {
      window.setTimeout(runFocus, delay);
      return;
    }

    window.requestAnimationFrame(runFocus);
  };

  useEffect(() => {
    if (step === 1) {
      focusPhoneInput(180);
      return;
    }

    focusOtpInput(220);
  }, [step]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPhone = event.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(nextPhone);

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    const nextOtp = value.trim();
    if (nextOtp.length < 6 || step !== 2 || loading || !loginInfo?.token) {
      return;
    }

    if (otpAutoSubmitRef.current === nextOtp) {
      return;
    }

    otpAutoSubmitRef.current = nextOtp;
    void handleOtpSubmit(nextOtp);
  };

  const navigateWithAnimation = (href: string) => {
    if (isRouteTransitioning) return;

    setIsRouteTransitioning(true);

    if (navigationTimeoutRef.current) {
      window.clearTimeout(navigationTimeoutRef.current);
    }

    navigationTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
    }, 220);
  };

  const handleStepBack = () => {
    setStep(1);
    setOtp("");
    setErrors({});
    sessionStorage.setItem("step", "1");
    focusPhoneInput(180);
  };

  const handleLoginSubmit = async (phoneOverride?: string) => {
    const nextPhone = (phoneOverride ?? phone).trim();

    if (!phoneRegex.test(nextPhone)) {
      setErrors({ phone: "Enter a valid 10-digit phone number." });
      return;
    }

    setLoading(true);

    try {
      const dt = await login({ phone: nextPhone, token: loginInfo?.token });
      openNotification({
        title: "OTP Sent",
        message: dt.message,
        type: "success",
      });

      const nextLoginInfo = { phone: nextPhone, token: dt?.token };
      setLoginInfo(nextLoginInfo);
      setPhone(nextPhone);
      setOtp("");
      setErrors({});
      sessionStorage.setItem("loginInfo", JSON.stringify(nextLoginInfo));
      sessionStorage.setItem("step", "2");
      setStep(2);
      setOtpTimer(60);
      focusOtpInput(260);
    } catch (err: any) {
      openNotification({
        title: "Login Failed",
        message: err.message,
        type: getStatusType(err?.statusCode),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otpOverride?: string) => {
    const nextOtp = (otpOverride ?? otp).trim();

    if (!otpRegex.test(nextOtp)) {
      setErrors({ otp: "Enter the 6-digit OTP." });
      return;
    }

    if (!loginInfo?.token) {
      openNotification({
        title: "Session expired",
        message: "Please request a new OTP to continue.",
        type: "warning",
      });
      handleStepBack();
      return;
    }

    setLoading(true);

    try {
      const dt = await verifyLoginOtp({ otp: nextOtp, token: loginInfo.token });
      openNotification({
        title: "Login Successful",
        message: dt.message,
        type: "success",
      });

      sessionStorage.removeItem("loginInfo");
      sessionStorage.removeItem("step");

      const nextAction = dt?.nextAction;
      const onboardingState = dt?.onboarding?.state;
      const redirect = searchParams.get("redirect");

      if (dt?.role === "superAdmin") {
        router.push("/super-admin/dashboard");
      } else if (dt?.role === "seller") {
        router.push("/dashboard/shop");
      } else if (nextAction === "complete_seller_shop" || onboardingState === "seller_pending_shop") {
        router.push("/dashboard/shop");
      } else if (redirect?.startsWith("/")) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      openNotification({
        title: "Invalid OTP",
        message: err.message,
        type: getStatusType(err?.statusCode),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      void handleLoginSubmit();
      return;
    }

    void handleOtpSubmit();
  };

  return (
    <Box
      minH={{ base: "100vh", md: "auto" }}
      bgGradient="linear(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%)"
      py={{ base: 0, md: 2, xl: 4 }}
    >
      <Container maxW={{ base: "full", md: "container.md", xl: "680px" }} px={0}>
        <MotionBox
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={
            isRouteTransitioning
              ? { opacity: 0, x: -24, scale: 0.98 }
              : { opacity: 1, x: 0, y: 0, scale: 1 }
          }
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box
            {...panelStyles}
            borderRadius={{ base: "none", md: "3xl" }}
            boxShadow={{ base: "none", md: panelStyles.boxShadow }}
            borderWidth={{ base: "0px", md: panelStyles.borderWidth }}
            px={{ base: 5, md: 8, xl: 9 }}
            py={{ base: 6, md: 8, xl: 9 }}
          >
            <Box as="form" onSubmit={handleFormSubmit}>
              <VStack align="stretch" spacing={8}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", sm: "center" }}
                  spacing={3}
                >
                  <Badge
                    bg="teal.50"
                    color="teal.600"
                    borderRadius="md"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="700"
                  >
                    Secure login
                  </Badge>
                  <Badge
                    bg="teal.50"
                    color="teal.600"
                    borderRadius="md"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="700"
                  >
                    Step {step}/{loginSteps.length}
                  </Badge>
                </Stack>

                <Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="teal" h="6px" />

                <Stack direction={{ base: "column", sm: "row" }} spacing={4} align={{ base: "flex-start", sm: "center" }}>
                  <Circle size="50px" bg="teal.50" color="teal.600">
                    <Icon as={activeStep.icon as any} boxSize={5} />
                  </Circle>
                  <Box flex="1" minW={0}>
                    <Heading fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }} color="gray.900" lineHeight="1.1">
                      {activeStep.title}
                    </Heading>
                    <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                      {step === 1 ? activeStep.subtitle : `We sent a 6-digit code to ${maskedPhone}.`}
                    </Text>
                  </Box>
                </Stack>

                <AnimatePresence mode="wait">
                  <MotionBox
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.24 }}
                  >
                    {step === 1 ? (
                      <VStack align="stretch" spacing={5}>
                        <Box {...fieldCardStyles}>
                          <FormControl isInvalid={Boolean(errors.phone)}>
                            <FormLabel color="gray.700" fontWeight="600">
                              Phone Number
                            </FormLabel>
                            <Input
                              ref={phoneInputRef}
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={phone}
                              onChange={handlePhoneChange}
                              placeholder="10-digit mobile number"
                              {...inputStyles}
                            />
                            {errors.phone ? (
                              <Text mt={2} fontSize="sm" color="red.500">
                                {errors.phone}
                              </Text>
                            ) : (
                              <Text mt={2} fontSize="sm" color="gray.500">
                                We will send a one-time password to this number.
                              </Text>
                            )}
                          </FormControl>
                        </Box>
                      </VStack>
                    ) : (
                      <VStack align="stretch" spacing={5}>
                        <Box {...fieldCardStyles}>
                          <VStack align="stretch" spacing={5}>
                            <FormControl isInvalid={Boolean(errors.otp)}>
                              <FormLabel color="gray.700" fontWeight="600">
                                OTP Code
                              </FormLabel>
                              <HStack justify="center">
                                <PinInput
                                  otp
                                  type="number"
                                  value={otp}
                                  onChange={handleOtpChange}
                                  focusBorderColor="teal.500"
                                  autoFocus={step === 2}
                                >
                                  <PinInputField ref={otpInputRef} h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                  <PinInputField h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                  <PinInputField h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                  <PinInputField h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                  <PinInputField h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                  <PinInputField h="58px" w={{ base: "42px", md: "54px" }} borderRadius="xl" borderColor="gray.200" />
                                </PinInput>
                              </HStack>
                              {errors.otp ? (
                                <Text mt={3} fontSize="sm" color="red.500" textAlign="center">
                                  {errors.otp}
                                </Text>
                              ) : (
                                <Text mt={3} fontSize="sm" color="gray.500" textAlign="center">
                                  Enter the OTP exactly as you received it.
                                </Text>
                              )}
                            </FormControl>

                            <Stack
                              direction={{ base: "column", md: "row" }}
                              justify="space-between"
                              align={{ base: "flex-start", md: "center" }}
                              spacing={3}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                leftIcon={<Icon as={FiArrowLeft} />}
                                onClick={handleStepBack}
                                color="gray.600"
                                px={0}
                                justifyContent="flex-start"
                                _hover={{ color: "teal.600", bg: "transparent" }}
                              >
                                Change number
                              </Button>
                              <Button
                                type="button"
                                variant="link"
                                color="teal.600"
                                isDisabled={otpTimer > 0 || loading}
                                onClick={() => void handleLoginSubmit(loginInfo?.phone)}
                              >
                                Resend {otpTimer > 0 ? `in ${otpTimer}s` : "now"}
                              </Button>
                            </Stack>

                            <Text fontSize="sm" color="gray.500" textAlign="center">
                              OTP expires in{" "}
                              <Text as="span" color="teal.600" fontWeight="700">
                                {otpTimer}s
                              </Text>
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    )}
                  </MotionBox>
                </AnimatePresence>

                <Button w="full" type="submit" {...primaryButtonStyles} isLoading={loading}>
                  {step === 1 ? "Send OTP" : "Verify & Login"}
                </Button>

                <Text textAlign="center" color="gray.600">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    color="teal.600"
                    fontWeight="700"
                    isDisabled={isRouteTransitioning}
                    onClick={() => navigateWithAnimation("/register")}
                  >
                    Register
                  </Button>
                </Text>
              </VStack>
            </Box>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
});

const LoginFormFallback = () => (
  <Box
    minH={{ base: "100vh", md: "auto" }}
    bgGradient="linear(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%)"
    py={{ base: 0, md: 2, xl: 4 }}
  >
    <Container maxW={{ base: "full", md: "container.md", xl: "680px" }} px={0}>
      <Box
        {...panelStyles}
        borderRadius={{ base: "none", md: "3xl" }}
        boxShadow={{ base: "none", md: panelStyles.boxShadow }}
        borderWidth={{ base: "0px", md: panelStyles.borderWidth }}
        px={{ base: 5, md: 8, xl: 9 }}
        py={{ base: 6, md: 8, xl: 9 }}
      >
        <VStack align="stretch" spacing={8}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Badge
              bg="teal.50"
              color="teal.600"
              borderRadius="md"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="700"
            >
              Secure login
            </Badge>
            <Badge
              bg="teal.50"
              color="teal.600"
              borderRadius="md"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="700"
            >
              Step 1/2
            </Badge>
          </Stack>

          <Progress value={50} bg="gray.100" borderRadius="full" colorScheme="teal" h="6px" />

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} align={{ base: "flex-start", sm: "center" }}>
            <Circle size="50px" bg="teal.50" color="teal.600">
              <Icon as={FiPhone} boxSize={5} />
            </Circle>
            <Box flex="1" minW={0}>
              <Heading fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }} color="gray.900" lineHeight="1.1">
                Welcome back
              </Heading>
              <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                Preparing secure login...
              </Text>
            </Box>
          </Stack>
        </VStack>
      </Box>
    </Container>
  </Box>
);

const LoginForm = () => (
  <Suspense fallback={<LoginFormFallback />}>
    <LoginFormContent />
  </Suspense>
);

export default LoginForm;
