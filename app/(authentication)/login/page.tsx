"use client";

import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  PinInput,
  PinInputField,
  Progress,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import React, { startTransition, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiChevronRight, FiPhone, FiShoppingBag } from "react-icons/fi";
import { getStatusType } from "../../component/config/utils/function";
import stores from "../../store/stores";
import RegisterInput from "../signUp/components/RegisterInput";

const MotionBox = motion(Box);
const phoneRegex = /^\d{10}$/;
const otpRegex = /^\d{6}$/;

const stepMeta: Record<string, {
  bg: string;
  accent: string;
  softAccent: string;
  tagline: string;
  points: { icon: any; text: string }[];
  illustration: React.ReactNode;
}> = {
  "Welcome back": {
    bg: "#EFF6FF",
    accent: "#3B82F6",
    softAccent: "#BFDBFE",
    tagline: "Reconnect with your business.",
    points: [
      { icon: FiPhone, text: "Secure login with OTP" },
      { icon: FiCheck, text: "Access your dashboard" },
      { icon: FiShoppingBag, text: "Manage your orders" },
    ],
    illustration: (
      <Image
        src="/images/register/step1.svg"
        alt="Welcome back"
        w="full"
        maxH="280px"
        objectFit="contain"
      />
    ),
  },
  "Verify OTP": {
    bg: "#F0FDF4",
    accent: "#16A34A",
    softAccent: "#BBF7D0",
    tagline: "Just one more step.",
    points: [
      { icon: FiCheck, text: "One-time verification" },
      { icon: FiPhone, text: "Sent to your mobile" },
      { icon: FiCheckCircle, text: "Secure & instant" },
    ],
    illustration: (
      <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
        <circle cx="130" cy="100" r="72" fill="#DCFCE7" />
        <circle cx="130" cy="100" r="50" fill="#BBF7D0" />
        <circle cx="130" cy="100" r="32" fill="#16A34A" />
        <path d="M114 100 L124 110 L146 88" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="60" y="178" width="140" height="12" rx="6" fill="#BBF7D0" />
        <rect x="90" y="196" width="80" height="10" rx="5" fill="#DCFCE7" />
      </svg>
    ),
  },
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
  const stepIndex = step - 1;
  const progress = (step / loginSteps.length) * 100;
  const maskedPhone = loginInfo?.phone
    ? `${loginInfo.phone.slice(0, 2)}******${loginInfo.phone.slice(-2)}`
    : "";

  const meta = useMemo(() => stepMeta[activeStep.title] || stepMeta["Welcome back"], [activeStep.title]);

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
        router.push("/dashboard/super-admin/index");
      } else if (dt?.role === "seller") {
        router.push("/dashboard");
      } else if (nextAction === "complete_seller_shop" || onboardingState === "seller_pending_shop") {
        router.push("/dashboard");
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
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Flex minH="100vh" direction={{ base: "column", md: "row" }}>

        {/* ─── LEFT PANEL (desktop only) ─── */}
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          w={{ md: "400px", xl: "42%" }}
          flexShrink={0}
          position="sticky"
          top={0}
          h="100vh"
          bg={meta.bg}
          transition="background 0.4s ease"
          px={{ md: 10, xl: 14 }}
          py={12}
          overflow="hidden"
          bgGradient={`linear(to-br, ${meta.bg}, ${meta.softAccent}30)`}
        >
          {/* Decorative Blobs */}
          <Box
            position="absolute"
            top="-10%"
            left="-10%"
            w="350px"
            h="350px"
            bg={meta.accent}
            opacity="0.08"
            filter="blur(80px)"
            borderRadius="full"
            zIndex={0}
          />
          <Box
            position="absolute"
            bottom="-5%"
            right="-10%"
            w="400px"
            h="400px"
            bg={meta.accent}
            opacity="0.1"
            filter="blur(100px)"
            borderRadius="full"
            zIndex={0}
          />

          {/* Logo */}
          <HStack spacing={2} mb="auto" zIndex={1}>
            <Box
              w="32px" h="32px" borderRadius="8px"
              bg={meta.accent} display="flex" alignItems="center" justifyContent="center"
              boxShadow={`0 4px 12px ${meta.accent}40`}
            >
              <Icon as={FiShoppingBag} color="white" boxSize={4} />
            </Box>
            <Text fontWeight="800" fontSize="lg" color="gray.800" letterSpacing="-0.02em">
              Business Sahayta
            </Text>
          </HStack>

          {/* Content */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" gap={10} zIndex={1} w="full">
            <Box
              w="100%" maxW={{ md: "300px", xl: "360px" }} mx="auto"
              transition="all 0.4s ease"
            >
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeStep.title}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {meta.illustration}
                </MotionBox>
              </AnimatePresence>
            </Box>

            <AnimatePresence mode="wait">
              <MotionBox
                key={`text-${activeStep.title}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, delay: 0.08 }}
              >
                <Text
                  fontSize={{ md: "2xl", xl: "3xl" }} fontWeight="800" color="gray.900"
                  letterSpacing="-0.03em" lineHeight="1.2" mb={5}
                >
                  {meta.tagline}
                </Text>
                <VStack align="stretch" spacing={3.5}>
                  {meta.points.map((point, i) => (
                    <HStack key={i} spacing={4} align="center">
                      <Flex
                        w="32px" h="32px" borderRadius="10px" flexShrink={0}
                        bg="white"
                        boxShadow="0 2px 8px rgba(0,0,0,0.04)"
                        align="center" justify="center"
                      >
                        <Icon as={point.icon} boxSize={4} color={meta.accent} />
                      </Flex>
                      <Text fontSize="md" fontWeight="600" color="gray.700">
                        {point.text}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </MotionBox>
            </AnimatePresence>
          </Box>

          {/* Footer Info */}
          <VStack align="stretch" spacing={3} mt="auto" pt={8} zIndex={1}>
            <HStack justify="space-between" align="center">
              <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.05em">
                Step {stepIndex + 1} of {loginSteps.length}
              </Text>
              <Text fontSize="xs" fontWeight="600" color={meta.accent}>
                {Math.round(progress)}% Completed
              </Text>
            </HStack>
            <HStack spacing={1.5} w="full">
              {loginSteps.map((_, i) => (
                <Box
                  key={i}
                  h="4px"
                  flex={i === stepIndex ? 2 : 1}
                  borderRadius="full"
                  bg={i === stepIndex ? meta.accent : (i < stepIndex ? `${meta.accent}80` : "whiteAlpha.600")}
                  transition="all 0.3s ease"
                />
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* ─── RIGHT PANEL (form) ─── */}
        <Box
          flex={1}
          h={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          bg="white"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          position="relative"
          sx={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {/* ─── Mobile Header ─── */}
          <Box
            display={{ base: "block", md: "none" }}
            w="full"
            bg="white"
            position="sticky"
            top={0}
            zIndex={20}
            pt="calc(env(safe-area-inset-top, 0px) + 8px)"
            px={5}
            pb={2}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Box>
                {step > 1 && (
                  <IconButton
                    aria-label="Go back"
                    icon={<ArrowBackIcon />}
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    onClick={handleStepBack}
                    bg="gray.50"
                  />
                )}
              </Box>
              <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.05em" ml="auto">
                Step {step} of {loginSteps.length}
              </Text>
            </Flex>
            <Progress
              value={progress}
              size="xs"
              borderRadius="full"
              colorScheme="blue"
              bg="gray.100"
            />
          </Box>

          <Box
            w="full"
            maxW={{ base: "full", md: "520px", xl: "600px" }}
            display="flex"
            flexDirection="column"
            pt={{ base: 4, md: 20 }}
            pb={{ base: "140px", md: 12 }}
            px={{ base: 5, md: 8 }}
            my={{ md: "auto" }}
          >
            <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
              <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
              
              {/* Header */}
              <HStack align="flex-start" spacing={3}>
                <IconButton
                  aria-label="Go back"
                  icon={<ArrowBackIcon />}
                  variant="ghost"
                  size="md"
                  borderRadius="full"
                  onClick={handleStepBack}
                  bg="gray.50"
                  _hover={{ bg: "gray.100" }}
                  mt={1.5}
                  flexShrink={0}
                  display={{ base: "none", md: step > 1 ? "flex" : "none" }}
                />
                <Box>
                  <Heading fontSize={{ base: "2xl", md: "3xl", xl: "4xl" }} color="gray.900" fontWeight="800" letterSpacing="-0.02em" mb={2}>
                    {activeStep.title}
                  </Heading>
                  <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} fontWeight="500">
                    {step === 1 ? activeStep.subtitle : `We sent a 6-digit code to ${maskedPhone}.`}
                  </Text>
                </Box>
              </HStack>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                <MotionBox
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {step === 1 ? (
                    <VStack align="stretch" spacing={5}>
                      <RegisterInput
                        ref={phoneInputRef}
                        label="Phone Number"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="10-digit mobile number"
                        leftIcon={<Icon as={FiPhone} />}
                        error={errors.phone}
                        hint="We'll send a one-time password to this number."
                        accentColor={meta.accent}
                        required
                      />
                    </VStack>
                  ) : (
                    <VStack align="stretch" spacing={7}>
                      <FormControl isInvalid={Boolean(errors.otp)}>
                        <FormLabel color="gray.700" fontWeight="700" fontSize="sm" mb={4}>
                          OTP Code
                        </FormLabel>
                        <HStack justify="center" spacing={3}>
                          <PinInput
                            otp
                            type="number"
                            value={otp}
                            onChange={handleOtpChange}
                            focusBorderColor={meta.accent}
                            autoFocus={step === 2}
                          >
                            <PinInputField ref={otpInputRef} h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                            <PinInputField h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                            <PinInputField h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                            <PinInputField h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                            <PinInputField h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                            <PinInputField h="56px" w={{ base: "42px", md: "52px" }} borderRadius="14px" borderColor="#E2E8F0" bg="#F8FAFD" _focus={{ bg: "white", borderWidth: "2px" }} />
                          </PinInput>
                        </HStack>
                        {errors.otp && (
                          <Text mt={3} fontSize="sm" color="red.500" textAlign="center">
                            {errors.otp}
                          </Text>
                        )}
                      </FormControl>

                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        justify="space-between"
                        align="center"
                        spacing={4}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          leftIcon={<Icon as={FiArrowLeft} />}
                          onClick={handleStepBack}
                          color="gray.600"
                          size="sm"
                          _hover={{ color: meta.accent, bg: "transparent" }}
                        >
                          Change number
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          color={meta.accent}
                          fontSize="sm"
                          fontWeight="700"
                          isDisabled={otpTimer > 0 || loading}
                          onClick={() => void handleLoginSubmit(loginInfo?.phone)}
                        >
                          Resend {otpTimer > 0 ? `in ${otpTimer}s` : "now"}
                        </Button>
                      </Stack>

                      <Text fontSize="sm" color="gray.500" textAlign="center">
                        OTP expires in{" "}
                        <Text as="span" color={meta.accent} fontWeight="700">
                          {otpTimer}s
                        </Text>
                      </Text>
                    </VStack>
                  )}
                </MotionBox>
              </AnimatePresence>

              {/* Desktop CTA */}
              <VStack spacing={5} mt={4} display={{ base: "none", md: "flex" }}>
                <Button
                  w="full"
                  h="56px"
                  bg={meta.accent}
                  color="white"
                  fontSize="md"
                  fontWeight="600"
                  borderRadius="xl"
                  _hover={{ bg: meta.accent, opacity: 0.9, transform: "translateY(-1px)", boxShadow: "lg" }}
                  _active={{ bg: meta.accent, transform: "translateY(0)" }}
                  transition="all 0.3s ease"
                  type="submit"
                  isLoading={loading}
                >
                  {step === 1 ? "Send OTP" : "Verify & Login"}
                  {step === 1 && <Icon as={FiChevronRight} ml={2} />}
                </Button>

                <Text textAlign="center" color="gray.500" fontSize="sm" fontWeight="500">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    color={meta.accent}
                    fontWeight="700"
                    fontSize="sm"
                    isDisabled={isRouteTransitioning}
                    onClick={() => navigateWithAnimation("/register")}
                  >
                    Register
                  </Button>
                </Text>
              </VStack>

            </VStack>
          </form>
        </Box>

          {/* ─── Mobile Sticky Footer ─── */}
          <Box
            display={{ base: "block", md: "none" }}
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            px={5}
            pt={3}
            pb="calc(env(safe-area-inset-bottom, 0px) + 12px)"
            zIndex={30}
            boxShadow="0 -4px 20px rgba(0,0,0,0.05)"
          >
            <VStack spacing={2}>
              <Button
                w="full"
                h="48px"
                bg={meta.accent}
                color="white"
                fontSize="md"
                fontWeight="700"
                borderRadius="lg"
                onClick={() => {
                   if (step === 1) void handleLoginSubmit();
                   else void handleOtpSubmit();
                }}
                isLoading={loading}
                _hover={{ bg: meta.accent, opacity: 0.9 }}
                _active={{ bg: meta.accent, transform: "scale(0.98)" }}
                transition="all 0.3s ease"
              >
                {step === 1 ? "Send OTP" : "Verify & Login"}
                {step === 1 && <Icon as={FiChevronRight} ml={2} />}
              </Button>
              <Text textAlign="center" color="gray.500" fontSize="xs" fontWeight="600">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  color={meta.accent}
                  fontWeight="700"
                  fontSize="xs"
                  onClick={() => navigateWithAnimation("/register")}
                >
                  Register
                </Button>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </MotionBox>
  );
});

const LoginFormFallback = () => (
  <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#EFF6FF">
    <VStack spacing={4}>
      <Box
        w="40px" h="40px" borderRadius="10px"
        bg="#3B82F6" display="flex" alignItems="center" justifyContent="center"
        boxShadow="0 4px 12px rgba(59, 130, 246, 0.4)"
      >
        <Icon as={FiShoppingBag} color="white" boxSize={5} />
      </Box>
      <Text fontWeight="700" color="gray.600">Loading Business Sahayta...</Text>
    </VStack>
  </Box>
);

const LoginForm = () => (
  <Suspense fallback={<LoginFormFallback />}>
    <LoginFormContent />
  </Suspense>
);

export default LoginForm;
