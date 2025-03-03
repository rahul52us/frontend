import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import CustomButton from "../CustomButton/CustomButton";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomSmallTitle from "../CustomSmallTitle/CustomSmallTitle";
import { useRouter } from 'next/navigation';

const OurValues = observer(() => {
  const router = useRouter();

  const { companyStore: { companyDetails } } = stores
  const buttonSize = useBreakpointValue({ base: "lg", md: "xl" })
  const buttonWidth = useBreakpointValue({ base: "7rem", md: "180px" })
  const icon = ["/icons/icon1.svg", "/icons/icons2.svg", "/icons/icons3.svg", "/icons/icons4.svg", "/icons/icons5.svg"]

  const handleClick = () => {
    router.push("/therapist");
  };

  return (
    <Box
      bg={"#F3F7F7"}
      py={{ base: "3rem", md: "6rem" }}
      px={{ base: 4 }}
      position="relative"
      borderTopLeftRadius={{ base: "50px", lg: "90px" }}
      borderBottomRightRadius={{ base: "50px", lg: "90px" }}
      overflow="hidden"
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "1.15fr 1fr" }} // Adjust grid layout for smaller screens
        alignItems={{ base: "center", md: "start" }}
        gap={{ base: 6, md: 0 }}
      >
        <Box
          display={{ base: "block", lg: "none" }}
          textAlign={{ base: "center", lg: "start" }}
        >
          <Text textTransform="uppercase" color="#DF837C">

          </Text>
          <CustomSmallTitle> OUR VALUES</CustomSmallTitle>
          {/* <Text
            fontSize={{ base: "30px", md: "54px" }}
            fontWeight={400}
            color={"#0F0F0F"}
          >
            What Makes
            <Text fontWeight={600} as={"span"}>
              {" "}
              Us Unique
            </Text>
          </Text> */}
          <Heading
            textAlign={"center"}
            as={"h2"}
            fontWeight={400}
            fontSize={{ base: "30px", md: "54px" }}
            my={{ md: 1 }}
          >
            What Makes {" "}
            <Text as={"span"} fontWeight={600}>
              Us Unique
            </Text>
          </Heading>
          <Text
            w={{ base: "100%", lg: "90%" }}
            color={"#434343"}
            fontSize={{ base: "14px", md: "16px" }}
            lineHeight={{ base: "24px", md: "32px" }}
            px={{ base: 5, md: 4, lg: 0 }}
          >
            We know that seeking mental health care can be a long, frustrating journey.
            With us, you’ll find the right support to move forward with clarity and confidence.
            Whether you’re looking for the best psychologist in Noida or a mental health doctor
            in Noida that offers comprehensive care, Metamind stands out with.
          </Text>
        </Box>
        <Box
          position={{ base: "relative", lg: "sticky" }}
          top={{ lg: 8, xl: 12 }}
          height={{ base: "auto", lg: "100%" }}
          maxHeight={{ base: "300px", md: "620px" }}
        >
          <Flex justifyContent="center" alignItems="center" w="110%" mt="2.5rem">
            <Image
              src="images/home/sofa.png"
              objectFit="contain"
              height={{ base: "20rem", md: "30rem", lg: "35rem" }} // Smaller height
              width={{ base: "85%", md: "75%", lg: "80%" }} // Reduce the width
              ml={{ base: "0", md: "-2rem", lg: "-4rem" }} // Shift to the left for web
              alt="Clinicimagewithsofa"
              position={{ base: "relative", md: "unset" }} // Apply position for mobile only
              top={{ base: "-4rem", md: "0" }} // Move it upward for mobile
              left={{ base: "-1rem", md: "0" }} // Move it slightly to the left for mobile
              mb={{ base: "-8rem", md: "0" }} // Reduce margin-bottom for mobile
            />
          </Flex>
        </Box>
        <Box>
          {/* Intro Section */}
          <Box display={{ base: "none", lg: "block" }} mb={8}>
            <Text textTransform="uppercase" color="#DF837C" mb={2}>

            </Text>
            <CustomSmallTitle textAlign={{ base: "center", lg: "start" }} ml={{ lg: "0.2rem" }} >OUR VALUES</CustomSmallTitle>
            <Text fontSize={{ base: "30px", md: "48px" }} fontWeight={400} color={"#0F0F0F"}>
              What Makes
              <Text fontWeight={600} as={"span"}>
                {" "} Us Unique
              </Text>
            </Text>
            <Text
              w={{ base: "100%", md: "80%", lg: "90%" }}
              color={"#434343"}
              fontSize={{ base: "14px", md: "16px" }}
              lineHeight={{ base: "20px", md: "24px" }}
              mt={4}
            >
              We know that seeking mental health care can be a long, frustrating journey.
              With us, you’ll find the right support to move forward with clarity and confidence.
              Whether you’re looking for the best psychologist in Noida or a mental health doctor
              in Noida that offers comprehensive care.

            </Text>
          </Box>

          {/* Accordion Section */}
          <Box
            maxHeight="24rem"
            overflowY="auto"
            mb={8}
            mt={4}
            pr={2} // Add padding-right for scroll visibility
          >
            <Accordion w={{ base: "100%", lg: "90%" }} defaultIndex={0} allowToggle>
              <VStack spacing={4} align="stretch">
                {companyDetails?.homeFaq?.map((feature, index) => (
                  <AccordionItem key={index} border="none">
                    {({ isExpanded }) => (
                      <>
                        <AccordionButton
                          px={6}
                          pt={isExpanded ? 4 : 3}
                          pb={isExpanded ? 0 : 3}
                          bg={isExpanded ? "white" : "#FFFFFF9C"}
                          rounded={"16px"}
                          borderBottomRadius={isExpanded ? "0px" : "16px"}
                          boxShadow={isExpanded ? "rgba(0, 0, 0, 0.1) 0px 4px 6px" : "none"}
                          _hover={{ bg: "white" }}
                        >
                          <Flex align="center" gap={4} flex="1">
                            <Image
                              src={icon[index]}
                              alt="icon"
                              boxSize="26px"
                              opacity={isExpanded ? 1 : 0.6}
                            />
                            <Text fontSize={{ base: "16px", md: "18px" }} color={isExpanded ? "#292929" : "#111111AB"}>
                              {feature.title}
                            </Text>
                          </Flex>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel
                          pb={4}
                          px={6}
                          bg={isExpanded ? "white" : "#FFFFFF9C"}
                          borderBottomRadius={"16px"}
                        >
                          <Text color="#292929" fontSize={{ base: "14px", md: "16px" }} lineHeight="24px">
                            {feature.paragraph}
                          </Text>
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                ))}
              </VStack>
            </Accordion>
          </Box>

          {/* Button Section */}
          <Flex justify={{ base: "center", md: "start" }}>
            <CustomButton
              width={buttonWidth}
              size={buttonSize}
              onClick={handleClick}
            >
              Get Started
            </CustomButton>
          </Flex>
        </Box>

      </Grid>
    </Box>
  );
});

export default OurValues;
