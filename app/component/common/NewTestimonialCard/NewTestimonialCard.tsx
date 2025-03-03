import { StarIcon } from "@chakra-ui/icons";
import { Avatar, Box, Card, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";

const NewTestimonialCard = ({
  stars,
  text,
  avatarSrc,
  name,
  time,
  logoSrc,
  showBorder = true, // Default prop to control the border
  bgColor = "#FFFFFF", // Default prop for the background color
  starColor="gold"
}) => {
  return (
    <Box>
      <Card
        h={{ base: "240px", md: "300px" }} // Set a fixed height for the card
        py={{ base: 4, md: 6, lg: 10 }}
        px={{ base: 4, md: 6 }}
        rounded={"16px"}
        border={showBorder ? "1px solid #045B64" : "none"} // Conditional border
        bg={bgColor} // Use the bgColor prop
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"} // Ensure content is spaced appropriately
      >
        <Box>
          <Flex gap={1}>
            {Array.from({ length: stars }, (_, i) => (
              <Icon key={i} color={starColor} as={StarIcon} />
            ))}
          </Flex>
          <Text
            noOfLines={4} // Limit the number of lines for text
            fontSize={{ base: "15px", md: "18px" }}
            mt={{ base: 4, md: 6 }}
            color={"#4D4D4D"}
          >
            {text}
          </Text>
        </Box>
        <Flex justify={"space-between"} align={"end"}>
          <Flex mt={6} gap={3} align={"center"}>
            <Avatar boxSize={{ base: "32px", md: "40px" }} name={name} src={avatarSrc} />
            <Box>
              <Text fontSize={{ base: "16px", md: "18px" }} color={"#063231"}>
                {name}
              </Text>
              <Text fontSize={"xs"} color={"#063231"}>
                {time}
              </Text>
            </Box>
          </Flex>
          <Box boxSize={8} mb={2}>
            <Image src={logoSrc} alt="logo" />
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default NewTestimonialCard;
