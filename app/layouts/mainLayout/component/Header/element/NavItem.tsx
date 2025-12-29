"use client";

import {
  Box,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { navIcons } from "../utils/navIcons"; 

const MotionPopoverContent = motion(PopoverContent);

interface NavItemProps {
  item: {
    title: string;
    link: string;
    children?: { title: string; link: string }[];
  };
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClose }) => {
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;

  return (
    <Popover trigger="hover" placement="bottom-start" gutter={12}>
      <PopoverTrigger>
        <Box
          as="span"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="medium"
          px={4}
          py={2}
          cursor="pointer"
          position="relative"
          display="inline-flex"
          alignItems="center"
          gap={2}
          borderRadius="full"
          transition="all 0.3s ease"
          _hover={{
            color: "orange.500",
            bg: "orange.50",
            transform: "translateY(-1px)",
          }}
        >
          {/* 🔥 ICON + TITLE */}
          <Flex
            alignItems="center"
            gap={2}
            onClick={() => {
              if (!hasChildren) {
                router.push(item.link);
              }
            }}
          >
            {navIcons[item.title] && (
              <Icon as={navIcons[item.title]} boxSize={4.5} />
            )}
            <Text>{item.title}</Text>
          </Flex>

          {/* 🔽 DROPDOWN ARROW */}
          {hasChildren && (
            <Icon
              as={ChevronDownIcon}
              fontSize="lg"
              color="gray.500"
              transition="transform 0.25s ease"
            />
          )}
        </Box>
      </PopoverTrigger>

      {/* 🔥 DROPDOWN */}
      {hasChildren && (
        <MotionPopoverContent
          w="230px"
          bg="white"
          boxShadow="2xl"
          borderRadius="xl"
          mt={3}
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <PopoverBody p={2}>
            {item.children.map((child, index) => (
              <Flex
                key={child.title}
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                fontSize="md"
                fontWeight="medium"
                cursor="pointer"
                borderRadius="lg"
                transition="all 0.25s ease"
                _hover={{
                  bg: "linear-gradient(135deg, #FDBA74, #FB923C)",
                  color: "white",
                  transform: "translateX(4px) scale(1.04)",
                }}
                borderBottom={
                  index !== item.children!.length - 1 ? "1px solid" : "none"
                }
                borderColor="gray.100"
                onClick={() => {
                  router.push(child.link);
                  onClose();
                }}
              >
                {/* 🔥 CHILD ICON */}
                {navIcons[child.title] && (
                  <Icon as={navIcons[child.title]} boxSize={4} />
                )}
                <Text>{child.title}</Text>
              </Flex>
            ))}
          </PopoverBody>
        </MotionPopoverContent>
      )}
    </Popover>
  );
};

export default NavItem;
