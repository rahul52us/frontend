import { Box, Container, Image, Text, Grid, GridItem, Tooltip } from "@chakra-ui/react";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";

// Helper function for Box styles
const imageContainerStyles = {
  borderRadius: "lg",
  overflow: "hidden",
  boxShadow: "md",
  _hover: {
    transform: "scale(1.05)",
    boxShadow: "xl",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  },
  cursor: "pointer",
};

const ShopImages = ({ shopData }) => {
  return (
    <Container maxW="container.xl" py={4}>
      <CommonHeading
        heading="Gallery"
        mb={{ base: 4, md: 8 }}
        subheading="Explore more about us"
      />
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {shopData.gallery.map((image, index) => (
          <GridItem key={index}>
            <Box {...imageContainerStyles}>
              <Image
                src={image?.file?.url}
                h="250px"
                w="100%"
                alt={image?.title || `Gallery image ${index + 1}`}
                objectFit="cover"
                loading="lazy"
              />
              <Box p={4} bg="white">
                {image?.title ? (
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.700"
                    textAlign="center"
                  >
                    {image.title}
                  </Text>
                ) : (
                  <Tooltip label="No title available" aria-label="No title available">
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      textAlign="center"
                      fontStyle="italic"
                    >
                      No Title
                    </Text>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default ShopImages;
