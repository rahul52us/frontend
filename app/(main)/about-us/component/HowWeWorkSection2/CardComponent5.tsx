import { Box, Center, Image, Link, Text } from "@chakra-ui/react";


const CardComponent5 = ({ image, date, title, description, link }) => {
    return (
      <Box position="relative"  mb={{base:14,lg:22}}>
        <Image src={image} alt={title} objectFit="cover" rounded={"16px"} h={{base:"440px",lg:'480px'}} width="100%" />
        <Center>

        <Box
          p={{base:3,lg:4}}
          border="1px solid"
          borderColor="brand.100"
          borderRadius="16px"
          position="absolute"
          bottom={{base:-16,lg:-14}}
          shadow="xl"
        //   left={2.5}
        //   mx="auto"
          width="94%"
          bg="white"
          boxShadow="lg"
          >
          <Text fontSize="sm" color="#868080">{date}</Text>
          <Text fontWeight="bold" fontSize={{lg:"lg"}} mt={3}>{title}</Text>
          <Text fontSize="sm" color="#575757" mt={3} noOfLines={5}>{description}</Text>
          <Link mt={{base:2,lg:4}} display="block" fontSize={{base:"sm"}} fontWeight="bold" color="brand.100" href={link}>
            READ MORE →
          </Link>
        </Box>
            </Center>
      </Box>
    );
  };

export default CardComponent5;
