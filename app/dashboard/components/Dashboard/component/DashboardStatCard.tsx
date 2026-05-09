import { Box, Circle, HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { dashboardPalette } from '../../../../layouts/dashboardLayout/dashboardPalette';
import { fadeUp } from '../SellerOverview';

const MotionBox = motion(Box);

const DashboardStatCard = ({
  icon,
  label,
  value,
  helper,
  gradient,
  trend,
}: {
  icon: any;
  label: string;
  value: string | number;
  helper: string;
  gradient: string;
  trend?: "up" | "down";
}) => {
  const cardBg = useColorModeValue("white", dashboardPalette.surface);
  const borderColor = useColorModeValue("#EEF2F7", dashboardPalette.border);
  const labelColor = useColorModeValue("#4B5563", dashboardPalette.textMuted);
  const valueColor = useColorModeValue("#0F172A", dashboardPalette.text);
  const helperColor = useColorModeValue("#64748B", dashboardPalette.textSoft);
  const trendUp = useColorModeValue("#22C55E", dashboardPalette.success);
  const trendDown = useColorModeValue("#EF4444", dashboardPalette.danger);

  return (
    <MotionBox
      variants={fadeUp}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="24px"
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 4 }}
      boxShadow={useColorModeValue("0 16px 40px rgba(15, 23, 42, 0.06)", "0 20px 40px rgba(0, 0, 0, 0.26)")}
      position="relative"
      overflow="hidden"
      minH="132px"
    >
      <Box
        position="absolute"
        top="-22px"
        right="-18px"
        w={{ base: "70px", md: "78px" }}
        h={{ base: "70px", md: "78px" }}
        borderRadius="full"
        bgGradient={gradient}
        opacity={useColorModeValue(0.12, 0.2)}
      />
      <Circle size={{ base: "30px", md: "40px" }} borderRadius="14px" bgGradient={gradient} color="white" mb={2}>
        <Icon as={icon} boxSize={5} />
      </Circle>
      <Text fontSize="sm" color={labelColor} fontWeight="500">
        {label}
      </Text>
      <Text mt={{base:0.5,md:1}} fontSize={{ base: "xl", md: "3xl" }} lineHeight="0.95" fontWeight="700" color={valueColor}>
        {value}
      </Text>
      <HStack mt={1} spacing={1} color={helperColor} align="center">
        {trend === "up" ? <FiTrendingUp color={trendUp} size={12} /> : null}
        {trend === "down" ? <FiTrendingDown color={trendDown} size={12} /> : null}
        <Text fontSize="xs" fontWeight="500">
          {helper}
        </Text>
      </HStack>
    </MotionBox>
  );
};

export default DashboardStatCard