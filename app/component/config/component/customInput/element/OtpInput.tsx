"use client";

import React, { useRef, useState, useEffect } from "react";
import { Input, HStack, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";

interface OtpInputProps {
  length?: number; // Number of OTP digits (default: 6)
  value: string; // Controlled value of OTP
  onChange:any; // Callback to handle OTP change
  label?: string; // Label for the OTP field
  error?: string | null; // Error message
  showError?: boolean; // Whether to show error
  disabled?: boolean; // Disable the inputs
  required?: boolean; // Mark as required
  labelcolor?: string; // Custom label color
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  label,
  error,
  showError = true,
  disabled = false,
  required = false,
  labelcolor,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

  // Sync the internal state with the controlled value prop
  useEffect(() => {
    if (value !== otp.join("")) { // Only update if the value prop differs
      setOtp(
        value
          ? value
              .split("")
              .slice(0, length)
              .concat(Array(Math.max(0, length - value.length)).fill(""))
          : Array(length).fill("")
      );
    }
  }, [value, length, otp]);

  const handleChange = (index: number, newValue: string) => {
    if (!/^\d*$/.test(newValue)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = newValue.slice(-1); // Take only the last character
    setOtp(newOtp);
    onChange(newOtp.join("")); // Update the parent component's value

    // Move focus to the next input if a digit is entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits
    if (pastedData.length > 0) {
      const newOtp = pastedData
        .split("")
        .slice(0, length)
        .concat(Array(Math.max(0, length - pastedData.length)).fill(""));
      setOtp(newOtp);
      onChange(newOtp.join(""));
      inputRefs.current[Math.min(pastedData.length, length) - 1]?.focus();
    }
    e.preventDefault();
  };

  return (
    <FormControl id="otp" isInvalid={!!error && showError}>
      {label && (
        <FormLabel color={labelcolor}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </FormLabel>
      )}
      <HStack spacing={2}>
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={otp[index]} // Directly use otp[index] without fallback to avoid rerender issues
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            textAlign="center"
            w="48px" // Increased width slightly to ensure text fits
            h="48px" // Increased height for better visibility
            fontSize="lg"
            borderRadius="md"
            padding={0} // Remove padding to center text fully
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
          />
        ))}
      </HStack>
      {showError && error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default OtpInput;