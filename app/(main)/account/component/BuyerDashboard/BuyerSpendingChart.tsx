"use client";

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import { SpendingChartPoint } from "./types";
import { formatCurrency } from "./utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BuyerSpendingChartProps {
  spendingChart: SpendingChartPoint[];
}

export const BuyerSpendingChart: React.FC<BuyerSpendingChartProps> = ({ spendingChart }) => {
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const cardBg = useColorModeValue("white", "gray.800");
  const softBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textPrimary = useColorModeValue("gray.800", "white");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  const chartPoints =
    spendingChart && spendingChart.length > 0
      ? spendingChart
      : [
          { label: "Jun", totalSpent: 0, orderCount: 0 },
          { label: "Jul", totalSpent: 0, orderCount: 0 },
          { label: "Aug", totalSpent: 0, orderCount: 0 },
          { label: "Sep", totalSpent: 0, orderCount: 0 },
          { label: "Oct", totalSpent: 0, orderCount: 0 },
          { label: "Nov", totalSpent: 0, orderCount: 0 },
        ];

  const totalSpentPeriod = chartPoints.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);
  const totalOrdersPeriod = chartPoints.reduce((acc, curr) => acc + (curr.orderCount || 0), 0);
  const avgOrderValue = totalOrdersPeriod > 0 ? Math.round(totalSpentPeriod / totalOrdersPeriod) : 0;
  const maxMonth = chartPoints.reduce(
    (prev, current) => (prev.totalSpent > current.totalSpent ? prev : current),
    chartPoints[0]
  );

  // Line / Area Data
  const lineChartData = {
    labels: chartPoints.map((p) => p.label),
    datasets: [
      {
        label: "Spending (₹)",
        data: chartPoints.map((p) => p.totalSpent),
        fill: true,
        borderColor: "#0D9488",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(13, 148, 136, 0.32)");
          gradient.addColorStop(1, "rgba(13, 148, 136, 0.00)");
          return gradient;
        },
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: "#0D9488",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2.5,
        pointRadius: 4.5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Bar Data
  const barChartData = {
    labels: chartPoints.map((p) => p.label),
    datasets: [
      {
        label: "Monthly Purchases (₹)",
        data: chartPoints.map((p) => p.totalSpent),
        backgroundColor: "rgba(13, 148, 136, 0.75)",
        hoverBackgroundColor: "#0D9488",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: any) => `Spent: ₹${Number(ctx.raw || 0).toLocaleString("en-IN")}`,
          afterLabel: (ctx: any) => {
            const count = chartPoints[ctx.dataIndex]?.orderCount || 0;
            return `Orders: ${count}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11, weight: "600" },
          color: "#94a3b8",
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
        },
        ticks: {
          font: { size: 11 },
          color: "#94a3b8",
          callback: (value: any) =>
            value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`,
        },
      },
    },
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      p={{ base: 4, md: 5 }}
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      {/* Chart Header + Switcher */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        mb={4}
        wrap="wrap"
        gap={3}
      >
        <Box>
          <HStack spacing={2}>
            <Flex
              w="28px"
              h="28px"
              align="center"
              justify="center"
              borderRadius="lg"
              bg="rgba(13, 148, 136, 0.14)"
              color="teal.500"
            >
              <Icon as={FiTrendingUp} boxSize={4} />
            </Flex>
            <Text
              fontSize="xs"
              fontWeight="900"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color={textMuted}
            >
              Monthly Purchasing Trend
            </Text>
          </HStack>
          <Text fontSize="xl" fontWeight="900" color={textPrimary} mt={1}>
            {formatCurrency(totalSpentPeriod)}{" "}
            <Text as="span" fontSize="xs" fontWeight="600" color={textMuted}>
              spent across {totalOrdersPeriod} orders (Last 6 Months)
            </Text>
          </Text>
        </Box>

        {/* View Switcher */}
        <ButtonGroup size="xs" isAttached variant="outline" borderRadius="xl">
          <Button
            onClick={() => setChartType("area")}
            bg={chartType === "area" ? "teal.600" : "transparent"}
            color={chartType === "area" ? "white" : textMuted}
            borderColor={borderColor}
            _hover={{ bg: chartType === "area" ? "teal.600" : softBg }}
            leftIcon={<Icon as={FiActivity} />}
          >
            Trend Curve
          </Button>
          <Button
            onClick={() => setChartType("bar")}
            bg={chartType === "bar" ? "teal.600" : "transparent"}
            color={chartType === "bar" ? "white" : textMuted}
            borderColor={borderColor}
            _hover={{ bg: chartType === "bar" ? "teal.600" : softBg }}
            leftIcon={<Icon as={FiBarChart2} />}
          >
            Monthly Bars
          </Button>
        </ButtonGroup>
      </Flex>

      {/* 3 Quick Micro-KPI Badges that give instant insights */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mb={4}>
        <Box p={3} borderRadius="xl" bg={softBg} border="1px solid" borderColor={borderColor}>
          <Text fontSize="10px" fontWeight="700" color={textMuted} textTransform="uppercase">
            Average Order Value
          </Text>
          <Text fontSize="md" fontWeight="800" color={textPrimary} mt={0.5}>
            {formatCurrency(avgOrderValue)}
          </Text>
          <Text fontSize="10px" color="teal.500" fontWeight="600">
            Per transaction average
          </Text>
        </Box>

        <Box p={3} borderRadius="xl" bg={softBg} border="1px solid" borderColor={borderColor}>
          <Text fontSize="10px" fontWeight="700" color={textMuted} textTransform="uppercase">
            Peak Spending Month
          </Text>
          <Text fontSize="md" fontWeight="800" color={textPrimary} mt={0.5}>
            {maxMonth?.label || "N/A"}
          </Text>
          <Text fontSize="10px" color="orange.500" fontWeight="600">
            {formatCurrency(maxMonth?.totalSpent || 0)} highest spend
          </Text>
        </Box>

        <Box p={3} borderRadius="xl" bg={softBg} border="1px solid" borderColor={borderColor}>
          <Text fontSize="10px" fontWeight="700" color={textMuted} textTransform="uppercase">
            Buying Frequency
          </Text>
          <Text fontSize="md" fontWeight="800" color={textPrimary} mt={0.5}>
            {totalOrdersPeriod > 0 ? (totalOrdersPeriod / 6).toFixed(1) : "0"} orders / mo
          </Text>
          <Text fontSize="10px" color="blue.500" fontWeight="600">
            Steady restocking
          </Text>
        </Box>
      </SimpleGrid>

      {/* The Visual Chart Area */}
      <Box h="190px" w="100%">
        {chartType === "area" ? (
          <Line data={lineChartData} options={chartOptions} />
        ) : (
          <Bar data={barChartData} options={chartOptions} />
        )}
      </Box>
    </Box>
  );
};
