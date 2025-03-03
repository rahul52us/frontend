import { Heading, ResponsiveValue, Text } from "@chakra-ui/react";
import type { Property } from "csstype"; // Import Property type from csstype

interface HeadingProps {
  children: React.ReactNode;
  textAlign?: ResponsiveValue<Property.TextAlign>;
  fontWeight?: number;
  fontSize?: { base: string; md: string };
  my?: { base: number; md: number };
  px?: number;
  highlightText?: string;
  highlightFontWeight?: number;
}

const CustomSubHeading = ({
  children,
  textAlign = "center", // Default text alignment
  fontWeight = 300, // Default font weight
  fontSize = { base: "24px", md: "48px" }, // Default font size with breakpoints
  my = { base: 1, md: 2 }, // Default margin-y with breakpoints
  px = 1, // Default padding-x
  highlightText = "", // Custom text for the highlighted span
  highlightFontWeight = 600, // Font weight for the highlighted text
  ...props // Spread to allow additional props
}: HeadingProps) => {
  return (
    <Heading
      textAlign={textAlign}
      as={"h2"}
      fontWeight={fontWeight}
      fontSize={fontSize}
      fontFamily="'Montserrat', sans-serif !important"
      my={my}
      px={px}
      {...props}
    >
      {children}{" "}
      {highlightText && (
        <Text as="span" fontWeight={highlightFontWeight}>
          {highlightText}
        </Text>
      )}
    </Heading>
  );
};

export default CustomSubHeading;
