"use client";

import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
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
import React from "react";
import { Line } from "react-chartjs-2";
import { FiTrendingUp } from "react-icons/fi";
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

interface BuyerAnalyticsOverviewProps {
  spendingChart: SpendingChartPoint[];
  totalOutstanding: number;
  activeOrders: number;
  deliveredOrders: number;
}

export const BuyerAnalyticsOverview: React.FC<BuyerAnalyticsOverviewProps> = ({
  spendingChart,
  totalOutstanding,
  activeOrders,
  deliveredOrders,
}) => {
  // If no spending history, generate last 6 friendly month placeholders
  const chartPoints = spendingChart.length > 0
    ? spendingChart
    : [
        { label: "Jun", totalSpent: 0, orderCount: 0 },
        { label: "Jul", totalSpent: 0, orderCount: 0 },
        { label: "Aug", totalSpent: 0, orderCount: 0 },
        { label: "Sep", totalSpent: 0, orderCount: 0 },
        { label: "Oct", totalSpent: 0, orderCount: 0 },
        { label: "Nov", totalSpent: 0, orderCount: 0 },
      ];

  const chartData = {
    labels: chartPoints.map((p) => p.label),
    datasets: [
      {
        label: "Spending (₹)",
        data: chartPoints.map((p) => p.totalSpent),
        fill: true,
        borderColor: "#0D9488",
        backgroundColor: "rgba(13, 148, 136, 0.12)",
        tension: 0.4,
        pointBackgroundColor: "#0D9488",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => `Spent: ₹${Number(ctx.raw || 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 },
          color: "var(--color-text-secondary, #94a3b8)",
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          font: { size: 11 },
          color: "var(--color-text-secondary, #94a3b8)",
          callback: (value: any) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`,
        },
      },
    },
  };

  const totalSpentPeriod = chartPoints.reduce((acc, curr) => acc + curr.totalSpent, 0);

  return (
    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
      {/* 6-Month Spending Trend Line Chart */}
      <Box
        gridColumn={{ base: "span 1", lg: "span 2" }}
        bg="var(--color-surface)"
        borderRadius="2xl"
        p={{ base: 4, md: 5 }}
        borderWidth="1px"
        borderColor="var(--color-border)"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <HStack spacing={2}>
              <Icon as={FiTrendingUp} color="teal.400" />
              <Heading size="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--color-text-secondary)">
                Purchase & Spending Trend
              </Heading>
            </HStack>
            <Text fontSize="xl" fontWeight="900" color="var(--color-text-primary)" mt={1}>
              {formatCurrency(totalSpentPeriod)}
            </Text>
          </Box>
          <Text fontSize="10px" color="var(--color-text-secondary)">
            Last 6 Months
          </Text>
        </Flex>

        <Box h="190px" w="100%">
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Box>

      {/* Credit & Fulfillment Health Widget */}
      <Box
        bg="var(--color-surface)"
        borderRadius="2xl"
        p={{ base: 4, md: 5 }}
        borderWidth="1px"
        borderColor="var(--color-border)"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Text fontSize="xs" fontWeight="800" color="var(--color-text-secondary)" textTransform="uppercase" letterSpacing="0.08em">
            Account Status & Khata
          </Text>
          <Text fontSize="sm" color="var(--color-text-secondary)" mt={1}>
            Health breakdown of your vendor transactions.
          </Text>

          <VStack align="stretch" spacing={3} mt={4}>
            <Flex justify="space-between" align="center" p={3} borderRadius="xl" bg="var(--color-surface-soft)">
              <Text fontSize="xs" fontWeight="700" color="var(--color-text-primary)">
                Active Deliveries
              </Text>
              <Text fontSize="sm" fontWeight="900" color="blue.400">
                {activeOrders} In-Transit
              </Text>
            </Flex>

            <Flex justify="space-between" align="center" p={3} borderRadius="xl" bg="var(--color-surface-soft)">
              <Text fontSize="xs" fontWeight="700" color="var(--color-text-primary)">
                Total Completed
              </Text>
              <Text fontSize="sm" fontWeight="900" color="green.400">
                {deliveredOrders} Orders
              </Text>
            </Flex>

            <Flex justify="space-between" align="center" p={3} borderRadius="xl" bg="orange.500" color="white">
              <Text fontSize="xs" fontWeight="800" textTransform="uppercase">
                Khata Pending
              </Text>
              <Text fontSize="sm" fontWeight="900">
                {formatCurrency(totalOutstanding)}
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </SimpleGrid>
  );
};

