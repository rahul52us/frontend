import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import CustomButton from "../common/CustomButton/CustomButton";
// import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";

const JoinCommunitySection = () => {
  const buttonSize = useBreakpointValue({ base: "lg", md: "lg" });
  const buttonWidth = useBreakpointValue({ base: "8rem", md: "170px" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box my={{ base: "3rem", lg: "6rem" }} maxW={{ md: "90%", xl: "85%" }} mx={"auto"}>
      {isMobile ? (
        // Mobile View
        <Flex direction="column" align="center" p={4}>
          {/* Heading and Text */}
          <Box textAlign="center">
            {/* <CustomSmallTitle>Join Our Community</CustomSmallTitle> */}
            <Heading
              mt={1}
              as={"h2"}
              fontSize={{ base: "24px", md: "44px", xl: "46px" }}
            >
              Join our community
            </Heading>
          </Box>

          {/* Image */}
          <Box mt={6} ml={-4}>
            <Image src="/images/contactUs/community.webp" alt="Community Image" />
          </Box>

          {/* Description */}
          <Text mt={{ base: 2, md: 4 }} color={"#434343"} textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight={{ base: "24px", md: "32px" }}
            px={{ base: 4, md: 0 }}
          >
            Stay connected with mental health resources, updates, and expert insights.
            Get helpful tips, information, and support—right when you need it.
            Because taking care of your mind should always feel easier. No pressure, no judgment—just a place to feel heard.
          </Text>

          {/* Button */}
          <Box mt={6}>
            <CustomButton
              size={buttonSize}
              w={buttonWidth}
              rounded={"full"}
              onClick={() =>
                window.open(
                  "https://www.instagram.com/metamindhealth/",
                  "_blank"
                )
              }
            >
              Subscribe Now
            </CustomButton>
          </Box>
        </Flex>
      ) : (
        // Tablet and Desktop View
        <Grid templateColumns={"1fr 1fr"} gap={2}>
          {/* Text Content */}
          <Box p={4} pt={"4rem"}>
            {/* <CustomSmallTitle textAlign={"start"}>Join Our Community</CustomSmallTitle> */}
            <Heading
              mt={1}
              as={"h2"}
              fontSize={{ base: "24px", md: "44px", xl: "46px" }}
            >
              Join our community
            </Heading>
            <Text mt={6} w={"90%"} color={"#434343"}>
              Stay connected with mental health resources, updates, and expert insights.
              Get helpful tips, information, and support—right when you need it.
              Because taking care of your mind should always feel easier. No pressure, no judgment—just a place to feel heard.
            </Text>
            <Box mt={6}>
              <CustomButton
                size={buttonSize}
                w={buttonWidth}
                rounded={"full"}
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/metamindhealth/",
                    "_blank"
                  )
                }
              >
                Subscribe Now
              </CustomButton>
            </Box>
          </Box>

          {/* Image */}
          <Box>
            <Image src="/images/contactUs/community.webp" alt="Community Image" />
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default JoinCommunitySection;