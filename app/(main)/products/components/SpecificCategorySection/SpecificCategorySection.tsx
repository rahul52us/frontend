import { Box, Button, Center, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { data } from "./utils/constant";

const SpecificCategorySection = () => {
  return (
    <Box
      maxW={"95%"}
      my={12}
      mx={"auto"}
      p={8}
      bgGradient={"linear(to-br, blue.50, purple.100)"}
      rounded={"2xl"}
      boxShadow="base"
    >
      <Flex gap={8} flexDirection={{ base: "column", md: "row" }}>
        {/* Left Section - Featured Category */}
        <Box w={{ md: "35%" }} position="relative" overflow="hidden" rounded="xl">
          <Box 
            p={8} 
            // bgGradient="linear(to-br, blue.600, purple.500)"
            color="purple.500"
            h="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            transition="transform 0.3s ease"
            // _hover={{ transform: "scale(1.02)" }}
          >
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              Explore Trending Categories
            </Text>
            <Text fontSize="md" mb={6} opacity={0.9}>
              Discover our most popular collections featuring the latest trends in technology, fashion, and lifestyle.
            </Text>
            <Button 
              variant="outline" 
              color="purple.500" 
              _hover={{ bg: "whiteAlpha.200", color: "purple.600" }}
              size="lg"
              alignSelf="flex-start"
              borderRadius="full"
              transition={"all 0.3s ease"}
              pl={0}
            >
              Shop Now
            </Button>
          </Box>
        </Box>
        {/* Right Section - Category Grid */}
        <Box flex={1}>
          <Grid 
            gap={{ base: 4, md: 6 }} 
            templateColumns={{ 
              base: "repeat(2, 1fr)", 
              sm: "repeat(3, 1fr)", 
              md: "repeat(4, 1fr)", 
              lg: "repeat(5, 1fr)"
            }}
          >
            {data.map((item) => (
              <Box 
                key={item.id} 
                cursor="pointer"
                role="group"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <Center>
                  <Box 
                    p={1} 
                    rounded="full" 
                    bg="white"
                    boxShadow="md"
                    transition="all 0.3s ease"
                    _groupHover={{ boxShadow: "xl" }}
                  >
                    <Image
                      src={item.img}
                      p={2}
                      alt="Image"
                      boxSize={{ base: "60px", md: "80px" }}
                      objectFit="contain"
                      transition="transform 0.3s ease"
                      _groupHover={{ transform: "scale(1.1)" }}
                    />
                  </Box>
                </Center>
                <Text 
                  mt={2} 
                  fontSize={{ base: "xs", md: "sm" }} 
                  fontWeight={600} 
                  textAlign="center"
                  color="gray.700"
                  _groupHover={{ color: "purple.600" }}
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