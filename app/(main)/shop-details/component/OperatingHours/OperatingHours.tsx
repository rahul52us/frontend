"use client";

import {
  Badge,
  Box,
  Collapse,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiChevronDown, FiClock } from "react-icons/fi";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatTimeString = (time?: string) => {
  if (!time) return "";
  const [h = 0, m = 0] = time.split(":").map(Number);
  const hour = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

const OperatingHours = ({ shopData }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = useColorModeValue("white", "gray.850");
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const textPrimary = useColorModeValue("gray.900", "white");
  const textMuted = useColorModeValue("gray.600", "gray.400");
  const activeDayBg = useColorModeValue("blue.50", "whiteAlpha.100");
  const activeDayColor = useColorModeValue("blue.600", "blue.300");

  const list: any[] = Array.isArray(shopData?.operatingHours)
    ? shopData.operatingHours
    : [];

  const todayIndex = new Date().getDay();
  // Adjust Sunday (0 in JS getDay) to index in DAYS
  const todayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][todayIndex];

  const todayHours = list.find((d: any) => d.day === todayName);

  const todaySummary = todayHours?.open && todayHours?.close
    ? `${formatTimeString(todayHours.open)} – ${formatTimeString(todayHours.close)}`
    : "Closed";

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      p={{ base: 5, md: 6 }}
      boxShadow="0 4px 20px -2px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor={borderColor}
      w="full"
    >
      {/* Clickable Header Accordion Trigger */}
      <Flex
        as="button"
        w="full"
        align="center"
        justify="space-between"
        gap={3}
        onClick={() => setIsOpen((prev) => !prev)}
        textAlign="left"
        cursor="pointer"
        _focus={{ outline: "none" }}
      >
        <HStack spacing={3} minW={0} flex={1}>
          <Box
            p={2.5}
            borderRadius="xl"
            bg="blue.50"
            color="blue.600"
            flexShrink={0}
          >
            <Icon as={FiClock} boxSize={5} />
          </Box>
          <Box minW={0}>
            <Heading
              as="h3"
              fontSize="md"
              fontWeight="800"
              color={textPrimary}
              letterSpacing="-0.01em"
            >
              Opening hours
            </Heading>
            <Text fontSize="sm" color={textMuted} mt={0.5}>
              Today: <Text as="span" fontWeight="semibold" color={textPrimary}>{todaySummary}</Text>
            </Text>
          </Box>
        </HStack>

        <Icon
          as={FiChevronDown}
          boxSize={5}
          color={textMuted}
          transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.3s ease"
        />
      </Flex>

      {/* Expandable Hours Table */}
      <Collapse in={isOpen} animateOpacity>
        <Box pt={4}>
          <Divider mb={3} borderColor={borderColor} />
          <VStack align="stretch" spacing={1.5} fontSize="sm">
            {DAYS.map((day) => {
              const daySchedule = list.find((d: any) => d.day === day);
              const isToday = day === todayName;
              const formattedSchedule =
                daySchedule?.open && daySchedule?.close
                  ? `${formatTimeString(daySchedule.open)} – ${formatTimeString(daySchedule.close)}`
                  : "Closed";

              return (
                <Flex
                  key={day}
                  justify="space-between"
                  align="center"
                  py={1.5}
                  px={3}
                  borderRadius="lg"
                  bg={isToday ? activeDayBg : "transparent"}
                  fontWeight={isToday ? "bold" : "normal"}
                  color={isToday ? activeDayColor : textMuted}
                >
                  <HStack spacing={2}>
                    <Text>{day}</Text>
                    {isToday && (
                      <Badge
                        colorScheme="blue"
                        fontSize="2xs"
                        borderRadius="full"
                        px={1.5}
                      >
                        Today
                      </Badge>
                    )}
                  </HStack>
                  <Text>{formattedSchedule}</Text>
                </Flex>
              );
            })}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default OperatingHours;
