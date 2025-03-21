'use client'
import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  VStack,
  Text,
  useColorModeValue,
  SimpleGrid,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import { FaPalette } from "react-icons/fa"; // Icon for the color picker

interface ColorPickerProps {
  label: string;
  color:any;
  onChangeComplete: any;
}

const colorPalette = [
  "#FF5733", "#33FF57", "#3357FF", "#FFD700", "#FF33A1",
  "#33FFF8", "#C70039", "#581845", "#FFC300", "#900C3F",
];

const ColorBox: React.FC<{ color: string; onClick: () => void; isSelected: boolean }> = ({
  color,
  onClick,
  isSelected,
}) => (
  <Tooltip label={color} placement="top" hasArrow>
    <Box
      width="50px"
      height="50px"
      bg={color}
      borderRadius="md"
      cursor="pointer"
      onClick={onClick}
      _hover={{ transform: "scale(1.1)", transition: "0.2s", boxShadow: "lg" }}
      border={isSelected ? "3px solid teal" : "none"}
      boxShadow="md"
      transition="all 0.2s" // Added smooth transition
    />
  </Tooltip>
);

const ColorPickerComponent: React.FC<ColorPickerProps> = ({
  label,
  color,
  onChangeComplete,
}) => {
  const [isLightOpen, setLightOpen] = useState(false);
  const [isDarkOpen, setDarkOpen] = useState(false);
  const [tempColorLight, setTempColorLight] = useState(color.light);
  const [tempColorDark, setTempColorDark] = useState(color.dark);
  const modalBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  const openLightModal = () => {
    setTempColorLight(color.light);
    setLightOpen(true);
  };

  const openDarkModal = () => {
    setTempColorDark(color.dark);
    setDarkOpen(true);
  };

  const handleLightConfirm = () => {
    onChangeComplete({ light: tempColorLight, dark: color.dark });
    setLightOpen(false);
  };

  const handleDarkConfirm = () => {
    onChangeComplete({ light: color.light, dark: tempColorDark });
    setDarkOpen(false);
  };

  return (
    <Box
      p={6}
      borderRadius="md"
      boxShadow="lg"
      bg={useColorModeValue("gray.50", "gray.900")}
      borderWidth="1px"
      transition="0.3s"
      _hover={{ boxShadow: "xl" }} // Hover effect for the main container
    >
      <FormControl>
        <FormLabel fontSize="lg" fontWeight="bold" color={textColor}>
          <Icon as={FaPalette} mr={2} />
          {label}
        </FormLabel>
        <Flex align="center" mb={4}>
          <Box
            width="80px"
            height="80px"
            bg={color.light}
            border="2px solid"
            borderColor={borderColor}
            borderRadius="lg"
            cursor="pointer"
            boxShadow="md"
            onClick={openLightModal}
            transition="all 0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }} // Enhanced hover effect
            mr={4}
          />
          <Box
            width="80px"
            height="80px"
            bg={color.dark}
            border="2px solid"
            borderColor={borderColor}
            borderRadius="lg"
            cursor="pointer"
            boxShadow="md"
            onClick={openDarkModal}
            transition="all 0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "lg" }} // Enhanced hover effect
          />
        </Flex>

        <Box
          width="100%"
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          color={textColor}
          fontWeight="bold"
          mb={4}
          p={4}
          bg={useColorModeValue("gray.50", "gray.700")}
        >
          <Text fontWeight="bold">Selected Color:</Text>
          <Text>Light: {color.light}</Text>
          <Text>Dark: {color.dark}</Text>
        </Box>

        {/* Light Color Picker Modal */}
        <Modal isOpen={isLightOpen} onClose={() => setLightOpen(false)} isCentered size="md">
          <ModalOverlay />
          <ModalContent p={4} borderRadius="lg" bg={modalBg} boxShadow="xl">
            <ModalBody>
              <VStack spacing={4} align="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Pick Light Color
                </Text>

                <SimpleGrid columns={5} spacing={2}>
                  {colorPalette.map((colorHex) => (
                    <ColorBox
                      key={colorHex}
                      color={colorHex}
                      onClick={() => setTempColorLight(colorHex)}
                      isSelected={tempColorLight === colorHex}
                    />
                  ))}
                </SimpleGrid>

                <Text fontWeight="bold" color={textColor}>
                  Custom Color:
                </Text>
                <SketchPicker
                  color={tempColorLight}
                  onChangeComplete={(color) => setTempColorLight(color.hex)}
                  width="100%"
                />

                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={handleLightConfirm}
                  width="full"
                  _hover={{ bg: "teal.600", transform: "translateY(-2px)" }}
                  boxShadow="md"
                  transition="0.2s"
                  _active={{ boxShadow: "lg", transform: "scale(0.95)" }}
                >
                  Confirm
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Dark Color Picker Modal */}
        <Modal isOpen={isDarkOpen} onClose={() => setDarkOpen(false)} isCentered size="md">
          <ModalOverlay />
          <ModalContent p={4} borderRadius="lg" bg={modalBg} boxShadow="xl">
            <ModalBody>
              <VStack spacing={4} align="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Pick Dark Color
                </Text>

                <SimpleGrid columns={5} spacing={2}>
                  {colorPalette.map((colorHex) => (
                    <ColorBox
                      key={colorHex}
                      color={colorHex}
                      onClick={() => setTempColorDark(colorHex)}
                      isSelected={tempColorDark === colorHex}
                    />
                  ))}
                </SimpleGrid>

                <Text fontWeight="bold" color={textColor}>
                  Custom Color:
                </Text>
                <SketchPicker
                  color={tempColorDark}
                  onChangeComplete={(color) => setTempColorDark(color.hex)}
                  width="100%"
                />

                <Button
                  colorScheme="teal"
                  size="md"
                  onClick={handleDarkConfirm}
                  width="full"
                  _hover={{ bg: "teal.600", transform: "translateY(-2px)" }}
                  boxShadow="md"
                  transition="0.2s"
                  _active={{ boxShadow: "lg", transform: "scale(0.95)" }}
                >
                  Confirm
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </FormControl>
    </Box>
  );
};

export default ColorPickerComponent;
