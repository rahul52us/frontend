import { Box, Text } from "@chakra-ui/react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomSubHeading from "../../../../component/common/CustomSubHeading/CustomSubHeading";
import TeamGrid from "./TeamGrid";

const OurTeam = () => {
  return (
    <Box>
      <CustomSmallTitle> OUR TEAM</CustomSmallTitle>
      <CustomSubHeading highlightText="">People Who Truly Care</CustomSubHeading>

      <Text
        textAlign={'center'}
        color={'#4D4D4D'}
        maxW={{ lg: '90%' }}  // Adjust width to fit better
        mx={'auto'}
        px={{ base: 6, lg: 8 }}  // Added padding on larger screens
        whiteSpace="normal"  // Ensures the content stays on the same line
      >
        Our diverse team of <strong>passionate professionals</strong> who work together to bring scientific, holistic care to those in need.
      </Text>

      <TeamGrid />
    </Box>
  );
};

export default OurTeam;
