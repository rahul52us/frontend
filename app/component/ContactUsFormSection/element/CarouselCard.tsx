import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";

const CarouselCard = ({ imageSrc, iconSrc, title, description }) => {
  // Responsive values
  const imageWidth = useBreakpointValue({ base: "100%", md: "85%" });
  const overlayWidth = useBreakpointValue({ base: "90%", md: "80%" });
  const overlayBottom = useBreakpointValue({ base: 4, md: 14 });
  const overlayLeft = useBreakpointValue({ base: "5%", md: 16 });
  const titleFontSize = useBreakpointValue({ base: "md", md: "lg" });
  const descriptionFontSize = useBreakpointValue({ base: "xs", md: "sm" });
  const iconBoxSize = useBreakpointValue({ base: 10, md: 12 });
  const iconSize = useBreakpointValue({ base: 4, md: 7 });

  return (
    <Box>
      <Flex justify="center" pb={{lg:10}} position="relative">
        <Box w={imageWidth}>
          {/* Background Image */}
          <Image
            src={imageSrc}
            h={"100%"}
            w="100%"
            objectFit="cover"
            borderTopLeftRadius="50px"
            borderBottomRightRadius="50px"
            alt="carousel"
          />

          {/* Overlay Box */}
          <Box
            p={4}
            px={{base:4,lg:6}}
            w={overlayWidth}
            position="absolute"
            bottom={overlayBottom}
            left={overlayLeft}
            backdropFilter="blur(20px)"
            bg="rgba(255, 255, 255, 0.10)"
            borderBottomRightRadius="50px"
            border={"1px solid rgba(255, 255, 255, 0.2)"}
          >
            {/* Circular Icon Box */}
            <Box
              p={1}
              boxSize={iconBoxSize}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              backdropFilter="blur(40px)"
              bg="rgba(255, 255, 255, 0.1)"
              mb={1}
              border={"2px solid rgba(255, 255, 255, 0.3)"}
            >
              <Image src={iconSrc} boxSize={iconSize} alt="icon-box" />
            </Box>

            {/* Text Content */}
            <Text fontSize={titleFontSize} color="white" fontWeight={600}>
              {title}
            </Text>
            <Text fontSize={descriptionFontSize} color="white">
              {description}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CarouselCard;