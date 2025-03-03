import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Image,
  ListItem,
  Text,
  UnorderedList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdArrowOutward } from "react-icons/md";
import CustomButton from "../CustomButton/CustomButton";
import BioComponent from "./BioComponent";
import Link from "next/link";

const PsychologistCard = ({ data }) => {
  const buttonHeight = useBreakpointValue({ base: "28px", md: "40px" });
  const buttonWidth = useBreakpointValue({ base: "70px", md: "120px" });

  return (
    <Box
      border="1px solid #065F68"
      position="relative"
      p={3}
      rounded="16px"
      cursor="pointer"
      _hover={{ shadow: "rgba(149, 157, 165, 0.4) 0px 8px 24px" }}
      transition="all 0.3s ease-in-out"
      width={{ base: "100%", md: "80%", lg: "auto" }}
      mx="auto"
      bg={"white"}
    >
      {/* Card Layout */}
      <Grid
        templateColumns={{ base: "auto 1fr", md: "180px auto" }}
        gap={4}
        alignItems="center"
      >
        {/* Image Section */}

        <Box
          bg={"green.100"}
          p={{ base: 2, lg: 4 }}
          w={{ base: "110px", md: "100%" }}
          h={"100%"}
          // borderTopRadius={"full"}
          borderBottomRadius={'10px'}
          borderTopRadius={'120px'}
        >
          <Image
            src={data?.pic?.url}
            objectFit="cover"
            width={{ base: "100px", lg: "200px" }}
            height={{ base: "75%", lg: "85%" }}
            alt="Therapist"
            borderTopRadius={"full"}
            borderBottomRadius={"full"}
          />
          <Box mt={1} w="100%" display={{ base: "block", md: "none" }}></Box>
          <Center mt={2}>
            <Button
              variant="ghost"
              rightIcon={<MdArrowOutward />}
              colorScheme="teal"
              size={{ base: "xs", md: "sm" }} // Adjust size for responsiveness
              _hover={{ bg: "transparent", textDecoration: "underline" }}
              px={{ base: 2, md: 3 }}
            >
              View Profile
            </Button>
          </Center>
        </Box>

        {/* <Text mt={0.5} fontSize={{ base: "xs", md: "sm" }} textAlign={'center'} color={"#065F68"}>View Profile</Text> */}

        {/* Details Section */}
        <Box>
          <Flex direction="column" gap={{ base: 1 }}>
            <Text
              color="#065F68"
              fontSize={{ base: "16px", md: "22px", lg: "24px" }}
              fontWeight={600}
              isTruncated
            >
              {data?.name}
            </Text>
            <Text color="#8A8A8A" fontSize={{ base: "xs", md: "sm" }} my={0.5}>
              {data?.profileDetails?.personalInfo?.professionalInfo}{" "}
            </Text>
            <Text color="#0F0F0F" fontSize="14px">
              {data?.profileDetails?.personalInfo?.experience}
            </Text>
          </Flex>

          {/* Bio (Hidden on Mobile) */}
          {/* <Box display={{ base: "block", md: "block" }} mt={3}>
            <Text fontWeight={500}>Bio</Text>
            <Text color="#616161" fontSize="15px" minH="65px" noOfLines={3}>
              {data?.bio}
              <Text as="span" fontSize="14px" color="#065F68" fontWeight={600}> Read More...</Text>
            </Text>
          </Box> */}

          <BioComponent data={data} />

          {/* Expertise */}
          <Box mt={3} display={{ base: "none", md: "block" }}>
            <Flex align="center" gap={2}>
              <Text fontWeight={500} pb={1}>
                Expertise:
              </Text>
              <Box
                maxW={{ base: "10rem", lg: "18rem", xl: "16rem" }}
                overflowX="auto"
                whiteSpace="nowrap"
                sx={{
                  "&::-webkit-scrollbar": {
                    height: "4px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "transparent",
                    borderRadius: "full",
                  },
                  "&:hover::-webkit-scrollbar-thumb": {
                    backgroundColor: "gray.400",
                  },
                  "@media (max-width: 480px)": {
                    maxW: "100%",
                    overflowX: "auto",
                  },
                }}
              >
                {data?.profileDetails?.personalInfo?.expertise?.map(
                  (item, index) => (
                    <Text
                      key={index}
                      bg="gray.200"
                      rounded="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      display="inline-block"
                      mr={2}
                    >
                      {item}
                    </Text>
                  )
                )}
              </Box>
            </Flex>
          </Box>

          {/* Availability (Desktop) */}
          <Flex
            mt={{ base: 2, lg: 4 }}
            gap={2}
            align="center"
            wrap="wrap"
            display={{ base: "none", md: "flex" }}
          >
            <Text fontWeight={500}>Availability:</Text>
            <UnorderedList
              display="flex"
              gap={6}
              flexWrap="wrap"
              listStyleType="disc"
            >
              {data?.profileDetails?.personalInfo?.availability?.map(
                (item, index) => (
                  <ListItem
                    key={index}
                    fontSize="sm"
                    color="#616161"
                    textTransform="capitalize"
                  >
                    {item}
                  </ListItem>
                )
              )}
            </UnorderedList>
          </Flex>
        </Box>
      </Grid>

      {/* Mobile View: Availability */}
      <Flex
        mt={3}
        mb={2}
        gap={2}
        align="center"
        wrap="wrap"
        display={{ base: "flex", md: "none" }}
      >
        <Text fontWeight={500} fontSize="sm">
          Availability:
        </Text>
        <UnorderedList
          display="flex"
          gap={6}
          flexWrap="wrap"
          listStyleType="disc"
        >
          {data?.profileDetails?.personalInfo?.availability?.map(
            (item, index) => (
              <ListItem
                key={index}
                fontSize="sm"
                color="#616161"
                textTransform="capitalize"
              >
                {item}
              </ListItem>
            )
          )}
        </UnorderedList>
      </Flex>

      {/* Mobile View: Expertise */}
      <Box
        display={{ base: "block", md: "none" }}
        maxW="16rem"
        overflowX="auto"
        whiteSpace="nowrap"
        sx={{
          "&::-webkit-scrollbar": {
            height: "0px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "gray.300",
            borderRadius: "full",
          },
        }}
      >
        <Text as={"span"} fontSize={"sm"}>
          Expertise:{" "}
        </Text>
        {data?.profileDetails?.personalInfo?.expertise?.map((item, index) => (
          <Text
            key={index}
            bg="gray.200"
            rounded="full"
            px={2}
            py={0.75}
            fontSize="xs"
            display="inline-block"
            mr={2}
          >
            {item}
          </Text>
        ))}
      </Box>

      {/* Charges and Buttons Section */}
      <Flex
        mt={3}
        bg="#E9A2BC1A"
        border="1px solid #DF837C4F"
        py={{ base: 1.5, md: 3 }}
        px={{ base: 2, md: 4 }}
        rounded="12px"
        justify="space-between"
        align={{ base: "end", md: "center" }}
        w="100%"
      >
        {/* Charges Info */}
        <Box flex="1" overflow="hidden" whiteSpace="nowrap">
          <Text
            fontSize={{ base: "xs", md: "md" }}
            fontWeight={500}
            isTruncated
          >
            Charges
          </Text>
          <Text
            fontSize={{ base: "13px", md: "lg" }}
            fontWeight={600}
            color="#0F0F0F"
            isTruncated
          >
            ₹ {data?.profileDetails?.personalInfo?.charges} for{" "}
            {data?.profileDetails?.personalInfo?.time}
          </Text>
        </Box>

        {/* Buttons */}
        <Flex gap={2} align="center">
          <Link
            href={data?.profileDetails?.personalInfo?.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CustomButton
              w={buttonWidth}
              h={buttonHeight}
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 3, md: 4 }}
            >
              Book{" "}
              <Text as="span" display={{ base: "none", md: "inline" }}>
                {" "}
                Now
              </Text>
            </CustomButton>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PsychologistCard;
