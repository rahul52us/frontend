import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Image,
  Text,
  TextProps,
  useBreakpointValue
} from "@chakra-ui/react";
import CustomButton from "../common/CustomButton/CustomButton";

const TherapistHeroSection = ({ onButtonClick }: { onButtonClick: () => void }) => {
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonWidth = useBreakpointValue({ base: "7rem", md: "160px" });
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl", lg: "3.2rem" });

  // ✅ Explicitly define types
  const flexDirection: FlexProps["flexDirection"] = useBreakpointValue({
    base: "column",
    md: "row",
  });

  const textAlign: TextProps["textAlign"] = useBreakpointValue({
    base: "center",
    md: "start",
  });

  // const imageSize = useBreakpointValue({ base: "180px", md: "230px" });

  return (
    <Box
      maxW="95%"
      mx="auto"
      p={6}
      bg="#FFF3F2"
      borderTopLeftRadius="2.5rem"
      borderBottomRightRadius="2.5rem"
    >
      <Flex
        direction={flexDirection}
        justify="space-between"
        align="center"
        gap={6}
      >
        {/* Left Content */}
        <Box py={{ base: 3, lg: 6 }} pl={{ base: 0, md: 12 }} textAlign={textAlign}>
          {/* <CustomSmallTitle color="#0F0F0F" textAlign={{ base: "center", lg: "start" }}>MEET OUR EXPERTS</CustomSmallTitle> */}
          <Heading as="h1" fontSize={headingSize} mt={1}>
            <Text fontWeight={400}> The right therapist makes
            </Text>
            All the difference
          </Heading>
          <Box display={{ base: "none", md: "block" }}>

            <CustomButton onClick={onButtonClick} width={buttonWidth} size={buttonSize} mt={6}>
              Get Started
            </CustomButton>
          </Box>
        </Box>

        {/* Right Image Section */}
        <Box>
          <Flex gap={2} align="center" wrap="wrap">
            <Box py={1} display="flex" flexDirection="column" justifyContent="center">
              <Box
                w={{ base: "5rem", md: "7rem" }}
                h={{ base: "6rem", md: "7.5rem" }}
                bg="#065F68"
                mb={3}
                borderTopRightRadius="2rem"
                borderBottomLeftRadius="2rem"
              />
              <Box
                w={{ base: "5rem", md: "7rem" }}
                h={{ base: "5rem", md: "7rem" }}
                bg="#FFB8B29C"
                borderTopLeftRadius="2rem"
                borderBottomRightRadius="2rem"
              />
            </Box>

            <Image
              src="/images/therapistHeroImage.png"
              alt="therapistHero"
              h={{ base: "12rem", md: "16rem" }}  // Matches the height of the design blocks
              // w={{ base: "10rem", md: "22rem" }}  // Adjusted for a better aspect ratio
              objectFit="cover"
              borderTopLeftRadius="2rem"
              borderBottomRightRadius="2rem"
              ml={{ base: 0, md: "-0rem" }} // Align image closer to the design elements
            />
          </Flex>
        </Box>

      </Flex>
      {/* <Center>

      <CustomButton width={buttonWidth} size={buttonSize} mt={6}>
            Get Started
          </CustomButton>
</Center> */}
    </Box>
  );
};

export default TherapistHeroSection;
