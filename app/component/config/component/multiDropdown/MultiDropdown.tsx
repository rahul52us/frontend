'use client'
import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  VStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdFilterList } from "react-icons/md";
import CustomDateRange from "../CustomDateRange/CustomDateRange";
import dynamic from "next/dynamic";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import { useMerchantFormSx } from "../../../../dashboard/shop/component/merchantTheme";
const CustomInput = dynamic(() => import('../../../../component/config/component/customInput/CustomInput'), { ssr: false });

interface DropdownOption {
  value: string;
  label: string;
}

interface Dropdown {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
}

interface MultiDropdownProps {
  search?: any;
  title?: string;
  dropdowns: Dropdown[];
  selectedOptions: any;
  onDropdownChange: any;
  onApply: () => void;
  resetFilters?: any;
  minH?: any;
  actions: any;
  variant?: "default" | "merchant";
}

const MultiDropdown = ({
  search,
  dropdowns,
  selectedOptions,
  onDropdownChange,
  onApply,
  resetFilters,
  actions,
  variant = "default",
}: MultiDropdownProps) => {
  const merchantFormSx = useMerchantFormSx();
  const [inputValue, setInputValue] = useState(search?.searchValue || "");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const isMerchant = variant === "merchant";

  // Dynamic Theme Colors
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cPage = useColorModeValue("#F4F7FE", dashboardPalette.page);

  const popoverBg = isMerchant ? cSurface : useColorModeValue("white", "gray.900");
  const borderColor = isMerchant ? cBorder : useColorModeValue("gray.300", "gray.600");
  const buttonTextColor = useColorModeValue("teal.400", "teal.200");
  const focusBorderColor = useColorModeValue("blue.500", "blue.300");

  const merchantButtonStyles = isMerchant
    ? {
        bg: cSurfaceAlt,
        color: cAccentStrong,
        border: "1px solid",
        borderColor: cBorder,
        borderRadius: "16px",
        _hover: { bg: cSurfaceSoft, color: cText },
        _active: { bg: cSurfaceSoft },
      }
    : {};

  const merchantInputStyles = isMerchant
    ? {
        bg: cSurfaceAlt,
        borderColor: cBorderStrong,
        color: cText,
        borderRadius: "16px",
        _placeholder: { color: cTextSoft },
        _hover: { borderColor: cAccent },
        _focusVisible: {
          borderColor: cAccent,
          boxShadow: `0 0 0 1px ${cAccent}`,
        },
      }
    : {};

  const isMounted = React.useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      if (search?.onSearchChange) {
        search.onSearchChange(inputValue);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
    },
    [setInputValue]
  );

  const resetFilterss = () => {
    resetFilters();
    setInputValue("");
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClose={handlePopoverClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Button
          aria-label=""
          fontSize="md"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          color={isMerchant ? undefined : buttonTextColor}
          size="md"
          leftIcon={<MdFilterList />}
          {...merchantButtonStyles}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent
        p={3}
        bg={popoverBg}
        borderColor={borderColor}
        boxShadow={isMerchant ? useColorModeValue("lg", "0 24px 48px rgba(0, 0, 0, 0.36)") : "md"}
        sx={isMerchant ? merchantFormSx : undefined}
      >
        <PopoverHeader
          mt={-1}
          fontWeight="bold"
          borderBottomWidth="1px"
          color={isMerchant ? cAccentStrong : buttonTextColor}
          borderBottomColor={isMerchant ? cBorder : undefined}
        >
          Select Options
        </PopoverHeader>
        <PopoverBody>
          <VStack rowGap={2} align="stretch">
            <Flex
              justifyContent={"center"}
              display={{ base: "block", md: "none" }}
            >
              <CustomDateRange
                isMobile={actions?.datePicker?.isMobile}
                startDate={actions?.datePicker?.date?.startDate}
                endDate={actions?.datePicker?.date?.endDate}
                variant={variant}
                onStartDateChange={(e) => {
                  if (actions?.datePicker?.onDateChange) {
                    actions?.datePicker?.onDateChange(e, "startDate");
                  }
                }}
                onEndDateChange={(e) => {
                  if (actions?.datePicker?.onDateChange) {
                    actions?.datePicker?.onDateChange(e, "endDate");
                  }
                }}
              />
            </Flex>
            {search && search?.visible && (
              <Input
                placeholder={search?.placeholder || "Search"}
                value={inputValue}
                onChange={handleInputChange}
                borderRadius="md"
                bg={isMerchant ? undefined : popoverBg}
                borderColor={isMerchant ? undefined : borderColor}
                _focus={isMerchant ? undefined : { borderColor: focusBorderColor, boxShadow: "outline" }}
                {...merchantInputStyles}
              />
            )}
            {dropdowns.map((dropdown: Dropdown, index: number) => {
              return (
                <CustomInput
                  label={dropdown.label}
                  isClear
                  isSearchable={false}
                  name="select"
                  type="select"
                  isMulti={true}
                  key={index}
                  options={dropdown.options}
                  placeholder={dropdown.placeholder || "Select Option"}
                  value={selectedOptions[dropdown.label] || null}
                  onChange={(selected: any) => {
                    onDropdownChange(selected, dropdown.label);
                  }}
                />
              );
            })}
            <Button
              colorScheme={isMerchant ? undefined : "teal"}
              onClick={() => {
                onApply();
                handlePopoverClose();
              }}
              mt={2}
              bg={isMerchant ? cAccent : undefined}
              color={isMerchant ? cPage : undefined}
              borderRadius={isMerchant ? "16px" : undefined}
              _hover={isMerchant ? { bg: cAccentStrong } : undefined}
            >
              Apply
            </Button>
            {resetFilters && (
              <Button
                variant="outline"
                mt={1}
                onClick={() => resetFilterss()}
                border="2px solid"
                colorScheme={isMerchant ? undefined : "red"}
                borderColor={isMerchant ? cBorderStrong : undefined}
                color={isMerchant ? cTextMuted : undefined}
                borderRadius={isMerchant ? "16px" : undefined}
                _hover={isMerchant ? { bg: cSurfaceSoft, color: cText } : undefined}
              >
                Reset Filter
              </Button>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MultiDropdown;
