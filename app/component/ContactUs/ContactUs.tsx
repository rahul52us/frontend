import {
  Box,
  Grid,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import CustomButton from "../common/CustomButton/CustomButton";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    needs: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // const payload = {
    //   name: formData.name,
    //   email: formData.email,
    //   companyName: formData.companyName,
    //   needs: formData.needs,
    // };

  };

  return (
    <Box maxW="90%" mx="auto" my={12}>
      <Box display={{ base: "block", lg: "none" }}>
        <Text
          textTransform="uppercase"
          color="#DF837C"
          textAlign={{ base: "center", lg: "left" }}
        >
          Contact us
        </Text>
        <Text
          fontSize={{ base: "1.8rem", md: "2.6rem" }}
          fontWeight={400}
          lineHeight={{ base: "2.2rem", md: "3.4rem" }}
          w="100%"
          px={{ base: 2, md: 4, lg: 0 }}
          textAlign={{ base: "center", lg: "left" }}
          mt={{ base: 1, md: 0 }}
        >
          Support for you or a loved one?{" "}
          <Text as="span" fontWeight={600}>
            Let&apos;s connect
          </Text>
        </Text>
      </Box>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 2, md: 6 }}
        alignItems="center"
      >
        <Box textAlign={{ base: "center", lg: "left" }} display={{ base: "none", md: "block" }}>
          <Image
            src="/images/contactUsImage.png"
            alt="Contact Us"
            mt={{ base: 4, md: 8 }}
            mx={{ base: "auto", md: "0" }}
            maxW={{ base: "100%", md: "90%" }}
          />
        </Box>
        <Box w="100%" maxW={{ base: "100%", lg: "90%" }}>
          <Box display={{ base: "none", md: "block" }}>
            <Text
              textTransform="uppercase"
              color="#DF837C"
              textAlign={{ base: "center", lg: "left" }}
            >

            </Text>
            <CustomSmallTitle textAlign={{ base: "center", lg: "start" }} ml={{ lg: "0.2rem" }} display="inline-flex" alignItems="center">
              Contact us
              <Image
                src="/images/happy.svg"
                alt="Icon"
                w="20%" h="20%"
                position="relative"
                ml="-0.3rem"  // Fine-tune spacing
              />
            </CustomSmallTitle>
            <Text
              fontSize={{ base: "1.6rem", md: "2.6rem" }}
              fontWeight={400}
              lineHeight={{ base: "2.2rem", md: "3.4rem" }}
              w="100%"
              px={{ base: 2, md: 4, lg: 0 }}
              textAlign={{ base: "center", lg: "left" }}
              mt={{ base: 1, md: 0 }}
            >
              Support for you or a loved one?{" "}
              <Text as="span" fontWeight={600}>
                Let&apos;s connect
              </Text>
            </Text>
          </Box>
          <Box
            p={{ base: 6, md: 8 }}
            border="1px solid #065F68"
            rounded="16px"
            mt={6}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              pb={3}
              textAlign={{ base: "center", md: "left" }}
            >
              Enter Your Details
            </Text>
            <VStack spacing={5} align="stretch" mt={4}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="filled"
                placeholder="Name"
                bg="#CBCBCB1A"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="filled"
                placeholder="Email"
                bg="#CBCBCB1A"
              />
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                variant="filled"
                placeholder="Phone Number"
                bg="#CBCBCB1A"
              />
              <Textarea
                name="needs"
                value={formData.needs}
                onChange={handleChange}
                variant="filled"
                placeholder="Tell Us About Your Needs"
                h="5rem"
                noOfLines={8}
                bg="#CBCBCB1A"
              />
              <CustomButton
                size="lg"
                width="100%"
                icon={LuArrowUpRight}
                onClick={handleSubmit}
                mt={6}
              >
                <Text fontSize="1.5rem">Submit</Text>
              </CustomButton>

            </VStack>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ContactUs;
