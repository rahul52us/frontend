import type { ResponsiveValue } from "@chakra-ui/react";
import { BoxProps, Text } from "@chakra-ui/react"; // Import BoxProps for full Chakra compatibility
import type { Property } from "csstype";

interface Props extends BoxProps { // Extend BoxProps to inherit all spacing props
  children: React.ReactNode;
  textAlign?: ResponsiveValue<Property.TextAlign>;
  fontSize?: ResponsiveValue<string>;
  color?: string;
  fontWeight?: ResponsiveValue<Property.FontWeight>;
}

const CustomSmallTitle = ({
  children,
  textAlign = { base: "center", lg: "center" },
  fontSize = { base: "16px", md: "18px" },
  color = "#DF837C",
  fontWeight = 500,
  ...props
}: Props) => {
  return (
    <Text
      fontFamily="Montserrat, sans-serif"
      textTransform="uppercase"
      color={color}
      textAlign={textAlign}
      fontSize={fontSize}
      fontWeight={fontWeight}
      letterSpacing="0.2em" // Apply 25% letter spacing
      {...props} // Spread props for additional styling like ml, mt, etc.
    >
      {children}
    </Text>
  );
};

export default CustomSmallTitle;
