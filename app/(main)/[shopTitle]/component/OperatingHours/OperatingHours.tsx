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
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useBreakpointValue } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const OperatingHours = ({ shopData }: any) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync expanded state with desktop mode on initial load
  useEffect(() => {
    if (isDesktop) {
      setIsExpanded(true);
    }
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

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Editorial Header */}
      <VStack spacing={1} align="center">
        <Badge
          variant="outline"
          color="gray.400"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="2xs"
          letterSpacing="0.1em"
          fontWeight="800"
          borderColor="gray.200"
        >
          SCHEDULE
        </Badge>
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="800"
          color="gray.900"
          letterSpacing="-0.02em"
        >
          Open Hours
        </Heading>
      </VStack>

      {/* Modern Schedule Strip - Solid Minimal */}
      <Box
        bg="white"
        borderRadius="24px"
        boxShadow="0 20px 40px rgba(0,0,0,0.04)"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
      >
        <VStack spacing={0} align="stretch">
          {/* Today Strip */}
          <Flex
            bg="gray.900"
            p={8}
            color="white"
            justify="space-between"
            align="center"
          >
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" color="gray.400">
                STATUS
              </Text>
              <Heading fontSize="2xl" fontWeight="800">
                {isLive ? "Open Now" : "Closed"}
              </Heading>
            </VStack>

            <Box
              bg="rgba(255,255,255,0.1)"
              p={3}
              borderRadius="full"
            >
              <Icon
                as={FiClock}
                boxSize={6}
                color="white"
              />
            </Box>
          </Flex>

          {/* Hours Display */}
          <Box p={6}>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between" align="center">
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="xs" fontWeight="800" color="gray.400" letterSpacing="0.1em">
                    TODAY: {today.toUpperCase()}
                  </Text>
                  <Text fontSize="xl" fontWeight="800" color="gray.900">
                    {todayHours ? `${todayHours.open} — ${todayHours.close}` : "CLOSED"}
                  </Text>
                </VStack>

                <Button
                  variant="link"
                  onClick={() => setIsExpanded(!isExpanded)}
                  rightIcon={<Icon as={isExpanded ? FiChevronUp : FiChevronDown} />}
                  fontWeight="800"
                  fontSize="xs"
                  color="blue.600"
                >
                  {isExpanded ? "CLOSE" : "VIEW FULL WEEK"}
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
                    <VStack spacing={1} pt={4} borderTop="1px solid" borderColor="gray.50">
                      {days.map((day) => {
                        const hours = operatingHours.find((h) => h.day === day);
                        const isToday = day === today;
                        return (
                          <HStack
                            key={day}
                            w="full"
                            justify="space-between"
                            py={2.5}
                            px={3}
                            bg={isToday ? "gray.50" : "transparent"}
                            borderRadius="lg"
                          >
                            <Text
                              fontSize="sm"
                              fontWeight={isToday ? "800" : "600"}
                              color={isToday ? "gray.900" : "gray.400"}
                            >
                              {day}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="800"
                              color={isToday ? "gray.900" : "gray.700"}
                            >
                              {hours ? `${hours.open} — ${hours.close}` : "CLOSED"}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  </MotionBox>
                )}
              </AnimatePresence>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export default OperatingHours;
