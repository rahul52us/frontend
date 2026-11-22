"use client";

import {
  AspectRatio,
  Box,
  Circle,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiX } from "react-icons/fi";

const MotionBox = motion(Box);

const extractImageUrl = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item?.file?.url || item?.url || item?.src || "";
};

/* ---------- Single tile ---------- */
interface TileProps {
  url: string;
  index: number;
  onOpen: (index: number) => void;
  remaining?: number;
}

const GalleryTile = memo(({ url, index, onOpen, remaining = 0 }: TileProps) => {
  const border = useColorModeValue("gray.100", "whiteAlpha.200");
  const bg = useColorModeValue("gray.100", "whiteAlpha.100");

  return (
    <Box
      as="button"
      aria-label={remaining > 0 ? "View all photos" : `Open photo ${index + 1}`}
      onClick={() => onOpen(index)}
      role="group"
      position="relative"
      w="full"
      h="full"
      overflow="hidden"
      borderRadius={{ base: "xl", md: "2xl" }}
      border="1px solid"
      borderColor={border}
      bg={bg}
      cursor="zoom-in"
      transition="box-shadow 0.3s ease, transform 0.2s ease"
      _hover={{ boxShadow: "lg" }}
      _active={{ transform: "scale(0.98)" }}
      _focusVisible={{ boxShadow: "outline" }}
    >
      <Image
        src={url}
        alt={`Shop photo ${index + 1}`}
        w="full"
        h="full"
        objectFit="cover"
        loading="lazy"
        decoding="async"
        transition="transform 0.5s ease"
        _groupHover={{ transform: "scale(1.05)" }}
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent 50%)"
        opacity={0}
        transition="opacity 0.3s"
        _groupHover={{ opacity: 1 }}
      />
      {remaining > 0 && (
        <Flex
          position="absolute"
          inset={0}
          direction="column"
          align="center"
          justify="center"
          bg="blackAlpha.600"
          backdropFilter="blur(2px)"
          color="white"
        >
          <Text fontSize="2xl" fontWeight="800" lineHeight="1">
            +{remaining}
          </Text>
          <Text fontSize="xs" fontWeight="semibold" mt={1}>
            View all
          </Text>
        </Flex>
      )}
    </Box>
  );
});
GalleryTile.displayName = "GalleryTile";

/* ---------- Main component ---------- */
const ShopImages = memo(({ shopData }: { shopData: any }) => {
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");
  const chipBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const chipText = useColorModeValue("gray.700", "gray.200");
  const iconBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const dotIdle = useColorModeValue("gray.300", "whiteAlpha.400");

  const gallery: string[] = useMemo(() => {
    const rawGallery =
      shopData?.gallery ||
      shopData?.images ||
      shopData?.photos ||
      shopData?.data?.gallery ||
      [];
    return Array.isArray(rawGallery)
      ? rawGallery.map(extractImageUrl).filter(Boolean)
      : [];
  }, [shopData]);

  const n = gallery.length;

  // Mobile carousel state
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = scrollerRef.current;
      if (!el) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      setCarouselIndex(best);
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  // Lightbox state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const openAt = useCallback(
    (i: number) => {
      setActive(i);
      onOpen();
    },
    [onOpen]
  );
  const next = useCallback(() => setActive((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setActive((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, next, prev]);

  // Keep the active thumbnail visible in the lightbox
  useEffect(() => {
    if (!isOpen) return;
    document.getElementById(`gallery-thumb-${active}`)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active, isOpen]);

  if (n === 0) return null;

  const uniformRatio = n === 1 ? 16 / 9 : n === 2 ? 4 / 3 : 4 / 5;

  return (
    <VStack align="stretch" spacing={4} w="full">
      {/* Header */}
      <Flex justify="space-between" align="center" gap={3}>
        <HStack spacing={3} minW={0}>
          <Circle size="40px" bg={iconBg} color={iconColor} flexShrink={0}>
            <Icon as={FiImage} boxSize={5} />
          </Circle>
          <Box minW={0}>
            <Heading
              as="h3"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="800"
              color={textPrimary}
              letterSpacing="-0.02em"
              lineHeight="shorter"
            >
              Photo gallery
            </Heading>
            <Text fontSize="xs" color={textMuted} noOfLines={1}>
              A look inside the shop
            </Text>
          </Box>
        </HStack>
        <Box
          flexShrink={0}
          px={2.5}
          py={1}
          borderRadius="full"
          bg={chipBg}
          color={chipText}
          fontSize="xs"
          fontWeight="bold"
        >
          {n} {n === 1 ? "photo" : "photos"}
        </Box>
      </Flex>

      {/* Mobile: snap carousel */}
      <Box display={{ base: "block", md: "none" }}>
        <Box
          ref={scrollerRef}
          onScroll={handleScroll}
          position="relative"
          display="flex"
          gap="12px"
          overflowX="auto"
          mx={-3}
          px={3}
          pb={1}
          css={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {gallery.map((url, i) => (
            <Box
              key={`${url}-${i}`}
              flexShrink={0}
              w={n === 1 ? "full" : "76%"}
              scrollSnapAlign="center"
            >
              <AspectRatio ratio={n === 1 ? 4 / 3 : 4 / 5} w="full">
                <GalleryTile url={url} index={i} onOpen={openAt} />
              </AspectRatio>
            </Box>
          ))}
        </Box>

        {n > 1 &&
          (n <= 8 ? (
            <HStack justify="center" spacing={1.5} mt={3}>
              {gallery.map((_, i) => (
                <Box
                  as="button"
                  key={i}
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  h="6px"
                  w={carouselIndex === i ? "20px" : "6px"}
                  borderRadius="full"
                  bg={carouselIndex === i ? "brand.500" : dotIdle}
                  transition="all 0.3s ease"
                />
              ))}
            </HStack>
          ) : (
            <Text
              textAlign="center"
              fontSize="xs"
              fontWeight="semibold"
              color={textMuted}
              mt={3}
            >
              {carouselIndex + 1} / {n}
            </Text>
          ))}
      </Box>

      {/* Tablet / desktop */}
      <Box display={{ base: "none", md: "block" }}>
        {n >= 5 ? (
          <Box aspectRatio="2 / 1">
            <Grid
              h="full"
              templateColumns="repeat(4, minmax(0, 1fr))"
              templateRows="repeat(2, minmax(0, 1fr))"
              gap={3}
            >
              <GridItem colSpan={2} rowSpan={2} minH={0} minW={0}>
                <GalleryTile url={gallery[0]} index={0} onOpen={openAt} />
              </GridItem>
              {gallery.slice(1, 5).map((url, i) => (
                <GridItem key={`${url}-${i}`} minH={0} minW={0}>
                  <GalleryTile
                    url={url}
                    index={i + 1}
                    onOpen={openAt}
                    remaining={i === 3 ? n - 5 : 0}
                  />
                </GridItem>
              ))}
            </Grid>
          </Box>
        ) : (
          <SimpleGrid columns={Math.min(n, 5)} spacing={3}>
            {gallery.map((url, i) => (
              <AspectRatio key={`${url}-${i}`} ratio={uniformRatio} w="full">
                <GalleryTile url={url} index={i} onOpen={openAt} />
              </AspectRatio>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
        <ModalContent bg="transparent" boxShadow="none" m={0}>
          <Flex direction="column" h="100dvh" color="white">
            {/* Top bar */}
            <Flex justify="space-between" align="center" px={4} py={3}>
              <Text fontSize="sm" fontWeight="bold">
                {active + 1} / {n}
              </Text>
              <IconButton
                aria-label="Close gallery"
                icon={<FiX size={20} />}
                onClick={onClose}
                size="md"
                borderRadius="full"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
                _active={{ transform: "scale(0.94)" }}
              />
            </Flex>

            {/* Image area (swipe on mobile, arrows on desktop) */}
            <Flex
              flex={1}
              minH={0}
              align="center"
              justify="center"
              position="relative"
              px={{ base: 0, md: 20 }}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(dx) > 50) {
                  if (dx < 0) next();
                  else prev();
                }
              }}
            >
              {n > 1 && (
                <IconButton
                  aria-label="Previous photo"
                  icon={<FiChevronLeft size={24} />}
                  onClick={prev}
                  display={{ base: "none", md: "flex" }}
                  position="absolute"
                  left={5}
                  zIndex={2}
                  borderRadius="full"
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                />
              )}

              <AnimatePresence mode="wait">
                <MotionBox
                  key={active}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  maxW="100%"
                >
                  <Image
                    src={gallery[active]}
                    alt={`Shop photo ${active + 1}`}
                    maxW="100%"
                    maxH="calc(100dvh - 160px)"
                    objectFit="contain"
                    borderRadius={{ base: "none", md: "xl" }}
                    userSelect="none"
                    draggable={false}
                  />
                </MotionBox>
              </AnimatePresence>

              {n > 1 && (
                <IconButton
                  aria-label="Next photo"
                  icon={<FiChevronRight size={24} />}
                  onClick={next}
                  display={{ base: "none", md: "flex" }}
                  position="absolute"
                  right={5}
                  zIndex={2}
                  borderRadius="full"
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: "whiteAlpha.300" }}
                />
              )}
            </Flex>

            {/* Thumbnail strip */}
            {n > 1 && (
              <Flex
                gap={2}
                px={4}
                py={3}
                overflowX="auto"
                justify={n <= 6 ? "center" : "flex-start"}
                css={{
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                {gallery.map((url, i) => (
                  <Box
                    as="button"
                    id={`gallery-thumb-${i}`}
                    key={`${url}-${i}`}
                    aria-label={`Show photo ${i + 1}`}
                    onClick={() => setActive(i)}
                    flexShrink={0}
                    boxSize="52px"
                    borderRadius="lg"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={active === i ? "white" : "transparent"}
                    opacity={active === i ? 1 : 0.5}
                    transition="all 0.2s"
                    _hover={{ opacity: 1 }}
                  >
                    <Image
                      src={url}
                      alt=""
                      boxSize="full"
                      objectFit="cover"
                      loading="lazy"
                    />
                  </Box>
                ))}
              </Flex>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </VStack>
  );
});

ShopImages.displayName = "ShopImages";

export default ShopImages;