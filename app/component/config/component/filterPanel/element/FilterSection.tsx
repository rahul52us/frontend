'use client'
import { Box, Checkbox, Flex, Text, Stack } from "@chakra-ui/react";

const FilterSection = ({ title, icon, options, selected, onChange, isColor = false } : any) => {
  return (
    <Box>
      <Flex align="center" gap={2} mb={2}>
        {icon}
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
      </Flex>
      <Stack spacing={2}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={selected.includes(option)}
            onChange={() => onChange(option)}
          >
            {isColor ? (
              <Box
                w="20px"
                h="20px"
                bg={option.toLowerCase()}
                borderRadius="full"
                display="inline-block"
                mr={2}
              />
            ) : null}
            {option}
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );
};

export default FilterSection;
