"use client";

import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Select from "react-select";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "./element/OtpInput";

interface CustomInputProps {
  type?:
    | "editor"
    | "password"
    | "number"
    | "text"
    | "radio"
    | "file"
    | "switch"
    | "textarea"
    | "select"
    | "date"
    | "time"
    | "checkbox"
    | "url"
    | "phone"
    | "dateAndTime"
    | "file-drag"
    | "tags"
    | "multi-dates"
    | "real-time-user-search"
    | "otp";
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  maxDate?: string;
  minDate?: string;
  disabledDates?: string[];
  name: string;
  isClear?: boolean;
  onChange?: any;
  value?: any;
  w?: string;
  options?: { label: string; value: string }[];
  isSearchable?: boolean;
  isMulti?: boolean;
  getOptionLabel?: any;
  getOptionValue?: any;
  rows?: number;
  disabled?: boolean;
  showError?: boolean;
  style?: React.CSSProperties;
  phone?: string;
  accept?: string;
  readOnly?: boolean;
  labelcolor?: string;
  isPortal?: boolean;
}

const cssVar = (name: string, fallback: string) => `var(${name}, ${fallback})`;

const fieldShellStyles = {
  bg: cssVar("--dashboard-input-bg", "white"),
  borderColor: cssVar("--dashboard-input-border", "#CBD5E0"),
  color: cssVar("--dashboard-input-text", "#1A202C"),
  borderRadius: "16px",
  minH: "52px",
  _placeholder: {
    color: cssVar("--dashboard-input-placeholder", "#718096"),
    fontSize: "13px",
  },
  _hover: {
    borderColor: cssVar("--dashboard-accent", "#3182CE"),
  },
  _focusVisible: {
    borderColor: cssVar("--dashboard-accent", "#3182CE"),
    boxShadow: `0 0 0 1px ${cssVar("--dashboard-accent", "#3182CE")}`,
  },
  _disabled: {
    opacity: 0.72,
    cursor: "not-allowed",
  },
};

const labelFallback = cssVar("--dashboard-text-muted", "#4A5568");

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  label,
  placeholder,
  error,
  name,
  value,
  onChange,
  required,
  isClear = false,
  options,
  isSearchable,
  isMulti,
  getOptionLabel,
  getOptionValue,
  disabled,
  rows,
  style,
  showError,
  accept,
  readOnly,
  labelcolor,
  isPortal,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword((current) => !current);
  };

  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      onChange?.({ target: { name, files } });
    },
    [name, onChange]
  );

  const handleTagAdd = (nextValue: string) => {
    const trimmedValue = nextValue.trim();
    if (!trimmedValue) {
      return;
    }

    const nextTags = [...(value || []), trimmedValue];
    onChange?.(nextTags);
    setInputValue("");
  };

  const handleTagRemove = (tagToRemove: string) => {
    const nextTags = (value || []).filter((tag: string) => tag !== tagToRemove);
    onChange?.(nextTags);
  };

  const handleAddDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    if (selectedDate && !(value || []).includes(selectedDate)) {
      onChange?.([...(value || []), selectedDate]);
    }
    setInputValue("");
  };

  const handleRemoveDate = (dateToRemove: string) => {
    onChange?.((value || []).filter((date: string) => date !== dateToRemove));
  };

  const renderInputComponent = () => {
    switch (type) {
      case "password":
        return (
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              name={name}
              isRequired={required}
              disabled={disabled}
              readOnly={readOnly}
              pr="3rem"
              sx={fieldShellStyles}
              style={style}
              {...rest}
            />
            <InputRightElement
              cursor="pointer"
              onClick={handleTogglePassword}
              color={cssVar("--dashboard-text-muted", "#718096")}
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </InputRightElement>
          </InputGroup>
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            readOnly={readOnly}
            sx={fieldShellStyles}
            style={style}
            {...rest}
          />
        );

      case "textarea":
        return (
          <Textarea
            rows={rows || 3}
            minH="140px"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            readOnly={readOnly}
            sx={fieldShellStyles}
            style={style}
            {...rest}
          />
        );

      case "switch":
        return (
          <Switch
            name={name}
            onChange={onChange}
            isChecked={value}
            colorScheme="yellow"
            {...rest}
          />
        );

      case "checkbox":
        return (
          <Checkbox
            name={name}
            onChange={onChange}
            isChecked={value}
            colorScheme="yellow"
            sx={{
              ".chakra-checkbox__control": {
                bg: cssVar("--dashboard-checkbox-bg", "white"),
                borderColor: cssVar("--dashboard-checkbox-border", "#CBD5E0"),
              },
              ".chakra-checkbox__control[data-checked]": {
                bg: cssVar("--dashboard-checkbox-active-bg", "#EBF8FF"),
                borderColor: cssVar("--dashboard-accent", "#3182CE"),
                color: cssVar("--dashboard-accent", "#3182CE"),
              },
            }}
            {...rest}
          />
        );

      case "phone":
        return (
          <PhoneInput
            country="in"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            containerStyle={{ width: "100%" }}
            inputStyle={{
              width: "100%",
              height: "52px",
              backgroundColor: cssVar("--dashboard-input-bg", "white"),
              borderColor: cssVar("--dashboard-input-border", "#CBD5E0"),
              color: cssVar("--dashboard-input-text", "#1A202C"),
              borderRadius: "16px",
              fontSize: "14px",
            }}
            buttonStyle={{
              backgroundColor: cssVar("--dashboard-input-bg", "white"),
              borderColor: cssVar("--dashboard-input-border", "#CBD5E0"),
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
            }}
            dropdownStyle={{
              backgroundColor: cssVar("--dashboard-surface", "white"),
              color: cssVar("--dashboard-input-text", "#1A202C"),
            }}
          />
        );

      case "dateAndTime":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            type="datetime-local"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            sx={fieldShellStyles}
            {...rest}
          />
        );

      case "tags":
        return (
          <Box>
            <Flex align="center" gap={3} direction={{ base: "column", md: "row" }}>
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleTagAdd(inputValue);
                  }
                }}
                name={name}
                disabled={disabled}
                aria-label="Input field"
                sx={fieldShellStyles}
              />
              <Button
                minW={{ base: "100%", md: "150px" }}
                minH="52px"
                borderRadius="16px"
                border="1px solid"
                borderColor={cssVar("--dashboard-border-strong", "#CBD5E0")}
                bg={cssVar("--dashboard-tag-button-bg", "#EBF8FF")}
                color={cssVar("--dashboard-tag-button-text", "#2B6CB0")}
                _hover={{ bg: cssVar("--dashboard-accent-soft", "#BEE3F8") }}
                isDisabled={!inputValue.trim()}
                onClick={() => handleTagAdd(inputValue)}
                aria-label="Add Data"
              >
                Add Tag
              </Button>
            </Flex>
            <Wrap mt={3} spacing={3}>
              {value?.map((tag: string, index: number) => (
                <WrapItem key={index}>
                  <Tag
                    size="md"
                    px={3}
                    py={2}
                    borderRadius="full"
                    bg={cssVar("--dashboard-tag-bg", "#EBF8FF")}
                    color={cssVar("--dashboard-tag-text", "#2B6CB0")}
                    border="1px solid"
                    borderColor={cssVar("--dashboard-border", "#BEE3F8")}
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton
                      color={cssVar("--dashboard-tag-text", "#2B6CB0")}
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        );

      case "multi-dates":
        return (
          <Box>
            <Input
              type="date"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleAddDate}
              disabled={disabled}
              sx={fieldShellStyles}
            />
            <Wrap mt={3} spacing={3}>
              {(value || []).map((date: string, index: number) => (
                <WrapItem key={index}>
                  <Tag
                    size="md"
                    px={3}
                    py={2}
                    borderRadius="full"
                    bg={cssVar("--dashboard-tag-bg", "#EBF8FF")}
                    color={cssVar("--dashboard-tag-text", "#2B6CB0")}
                    border="1px solid"
                    borderColor={cssVar("--dashboard-border", "#BEE3F8")}
                  >
                    <TagLabel>{date}</TagLabel>
                    <TagCloseButton
                      color={cssVar("--dashboard-tag-text", "#2B6CB0")}
                      onClick={() => handleRemoveDate(date)}
                    />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        );

      case "file-drag":
        return (
          <Box
            border="1px dashed"
            borderColor={cssVar("--dashboard-file-drop-border", "#CBD5E0")}
            borderRadius="22px"
            px={{ base: 5, md: 6 }}
            py={{ base: 8, md: 10 }}
            textAlign="center"
            bg={cssVar("--dashboard-file-drop-bg", "#F7FAFC")}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleFileDrop}
          >
            <Text fontSize="md" fontWeight="600" color={cssVar("--dashboard-file-drop-text", "#4A5568")}>
              Drag & drop files here
            </Text>
            <Text mt={2} fontSize="sm" color={cssVar("--dashboard-input-placeholder", "#718096")}>
              or browse from your device
            </Text>
            <input
              type="file"
              name={name}
              multiple={isMulti}
              onChange={onChange}
              style={{ display: "none" }}
              id={`multiple-file-upload-with-draggable-${name}`}
              accept={accept}
            />
            <Button
              mt={5}
              minH="48px"
              px={6}
              borderRadius="16px"
              variant="outline"
              bg={cssVar("--dashboard-file-drop-button-bg", "transparent")}
              color={cssVar("--dashboard-file-drop-button-text", "#2B6CB0")}
              borderColor={cssVar("--dashboard-border-strong", "#CBD5E0")}
              _hover={{ bg: cssVar("--dashboard-accent-soft", "#EBF8FF") }}
              onClick={() =>
                (
                  document.getElementById(
                    `multiple-file-upload-with-draggable-${name}`
                  ) as HTMLInputElement | null
                )?.click()
              }
            >
              Browse Files
            </Button>
          </Box>
        );

      case "url":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            sx={fieldShellStyles}
            {...rest}
          />
        );

      case "file":
        return (
          <Input
            readOnly={readOnly}
            style={style}
            type="file"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            accept={accept}
            sx={fieldShellStyles}
            {...rest}
          />
        );

      case "select":
        return (
          <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isClearable={isClear ? true : undefined}
            isMulti={isMulti}
            isSearchable={isSearchable}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isDisabled={disabled}
            classNamePrefix="merchant-select"
            menuPosition={isPortal ? "fixed" : undefined}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                minHeight: 52,
                borderRadius: 16,
                borderColor: state.isFocused
                  ? cssVar("--dashboard-accent", "#3182CE")
                  : cssVar("--dashboard-input-border", "#CBD5E0"),
                backgroundColor: cssVar("--dashboard-input-bg", "white"),
                color: cssVar("--dashboard-input-text", "#1A202C"),
                boxShadow: state.isFocused
                  ? `0 0 0 1px ${cssVar("--dashboard-accent", "#3182CE")}`
                  : "none",
                "&:hover": {
                  borderColor: cssVar("--dashboard-accent", "#3182CE"),
                },
              }),
              valueContainer: (styles) => ({
                ...styles,
                padding: "4px 12px",
              }),
              placeholder: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-input-placeholder", "#718096"),
              }),
              input: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-input-text", "#1A202C"),
              }),
              singleValue: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-input-text", "#1A202C"),
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: cssVar("--dashboard-surface", "white"),
                border: `1px solid ${cssVar("--dashboard-border-strong", "#CBD5E0")}`,
                borderRadius: 16,
                overflow: "hidden",
              }),
              menuPortal: (baseStyles) => ({
                ...baseStyles,
                zIndex: 1500,
              }),
              option: (styles, { isSelected, isFocused }) => ({
                ...styles,
                backgroundColor: isSelected
                  ? cssVar("--dashboard-accent-soft", "#EBF8FF")
                  : isFocused
                    ? cssVar("--dashboard-surface-soft", "#EDF2F7")
                    : cssVar("--dashboard-surface", "white"),
                color: isSelected
                  ? cssVar("--dashboard-accent-strong", "#2B6CB0")
                  : cssVar("--dashboard-input-text", "#1A202C"),
                padding: "10px 12px",
                cursor: "pointer",
              }),
              multiValue: (styles) => ({
                ...styles,
                backgroundColor: cssVar("--dashboard-tag-bg", "#EBF8FF"),
                borderRadius: 999,
              }),
              multiValueLabel: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-tag-text", "#2B6CB0"),
              }),
              multiValueRemove: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-tag-text", "#2B6CB0"),
                ":hover": {
                  backgroundColor: "transparent",
                  color: cssVar("--dashboard-accent", "#3182CE"),
                },
              }),
              clearIndicator: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-text-muted", "#718096"),
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: cssVar("--dashboard-text-muted", "#718096"),
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
            }}
          />
        );

      case "otp":
        return (
          <OtpInput
            value={value || ""}
            onChange={onChange}
            label={label}
            error={error}
            showError={showError}
            disabled={disabled}
            required={required}
            labelcolor={labelcolor}
          />
        );

      default:
        return (
          <Input
            type={type || "text"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
            readOnly={readOnly}
            sx={fieldShellStyles}
            style={style}
            {...rest}
          />
        );
    }
  };

  return (
    <FormControl id={name} isInvalid={!!error && showError}>
      {type !== "otp" ? (
        <FormLabel color={labelcolor || labelFallback}>
          {label} {required ? <span style={{ color: cssVar("--dashboard-danger", "#E53E3E") }}>*</span> : null}
        </FormLabel>
      ) : null}
      {renderInputComponent()}
      {type !== "otp" && showError && error ? (
        <FormErrorMessage color={cssVar("--dashboard-danger", "#E53E3E")}>
          {error}
        </FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export default CustomInput;
