import {
    AspectRatio,
    Badge,
    Box,
    Button,
    Container,
    Grid,
    GridItem,
    Heading,
    Image,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import {
    FaArrowRight
} from 'react-icons/fa';

const CreativeEcommerceSection = () => {
  
  // Color scheme
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box overflow="hidden">
   
      {/* Featured Collections with Tabs */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="container.xl">
          <Heading size="xl" textAlign="center" mb={10} color={headingColor}>
            Collections That Inspire
          </Heading>
          
          <Tabs variant="soft-rounded" colorScheme="purple" size="lg">
            <TabList justifyContent="center" mb={10}>
              <Tab mx={2}>Bestsellers</Tab>
              <Tab mx={2}>New Arrivals</Tab>
              <Tab mx={2}>Limited Edition</Tab>
            </TabList>
            
            <TabPanels>
              {[1, 2, 3].map((tabIndex) => (
                <TabPanel key={tabIndex} p={0}>
                  <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <Box 
                        position="relative" 
                        height="400px" 
                        borderRadius="xl" 
                        overflow="hidden"
                        boxShadow="xl"
                      >
                        <Image
                          src="https://img.freepik.com/free-photo/girls-with-coffe_1157-7270.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid"
                          alt={`Collection ${tabIndex}`}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          p={6}
                          bgGradient="linear(to-t, blackAlpha.800, transparent)"
                        >
                          <Badge colorScheme="purple" mb={2}>FEATURED</Badge>
                          <Heading size="lg" color="white" mb={2}>
                            {tabIndex === 1 ? 'Customer Favorites' : 
                             tabIndex === 2 ? 'Spring 2025 Collection' : 
                             'Artisan Series'}
                          </Heading>
                          <Text color="whiteAlpha.900" mb={4}>
                            {tabIndex === 1 ? 'Our most loved products chosen by customers like you.' : 
                             tabIndex === 2 ? 'Fresh styles to brighten your wardrobe.' : 
                             'Hand-crafted pieces with limited availability.'}
                          </Text>
                          <Button 
                            rightIcon={<FaArrowRight />} 
                            colorScheme="purple" 
                            variant="solid"
                          >
                            Explore Collection
                          </Button>
                        </Box>
                      </Box>
                    </GridItem>
                    
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={6} h="100%">
                        {[1, 2, 3, 4].map((item) => (
                          <GridItem key={item}>
                            <Box 
                              bg={cardBg}
                              borderRadius="lg"
                              overflow="hidden"
                              boxShadow="md"
                              transition="all 0.3s"
                              _hover={{
                                transform: "scale(1.05)",
                                zIndex: 1,
                                boxShadow: "xl"
                              }}
                            >
                              <AspectRatio ratio={1}>
                                <Image
                                  src={`https://img.freepik.com/free-photo/girls-with-coffe_1157-7270.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_hybrid`}
                                  alt={`Product ${item}`}
                                  objectFit="cover"
                                />
                              </AspectRatio>
                              <Box p={4}>
                                <Text fontWeight="bold" noOfLines={1}>
                                  Product Name {item}
                                </Text>
                                <Text fontSize="sm" color={accentColor} fontWeight="bold">
                                  ${(19.99 + (item * 10)).toFixed(2)}
                                </Text>
                              </Box>
                            </Box>
                          </GridItem>
                        ))}
                      </Grid>
                    </GridItem>
                  </Grid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Box>
  );
};

export default CreativeEcommerceSection;