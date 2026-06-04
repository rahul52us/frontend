import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Icon,
  Flex,
  Circle,
  Progress,
  Button,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { FaGift, FaHeart, FaStore, FaSearch, FaChevronDown } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { observer } from 'mobx-react-lite';
import ProductCard from '../../../(main)/products/components/ProductCard/ProductCard';
import { shopStore } from "../../../store/shopStore/shopStore";

// ---------- MOCK STATES (will be used if API fails) ----------
const MOCK_STATES: StateData[] = [
  { _id: 'up', name: 'Uttar Pradesh', image: 'https://picsum.photos/id/10/50/50' },
  { _id: 'mh', name: 'Maharashtra', image: 'https://picsum.photos/id/11/50/50' },
  { _id: 'rj', name: 'Rajasthan', image: 'https://picsum.photos/id/12/50/50' },
  { _id: 'tn', name: 'Tamil Nadu', image: 'https://picsum.photos/id/13/50/50' },
  { _id: 'wb', name: 'West Bengal', image: 'https://picsum.photos/id/14/50/50' },
  { _id: 'dl', name: 'Delhi', image: 'https://picsum.photos/id/15/50/50' },
];

interface StateData {
  _id: string;
  name: string;
  image: string;
  code?: string;
}

const StateFilter = observer(() => {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');
  const menuBg = useColorModeValue('white', 'gray.800');

  const [states, setStates] = useState<StateData[]>(MOCK_STATES); // start with mock
  const [selectedState, setSelectedState] = useState<StateData | null>(MOCK_STATES[0]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState('Discovering top products...');
  const [searchTerm, setSearchTerm] = useState('');
  const [isStatesLoading, setIsStatesLoading] = useState(true);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Try to load states from real API, fallback to mock
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/states');
        if (response.ok) {
          const data = await response.json();
          if (data?.status === 'success' && Array.isArray(data.data)) {
            setStates(data.data);
            setSelectedState(data.data[0]);
          }
        }
      } catch (error) {
        console.warn('Using mock states because /api/states failed:', error);
      } finally {
        setIsStatesLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Load products for selected state
  const fetchProductsForState = async (stateId: string, stateName: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    startLoader(stateName);
    setProducts([]);

    try {
      // Adjust payload to match your backend – common patterns:
      // Option 1: send stateId
      // Option 2: send stateName
      const payload = {
        stateId: stateId,        // change to 'state' or 'location.state' as needed
        page: 1,
        limit: 12,
      };
      const response = await shopStore.getAllProducts(payload, true);
      if (abortController.signal.aborted) return;

      let productList: any[] = [];
      if (response?.status === 'success') {
        if (Array.isArray(response.data)) productList = response.data;
        else if (response.data?.products) productList = response.data.products;
      } else if (Array.isArray(response?.data)) productList = response.data;
      else if (Array.isArray(response)) productList = response;

      if (!Array.isArray(productList)) productList = [];
      setProducts(productList);
      stopLoader();
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error(error);
        toast({ title: 'Error', description: `Failed to load products for ${stateName}`, status: 'error', duration: 3000 });
        setProducts([]);
        stopLoader();
      }
    }
  };

  const startLoader = (stateName: string) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoaderProgress(0);
    setLoaderMessage(`Discovering top products from ${stateName}...`);
    setLoading(true);

    const LOADER_DURATION_MS = 2000;
    const stepPercent = 100 / (LOADER_DURATION_MS / 40);
    progressInterval.current = setInterval(() => {
      setLoaderProgress(prev => {
        const next = Math.min(prev + stepPercent, 100);
        if (next >= 100 && progressInterval.current) clearInterval(progressInterval.current);
        if (next < 30) setLoaderMessage(`Exploring ${stateName} treasures...`);
        else if (next < 70) setLoaderMessage(`Finding best sellers ✨`);
        else setLoaderMessage(`Almost ready! 🎁`);
        return next;
      });
    }, 40);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setLoaderProgress(100);
      if (progressInterval.current) clearInterval(progressInterval.current);
      timeoutRef.current = null;
    }, LOADER_DURATION_MS);
  };

  const stopLoader = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setLoaderProgress(100);
  };

  const handleStateSelect = (state: StateData) => {
    if (!selectedState || state._id === selectedState._id) return;
    setSelectedState(state);
    fetchProductsForState(state._id, state.name);
  };

  const filteredStates = states.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Fetch products for the initially selected state
  useEffect(() => {
    if (selectedState && !isStatesLoading) {
      fetchProductsForState(selectedState._id, selectedState.name);
    }
  }, [selectedState, isStatesLoading]);

  if (isStatesLoading) {
    return (
      <Box py={12} textAlign="center">
        <Text>Loading states...</Text>
      </Box>
    );
  }

  if (!selectedState) return null;

  return (
    <Box py={{ base: 8, md: 12 }} bg={sectionBg} minH="100vh">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Header (same as before) */}
        <VStack spacing={4} mb={{ base: 6, md: 8 }}>
          <HStack spacing={2}>
            <Circle size="45px" bg="blue.100" _dark={{ bg: 'blue.900' }}>
              <Icon as={FaStore} color="blue.600" boxSize={5} />
            </Circle>
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1.5} borderRadius="full">
              STATE WISE BESTSELLERS
            </Badge>
          </HStack>
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            fontWeight="900"
            textAlign="center"
            bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
            bgClip="text"
          >
            Discover Top Products by State
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }} textAlign="center" maxW="2xl">
            Select any state to see the most loved and highest-selling products from local artisans
          </Text>
        </VStack>

        {/* Dropdown (same) */}
        <Flex justify="center" mb={8}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              leftIcon={<Avatar src={selectedState.image} size="xs" mr={2} />}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2xl"
              px={6}
              py={5}
              _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
              fontWeight="600"
            >
              <HStack>
                <Text>{selectedState.name}</Text>
              </HStack>
            </MenuButton>
            <MenuList bg={menuBg} borderColor={borderColor} borderRadius="2xl" boxShadow="xl" p={2} minW="260px">
              <Box px={2} pb={2}>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search state..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="full"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  />
                </InputGroup>
              </Box>
              <Box maxH="300px" overflowY="auto">
                {filteredStates.map((state) => (
                  <MenuItem
                    key={state._id}
                    onClick={() => handleStateSelect(state)}
                    borderRadius="xl"
                    _hover={{ bg: 'blue.50' }}
                    bg={selectedState._id === state._id ? 'blue.100' : 'transparent'}
                  >
                    <HStack spacing={3}>
                      <Avatar src={state.image} size="sm" />
                      <Text fontWeight={selectedState._id === state._id ? '800' : '500'}>
                        {state.name}
                      </Text>
                      {selectedState._id === state._id && (
                        <Badge colorScheme="blue" fontSize="9px" ml="auto">
                          Selected
                        </Badge>
                      )}
                    </HStack>
                  </MenuItem>
                ))}
                {filteredStates.length === 0 && (
                  <Text px={3} py={2} color="gray.500" fontSize="sm">
                    No states found
                  </Text>
                )}
              </Box>
            </MenuList>
          </Menu>
        </Flex>

        {/* Products / Loader */}
        {loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="400px"
            gap={6}
            bg="whiteAlpha.700"
            _dark={{ bg: 'blackAlpha.500' }}
            borderRadius="3xl"
            backdropFilter="blur(8px)"
            p={8}
          >
            <Box position="relative" boxSize="80px">
              <Icon
                as={FaGift}
                boxSize="80px"
                color="blue.400"
                animation="pulse 0.8s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
              <Icon
                as={FaHeart}
                position="absolute"
                top="-10px"
                right="-10px"
                boxSize="24px"
                color="red.500"
                animation="bounce 0.6s infinite"
                sx={{
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                  },
                }}
              />
            </Box>
            <Text fontWeight="800" fontSize="lg" color="blue.600">
              {loaderMessage}
            </Text>
            <Progress
              value={loaderProgress}
              size="sm"
              width="250px"
              colorScheme="blue"
              borderRadius="full"
              hasStripe
              isAnimated
            />
            <Text fontSize="sm" color="gray.500">Just a moment, loading top products...</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
});

export default StateFilter;