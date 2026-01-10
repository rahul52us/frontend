"use client";

import {
  Box,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

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
  const hasChildren = !!item.children?.length;

  return (
    <Popover trigger="hover" placement="bottom-start" gutter={10}>
      <PopoverTrigger>
        <Flex
          align="center"
          gap={1.5}
          px={3}
          py={2}
          cursor="pointer"
          position="relative"
          role="group"
          borderRadius="md"
          _hover={{ bg: "gray.50" }}   // subtle hit-area feedback
          transition="background 0.2s ease"
          onClick={() => {
            if (!hasChildren) {
              router.push(item.link);
            }
          }}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="500"
            letterSpacing="0.2px"
            transition="color 0.2s ease"
            _groupHover={{ color: "blue.600" }}
          >
            {item.title}
          </Text>

          {hasChildren && (
            <ChevronDownIcon
              fontSize="md"
              color="gray.500"
              transition="all 0.2s ease"
              _groupHover={{
                transform: "rotate(180deg)",
                color: "blue.600",
              }}
            />
          )}

          {/* underline indicator (softer) */}
          <Box
            position="absolute"
            bottom="2px"
            left="50%"
            w="0%"
            h="2px"
            bg="blue.500"
            borderRadius="full"
            transition="all 0.25s ease"
            _groupHover={{ w: "70%", left: "15%" }}
          />
        </Flex>
      </PopoverTrigger>

      {hasChildren && (
        <MotionPopoverContent
          w="220px"
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.100"     // lighter border
          overflow="hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <PopoverBody p={1.5}>
            {item.children!.map((child, index) => (
              <Flex
                key={child.title}
                align="center"
                px={3}
                py={2.5}
                fontSize="sm"
                fontWeight="500"
                cursor="pointer"
                borderRadius="md"
                color="gray.700"
                transition="all 0.15s ease"
                _hover={{
                  bg: "gray.50",
                  color: "blue.600",
                }}
                borderBottom={
                  index !== item.children!.length - 1
                    ? "1px solid"
                    : "none"
                }
                borderColor="gray.100"
                onClick={() => {
                  router.push(child.link);
                  onClose();
                }}
              >
                {child.title}
              </Flex>
            ))}
          </PopoverBody>
        </MotionPopoverContent>
      )}
    </Popover>
  );
};

export default NavItem;
