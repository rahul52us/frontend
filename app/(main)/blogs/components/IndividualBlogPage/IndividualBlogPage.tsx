import { Box, Button, Center, Flex, Grid, Heading, Icon, Image, Link, Text, VStack } from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { IoShareSocialOutline } from 'react-icons/io5';

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/metamind-healthcare/",
    icon: FaLinkedinIn
  },
  {
    name: "Twitter",
    url: "https://x.com/metamindhealth",
    icon: FaTwitter
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/metamindhealth/",
    icon: FaInstagram
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61562244046160",
    icon: FaFacebook
  },
];

const IndividualBlogPage = () => {
  return (
    <Box maxW={{ base: "95%", md: "90%" }} mx="auto">
      {/* Blog Title and Description */}
      <Box maxW="800px" mx="auto" px={{ base: 2, md: 4 }}>
        <Heading as="h1" textAlign="center" fontWeight={600} mb={2} fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
          The Power of Mindfulness: A Guide to Reducing Stress
        </Heading>
        <Text color="#616161" textAlign="center" fontSize={{ base: "sm", md: "md" }}>
          Mindfulness is a simple yet powerful practice that helps you focus on the here and now.
        </Text>
      </Box>

      {/* Blog Image */}
      <Image
        alt="individualImage"
        borderTopRightRadius="50px"
        borderBottomLeftRadius="50px"
        mt={6}
        h={{ base: "50vh", md: "80vh" }}
        objectFit="cover"
        w="100%"
        src="/images/blogs/mindful.png"
      />

      {/* Main Content Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "0.75fr 4fr 1fr" }} // Stack columns on mobile, side by side on tablet and desktop  
        gap={{ base: 6, md: 4 }}
        my={{ base: 6, md: 12 }}
      >
        {/* Social Shares Section */}
        <Box>
          <Box>
            <Center>
              <Icon as={IoShareSocialOutline} boxSize={5} />
            </Center>
            <Text mt={1} textAlign="center" fontWeight={700} lineHeight={1} fontSize="sm">
              shares<br />996K
            </Text>
          </Box>
          <Flex
            direction={{ base: "row", md: "column" }} // Horizontal on mobile/tablet, vertical on desktop  
            align="center"
            justify="center"
            gap={{ base: 3, md: 1 }}
            mt={6}
          >
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.url}>
                <Box
                  boxSize={8}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  rounded="full"
                  bg="brand.100"
                  _hover={{ color: "gray.300" }}
                  mb={{ base: 0, md: 3 }} // Add margin bottom for vertical layout  
                  mr={{ base: 3, md: 0 }} // Add margin right for horizontal layout  
                >
                  <Icon as={social.icon} boxSize="60%" color="white" />
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Blog Content Section */}
        <Box pr={{ base: 0, md: 4 }}>
          <VStack align="start" spacing={6}>
            <Heading as="h2" size={{ base: "md", md: "lg" }}>
              Introduction
            </Heading>
            <Text color="#757575" fontSize={{ base: "sm", md: "md" }}>
              In today&apos;s fast-paced world, stress has become an unavoidable part of life. Whether it&apos;s work deadlines, personal
              responsibilities, or social obligations, stress can negatively impact our mental and physical well-being. The
              practice of mindfulness offers a powerful way to manage stress, improve focus, and enhance emotional resilience.
            </Text>

            <Heading as="h3" size={{ base: "sm", md: "md" }}>
              What is Mindfulness?
            </Heading>
            <Text color="#757575" fontSize={{ base: "sm", md: "md" }}>
              Mindfulness is the practice of being fully present in the moment without judgment.
              It’s about observing your thoughts and emotions without getting caught up in them.
              Research shows that mindfulness can lower cortisol levels, enhance concentration, and promote a sense of inner peace.
              <br />
              <strong>Key Benefits of Mindfulness:</strong>
              <br />✔ Reduces stress and anxiety
              <br />✔ Improves focus and concentration
              <br />✔ Enhances emotional regulation
              <br />✔ Boosts overall happiness and well-being
            </Text>

            <Heading as="h3" size={{ base: "sm", md: "md" }}>
              What is Mindfulness?
            </Heading>
            <Text color="#757575" fontSize={{ base: "sm", md: "md" }}>
              Mindfulness is the practice of being fully present in the moment without judgment.
              It’s about observing your thoughts and emotions without getting caught up in them.
              Research shows that mindfulness can lower cortisol levels, enhance concentration, and promote a sense of inner peace.
              <br />
              <strong>Key Benefits of Mindfulness:</strong>
              <br />✔ Reduces stress and anxiety
              <br />✔ Improves focus and concentration
              <br />✔ Enhances emotional regulation
              <br />✔ Boosts overall happiness and well-being
            </Text>

            <Heading as="h3" size={{ base: "sm", md: "md" }}>
              Simple Mindfulness Techniques to Try
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }}>
              <b>1. Deep Breathing Exercises:</b><br />
              Take a few minutes to focus on your breath. Inhale deeply through your nose, hold for a few seconds, and exhale slowly. This simple practice calms your nervous system and promotes relaxation.<br />
              <b>2. Body Scan Meditation:</b><br />
              Lie down or sit comfortably and bring your attention to different parts of your body, starting from your toes to your head. This helps release tension and enhances body awareness.<br />
              <b>3. Mindful Walking:</b><br />
              Take a slow, intentional walk, focusing on each step and the sensations around you. Notice the feeling of the ground beneath your feet, the sounds of nature, and the rhythm of your breath.<br />
              <b>4. Gratitude Journaling:</b><br />
              At the end of each day, write down three things you’re grateful for. This practice shifts your focus from stress to appreciation, boosting overall positivity.
            </Text>


          </VStack>
        </Box>

        {/* Contact Section */}
        <Box px={{ base: 2, md: 4 }} mt={{ base: 6, md: 0 }}>
          <Text fontWeight={700} fontSize={{ base: "xs", md: "lg" }} whiteSpace="nowrap">
            Contact Us Right Now
          </Text>
          <Text color="#616161" fontSize={{ base: "sm", md: "md" }}>
            Have questions or need support? Reach out to us—we’re here to help!
          </Text>
          <Button variant="outline" py={5} px={6} fontSize="sm" mt={4} colorScheme="teal">
            Book a 15 Min call
          </Button>
        </Box>

      </Grid>
    </Box>
  );
};

export default IndividualBlogPage;