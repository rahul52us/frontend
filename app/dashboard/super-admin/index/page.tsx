"use client";

import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { FiActivity, FiBox, FiShield, FiShoppingBag, FiUsers } from "react-icons/fi";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
    MerchantHeroSection,
    MerchantPageShell,
    MerchantPanel,
    MerchantStatCard,
} from "../../components/common/merchantDashboardUI";

const SuperAdminDashboard = () => {
    // Mock data for dashboard stats
    const stats = [
        { label: "Total Shops", value: "128", helpText: "+12% this month", icon: FiShoppingBag, color: dashboardPalette.accentStrong, bg: "rgba(214, 183, 114, 0.10)" },
        { label: "Total Products", value: "4,320", helpText: "+5% this week", icon: FiBox, color: dashboardPalette.warning, bg: "rgba(224, 179, 91, 0.10)" },
        { label: "Active Users", value: "12,450", helpText: "Daily avg", icon: FiUsers, color: dashboardPalette.success, bg: "rgba(70, 201, 139, 0.10)" },
        { label: "Platform Revenue", value: "$45,200", helpText: "Last 30 days", icon: FiActivity, color: dashboardPalette.danger, bg: "rgba(239, 107, 107, 0.10)" },
    ];

    return (
        <MerchantPageShell>
            <MerchantHeroSection
                icon={FiShield}
                primaryBadge="Platform Control"
                title="Super Admin Dashboard"
                description="Welcome back. Monitor storefront growth, platform activity, and operational health from the central admin workspace."
                rightContent={
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} minW={{ xl: "360px" }}>
                        {stats.slice(0, 2).map((stat, index) => (
                            <MerchantStatCard
                                key={index}
                                label={stat.label}
                                value={stat.value}
                                icon={stat.icon}
                                iconColor={stat.color}
                                iconBg={stat.bg}
                            />
                        ))}
                    </SimpleGrid>
                }
            />

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4} mb={6}>
                {stats.map((stat, index) => (
                    <MerchantStatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        valueColor={stat.color}
                        icon={stat.icon}
                        iconColor={stat.color}
                        iconBg={stat.bg}
                        variant="panel"
                    />
                ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <MerchantPanel minH="260px">
                    <Text fontSize="xl" fontWeight="700" color={dashboardPalette.text} mb={3}>
                        Recent Activity
                    </Text>
                    <Text color={dashboardPalette.textMuted}>
                        Activity logs and platform updates will appear here.
                    </Text>
                </MerchantPanel>
                <MerchantPanel minH="260px">
                    <Text fontSize="xl" fontWeight="700" color={dashboardPalette.text} mb={3}>
                        Platform Health
                    </Text>
                    <Text color={dashboardPalette.textMuted}>
                        System status and performance metrics will appear here.
                    </Text>
                </MerchantPanel>
            </SimpleGrid>
        </MerchantPageShell>
    );
};

export default SuperAdminDashboard;
