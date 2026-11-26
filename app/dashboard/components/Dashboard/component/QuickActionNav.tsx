import React from "react";
import { Button, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";

export interface QuickActionItem {
  label: string;
  icon: IconType | any;
  href: string;
}

interface QuickActionNavProps {
  actions: QuickActionItem[];
  surfaceBg: string;
  borderCol: string;
  textCol: string;
  onNavigate: (href: string) => void;
}

export const QuickActionNav: React.FC<QuickActionNavProps> = React.memo(({
  actions,
  surfaceBg,
  borderCol,
  textCol,
  onNavigate,
}) => {
  const hoverBg = useColorModeValue("rgba(6, 95, 104, 0.05)", "rgba(6, 95, 104, 0.12)");

  return (
    <Flex
      gap={2}
      overflowX="auto"
      py={1.5}
      px={1}
      mb={{ base: 3, md: 4 }}
      align="center"
      sx={{
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          leftIcon={<Icon as={action.icon} boxSize={3.5} />}
          variant="outline"
          borderRadius="12px"
          borderColor={borderCol}
          bg={surfaceBg}
          color={textCol}
          flexShrink={0}
          fontSize="xs"
          fontWeight="600"
          _hover={{
            borderColor: "var(--color-primary, #065F68)",
            color: "var(--color-primary, #065F68)",
            bg: "var(--color-primary-soft, rgba(6, 95, 104, 0.08))",
            transform: "translateY(-1px)",
            boxShadow: "0 2px 8px rgba(6, 95, 104, 0.15)",
          }}
          _active={{
            bg: "var(--color-primary-soft, rgba(6, 95, 104, 0.15))",
            transform: "scale(0.98)",
          }}
          transition="all 0.15s ease"
          onClick={() => onNavigate(action.href)}
        >
          {action.label}
        </Button>
      ))}
    </Flex>
  );
});

QuickActionNav.displayName = "QuickActionNav";
export default QuickActionNav;

