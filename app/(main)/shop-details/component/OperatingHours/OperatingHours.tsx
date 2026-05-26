"use client";
import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Divider,
  Flex,
  Button,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState, useEffect, useMemo } from "react";
import { FiClock, FiCalendar, FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useBreakpointValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Helper to format remaining time until closing
const getTimeRemaining = (closeTime: string) => {
  const now = new Date();
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);
  const closeDate = new Date();
  closeDate.setHours(closeHour, closeMinute, 0, 0);
  const diffMs = closeDate.getTime() - now.getTime();
  if (diffMs <= 0) return null;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (3600000)) / 60000);
  return { hours: diffHrs, minutes: diffMins };
};

const OperatingHours = ({ shopData }: any) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [isExpanded, setIsExpanded] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  // Sync expanded state with desktop mode
  useEffect(() => {
    if (isDesktop) setIsExpanded(true);
  }, [isDesktop]);

  const operatingHours = Array.isArray(shopData?.operatingHours)
    ? shopData.operatingHours
    : [];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];
  const todayHours = operatingHours.find((h) => h.day === today);

  const isOpenNow = () => {
    if (!todayHours) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMinute] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);
    return currentMinutes >= (openHour * 60 + openMinute) && currentMinutes < (closeHour * 60 + closeMinute);
  };

  const isLive = isOpenNow();
  const timeRemaining = isLive && todayHours ? getTimeRemaining(todayHours.close) : null;

  // Pulsing animation for open indicator (no keyframes)
  const pulseAnimation = {
    scale: [1, 1.3, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Header Section */}
      <VStack spacing={2} align="center">
        <Badge
          variant="solid"
          bg="blue.500"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="2xs"
          letterSpacing="0.1em"
          fontWeight="800"
        >
          OPERATING HOURS
        </Badge>
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="800"
          bgGradient="linear(to-r, gray.800, gray.600)"
          bgClip="text"
          letterSpacing="-0.02em"
          textAlign="center"
        >
          When to Find Us
        </Heading>
        <Text color="gray.500" fontSize="sm" fontWeight="500" textAlign="center">
          We look forward to welcoming you
        </Text>
      </VStack>

      {/* Main Card */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.12)" }}
      >
        {/* Today's Status Strip - Dynamic background based on open/closed */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          bg={isLive ? "green.500" : "gray.700"}
          p={{ base: 6, md: 8 }}
          color="white"
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={4}
        >
          <VStack align="flex-start" spacing={1}>
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" opacity={0.8}>
              CURRENT STATUS
            </Text>
            <HStack spacing={2}>
              <MotionBox
                w="10px"
                h="10px"
                bg="white"
                borderRadius="full"
                animate={isLive ? pulseAnimation : {}}
              />
              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" letterSpacing="-0.01em">
                {isLive ? "Open Now" : "Closed"}
              </Heading>
            </HStack>
            {isLive && timeRemaining && (
              <Tooltip label="Closing time may vary" hasArrow>
                <Text fontSize="sm" fontWeight="500" opacity={0.9}>
                  Closes in {timeRemaining.hours}h {timeRemaining.minutes}m
                </Text>
              </Tooltip>
            )}
          </VStack>

          <Box
            bg="rgba(255,255,255,0.15)"
            p={3}
            borderRadius="full"
            backdropFilter="blur(4px)"
          >
            <Icon as={FiClock} boxSize={6} />
          </Box>
        </Flex>

        {/* Hours Display Section */}
        <Box p={{ base: 5, md: 6 }}>
          <VStack spacing={5} align="stretch">
            <HStack justify="space-between" align="center" wrap="wrap" gap={3}>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="xs" fontWeight="800" color="gray.400" letterSpacing="0.1em">
                  TODAY · {today.toUpperCase()}
                </Text>
                <Text fontSize="2xl" fontWeight="800" color={isLive ? "green.600" : "gray.900"}>
                  {todayHours ? `${todayHours.open} — ${todayHours.close}` : "CLOSED"}
                </Text>
              </VStack>

              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                rightIcon={<Icon as={isExpanded ? FiChevronUp : FiChevronDown} />}
                fontWeight="700"
                fontSize="sm"
                color="blue.600"
                borderColor="blue.200"
                _hover={{ bg: "blue.50", borderColor: "blue.300" }}
                size="sm"
              >
                {isExpanded ? "Show Less" : "Full Week"}
              </Button>
            </HStack>

            <AnimatePresence>
              {isExpanded && (
                <MotionBox
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  overflow="hidden"
                >
                  <VStack spacing={1} pt={4} borderTop="1px solid" borderColor={borderColor}>
                    {days.map((day) => {
                      const hours = operatingHours.find((h) => h.day === day);
                      const isToday = day === today;
                      return (
                        <Flex
                          key={day}
                          w="full"
                          justify="space-between"
                          align="center"
                          py={3}
                          px={3}
                          bg={isToday ? "blue.50" : "transparent"}
                          borderRadius="lg"
                          _hover={{ bg: isToday ? "blue.50" : "gray.50" }}
                          transition="background 0.2s"
                        >
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight={isToday ? "800" : "600"}
                            color={isToday ? "blue.700" : "gray.600"}
                          >
                            {day}
                          </Text>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="700"
                            color={hours ? (isToday ? "blue.800" : "gray.800") : "gray.400"}
                          >
                            {hours ? `${hours.open} — ${hours.close}` : "CLOSED"}
                          </Text>
                        </Flex>
                      );
                    })}
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>

            {/* Extra note for holidays or special hours (optional) */}
            {!isExpanded && (
              <HStack spacing={2} pt={2} justify="center">
                <Icon as={FiCalendar} boxSize={3} color="gray.400" />
                <Text fontSize="2xs" color="gray.400" fontWeight="500">
                  Special hours may apply on holidays
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      </Box>
    </VStack>
  );
};

export default OperatingHours;