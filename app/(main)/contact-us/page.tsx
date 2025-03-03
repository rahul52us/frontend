"use client";
import { Box } from "@chakra-ui/react";
import ContactDetails from "../../component/ContactDetails/ContactDetails";
import ContactUsFormSection from "../../component/ContactUsFormSection/ContactUsFormSection";
import FAQ from "../../component/FAQ/FAQ";
import JoinCommunitySection from "../../component/JoinCommunity/JoinCommunitySection";
import MapComponent from "../../component/common/MapComponent/MapComponent";

const page = () => {
  return (
    <Box>
      <ContactUsFormSection />
      <Box my={{ base: "70px", lg: "140px" }}>
        <ContactDetails />
      </Box>
      <JoinCommunitySection />
      <FAQ />
      <MapComponent />
    </Box>
  );
};

export default page;
