"use client";  // Ensure this is a Client Component

import { Suspense, useRef } from "react";
import { Box } from "@chakra-ui/react";
import BookCallComponent from "../../component/common/BookCallComponent/BookCallComponent";
import FAQ from "../../component/FAQ/FAQ";
import HowWeWork from "../../component/HowWeWork/HowWeWork";
import PsychologistSection from "../../component/PsychologistSection/PsychologistSection";
import TestimonialSection2 from "../../component/TestimonialSection2/TestimonialSection2";
import TherapistHeroSection from "../../component/TherapistHeroSection/TherapistHeroSection";
import WhyChooseUs from "../../component/WhyChooseUs/WhyChooseUs";


const TherapistPageContent = () => {
  const psychologistRef = useRef<HTMLDivElement>(null);
  // const searchParams = useSearchParams();


  const scrollToPsychologist = () => {
    if (psychologistRef.current) {
      psychologistRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // useEffect(() => {
  //   if (searchParams.get("scrollTo") === "psychologist" && psychologistRef.current) {
  //     setTimeout(() => {
  //       psychologistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //     }, 300);
  //   }
  // }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Box>
        <TherapistHeroSection onButtonClick={scrollToPsychologist} />
        <Box my={{ base: "70px", md: "4rem", lg: "140px" }}>
          <WhyChooseUs />
        </Box>
        <Box ref={psychologistRef}>
          <PsychologistSection />
        </Box>
        <BookCallComponent showText={false} />
        <HowWeWork onButtonClick={scrollToPsychologist} />
        <Box my={{ base: "70px", md: "4rem", lg: "140px" }}>
          <TestimonialSection2 />
        </Box>
        <FAQ />
      </Box>
    </Suspense>
  );
};

export default TherapistPageContent;
