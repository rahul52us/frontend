import { Box, Button, Center, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { data } from "./utils/constant";

const SpecificCategorySection = () => {
  return (
    <Box
      maxW="95%"
      my={{ base: 8, md: 12 }}
      mx="auto"
      p={{ base: 4, md: 8 }}
      bgGradient="linear(to-br, blue.200, purple.300)" // Richer, more vibrant gradient
      rounded="3xl" // Softer, larger radius
      boxShadow="lg" // Bolder shadow for depth
      overflow="hidden"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "rgba(255, 255, 255, 0.1)", // Subtle overlay for texture
        rounded: "3xl",
        pointerEvents: "none",
      }}
    >
      <Flex
        gap={{ base: 4, md: 8 }}
        flexDirection={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
      >
        {/* Left Section - Featured Category */}
        <Box
          w={{ base: "100%", md: "35%" }}
          position="relative"
          rounded="2xl" // Slightly larger inner radius
          bg="white"
          p={{ base: 6, md: 8 }}
          boxShadow="md" // Stronger base shadow
          transition="all 0.3s ease"
          _hover={{ boxShadow: "lg", transform: "translateY(-6px)" }} // More pronounced lift
        >
          <Box
            color="gray.800"
            h="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text
              fontSize={{ base: "xl", md: "3xl" }} // Larger on desktop for impact
              fontWeight="black" // Maximum boldness
              mb={3}
              lineHeight="tight"
              bgGradient="linear(to-r, blue.600, purple.600)" // Gradient text
              bgClip="text"
            >
              Trending Categories
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              mb={6}
              color="gray.600"
              lineHeight="relaxed"
              fontWeight="medium"
            >
              Dive into the latest tech, fashion, and lifestyle with our handpicked collections.
            </Text>
            <Button
              variant="solid"
              colorScheme="purple"
              bg="purple.600"
              _hover={{ bg: "purple.700", transform: "scale(1.08)", boxShadow: "md" }} // Enhanced hover
              _active={{ bg: "purple.800" }}
              size={{ base: "md", md: "lg" }}
              borderRadius="full"
              alignSelf="flex-start"
              transition="all 0.3s ease"
              px={{ base: 6, md: 8 }}
              fontWeight="bold"
              boxShadow="sm" // Default shadow for depth
            >
              Shop Now
            </Button>
          </Box>
        </Box>

        {/* Right Section - Category Grid */}
        <Box flex={1}>
          <Grid
            gap={{ base: 3, sm: 4, md: 6 }}
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            }}
            justifyItems="center"
          >
            {data.map((item) => (
              <Box
                key={item.id}
                cursor="pointer"
                role="group"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-8px)" }} // Stronger lift
                textAlign="center"
                p={{ base: 2, md: 0 }}
              >
                <Center>
                  <Box
                    p={{ base: 2, md: 3 }}
                    rounded="full"
                    bg="white"
                    boxShadow="md"
                    transition="all 0.3s ease"
                    _groupHover={{
                      boxShadow: "xl",
                      bg: "purple.100", // Richer hover background
                      border: "1px solid",
                      borderColor: "purple.300", // Subtle border accent
                    }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      boxSize={{ base: "50px", sm: "60px", md: "80px" }}
                      objectFit="contain"
                      transition="transform 0.3s ease"
                      _groupHover={{ transform: "scale(1.2)" }} // Bolder scale
                    />
                  </Box>
                </Center>
                <Text
                  mt={2}
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  fontWeight="bold" // Bolder for emphasis
                  color="gray.800" // Darker for contrast
                  _groupHover={{ color: "purple.700" }} // Richer hover color
                  noOfLines={1}
                >
                  {item.title}
                </Text>
              </Box>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
};

export default SpecificCategorySection;