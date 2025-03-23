import {
  Box,
  Button,
  Circle,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
  FiZoomIn,
  FiZoomOut
} from 'react-icons/fi';

const ProductImageViewer = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerRef = useRef(null);

  // Responsive values
  const imageHeight = useBreakpointValue({ base: '300px', sm: '400px', md: '450px' });
  const thumbnailSize = useBreakpointValue({ base: '40px', sm: '50px', md: '60px' });
  const controlSize = "sm"
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100))
    });
  };

  const handleClickZoom = () => {
    if (isMobile) return; // Disable click zoom on mobile
    if (zoomLevel === 1) {
      setZoomLevel(1.5);
    } else if (zoomLevel === 1.5) {
      setZoomLevel(2);
    } else {
      setZoomLevel(1);
    }
  };

  const handleButtonZoom = (newZoom) => {
    setZoomLevel(Math.max(1, Math.min(newZoom, 2)));
  };

  return (
    <Box >
      {/* Main Image Container */}
      <Flex gap={4} align={'start'}>

      <Flex overflowX="auto" py={4} gap={2} sx={{ scrollbarWidth: 'none', '::-webkit-scrollbar': { display: 'none' } }} direction={{ base: 'row', md: 'column' }}>
        {images.map((img, index) => (
          <Circle
            key={index}
            size={thumbnailSize}
            minW={thumbnailSize}
            overflow="hidden"
            border="2px solid"
            borderColor={selectedIndex === index ? 'blue.500' : 'transparent'}
            opacity={selectedIndex === index ? 1 : 0.7}
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(index);
              setZoomLevel(1);
            }}
            transition="all 0.2s"
            _hover={{ opacity: 1 }}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Circle>
        ))}
      </Flex>
      <Box>

      <Box
  ref={containerRef}
  position="relative"
  borderRadius="2xl"
  borderWidth={1}
  overflow="hidden"
  w="100%" // Set a fixed width for the container
  h={imageHeight} // Set a fixed height for the container
  onMouseMove={!isMobile ? handleMouseMove : undefined}
  onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
  onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
  cursor={!isMobile && isHovered && zoomLevel > 1 ? 'zoom-in' : 'pointer'}
  onClick={!isMobile ? handleClickZoom : undefined}
>
  <Image
    src={images[selectedIndex]}
    alt={`Product view ${selectedIndex + 1}`}
    objectFit="contain"
    w="24rem" // Ensure the image takes up the full width of the container
    h="100%" // Ensure the image takes up the full height of the container
    transform={zoomLevel > 1 ? `scale(${zoomLevel})` : 'scale(1)'}
    transformOrigin={`${position.x}% ${position.y}%`}
    transition="transform 0.1s ease-out"
  />

  {/* Controls */}
  <Flex position="absolute" direction={'column'} top="2" right="2" gap={2} zIndex={1}>
    {!isMobile && (
      <>
        <Tooltip label="Zoom In">
          <IconButton
            icon={<FiZoomIn />}
            onClick={() => handleButtonZoom(zoomLevel + 0.5)}
            aria-label="Zoom In"
            size={controlSize}
            isDisabled={zoomLevel >= 2}
          />
        </Tooltip>
        <Tooltip label="Zoom Out">
          <IconButton
            icon={<FiZoomOut />}
            size={controlSize}
            onClick={() => handleButtonZoom(zoomLevel - 0.5)}
            aria-label="Zoom Out"
            isDisabled={zoomLevel <= 1}
          />
        </Tooltip>
      </>
    )}
    <Tooltip label="Fullscreen">
      <IconButton
        icon={<FiMaximize />}
        size={controlSize}
        onClick={onOpen}
        aria-label="Fullscreen"
      />
    </Tooltip>
  </Flex>

  {/* Navigation Arrows */}
  <Flex justify="end" gap={2} bottom={4} position="absolute" w="100%" px={2}>
    <IconButton
      icon={<FiChevronLeft />}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoomLevel(1);
      }}
      colorScheme='blackAlpha'
      aria-label="Previous Image"
      borderRadius="full"
      size={controlSize}
    />
    <IconButton
      icon={<FiChevronRight />}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
        setZoomLevel(1);
      }}
      colorScheme='blackAlpha'
      aria-label="Next Image"
      borderRadius="full"
      size={controlSize}
    />
  </Flex>

  {/* Zoom Level Indicator */}
  {!isMobile && zoomLevel > 1 && (
    <Box position="absolute" bottom="4" left="4" bg="blackAlpha.600" px={3} py={1} borderRadius="md">
      <Text color="white" fontSize="sm">Zoom: {zoomLevel}x</Text>
    </Box>
  )}
</Box>

      <Button bgGradient={'linear(to-br,purple.400, purple.600)'} _hover={{bgGradient:'linear(to-br,purple.600, purple.800)'}} color={'white'} w={'full'} mt={2} rounded={'full'}> Buy Now</Button>
      </Box>

      {/* Thumbnail Strip */}
     
      </Flex>
      {/* Fullscreen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="blackAlpha.700">
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Image
              src={images[selectedIndex]}
              alt="Fullscreen view"
              objectFit="contain"
              maxW="100%"
              maxH="100vh"
            />
            <IconButton
              position="absolute"
              top="4"
              right="4"
              icon={<FiMaximize />}
              onClick={onClose}
              aria-label="Exit Fullscreen"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductImageViewer;