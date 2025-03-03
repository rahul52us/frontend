import {
  Box,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import CustomButton from "../CustomButton/CustomButton";
import CustomSmallTitle from "../CustomSmallTitle/CustomSmallTitle";
import HeroCarousel from "./HeroCarousel";

const HeroSection = () => {
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "lg", md: "xl" });
  const buttonWidth = useBreakpointValue({ base: "8rem", md: "180px" });


  const handleClick = () => {
    router.push("/therapist");
  };
  return (
    <Box
      mx={"auto"}
      my={{ base: 2, md: 6, lg: 8 }}
      maxW={{ base: "95%", md: "90%" }}
    >
      <Grid templateColumns={{ lg: "1fr 1fr" }} gap={6}>
        <Box>
          <Flex align={"center"} h={"100%"}>
            <Box py={{ base: 2, md: 6 }} maxW={{ md: "95%" }}>
              <Text textTransform="uppercase" color="#DF837C" textAlign={{ base: "center", lg: "start" }}>
              </Text>
              <CustomSmallTitle textAlign={{ base: "center", lg: "start" }} ml={{ lg: "0.2rem" }} display={{ base: "none", lg: "block" }} > SEEK HELP </CustomSmallTitle>
              <Heading
                as="h1"
                fontWeight={400}
                fontSize="clamp(2rem, 4vw, 5rem)"
                my={{ base: 1, lg: 3 }}
                lineHeight="1.15"
                textAlign={{ base: "center", lg: "start" }}
                position="relative"
                // fontFamily="Gilroy"
                letterSpacing="-3%"
              >
                For Better <br />
                <Text
                  as="span"
                  fontWeight={600}
                  position="relative"
                  // fontFamily="Gilroy"
                  letterSpacing="-3%"
                >
                  Mental Health
                  <Box
                    as="span"
                    position="absolute"
                    top="-0.5rem" // Adjust this for vertical positioning
                    right="-1.5rem" // Adjust this for horizontal positioning
                    w={{ base: "1.5rem", lg: "2rem" }}
                    h={{ base: "1.5rem", lg: "2rem" }}
                  >
                    <Image src="/images/herosectionIcon.svg" alt="Icon" w="100%" h="100%" />
                  </Box>
                </Text>
              </Heading>

              <Flex justify={"center"} display={{ base: "flex", md: "none" }}>

                <HeroCarousel />
                {/* <Image
                  src="/images/herosectionImage.svg"
                  alt="Image"
                  w={{ base: "80%", md: "70%", xl: "75%" }}
                  h={{ base: "100%", md: "100%" }}
                /> */}
              </Flex>
              <Text
                color="#434343"
                fontSize={{ base: "sm", md: "18px" }}
                mt={{ base: 2, md: 4 }}
                textAlign={{ base: 'center', lg: "start" }}
                lineHeight={{ base: "24px", md: "28px" }}
                px={{ base: 5, md: 0 }}
              >
                Our mission is to make specialised mental health care accessible to those who struggle to get the help they need. We support teenagers, adults, and families in their recovery from mental illness– Metamind is here to help. If you’re searching for a trusted mental health clinic in Noida, reach out to us.
              </Text>
              <Flex justify={{ base: "center", lg: "start" }} mt={{ base: 4, md: 6 }}>
                <CustomButton
                  width={buttonWidth}
                  size={buttonSize}
                  onClick={handleClick}
                >
                  Get Started
                </CustomButton>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Flex justify={"center"} display={{ base: "none", md: "flex" }}>
          <HeroCarousel />
        </Flex>
        {/* <Box>
          <Flex justify={"center"} display={{ base: "none", md: "flex" }}>
            <Image
              src="/images/heroImage.png"
              alt="Image"
              w={{ base: "100%", md: "75%", xl: "80%" }}
              h={{ base: "100%", md: "100%" }}
            />
          </Flex>
        </Box> */}


        {/* <ImageCollage/> */}


        {/* <Flex justify={{base:"center",lg:"end"}}>
          <Box>
            <Flex gap={[2, 3]}>
              <Box
                w={["4rem", "5.5rem"]} // Smaller for base, default for larger screens
                h={["6rem", "8.25rem"]}
                bg={"#FFB8B2"}
                borderBottomRightRadius={"2.625rem"}
              />
              <Box
                w={["11rem", "15.5rem"]}
                h={["6rem", "8.25rem"]}
                bg={"#065F68"}
                borderTopLeftRadius={"2.625rem"}
                p={["1rem", "1.5rem"]}
              >
                <Flex direction={"column"} justify={"space-between"} h={"100%"}>
                  <Text
                    color={"white"}
                    fontSize={["1rem", "1.3125rem"]}
                    fontWeight={500}
                  >
                    Talk. Listen. Recover
                  </Text>
                  <Text color={"white"} fontSize={["0.875rem", "1.0625rem"]}>
                    Get Started
                  </Text>
                </Flex>
              </Box>
              <Image
                src="/images/homeImage2.png"
                w={["7rem", "10.5rem"]}
                h={["6rem", "8.25rem"]}
                alt=""
              />
            </Flex>
            <Flex gap={[2, 3]} mt={[2, 3]}>
              <Box>
                <Image
                  src="/images/homeImage1.png"
                  alt=""
                  h={["8rem", "12rem"]}
                  objectFit={"cover"}
                  w={["14rem", "21.75rem"]}
                />
                <Grid
                  templateColumns={"1fr 1fr"}
                  mt={[2, 3]}
                  gap={["0.5rem", "1rem"]}
                >
                  <Box
                    bg={"#86C6F4"}
                    borderBottomLeftRadius={"2.625rem"}
                    pt={[6, 6]}
                    pl={[3, 4]}
                  >
                    <Text
                      lineHeight={["2rem", "4rem"]}
                      fontWeight={700}
                      fontSize={["2rem", "3.25rem"]}
                    >
                      +5k
                    </Text>
                    <Text fontSize={["0.55rem", "0.9rem"]}>
                      Happy users catered
                    </Text>
                  </Box>
                  <Box
                    bg={"#065F68"}
                    h={["6rem", "9rem"]}
                    borderBottomRightRadius={"2.625rem"}
                    borderTopLeftRadius={"2.625rem"}
                  />
                </Grid>
              </Box>
              <Box>
                <Box
                  w={["7rem", "10.5rem"]}
                  h={["4rem", "6rem"]}
                  bg={"#EAF475"}
                  mb={["0.5rem", "1rem"]}
                />
                <Image
                  src="/images/homeimage3.png"
                  objectFit={"cover"}
                  alt=""
                  h={["10rem", "15rem"]}
                  w={["7rem", "10.5rem"]}
                  borderBottomRightRadius={"2.625rem"}
                  borderTopLeftRadius={"2.625rem"}
                />
              </Box>
            </Flex>
          </Box>
        </Flex> */}

        {/* <Flex justify={"end"}>
          <Box>
            <Flex gap={3}>
              <Box
                w={"5.5rem"} // 110px -> 6.875rem
                h={"8.25rem"} // 155px -> 9.6875rem
                bg={"#FFB8B2"}
                borderBottomRightRadius={"2.625rem"} // 42px -> 2.625rem
              />
              <Box
                w={"15.5rem"} // 280px -> 17.5rem
                h={"8.25rem"} // 155px -> 9.6875rem
                bg={"#065F68"}
                borderTopLeftRadius={"2.625rem"} // 42px -> 2.625rem
                p={"1.5rem"} // 24px -> 1.5rem
              >
                <Flex direction={"column"} justify={"space-between"} h={"100%"}>
                  <Text color={"white"} fontSize={"1.3125rem"} fontWeight={500}>
                    Talk. Listen. Recover
                  </Text>
                  <Text color={"white"} fontSize={"1.0625rem"}>
                    Get Started
                  </Text>
                </Flex>
              </Box>
              <Image
                src="/images/homeImage2.png"
                w={"10.5rem"} // 180px -> 11.25rem
                h={"8.25rem"} // 155px -> 9.6875rem
                alt=""
              />
            </Flex>
            <Flex gap={3} mt={3}>
              <Box>
                <Image
                  src="/images/homeImage1.png"
                  alt=""
                  h={"12rem"} // 225px -> 14.0625rem
                  objectFit={"cover"}
                  w={"21.75rem"} // 403px -> 25.1875rem
                />
                <Grid templateColumns={"1fr 1fr"} mt={3} gap={"1rem"}>
                  <Box
                    bg={"#86C6F4"}
                    borderBottomLeftRadius={"2.625rem"} // 42px -> 2.625rem
                    pt={8}
                    pl={4}
                  >
                    <Text
                      lineHeight={"4rem"}
                      fontWeight={700}
                      fontSize={"3.25rem"}
                    >
                      +5k
                    </Text>
                    <Text>Happy users catered</Text>
                  </Box>
                  <Box
                    bg={"#065F68"}
                    h={"9rem"} // 148px -> 9.25rem
                    borderBottomRightRadius={"2.625rem"} // 42px -> 2.625rem
                    borderTopLeftRadius={"2.625rem"} // 42px -> 2.625rem
                  />
                </Grid>
              </Box>
              <Box>
                <Box
                  w={"10.5rem"} // 180px -> 11.25rem
                  h={"6rem"} // 117px -> 7.3125rem
                  bg={"#EAF475"}
                  mb={"1rem"} // 16px -> 1rem
                />
                <Image
                  src="/images/homeimage3.png"
                  objectFit={"cover"}
                  alt=""
                  h={"15rem"} // 260px -> 16.25rem
                  w={"10.5rem"} // 180px -> 11.25rem
                  borderBottomRightRadius={"2.625rem"} // 42px -> 2.625rem
                  borderTopLeftRadius={"2.625rem"} // 42px -> 2.625rem
                />
              </Box>
            </Flex>
          </Box>
        </Flex> */}
      </Grid>
    </Box>
  );
};

export default HeroSection;
