import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const OperatingHours = ({ shopData, getCurrentDayHours }: any) => {
  const [showAllHours, setShowAllHours] = useState(false);
  const operatingHours = Array.isArray(shopData?.operatingHours)
    ? shopData.operatingHours
    : [];

  const currentDay = getCurrentDayHours();

  return (
    <Box>
      <Card variant="outline">
        <CardBody p="6">
          <Heading as="h3" size="md" fontWeight="medium" mb="4">
            Business Hours
          </Heading>
          <List spacing="2">
            {operatingHours
              .slice(0, showAllHours ? 7 : 3)
              .map((hours, index) => (
                <ListItem
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  fontSize="sm"
                  fontWeight={
                    hours.day === currentDay?.day ? "medium" : "normal"
                  }
                  color={
                    hours.day === currentDay?.day
                      ? "brand.100"
                      : "gray.500"
                  }
                >
                  <Text>{hours.day}</Text>
                  <Text>
                    {hours.open ?? "--:--"} - {hours.close ?? "--:--"}
                  </Text>
                </ListItem>
              ))}
          </List>
          {!showAllHours && operatingHours.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              width="full"
              mt="2"
              color="gray.500"
              onClick={() => setShowAllHours(true)}
              rightIcon={<FaChevronDown />}
            >
              Show all hours
            </Button>
          )}
          {showAllHours && (
            <Button
              variant="ghost"
              size="sm"
              width="full"
              mt="2"
              color="gray.500"
              onClick={() => setShowAllHours(false)}
              rightIcon={<FaChevronUp />}
            >
              Show less
            </Button>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default OperatingHours;
