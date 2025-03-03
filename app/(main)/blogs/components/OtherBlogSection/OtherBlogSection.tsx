import { Box, Grid } from "@chakra-ui/react";
import CustomCarousel from "../../../../component/common/CustomCarousal/CustomCarousal";
import BlogsCard from "../BlogsCard/BlogsCard";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomSubHeading from "../../../../component/common/CustomSubHeading/CustomSubHeading";

export const otherBlogData = [
  {
    id: 1,
    image: "/images/blogs/eventCard.webp",
    date: "20 March 2025, Thursday",
    title: "Eating Disorders & BPD: The Hidden Connection",
    charges: "NO COST",
    description:
      "This webinar is open for mental health professionals - Counselors, Psychologists, Clinical Psychologists,  Psychiatric Social Workers , Psychiatrists & Mental health educators.",
  },
  // {
  //   id: 2,
  //   image: "/images/blogs/blogCard.png",
  //   date: "18 January",
  //   title: "How to Build a Daily Reading Habit On your Own",
  //   charges: "₹200 /per person",
  //   description:
  //     "Cultivating a reading habit can transform your life. Learn simple techniques to make reading a daily ritual and expand your knowledge effortlessly.",
  // },
  // {
  //   id: 3,
  //   image: "/images/blogs/blogCard.png",
  //   date: "22 January",
  //   title: "The Benefits of Mindfulness for Kids and Students",
  //   charges: "₹200 /per person",
  //   description:
  //     "Mindfulness can help children stay focused, reduce stress, and develop emotional intelligence. Here’s how to introduce mindfulness into their daily routine.",
  // },
  // {
  //   id: 4,
  //   image: "/images/blogs/blogCard.png",
  //   date: "22 January",
  //   title: "The Benefits of Mindfulness for Kids and Students",
  //   charges: "₹200 /per person",
  //   description:
  //     "Mindfulness can help children stay focused, reduce stress, and develop emotional intelligence. Here’s how to introduce mindfulness into their daily routine.",
  // },
];

const OtherBlogSection = () => {
  return (
    <Box py={4}>
      {/* Titles Section */}
      <Box textAlign="center" mb={6}>
        <CustomSmallTitle>You might like</CustomSmallTitle>
        <CustomSubHeading>Other blogs</CustomSubHeading>
      </Box>

      {/* Desktop Grid Layout */}
      <Box display={{ base: "none", lg: "block" }}>
        <Grid templateColumns={"1fr 1fr 1fr"} gap={4} maxW={"85%"} mx={"auto"}>
          {otherBlogData.map((blog, index) => (
            <BlogsCard key={index} {...blog} otherBlog={true} />
          ))}
        </Grid>
      </Box>

      {/* Mobile Carousel Layout */}
      <Box display={{ base: "block", lg: "none" }} px={3}>
        <CustomCarousel
          slidesToShow={1}
          autoplay={true}
          showArrows={false}
          showDots={true}
        >
          {otherBlogData.map((blog) => (
            <BlogsCard key={blog.id} {...blog} otherBlog={true} />
          ))}
        </CustomCarousel>
      </Box>
    </Box>
  );
};

export default OtherBlogSection;
