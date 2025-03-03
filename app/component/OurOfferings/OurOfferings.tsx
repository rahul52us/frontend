import { Box, Flex, Grid, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import CardComponent1 from "../common/CardComponent1/CardComponent1";
import CustomButton from "../common/CustomButton/CustomButton";
import CustomCarousel from "../common/CustomCarousal/CustomCarousal";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";
import { useRouter } from 'next/navigation';

const cardData = [
  {
    title: "Individual Therapy",
    description:
      " In one-on-one sessions with an expert by your side, including top clinical psychologists in Noida, you will work through life’s challenges and attain personal growth.",
    image: "/images/cardImage1.webp",
    buttonText: "Explore service",
    buttonLink: "/therapist",
    bgColor: "#9DEAB2",
  },
  {
    title: "Couples & Family Therapy",
    description:
      " Relationships are tough—couple’s & family therapy can provide a safe space to build stronger relationships and resolve conflict.",
    image: "/images/cardImage2.webp",
    buttonText: "Explore service",
    buttonLink: "/therapist",
    bgColor: "#ffb8b2",
  },
  {
    title: "Teen Therapy",
    description:
      "We support teenagers (ages 13-18 years) navigating mental health challenges and helping teens feel heard and understood. Whether you’re seeking the best child psychologist in Noida or specialized care for adolescents, we’ve got you covered.",
    image: "/images/cardImage3.webp",
    buttonText: "Explore service",
    buttonLink: "/therapist",
    bgColor: "#EAF475",
  },
  {
    title: "Psychological Assessments",
    description:
      "We offer in-depth evaluations for adults and teens, conducted by the best counseling psychologists in Noida, to diagnose their concerns and help you understand what’s really going on.",
    image: "/images/cardImage4.webp",
    buttonText: "Explore service",
    buttonLink: "/therapist",
    bgColor: "#B9DDFF",
  },
];

const OurOfferings = () => {
  const router = useRouter();
  const [hoverBgColor, setHoverBgColor] = useState("white");
  const [activeSlide, setActiveSlide] = useState(0);
  const buttonSize = useBreakpointValue({ base: "lg", md: "xl" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg={isMobile ? cardData[activeSlide]?.bgColor : hoverBgColor}
      py={{ base: "3rem", md: "2rem" }}
      my={{ base: "2rem", lg: "2rem" }}
      pt={"4rem"}
      px={{ base: 4, md: 0 }}
      borderTopLeftRadius={{ base: "50px", lg: "90px" }}
      borderBottomRightRadius={{ base: "50px", lg: "90px" }}
      transition={isMobile ? "background-color 1.75s ease-in-out" : "background-color 0.4s ease-in-out"}
    >
      <Box maxW={{ md: "90vw", lg: "95%", xl: "85%" }} mx={"auto"}>
        <CustomSmallTitle>OUR OFFERINGS</CustomSmallTitle>
        <Heading
          textAlign={"center"}
          as={"h2"}
          fontWeight={400}
          fontSize={{ base: "24px", md: "48px" }}
          my={{ md: 2 }}
        >
          Specialized care for{" "}
          <Text as={"span"} fontWeight={600}>
            all ages
          </Text>
        </Heading>
        <Grid
          templateColumns={{ md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
          gap={4}
          mt={8}
          justifyContent={"center"}
          display={{ base: "none", md: "grid" }}
        >
          {cardData.map((card, index) => (
            <Box
              key={index}
              onMouseEnter={() => setHoverBgColor(card.bgColor)}
              onMouseLeave={() => setHoverBgColor("white")}
            >
              <CardComponent1
                title={card.title}
                description={card.description}
                image={card.image}
                buttonText={card.buttonText}
                buttonLink={card.buttonLink}
                bgColor={card.bgColor}
              />
            </Box>
          ))}
        </Grid>
        <Box display={{ base: "block", md: "none" }}>
          <CustomCarousel
            slidesToShow={1}
            showArrows={false}
            showDots={true}
            autoplay={true}
            afterChange={(index) => setActiveSlide(index)} // Track the active slide
          >
            {cardData.map((card, index) => (
              <Box key={index}>
                <CardComponent1
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  buttonText={card.buttonText}
                  buttonLink={card.buttonLink}
                  bgColor={card.bgColor}
                />
              </Box>
            ))}
          </CustomCarousel>
        </Box>
      </Box>
      <Flex justify={"center"}>
        <CustomButton
          size={buttonSize}
          fontSize="14px"
          width={"210px"}
          icon={LuArrowUpRight}
          onClick={() => router.push('/therapist')}
          mt={8}
        >
          Explore All Services
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default OurOfferings;