"use client";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  SimpleGrid,
  Center,
  Text,
  VStack,
  Circle,
  HStack,
  Icon,
  Heading,
  Container,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import stores from "../../../store/stores";
import useDebounce from "../../../component/config/component/customHooks/useDebounce";
import ShopCard from "./element/ShopCard";
import ShopCardSkeleton from "./ShopSkeletonCard/ShowSkeletonCard";
import { keyframes } from "@emotion/react";
import { tablePageLimit } from "../../../component/config/utils/variable";
import { FaStoreAlt, FaRocket, FaWind, FaQuoteLeft } from "react-icons/fa";

// --- Animations ---
const tiltIn = keyframes`
  0% { opacity: 0; transform: perspective(1000px) rotateX(10deg) translateY(60px); filter: blur(15px); }
  100% { opacity: 1; transform: perspective(1000px) rotateX(0deg) translateY(0); filter: blur(0); }
`;

const floatingOrb = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); }
  33% { transform: translateY(-30px) translateX(20px); }
  66% { transform: translateY(15px) translateX(-20px); }
`;

const ShopSection = observer(() => {
  const {
    shopStore: { getAllShops, shop },
    auth: { openNotification },
  } = stores;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // THEME COLORS
  const accentColor = "#00BFFF"; // Skyblue
  const bgBase = useColorModeValue("gray.50", "rgba(5, 10, 20, 1)"); // Midnight Navy

  const applyGetAllShops = useCallback(
    async ({ page = 1, limit = tablePageLimit, search = "", append = false }) => {
      try {
        await getAllShops({ page, limit, search, append });
      } catch (err: any) {
        openNotification({ title: "Portal Busy", message: err.message, type: "error" });
      }
    },
    [getAllShops, openNotification]
  );

  useEffect(() => {
    setCurrentPage(1);
    applyGetAllShops({ page: 1, limit: tablePageLimit, search: debouncedSearchQuery, append: false });
  }, [debouncedSearchQuery, applyGetAllShops]);

  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage > (shop.totalPages || 1)) return;
    setCurrentPage(nextPage);
    applyGetAllShops({ page: nextPage, search: debouncedSearchQuery, append: true });
  }, [currentPage, shop.totalPages, applyGetAllShops, debouncedSearchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !shop.loading && currentPage < (shop.totalPages || 1)) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [shop.loading, currentPage, shop.totalPages, handleLoadMore]);

  const shops = shop?.data || [];
  const totalShops = shop?.totalShops || 0;
  const loading = shop?.loading && currentPage === 1;
  const loadingMore = shop?.loading && currentPage > 1;
  const allLoaded = currentPage >= (shop?.totalPages || 1);

  return (
    <Box position="relative" overflow="hidden" bg={bgBase} minH="100vh" pb={32}>
      
      {/* --- PARALLAX ARTISTIC BACKGROUND (Skyblue & Deep Blue Orbs) --- */}
      <Box position="absolute" top="5%" left="-5%" w="600px" h="600px" bg={`${accentColor}20`} filter="blur(140px)" borderRadius="full" opacity="0.4" animation={`${floatingOrb} 15s infinite ease-in-out`} />
      <Box position="absolute" bottom="10%" right="-5%" w="500px" h="500px" bg="blue.900" filter="blur(140px)" borderRadius="full" opacity="0.3" animation={`${floatingOrb} 20s infinite ease-in-out reverse`} />

      <Container maxW="container.xl" pt={20} position="relative" zIndex={2}>
        
        {/* --- EDITORIAL HEADER DESIGN --- */}
        <Flex direction={{ base: "column", lg: "row" }} align="flex-end" justify="space-between" mb={20} gap={8}>
          <VStack align="start" spacing={4} maxW="700px">
            <HStack spacing={3}>
                <Box w="40px" h="2px" bg={accentColor} />
                <Text color={accentColor} fontWeight="black" textTransform="uppercase" letterSpacing="4px" fontSize="xs">
                  The Storefront Collection
                </Text>
            </HStack>
            <Heading size="3xl" fontWeight="900" lineHeight="0.9" letterSpacing="-2px" color={useColorModeValue("black", "white")}>
              Curated Spaces. <br />
              <Text as="span" color="transparent" style={{ WebkitTextStroke: `1px ${accentColor}` }}>Unique</Text> Stories.
            </Heading>
          </VStack>
          
          <Box p={6} borderLeft="4px solid" borderColor={accentColor} bg={useColorModeValue("whiteAlpha.400", "whiteAlpha.100")} backdropFilter="blur(10px)">
             <Icon as={FaQuoteLeft} color={accentColor} boxSize={6} mb={2} opacity={0.6} />
             <Text fontSize="sm" fontWeight="bold" color={useColorModeValue("gray.600", "whiteAlpha.800")} maxW="250px">
               &quot;Every neighborhood has a heartbeat. These shops are ours.&quot;
             </Text>
          </Box>
        </Flex>

        {/* --- DYNAMIC GRID --- */}
        <SimpleGrid columns={[1, 1, 2, 3]} spacingX={10} spacingY={20}>
          {shops.map((item: any, index: number) => (
            <Box
              key={item.id || index}
              animation={`${tiltIn} 1s cubic-bezier(0.19, 1, 0.22, 1) both`}
              style={{ animationDelay: `${(index % 6) * 0.1}s` }}
            >
              <ShopCard shop={item} onClick={() => {}} />
            </Box>
          ))}
        </SimpleGrid>

        {/* --- SKELETONS --- */}
        {loading && (
          <SimpleGrid columns={[1, 1, 2, 3]} spacing={10} mt={10}>
            {[1, 2, 3].map((i) => <ShopCardSkeleton key={i} />)}
          </SimpleGrid>
        )}

        {/* --- THE INFINITE HUD (Heads-Up Display) --- */}
        <Box
            ref={loadMoreRef}
            position="fixed"
            bottom="40px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={100}
            pointerEvents="none"
        >
            {!allLoaded && (
                <Flex 
                    bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(10, 20, 35, 0.8)")} 
                    backdropFilter="blur(20px)" 
                    px={6} py={3} 
                    borderRadius="full" 
                    boxShadow="0 10px 40px rgba(0,0,0,0.3)"
                    border="1px solid"
                    borderColor={useColorModeValue("whiteAlpha.500", "whiteAlpha.200")}
                    align="center"
                    gap={4}
                    animation="fadeIn 0.5s ease"
                    pointerEvents="auto"
                >
                    <Icon 
                      as={loadingMore ? FaRocket : FaWind} 
                      color={accentColor} 
                      animation={loadingMore ? "pulse 1s infinite" : "none"} 
                    />
                    <Text fontSize="xs" fontWeight="black" color={useColorModeValue("gray.700", "whiteAlpha.900")} letterSpacing="1px">
                        {loadingMore ? "EXPANDING..." : `DISCOVERED ${shops.length} / ${totalShops}`}
                    </Text>
                    <Box w="100px" h="4px" bg={useColorModeValue("gray.100", "whiteAlpha.100")} borderRadius="full" position="relative" overflow="hidden">
                        <Box 
                            position="absolute" left={0} top={0} h="full" bg={accentColor} 
                            w={`${(shops.length / (totalShops || 1)) * 100}%`} 
                            transition="width 1s ease"
                            boxShadow={`0 0 10px ${accentColor}`}
                        />
                    </Box>
                </Flex>
            )}
        </Box>

        {/* --- FINAL CELEBRATION --- */}
        {!loading && allLoaded && shops.length > 0 && (
          <Center mt={40} pb={20}>
            <VStack spacing={8}>
                <Box position="relative">
                    <Circle size="120px" bg={useColorModeValue("blue.50", "whiteAlpha.50")} border="1px dashed" borderColor={accentColor} />
                    <Icon as={FaStoreAlt} position="absolute" top="35px" left="35px" boxSize={12} color={accentColor} />
                </Box>
                <VStack spacing={0}>
                    <Text fontSize="4xl" fontWeight="900" letterSpacing="-1px" color={useColorModeValue("black", "white")}>End of the road.</Text>
                    <Text color="gray.500" fontWeight="bold">You&apos;ve officially seen every shop in the district.</Text>
                </VStack>
            </VStack>
          </Center>
        )}
      </Container>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>
    </Box>
  );
});

export default ShopSection;