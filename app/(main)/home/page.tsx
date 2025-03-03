"use client";
// src/app/game/page.tsx
import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import BookCallComponent from "../../component/common/BookCallComponent/BookCallComponent";
import CardComponent2 from "../../component/common/CardComponent2/CardComponent2";
import CustomSmallTitle from "../../component/common/CustomSmallTitle/CustomSmallTitle";
import HeroSection from "../../component/common/HeroSection/HeroSection";
import KnowYourselfSection from "../../component/common/KnowYourselfSection/KnowYourselfSection";
import OurValues from "../../component/common/OurValues/OurValues";
import ProvidersSection from "../../component/common/ProvidersSection/ProvidersSection";
import ContactUs from "../../component/ContactUs/ContactUs";
import FAQ from "../../component/FAQ/FAQ";
import OurOfferings from "../../component/OurOfferings/OurOfferings";
import TestimonialSection from "../../component/TestimonialSection/TestimonialSection";
// import stores from "../../store/stores";
import { observer } from "mobx-react-lite";
// import { toJS } from "mobx";

const cardData2 = [
  {
    image: "/icons/home/therapy1.svg",
    title: "Evidence-Based Success:",
    description:
      "Metamind therapists practice evidence-based therapies. Studies show that 67% of clients see meaningful improvements with evidence-based therapy compared to people who don’t take treatment. Searching for a psychologist in Noida or best psychiatrist in noida who combines science and compassion? You’ll find it here.",
    boldWords: ["see meaningful improvements", "67%", "evidence-based therapy "],
  },
  {
    image: "/icons/home/therapy2.webp",
    title: "Personalization Treatment Plans",
    description:
      "In therapy “one size doesn’t fit all” so we tailor your treatment by taking feedback from you. It helps clients complete treatment & achieve better results, research shows.",
    boldWords: ["one size doesn’t fit all", "taking feedback ", "achieve better results"],
  },
  {
    image: "/icons/home/therapy3.svg",
    title: "Dynamic Progress Monitoring",
    description:
      "We monitor your treatment regularly using standardized tools to ensure you’re always on track. This reduces any setbacks in therapy and helps you see how much you have progressed. Let us guide your journey of finding the best psychotherapist in Noida.",
    boldWords: ["standardized tools", "standardized tools", "progressed"],
  },
];


const Home = observer(()  => {
  // const {companyStore : {getPageContent, companyDetails}} = stores

  // console.log(toJS(getPageContent('home')))
  // console.log(toJS(companyDetails))

  return (
    <Box>
      {/* <Text fontSize="xl" fontWeight="bold">Welcome to the Home Page</Text> */}
      <HeroSection />
      <Box my={{ base: "2rem", md: "4rem", lg: "6rem" }}>
        <OurValues />
      </Box>

      <OurOfferings />
      <Box
        maxW={{ md: "90%" }}
        mx={"auto"}
        my={{ base: "70px", md: "4rem", lg: "80px" }}
        // py={{ base: "2rem", md: "3rem" }}
        px={{ base: 4 }}
      >
        {/* <Center> */}
        <Text
          color={"#DF837C"}
          textTransform={"uppercase"}
          textAlign={"center"}
          fontSize={{ base: "14px", md: "16px" }}
        >
        </Text>
        <CustomSmallTitle> science behind our practice</CustomSmallTitle>
        <Heading
          textAlign={"center"}
          as={"h2"}
          fontWeight={400}
          fontSize={{ base: "24px", md: "48px" }}
          my={2}
        >
          Care that goes{" "}
          <Text as={"span"} fontWeight={600}>
            beyond talking
          </Text>
        </Heading>
        <Text textAlign={"center"} color={"#2C2B2B"} fontSize={{ base: "14px", md: "16px" }}

          lineHeight={{ base: "24px", md: "32px" }}
          px={{ base: 5, md: 4, lg: 0 }}
        >
          We combine science and care to help you achieve better
          recovery
        </Text>
        {/* </Center> */}
        <Grid
          templateColumns={{ md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
          gap={{ base: 2, md: 4 }}
          mt={{ base: 4, lg: 10 }}
        >
          {cardData2.map((card, index) => {
            const borderRadius = {
              topLeft: index === 0 ? "50px" : "10px",
              bottomRight: index === cardData2.length - 1 ? "50px" : "10px",
            };

            return (
              <CardComponent2
                key={index}
                image={card.image}
                title={card.title}
                description={card.description}
                boldWords={card.boldWords} // Pass the bold words array
                borderRadius={borderRadius}
              />
            );
          })}

        </Grid>
      </Box>

      <Box
        //  my={{base:"2rem",lg:"4rem"}}
        my={{ base: "20px", md: "4rem", lg: "40px" }}
        maxW={"90%"} mx={"auto"}>
        <ProvidersSection />
      </Box>
      <TestimonialSection />

      <Box>
        <BookCallComponent showText={true} />
      </Box>
      <Box
        my={{ base: "70px", md: "4rem", lg: "80px" }}

        maxW={"95%"} mx={"auto"}>
        <KnowYourselfSection />
      </Box>

      {/* <Box maxW={'60%'} mx={'auto'} my={12}>
      <TestimonialCard/>
      </Box> */}
      <FAQ />
      <Box>
        <ContactUs />
      </Box>
    </Box>
  );
})

export default Home;