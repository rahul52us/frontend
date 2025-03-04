'use client'
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import "./CustomDateRangeMobile.css";
// import "./CustomDateRangePicker.css";
import { DateRange, DateRangePicker } from "react-date-range";
import {format} from "date-fns";
import { IoMdCalendar } from "react-icons/io";
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

interface CustomDateRangeProps {
  startDate: any;
  endDate: any;
  onStartDateChange: any;
  onEndDateChange: any;
  isMobile?: boolean;
  months?: number;
}

export default function CustomDateRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isMobile = false,
  months = 2,
}: CustomDateRangeProps): any {
  const LargerThanMd = useBreakpointValue({ md: true });
  const formattedStartDate = format(startDate, "d MMM yyyy");
  const formattedEndDate = format(endDate, "d MMM yyyy");

  const textColor = useColorModeValue("gray.700", "gray.300");

  return isMobile || !LargerThanMd ? (
    <Popover placement="auto-end">
      <PopoverTrigger>
        {/* <Input
          name="datePicker"
          value={`${format(startDate, "d MMM yyyy")} to ${format(
            endDate,
            "d MMM yyyy"
          )}`}
          width={{ base: "14rem", lg: "14rem" }}
          textAlign="center"
        /> */}
        <Box position="relative" width={{ base: "14.5rem", lg: "16rem" }}>
          <Input
            name="datePicker"
            value=""
            // width={{ base: "14rem", lg: "14rem" }}
            textAlign="center"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text as="span" fontWeight="600" color={textColor}>
              {formattedStartDate}
            </Text>
            <Text as="span" fontWeight="500" color="gray.500" mx={1}>
              to
            </Text>
            <Text as="span" fontWeight="600" color={textColor} mr={1}>
              {formattedEndDate}
            </Text>
            <IoMdCalendar fontSize={"20px"} color={"gray"} />
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody>
          <DateRange
            onChange={(item: any) => {
              onStartDateChange(item.selection.startDate);
              onEndDateChange(item.selection.endDate);
            }}
            showPreview={true}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={[
              {
                startDate: startDate,
                endDate: endDate,
                key: "selection",
              },
            ]}
            months={1}
            direction="horizontal"
            className="calendarElementMobile"
            rangeColors={["#38B2AC"]}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Input
          name="datePicker"
          value={`${format(startDate, "d MMM yyyy")} to ${format(
            endDate,
            "d MMM yyyy"
          )}`}
          width={{ lg: "18rem" }}
          textAlign="center"
        />
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody>
          <DateRangePicker
            onChange={(item: any) => {
              onStartDateChange(item.selection.startDate);
              onEndDateChange(item.selection.endDate);
            }}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            showPreview={true}
            ranges={[
              {
                startDate: startDate,
                endDate: endDate,
                key: "selection",
              },
            ]}
            months={months}
            direction="horizontal"
            className="calendarElement"
            rangeColors={["#38B2AC"]}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
