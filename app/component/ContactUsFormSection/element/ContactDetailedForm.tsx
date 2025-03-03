import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  Checkbox,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from "../../common/CustomButton/CustomButton";
import CustomSmallTitle from "../../common/CustomSmallTitle/CustomSmallTitle";

const ContactDetailedForm = () => {
  const [formData, setFormData] = useState({
    inquiryType: "",
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    source: "",
    message: "",
  });
  const [isAgreed, setIsAgreed] = useState(false); // Checkbox state for agreement

  const buttonSize = useBreakpointValue({ base: "lg", md: "lg" });
  const buttonWidth = useBreakpointValue({ base: "100%", md: "180px" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAgreed) {
      alert("Please agree to the terms before submitting.");
      return;
    }
    localStorage.setItem("contactFormData", JSON.stringify(formData));
    // Replace with API call if needed
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box py={{ base: 2, md: 12 }} mt={{ lg: 6 }} pr={{ base: 0, md: 8 }} p={{ base: 4, lg: 0 }} bg={{ base: "#86C6F459", md: "transparent" }} rounded={{ base: "24px", lg: "none" }}>
      <CustomSmallTitle textAlign="start" color="#294A62">
        CONTACT US
      </CustomSmallTitle>

      <Heading as="h2" fontWeight={400} fontSize={{ base: "28px", md: "40px" }}>
        Get in touch with <Text fontWeight={700}>Metamind Health</Text>
      </Heading>

      <Text my={3} color="#434343">
        Start the Journey towards better Mental Health
      </Text>
      <Text w={{ base: "100%", md: "90%" }} color="#434343" mb={6} fontSize="sm">
        We are available to offer our support and respond to any inquiries you may have. We are eager to connect with you!
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} pr={{ lg: 5 }}>
          {/* Inquiry Type */}
          <FormControl isRequired>
            <FormLabel>Please select the primary reason for your inquiry</FormLabel>
            <Select name="inquiryType" placeholder="Select option" onChange={handleChange} value={formData.inquiryType} bg="#FFFFFF" color="#8A8A8A" fontSize="sm">
              <option value="first-appointment">I want to book my first appointment</option>
              <option value="registered-client-support">I am a registered client and I need support</option>
              <option value="service-question">I have a question about the service</option>
              <option value="join-network">I am a therapist and I am interested in joining Metamind Health’s network</option>
              <option value="health-records">Getting a copy of my health records</option>
              <option value="billing-payment-issue">I have an issue related to billing/payment</option>
            </Select>
          </FormControl>

          {/* First Name and Last Name */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} w="full">
            <FormControl isRequired>
              <FormLabel>First Name*</FormLabel>
              <Input name="firstName" placeholder="Enter Your First Name" onChange={handleChange} value={formData.firstName} bg="#FFFFFF" color="#8A8A8A" fontSize="sm" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last Name*</FormLabel>
              <Input name="lastName" placeholder="Enter Your Last Name" onChange={handleChange} value={formData.lastName} bg="#FFFFFF" color="#8A8A8A" fontSize="sm" />
            </FormControl>
          </Flex>

          {/* Email and Contact Number */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} w="full">
            <FormControl isRequired>
              <FormLabel>Email*</FormLabel>
              <Input name="email" type="email" placeholder="Enter Your Email" onChange={handleChange} value={formData.email} bg="#FFFFFF" color="#8A8A8A" fontSize="sm" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Contact Number*</FormLabel>
              <Input name="contact" type="tel" placeholder="Enter Your Contact Number" onChange={handleChange} value={formData.contact} bg="#FFFFFF" color="#8A8A8A" fontSize="sm" />
            </FormControl>
          </Flex>

          {/* Source */}
          <FormControl>
            <FormLabel>How did you hear about us?</FormLabel>
            <Select name="source" placeholder="Select option" onChange={handleChange} value={formData.source} bg="#FFFFFF" color="#8A8A8A" fontSize="sm">
              <option value="self">Self</option>
              <option value="friend">Instagram</option>
              <option value="doctor">Facebook</option>
              <option value="online">Practo</option>
              <option value="online">Google</option>
            </Select>
          </FormControl>

          {/* Message */}
          <FormControl>
            <FormLabel>Tell Us About Your Needs</FormLabel>
            <Textarea name="message" placeholder="Your Message" onChange={handleChange} value={formData.message} bg="#FFFFFF" color="#8A8A8A" fontSize="sm" />
          </FormControl>

          {/* Agreement Checkbox */}
          <FormControl>
            <Checkbox isChecked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)} borderColor="teal.500" colorScheme="teal" sx={{
              'span.chakra-checkbox__control': {
                position: 'relative',
                top: '-10px', // Adjust this value to move it up
              }
            }}>
              By clicking &quot;Submit,&quot; you agree to the processing of your personal information to address your inquiry. For more information, please review our <Text as="span" textDecoration="underline">Privacy Policy</Text>.
            </Checkbox>
          </FormControl>

          {/* Submit Button */}
          <Box mt={6}>
            <CustomButton size={buttonSize} w={buttonWidth} type="submit">
              Submit
            </CustomButton>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default ContactDetailedForm;
