import { AspectRatio, Box, Circle, Container, Grid, GridItem, Heading, HStack, Icon, Image, List, ListIcon, ListItem, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { FaCheckCircle, FaRegLightbulb } from 'react-icons/fa';

const sustainabilityPoints = [
    "Eco-friendly packaging reduces waste by 75%",
    "Carbon-neutral shipping options available",
    "Ethical sourcing from certified suppliers",
    "Part of proceeds supports environmental causes"
  ];
  
  const OurCommitment = () => {
      const accentColor = useColorModeValue('purple.500', 'purple.300');
      const textColor = useColorModeValue('gray.600', 'gray.300');
      const headingColor = useColorModeValue('gray.800', 'white');
      return (
   <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16} mb={20}>
          <Container maxW="container.xl">
            <Grid templateColumns="repeat(12, 1fr)" gap={8}>
              <GridItem colSpan={{ base: 12, lg: 6 }}>
                <Box mb={{ base: 10, lg: 0 }}>
                  <VStack spacing={6} align="flex-start">
                    <HStack>
                      <Circle size={10} bg={accentColor} color="white">
                        <Icon as={FaRegLightbulb} w={5} h={5} />
                      </Circle>
                      <Heading size="md" color={accentColor}>OUR COMMITMENT</Heading>
                    </HStack>
                    
                    <Heading size="xl" lineHeight="1.2" color={headingColor}>
                      Sustainability Meets Style
                    </Heading>
                    
                    <Text fontSize="lg" color={textColor}>
                      We believe beautiful products shouldn&apos;t come at the expense of our planet. That&apos;s why we&apos;re committed to sustainable practices across our entire supply chain.
                    </Text>
                    
                    <List spacing={3} pt={4}>
                      {sustainabilityPoints.map((point, idx) => (
                        <ListItem key={idx}>
                          <HStack>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            <Text>{point}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </Box>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, lg: 6 }}>
                <AspectRatio ratio={4/3} w="100%" borderRadius="xl" overflow="hidden" boxShadow="xl">
                  <Image
                    src="/api/placeholder/600/450"
                    alt="Sustainability"
                    objectFit="cover"
                  />
                </AspectRatio>
              </GridItem>
            </Grid>
          </Container>
        </Box>
  )
}

export default OurCommitment