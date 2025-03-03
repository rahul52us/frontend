import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import CardComponent3 from "../CardComponent3/CardComponent3";
import CustomButton from "../CustomButton/CustomButton";
import CustomCarousel from "../CustomCarousal/CustomCarousal";
import CustomSmallTitle from "../CustomSmallTitle/CustomSmallTitle";
import { useRouter } from 'next/navigation'

const data = [
  {
    bgGradient: "linear(to-br, #FFB8B2 80%, #FFFFFF)",
    borderColor: "#C686819E",
    rotatedText: "DEPRESSION",
    mainText: "“Feeling Low or Just a Rough Patch?”",
    imageSrc: "images/home/depression.webp",
  },
  {
    bgGradient: "linear(to-br, #86C6F4 80%, #FFFFFF)",
    borderColor: "#819EC6",
    rotatedText: "TRAUMA",
    mainText: "“Are you grieving or experiencing trauma?”",
    imageSrc: "images/home/trauma.webp",
  },
  {
    bgGradient: "linear(to-br, #9DEAB2 80%, #FFFFFF)",
    borderColor: "#819EC6",
    rotatedText: "EXPLORE MORE",
    mainText: "“Are you dealing with anxiety or everyday stress?”",
    imageSrc: "images/home/bipolar.webp",
  },
  // {
  //   bgGradient: "linear(to-br, #B2D8FF 80%, #FFFFFF)",
  //   borderColor: "#819EC6",
  //   rotatedText: "ANXIETY",
  //   mainText: "“Feeling Overwhelmed or Nervous?”",
  //   imageSrc: "images/anxietyImage.png",
  // },
  // {
  //   bgGradient: "linear(to-br, #B2D8FF 80%, #FFFFFF)",
  //   borderColor: "#819EC6",
  //   rotatedText: "ANXIETY",
  //   mainText: "“Feeling Overwhelmed or Nervous?”",
  //   imageSrc: "images/anxietyImage.png",
  // },
  // {
  //   bgGradient: "linear(to-br, #B2D8FF 80%, #FFFFFF)",
  //   borderColor: "#819EC6",
  //   rotatedText: "ANXIETY",
  //   mainText: "“Feeling Overwhelmed or Nervous?”",
  //   imageSrc: "images/anxietyImage.png",
  // },
];

// const images = [
//   "/images/home/knowYourself3.png",
//   "/images/home/knowYourself1.png",
//   "/images/home/knowYourself2.png",
// ];

const KnowYourselfSection = () => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState(0); // Default to the first card
  const buttonSize = useBreakpointValue({ base: "md", md: "xl" });
  const buttonWidth = useBreakpointValue({ base: "170px", md: "200px" });
  const noOfSlides = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!memoizedData || memoizedData.length === 0) return;

    setActiveCard(0);

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % memoizedData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [memoizedData]); // ✅ Track stable `memoizedData`





  return (
    <Box py={{ base: 2, md: 8 }}>
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ md: 2, xl: 4 }}
        alignItems="center"
        display={{ base: "block", md: "grid" }}
      >
        {/* Left Section */}
        <Box py={6} maxW={{ lg: "90%" }} px={2} ml={{ md: 8 }}>
          <Text
            textTransform="uppercase"
            color="#DF837C"
            textAlign={{ base: "center", lg: "start" }}
            fontSize={{ base: "14px", md: "16px" }}
          >

          </Text>
          <CustomSmallTitle textAlign={{ base: "center", lg: "start" }} ml={{ lg: "0.2rem" }} > Know Yourself Better</CustomSmallTitle>
          <Heading
            as="h2"
            fontWeight={400}
            fontSize={{ base: "26px", md: "48px", xl: "52px" }}
            my={3}
            lineHeight="1.2"
            textAlign={{ base: "center", lg: "start" }}
          >
            Not Sure What you <br /> are{" "}
            <Text as="span" fontWeight={600}>
              struggling with?
            </Text>
          </Heading>

          <Box display={{ base: "block", lg: "none" }}>
            <CustomCarousel slidesToShow={noOfSlides} autoplay={true} showArrows={false} showDots={true}>
              {data.map((item, index) => (
                <CardComponent3
                  key={index}
                  bgGradient={item.bgGradient}
                  borderColor={item.borderColor}
                  rotatedText={item.rotatedText}
                  mainText={item.mainText}
                  imageSrc={item.imageSrc}
                  isActive={activeCard === index} // Check if this card is active
                  onMouseEnter={() => setActiveCard(index)} // Set active card on hover
                />
              ))}
            </CustomCarousel>
          </Box>
          <Text
            color="#434343"
            fontSize={{ base: "sm", md: "18px" }}
            mt={4}
            lineHeight={{ base: "22px", md: "30px", xl: "32px" }}
            textAlign={{ base: "center", lg: "start" }}
          >
            Take a quick, simple assessment to see if your symptoms match common mental health conditions.
            It’s not a diagnostic tool, but a helpful tool to understand what’s going on.
            Just answer a few easy questions to our Counselling psychologist in Noida, and we’ll guide you from there.
          </Text>
          <Flex justify={{ base: "center", lg: "start" }}>
            <CustomButton
              icon={LuArrowUpRight}
              onClick={() => router.push('/therapist')}
              mt={6}
              size={buttonSize}
              width={buttonWidth}
            >
              Take Assessment
            </CustomButton>
          </Flex>
        </Box>

        <Box position="relative" overflow="hidden">
          {/* <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={2}

        onMouseLeave={() => setActiveCard(0)} // Reset to the first card on mouse leave
      >
        {data.map((item, index) => (
          <CardComponent3
            key={index}
            bgGradient={item.bgGradient}
            borderColor={item.borderColor}
            rotatedText={item.rotatedText}
            mainText={item.mainText}
            imageSrc={item.imageSrc}
            isActive={activeCard === index} // Check if this card is active
            onMouseEnter={() => setActiveCard(index)} // Set active card on hover
          />
        ))}
      </Grid> */}

          <Flex
            gap={2}
            mt={2}
            display={{ base: "none", lg: "flex" }}
          // onMouseLeave={() => setActiveCard(0)} // Reset to the first card on mouse leave
          >
            {data.map((item, index) => (
              <CardComponent3
                key={index}
                bgGradient={item.bgGradient}
                borderColor={item.borderColor}
                rotatedText={item.rotatedText}
                mainText={item.mainText}
                imageSrc={item.imageSrc}
                isActive={activeCard === index} // Check if this card is active
                onMouseEnter={() => setActiveCard(index)} // Set active card on hover
              />
            ))}
          </Flex>

        </Box>
      </Grid>
    </Box>
  );
};

export default KnowYourselfSection;
