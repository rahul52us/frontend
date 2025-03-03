import { Box, Center, FormControl, FormLabel, Grid, Heading, Input, Select, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import BlogsCard from "./BlogsCard";
import { blogData } from "./constant";
import { otherBlogData } from "../OtherBlogSection/OtherBlogSection";
import { useState } from "react";

const BlogCardSection = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  // const [setSelectedTopic] = useState("");
  // const [setSelectedAudience] = useState("");

  const blogTopics = ["Therapy", "Depression", "Anxiety"];
  const blogAudiences = ["Patients", "Therapists", "General Public"];

  const eventTopics = ["Workshops", "Webinars", "Seminars"];
  const eventAudiences = ["Students", "Professionals", "General Public"];

  // const filterBlogs = (blogs) => {
  //   return blogs.filter((blog) =>
  //     (selectedTopic ? blog.topic === selectedTopic : true) &&
  //     (selectedAudience ? blog.audience === selectedAudience : true)
  //   );
  // };
  const filterBlogs = (blogs) => {
    return blogs; // Filtering ko disable kar diya, ab select hone ke baad bhi effect nahi hoga
  };

  return (
    <Box>
      <CustomSmallTitle>Resources & Insights</CustomSmallTitle>

      <Heading
        mt={2}
        as={"h2"}
        textAlign={"center"}
        fontSize={{ base: "24px", md: "44px" }}
        fontWeight={400}
        px={{ base: 2, md: 0 }}
      >
        <strong style={{ fontWeight: 600 }}>Explore Blogs, Events & More </strong>
      </Heading>

      <Tabs
        variant='solid-rounded'
        colorScheme='teal'
        size={'sm'}
        mt={{ base: 6, lg: 12 }}
        onChange={(index) => {
          setSelectedTab(index);
          // setSelectedTopic("");
          // setSelectedAudience("");
        }}
      >
        <Center>
          <TabList gap={2} justifyContent={'center'} p={1} bg={'#F3F7F7'} rounded={'full'} w={'fit-content'}>
            <Tab fontWeight={400} _selected={{ color: 'white', bg: "brand.100" }} color={'brand.100'} py={1} fontSize={'lg'} w={'100px'}>
              Blogs
            </Tab>
            <Tab fontWeight={400} _selected={{ color: 'white', bg: "brand.100" }} color={'brand.100'} py={1} w={'100px'} fontSize={'lg'}>
              Events
            </Tab>
          </TabList>
        </Center>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} px={4} gap={6} mt={8}>
          <FormControl>
            <FormLabel fontWeight={700}>Search</FormLabel>
            <Input size={'sm'} placeholder="I'm looking for" variant={'flushed'} borderColor={'gray.400'} focusBorderColor='#8A8A8A' />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight={700}>Topic</FormLabel>
            <Select size={'sm'} placeholder="Select Topic" variant={'flushed'} borderColor={'gray.400'} focusBorderColor='#8A8A8A' onChange={(e) => (e.target.value)}>
              {(selectedTab === 0 ? blogTopics : eventTopics).map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontWeight={700}>Audience</FormLabel>
            <Select size={'sm'} placeholder="Select Audience" variant={'flushed'} borderColor={'gray.400'} focusBorderColor='#8A8A8A' onChange={(e) => (e.target.value)}>
              {(selectedTab === 0 ? blogAudiences : eventAudiences).map((audience) => (
                <option key={audience} value={audience}>{audience}</option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <TabPanels>
          {/* Blogs Tab */}
          <TabPanel px={"0"}>
            <Box
              maxH="550px"
              overflowY="auto"
              px={2}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "#188691 #f0f0f0",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#188691", borderRadius: "4px" },
                "&::-webkit-scrollbar-track": { background: "#f0f0f0" },
              }}
            >
              {filterBlogs(blogData).length > 0 ? (
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  {filterBlogs(blogData).map((blog) => (
                    <BlogsCard key={blog.id} {...blog} otherBlog={false} />
                  ))}
                </Grid>
              ) : (
                <Text textAlign="center" mt={2}>No blogs available.</Text>
              )}
            </Box>
          </TabPanel>

          {/* Events Tab */}
          <TabPanel px={"0"}>
            <Box
              maxH="550px"
              overflowY="auto"
              px={2}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "#188691 #f0f0f0",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#188691", borderRadius: "4px" },
                "&::-webkit-scrollbar-track": { background: "#f0f0f0" },
              }}
            >
              {filterBlogs(otherBlogData).length > 0 ? (
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  {filterBlogs(otherBlogData).map((blog) => (
                    <BlogsCard key={blog.id} {...blog} otherBlog={true} />
                  ))}
                </Grid>
              ) : (
                <Text textAlign="center" mt={2}>No events available.</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>


      </Tabs>
    </Box>
  );
};

export default BlogCardSection;
