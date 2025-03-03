import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Tag,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import stores from "../../store/stores";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";
import CustomSubHeading from "../common/CustomSubHeading/CustomSubHeading";
import PsychologistCard from "../common/PsychologistCard/PsychologistCard";
import "../FAQ/FAQAccordion/scroll.css";

const psychologists = [
  {
    image:
      "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg?t=st=1737742136~exp=1737745736~hmac=7f92af7c2dfd86859e2093427f1622c4170452d9bd8ba5c0275a1cdaadb4bc91&w=1060",
    name: "Dr. Priya Sharma",
    designation: "Licensed Clinical Psychologist (Ph.D.)",
    experience: 13,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    expertise: ["Anger",
      "Depression",
      "Panic",
      "Anxiety",
      "Trauma",
      "Stress",
      "Loneliness",
      "Self-esteem",
      "Addiction",
      "Sleep",
      "Self-harm",
      "Autism",
      "Bipolar Disorder",
      "Eating Disorders",
      "Adolescent Problems",
      "Grief & Loss",
      "Obsessive Compulsive Disorder",
      "Health Anxiety",
      "Attention Deficit Hyperactivity Disorder",
      "Social Anxiety",
      "Burnout",
      "Post-partum Depression",
      "Personality Concerns",
      "Interpersonal Relationship Concerns"],
    availability: ["Online", "In-Person"],
    price: 1400,
  },
  {
    image:
      "https://img.freepik.com/free-photo/young-female-doctor-with-arms-crossed-smiling-camera_23-2148548833.jpg",
    name: "Dr. Rajat Gupta",
    designation: "Counseling Psychologist (M.Sc.)",
    experience: 8,
    bio: "Specialist in Cognitive Behavioral Therapy and family counseling.",
    expertise: ["CBT", "Family Counseling", "Stress Management", "ADHD", "ADHD", "ADHD"],
    availability: ["Online"],
    price: 1200,
  },
  {
    image:
      "https://img.freepik.com/free-photo/young-female-doctor-with-arms-crossed-smiling-camera_23-2148548833.jpg",
    name: "Dr. Rajat Gupta",
    designation: "Counseling Psychologist (M.Sc.)",
    experience: 8,
    bio: "Specialist in Cognitive Behavioral Therapy and family counseling.",
    expertise: ["Anger",
      "Depression",
      "Panic",
      "Anxiety",
      "Trauma",
      "Stress",
      "Loneliness",
      "Self-esteem",
      "Addiction",
      "Sleep",
      "Self-harm",
      "Autism",
      "Bipolar Disorder",
      "Eating Disorders",
      "Adolescent Problems",
      "Grief & Loss",
      "Obsessive Compulsive Disorder",
      "Health Anxiety",
      "Attention Deficit Hyperactivity Disorder",
      "Social Anxiety",
      "Burnout",
      "Post-partum Depression",
      "Personality Concerns",
      "Interpersonal Relationship Concerns"],
    availability: ["Online"],
    price: 1200,
  },
  {
    image:
      "https://img.freepik.com/free-photo/young-female-doctor-with-arms-crossed-smiling-camera_23-2148548833.jpg",
    name: "Dr. Rajat Gupta",
    designation: "Counseling Psychologist (M.Sc.)",
    experience: 8,
    bio: "Specialist in Cognitive Behavioral Therapy and family counseling.",
    expertise: ["Anger",
      "Depression",
      "Panic",
      "Anxiety",
      "Trauma",
      "Stress",
      "Loneliness",
      "Self-esteem",
      "Addiction",
      "Sleep",
      "Self-harm",
      "Autism",
      "Bipolar Disorder",
      "Eating Disorders",
      "Adolescent Problems",
      "Grief & Loss",
      "Obsessive Compulsive Disorder",
      "Health Anxiety",
      "Attention Deficit Hyperactivity Disorder",
      "Social Anxiety",
      "Burnout",
      "Post-partum Depression",
      "Personality Concerns",
      "Interpersonal Relationship Concerns"],
    availability: ["Online"],
    price: 1200,
  },
];

// const allExpertise = [
//   "Anxiety Disorder",
//   "Depression",
//   "ADHD",
//   "Stress Management",
//   "CBT",
//   "Family Counseling",
//   "OCD",
//   "Mood Disorder",
//   "And More...",
// ];

const allExpertise = [
  "Anger",
  "Depression",
  "Panic",
  "Anxiety",
  "Trauma",
  "Stress",
  "Loneliness",
  "Self-esteem",
  "Addiction",
  "Sleep",
  "Self-harm",
  "Autism",
  "Bipolar Disorder",
  "Eating Disorders",
  "Adolescent Problems",
  "Grief & Loss",
  "Obsessive Compulsive Disorder",
  "Health Anxiety",
  "Attention Deficit Hyperactivity Disorder",
  "Social Anxiety",
  "Burnout",
  "Post-partum Depression",
  "Personality Concerns",
  "Interpersonal Relationship Concerns",
];
const visibleTagsCount = 8;

const PsychologistSection = observer(() => {
  const { userStore: { getAllUsers } } = stores
  const { userStore: { therapist } } = stores
  const [selectedExpertises, setSelectedExpertises] = useState([]);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    getAllUsers({ page: 1, limit: 30 });
  }, [getAllUsers])


  const handleFilterClick = (expertise) => {
    setSelectedExpertises((prev) =>
      prev.includes(expertise)
        ? prev.filter((item) => item !== expertise)
        : [...prev, expertise]
    );
  };

  const filteredPsychologists =
    selectedExpertises.length > 0
      ? psychologists.filter((psychologist) =>
        selectedExpertises.some((expertise) =>
          psychologist.expertise.includes(expertise)
        )
      )
      : psychologists;

  return (
    <Box mt={{ base: "70px", lg: "140px" }} py={12} bg={'#F3F7F7'}>

      <Box maxW={{ base: "95%", xl: "90%" }} mx={"auto"} >
        <CustomSmallTitle>MEET OUR THERAPISTS</CustomSmallTitle>
        <CustomSubHeading highlightText="">
          What are you struggling with?
        </CustomSubHeading>

        <Text textAlign={'center'} color={'#434343'}>
          We carefully select our therapists and work exclusively with the most experienced ones. Explore our services by symptom or condition.
        </Text>
        {isMobile ? (
          <Select
            placeholder="Select expertise"
            onChange={(e) => handleFilterClick(e.target.value)}
            border="1px solid #8A8A8A"
            color="#8A8A8A"
            colorScheme="teal"
            mt={3}
          >
            {allExpertise.map((expertise, index) => (
              <option key={index} value={expertise}>
                {expertise}
              </option>
            ))}
          </Select>
        ) : (
          <Flex wrap="wrap" gap={{ md: 2, xl: 4 }} mt={8} justify="center">
            {allExpertise.slice(0, visibleTagsCount).map((expertise, index) => (
              <Tag
                key={index}
                py={{ md: 2, xl: 2.5 }}
                px={{ md: 4, xl: 6 }}
                fontSize="sm"
                border="1px solid"
                borderColor={selectedExpertises.includes(expertise) ? "#188691" : "#8A8A8A"}
                color={selectedExpertises.includes(expertise) ? "white" : "#8A8A8A"}
                bg={selectedExpertises.includes(expertise) ? "#045B64" : "transparent"}
                rounded="full"
                cursor="pointer"
                onClick={() => handleFilterClick(expertise)}
              >
                {expertise}
              </Tag>
            ))}
            {allExpertise.length > visibleTagsCount && (
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<Icon as={IoFilterOutline} />}
                  // colorScheme="teal"
                  bg={'#045B64'}
                  color={'white'}
                  variant="solid"
                  _hover={{ bg: "teal.500" }}
                  px={6}
                // rounded="full"
                >
                  Filter
                </MenuButton>
                <MenuList
                  maxH="250px"  // Fixed height for scrollable dropdown
                  overflowY="auto"
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "6px",  // Thin scrollbar
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#188691", // Teal color for scrollbar
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f0f0f0", // Light background for contrast
                    },
                  }}
                >
                  {allExpertise.slice(visibleTagsCount).map((expertise, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => handleFilterClick(expertise)}
                      bg={selectedExpertises.includes(expertise) ? "#E6F7F8" : "white"}
                      _hover={{ bg: "#D5F1F3" }} // Soft hover effect
                      py={2} // Adjust padding for better spacing
                    >
                      {expertise}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}

          </Flex>
        )}

        {/* Display Psychologists based on filter */}
        {filteredPsychologists.length === 0 ? (
          <Text mt={12} textAlign={"center"} fontSize={"xl"} color="gray.500">
            No Therapist found.
          </Text>
        ) : (
          <Box
            maxH={"80vh"}
            overflow={"auto"}
            pr={{ base: 1, md: 4 }}
            // mx={{ base: 2, md: 0 }}
            className="customScrollBar"
            my={10}
            mx={{ base: 2, md: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Grid
                templateColumns={{ lg: "1fr 1fr" }}
                gap={{ base: 2, xl: 6 }}
                justifyContent={"center"}
              >
                {therapist?.data?.data?.map((psychologist, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <PsychologistCard data={psychologist} />
                  </motion.div>
                ))}
              </Grid>
            </motion.div>
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default PsychologistSection;
