import React, { useState, KeyboardEvent } from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

interface TagChipsInputProps {
  label?: string;
  placeholder?: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  helperText?: string;
  disabled?: boolean;
}

export const TagChipsInput: React.FC<TagChipsInputProps> = ({
  label,
  placeholder = "Type and press Enter or comma...",
  values = [],
  onChange,
  helperText,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const bg = useColorModeValue("white", "var(--merchant-surface-alt, #131d2e)");
  const borderColor = useColorModeValue("gray.200", "var(--merchant-border-strong, #1f2e46)");
  const tagBg = useColorModeValue("blue.50", "rgba(59, 130, 246, 0.16)");
  const tagColor = useColorModeValue("blue.700", "brand.300");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const placeholderColor = useColorModeValue("gray.400", "gray.500");

  const addTag = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    // Support comma separated split
    const items = trimmed
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newValues = [...values];
    items.forEach((item) => {
      if (!newValues.some((v) => v.toLowerCase() === item.toLowerCase())) {
        newValues.push(item);
      }
    });

    onChange(newValues);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const next = values.filter((_, idx) => idx !== indexToRemove);
    onChange(next);
  };

  return (
    <Box>
      {label ? (
        <Text fontSize="xs" fontWeight="700" mb={1.5} color={useColorModeValue("gray.700", "gray.200")}>
          {label}
        </Text>
      ) : null}

      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        bg={bg}
        p={2}
        minH="44px"
        transition="all 0.2s"
        _focusWithin={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
      >
        <Flex wrap="wrap" gap={1.5} align="center">
          {values.map((tag, idx) => (
            <Tag
              key={`${tag}-${idx}`}
              size="md"
              borderRadius="full"
              variant="subtle"
              bg={tagBg}
              color={tagColor}
              px={3}
              py={1}
            >
              <TagLabel fontSize="12px" fontWeight="600">
                {tag}
              </TagLabel>
              <TagCloseButton onClick={() => removeTag(idx)} />
            </Tag>
          ))}

          <HStack flex={1} minW="140px" spacing={1}>
            <Input
              variant="unstyled"
              size="sm"
              fontSize="xs"
              color={inputTextColor}
              _placeholder={{ color: placeholderColor }}
              placeholder={values.length === 0 ? placeholder : "Add more..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) {
                  addTag(inputValue);
                }
              }}
            />
            {inputValue.trim() ? (
              <IconButton
                aria-label="Add value"
                icon={<FiPlus />}
                size="xs"
                colorScheme="blue"
                borderRadius="full"
                onClick={() => addTag(inputValue)}
              />
            ) : null}
          </HStack>
        </Flex>
      </Box>

      {helperText ? (
        <Text fontSize="11px" color="gray.500" mt={1}>
          {helperText}
        </Text>
      ) : null}
    </Box>
  );
};

export default TagChipsInput;

