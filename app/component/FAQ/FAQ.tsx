import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import FAQAccordion from "./FAQAccordion/FAQAccordion";
import "./FAQAccordion/scroll.css";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";

const FAQ = () => {
  return (
    <Box
      // mt={{ md: 10 }}
      mb={2}
      pt={{ base: "3rem", md: "6rem" }}
      pb={{ base: "8.5rem", md: "8rem" }}
      bg={"#E1F0EE"}
      position={"relative"}
      borderTopLeftRadius={{base:"50px",lg:"90px"}}
      borderBottomRightRadius={{base:"50px",lg:"90px"}}
    >
      <Text
        textAlign={"center"}
        color={"#DF837C"}
        textTransform={"uppercase"}
        fontSize={{ base: "14px", md: "16px" }}
      >
       
      </Text>
      <CustomSmallTitle textAlign ={{ base: "center" }} ml={{ lg: "0.2rem" }} > FAQS </CustomSmallTitle>
      <Heading
        textAlign={"center"}
        as={"h2"}
        fontWeight={400}
        fontSize={{ base: "24px", md: "52px" }}
        my={2}
      >
        Everything You{" "}
        <Text as={"span"} fontWeight={600}>
          Need to Know
        </Text>
      </Heading>
      <Flex justify="center" mt={{base:6,md:12}} maxH="26rem">
        <Box
          zIndex={2}
          w={{ base:"90%",md: "80%",lg:"70%" }}
          className="customScrollBar"
          overflow={"auto"}
          pr={{base:2,md:4}}
        >
          <FAQAccordion />
        </Box>
      </Flex>
      <Image
        src="/images/faqImage.png"
        alt="faqImage"
        w={{base:"180px",md:"340px"}}
        h={{base:"160px",md:"320px"}}
        mixBlendMode={"multiply"}
        objectFit={"cover"}
        position={"absolute"}
        bottom={"0"}
        left={{lg:6}}
        zIndex={1}
      />
    </Box>
  );
};

export default FAQ;
