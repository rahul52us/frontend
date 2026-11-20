import { Box, Button, Divider, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { memo } from "react";

interface SidebarButtonProps {
  label: string;
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  badge?: React.ReactNode;
}

const SidebarButton = ({
  label,
  icon,
  isActive,
  onClick,
  color,
  badge,
}: SidebarButtonProps) => {
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeBg = isActive ? "purple.50" : "transparent";

  return (
    <>
      <Button
        variant="ghost"
        justifyContent="space-between"
        w="full"
        h={14}
        borderRadius="lg"
        leftIcon={icon}
        fontWeight={600}
        color={isActive ? color : "inherit"}
        bg={activeBg}
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
        <Box as="span" flex="1" textAlign="left" ml={1}>
          {label}
        </Box>
        {badge}
      </Button>
      <Divider opacity={0.5} />
    </>
  );
};

export default memo(observer(SidebarButton));
