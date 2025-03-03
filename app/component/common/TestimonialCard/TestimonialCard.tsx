import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { BsQuote } from "react-icons/bs";
const TestimonialCard = () => {
  return (
    <Box position="relative" h="20rem" w="100%" overflow="hidden">
      {" "}
      <Box
        position="absolute"
        bottom="20%"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
        shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        h="12rem"
        rounded="20px"
        bg="white"
        zIndex="1"
      />
      <Box
        position="absolute"
        bottom="15%"
        left="50%"
        transform="translateX(-50%)"
        w="95%"
        shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        h="14rem"
        rounded="20px"
        bg="white"
        zIndex="2"
      />


<Box
  position="absolute"
  border={"1px solid #DF837C"}
  bottom="10%"
  left="50%"
  transform="translateX(-50%)"
  w="90%"
  shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
  h="16rem"
  rounded="20px"
  bg="white"
  zIndex="3"
  px={6}
  py={10}
  overflow="hidden" // Ensures the second box is cut off
>
  <Flex gap={2}>
    <Icon as={BsQuote} boxSize={10} color={"#065F68"} />
    <Box>
      <Text fontSize={"22px"} w={"90%"} color={"#0F0F0F"}>
        I struggled with anxiety for years and was sceptical about therapy.
        Metamind matched me with an incredible therapist who truly understood
        my challenges. Within months, I felt a noticeable difference in my
        outlook and coping mechanisms
      </Text>
      <Text fontSize={"sm"} mt={4} color={"#0F0F0F"} w={"fit-content"}>
        Miles Morales
      </Text>
      <Text color={"#434343"} fontSize={"xs"} w={"fit-content"}>
        New York,US
      </Text>
    </Box>
  </Flex>

  <Flex
    position="absolute"
    bottom={0.2}
    right={0}
    gap={1}
  >
    <Box
      boxSize={"3rem"}
      bg={"#FFB8B2"}
      borderTopRightRadius={"30px"}
      borderBottomLeftRadius={"30px"}
    />
    <Box
      boxSize={"3rem"}
      bg={"#FFB8B2"}
      borderTopLeftRadius={"24px"}
      overflow="hidden" // Cuts off the second box
    />
  </Flex>
</Box>

      {/* <Box
        position="absolute"
        border={"1px solid #DF837C"}
        bottom="10%"
        left="50%"
        transform="translateX(-50%)"
        w="90%"
        shadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        h="16rem"
        rounded="20px"
        bg="white"
        zIndex="3"
        px={6}
        py={10}
      >
        <Flex gap={2}>
          <Icon as={BsQuote} boxSize={10} color={"#065F68"} />
          <Box>
            <Text fontSize={"22px"} w={"90%"} color={"#0F0F0F"}>
              I struggled with anxiety for years and was sceptical about
              therapy. Metamind matched me with an incredible therapist who
              truly understood my challenges. Within months, I felt a noticeable
              difference in my outlook and coping mechanisms
            </Text>
            <Text fontSize={"sm"} mt={4} color={"#0F0F0F"} w={"fit-content"}>
              Miles Morales
            </Text>
            <Text color={"#434343"} fontSize={"xs"} w={"fit-content"}>
              New York,US
            </Text>
          </Box>
        </Flex>
        <Flex justify={"end"} gap={1}>
          <Box
            boxSize={"3rem"}
            bg={"#FFB8B2"}
            borderTopRightRadius={"30px"}
            borderBottomLeftRadius={"30px"}
          />
          <Box
            boxSize={"3rem"}
            bg={"#FFB8B2"}
            borderTopLeftRadius={"24px"}
          />
        </Flex>
      </Box> */}
    </Box>
  );
};

export default TestimonialCard;
