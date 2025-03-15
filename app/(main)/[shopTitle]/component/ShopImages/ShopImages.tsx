import { Box, Container, Image } from "@chakra-ui/react";
import Carousel from "../../../../component/common/CommonCarousel/CommonCarousel";
import CommonHeading from "../../../../component/common/CommonHeading/CommonHeading";

const ShopImages = ({ shopData }) => {
  return (
    <Container maxW={'container.xl'} py={4}>
      <CommonHeading heading="Gallery" mb={{ base: 4, md: 8 }} 
     subheading="Explore more about us"
      
      />
      <Carousel>
        {shopData.images.gallery.map((image, index) => (
          <Box
            key={index}
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            _hover={{ transform: "scale(1.02)", transition: "transform 0.3s" }}
          >
            <Image
              src={image}
              h={"200px"}
              w={'100%'}
              alt={`Gallery image ${index + 1}`}
              objectFit="cover"
            />
          </Box>
        ))}
      </Carousel>
    </Container>
  );
};

export default ShopImages;
