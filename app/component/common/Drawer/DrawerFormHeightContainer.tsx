import { Box } from "@chakra-ui/react";

const DrawerFormHeightContainer = ({ children, rest }: any) => {
  return (
    <Box minH={"81vh"} maxH={"81vh"} overflowY={"auto"} {...rest}>
      {children}
    </Box>
  );
};

export default DrawerFormHeightContainer;
