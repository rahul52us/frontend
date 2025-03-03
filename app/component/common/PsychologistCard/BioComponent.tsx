import { Box, Text, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

const BioComponent = ({ data }) => {
  const bioRef = useRef(null);
  const [showReadMore, setShowReadMore] = useState(false);
  const lineClamp = useBreakpointValue({ base: 2, md: 3 }); // 2 lines for mobile, 3 lines for desktop

  useEffect(() => {
    if (bioRef.current) {
      const bioElement = bioRef.current;
      const lineHeight = parseInt(window.getComputedStyle(bioElement).lineHeight, 10);
      const maxHeight = lineHeight * lineClamp;

      if (bioElement.scrollHeight > maxHeight) {
        setShowReadMore(true);
      } else {
        setShowReadMore(false);
      }
    }
  }, [data?.bio, lineClamp]);

  return (
    <Box mt={{ lg: 4 }} position="relative">
      <Text fontWeight={500} color="black" fontSize={{ base: "xs", md: "md" }}>
        Bio:{" "}
      </Text>
      <Text
        ref={bioRef}
        color="#616161"
        fontSize={{ base: "xs", md: "md" }}
        noOfLines={lineClamp}
        position="relative"
      >
        {data?.bio}
      </Text>
      {showReadMore && (
        <Text
          as="span"
          color="#065F68"
          fontWeight={600}
          whiteSpace="nowrap"
          position="absolute"
          bottom="0"
          fontSize={{ base: 'xs', lg: "md" }}
          right="0"
          backgroundColor="white" // Optional: to cover the text behind
          pl={1.5} // Optional: padding to avoid overlap
        >
          Read More...
        </Text>
      )}
    </Box>
  );
};

export default BioComponent;