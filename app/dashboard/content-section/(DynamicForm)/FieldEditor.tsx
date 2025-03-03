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
} from "@chakra-ui/react";

interface FieldEditorProps {
  fieldKey: string;
  value: any;
  onChange?: any
  fieldType: string;
  // onDelete is optional. If provided, indicates that this field can be removed by the parent.
  onDelete?: any;
}

// Helper functions:
const removeKey = (obj: any, key: string) => {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
};

const removeIndex = (arr: any[], index: number) => {
  return arr.filter((_, i) => i !== index);
};

function FieldEditor({ fieldKey, value, onChange, fieldType, onDelete }: FieldEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  // For adding new properties/items
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropType, setNewPropType] = useState("string");

  // Make sure localValue is updated if parent value changes.
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update simple field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    onChange(fieldKey, newVal);
  };

  // Update array item at index
  const handleArrayChange = (index: number, newVal: any) => {
    const updatedArray = [...localValue];
    updatedArray[index] = newVal;
    setLocalValue(updatedArray);
    onChange(fieldKey, updatedArray);
  };

  // Delete an array item at index
  const handleDeleteArrayItem = (index: number) => {
    const updatedArray = removeIndex(localValue, index);
    setLocalValue(updatedArray);
    onChange(fieldKey, updatedArray);
  };

  // Insert new array item at index
  const handleInsertArrayItem = (index: number) => {
    let defaultValue;
    switch (newPropType) {
      case "number":
        defaultValue = 0;
        break;
      case "object":
        defaultValue = {};
        break;
      case "array":
        defaultValue = [];
        break;
      default:
        defaultValue = "";
    }
    const updatedArray = [
      ...localValue.slice(0, index),
      defaultValue,
      ...localValue.slice(index),
    ];
    setLocalValue(updatedArray);
    onChange(fieldKey, updatedArray);
  };

  // Update object property
  const handleObjectChange = (propKey: string, newVal: any) => {
    const updatedObject = { ...localValue, [propKey]: newVal };
    setLocalValue(updatedObject);
    onChange(fieldKey, updatedObject);
  };

  // Delete an object property by key
  const handleDeleteObjectProperty = (propKey: string) => {
    const updatedObject = removeKey(localValue, propKey);
    setLocalValue(updatedObject);
    onChange(fieldKey, updatedObject);
  };

  // Add new property to an object
  const handleAddProperty = () => {
    if (newPropKey.trim() === "") return;
    let defaultValue;
    switch (newPropType) {
      case "number":
        defaultValue = 0;
        break;
      case "object":
        defaultValue = {};
        break;
      case "array":
        defaultValue = [];
        break;
      default:
        defaultValue = "";
    }
    handleObjectChange(newPropKey, defaultValue);
    setNewPropKey("");
  };

  // Append new array item at end
  const handleAddArrayItem = () => {
    let defaultValue;
    switch (newPropType) {
      case "number":
        defaultValue = 0;
        break;
      case "object":
        defaultValue = {};
        break;
      case "array":
        defaultValue = [];
        break;
      default:
        defaultValue = "";
    }
    const updatedArray = [...localValue, defaultValue];
    setLocalValue(updatedArray);
    onChange(fieldKey, updatedArray);
  };

  // Render for simple types (string/number)
  if (fieldType === "string" || fieldType === "number") {
    return (
      <Box mb={4} p={3} borderWidth="1px" borderRadius="md" shadow="sm">
        <HStack justify="space-between">
          <FormLabel fontWeight="bold">{fieldKey}</FormLabel>
          {onDelete && (
            <Button size="xs" colorScheme="red" onClick={() => onDelete(fieldKey)}>
              Delete
            </Button>
          )}
        </HStack>
        <Input
          value={localValue}
          onChange={handleChange}
          type={fieldType === "number" ? "number" : "text"}
          placeholder={fieldKey}
        />
      </Box>
    );
  }

  // Render for objects using Accordion
  if (fieldType === "object" && typeof localValue === "object") {
    return (
      <Accordion allowToggle mb={4}>
        <AccordionItem border="none">
          <AccordionButton
            _expanded={{ bg: "blue.50" }}
            borderWidth="1px"
            borderRadius="md"
            p={3}
          >
            <HStack flex="1" justify="space-between">
              <Text fontWeight="bold">{fieldKey} (Object)</Text>
              {onDelete && (
                <Button size="xs" colorScheme="red" onClick={() => onDelete(fieldKey)}>
                  Delete
                </Button>
              )}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack align="start" spacing={4}>
              {Object.entries(localValue).map(([prop, val]) => (
                <Box ml={4} key={prop} w="100%">
                  <FieldEditor
                    fieldKey={prop}
                    value={val}
                    onChange={handleObjectChange}
                    fieldType={
                      typeof val === "object" && Array.isArray(val) ? "array" : typeof val
                    }
                    onDelete={() => handleDeleteObjectProperty(prop)}
                  />
                </Box>
              ))}
              <Box p={3} borderWidth="1px" borderRadius="md" w="100%" bg="gray.50">
                <HStack spacing={3}>
                  <FormControl id="prop-key" flex="1">
                    <FormLabel fontSize="sm">Property Name</FormLabel>
                    <Input
                      value={newPropKey}
                      onChange={(e) => setNewPropKey(e.target.value)}
                      placeholder="e.g., City"
                      size="sm"
                    />
                    <FormHelperText fontSize="xs">
                      New property key
                    </FormHelperText>
                  </FormControl>
                  <FormControl id="prop-type" flex="1">
                    <FormLabel fontSize="sm">Type</FormLabel>
                    <Select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value)}
                      size="sm"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="object">Object</option>
                      <option value="array">List</option>
                    </Select>
                    <FormHelperText fontSize="xs">
                      Property type
                    </FormHelperText>
                  </FormControl>
                  <Button onClick={handleAddProperty} size="sm" colorScheme="teal">
                    Add
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  // Render for arrays using Accordion
  if (fieldType === "array" && Array.isArray(localValue)) {
    return (
      <Accordion allowToggle mb={4}>
        <AccordionItem border="none">
          <AccordionButton
            _expanded={{ bg: "blue.50" }}
            borderWidth="1px"
            borderRadius="md"
            p={3}
          >
            <HStack flex="1" justify="space-between">
              <Text fontWeight="bold">{fieldKey} (Array)</Text>
              {onDelete && (
                <Button size="xs" colorScheme="red" onClick={() => onDelete(fieldKey)}>
                  Delete
                </Button>
              )}
            </HStack>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack align="start" spacing={4}>
              {localValue.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Insert button before each array item */}
                  <HStack ml={4} spacing={2}>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => handleInsertArrayItem(index)}
                    >
                      Insert Here
                    </Button>
                  </HStack>
                  <Box ml={4} w="100%" borderWidth="1px" borderRadius="md" p={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{`${fieldKey}[${index}]`}</Text>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleDeleteArrayItem(index)}
                      >
                        Delete
                      </Button>
                    </HStack>
                    <FieldEditor
                      fieldKey={`${fieldKey}[${index}]`}
                      value={item}
                      onChange={(k, newVal) => handleArrayChange(index, newVal)}
                      fieldType={
                        typeof item === "object" && Array.isArray(item)
                          ? "array"
                          : typeof item
                      }
                      onDelete={() => handleDeleteArrayItem(index)}
                    />
                  </Box>
                </React.Fragment>
              ))}
              {/* Insert button at the end */}
              <HStack ml={4} spacing={2}>
                <Button
                  size="xs"
                  colorScheme="blue"
                  onClick={() => handleInsertArrayItem(localValue.length)}
                >
                  Insert at End
                </Button>
              </HStack>
              {/* Section for adding a new item at the end */}
              <Box p={3} borderWidth="1px" borderRadius="md" w="100%" bg="gray.50">
                <HStack spacing={3}>
                  <FormControl id="item-type" flex="1">
                    <FormLabel fontSize="sm">Item Type</FormLabel>
                    <Select
                      value={newPropType}
                      onChange={(e) => setNewPropType(e.target.value)}
                      size="sm"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="object">Object</option>
                      <option value="array">List</option>
                    </Select>
                    <FormHelperText fontSize="xs">
                      New item type
                    </FormHelperText>
                  </FormControl>
                  <Button onClick={handleAddArrayItem} size="sm" colorScheme="teal">
                    Add
                  </Button>
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
