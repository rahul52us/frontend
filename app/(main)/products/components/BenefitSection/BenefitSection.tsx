import { Box, Button, Circle, Container, Flex, Grid, GridItem, Heading, HStack, Icon, Image, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaHeadset, FaQuoteLeft, FaRegCreditCard, FaRegHeart, FaShippingFast } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
const testimonials = [
    {
      name: "Sarah M.",
      title: "Verified Buyer",
      quote: "The quality exceeded my expectations! Customer service was also amazing when I needed help.",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGRlY29yfGVufDB8MHwwfHx8Mg%3D%3D"
    },
    {
      name: "Michael T.",
      title: "Loyal Customer",
      quote: "I've been shopping here for years. They always have exactly what I need, and shipping is lightning fast.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVyc29ufGVufDB8MHwwfHx8Mg%3D%3D"
    },
    {
      name: "Aisha K.",
      title: "New Customer",
      quote: "First time shopper and I'm impressed! The website made it so easy to find exactly what I was looking for.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlcnNvbnxlbnwwfDB8MHx8fDI%3D"
    }
  ];
const BenefitSection = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const cardBg = useColorModeValue('white', 'gray.800');
    const accentColor = useColorModeValue('purple.500', 'purple.300');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
  
    const handleNext = () => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };
  
    const handlePrev = () => {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };
  
    useEffect(() => {
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }, []);

  return (
    <Container maxW="container.xl" mb={20}>
           <Grid templateColumns="repeat(12, 1fr)" gap={8}>
             {/* Testimonials */}
             <GridItem colSpan={{ base: 12, lg: 7 }}>
          <Box 
            bg={cardBg}
            p={8}
            borderRadius="2xl"
            boxShadow="base"
            bgGradient={useColorModeValue(
              'linear(to-br, white, purple.50)',
              'linear(to-br, gray.800, purple.900)'
            )}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Accent */}
            <Box
              position="absolute"
              top={0}
              left={0}
              w="4px"
              h="100%"
              bg={accentColor}
              borderRadius="full"
            />

            <VStack spacing={6} align="stretch">
              <Heading size="lg" color={headingColor} position="relative" pl={4}>
                What Our Customers Say
              </Heading>

              <Box position="relative" h="200px" overflow="hidden">
                {testimonials.map((testimonial, idx) => (
                  <Box
                    key={idx}
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h="100%"
                    opacity={idx === activeTestimonial ? 1 : 0}
                    transform={`translateX(${(idx - activeTestimonial) * 100}%)`}
                    transition="all 0.5s ease"
                    px={4}
                  >
                    <Flex align="center" h="100%">
                      {/* Quote Icon */}
                      <Icon
                        as={FaQuoteLeft}
                        color={accentColor}
                        boxSize={6}
                        opacity={0.5}
                        mr={4}
                      />

                      <VStack align="start" spacing={4} flex={1}>
                        <Text fontSize="md" fontStyle="italic" color={textColor}>
                        &quot;{testimonial.quote}&quot;
                        </Text>

                        <HStack spacing={4}>
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            borderRadius="full"
                            boxSize="50px"
                            objectFit="cover"
                            border={`2px solid ${accentColor}`}
                          />
                          <Box>
                            <Text fontWeight="bold" color={headingColor}>
                              {testimonial.name}
                            </Text>
                            <Text fontSize="sm" color={textColor}>
                              {testimonial.title}
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Box>
                ))}
              </Box>

              {/* Compact Navigation */}
              <Flex justify="space-between" align="center" px={4}>
                <Button
                  onClick={handlePrev}
                  variant="ghost"
                  size="sm"
                  colorScheme="purple"
                  leftIcon={<FiChevronLeft />}
                >
                  Prev
                </Button>

                <HStack spacing={2}>
                  {testimonials.map((_, idx) => (
                    <Circle
                      key={idx}
                      size={2}
                      bg={idx === activeTestimonial ? accentColor : 'gray.300'}
                      transition="all 0.3s ease"
                      onClick={() => setActiveTestimonial(idx)}
                      cursor="pointer"
                    />
                  ))}
                </HStack>

                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="sm"
                  colorScheme="purple"
                  rightIcon={<FiChevronRight />}
                >
                  Next
                </Button>
              </Flex>
            </VStack>
          </Box>
        </GridItem>
             
             {/* Trust Elements */}
             <GridItem colSpan={{ base: 12, lg: 5 }}>
               <VStack spacing={4} align="stretch" h="100%">
                 {[
                   { icon: FaShippingFast, title: 'Fast & Free Shipping', desc: 'On orders over $50. Delivered in eco-friendly packaging.' },
                   { icon: FaRegCreditCard, title: 'Secure Checkout', desc: 'Multiple payment options with advanced encryption.' },
                   { icon: FaHeadset, title: 'Premium Support', desc: '24/7 assistance from our dedicated customer care team.' },
                   { icon: FaRegHeart, title: 'Satisfaction Guaranteed', desc: '30-day returns with no questions asked policy.' }
                 ].map((item, idx) => (
                   <HStack
                     key={idx}
                     p={4}
                     bg={cardBg}
                     borderRadius="lg"
                     boxShadow="md"
                     transition="all 0.3s"
                     _hover={{
                       transform: "translateX(8px)",
                       boxShadow: "lg",
                     }}
                   >
                     <Circle size={12} bg={'purple.50'}>
                       <Icon as={item.icon} w={6} h={6} color={accentColor} />
                     </Circle>
                     <Box>
                       <Heading size="sm" mb={1}>{item.title}</Heading>
                       <Text fontSize="sm" color={textColor}>{item.desc}</Text>
                     </Box>
                   </HStack>
                 ))}
               </VStack>
             </GridItem>
           </Grid>
         </Container>
  )
}

export default BenefitSection