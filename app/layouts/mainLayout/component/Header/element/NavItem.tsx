"use client";

import {
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
import { motion, AnimatePresence } from "framer-motion";
import { navIcons } from "../utils/navIcons";

const MotionPopoverContent = motion(PopoverContent);

interface NavItemProps {
  item: any;
  onClose: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, onClose }) => {
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;

  // Theme Constants
  const accentColor = "#00BFFF"; // Skyblue
  const hoverBg = "rgba(0, 191, 255, 0.08)"; // Subtle skyblue background on hover

  return (
    <Popover trigger="hover" placement="bottom" gutter={18} openDelay={50}>
      <PopoverTrigger>
        <Flex
          align="center"
          gap={2.5}
          cursor="pointer"
          role="group"
          userSelect="none"
          onClick={() => !hasChildren && router.push(item.link)}
        >
          {/* ICON: Black by default, Skyblue on hover */}
          {navIcons[item.title] && (
            <Icon 
              as={navIcons[item.title]} 
              boxSize="18px" 
              color="black" 
              _groupHover={{ color: accentColor, transform: "scale(1.1)" }}
              transition="all 0.3s ease"
            />
          )}
          
          {/* TEXT: Black by default, Skyblue on hover */}
          <Text
            fontSize="15px"
            fontWeight="700"
            color="black" // <--- Basic state is Black
            _groupHover={{ 
              color: accentColor, // <--- Hover state is Skyblue
            }}
            transition="all 0.2s ease-in-out"
          >
            {item.title}
          </Text>

          {hasChildren && (
            <Icon
              as={ChevronDownIcon}
              boxSize="14px"
              color="black"
              _groupHover={{ transform: "rotate(180deg)", color: accentColor }}
              transition="all 0.3s"
            />
          )}
        </Flex>
      </PopoverTrigger>

      <AnimatePresence>
        {hasChildren && (
          <MotionPopoverContent
            bg="white" // Popover usually looks better white if text is black
            backdropFilter="blur(20px)"
            boxShadow="0 15px 50px rgba(0, 0, 0, 0.1)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            minW="250px"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            zIndex={9999}
          >
            <PopoverBody p={2}>
              {item.children.map((child: any) => (
                <Flex
                  key={child.title}
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  cursor="pointer"
                  role="group"
                  transition="all 0.2s"
                  _hover={{ bg: hoverBg, transform: "translateX(5px)" }}
                  onClick={() => {
                    router.push(child.link);
                    onClose();
                  }}
                >
                  {navIcons[child.title] && (
                    <Icon 
                      as={navIcons[child.title]} 
                      boxSize="16px" 
                      color="black" // Sub-link icon black by default
                      _groupHover={{ color: accentColor }} 
                    />
                  )}
                  <Text 
                    fontSize="sm" 
                    fontWeight="600" 
                    color="black" // Sub-link text black by default
                    _groupHover={{ color: accentColor }} // Skyblue on hover
                  >
                    {child.title}
                  </Text>
                </Flex>
              ))}
            </PopoverBody>
          </MotionPopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};

export default NavItem;