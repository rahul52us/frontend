import {
    Box,
    Grid,
    GridItem,
    Image,
    Text,
    useBreakpointValue
} from "@chakra-ui/react";
  
  const ecommerceImages = [
    {
      src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHN8ZW58MHwwfDB8fHwy",
      alt: "Electronics & Gadgets",
      span: [1, 2],
    },
    {
      src: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMGFjY2Vzc29yaWVzfGVufDB8MHwwfHx8Mg%3D%3D",
      alt: "Fashion & Accessories",
      span: [1, 1],
    },
    {
      src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMGRlY29yfGVufDB8MHwwfHx8Mg%3D%3D",
      alt: "Home & Decor",
      span: [1, 1],
    },
    {
      src: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoJTIwY2FyZXxlbnwwfDB8MHx8fDI%3D",
      alt: "Health & Wellness",
      span: [1, 2],
    },
    {
      src: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95c3xlbnwwfDB8MHx8fDI%3D",
      alt: "Toys & Games",
      span: [1, 1],
    },
    {
      src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMGRlY29yfGVufDB8MHwwfHx8Mg%3D%3D",
      alt: "Kitchen Essentials",
      span: [1, 1],
    },
    {
      src: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHwwfDB8fHwy",
      alt: "Books & Stationery",
      span: [1, 1],
    },
  ];
  
  export default function BentoGrid() {
    const gridColumns = useBreakpointValue({ base: 2, md: 3, lg: 3 });
    const gridRows = useBreakpointValue({ base: "auto", md: "520px" });
  
    return (
      <Box
        p={{ base: 2, md: 5 }}
        maxW={{ base: "95%", md: "70%" }}
        mx="auto"
        my={{ base: "40px", lg: "30px" }}
      >
        {/* <Text
          fontSize={"md"}
          maxW={"90%"}
          mx={"auto"}
          color={"gray.500"}
          mb={4}
          textAlign={"center"}
        >
          Discover a wide range of products tailored to your needs. From the latest
          gadgets to trendy fashion, home essentials, and more, find everything you
          need in one place.
        </Text> */}
        <Grid
          templateColumns={`repeat(${gridColumns}, 1fr)`}
          gap={{ base: 2, lg: 3 }}
          h={gridRows}
          mt={8}
        >
          {ecommerceImages.map((img, index) => (
            <GridItem
              key={index}
              colSpan={{ base: 1, md: img.span[0] }}
              rowSpan={{ base: 1, md: img.span[1] }}
              position="relative"
              rounded="10px"
              overflow="hidden"
              cursor="pointer"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.03)" }}
            //   onClick={() => handleImageClick(img)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                objectFit="cover"
                rounded="10px"
                w="100%"
                h="100%"
              />
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                bgGradient="linear(to-t, rgba(0, 0, 0, 0.7), transparent)"
                color="white"
                p={2}
                textAlign="center"
              >
                <Text fontSize={{ base: "sm", lg: "md" }} fontWeight="bold">
                  {img.alt}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  }