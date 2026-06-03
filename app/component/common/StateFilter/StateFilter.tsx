import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
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
} from '@chakra-ui/react';
import { FaGift, FaHeart, FaStar, FaRupeeSign, FaFire, FaStore, FaSearch, FaChevronDown } from 'react-icons/fa';
import { FiMapPin, FiTrendingUp } from 'react-icons/fi';

// ---------- Mock Data with State Images ----------
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  sales: number;
  rating: number;
}

interface StateData {
  id: string;
  name: string;
  image: string; // state flag/icon image
  products: Product[];
}

const statesData: StateData[] = [
  {
    id: 'up',
    name: 'Uttar Pradesh',
    image: 'https://picsum.photos/id/10/50/50', // Taj Mahal themed
    products: [
      { id: 1, name: 'Handwoven Banarasi Silk Saree', price: 4500, image: 'https://picsum.photos/id/20/300/200', sales: 1240, rating: 4.8 },
      { id: 2, name: 'Agra Marble Carving', price: 1200, image: 'https://picsum.photos/id/21/300/200', sales: 890, rating: 4.6 },
      { id: 3, name: 'Moradabad Brass Utensils', price: 850, image: 'https://picsum.photos/id/22/300/200', sales: 2100, rating: 4.7 },
      { id: 4, name: 'Lucknow Chikankari Kurta', price: 1800, image: 'https://picsum.photos/id/23/300/200', sales: 560, rating: 4.9 },
      { id: 5, name: 'Varanasi Wooden Toys', price: 450, image: 'https://picsum.photos/id/24/300/200', sales: 3200, rating: 4.5 },
    ],
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    image: 'https://picsum.photos/id/11/50/50', // Gateway of India
    products: [
      { id: 6, name: 'Kolhapuri Chappals', price: 1200, image: 'https://picsum.photos/id/25/300/200', sales: 3400, rating: 4.7 },
      { id: 7, name: 'Paithani Silk Saree', price: 8500, image: 'https://picsum.photos/id/26/300/200', sales: 780, rating: 4.9 },
      { id: 8, name: 'Mumbai Art Prints', price: 350, image: 'https://picsum.photos/id/27/300/200', sales: 5600, rating: 4.4 },
      { id: 9, name: 'Nagpur Orange Flavours', price: 250, image: 'https://picsum.photos/id/28/300/200', sales: 8900, rating: 4.6 },
      { id: 10, name: 'Pune Handcrafted Pottery', price: 600, image: 'https://picsum.photos/id/29/300/200', sales: 2100, rating: 4.5 },
    ],
  },
  {
    id: 'rj',
    name: 'Rajasthan',
    image: 'https://picsum.photos/id/12/50/50', // Hawa Mahal
    products: [
      { id: 11, name: 'Jaipur Blue Pottery', price: 1400, image: 'https://picsum.photos/id/30/300/200', sales: 2300, rating: 4.8 },
      { id: 12, name: 'Jodhpur Bandhani Dupatta', price: 950, image: 'https://picsum.photos/id/31/300/200', sales: 4100, rating: 4.6 },
      { id: 13, name: 'Udaipur Miniature Paintings', price: 2800, image: 'https://picsum.photos/id/32/300/200', sales: 980, rating: 4.9 },
      { id: 14, name: 'Bikaner Camel Leather Products', price: 2100, image: 'https://picsum.photos/id/33/300/200', sales: 1650, rating: 4.7 },
      { id: 15, name: 'Pushkar Silver Jewellery', price: 3200, image: 'https://picsum.photos/id/34/300/200', sales: 2900, rating: 4.8 },
    ],
  },
  {
    id: 'tn',
    name: 'Tamil Nadu',
    image: 'https://picsum.photos/id/13/50/50', // Temple architecture
    products: [
      { id: 16, name: 'Kanchipuram Silk Saree', price: 7500, image: 'https://picsum.photos/id/35/300/200', sales: 820, rating: 4.9 },
      { id: 17, name: 'Tanjore Art Plates', price: 1800, image: 'https://picsum.photos/id/36/300/200', sales: 1340, rating: 4.7 },
      { id: 18, name: 'Madurai Sungudi Cotton', price: 600, image: 'https://picsum.photos/id/37/300/200', sales: 4100, rating: 4.5 },
      { id: 19, name: 'Mahabalipuram Stone Craft', price: 2200, image: 'https://picsum.photos/id/38/300/200', sales: 980, rating: 4.6 },
      { id: 20, name: 'Coimbatore Coconut Craft', price: 350, image: 'https://picsum.photos/id/39/300/200', sales: 5600, rating: 4.4 },
    ],
  },
];

const StateFilter = () => {
  const [selectedState, setSelectedState] = useState<StateData>(statesData[0]);
  const [products, setProducts] = useState<Product[]>(statesData[0].products);
  const [loading, setLoading] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("Discovering top products...");
  const [searchTerm, setSearchTerm] = useState("");
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sectionBg = useColorModeValue("gray.50", "gray.900");
  const menuBg = useColorModeValue("white", "gray.800");

  const startLoader = (stateName: string) => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoaderProgress(0);
    setLoaderMessage(`Discovering top products from ${stateName}...`);
    setLoading(true);

    const LOADER_DURATION_MS = 2000;
    const stepPercent = 100 / (LOADER_DURATION_MS / 40);
    progressInterval.current = setInterval(() => {
      setLoaderProgress((prev) => {
        const next = Math.min(prev + stepPercent, 100);
        if (next >= 100 && progressInterval.current) {
          clearInterval(progressInterval.current);
        }
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

  const handleStateSelect = (state: StateData) => {
    if (state.id === selectedState.id) return;
    setSelectedState(state);
    startLoader(state.name);
    setTimeout(() => {
      setProducts(state.products);
    }, 200);
  };

  // Filter states based on search
  const filteredStates = statesData.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Box py={{ base: 8, md: 12 }} bg={sectionBg} minH="100vh">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        {/* Header */}
        <VStack spacing={4} mb={{ base: 6, md: 8 }}>
          <HStack spacing={2}>
            <Circle size="45px" bg="blue.100" _dark={{ bg: "blue.900" }}>
              <Icon as={FaStore} color="blue.600" boxSize={5} />
            </Circle>
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1.5} borderRadius="full">
              STATE WISE BESTSELLERS
            </Badge>
          </HStack>
          <Heading
            size={{ base: "xl", md: "2xl" }}
            fontWeight="900"
            textAlign="center"
            bgGradient="linear(135deg, #1e3a8a 0%, #3b82f6 100%)"
            bgClip="text"
          >
            Discover Top Products by State
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center" maxW="2xl">
            Select any state to see the most loved and highest-selling products from local artisans
          </Text>
        </VStack>

        {/* Custom State Dropdown with Images & Search */}
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
              _hover={{ bg: "blue.50", borderColor: "blue.400" }}
              _expanded={{ bg: "blue.50", borderColor: "blue.400" }}
              fontWeight="600"
              fontSize="md"
            >
              <HStack>
                <Text>{selectedState.name}</Text>
              </HStack>
            </MenuButton>
            <MenuList
              bg={menuBg}
              borderColor={borderColor}
              borderRadius="2xl"
              boxShadow="xl"
              p={2}
              minW="260px"
            >
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
                    bg={useColorModeValue("gray.50", "gray.700")}
                  />
                </InputGroup>
              </Box>
              <Box maxH="300px" overflowY="auto">
                {filteredStates.map((state) => (
                  <MenuItem
                    key={state.id}
                    onClick={() => handleStateSelect(state)}
                    borderRadius="xl"
                    _hover={{ bg: "blue.50" }}
                    _focus={{ bg: "blue.50" }}
                    bg={selectedState.id === state.id ? "blue.100" : "transparent"}
                  >
                    <HStack spacing={3}>
                      <Avatar src={state.image} size="sm" />
                      <Text fontWeight={selectedState.id === state.id ? "800" : "500"}>
                        {state.name}
                      </Text>
                      {selectedState.id === state.id && (
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

        {/* Products Section with Loader */}
        {loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="400px"
            gap={6}
            bg="whiteAlpha.700"
            _dark={{ bg: "blackAlpha.500" }}
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
              <Box
                key={product.id}
                bg={cardBg}
                borderRadius="2xl"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
                transition="all 0.3s"
                _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
              >
                <Box position="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    h="180px"
                    w="100%"
                    objectFit="cover"
                  />
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    bg="whiteAlpha.800"
                    backdropFilter="blur(4px)"
                    color="blue.700"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    <HStack spacing={1}>
                      <Icon as={FaFire} color="orange.500" boxSize={3} />
                      <Text>Top Seller</Text>
                    </HStack>
                  </Badge>
                </Box>

                <VStack p={4} align="stretch" spacing={2}>
                  <Text fontWeight="800" noOfLines={1}>
                    {product.name}
                  </Text>
                  <HStack justify="space-between">
                    <HStack spacing={1}>
                      <Icon as={FaStar} color="yellow.400" boxSize={3.5} />
                      <Text fontSize="sm" fontWeight="600">
                        {product.rating}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        ({product.sales}+ sold)
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FaRupeeSign} boxSize={3} color="green.600" />
                      <Text fontWeight="700" color="green.600">
                        {product.price.toLocaleString()}
                      </Text>
                    </HStack>
                  </HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    borderRadius="full"
                    mt={2}
                    rightIcon={<FiTrendingUp />}
                    _hover={{ bg: "blue.50", transform: "translateX(2px)" }}
                  >
                    View Product
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default StateFilter;