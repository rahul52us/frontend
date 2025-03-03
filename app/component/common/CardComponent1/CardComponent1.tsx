import { Box, Button, Card, Image, Text } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";

// Reusable Card Component
const CardComponent1 = ({
  title,
  description,
  image,
  buttonText,
  buttonLink,
  bgColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      cursor="pointer"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        shadow="none"
        p={4}
        bg={bgColor}
        pb={8}
        rounded="10px"
        h={{ base: "auto", md: isHovered ? "auto" : "30.25rem" }} // Auto height on hover
        transition="all 0.3s ease-in-out" // Smooth transition for all properties
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        position="relative" // Ensure smooth transitions
      >
        <Box h="270px" overflow="hidden">
          <Image
            src={image}
            rounded="8px"
            objectFit="cover"
            w="100%"
            h="100%"
            transition="transform 0.3s ease-in-out"
            alt={title}
            _hover={{ transform: "scale(1.1)" }}
          />
        </Box>
        <Box flexGrow={1} overflow="hidden">
          <Text
            mt={{ base: 3, lg: 4, xl: 5 }}
            mb={{ base: 2, lg: 3 }}
            fontWeight={500}
            fontSize={{ base: "20px", md: "22px" }}
            noOfLines={1}
          >
            {title}
          </Text>
          <Text
            color="#434343"
            fontSize={{ base: "14px", md: "15px" }}
            lineHeight={{ base: "20px", lg: "26px" }}
            noOfLines={{ base: undefined, md: isHovered ? undefined : 3 }} // Show all lines on hover
            transition="opacity 0.6s ease-in-out, max-height 0.6s ease-in-out" // Smooth text expansion
            maxHeight={{ base: "none", md: isHovered ? "500px" : "72px" }} // Adjust max-height for smooth expansion
            overflow="hidden"
          >
            {description}
          </Text>
        </Box>
        <Button
          rightIcon={<FaChevronRight />}
          color="#065F68"
          w="fit-content"
          textAlign="start"
          bg="none"
          p={0}
          variant="link"
          fontSize="18px"
          mt={2}
          onClick={() => window.open(buttonLink, "_blank")}
        >
          {buttonText}
        </Button>
      </Card>
    </Box>
  );
};

export default CardComponent1;