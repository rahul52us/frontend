"use client";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

// Define the type for the item prop
interface NavItemProps {
  item: {
    title: string;
    link:string;
  };
  onClose:any;
}

const NavItem: React.FC<NavItemProps> = ({ item ,onClose}) => {
  const router = useRouter()
  return (
    <Box
      as="span"
      fontSize={{lg:"16px",xl:"18px"}}
      color="#045B64"
      position="relative"
      cursor="pointer"
      _hover={{
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-4px",
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: "#045B64",
        },
      }}
      onClick={() => {
        router.push(item.link)
        onClose();
      }}
    >
      {item.title}
    </Box>
  );
};

export default NavItem;
