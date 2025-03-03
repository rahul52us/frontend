'use client'
import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  FormLabel,
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  FormControl,
  FormHelperText,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon } from "@chakra-ui/icons";
import FieldEditor from "./FieldEditor";
import stores from "../../../store/stores";
import { observer } from "mobx-react-lite";

type FormDataType = {
  id: string;
  name: string;
  fields: { [key: string]: any };
};

 const MultiFormCreator = observer(() => {
  const {companyStore : {updateCompanyDetails, getCompanyDetails, companyDetails}, auth : {openNotification}} = stores
  const [forms, setForms] = useState<FormDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [newFormName, setNewFormName] = useState("");
  const [tempEditNames, setTempEditNames] = useState<{ [formId: string]: string }>({});

  // For each form, we'll manage the new field key/type inputs locally via a helper object.
  const [fieldInputs, setFieldInputs] = useState<{
    [formId: string]: { newFieldKey: string; newFieldType: string };
  }>({});

  // To track which form is in edit mode (for the main form name)
  const [editMode, setEditMode] = useState<{ [formId: string]: boolean }>({});

  // For drawer to show form details
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForm, setSelectedForm] = useState<FormDataType | null>(null);

  const cardBg = useColorModeValue("white", "gray.700");
  const cardShadow = useColorModeValue("md", "dark-lg");
  const cardBorder = useColorModeValue("gray.200", "gray.600");


  useEffect(() => {
    setForms(companyDetails?.details || [])
  },[companyDetails])

  // Add a new form group
  const handleAddForm = () => {
    if (!newFormName.trim()) return;
    const newForm: FormDataType = {
      id: newFormName.trim() + "_" + Date.now(),
      name: newFormName.trim(),
      fields: {},
    };
    setForms((prev) => [...prev, newForm]);
    // Initialize field inputs for this form
    setFieldInputs((prev) => ({
      ...prev,
      [newForm.id]: { newFieldKey: "", newFieldType: "string" },
    }));
    // Initialize temporary edit name value
    setTempEditNames((prev) => ({ ...prev, [newForm.id]: newForm.name }));
    setNewFormName("");
  };

  // Save an edited form name using the temporary edit value
  const handleSaveFormName = (formId: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId ? { ...form, name: tempEditNames[formId] } : form
      )
    );
    setEditMode((prev) => ({ ...prev, [formId]: false }));
    // Also update selectedForm if it's the one being edited
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm((prev) => prev && { ...prev, name: tempEditNames[formId] });
    }
  };

  // Add a new field to a given form
  const handleAddField = (formId: string) => {
    const { newFieldKey, newFieldType } = fieldInputs[formId];
    if (!newFieldKey.trim()) return;

    let defaultValue;
    switch (newFieldType) {
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
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? { ...form, fields: { ...form.fields, [newFieldKey]: defaultValue } }
          : form
      )
    );
    // If this form is currently open in the drawer, update it too
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm({
        ...selectedForm,
        fields: { ...selectedForm.fields, [newFieldKey]: defaultValue },
      });
    }
    // Reset the field inputs for this form
    setFieldInputs((prev) => ({
      ...prev,
      [formId]: { newFieldKey: "", newFieldType },
    }));
  };

  // Handle field change for a specific form
  const handleFieldChange = (formId: string, key: string, value: any) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId ? { ...form, fields: { ...form.fields, [key]: value } } : form
      )
    );
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm({
        ...selectedForm,
        fields: { ...selectedForm.fields, [key]: value },
      });
    }
  };

  // Delete a field from a specific form
  const handleDeleteField = (formId: string, key: string) => {
    setForms((prevForms) =>
      prevForms.map((form) => {
        if (form.id === formId) {
          const rest = Object.fromEntries(
            Object.entries(form.fields).filter(([k]) => k !== key)
          );
          return { ...form, fields: rest };
        }
        return form;
      })
    );
    if (selectedForm && selectedForm.id === formId) {
      const rest = Object.fromEntries(
        Object.entries(selectedForm.fields).filter(([k]) => k !== key)
      );
      setSelectedForm({ ...selectedForm, fields: rest });
    }
  };


  // Open a form in the drawer
  const handleOpenForm = (form: FormDataType) => {
    setSelectedForm(form);
    onOpen();
  };

  // Simulated save function for all forms
  const handleSave = async () => {
    setIsLoading(true);
    // console.log(formData)
       updateCompanyDetails({ details : forms }).then(() => {
        openNotification({
          title: "Updated successfully",
          message: "The Details has been successfully updated.",
          type: "success",
        });
        getCompanyDetails();
      }).catch((err) => {
        openNotification({
          title: "Failed to Update",
          message: err?.message || "An unexpected error occurred."
        });
      }).finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} textAlign="center" fontWeight="bold">
        CREATE CONTENT
      </Text>

      {/* Section to add a new form */}
      <Box p={6} mb={8} borderWidth="1px" borderRadius="lg" bg={cardBg} shadow={cardShadow}>
        <HStack spacing={4}>
          <FormControl id="form-name" flex="1">
            <FormLabel fontWeight="medium">Form Name</FormLabel>
            <Input
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              placeholder="Enter a name for the form"
            />
            <FormHelperText>Provide a unique name for the new form.</FormHelperText>
          </FormControl>
          <Button onClick={handleAddForm} colorScheme="teal" minW="120px">
            Add Form
          </Button>
        </HStack>
      </Box>

      {/* Render all forms as cards */}
      {forms.length > 0 ? (
        <VStack spacing={6}>
          {forms.map((form) => (
            <Box
              key={form.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg={cardBg}
              shadow={cardShadow}
              borderColor={cardBorder}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ shadow: "2xl", transform: "scale(1.02)", borderColor: "teal.300" }}
              width="100%"
              onClick={() => handleOpenForm(form)}
            >
              <HStack justify="space-between">
                {editMode[form.id] ? (
                  <>
                    <Input
                      size="sm"
                      value={tempEditNames[form.id] || ""}
                      onChange={(e) =>
                        setTempEditNames((prev) => ({
                          ...prev,
                          [form.id]: e.target.value,
                        }))
                      }
                    />
                    <IconButton
                      aria-label="Save form name"
                      icon={<CheckIcon />}
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveFormName(form.id);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text fontSize="lg" fontWeight="semibold">
                      {form.name}
                    </Text>
                    <IconButton
                      aria-label="Edit form name"
                      icon={<EditIcon />}
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditMode((prev) => ({ ...prev, [form.id]: true }));
                      }}
                    />
                  </>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          No forms added yet.
        </Text>
      )}

      {/* Drawer for editing form details */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent maxW="90vw">
          <DrawerCloseButton mt={4} />
          <DrawerHeader borderBottomWidth="1px" fontSize="xl" pb={4}>
            Edit Form: {selectedForm?.name}
          </DrawerHeader>
          <DrawerBody p={6}>
            {selectedForm && (
              <VStack spacing={6} align="stretch">
                {Object.entries(selectedForm.fields).map(([key, value]) => (
                  <Box
                    key={key}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <HStack justify="space-between" mb={3}>
                      <Text fontWeight="semibold">{key}</Text>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteField(selectedForm.id, key)}
                      >
                        Delete
                      </Button>
                    </HStack>
                    <FieldEditor
                      fieldKey={key}
                      value={value}
                      onChange={(childKey: string, newValue: any) =>
                        handleFieldChange(selectedForm.id, childKey, newValue)
                      }
                      fieldType={Array.isArray(value) ? "array" : typeof value}
                      onDelete={(childKey: string) =>
                        handleDeleteField(selectedForm.id, childKey)
                      }
                    />
                  </Box>
                ))}
                {/* Controls for adding a new field in this form */}
                <Box p={6} borderWidth="1px" borderRadius="lg" bg={cardBg} shadow={cardShadow}>
                  <Flex alignItems={{ base: "start", md: "center" }} columnGap={4} rowGap={4} flexDirection={{ base: 'column', md: 'row' }}>
                    <FormControl id="field-name" flex="1">
                      <FormLabel fontWeight="medium">Field Name</FormLabel>
                      <Input
                        value={fieldInputs[selectedForm.id]?.newFieldKey || ""}
                        onChange={(e) =>
                          setFieldInputs((prev) => ({
                            ...prev,
                            [selectedForm.id]: {
                              ...(prev[selectedForm.id] || { newFieldType: "string" }),
                              newFieldKey: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g., 'Age' or 'Address'"
                      />
                      <FormHelperText>Enter a name for the field.</FormHelperText>
                    </FormControl>

                    <FormControl id="field-type" flex="1">
                      <FormLabel fontWeight="medium">Field Type</FormLabel>
                      <Select
                        value={fieldInputs[selectedForm.id]?.newFieldType || "string"}
                        onChange={(e) =>
                          setFieldInputs((prev) => ({
                            ...prev,
                            [selectedForm.id]: {
                              ...(prev[selectedForm.id] || { newFieldKey: "" }),
                              newFieldType: e.target.value,
                            },
                          }))
                        }
                      >
                        <option value="string">Text</option>
                        <option value="number">Number</option>
                        <option value="object">Complex Object</option>
                        <option value="array">List</option>
                      </Select>
                      <FormHelperText>Select the field type.</FormHelperText>
                    </FormControl>
                    <Button
                      onClick={() => handleAddField(selectedForm.id)}
                      colorScheme="teal"
                      minW="120px"
                      mt={2}
                    >
                      Add Field
                    </Button>
                  </Flex>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box mt={6}>
        <Button onClick={handleSave} isLoading={isLoading} colorScheme="blue" width="100%" size="lg">
          Save All Forms
        </Button>
      </Box>
    </Box>
  );
})

export default MultiFormCreator