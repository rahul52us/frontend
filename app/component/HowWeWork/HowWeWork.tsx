import { Box, Heading } from "@chakra-ui/react";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";
import StepsComponent from "./element/StepsComponent";

const HowWeWork = ({ onButtonClick }) => {
  const steps = [
    {
      id: "01",
      title: "Tell us about your concerns",
      description:
        "Choose your concerns from our list of conditions or share how you’re feeling.",
      image: "/images/workStep12.png",
      imageStyles: { mt: -6, h: "200px", w: "450px" }
    },
    {
      id: "02",
      title: "Find Your Best Therapist Fit",
      description:
        "Find a licensed therapist that suits your needs, or let us recommend one for you.",
      image: "/images/workStep2.png",
      imageStyles: { mt: -2, h: "200px", w: "340px" }
    },
    {
      id: "03",
      title: "Begin Therapy",
      description:
        "Get a personalized plan and ongoing support to help you feel betterYou can meet your therapist online, in-person or both- whatever is convenient for you. Discuss your concerns in the session, and begin with your personalized care plan.",
      image: "/images/workStep3.png",
      imageStyles: { mt: -2, h: "200px", w: "340px" }
    },
  ];
  return (
    <Box my={20} maxW={{ base: "90%", lg: "80%", xl: "75%" }} mx={"auto"}>
      <CustomSmallTitle> HOW WE WORK</CustomSmallTitle>
      <Heading
        fontSize={{ base: "24px", md: "44px" }}
        as={"h2"}
        fontWeight={400}
        textAlign={"center"}
      >
        Here’s How You Can Get Started
      </Heading>
      <Heading
        fontSize={{ base: "24px", md: "44px" }}
        as={"h2"}
        fontWeight={600}
        textAlign={"center"}
      >
        {/* Outcome-driven therapy. */}
      </Heading>
      <Box mt={{ base: 8, lg: 14 }}>
        <StepsComponent steps={steps} onButtonClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default HowWeWork;
