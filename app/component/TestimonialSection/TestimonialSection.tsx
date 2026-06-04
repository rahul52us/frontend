import { Box, Grid, Heading, Text, VStack } from "@chakra-ui/react";

type TestimonialSectionProps = {
  bg?: string;
};

const testimonials = [
  {
    quote: "This service exceeded our expectations and helped our business grow faster.",
    name: "Asha Patel",
    title: "Founder",
  },
  {
    quote: "Professional, reliable, and easy to work with. Highly recommended.",
    name: "Rahul Singh",
    title: "Operations Head",
  },
  {
    quote: "A seamless experience from start to finish. Great results and support.",
    name: "Nisha Verma",
    title: "Marketing Lead",
  },
];

const TestimonialSection = ({ bg = "transparent" }: TestimonialSectionProps) => {
  return (
    <Box bg={bg} py={{ base: "40px", md: "60px" }} px={{ base: 4, md: 8 }}>
      <Box maxW="1100px" mx="auto">
        <Heading mb={8} textAlign="center" size="xl">
          What Our Customers Say
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {testimonials.map((item, index) => (
            <Box key={index} p={6} borderRadius="2xl" bg="white" boxShadow="sm">
              <VStack align="start" spacing={4}>
                <Text fontSize="lg" color="gray.700">
                  “{item.quote}”
                </Text>
                <Box>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text color="gray.500">{item.title}</Text>
                </Box>
              </VStack>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TestimonialSection;
