import { Button, Divider, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

const SidebarButton = ({ label, icon, isActive, onClick, color }) => {
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <>
      <Button
        variant="ghost"
        justifyContent="flex-start"
        h={14}
        borderRadius="lg"
        leftIcon={icon}
        fontWeight={600}
        color={isActive ? color : "inherit"}
        bg={isActive ? useColorModeValue("purple.50", "whiteAlpha.100") : "transparent"}
        _hover={{ bg: hoverBg }}
        onClick={onClick}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          left: 0,
          w: "4px",
          h: "60%",
          bg: isActive ? color : "transparent",
          borderRadius: "full",
        }}
      >
        {label}
      </Button>
      <Divider opacity={0.5} />
    </>
  );
};

export default observer(SidebarButton);