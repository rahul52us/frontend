import React from 'react';
import { Box, Flex, IconButton, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";

const CardComponent3 = ({
  bgGradient,
  borderColor,
  rotatedText,
  mainText,
  imageSrc,
  isActive,
  onMouseEnter,
}) => {
  // Responsive sizing and layout
  const boxWidth = useBreakpointValue({ 
    base: "95%",    // Mobile (always full width)
    md: isActive ? "100%" : "100%",  // Tablet 
    lg: isActive ? "26rem" : "6rem"   // Desktop
  });

  const fontSize = useBreakpointValue({ 
    base: "18px",   // Mobile 
    md: "24px",     // Tablet
    lg: "28px"   ,   // Desktop
    xl:"30px"
  });

  const imageSize = useBreakpointValue({ 
    base: "10rem",   // Mobile
    md: "10rem",    // Tablet 
    lg: "13.5rem",     // Desktop,
    xl:"14rem"
  });

  const isMobile = useBreakpointValue({ base: true, lg: false });

  return (
    <Box
      rounded="10px"
      cursor="pointer"
      bgGradient={bgGradient}
      border="1px solid"
      borderColor={borderColor}
      p={2}
      maxW="100%"
      h={{base:"13rem",md:"18rem",lg:"20rem"}}
      position="relative"
      transform={isActive ? "scale(1.03)" : "none"}
      m={2}
      w={boxWidth}
      transition="width 0.6s ease-in-out"
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      role="group"
      // overflow="hidden"
    >
      {/* Close Button - Only show on tablet/desktop */}
      {!isMobile && (
        <IconButton
          icon={
            isActive ? (
              <GoArrowDownLeft size={16} />
            ) : (
              <GoArrowUpRight size={16} />
            )
          }
          position="absolute"
          color="black"
          top="-0.5rem"
          right="-0.5rem"
          shadow="base"
          aria-label="Close"
          isRound
          bg="white"
          size="sm"
          _hover={{ bg: "gray.200" }}
        />
      )}

      {/* Rotated Text in Top-Left Corner */}
      <Text
        p={1}
        px={3}
        rounded="full"
        bg="#FFFFFF6E"
        fontWeight="bold"
        textAlign="center"
        position="absolute"
        top="0.5rem"
        left="0.5rem"
        fontSize={{base:"xs",md:"sm"}}
        className="orientation"
        letterSpacing={"2px"}
      >
        {rotatedText}
      </Text>

      {/* Main Content */}
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        h="100%"
        pl={{base:"2.25rem",md:"3rem"}}
        pr="0.3rem"
        pt={{base:"1rem",md:"1.5rem"}}
        opacity={isMobile || isActive ? 1 : 0}
        transition={isMobile ? "none" : "opacity 0.8s ease-in-out"}
      >
        <Text 
          fontSize={fontSize} 
          lineHeight="1.2"
          // noOfLines={2}  // Prevents text overflow
        >
          {mainText}
        </Text>
      </Flex>

      {/* Image */}
      <Image
        src={imageSrc}
        alt="Card Image"
        position="absolute"
        objectFit="cover"
        bottom={0}
        right="1rem"
        boxSize={imageSize}
        opacity={isMobile || isActive ? 1 : 0}
        transition={isMobile ? "none" : "opacity 0.8s ease"}
        blendMode="multiply"
      />

      {/* Custom CSS */}
      <style>
        {`
          .orientation {
            writing-mode: vertical-lr;
            transform: rotate(180deg);
          }
        `}
      </style>
    </Box>
  );
};

export default CardComponent3;