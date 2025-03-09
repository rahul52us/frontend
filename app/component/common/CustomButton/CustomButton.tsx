import { Button, Icon, ButtonProps, useBreakpointValue } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type CustomButtonProps = ButtonProps & {
  children: ReactNode;
  icon?: React.ElementType;
  mt?: string | number;
  height?: string | number;
  width?: string | number;
  rounded?: string;
  bgGradient?: string; // Dynamic gradient prop
  color?: string; // Dynamic color prop
  borderColor?: string; // Dynamic border color
};

const CustomButton: FC<CustomButtonProps> = ({
  children,
  icon,
  mt,
  height = "50px",
  width,
  rounded,
  bgGradient = "linear(to-r, #065F68, #065F68, #2A8A94)", // Default gradient
  color = "#FFFFFF", // Default text color
  ...props
}) => {
  const fontSizes = useBreakpointValue({ base: "14px", md: "16px" });
  const buttonSize = useBreakpointValue({ base: "lg", lg: "lg", xl: "xl" });

  return (
    <Button
      {...props}
      position="relative"
      mt={mt}
      size={buttonSize}
      height={height}
      width={width}
      alignItems="center"
      justifyContent="center"
      borderRadius="8px"
      rounded={rounded}
      bgGradient={bgGradient} // Use dynamic gradient
      color={color} // Use dynamic color
      fontWeight="400"
      fontSize={fontSizes}
      gap="8px"
      boxShadow="0px 8px 5px rgba(0, 0, 0, 0.05)"
      cursor="pointer"
      transition="all 0.3s ease-in-out"
      overflow="hidden"
      _hover={{
        borderColor: "#fff9",
        transform: "scale(1.015)",
        "&::before": {
          animation: "shine 1.5s ease-out infinite",
        },
      }}
      _active={{
        transform: "scale(1.015)",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
      _focus={{
        boxShadow: "none",
        backgroundColor: "transparent",
      }}
      _before={{
        content: "''",
        position: "absolute",
        width: "200px",
        height: "54px",
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 70%)",
        top: "0",
        left: "-200px",
        opacity: "0.6",
      }}
      sx={{
        "@keyframes shine": {
          "0%": { left: "-200px" },
          "60%": { left: "100%" },
          "100%": { left: "100%" },
        },
      }}
    >
      {children}
      {icon && <Icon as={icon} boxSize={{ base: 4, md: 5 }} />}
    </Button>
  );
};

export default CustomButton;
