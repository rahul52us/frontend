import { Heading as ChakraHeading, forwardRef } from "@chakra-ui/react";

const CommonHeading = forwardRef(
  (
    {
      children,
      as = "h2",
      size = "lg",
      fontWeight = "bold",
      color = "gray.800",
      align = "left",
      casing = "inherit",
      letterSpacing = "normal",
      lineHeight = "tight",
      textDecoration = "none",
      truncate = false,
      noOfLines,
      mb=2,
      ...rest
    },
    ref
  ) => {
    return (
      <ChakraHeading
        as={as}
        size={size}
        fontWeight={fontWeight}
        color={color}
        textAlign={align}
        textTransform={casing}
        letterSpacing={letterSpacing}
        lineHeight={lineHeight}
        textDecoration={textDecoration}
        noOfLines={truncate ? 1 : noOfLines}
        mb={mb}
        ref={ref}
        {...rest}
      >
        {children}
      </ChakraHeading>
    );
  }
);

export default CommonHeading;