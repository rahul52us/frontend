import { Box, Heading, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";

const BlogFeatureCard = () => {
  const [tabChange, setTabChange] = useState('blogs');
  const handleTabChange = (tab: string) => {
    setTabChange(tab);
  }
  return (
    <Box
      position="relative"
      maxW={"95%"}
      mx={"auto"}
      borderRadius="lg"
      overflow="hidden"
      width="full"
      height={{ base: "50vh", md: "60vh", lg: "75vh" }}
      backgroundImage="url('/images/blogs/blogHero.png')"
      backgroundSize="cover"
      backgroundPosition="center"
      display="flex"
      alignItems="end"
      p={{ base: 4, md: 6 }}
      color="white"
    >
      {/* Tab Navigation */}
      <Tabs position="absolute" top={6} left={12} variant={"soft-rounded"} size={'sm'}>
        <TabList borderRadius="full" bg="blackAlpha.200" color="white" w={"fit-content"} border={'1px solid white'}>
          <Tab onClick={() => handleTabChange('events')} _selected={{ color: "brand.100", bg: "white", }} color={'white'} >Events</Tab>
          <Tab onClick={() => handleTabChange('blogs')} _selected={{ color: "brand.100", bg: "white", }} color={'white'}>Blogs</Tab>
        </TabList>


      </Tabs>
      {tabChange === 'blogs' ? (

        <Box
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          maxW={{ base: "100%", lg: "95%" }}
          mx={'auto'}
        >
          <CustomSmallTitle textAlign={{ base: "start", md: "start" }}>
            FEATURED
          </CustomSmallTitle>
          <Heading fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} mt={1} fontWeight={600}>
            How to Choose the Right Therapist for Your Mental Health
          </Heading>
          <Text fontSize={{ base: "sm", lg: "lg" }} mt={2} w={{ base: "100%", lg: "80%" }} fontWeight={400} noOfLines={{ base: 2, md: 3 }}>
            Choosing the right therapist is important for your mental health.
            Look for someone you feel comfortable with and who understands your problems.
            Check their experience, ask about their approach, and see if it matches what you need. It&apos;s okay to try a few before deciding.
            Your mental health matters, so take your time to find the right fit.
          </Text>
        </Box>
      ) : (
        <Box
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          maxW={{ base: "100%", lg: "95%" }}
          mx={'auto'}
        >
          <CustomSmallTitle textAlign={{ base: "start", md: "start" }}>
            FEATURED
          </CustomSmallTitle>
          <Heading fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} mt={1} fontWeight={600}>
            The Power of Mindfulness: A Guide to Reducing Stress
          </Heading>
          <Text fontSize={{ base: "sm", lg: "lg" }} mt={2} w={{ base: "100%", lg: "80%" }} fontWeight={400} noOfLines={{ base: 2, md: 3 }}>
            Mindfulness is a simple yet powerful practice that helps you focus on the here and now, reducing anxiety
            and improving emotional well-being. In this blog, we’ll explore easy mindfulness exercises you can
            incorporate into your daily routine.
          </Text>
        </Box>
      )}

    </Box>
  );
};

export default BlogFeatureCard;
