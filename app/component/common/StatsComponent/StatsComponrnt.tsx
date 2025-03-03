import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { animate, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.floor(v)),
    });

    return controls.stop;
  }, [value, duration]);

  return <motion.span>{displayValue}</motion.span>;
};

interface Stat {
  value: number | string;
  label: string;
}

interface StatsGridProps {
  statsData: Stat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ statsData }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <Grid
      ref={ref}
      templateColumns={{ base: "1fr 1fr", md: "repeat(5, 1fr)" }}
      mt={{ base: 8, lg: 14 }}
      gap={{ base: 8, md: 8, lg: 4 }}
    >
      {statsData.map((stat, index) => (
        <GridItem
          key={index}
          colSpan={{ base: index === statsData.length - 1 ? 2 : 1, md: 1 }}
          justifySelf={{ base: index === statsData.length - 1 ? "center" : "unset", md: "unset" }}
        >
          <Box
            borderRight={index < statsData.length - 1 ? "1px solid #DEDEDE" : "none"}
            pr={{ lg: 1 }}
          >
            <Text
              textAlign="center"
              fontSize={{ base: "2rem", md: "2.4rem", lg: "3.6rem" }}
              fontWeight={500}
              lineHeight={{ base: "3rem" }}
            >
              {inView && typeof stat.value === "number" ? (
                <>
                  <AnimatedNumber value={stat.value} />
                  {stat.label !== "Licensed Professionals" ? "+" : ""}
                </>
              ) : (
                stat.value
              )}
            </Text>

            <Text color="#0F0F0F" textAlign="center" fontSize={{ base: "xs", lg: "md" }}>
              {stat.label}
            </Text>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default StatsGrid;
