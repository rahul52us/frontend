'use client'
import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  FormLabel,
  Box,
  VStack,
  HStack,
  FormControl,
  FormHelperText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Tooltip,
  Collapse,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";

interface FieldEditorProps {
  fieldKey: string;
  value: any;
  onChange?: any;
  fieldType: string;
  onDelete?: any;
}

// Helper functions
const removeKey = (obj: any, key: string) => {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
};

const removeIndex = (arr: any[], index: number) => {
  return arr.filter((_, i) => i !== index);
};

const getDefaultValue = (type: string) => {
  switch (type) {
    case "number":
      return 0;
    case "object":
      return {};
    case "array":
      return [];
    default:
      return "";
  }
};

function FieldEditor({ fieldKey, value, onChange, fieldType, onDelete }: FieldEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropType, setNewPropType] = useState("string");
  const [insertState, setInsertState] = useState<{ key?: string; index?: number; position?: "before" | "after"; type: string; isOpen: boolean }>({
    type: "string",
    isOpen: false,
  });

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle simple field change (string/number)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = fieldType === "number" ? Number(e.target.value) : e.target.value;
    setLocalValue(newVal);
    if (onChange) onChange(fieldKey, newVal);
  };

  // Handle array item change
  const handleArrayChange = (index: number, newVal: any) => {
    const updatedArray = [...localValue];
    updatedArray[index] = newVal;
    setLocalValue(updatedArray);
    if (onChange) onChange(fieldKey, updatedArray);
  };

  // Delete array item
  const handleDeleteArrayItem = (index: number) => {
    const updatedArray = removeIndex(localValue, index);
    setLocalValue(updatedArray);
    if (onChange) onChange(fieldKey, updatedArray);
  };

  // Insert array item at a specific position
  const handleInsertArrayItem = (index: number, position: "before" | "after", insertType: string) => {
    const defaultValue = getDefaultValue(insertType);
    const insertIndex = position === "before" ? index : index + 1;
    const updatedArray = [
      ...localValue.slice(0, insertIndex),
      defaultValue,
      ...localValue.slice(insertIndex),
    ];
    setLocalValue(updatedArray);
    if (onChange) onChange(fieldKey, updatedArray);
    setInsertState({ type: "string", isOpen: false }); // Reset insert form
  };

  // Handle object property change
  const handleObjectChange = (propKey: string, newVal: any) => {
    const updatedObject = { ...localValue, [propKey]: newVal };
    setLocalValue(updatedObject);
    if (onChange) onChange(fieldKey, updatedObject);
  };

  // Delete object property
  const handleDeleteObjectProperty = (propKey: string) => {
    const updatedObject = removeKey(localValue, propKey);
    setLocalValue(updatedObject);
    if (onChange) onChange(fieldKey, updatedObject);
  };

  // Add new object property at a specific position
  const handleAddObjectProperty = (targetKey?: string, position?: "before" | "after", insertKey?: string, insertType?: string) => {
    const keyToUse = insertKey || newPropKey;
    if (!keyToUse.trim()) return;
    const typeToUse = insertType || newPropType;
    const defaultValue = getDefaultValue(typeToUse);
    let updatedObject = { ...localValue, [keyToUse]: defaultValue };

    if (targetKey && position) {
      const entries = Object.entries(localValue);
      const targetIndex = entries.findIndex(([k]) => k === targetKey);
      if (targetIndex !== -1) {
        const insertIndex = position === "before" ? targetIndex : targetIndex + 1;
        updatedObject = Object.fromEntries([
          ...entries.slice(0, insertIndex),
          [keyToUse, defaultValue],
          ...entries.slice(insertIndex),
        ]);
      }
    }

    setLocalValue(updatedObject);
    if (onChange) onChange(fieldKey, updatedObject);
    if (!targetKey) setNewPropKey(""); // Reset only for bottom "Add"
    setInsertState({ type: "string", isOpen: false }); // Reset insert form
  };

  // Toggle insert form
  const toggleInsertForm = (keyOrIndex: string | number, position: "before" | "after") => {
    setInsertState((prev) => ({
      key: typeof keyOrIndex === "string" ? keyOrIndex : undefined,
      index: typeof keyOrIndex === "number" ? keyOrIndex : undefined,
      position,
      type: "string",
      isOpen: !prev.isOpen || prev.key !== keyOrIndex || prev.position !== position,
    }));
  };

  // Simple field (string/number)
  if (fieldType === "string" || fieldType === "number") {
    return (
      <Box mb={4} p={4} bg="white" borderRadius="md" shadow="sm" borderWidth="1px">
        <HStack justify="space-between" mb={2}>
          <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
            {fieldKey}
          </FormLabel>
          {onDelete && (
            <Tooltip label="Delete this field" placement="top">
              <Button size="xs" colorScheme="red" variant="ghost" onClick={() => onDelete(fieldKey)}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          )}
        </HStack>
        <Input
          value={localValue || ""}
          onChange={handleChange}
          type={fieldType === "number" ? "number" : "text"}
          placeholder={`Enter ${fieldKey}`}
          size="md"
          borderColor="teal.500"
          _focus={{ borderColor: "teal.600", boxShadow: "0 0 0 1px teal.600" }}
        />
      </Box>
    );
  }

  // Object field
  if (fieldType === "object" && typeof localValue === "object" && !Array.isArray(localValue)) {
    return (
      <Accordion allowToggle mb={4}>
        <AccordionItem border="none">
          <AccordionButton
            bg="teal.50"
            _expanded={{ bg: "teal.100" }}
            borderRadius="md"
            p={3}
            _hover={{ bg: "teal.100" }}
          >
            <HStack flex="1" justify="space-between">
              <Text fontSize="md" fontWeight="semibold" color="teal.700">
                {fieldKey} (Group)
              </Text>
              {onDelete && (
                <Tooltip label="Delete this group" placement="top">
                  <Button size="xs" colorScheme="red" variant="ghost" onClick={() => onDelete(fieldKey)}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              )}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} bg="white" borderRadius="md" shadow="sm" mt={2}>
            <VStack align="stretch" spacing={4}>
              {Object.entries(localValue).map(([prop, val]) => (
                <Box key={prop}>
                  <HStack spacing={2} mb={2}>
                    <Tooltip label="Add a property before this one" placement="top">
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => toggleInsertForm(prop, "before")}
                      >
                        <ArrowUpIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Add a property after this one" placement="top">
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => toggleInsertForm(prop, "after")}
                      >
                        <ArrowDownIcon />
                      </Button>
                    </Tooltip>
                  </HStack>
                  <Collapse in={insertState.isOpen && insertState.key === prop}>
                    <Box p={2} bg="gray.50" borderRadius="md" mb={2}>
                      <HStack spacing={2}>
                        <FormControl flex="1">
                          <FormLabel fontSize="xs">Name</FormLabel>
                          <Input
                            value={newPropKey}
                            onChange={(e) => setNewPropKey(e.target.value)}
                            placeholder="e.g., NewProp"
                            size="sm"
                          />
                        </FormControl>
                        <FormControl flex="1">
                          <FormLabel fontSize="xs">Type</FormLabel>
                          <Select
                            value={insertState.type}
                            onChange={(e) => setInsertState((prev) => ({ ...prev, type: e.target.value }))}
                            size="sm"
                          >
                            <option value="string">Text</option>
                            <option value="number">Number</option>
                            <option value="object">Group</option>
                            <option value="array">List</option>
                          </Select>
                        </FormControl>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleAddObjectProperty(prop, insertState.position, newPropKey, insertState.type)}
                        >
                          Add
                        </Button>
                      </HStack>
                    </Box>
                  </Collapse>
                  <FieldEditor
                    fieldKey={prop}
                    value={val}
                    onChange={handleObjectChange}
                    fieldType={Array.isArray(val) ? "array" : typeof val}
                    onDelete={() => handleDeleteObjectProperty(prop)}
                  />
                </Box>
              ))}
              <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                  Add New Property
                </Text>
                <HStack spacing={3}>
                  <FormControl flex="1">
                    <FormLabel fontSize="xs" color="gray.600">Name</FormLabel>
                    <Input
                      value={newPropKey}
                      onChange={(e) => setNewPropKey(e.target.value)}
                      placeholder="e.g., Street"
                      size="sm"
                      borderColor="teal.500"
                    />
                    <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                      New property name
                    </FormHelperText>
                  </FormControl>
                  <FormControl flex="1">
                    <FormLabel fontSize="xs" color="gray.600">Type</FormLabel>
                    <Select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value)}
                      size="sm"
                      borderColor="teal.500"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="object">Group</option>
                      <option value="array">List</option>
                    </Select>
                    <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                      Property type
                    </FormHelperText>
                  </FormControl>
                  <Tooltip label="Add this property" placement="top">
                    <Button
                      onClick={() => handleAddObjectProperty()}
                      size="sm"
                      colorScheme="teal"
                      leftIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Tooltip>
                </HStack>
              </Box>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  // Array field
  if (fieldType === "array" && Array.isArray(localValue)) {
    return (
      <Accordion allowToggle mb={4}>
        <AccordionItem border="none">
          <AccordionButton
            bg="teal.50"
            _expanded={{ bg: "teal.100" }}
            borderRadius="md"
            p={3}
            _hover={{ bg: "teal.100" }}
          >
            <HStack flex="1" justify="space-between">
              <Text fontSize="md" fontWeight="semibold" color="teal.700">
                {fieldKey} (List)
              </Text>
              {onDelete && (
                <Tooltip label="Delete this list" placement="top">
                  <Button size="xs" colorScheme="red" variant="ghost" onClick={() => onDelete(fieldKey)}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              )}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} bg="white" borderRadius="md" shadow="sm" mt={2}>
            <VStack align="stretch" spacing={4}>
              {localValue.map((item, index) => (
                <Box key={index}>
                  <HStack spacing={2} mb={2}>
                    <Tooltip label="Add an item before this one" placement="top">
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => toggleInsertForm(index, "before")}
                      >
                        <ArrowUpIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Add an item after this one" placement="top">
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => toggleInsertForm(index, "after")}
                      >
                        <ArrowDownIcon />
                      </Button>
                    </Tooltip>
                  </HStack>
                  <Collapse in={insertState.isOpen && insertState.index === index}>
                    <Box p={2} bg="gray.50" borderRadius="md" mb={2}>
                      <HStack spacing={2}>
                        <FormControl flex="1">
                          <FormLabel fontSize="xs">Type</FormLabel>
                          <Select
                            value={insertState.type}
                            onChange={(e) => setInsertState((prev) => ({ ...prev, type: e.target.value }))}
                            size="sm"
                          >
                            <option value="string">Text</option>
                            <option value="number">Number</option>
                            <option value="object">Group</option>
                            <option value="array">List</option>
                          </Select>
                        </FormControl>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleInsertArrayItem(index, insertState.position!, insertState.type)}
                        >
                          Add
                        </Button>
                      </HStack>
                    </Box>
                  </Collapse>
                  <Box p={2} bg="white" borderRadius="md" borderWidth="1px">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {`${fieldKey}[${index}]`}
                      </Text>
                      <Tooltip label="Delete this item" placement="top">
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteArrayItem(index)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </HStack>
                    <FieldEditor
                      fieldKey={`${fieldKey}[${index}]`}
                      value={item}
                      onChange={(k, newVal) => handleArrayChange(index, newVal)}
                      fieldType={Array.isArray(item) ? "array" : typeof item}
                      onDelete={() => handleDeleteArrayItem(index)}
                    />
                  </Box>
                </Box>
              ))}
              <Box p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                  Add New Item
                </Text>
                <HStack spacing={3}>
                  <FormControl flex="1">
                    <FormLabel fontSize="xs" color="gray.600">Type</FormLabel>
                    <Select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value)}
                      size="sm"
                      borderColor="teal.500"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="object">Group</option>
                      <option value="array">List</option>
                    </Select>
                    <FormHelperText fontSize="xs" color="gray.500" mt={1}>
                      New item type
                    </FormHelperText>
                  </FormControl>
                  <Tooltip label="Add this item to the list" placement="top">
                    <Button
                      onClick={() => handleInsertArrayItem(localValue.length, "before", newPropType)}
                      size="sm"
                      colorScheme="teal"
                      leftIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Tooltip>
                </HStack>
              </Box>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  return null;
}

export default FieldEditor;