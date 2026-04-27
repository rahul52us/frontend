'use client'
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// import "./CustomDateRangeMobile.css";
// import "./CustomDateRangePicker.css";
import { DateRange, DateRangePicker } from "react-date-range";
import { format } from "date-fns";
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
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

interface CustomDateRangeProps {
  startDate: any;
  endDate: any;
  onStartDateChange: any;
  onEndDateChange: any;
  isMobile?: boolean;
  months?: number;
  variant?: "default" | "merchant";
}

export default function CustomDateRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isMobile = false,
  months = 2,
  variant = "default",
}: CustomDateRangeProps): any {
  const LargerThanMd = useBreakpointValue({ md: true });
  const formattedStartDate = startDate ? format(startDate, "d MMM yyyy") : "";
  const formattedEndDate = endDate ? format(endDate, "d MMM yyyy") : "";
  const isMerchant = variant === "merchant";

  const textColor = useColorModeValue("gray.700", "gray.300");
  const displayTextColor = isMerchant ? dashboardPalette.text : textColor;
  const secondaryTextColor = isMerchant ? dashboardPalette.textSoft : "gray.500";
  const calendarAccent = isMerchant ? dashboardPalette.accent : "#38B2AC";
  const inputStyles = isMerchant
    ? {
        bg: dashboardPalette.surfaceAlt,
        color: dashboardPalette.text,
        borderColor: dashboardPalette.borderStrong,
        borderRadius: "16px",
        _placeholder: { color: dashboardPalette.textSoft },
        _hover: { borderColor: dashboardPalette.accent },
        _focusVisible: {
          borderColor: dashboardPalette.accent,
          boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
        },
      }
    : {};
  const popoverStyles = isMerchant
    ? {
        bg: dashboardPalette.surface,
        borderColor: dashboardPalette.border,
        color: dashboardPalette.text,
        boxShadow: "0 22px 44px rgba(0, 0, 0, 0.32)",
      }
    : {};

  return isMobile || !LargerThanMd ? (
    <Popover placement="auto-end">
      <PopoverTrigger>
        {/* <Input
          name="datePicker"
          value={startDate && endDate ? `${format(startDate, "d MMM yyyy")} to ${format(
            endDate,
            "d MMM yyyy"
          )}` : ""}
          width={{ base: "14rem", lg: "14rem" }}
          textAlign="center"
        /> */}
        <Box position="relative" width={{ base: "14.5rem", lg: "16rem" }}>
          <Input
            name="datePicker"
            value=""
            // width={{ base: "14rem", lg: "14rem" }}
            textAlign="center"
            readOnly
            {...inputStyles}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
          >
            {startDate && (
              <Text as="span" fontWeight="600" color={displayTextColor}>
                {formattedStartDate}
              </Text>
            )}
            {startDate && endDate && (
              <Text as="span" fontWeight="500" color={secondaryTextColor} mx={1}>
                to
              </Text>
            )}
            {endDate && (
              <Text as="span" fontWeight="600" color={displayTextColor} mr={1}>
                {formattedEndDate}
              </Text>
            )}
            {!startDate && !endDate && (
              <Text as="span" fontWeight="500" color={secondaryTextColor} mr={1}>
                Select Date Range
              </Text>
            )}
            <IoMdCalendar fontSize={"20px"} color={isMerchant ? dashboardPalette.textSoft : "gray"} />
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent width="auto" {...popoverStyles}>
        <PopoverBody bg={isMerchant ? dashboardPalette.surface : undefined}>
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
                startDate: startDate || new Date(),
                endDate: endDate || new Date(),
                key: "selection",
              },
            ]}
            months={1}
            direction="horizontal"
            className="calendarElementMobile"
            rangeColors={[calendarAccent]}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover >
  ) : (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Input
          name="datePicker"
          value={startDate && endDate ? `${format(startDate, "d MMM yyyy")} to ${format(
            endDate,
            "d MMM yyyy"
          )}` : ""}
          placeholder="Select Date Range"
          width={{ lg: "18rem" }}
          textAlign="center"
          readOnly
          {...inputStyles}
        />
      </PopoverTrigger>
      <PopoverContent width="auto" {...popoverStyles}>
        <PopoverBody bg={isMerchant ? dashboardPalette.surface : undefined}>
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
                startDate: startDate || new Date(),
                endDate: endDate || new Date(),
                key: "selection",
              },
            ]}
            months={months}
            direction="horizontal"
            className="calendarElement"
            rangeColors={[calendarAccent]}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
