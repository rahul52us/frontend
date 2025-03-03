import { useState } from "react";
import { Flex, Text, IconButton, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionFlex = motion(Flex);

const ExpertiseList = ({ expertise }) => {
  const itemsPerPage = 3; // Number of items visible at once
  const itemWidth = 100; // Approximate width per item (adjust if needed)
  const containerWidth = itemsPerPage * itemWidth; // Dynamically calculate width
  const [startIndex, setStartIndex] = useState(0);

  const next = () => {
    if (startIndex + itemsPerPage < expertise.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <Flex align="center">
      {/* Left Button */}
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={prev}
        isDisabled={startIndex === 0}
        size="sm"
        aria-label="Previous"
        bg="white"
        rounded="full"
        boxShadow="sm"
        _hover={{ bg: "gray.100" }}
      />

      {/* Scrolling List */}
      <Box w={`${containerWidth}px`} overflow="hidden" position="relative">
        <MotionFlex
          gap={2}
          initial={{ x: 0 }}
          animate={{ x: -startIndex * itemWidth }} // Smooth sliding effect
          transition={{ type: "tween", duration: 0.4 }}
        >
          {expertise.map((item, index) => (
            <Text
              key={index}
              bg="gray.200"
              rounded="full"
              minW={`${itemWidth - 10}px`} // Ensure items fit properly
              color="#616161"
              px={3}
              py={1}
              h={"fit-content"}
              fontSize="xs"
              textAlign="center"
              whiteSpace="nowrap" // ✅ Prevents word wrapping
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {item}
            </Text>
          ))}
        </MotionFlex>
      </Box>

      {/* Right Button */}
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={next}
        isDisabled={startIndex + itemsPerPage >= expertise.length}
        size="sm"
        aria-label="Next"
        color="black"
        bg="white"
        rounded="full"
        boxShadow="sm"
        _hover={{ bg: "gray.100" }}
      />
    </Flex>
  );
};

export default ExpertiseList;
