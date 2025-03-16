import { Box, Button, Collapse, Text, Heading, Flex, Tag, TagLabel } from "@chakra-ui/react";
import { useState } from "react";

const ShopAbout = ({ shopData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewText = shopData.about.slice(0, 150); // Show first 150 characters

  return (
    <Box mb="6">
      <Heading as="h2" size="lg" fontWeight="bold" mb="4">
        About Us
      </Heading>

      {/* About Preview Text */}
      <Box mb="4">
        <Text color="gray.600" fontSize="lg" mb="2">
          {previewText}...
        </Text>
        <Collapse in={isExpanded} animateOpacity>
          <Text color="gray.600" fontSize="lg">{shopData.about.slice(150)}</Text>
        </Collapse>

        {/* Toggle button for expanded text */}
        <Button
          size="sm"
          variant="link"
          color="blue.500"
          onClick={() => setIsExpanded(!isExpanded)}
          mt="2"
          _focus={{ boxShadow: "none" }} // Remove focus outline on click
        >
          {isExpanded ? "Read Less" : "Read More"}
        </Button>
      </Box>

      {/* Optional Tags Section (Can be removed if not needed) */}
      {shopData.tags && shopData.tags.length > 0 && (
        <Box mt="6">
          <Heading as="h3" size="md" fontWeight="medium" mb="2">
            Tags
          </Heading>
          <Flex flexWrap="wrap" gap="2">
            {shopData.tags.map((tag, index) => (
              <Tag key={index} variant="outline" size="md" colorScheme="pink">
                <TagLabel>#{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default ShopAbout;
