import {
  Box,
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
  useDisclosure,
  AspectRatio
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize,
  FiZoomIn,
  FiZoomOut
} from 'react-icons/fi';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  const isMobile = useBreakpointValue({ base: true, lg: false }); // Switch to desktop layout only on lg screens

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
    if (isMobile) return;
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

  const mobileSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const modalSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: selectedIndex
  };

  if (isMobile) {
    return (
      <Box w="full" overflow="hidden" mb={6}>
        <Box
          sx={{
            ".slick-dots": { bottom: "-25px" },
            ".slick-dots li button:before": { fontSize: "8px", color: "gray.400" },
            ".slick-dots li.slick-active button:before": { color: "blue.500" },
          }}
        >
          <Slider {...mobileSettings}>
            {images.map((img, index) => (
              <Box key={index} px={0} outline="none">
                <AspectRatio ratio={1} bg="white" borderRadius="xl" overflow="hidden">
                  <Image
                    src={img}
                    alt={`Product view ${index + 1}`}
                    objectFit="contain"
                    w="100%"
                    h="100%"
                    onClick={onOpen}
                  />
                </AspectRatio>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Fullscreen Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent bg="black">
            <ModalBody display="flex" alignItems="center" justifyContent="center" p={0} position="relative">
              <Box w="full" h="full">
                <Slider {...modalSettings}>
                  {images.map((img, idx) => (
                    <Box key={idx} h="100vh" display="flex !important" alignItems="center" justifyContent="center" outline="none">
                      <Image
                        src={img}
                        alt="Fullscreen view"
                        objectFit="contain"
                        w="100%"
                        h="100%"
                        maxH="100vh"
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>

              <IconButton
                position="absolute"
                top="4"
                right="4"
                icon={<FiMaximize />}
                onClick={onClose}
                aria-label="Exit Fullscreen"
                bg="whiteAlpha.400"
                color="white"
                borderRadius="full"
                zIndex={10}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    )
  }

  return (
    <Box>
      {/* Desktop Layout - Main Image + Thumbnails */}
      <Flex gap={4} align={'start'}>
        <Flex direction="column" py={2} gap={3} maxH={imageHeight} overflowY="auto" sx={{ scrollbarWidth: 'none', '::-webkit-scrollbar': { display: 'none' } }}>
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
              _hover={{ opacity: 1, borderColor: 'blue.300' }}
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

        <Box flex={1}>
          <Box
            ref={containerRef}
            position="relative"
            borderRadius="2xl"
            borderWidth={1}
            overflow="hidden"
            w="100%"
            h={imageHeight}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            cursor={isHovered && zoomLevel > 1 ? 'zoom-in' : 'pointer'}
            onClick={handleClickZoom}
            bg="white"
          >
            <Image
              src={images[selectedIndex]}
              alt={`Product view ${selectedIndex + 1}`}
              objectFit="contain"
              w="100%"
              h="100%"
              transform={zoomLevel > 1 ? `scale(${zoomLevel})` : 'scale(1)'}
              transformOrigin={`${position.x}% ${position.y}%`}
              transition="transform 0.1s ease-out"
            />

            {/* Controls */}
            <Flex position="absolute" direction={'column'} top="4" right="4" gap={2} zIndex={1}>
              <Tooltip label="Zoom In">
                <IconButton
                  icon={<FiZoomIn />}
                  onClick={() => handleButtonZoom(zoomLevel + 0.5)}
                  aria-label="Zoom In"
                  size={controlSize}
                  isDisabled={zoomLevel >= 2}
                  bg="white"
                  shadow="md"
                  borderRadius="full"
                />
              </Tooltip>
              <Tooltip label="Zoom Out">
                <IconButton
                  icon={<FiZoomOut />}
                  size={controlSize}
                  onClick={() => handleButtonZoom(zoomLevel - 0.5)}
                  aria-label="Zoom Out"
                  isDisabled={zoomLevel <= 1}
                  bg="white"
                  shadow="md"
                  borderRadius="full"
                />
              </Tooltip>

              <Tooltip label="Fullscreen">
                <IconButton
                  icon={<FiMaximize />}
                  size={controlSize}
                  onClick={onOpen}
                  aria-label="Fullscreen"
                  bg="white"
                  shadow="md"
                  borderRadius="full"
                />
              </Tooltip>
            </Flex>

            {/* Navigation Arrows */}
            <Flex justify="space-between" align="center" top="50%" transform="translateY(-50%)" position="absolute" w="100%" px={2} pointerEvents="none">
              {/* Wrapper needed to enable pointer events on buttons only */}
              <Box pointerEvents="auto">
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
                  size="md"
                  bg="whiteAlpha.800"
                  color="black"
                  _hover={{ bg: "white" }}
                />
              </Box>
              <Box pointerEvents="auto">
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
                  size="md"
                  bg="whiteAlpha.800"
                  color="black"
                  _hover={{ bg: "white" }}
                />
              </Box>
            </Flex>

            {/* Zoom Level Indicator */}
            {zoomLevel > 1 && (
              <Box position="absolute" bottom="4" left="4" bg="blackAlpha.700" px={3} py={1} borderRadius="full">
                <Text color="white" fontSize="xs" fontWeight="bold">Zoom: {zoomLevel}x</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>

      {/* Desktop Fullscreen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="blackAlpha.900">
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
              variant="ghost"
              color="white"
              size="lg"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default observer(ProductImageViewer);