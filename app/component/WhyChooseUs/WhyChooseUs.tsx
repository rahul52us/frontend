import { Box, Grid } from "@chakra-ui/react";
import CardComponent4 from "../common/CardComponent4/CardComponent4";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";
import CustomSubHeading from "../common/CustomSubHeading/CustomSubHeading";

const cards = [
  {
    imageSrc: "/images/evidence1.svg",
    title: "Tailored Therapy",
    description: "We design our approach based on your unique needs.",
  },
  {
    imageSrc: "/images/evidence2.svg",
    title: "Trusted Experts",
    description: "Our licensed therapists are here to guide you.",
  },
  {
    imageSrc: "/images/evidence3.svg",
    title: "Flexible availability",
    description: "Choose online or in-person sessions—whatever works for you.",
  },
  {
    imageSrc: "/images/evidence4.svg",
    title: "Wide Range of Services",
    description:
      "We offer diverse therapies across all ages to support you.",
  },
];

const WhyChooseUs = () => {
  return (
    <Box maxW={{ md: "95%", xl: "90%" }} mx={"auto"} px={{ base: 4, lg: 0 }}>
      <CustomSmallTitle> OUR PROMISE </CustomSmallTitle>
      <CustomSubHeading highlightText="Experts in mental health care"> </CustomSubHeading>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }}
        gap={{ base: 2, md: 6 }}
        mt={{ base: 3, md: 8 }}
      >
        {cards.map((card, index) => (
          <CardComponent4
            key={index}
            imageSrc={card.imageSrc}
            title={card.title}
            description={card.description}
            hasBorder={index !== cards.length - 1} // Apply border to all except the last card
          />
        ))}
      </Grid>
    </Box>
  );
};

export default WhyChooseUs;
