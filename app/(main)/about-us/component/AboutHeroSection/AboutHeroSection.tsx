import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Image,
  Text,
  TextProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import CustomButton from "../../../../component/common/CustomButton/CustomButton";
import { useRouter } from 'next/navigation';

const AboutHeroSection = () => {
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonWidth = useBreakpointValue({ base: "14rem", md: "240px" });
  const headingSize = useBreakpointValue({
    base: "xl",
    md: "3xl",
    lg: "3rem",
  });

  // ✅ Explicitly define types
  const flexDirection: FlexProps["flexDirection"] = useBreakpointValue({
    base: "column",
    md: "row",
  });

  const textAlign: TextProps["textAlign"] = useBreakpointValue({
    base: "center",
    md: "start",
  });

  return (
    <Box
      position="relative"
      bg={{ base: "#D3FFDF", lg: "transparent" }}
      py={{ base: 5, lg: 6 }}
      maxW="100vw"
      overflow="hidden"
    >
      {/* Background Box */}
      <Box
        position="absolute"
        top="-125px" // Extend into the header
        right="-60px" // Move further to the right
        bg="#D3FFDF"
        w={{ base: "50%", md: "40%", lg: "30%" }} // Adjust width
        h="410px" // Adjust height
        zIndex={-1} // Keep it behind the image
        display={{ base: "none", lg: "block" }}
      />
      <Box
        maxW={{ lg: "95%" }}
        mx="auto"
        px={4}
        // Add this to make the Box positioned relative to this container
        borderTopLeftRadius="2.5rem"
        borderBottomRightRadius="2.5rem"
      >


        <Flex
          direction={flexDirection}
          align="center"
          gap={{ lg: 4 }}
          position="relative" // Add this to ensure the Flex is on top of the background box
          zIndex={1}
        >
          {/* Left Content */}
          <Box

            pl={{ base: 0, md: 12 }}
            textAlign={textAlign}
            flex={1}
          >
            {/* <CustomSmallTitle textAlign={{ base: "center", lg: "start" }}>
            About Us
          </CustomSmallTitle>   */}
            <Heading
              as="h1"
              fontSize={headingSize}
              mt={1}
              letterSpacing="2px"
              fontWeight="bold"
            >
              Mental Health Care  That
              <Text fontWeight="bold" as="span" ml="2">
                <br /> Works for You
              </Text>
            </Heading>

            <Box display={{ base: "none", md: "block" }}>
              <Text
                color={"brand.1100"}
                fontSize={{ base: "sm", lg: "lg" }}
                w={{ lg: "80%" }}
                mt={4}
              >
                Finding the right mental health support can be hard. We’re here to
                make it simple, effective, and tailored to you.
              </Text>

              <CustomButton
                onClick={() => router.push('/therapist')}
                width={buttonWidth}
                size={buttonSize}
                mt={6}
              >
                Let’s make progress, together
              </CustomButton>
            </Box>
          </Box>

          {/* Right Image Section */}
          <Box mr={{ base: "-1rem", md: "-3rem", lg: "-5rem" }} ml={{ base: "1rem" }} position="relative" zIndex={2} mt={{ base: "1.5rem", md: "" }} >
            <Image
              src="/images/about/hero.webp"
              alt="therapistHero"
              w={{ base: "90%", md: "75%", lg: "65%" }}  // ✅ Make image slightly smaller on web
              objectFit="cover"
              borderTopLeftRadius="4rem"
              borderBottomRightRadius="4rem"
              mr="auto"
            />
          </Box>
        </Flex>
        <Box display={{ base: "block", md: "none" }} textAlign={'center'}>
          <Text
            color={"brand.1100"}
            fontSize={{ base: "sm", lg: "lg" }}
            w={{ lg: "80%" }}
            mt={{ base: 6, md: 0 }}
          >
            Finding the right mental health support can be hard. We’re here to
            make it simple, effective, and tailored to you.
          </Text>

          <CustomButton
            onClick={() => { }}
            width={buttonWidth}
            size={buttonSize}
            mt={6}
          >
            Let’s make progress, together
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutHeroSection;