import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Text,
  useToast,
  PinInput,
  PinInputField,
  HStack,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import stores from '../../../store/stores';

const MotionBox = motion(Box);

const SignUpForm = observer(() => {
  const router = useRouter();
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });

  const { auth } = stores;

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [onboardingIntent, setOnboardingIntent] = useState<'user' | 'seller'>('user');

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [otp, setOtp] = useState('');

  const handleSignUp = async () => {
    if (!userData.name || !userData.phone) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const data = await auth.register({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        onboardingIntent,
      });

      if (data?.token) {
        setToken(data.token);
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the OTP.',
          status: 'success',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      toast({
        title: 'Error',
        description: 'Please enter the OTP.',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token missing. Please try registering again.");
      }

      const verifyData = await auth.verifyRegisterOtp({
        token: token,
        otp: otp,
      });

      toast({
        title: 'Success',
        description: 'Account verified successfully!',
        status: 'success',
      });

      const nextAction = verifyData?.nextAction;
      const onboardingState = verifyData?.onboarding?.state;
      if (nextAction === 'complete_seller_shop' || onboardingState === 'seller_pending_shop') {
        router.push('/dashboard/shop');
      } else {
        router.push('/login');
      }

    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" h="90vh">
      <Box w={{ base: '90%', md: '400px' }} position="relative">
        <Box w="full" h="auto">
          <Heading mb={4} textAlign="center" color={'blue.600'} fontSize={'2xl'}>
            {step === 'details' ? 'Create Account' : 'Verify OTP'}
          </Heading>

          <AnimatePresence mode="wait">
            <MotionBox
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              p={8}
              rounded="xl"
              bg="white"
              boxShadow="xl"
              w="full"
              border="1px solid"
              borderColor="gray.100"
            >
              {step === 'details' ? (
                <Stack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontSize={"sm"}>Full Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      focusBorderColor="blue.500"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize={"sm"}>Phone Number</FormLabel>
                    <Input
                      type="tel"
                      placeholder="1234567890"
                      focusBorderColor="blue.500"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize={"sm"}>Email (Optional)</FormLabel>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      focusBorderColor="blue.500"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize={"sm"}>I want to join as</FormLabel>
                    <HStack spacing={3}>
                      <Button
                        variant={onboardingIntent === 'user' ? 'solid' : 'outline'}
                        colorScheme="blue"
                        onClick={() => setOnboardingIntent('user')}
                        flex={1}
                      >
                        User
                      </Button>
                      <Button
                        variant={onboardingIntent === 'seller' ? 'solid' : 'outline'}
                        colorScheme="teal"
                        onClick={() => setOnboardingIntent('seller')}
                        flex={1}
                      >
                        Seller
                      </Button>
                    </HStack>
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    bgGradient={'linear(to-r, blue.400, blue.600)'}
                    mt={4}
                    rounded={'full'}
                    onClick={handleSignUp}
                    isLoading={loading}
                  >
                    Sign Up
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={8} align="center">
                  <Text textAlign="center" color="gray.600">
                    Enter the OTP sent to {userData.phone}
                  </Text>
                  <HStack>
                    <PinInput otp type="number" value={otp} onChange={setOtp} size="lg" focusBorderColor="blue.500">
                      <PinInputField inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" />
                      <PinInputField inputMode="numeric" pattern="[0-9]*" />
                      <PinInputField inputMode="numeric" pattern="[0-9]*" />
                      <PinInputField inputMode="numeric" pattern="[0-9]*" />
                      <PinInputField inputMode="numeric" pattern="[0-9]*" />
                      <PinInputField inputMode="numeric" pattern="[0-9]*" />
                    </PinInput>
                  </HStack>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    bgGradient={'linear(to-r, blue.400, blue.600)'}
                    rounded={'full'}
                    onClick={handleVerify}
                    isLoading={loading}
                  >
                    Verify & Proceed
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('details')}
                  >
                    Change Number
                  </Button>
                </Stack>
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>

        <Text mt={8} textAlign="center" color="gray.600">
          Already have an account?{' '}
          <Button variant="link" color="blue.500" onClick={() => router.push('/login')}>
            Sign in
          </Button>
        </Text>
      </Box>
    </Flex>
  );
});

export default SignUpForm;
