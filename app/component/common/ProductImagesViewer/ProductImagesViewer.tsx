"use client";

import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80";

const extractImageUrl = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  return (item.url || item.src || item.secure_url || "").trim();
};

const ProductImageViewer = ({ images: rawImages }: { images?: any[] }) => {
  // Normalize & deduplicate both string and object image formats
  const images = useMemo(() => {
    const urls = (rawImages || []).map(extractImageUrl).filter(Boolean);
    const unique = Array.from(new Set(urls));
    return unique.length > 0 ? unique : [FALLBACK_IMAGE];
  }, [rawImages]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mobileSliderRef = useRef<Slider | null>(null);
  const modalSliderRef = useRef<Slider | null>(null);

  // Hoisted Theme Tokens
  const viewerBg = useColorModeValue("#F8FAFC", "gray.800");
  const thumbBorder = useColorModeValue("gray.200", "gray.700");
  const activeBorder = useColorModeValue("blue.600", "blue.400");
  const controlBg = useColorModeValue("whiteAlpha.900", "gray.800");
  const controlColor = useColorModeValue("gray.800", "white");

  const imageHeight = useBreakpointValue({
    base: "310px",
    sm: "380px",
    md: "440px",
  });
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset index if product changes
  useEffect(() => {
    setSelectedIndex(0);
    setZoomLevel(1);
  }, [rawImages]);

  if (!isMounted) {
    return (
      <Box
        h={imageHeight || "320px"}
        w="full"
        bg={viewerBg}
        borderRadius="xl"
      />
    );
  }

  const handleSelectImage = (index: number) => {
    setSelectedIndex(index);
    setZoomLevel(1);
    mobileSliderRef.current?.slickGoTo(index);
    modalSliderRef.current?.slickGoTo(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100)),
    });
  };

  const handleClickZoom = () => {
    if (isMobile) return;
    setZoomLevel((prev) => (prev === 1 ? 1.6 : prev === 1.6 ? 2.2 : 1));
  };

  const handleButtonZoom = (e: React.MouseEvent, newZoom: number) => {
    e.stopPropagation();
    setZoomLevel(Math.max(1, Math.min(newZoom, 2.5)));
  };

  const mobileSliderSettings = {
    dots: false,
    infinite: images.length > 1,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_current: number, next: number) => setSelectedIndex(next),
  };

  const modalSliderSettings = {
    dots: false,
    infinite: images.length > 1,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: selectedIndex,
    beforeChange: (_current: number, next: number) => setSelectedIndex(next),
  };

  return (
    <Box w="full">
      {/* ===================================================================
          1. MOBILE & TABLET VIEW (Swipeable Gallery + Counter Pill + Thumb Strip)
         =================================================================== */}
      {isMobile ? (
        <Box w="full">
          {/* Main Swipeable Image Frame */}
          <Box
            position="relative"
            borderRadius="xl"
            overflow="hidden"
            bg={viewerBg}
          >
            <Slider ref={mobileSliderRef} {...mobileSliderSettings}>
              {images.map((img, index) => (
                <Box key={index} outline="none">
                  <AspectRatio ratio={1} w="full">
                    <Image
                      src={img}
                      alt={`Product view ${index + 1}`}
                      objectFit="contain"
                      w="full"
                      h="full"
                      p={2}
                      onClick={onOpen}
                      fallbackSrc={FALLBACK_IMAGE}
                    />
                  </AspectRatio>
                </Box>
              ))}
            </Slider>

            {/* Top-Right Fullscreen Expand Trigger */}
            <IconButton
              aria-label="View fullscreen"
              icon={<FiMaximize2 size={14} />}
              position="absolute"
              top={2.5}
              right={2.5}
              size="xs"
              w="30px"
              h="30px"
              borderRadius="full"
              bg={controlBg}
              color={controlColor}
              backdropFilter="blur(8px)"
              boxShadow="sm"
              zIndex={2}
              onClick={onOpen}
            />

            {/* Bottom-Right Image Counter Pill (e.g. 1 / 4) */}
            {images.length > 1 && (
              <Badge
                position="absolute"
                bottom={2.5}
                right={2.5}
                bg="blackAlpha.700"
                color="white"
                backdropFilter="blur(6px)"
                px={2.5}
                py={0.5}
                borderRadius="full"
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.5px"
                zIndex={2}
              >
                {selectedIndex + 1} / {images.length}
              </Badge>
            )}
          </Box>

          {/* Horizontal Thumbnail Strip (Synced with Swipe Slider) */}
          {images.length > 1 && (
            <HStack
              spacing={2}
              mt={2.5}
              overflowX="auto"
              py={0.5}
              px={0.5}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {images.map((img, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <Box
                    key={index}
                    as="button"
                    type="button"
                    onClick={() => handleSelectImage(index)}
                    boxSize={{ base: "54px", sm: "62px" }}
                    borderRadius="lg"
                    overflow="hidden"
                    bg={viewerBg}
                    border="2px solid"
                    borderColor={isSelected ? activeBorder : thumbBorder}
                    opacity={isSelected ? 1 : 0.65}
                    p="2px"
                    flexShrink={0}
                    transition="all 0.15s ease"
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      w="full"
                      h="full"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc={FALLBACK_IMAGE}
                    />
                  </Box>
                );
              })}
            </HStack>
          )}
        </Box>
      ) : (
        /* ===================================================================
            2. DESKTOP VIEW (Left Vertical Squircle Rail + Interactive Zoom Stage)
           =================================================================== */
        <Flex gap={3.5} align="flex-start">
          {/* Left Vertical Thumbnail Rail */}
          {images.length > 1 && (
            <Flex
              direction="column"
              gap={2.5}
              maxH={imageHeight}
              overflowY="auto"
              pr={0.5}
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {images.map((img, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <Box
                    key={index}
                    as="button"
                    type="button"
                    boxSize="64px"
                    minH="64px"
                    borderRadius="xl"
                    overflow="hidden"
                    bg={viewerBg}
                    p="2px"
                    border="2px solid"
                    borderColor={isSelected ? activeBorder : thumbBorder}
                    opacity={isSelected ? 1 : 0.7}
                    transition="all 0.15s ease"
                    _hover={{ opacity: 1, borderColor: "blue.400" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectImage(index);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      w="full"
                      h="full"
                      objectFit="cover"
                      borderRadius="lg"
                      fallbackSrc={FALLBACK_IMAGE}
                    />
                  </Box>
                );
              })}
            </Flex>
          )}

          {/* Main Interactive Zoom Stage */}
          <Box flex="1" minW={0}>
            <Box
              ref={containerRef}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              w="full"
              h={imageHeight}
              bg={viewerBg}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                if (zoomLevel > 1) setZoomLevel(1);
              }}
              cursor={zoomLevel > 1 ? "zoom-out" : "zoom-in"}
              onClick={handleClickZoom}
              role="group"
            >
              <Image
                src={images[selectedIndex]}
                alt={`Product view ${selectedIndex + 1}`}
                objectFit="contain"
                w="full"
                h="full"
                p={3}
                transform={zoomLevel > 1 ? `scale(${zoomLevel})` : "scale(1)"}
                transformOrigin={`${position.x}% ${position.y}%`}
                transition="transform 0.12s ease-out"
                fallbackSrc={FALLBACK_IMAGE}
              />

              {/* Top-Right Floating Controls (Isolated from parent click) */}
              <Flex
                position="absolute"
                direction="column"
                top={3}
                right={3}
                gap={1.5}
                zIndex={2}
              >
                <Tooltip label="Zoom In" placement="left" hasArrow>
                  <IconButton
                    aria-label="Zoom In"
                    icon={<FiZoomIn size={14} />}
                    size="xs"
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg={controlBg}
                    color={controlColor}
                    boxShadow="sm"
                    isDisabled={zoomLevel >= 2.2}
                    onClick={(e) => handleButtonZoom(e, zoomLevel + 0.6)}
                  />
                </Tooltip>

                <Tooltip label="Zoom Out" placement="left" hasArrow>
                  <IconButton
                    aria-label="Zoom Out"
                    icon={<FiZoomOut size={14} />}
                    size="xs"
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg={controlBg}
                    color={controlColor}
                    boxShadow="sm"
                    isDisabled={zoomLevel <= 1}
                    onClick={(e) => handleButtonZoom(e, zoomLevel - 0.6)}
                  />
                </Tooltip>

                <Tooltip label="Fullscreen" placement="left" hasArrow>
                  <IconButton
                    aria-label="Fullscreen"
                    icon={<FiMaximize2 size={14} />}
                    size="xs"
                    w="32px"
                    h="32px"
                    borderRadius="full"
                    bg={controlBg}
                    color={controlColor}
                    boxShadow="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                    }}
                  />
                </Tooltip>
              </Flex>

              {/* Left / Right Prev-Next Arrows (Only if multiple images) */}
              {images.length > 1 && (
                <>
                  <IconButton
                    aria-label="Previous image"
                    icon={<FiChevronLeft size={18} />}
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    size="sm"
                    w="34px"
                    h="34px"
                    borderRadius="full"
                    bg={controlBg}
                    color={controlColor}
                    boxShadow="md"
                    opacity={isHovered ? 1 : 0}
                    transition="opacity 0.2s ease"
                    _hover={{ bg: "white", transform: "translateY(-50%) scale(1.06)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectImage(
                        (selectedIndex - 1 + images.length) % images.length
                      );
                    }}
                  />

                  <IconButton
                    aria-label="Next image"
                    icon={<FiChevronRight size={18} />}
                    position="absolute"
                    right={3}
                    top="50%"
                    transform="translateY(-50%)"
                    size="sm"
                    w="34px"
                    h="34px"
                    borderRadius="full"
                    bg={controlBg}
                    color={controlColor}
                    boxShadow="md"
                    opacity={isHovered ? 1 : 0}
                    transition="opacity 0.2s ease"
                    _hover={{ bg: "white", transform: "translateY(-50%) scale(1.06)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectImage((selectedIndex + 1) % images.length);
                    }}
                  />
                </>
              )}

              {/* Bottom Status Pill */}
              <HStack
                position="absolute"
                bottom={3}
                left={3}
                spacing={2}
                pointerEvents="none"
              >
                {zoomLevel > 1 ? (
                  <Badge
                    bg="blackAlpha.700"
                    color="white"
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    fontSize="10px"
                  >
                    Zoom {zoomLevel.toFixed(1)}x
                  </Badge>
                ) : (
                  <Badge
                    bg="blackAlpha.600"
                    color="white"
                    px={2.5}
                    py={0.5}
                    borderRadius="full"
                    fontSize="10px"
                    opacity={isHovered ? 1 : 0}
                    transition="opacity 0.2s ease"
                  >
                    Click to zoom
                  </Badge>
                )}
              </HStack>
            </Box>
          </Box>
        </Flex>
      )}

      {/* ===================================================================
          3. UNIFIED FULLSCREEN LIGHTBOX MODAL (Mobile & Desktop)
         =================================================================== */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
        <ModalContent bg="transparent" boxShadow="none" m={0}>
          <ModalBody
            p={0}
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            h="100vh"
            overflow="hidden"
          >
            {/* Top Bar: Counter + Close Button */}
            <Flex
              justify="space-between"
              align="center"
              px={{ base: 4, md: 8 }}
              py={4}
              zIndex={10}
            >
              <Badge
                bg="whiteAlpha.200"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                {selectedIndex + 1} / {images.length}
              </Badge>

              <IconButton
                aria-label="Close fullscreen"
                icon={<FiX size={20} />}
                onClick={onClose}
                size="sm"
                w="38px"
                h="38px"
                borderRadius="full"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
              />
            </Flex>

            {/* Center Swipeable Fullscreen Stage */}
            <Box flex="1" position="relative" display="flex" alignItems="center">
              <Box w="full">
                <Slider ref={modalSliderRef} {...modalSliderSettings}>
                  {images.map((img, idx) => (
                    <Box key={idx} outline="none" px={{ base: 2, md: 12 }}>
                      <Flex
                        h={{ base: "68vh", md: "74vh" }}
                        align="center"
                        justify="center"
                      >
                        <Image
                          src={img}
                          alt={`Fullscreen view ${idx + 1}`}
                          objectFit="contain"
                          maxH="100%"
                          maxW="100%"
                          fallbackSrc={FALLBACK_IMAGE}
                        />
                      </Flex>
                    </Box>
                  ))}
                </Slider>
              </Box>

              {images.length > 1 && (
                <>
                  <IconButton
                    display={{ base: "none", md: "inline-flex" }}
                    aria-label="Previous"
                    icon={<FiChevronLeft size={22} />}
                    position="absolute"
                    left={6}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.400" }}
                    onClick={() => modalSliderRef.current?.slickPrev()}
                  />
                  <IconButton
                    display={{ base: "none", md: "inline-flex" }}
                    aria-label="Next"
                    icon={<FiChevronRight size={22} />}
                    position="absolute"
                    right={6}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.400" }}
                    onClick={() => modalSliderRef.current?.slickNext()}
                  />
                </>
              )}
            </Box>

            {/* Bottom Thumbnail Dock inside Lightbox */}
            {images.length > 1 && (
              <Flex justify="center" py={4} px={4} zIndex={10}>
                <HStack
                  spacing={2}
                  overflowX="auto"
                  maxW="full"
                  py={1}
                  sx={{
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      as="button"
                      type="button"
                      onClick={() => handleSelectImage(idx)}
                      boxSize="48px"
                      borderRadius="lg"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={
                        selectedIndex === idx ? "blue.400" : "transparent"
                      }
                      opacity={selectedIndex === idx ? 1 : 0.5}
                      flexShrink={0}
                    >
                      <Image
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </HStack>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default observer(ProductImageViewer);