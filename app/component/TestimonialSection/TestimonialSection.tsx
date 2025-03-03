import {
  Box,
  Heading,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import CustomCarousel from "../common/CustomCarousal/CustomCarousal";
import NewTestimonialCard from "../common/NewTestimonialCard/NewTestimonialCard";
import StatsGrid from "../common/StatsComponent/StatsComponrnt";
import CustomSmallTitle from "../common/CustomSmallTitle/CustomSmallTitle";

const testimonials = [
  {
    stars: 5,
    text: "Nikita is a very kind, compassionate, thorough professional who will make you feel very comfortable as you express your life's deepest issues.",
    avatarSrc: "",
    name: "Gitanjali Das",
    time: "6 months ago",
    logoSrc:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
  },
  {
    stars: 5,
    text: "She is a patient listener, she is non-judgmental and she has been a great pillar of support to me in my worst days. I'd highly recommend going to her if you are struggling.",
    avatarSrc: "",
    name: "Anonymous",
    time: "3 months ago",
    logoSrc:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
  },
  {
    stars: 5,
    text: "",
    avatarSrc: "",
    name: "Shagun Mundhra",
    time: "6 months ago",
    logoSrc:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
  },
  {
    stars: 5,
    text: " Mark Twain gave the title of 'Miracle worker' To Helen Keller's teacher. And the same goes for you. You are like a miracle worker for me.",
    avatarSrc: "",
    name: "Anonymous",
    time: "3 months ago",
    logoSrc:
      "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
  },
  // {
  //   stars: 4,
  //   text: "Metamind is the one name I recommend to everyone facing depression or similar challenges. Thank you, Metamind, for providing the best therapy ever!",
  //   avatarSrc: "",
  //   name: "abhilash kumar",
  //   time: "a week ago",
  //   logoSrc:
  //     "https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA",
  // },
];

const statsData = [
  { value: 12, label: "Therapies Offered" },
  { value: 13, label: "Years of Experience" },
  { value: 19000, label: "Therapy Hours Delivered" },
  { value: 2000, label: "Assessments Taken" },
  { value: "100%", label: "Licensed Professional" },
];

const TestimonialSection = ({ bg = "#FDFFDD" }) => {
  const noOfSlides = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const showArrows = useBreakpointValue({ base: false, md: true });
  const showDots = useBreakpointValue({ base: true, lg: false })
  return (
    <Box bg={bg}>
      <Box
        maxW={{ md: "90%" }}
        py={{ base: "3rem", md: "5rem" }}
        px={{ base: 4, md: 0 }}
        mx={"auto"}
      >
        <Text
          textAlign={"center"}
          color={"#DF837C"}
          textTransform={"uppercase"}
          fontSize={{ base: "14px", md: "16px" }}
        >

        </Text>
        <CustomSmallTitle textAlign={{ base: "center" }} ml={{ lg: "0.2rem" }} >OUR TESTIMONIALS </CustomSmallTitle>
        <Heading
          textAlign={"center"}
          as={"h2"}
          fontWeight={400}
          fontSize={{ base: "24px", md: "48px" }}
          my={{ base: 1, md: 2 }}
          px={1}
        >
          Hear from Those Who’ve{" "}
          <Text as={"span"} fontWeight={600}>
            Found Recovery
          </Text>
        </Heading>
        <Box mt={{ base: 4, md: 8 }}>
          <CustomCarousel
            slidesToShow={noOfSlides}
            autoplay={true}
            showArrows={showArrows}
            showDots={showDots}
          >
            {testimonials.map((testimonial, index) => (
              <NewTestimonialCard key={index} {...testimonial} />
            ))}
          </CustomCarousel>
        </Box>
        <StatsGrid statsData={statsData} />
      </Box>
    </Box>
  );
};

export default TestimonialSection;
