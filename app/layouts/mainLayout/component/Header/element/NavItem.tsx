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
import { motion } from "framer-motion"; // Smooth animations

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
    <Popover trigger="hover" placement="bottom-start" gutter={10}>
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
          transition="all 0.3s ease"
          _hover={{ color: "orange.500" }}
        >
          <Text onClick={() => {
            if(!hasChildren){
              router.push(item.link);
            }
                }}>{item.title}</Text>
          {hasChildren && <ChevronDownIcon fontSize="lg" color="gray.500" />}
        </Box>
      </PopoverTrigger>

      {hasChildren && (
        <MotionPopoverContent
          w="220px"
          bg="white"
          boxShadow="xl"
          borderRadius="lg"
          mt={2}
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <PopoverBody p={2}>
            {item.children.map((child, index) => (
              <Flex
                key={child.title}
                alignItems="center"
                justifyContent="space-between"
                px={4}
                py={3}
                fontSize="md"
                fontWeight="medium"
                cursor="pointer"
                borderRadius="md"
                transition="all 0.3s ease-in-out"
                _hover={{
                  bg: "linear-gradient(135deg, #87CEEB, #00BFFF)", // Gradient only on hover
                  color: "white",
                  transform: "scale(1.05)"
                }}
                borderBottom={index !== item.children.length - 1 ? "1px solid" : "none"}
                borderColor="gray.200"
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
