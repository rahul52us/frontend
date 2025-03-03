import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';

// const floatAnimation = keyframes`
//   0% { transform: translateY(0); }
//   50% { transform: translateY(-6px); }
//   100% { transform: translateY(0); }
// `;

const DashboardCard = ({ label, value, icon, color }) => {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.900', 'white');
//   const float = `${floatAnimation} 3s ease-in-out infinite`;
  const borderColor = useColorModeValue(`${color}.300`, `${color}.500`);

  return (
    <Box
      bg={cardBg}
      backdropFilter="blur(10px)"
      p={4}
      borderRadius="xl"
      borderWidth={2}
      borderColor={borderColor}
      boxShadow="md"
      textAlign="center"
      transition="all 0.3s ease"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Icon */}
      <Flex justify="center" align="center" mb={2} >
        <Icon as={icon} w={10} h={10} color={`${color}.400`} />
      </Flex>
      
      {/* Value */}
      <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={1}>
        {value.toLocaleString()}
      </Text>
      
      {/* Label */}
      <Text fontSize="lg" color="gray.500">
        {label}
      </Text>
    </Box>
  );
};

export default DashboardCard;
