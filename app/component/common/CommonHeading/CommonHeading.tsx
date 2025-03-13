import { Heading as ChakraHeading, forwardRef, Box, Text } from "@chakra-ui/react";

const CommonHeading = forwardRef(({ heading, subheading, align = "center", ...props }) => {
  return (
    <Box textAlign={align} mb={10} {...props}>
      {heading && (
        <ChakraHeading
          as="h1"
          fontSize={{ base: "xl", md: "2xl", lg: "2.5xl" }}
          fontWeight="bold"
          color="gray.800"
          mb={2}
          letterSpacing="tight"
          lineHeight="short"
        >
          {heading}
        </ChakraHeading>
      )}
      {subheading && (
        <Text
          as="h2"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          fontWeight="medium"
          color="gray.500"
          mb={3}
          letterSpacing="normal"
          lineHeight="shorter"
        >
          {subheading}
        </Text>
      )}
    </Box>
  );
});

export default CommonHeading;