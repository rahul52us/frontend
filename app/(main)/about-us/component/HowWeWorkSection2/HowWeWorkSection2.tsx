import { Box, Grid, Heading } from "@chakra-ui/react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CardComponent5 from "./CardComponent5";
import CustomCarousel from "../../../../component/common/CustomCarousal/CustomCarousal";
const dummyData = [
  {
    image: "/images/about/blog1.webp",
    date: "12 January",
    title: "How to Choose the Right Therapist for Your Mental Health",
    description:
      "Turn everyday moments into learning opportunities with simple, engaging activities. Discover how play can boost your child’s curiosity, creativity, and confidence in just a few easy steps!",
    link: "#",
  },
  {
    image: "/images/about/blog3.webp",
    date: "29 January",
    title: "The Benefits of Psychotherapy for Anxiety and Stress",
    description:
      "Psychotherapy helps you understand and manage your anxiety and stress. It teaches you ways to calm your mind and handle tough situations better. Talking to a therapist can make you feel heard and supported. Over time, you may feel more in control and less overwhelmed. It can improve your daily life and mental health.",
    link: "#",
  },
  {
    image: "/images/about/blog2.webp",
    date: "17 February",
    title: "What Happens During Your First Therapy Session?",
    description:
      "In your first therapy session, the therapist will welcome you and make sure you feel comfortable. They will ask about your concerns and explain how therapy works. You might fill out a form to help them understand your background. Together, you’ll talk about your goals and a plan for future sessions. The therapist is there to support you, not judge you.",
    link: "#",
  },
];

const HowWeWorkSection2 = () => {
  return (
    <Box bg="#F3F7F7" py={{ base: "20px", lg: "60px" }}>
      <CustomSmallTitle> Blogs and Resources </CustomSmallTitle>
      <Box textAlign="center" mt={2} px={{ base: 3, md: 8 }} py={4}>
        <Heading
          as="h2"
          fontSize={{ base: "16px", md: "32px" }}
          fontWeight={400}
          lineHeight={{ base: "22px", md: "38px" }} // Mobile: Compact, Desktop: More spacing
          maxW={{ base: "90%", md: "70%" }}
          mx="auto"
        >
          Explore simple, practical articles and tools designed to help you take
          small, meaningful steps toward better mental health.
        </Heading>
        {/* <Heading as={"h2"} fontSize={{ base: "24px", md: "44px" }}>
          Outcome-Driven Therapy.
        </Heading> */}
      </Box>

      <Grid
        templateColumns={"1fr 1fr 1fr"}
        maxW={{ lg: "80%", xl: "75%" }}
        mx={"auto"}
        gap={6}
        mt={8}
        display={{ base: "none", lg: "grid" }}
      >
        {dummyData.map((item, index) => (
          <CardComponent5 key={index} {...item} />
        ))}
      </Grid>
      <Box display={{ base: "block", lg: "none" }} maxW={{ base: "95%" }} mx={"auto"}>
        {" "}
        <CustomCarousel autoplay={true} showArrows={false}>
          {dummyData.map((item, index) => (
            <CardComponent5 key={index} {...item} />
          ))}
        </CustomCarousel>
      </Box>
    </Box>
  );
};

export default HowWeWorkSection2;
