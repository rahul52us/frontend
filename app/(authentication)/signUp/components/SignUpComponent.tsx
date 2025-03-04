import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Text,
  Select,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const SignUpForm = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for User, 1 for Vendor
  const [userData, setUserData] = useState({ name: '', phone: '', email: '' });
  const [vendorData, setVendorData] = useState({
    name: '',
    phone: '',
    company: '',
    category: '',
    email: '',
  });

  return (
    <Flex align="center" justify="center" h="90vh">
      <Box w={{ base: '90%', md: '90%' }} position="relative">
        {/* Flipping Card */}
        <Box
          position="relative"
          w="full"
          h="auto"
          // style={{
          //   perspective: '1000px',
          // }}
        >

           <Heading mb={4} textAlign="center" color={activeTab === 0 ? 'blue.600' : 'purple.600'} fontSize={'2xl'}>
                {activeTab === 0 ? 'Create User Account' : 'Create Vendor Account'}
              </Heading>
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeTab}
              initial={{ rotateY: activeTab === 0 ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: activeTab === 0 ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              p={6}
              rounded="xl"
              // bg="whiteAlpha.300"
              w="full"
              border="2px solid transparent"
              style={{
                background: `
                  linear-gradient(white, white) padding-box,
                  linear-gradient(to right, #805AD5, #D53F8C) border-box
                `,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Tabs Integrated Inside the Card */}
              <Tabs
                index={activeTab}
                onChange={setActiveTab}
                variant="unstyled"
                isFitted
                mb={6}
              >
                <TabList
                  borderBottom="2px solid"
                  borderColor="gray.200"
                  pb={2}
                >
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                    _hover={{ color: 'blue.500' }}
                    fontWeight="semibold"
                    transition="all 0.2s"
                  >
                    User
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'purple.500',
                      borderBottom: '2px solid',
                      borderColor: 'purple.500',
                    }}
                    _hover={{ color: 'purple.500' }}
                    fontWeight="semibold"
                    transition="all 0.2s"
                  >
                    Vendor
                  </Tab>
                </TabList>
              </Tabs>

              {activeTab === 0 ? (
                <form>
                  <Stack spacing={8}>
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
                        placeholder="+1 234 567 890"
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
                    <Button colorScheme="blue" size="lg" w="full" bgGradient={'linear(to-r,#805AD5, #D53F8C)'} mt={6} rounded={'full'}>
                      Create User Account
                    </Button>
                  </Stack>
                </form>
              ) : (
                <form>
                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel fontSize={"sm"}>Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Jane Smith"
                        focusBorderColor="purple.500"
                        value={vendorData.name}
                        onChange={(e) => setVendorData({ ...vendorData, name: e.target.value })}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize={"sm"}>Phone Number</FormLabel>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 890"
                        focusBorderColor="purple.500"
                        value={vendorData.phone}
                        onChange={(e) => setVendorData({ ...vendorData, phone: e.target.value })}
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
                    <FormControl isRequired>
                      <FormLabel fontSize={"sm"}>Company Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Awesome Corp"
                        focusBorderColor="purple.500"
                        value={vendorData.company}
                        onChange={(e) => setVendorData({ ...vendorData, company: e.target.value })}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontSize={"sm"}>Business Category</FormLabel>
                      <Select
                        placeholder="Select category"
                        focusBorderColor="purple.500"
                        value={vendorData.category}
                        onChange={(e) => setVendorData({ ...vendorData, category: e.target.value })}
                      >
                        <option value="retail">Retail</option>
                        <option value="food">Food & Beverage</option>
                        <option value="tech">Technology</option>
                        <option value="service">Services</option>
                      </Select>
                    </FormControl>
                    <Button colorScheme="purple" size="lg" w="full" bgGradient={'linear(to-r,#805AD5, #D53F8C)'} mt={2} rounded={'full'}>
                      Create Vendor Account
                    </Button>
                  </Stack>
                </form>
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>

        <Text mt={4} textAlign="center" color="gray.600">
          Already have an account?{' '}
          <Button variant="link" color="blue.500" >
            Sign in
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};

export default SignUpForm;