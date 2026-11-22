import React, { useEffect, useState } from "react";
import { Box, Flex, SkeletonCircle, Text } from "@chakra-ui/react";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

const GAUGE_SIZE = 120;
const GAUGE_STROKE = 10;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_STROKE) / 2;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

interface ShopHealthGaugeProps {
  score: number;
  loading: boolean;
}

export const ShopHealthGauge: React.FC<ShopHealthGaugeProps> = React.memo(({ score, loading }) => {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (loading) {
      setShown(0);
      return;
    }
    const timer = setTimeout(() => setShown(score), 150);
    return () => clearTimeout(timer);
  }, [score, loading]);

  const color =
    score >= 80 ? dashboardPalette.success : score >= 50 ? dashboardPalette.warning : dashboardPalette.danger;
  const label = score >= 80 ? "Optimized" : score >= 50 ? "Action Needed" : "Incomplete";
  const offset = GAUGE_CIRCUMFERENCE * (1 - shown / 100);

  if (loading) {
    return <SkeletonCircle size={`${GAUGE_SIZE}px`} />;
  }

  return (
    <Box position="relative" w={`${GAUGE_SIZE}px`} h={`${GAUGE_SIZE}px`} flexShrink={0}>
      <svg
        width={GAUGE_SIZE}
        height={GAUGE_SIZE}
        viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke="var(--merchant-surface-soft)"
          strokeWidth={GAUGE_STROKE}
        />
        <circle
          cx={GAUGE_SIZE / 2}
          cy={GAUGE_SIZE / 2}
          r={GAUGE_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s ease" }}
        />
      </svg>
      <Flex position="absolute" inset={0} direction="column" align="center" justify="center">
        <Text fontSize="2xl" fontWeight="800" lineHeight="1" letterSpacing="-0.02em" color="var(--merchant-text)">
          {score}%
        </Text>
        <Text fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color={color} mt={1}>
          {label}
        </Text>
      </Flex>
    </Box>
  );
});

ShopHealthGauge.displayName = "ShopHealthGauge";
export default ShopHealthGauge;

