import { Box, Button, Collapse, Text, Heading, Flex, Tag, TagLabel } from "@chakra-ui/react";
import { useState } from "react";

type ShopAboutProps = {
  shopData: {
    about?: string;
    tags?: string[];
  };
};

const ShopAbout = ({ shopData }: ShopAboutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const aboutText = shopData.about || "";
  const previewText = aboutText.slice(0, 150);

  return (
    <Box mb="6">
      <Heading as="h2" size="lg" fontWeight="bold" mb="4">
        About Us
      </Heading>

      {/* About Preview Text */}
      {aboutText.length > 0 ? (
        <Box mb="4">
          <Text color="gray.600" fontSize={{ base: "sm", lg: "md" }} mb="2">
            {previewText}
            {aboutText.length > 150 && "..."}
          </Text>

          <Collapse in={isExpanded} animateOpacity>
            <Text color="gray.600" fontSize={{ base: "sm", lg: "md" }}>
              {aboutText.slice(150)}
            </Text>
          </Collapse>

          {aboutText.length > 150 && (
            <Button
              size="sm"
              variant="link"
              color="blue.500"
              onClick={() => setIsExpanded(!isExpanded)}
              mt="2"
              _focus={{ boxShadow: "none" }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </Box>
      ) : (
        <Text color="gray.500" fontSize="sm">No information available.</Text>
      )}

      {/* Tags Section */}
      {Array.isArray(shopData.tags) && shopData.tags.length > 0 && (
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
