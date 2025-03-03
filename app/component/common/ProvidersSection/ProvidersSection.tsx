import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LuArrowUpRight } from "react-icons/lu";
import CustomButton from "../CustomButton/CustomButton";
import RotatingCard from "../RotatingCard/RotatingCard";
import MentalHealthConditions from "./MentalHealthConditions";
import CustomSmallTitle from "../CustomSmallTitle/CustomSmallTitle";
import { useRouter } from 'next/navigation';

const ProvidersSection = () => {
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "md", md: "xl" });
  const buttonFont = useBreakpointValue({ base: "14px", md: "16px" });

  return (
    <Box>
      <Grid
        templateColumns={{ lg: "1fr 1fr" }}
        gap={4}
        justifyContent={"space-between"}
      >
        <Box
          py={{ base: "0rem", lg: "5rem", xl: "6rem" }}
          // px={{ base: 1, lg: 0 }}
          w={{ md: "95%" }}
        >
          <Text
            textTransform={"uppercase"}
            color={"#DF837C"}
            fontSize={{ base: "14px", md: "16px" }}
            textAlign={{ base: "center", md: "start" }}
          >

          </Text>
          <CustomSmallTitle textAlign={{ base: "center", lg: "start" }} ml={{ lg: "0.2rem" }} > Our Providers </CustomSmallTitle>

          <Heading
            as={"h2"}
            fontWeight={400}
            my={{ base: 1, md: 3 }}
            fontSize={{ base: "24px", md: "52px" }}
            textAlign={{ base: "center", md: "start" }}
          >
            Meet our{" "}
            <Text as={"span"} fontWeight={600}>
              Licensed <br /> Therapists
            </Text>
          </Heading>
          <Text
            color={"#434343"}
            fontSize={{ base: "14px", md: "16px", xl: "18px" }}
            textAlign={{ base: "center", md: "start" }}
            // display={{base:"none",lg:"block"}}
            lineHeight={{ base: "24px", md: "32px" }}
            px={{ base: 3, md: 4, lg: 0 }}
          >
            Our licensed therapists are specialized in a wide range of psychological conditions, 12+ psychotherapy approaches
            (including CBT, ACT, Psychodynamic Therapy, and more) and psychological assessments. Whether you need best psychiatrists in Noida,
            a psychotherapist in Noida, or a counseling psychologist in Noida, our team is here to help.
          </Text>
          <Box display={{ base: "none", lg: "block" }}>

            <MentalHealthConditions />
          </Box>
          {/* <Flex mt={4} flexWrap={"wrap"}>
            {list.map((item, index) => (
              <Box
                key={index}
                py={{ base: 1, md: 2 }}
                px={{ base: 4, md: 8 }}
                mb={2}
                w={"fit-content"}
                rounded={"full"}
                border={"1px solid #065F68"}
                color={"#065F68"}
                mr={3}
                fontSize={{ base: "12px", md: "16px" }}
              >
                {item}
              </Box>
            ))}
          </Flex> */}
          <Box display={{ base: "none", md: "block" }}>

            <CustomButton
              icon={LuArrowUpRight}
              onClick={() => router.push('/therapist')}
              mt={6}
              size={buttonSize}
              fontSize={buttonFont}
            >
              Explore Therapist
            </CustomButton>
          </Box>
        </Box>

        <Flex justify={"end"} pl={{ base: 0, md: 2, lg: 12 }} pt={{ md: 8 }}>
          <RotatingCard />
        </Flex>

        <Box>
          {/* <Text
            color={"#434343"}
            fontSize={{ base: "sm", md: "18px",xl:"20px" }}
            textAlign={{ base: "center", md: "start" }}
            display={{base:"block",lg:"none"}}
          >
            At Metamind, our licensed therapists specialize in various
            treatments, including CBT, ACT, Psychodynamic Therapy, and more. We
            treat a wide range of conditions, such as:
          </Text> */}
          <Box display={{ base: "block", lg: "none" }}>

            <MentalHealthConditions />
          </Box>
        </Box>
      </Grid>
      <Flex justify={'center'} display={{ base: "flex", md: "none" }}>

        <CustomButton
          icon={LuArrowUpRight}
          onClick={() => router.push('/therapist')}
          mt={2}
          size={buttonSize}
          fontSize={buttonFont}
        >
          Explore Therapist
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default ProvidersSection;
