"use client";

import React from "react";
import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, Icon, Flex } from "@chakra-ui/react";
import { FiUsers, FiShoppingBag, FiBox, FiActivity } from "react-icons/fi";

const SuperAdminDashboard = () => {
    // Mock data for dashboard stats
    const stats = [
        { label: "Total Shops", value: "128", helpText: "+12% this month", icon: FiShoppingBag, color: "blue.500" },
        { label: "Total Products", value: "4,320", helpText: "+5% this week", icon: FiBox, color: "purple.500" },
        { label: "Active Users", value: "12,450", helpText: "Daily avg", icon: FiUsers, color: "green.500" },
        { label: "Platform Revenue", value: "$45,200", helpText: "Last 30 days", icon: FiActivity, color: "orange.500" },
    ];

    return (
        <Box>
            <Heading mb={2}>Super Admin Dashboard</Heading>
            <Text color="gray.500" mb={8}>Welcome back, Super Admin. Here is an overview of the platform.</Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                {stats.map((stat, index) => (
                    <Card key={index} borderLeft="4px solid" borderColor={stat.color}>
                        <CardBody>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Stat>
                                    <StatLabel fontSize="sm" color="gray.500">{stat.label}</StatLabel>
                                    <StatNumber fontSize="2xl" fontWeight="bold">{stat.value}</StatNumber>
                                    <StatHelpText mb={0}>{stat.helpText}</StatHelpText>
                                </Stat>
                                <Box p={2} bg={`${stat.color}15`} borderRadius="md">
                                    <Icon as={stat.icon} boxSize={6} color={stat.color} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card minH="300px">
                    <CardBody>
                        <Heading size="md" mb={4}>Recent Activity</Heading>
                        <Text color="gray.500">Activity logs and platform updates will appear here.</Text>
                    </CardBody>
                </Card>
                <Card minH="300px">
                    <CardBody>
                        <Heading size="md" mb={4}>Platform Health</Heading>
                        <Text color="gray.500">System status and performance metrics will appear here.</Text>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Box>
    );
};

export default SuperAdminDashboard;
