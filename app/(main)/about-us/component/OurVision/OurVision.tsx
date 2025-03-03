import { Box, Grid } from '@chakra-ui/react';
import CustomSmallTitle from '../../../../component/common/CustomSmallTitle/CustomSmallTitle';
import OurVisionCard from './OurVisionCard';


const cards = [
  {
    imageSrc: "/images/about/integrity.svg",
    title: "Integrity in Care",
    description: "We make every recommendation, treatment, and decision with our clients' best interests in mind.",
  },
  {
    imageSrc: "/images/about/clientfirst.svg",
    title: "Put Clients First",
    description: " Our treatments are designed to create meaningful change in our clients' lives.",
  },
  {
    imageSrc: "/images/about/science.svg",
    title: "Backed By Science",
    description: "We combine empathy with research-backed therapy to support your mental health.",
  },
];
const OurVision = () => {
  return (
    <Box py={16} bg={'#FDFFDD'}>
      <CustomSmallTitle textAlign={'center'}>Our Values</CustomSmallTitle>
      {/* <CustomSubHeading highlightText='Achieve.'>What We Want to </CustomSubHeading> */}

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
        gap={{ base: 2, md: 6 }}
        mt={{ base: 3, md: 8 }}
        maxW={'70%'}
        mx={"auto"}
      >
        {cards.map((card, index) => (
          <OurVisionCard
            key={index}
            imageSrc={card.imageSrc}
            title={card.title}
            description={card.description}
            hasBorder={index !== cards.length - 1} // Apply border to all except the last card
            imageAlign={{ base: 'center', md: 'center' }}
            textAlign={{ base: 'center', md: 'center' }}
          />
        ))}
      </Grid>
    </Box>
  )
}

export default OurVision