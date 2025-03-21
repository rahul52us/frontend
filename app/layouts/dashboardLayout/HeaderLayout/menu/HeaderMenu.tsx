'use client';

import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
} from "@chakra-ui/react";
import "./styles.css";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

// Define props interface
interface HeaderProps {
  title: string;
  Menus?: () => ReactNode; // Optional component function
  link?: string; // Optional navigation link
}

const Header = ({ title, Menus, link }: HeaderProps) => {
  const router = useRouter();
  const hoverColor = useColorModeValue("blue.50", "whiteAlpha.200");

  return (
    <Popover trigger="hover" placement="bottom">
      <PopoverTrigger>
        <Text
          px={3}
          py={1}
          rounded={"full"}
          _hover={{
            bg: hoverColor,
            color: "blue.500",
            animation: "slideFromLeft 0.3s ease forwards",
          }}
          fontSize="16px"
          cursor="pointer"
          fontWeight="500"
          className="animated-text"
          transition="all 0.2s ease-in-out"
          onClick={() => {
            if (link && !Menus) {
              router.push(link);
            }
          }}
        >
          {title}
        </Text>
      </PopoverTrigger>
      {Menus && (
        <PopoverContent mt={5}>
          <PopoverBody borderRadius={0}>{<Menus />}</PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default Header;