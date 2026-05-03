const fs = require('fs');
const path = 'c:/Users/uknow/Desktop/my-projects/business sahayta/frontend/app/(authentication)/signUp/components/SignUpComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// The file is broken from line 1382.
// I will find the position of renderOtpStep and replace everything from there to the end.

const otpStepStart = content.indexOf('const renderOtpStep = () => (');
if (otpStepStart !== -1) {
  const fixedBottom = `const renderOtpStep = () => (
    <VStack spacing={{ base: 4, md: 8 }} align="center">
      <Text textAlign="center" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
        Enter the OTP sent to {userData.phone}
      </Text>
      <HStack>
        <PinInput
          otp
          type="number"
          value={otp}
          onChange={handleOtpChange}
          size="lg"
          focusBorderColor="blue.500"
          autoFocus={isOtpStep}
        >
          <PinInputField ref={otpInputRef} inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
          <PinInputField inputMode="numeric" pattern="[0-9]*" />
        </PinInput>
      </HStack>
      <FieldError message={errors.otp} />
      <Text fontSize="xs" color="gray.500" textAlign="center">
        You can go back if you want to change the phone number or signup details.
      </Text>
    </VStack>
  );

  const renderCurrentStep = () => {
    switch (activeStep.title) {
      case "Let's get started":
        return renderPhoneStep();
      case "Tell us about you":
        return renderUserProfileStep();
      case "Tell us about your shop":
        return renderSellerBasicsStep();
      case "Set your shop location":
        return renderSellerLocationStep();
      case "Contact details":
        return renderSellerContactStep();
      case "Show your shop":
        return renderSellerPhotosStep();
      case "Verify OTP":
        return renderOtpStep();
      default:
        return renderPhoneStep();
    }
  };

  return (
    <MotionBox
      w="full"
      minH="100vh"
      bgGradient={{ base: "none", md: "linear(to-b, #f8fafc 0%, #ffffff 45%, #eff6ff 100%)" }}
      bg={{ base: "white", md: "transparent" }}
      pt={{ base: "calc(env(safe-area-inset-top, 0px) + 4px)", md: 6 }}
      pb={{ base: "calc(env(safe-area-inset-bottom, 0px) + 8px)", md: 6 }}
      display="flex"
      alignItems={{ base: "flex-start", md: "center" }}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Container
        maxW={{ base: "full", md: "container.lg", xl: "760px" }}
        px={{ base: 0, md: 6 }}
        display="flex"
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="center"
        minH={{ base: "100vh", md: "calc(100vh - 48px)" }}
        pt={{ base: "0px", md: 0 }}
      >
        <Box
          {...panelStyles}
          boxShadow={panelStyles.boxShadow}
          borderWidth={panelStyles.borderWidth}
          px={{ base: 3, md: 8, xl: 9 }}
          py={{ base: 3, md: 8, xl: 9 }}
          w="full"
        >
          <VStack align="stretch" spacing={{ base: 4, md: 8 }}>
            <Flex justify="space-between" align="center" gap={2} mb={{ base: -2, md: 0 }}>
              <IconButton
                aria-label="Go back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
                borderRadius="full"
                onClick={handleBack}
                isDisabled={stepIndex === 0}
                display={stepIndex === 0 ? "none" : "flex"}
              />
              <Box display={{ base: "none", md: "block" }}>
                <Badge
                  bg="blue.50"
                  color="blue.600"
                  borderRadius="md"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="700"
                >
                  Step {stepIndex + 1}/{steps.length}
                </Badge>
              </Box>
            </Flex>

            <Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="blue" h="6px" display={{ base: "none", md: "block" }} />

            <Stack
              direction={isSellerPhotosStep ? "column" : "row"}
              spacing={{ base: 0, md: 4 }}
              align={isSellerPhotosStep ? "center" : "center"}
              justify={isSellerPhotosStep ? "center" : undefined}
            >
              <Circle size={{ base: "0px", md: "50px" }} bg="blue.50" color="blue.600" display={{ base: "none", md: "flex" }}>
                <Icon as={activeStep.icon as any} boxSize={5} />
              </Circle>
              <Box flex="1" minW={0} textAlign={isSellerPhotosStep ? "center" : "left"}>
                <Heading fontSize={{ base: "lg", sm: "xl", md: "3xl" }} color="gray.900" lineHeight="1.2">
                  {activeStep.title}
                </Heading>
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                  {activeStep.subtitle}
                </Text>
              </Box>
            </Stack>

            <AnimatePresence mode="wait">
              <MotionBox
                key={\`\${intent}-\${stepIndex}\`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.24 }}
              >
                {renderCurrentStep()}
              </MotionBox>
            </AnimatePresence>

            <Button
              w="full"
              {...primaryButtonStyles}
              onClick={isOtpStep ? () => void handleVerify() : handleContinue}
              isLoading={loading}
            >
              {isOtpStep ? "Verify & Continue" : "Continue"}
            </Button>

            <Text textAlign="center" color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={{ base: -2, md: 0 }}>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                color="blue.600"
                fontSize={{ base: "xs", md: "sm" }}
                isDisabled={isRouteTransitioning}
                onClick={() => navigateWithAnimation("/login")}
              >
                Sign in
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </MotionBox>
  );
});
export default SignUpForm;`;

  content = content.substring(0, otpStepStart) + fixedBottom;
  fs.writeFileSync(path, content);
  console.log("File fixed and ultimate minimal UI applied.");
} else {
  console.log("Could not find renderOtpStep start.");
}
