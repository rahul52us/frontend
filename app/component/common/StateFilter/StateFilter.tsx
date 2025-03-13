import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import Carousel from "../CommonCarousel/CommonCarousel";
import CommonHeading from "../CommonHeading/CommonHeading";
import { indianStates } from "./utils/constant";

const StateFilter = () => {
  return (
    <Box py="10" bg="gray.50" position="relative" maxW={'98%'} mx={'auto'} mt={{base:6,md:12}}>
        <CommonHeading
          mb={{ base: 2, md: 4 }}
          fontSize={{ base: 'xl', md: '2xl', lg: 'xl' }}
          color={"gray.600"}
          padding={2}
          align={"center"}
          heading="Discover Unique Products from Every State"
          subheading="Explore a variety of handmade and traditional items from all over India."
        />
    <Carousel slidesToShow={6}>
  {indianStates.map((state, index) => (
    <Box
      key={index}
      flex="0 0 280px"
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      boxShadow="md"
      mb={2}
    >
      <Image
        src={state.image}
        alt={state.state}
        objectFit="cover"
        height="120px"
        width="100%"
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
        p="4"
        color="white"
        h={'100%'}
      >
      <Flex justify={'center'} align={'center'} h={'100%'}>

        <Heading as="h3" size="md" mb="1">
          {state.state}
        </Heading>
      </Flex>
        {/* <Text fontSize="xs">{state.description}</Text> */}
      </Box>
    </Box>
  ))}
</Carousel>
    </Box>
  );
};

export default StateFilter;