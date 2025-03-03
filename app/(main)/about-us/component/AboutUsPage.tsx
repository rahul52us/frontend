import { Box } from "@chakra-ui/react";
import TestimonialSection from "../../../component/TestimonialSection/TestimonialSection";
import AboutHeroSection from "./AboutHeroSection/AboutHeroSection";
import CareersSection from "./Careers/Careers";
import HowWeWorkSection2 from "./HowWeWorkSection2/HowWeWorkSection2";
import Mission from "./Mission/Mission";
import MissionStatement from "./MissionStatement/MissionStatement";
import OurTeam from "./OurTeam/OurTeam";
import OurVision from "./OurVision/OurVision";

const AboutUsPage = () => {
  return (
    <Box>
      <AboutHeroSection />
      <Box mt={{ base: "40px", lg: "60px" }}>
        <Mission />
      </Box>
      <Box mt={{ base: "40px", lg: "100px" }}>
        <MissionStatement />
      </Box>
      <OurVision />
      <Box mt={{ base: "40px", lg: "80px" }} >

        <OurTeam />
      </Box>
      <Box>
        <TestimonialSection bg="transparent" />
      </Box>
      <Box mt={{ lg: "20px" }}>
        <HowWeWorkSection2 />
      </Box>
      <Box >
        <CareersSection />
      </Box>
    </Box>
  );
};

export default AboutUsPage;
