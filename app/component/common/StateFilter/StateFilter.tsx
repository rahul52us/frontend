import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import Carousel from "../CommonCarousel/CommonCarousel";
import CommonHeading from "../CommonHeading/CommonHeading";
// import CustomCarousel from "../../component/common/CustomCarousal/CustomCarousal";
// import CustomSubHeading from "../common/CustomSubHeading/CustomSubHeading";

const indianStates = [  
    {  
      state: "Rajasthan",  
      image: "https://images.unsplash.com/photo-1631867675167-90a456a90863?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFqYXN0aGFufGVufDB8MHwwfHx8Mg%3D%3D",  
      description: "The Land of Kings – Famous for its palaces, forts, and vibrant culture.",  
    },  
    {  
      state: "Kerala",  
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2VyYWxhfGVufDB8MHwwfHx8Mg%3D%3D",  
      description: "God's Own Country – Known for its backwaters, lush greenery, and serene beaches.",  
    },  
    {  
      state: "Goa",  
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29hfGVufDB8MHwwfHx8Mg%3D%3D",  
      description: "The Party Capital – Famous for its beaches, nightlife, and Portuguese heritage.",  
    },  
    {  
      state: "Himachal Pradesh",  
      image: "https://images.unsplash.com/photo-1617824077840-0d7a0cd13448?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpbWFjaGFsJTIwcHJhZGVzaHxlbnwwfDB8MHx8fDI%3D",  
      description: "The Land of Snow – Renowned for its hill stations and scenic landscapes.",  
    },  
    {  
      state: "Tamil Nadu",  
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFtaWwlMjBuYWR1fGVufDB8MHwwfHx8Mg%3D%3D",  
      description: "The Land of Temples – Known for its Dravidian architecture and rich history.",  
    },  
    {  
      state: "Maharashtra",  
      image: "https://images.unsplash.com/photo-1585889574476-af7bcb00d9c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFoYXJhc2h0cmF8ZW58MHwwfDB8fHwy",  
      description: "The Heart of India – Home to the Taj Mahal and cultural heritage.",  
    },  
  ];  
const StateFilter = () => {

  return (
    <Box py="10" bg="gray.50" position="relative" maxW={'98%'} mx={'auto'} mt={{base:6,md:12}}>
        <CommonHeading
          mb={{ base: 2, md: 4 }}
          fontSize={{ base: 'xl', md: '2xl', lg: 'xl' }}
          color={"gray.600"}
          textAlign={"start"}
        >
         Discover Unique Products from Every State
        </CommonHeading>
        {/* <Text textAlign={'center'} color={'gray.500'} mb={{base:2,lg:6}}>
            Discover the Magic of Europe: A Journey Through Timeless Beauty and Diverse Cultures
        </Text> */}
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