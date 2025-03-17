'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi';

const ImageViewerWithModal = ({ images = [], isOpen, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imageRef = useRef(null);

  const imageHeight = useBreakpointValue({ base: '55vh', md: '65vh' });
  const thumbnailSize = useBreakpointValue({ base: '70px', md: '90px' });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));

  const goToImage = (index) => {
    setSelectedIndex(index);
    setScale(1);
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || isMobile) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setMagnifierPos({ x, y });
      setShowMagnifier(true);
    } else {
      setShowMagnifier(false);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
      <ModalContent bg="transparent" maxW="100vw" maxH="100vh" m="0">
        <ModalBody p={0} display="flex" flexDir="column" alignItems="center" justifyContent="center" gap={6}>
          {/* Main Image Container */}
          <Box
            position="relative"
            w="90%"
            maxW="1200px"
            h={imageHeight}
            overflow="hidden"
            bg="black"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.700"
          >
            {images.length > 0 ? (
              <Image
                ref={imageRef}
                src={images[selectedIndex]}
                alt={`Image ${selectedIndex + 1}`}
                objectFit="contain"
                w="100%"
                h="100%"
                transform={`scale(${scale})`}
                transition="transform 0.3s ease"
                draggable={false}
                onMouseMove={!isMobile ? handleMouseMove : undefined}
                onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                cursor={scale === 1 && !isMobile ? 'crosshair' : 'default'}
              />
            ) : (
              <Text color="white" p={4}>No images available</Text>
            )}

            {/* Magnifier */}
            {!isMobile && showMagnifier && images.length > 0 && (
              <Box
                position="absolute"
                top={`${Math.max(0, Math.min(magnifierPos.y - 75, imageRef.current.clientHeight - 150))}px`}
                left={`${Math.max(0, Math.min(magnifierPos.x - 75, imageRef.current.clientWidth - 150))}px`}
                w="150px"
                h="150px"
                borderRadius="full"
                border="2px solid white"
                overflow="hidden"
                zIndex={10}
                pointerEvents="none"
                bg="gray.800"
              >
                <Image
                  src={images[selectedIndex]}
                  alt="Magnified view"
                  w="450px"
                  h="450px"
                  objectFit="cover"
                  position="absolute"
                  top={`${-magnifierPos.y * 3 + 75}px`}
                  left={`${-magnifierPos.x * 3 + 75}px`}
                />
              </Box>
            )}

            {/* Controls */}
            <Flex position="absolute" top={2} right={2} gap={2} bg="blackAlpha.700" p={2} borderRadius="md">
              <IconButton
                icon={<FiZoomIn />}
                aria-label="Zoom In"
                size="md"
                bg="whiteAlpha.900"
                _hover={{ bg: 'white' }}
                onClick={handleZoomIn}
                isDisabled={scale >= 3}
              />
              <IconButton
                icon={<FiZoomOut />}
                aria-label="Zoom Out"
                size="md"
                bg="whiteAlpha.900"
                _hover={{ bg: 'white' }}
                onClick={handleZoomOut}
                isDisabled={scale <= 1}
              />
              <IconButton
                icon={<FiX />}
                aria-label="Close"
                size="md"
                bg="whiteAlpha.900"
                _hover={{ bg: 'white' }}
                onClick={onClose}
              />
            </Flex>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <Flex position="absolute" top="50%" w="100%" justify="space-between" px={4} transform="translateY(-50%)">
                <IconButton
                  icon={<FiChevronLeft />}
                  aria-label="Previous"
                  size="lg"
                  bg="whiteAlpha.900"
                  _hover={{ bg: 'white' }}
                  borderRadius="full"
                  onClick={() => goToImage((selectedIndex - 1 + images.length) % images.length)}
                />
                <IconButton
                  icon={<FiChevronRight />}
                  aria-label="Next"
                  size="lg"
                  bg="whiteAlpha.900"
                  _hover={{ bg: 'white' }}
                  borderRadius="full"
                  onClick={() => goToImage((selectedIndex + 1) % images.length)}
                />
              </Flex>
            )}
          </Box>

          {/* Thumbnail Strip */}
          {images.length > 0 && (
            <Flex overflowX="auto" maxW="90%" gap={2} justify="center" bg="blackAlpha.800" p={3} borderRadius="xl">
              {images.map((img, index) => (
                <Box
                  key={index}
                  w={thumbnailSize}
                  h={thumbnailSize}
                  minW={thumbnailSize}
                  borderRadius="md"
                  border={selectedIndex === index ? '4px solid' : '2px solid'}
                  borderColor={selectedIndex === index ? 'blue.500' : 'gray.600'}
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => goToImage(index)}
                  _hover={{ borderColor: 'blue.400' }}
                >
                  <Image src={img} alt={`Thumbnail ${index + 1}`} objectFit="cover" w="100%" h="100%" />
                </Box>
              ))}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageViewerWithModal;
