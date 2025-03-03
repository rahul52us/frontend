'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Select,
  Text,
  VStack
} from '@chakra-ui/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  role: Yup.string().required('Role selection is required'),
  termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const Register = () => {
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    termsAccepted: false,
  };

  const handleSubmit = (values: typeof initialValues, { resetForm }: { resetForm: () => void }) => {
    alert(`Welcome, ${values.name}! Registration successful.`);
    resetForm();
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Box
        width="100%"
        maxWidth="500px"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        textAlign="center"
      >
        <Image src="/images/logo.png" alt="Logo" mx="auto" mb={6} />
        <Heading mb={4} size="lg" color="teal.600">
          Create an Account
        </Heading>
        <Text mb={6} color="gray.600">
          Fill in the details below to register and get started.
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <VStack spacing={4}>
                <FormControl id="name" isInvalid={touched.name && !!errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Field
                    as={Input}
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    focusBorderColor="teal.500"
                  />
                  <ErrorMessage name="name" component={Text} />
                </FormControl>
                <FormControl id="email" isInvalid={touched.email && !!errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    focusBorderColor="teal.500"
                  />
                  <ErrorMessage name="email" component={Text} />
                </FormControl>
                <FormControl id="phone" isInvalid={touched.phone && !!errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    focusBorderColor="teal.500"
                  />
                  <ErrorMessage name="phone" component={Text} />
                </FormControl>
                <HStack w="full" spacing={4}>
                  <FormControl id="password" isInvalid={touched.password && !!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      focusBorderColor="teal.500"
                    />
                    <ErrorMessage name="password" component={Text} />
                  </FormControl>
                  <FormControl
                    id="confirmPassword"
                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      focusBorderColor="teal.500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component={Text}


                    />
                  </FormControl>
                </HStack>
                <FormControl id="role" isInvalid={touched.role && !!errors.role}>
                  <FormLabel>Role</FormLabel>
                  <Field
                    as={Select}
                    name="role"
                    placeholder="Select your role"
                    focusBorderColor="teal.500"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="artist">Artist</option>
                    <option value="admin">Admin</option>
                  </Field>
                  <ErrorMessage name="role" component={Text} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <Field
                    type="checkbox"
                    name="termsAccepted"
                    style={{ marginRight: '8px' }}
                  />
                  <Text as="span">
                    I accept the{' '}
                    <Link href="/terms" style={{ color: 'teal', textDecoration: 'underline' }}>
                      Terms and Conditions
                    </Link>
                  </Text>
                </FormControl>
                <ErrorMessage name="termsAccepted" component={Text} />
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w="full"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
        <Text mt={6}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'teal', textDecoration: 'underline' }}>
            Login
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default Register;
