import {
    Box,
    Button,
    Collapse,
    Flex,
    Heading,
    Tag,
    TagLabel,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";

const ShopAbout = ({ shopData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewText = shopData.description.slice(0, 150); // Show first 150 characters

  return (
    <Box>
      <Heading as="h2" size="lg" fontWeight="bold" mb="4">
        About
      </Heading>
      <Text color="gray.600" mb="4">{shopData.about}</Text>

      {/* Collapsible Description with smooth transition */}
      <Box>
        <Text color="gray.600">
          {previewText}...
        </Text>
        <Collapse in={isExpanded} animateOpacity>
          <Text color="gray.600">{shopData.description.slice(150)}</Text>
        </Collapse>
        <Button
          size="sm"
          variant="link"
          color="blue.500"
          onClick={() => setIsExpanded(!isExpanded)}
          mt="2"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </Button>
      </Box>

      {/* Tags Section */}
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
    </Box>
  );
};

export default ShopAbout;
