'use client';

import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiCheck,
  FiChevronDown,
  FiCompass,
  FiMapPin,
  FiPackage,
  FiSearch,
} from 'react-icons/fi';
import ProductCard from '../../../(main)/products/components/ProductCard/ProductCard';
import { shopStore } from '../../../store/shopStore/shopStore';

interface StateData {
  _id: string;
  name: string;
  image: string;
  code?: string;
  tagline?: string;
}

// ---------- CURATED FALLBACK STATES ----------
const MOCK_STATES: StateData[] = [
  {
    _id: 'mh',
    name: 'Maharashtra',
    tagline: 'Handlooms, spices & local crafts',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=120&q=80',
  },
  {
    _id: 'rj',
    name: 'Rajasthan',
    tagline: 'ethnic wear, decor & handicrafts',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=120&q=80',
  },
  {
    _id: 'up',
    name: 'Uttar Pradesh',
    tagline: 'Chikankari, brassware & sweets',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=120&q=80',
  },
  {
    _id: 'dl',
    name: 'Delhi NCR',
    tagline: 'Trending fashion & electronics',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=120&q=80',
  },
  {
    _id: 'tn',
    name: 'Tamil Nadu',
    tagline: 'Silk sarees, filter coffee & bronze',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&q=80',
  },
  {
    _id: 'wb',
    name: 'West Bengal',
    tagline: 'Terracotta, cottons & specialties',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=120&q=80',
  },
];

const StateFilter = observer(() => {
  const toast = useToast();

  // Hoisted Theme Tokens
  const sectionBg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const subtleBg = useColorModeValue('#F8FAFC', 'gray.850');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const titleColor = useColorModeValue('gray.900', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');
  const menuBg = useColorModeValue('white', 'gray.800');
  const searchInputBg = useColorModeValue('gray.50', 'gray.700');

  const [states, setStates] = useState<StateData[]>(MOCK_STATES);
  const [selectedState, setSelectedState] = useState<StateData | null>(MOCK_STATES[0]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isStatesLoading, setIsStatesLoading] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load states from API, fallback cleanly to MOCK_STATES
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        if (response.ok) {
          const data = await response.json();
          if (data?.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
            setStates(data.data);
            setSelectedState(data.data[0]);
          }
        }
      } catch (error) {
        console.warn('Using fallback states list:', error);
      } finally {
        setIsStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Single unified fetch function
  const fetchProductsForState = useCallback(
    async (stateId: string, stateName: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);

      try {
        const payload = {
          stateId,
          page: 1,
          limit: 12,
        };
        const response = await shopStore.getAllProducts(payload, true);
        if (abortController.signal.aborted) return;

        let productList: any[] = [];
        if (response?.status === 'success') {
          if (Array.isArray(response.data)) productList = response.data;
          else if (response.data?.products) productList = response.data.products;
        } else if (Array.isArray(response?.data)) {
          productList = response.data;
        } else if (Array.isArray(response)) {
          productList = response;
        }

        if (!Array.isArray(productList)) productList = [];
        setProducts(productList);
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error(error);
          toast({
            title: 'Unable to load state products',
            description: `Could not fetch products for ${stateName}.`,
            status: 'error',
            duration: 3000,
          });
          setProducts([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [toast]
  );

  // Trigger fetch whenever selectedState changes (prevents duplicate calls)
  useEffect(() => {
    if (selectedState && !isStatesLoading) {
      fetchProductsForState(selectedState._id, selectedState.name);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedState, isStatesLoading, fetchProductsForState]);

  const handleStateSelect = (state: StateData) => {
    if (!selectedState || state._id === selectedState._id) return;
    setSelectedState(state);
  };

  const filteredStates = useMemo(
    () =>
      states.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [states, searchTerm]
  );

  if (!selectedState && !isStatesLoading) return null;

  return (
    <Box
      as="section"
      py={{ base: 5, md: 9 }}
      bg={sectionBg}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
        {/* 1. Compact Header + Searchable State Dropdown */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'flex-end' }}
          mb={{ base: 3.5, md: 5 }}
          gap={3}
        >
          <Box>
            <HStack spacing={1.5} mb={1}>
              <Icon as={FiCompass} color="var(--color-primary)" boxSize={3.5} />
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color="var(--color-primary)"
              >
                Regional Specialties
              </Text>
            </HStack>
            <Heading
              as="h2"
              fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
              fontWeight="800"
              color={titleColor}
              letterSpacing="tight"
              lineHeight="1.2"
            >
              Shop Famous Finds by State
            </Heading>
            <Text
              display={{ base: 'none', sm: 'block' }}
              fontSize="xs"
              color={mutedText}
              mt={0.5}
            >
              Explore authentic local bestsellers and specialties across India
            </Text>
          </Box>

          {/* Searchable State Selector Menu (For quick jump across all states) */}
          {selectedState && (
            <Menu isLazy placement="bottom-end">
              <MenuButton
                as={Button}
                size="xs"
                h={{ base: '32px', md: '36px' }}
                px={3}
                rounded="full"
                bg={subtleBg}
                color={titleColor}
                border="1px solid"
                borderColor={borderColor}
                rightIcon={<FiChevronDown />}
                _hover={{ borderColor: 'blue.300', bg: cardBg }}
                _active={{ bg: cardBg }}
                fontWeight="700"
                flexShrink={0}
              >
                <HStack spacing={2}>
                  <Avatar
                    src={selectedState.image}
                    name={selectedState.name}
                    size="2xs"
                  />
                  <Text fontSize="xs">{selectedState.name}</Text>
                </HStack>
              </MenuButton>

              <MenuList
                bg={menuBg}
                borderColor={borderColor}
                borderRadius="2xl"
                boxShadow="lg"
                p={2}
                minW="240px"
                zIndex={20}
              >
                <Box px={1} pb={2}>
                  <InputGroup size="xs">
                    <InputLeftElement pointerEvents="none" h="30px">
                      <Icon as={FiSearch} color="gray.400" boxSize={3} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search state..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      h="30px"
                      borderRadius="full"
                      bg={searchInputBg}
                      fontSize="xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </InputGroup>
                </Box>

                <Box
                  maxH="240px"
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#CBD5E0',
                      borderRadius: 'full',
                    },
                  }}
                >
                  {filteredStates.map((state) => {
                    const isSelected = selectedState._id === state._id;
                    return (
                      <MenuItem
                        key={state._id}
                        onClick={() => handleStateSelect(state)}
                        borderRadius="xl"
                        py={2}
                        px={2.5}
                        bg={isSelected ? 'blue.50' : 'transparent'}
                        _hover={{ bg: isSelected ? 'blue.50' : subtleBg }}
                      >
                        <HStack spacing={2.5} w="full">
                          <Avatar
                            src={state.image}
                            name={state.name}
                            size="xs"
                          />
                          <Text
                            fontSize="xs"
                            fontWeight={isSelected ? '700' : '500'}
                            color={isSelected ? 'var(--color-primary)' : titleColor}
                            flex="1"
                            noOfLines={1}
                          >
                            {state.name}
                          </Text>
                          {isSelected && (
                            <Icon as={FiCheck} color="var(--color-primary)" boxSize={3.5} />
                          )}
                        </HStack>
                      </MenuItem>
                    );
                  })}

                  {filteredStates.length === 0 && (
                    <Text
                      px={3}
                      py={4}
                      color={mutedText}
                      fontSize="xs"
                      textAlign="center"
                    >
                      No matching state found
                    </Text>
                  )}
                </Box>
              </MenuList>
            </Menu>
          )}
        </Flex>

        {/* 2. Horizontal Swipeable State Pill Bar (Instant 1-Tap State Switching on Mobile) */}
        <Flex
          gap={2}
          overflowX="auto"
          pb={3}
          mb={3}
          sx={{
            scrollSnapType: 'x mandatory',
            '& > *': { scrollSnapAlign: 'start' },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {states.map((state) => {
            const isSelected = selectedState?._id === state._id;
            return (
              <HStack
                key={state._id}
                as="button"
                onClick={() => handleStateSelect(state)}
                spacing={2}
                pl={1.5}
                pr={3.5}
                py={1.5}
                h={{ base: '38px', md: '42px' }}
                rounded="full"
                bg={isSelected ? 'var(--color-primary)' : subtleBg}
                color={isSelected ? 'white' : titleColor}
                border="1px solid"
                borderColor={isSelected ? 'var(--color-primary)' : borderColor}
                boxShadow={
                  isSelected
                    ? '0 6px 16px -4px rgba(37, 99, 235, 0.4)'
                    : 'none'
                }
                flexShrink={0}
                transition="all 0.2s ease"
                _hover={{
                  borderColor: isSelected ? 'var(--color-primary)' : 'blue.300',
                  transform: 'translateY(-1px)',
                }}
                _active={{ transform: 'scale(0.97)' }}
              >
                <Avatar
                  src={state.image}
                  name={state.name}
                  size="xs"
                  boxSize={{ base: '26px', md: '28px' }}
                  border="1.5px solid"
                  borderColor={isSelected ? 'white' : 'transparent'}
                />
                <Text
                  fontSize="xs"
                  fontWeight={isSelected ? '700' : '600'}
                  whiteSpace="nowrap"
                >
                  {state.name}
                </Text>
              </HStack>
            );
          })}
        </Flex>

        {/* Active State Context Bar */}
        {selectedState && (
          <Flex
            bg={subtleBg}
            px={3.5}
            py={2}
            rounded="xl"
            border="1px solid"
            borderColor={borderColor}
            mb={4}
            align="center"
            justify="space-between"
            gap={2}
          >
            <HStack spacing={2} minW={0}>
              <Icon as={FiMapPin} color="var(--color-primary)" boxSize={3.5} flexShrink={0} />
              <Text fontSize="xs" fontWeight="700" color={titleColor} noOfLines={1}>
                Showing specialties from {selectedState.name}
              </Text>
              {selectedState.tagline && (
                <Text
                  fontSize="xs"
                  color={mutedText}
                  noOfLines={1}
                  display={{ base: 'none', md: 'inline' }}
                >
                  • {selectedState.tagline}
                </Text>
              )}
            </HStack>

            {!loading && (
              <Badge
                colorScheme="brand"
                variant="subtle"
                rounded="full"
                px={2.5}
                py={0.5}
                fontSize="10px"
                fontWeight="700"
                flexShrink={0}
              >
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </Badge>
            )}
          </Flex>
        )}

        {/* 3. Products Grid (2 Columns on Mobile, 3 on Tablet, 4 on Desktop) */}
        {loading || isStatesLoading ? (
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 4, lg: 6 }}
            spacing={{ base: 2.5, sm: 3.5, md: 5 }}
          >
            {[...Array(8)].map((_, idx) => (
              <Box
                key={idx}
                bg={cardBg}
                rounded="2xl"
                p={2.5}
                border="1px solid"
                borderColor={borderColor}
              >
                <Skeleton
                  h={{ base: '140px', sm: '165px', md: '190px' }}
                  w="full"
                  rounded="xl"
                  mb={3}
                />
                <Skeleton h="10px" w="45%" mb={2} rounded="sm" />
                <Skeleton h="14px" w="90%" mb={1.5} rounded="sm" />
                <Skeleton h="14px" w="65%" mb={3} rounded="sm" />
                <Flex justify="space-between" align="center">
                  <Skeleton h="18px" w="40%" rounded="md" />
                  <Skeleton h="28px" w="56px" rounded="lg" />
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        ) : products.length > 0 ? (
          <SimpleGrid
            columns={{ base: 2, sm: 2, md: 3, lg: 6 }}
            spacing={{ base: 2.5, sm: 3.5, md: 5 }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </SimpleGrid>
        ) : (
          /* Clean Empty State when a state has no products yet */
          <VStack
            py={12}
            px={4}
            spacing={3}
            bg={subtleBg}
            rounded="2xl"
            border="1px dashed"
            borderColor={borderColor}
            textAlign="center"
          >
            <Flex
              w="44px"
              h="44px"
              rounded="full"
              bg="var(--color-surface-hover)"
              color="var(--color-primary)"
              align="center"
              justify="center"
            >
              <Icon as={FiPackage} boxSize={5} />
            </Flex>
            <Box>
              <Text fontSize="md" fontWeight="700" color={titleColor}>
                No products listed in {selectedState?.name} yet
              </Text>
              <Text fontSize="xs" color={mutedText} mt={0.5} maxW="xs">
                Local sellers from {selectedState?.name} are onboarding soon. Explore another state in the meantime!
              </Text>
            </Box>
            {states.length > 1 && (
              <Button
                size="xs"
                h="34px"
                px={4}
                colorScheme="brand"
                rounded="full"
                onClick={() => {
                  const nextState =
                    states.find((s) => s._id !== selectedState?._id) || states[0];
                  handleStateSelect(nextState);
                }}
              >
                Explore {states.find((s) => s._id !== selectedState?._id)?.name}
              </Button>
            )}
          </VStack>
        )}
    </Box>
  );
});

export default StateFilter;