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
  Divider,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, AddIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import FieldEditor from "./FieldEditor";
import stores from "../../../store/stores";
import { observer } from "mobx-react-lite";

type FormDataType = {
  id: string;
  name: string;
  fields: { [key: string]: any };
};

const MultiFormCreator = observer(() => {
  const { companyStore: { updateCompanyDetails, getCompanyDetails, companyDetails }, auth: { openNotification } } = stores;
  const [forms, setForms] = useState<FormDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [tempEditNames, setTempEditNames] = useState<{ [formId: string]: string }>({});
  const [fieldInputs, setFieldInputs] = useState<{
    [formId: string]: { newFieldKey: string; newFieldType: string };
  }>({});
  const [editMode, setEditMode] = useState<{ [formId: string]: boolean }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForm, setSelectedForm] = useState<FormDataType | null>(null);

  // Delete Confirmation Dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef(null);

  // Color scheme
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accentColor = "teal.600";
  const hoverBg = useColorModeValue("teal.50", "teal.800");

  useEffect(() => {
    setForms(companyDetails?.details || []);
  }, [companyDetails]);

  const handleAddForm = (position?: "before" | "after", targetId?: string) => {
    if (!newFormName.trim()) return;
    const newForm: FormDataType = {
      id: newFormName.trim() + "_" + Date.now(),
      name: newFormName.trim(),
      fields: {},
    };
    if (position && targetId) {
      const targetIndex = forms.findIndex((f) => f.id === targetId);
      if (targetIndex !== -1) {
        setForms((prev) => [
          ...prev.slice(0, position === "before" ? targetIndex : targetIndex + 1),
          newForm,
          ...prev.slice(position === "before" ? targetIndex : targetIndex + 1),
        ]);
      }
    } else {
      setForms((prev) => [...prev, newForm]);
    }
    setFieldInputs((prev) => ({
      ...prev,
      [newForm.id]: { newFieldKey: "", newFieldType: "string" },
    }));
    setTempEditNames((prev) => ({ ...prev, [newForm.id]: newForm.name }));
    setNewFormName("");
  };

  const handleSaveFormName = (formId: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId ? { ...form, name: tempEditNames[formId] } : form
      )
    );
    setEditMode((prev) => ({ ...prev, [formId]: false }));
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm((prev) => prev && { ...prev, name: tempEditNames[formId] });
    }
  };

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
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm({
        ...selectedForm,
        fields: { ...selectedForm.fields, [newFieldKey]: defaultValue },
      });
    }
    setFieldInputs((prev) => ({
      ...prev,
      [formId]: { newFieldKey: "", newFieldType: "string" },
    }));
  };

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

  const handleDeleteForm = (formId: string) => {
    setFormToDelete(formId);
    onDeleteOpen();
  };

  const confirmDeleteForm = () => {
    if (formToDelete) {
      setForms((prevForms) => prevForms.filter((form) => form.id !== formToDelete));
      if (selectedForm && selectedForm.id === formToDelete) {
        setSelectedForm(null);
        onClose();
      }
      setFormToDelete(null);
      onDeleteClose();
    }
  };

  const handleOpenForm = (form: FormDataType) => {
    setSelectedForm(form);
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);
    updateCompanyDetails({ details: forms }).then(() => {
      openNotification({
        title: "Saved Successfully!",
        message: "Your forms are ready to use.",
        type: "success",
      });
      getCompanyDetails();
    }).catch((err) => {
      openNotification({
        title: "Oops! Something Went Wrong",
        message: err?.message || "Please try again.",
      });
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Box p={{ base: 4, md: 4 }} mx="auto" bg="gray.50" minH="100vh">
      {/* Header */}
      <VStack spacing={4} mb={10}>
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          textAlign="center"
          color={textColor}
          bgGradient={`linear(to-r, ${accentColor}, blue.500)`}
          bgClip="text"
        >
          Build Forms Easily
        </Text>
        <Text fontSize="lg" color="gray.600" textAlign="center" maxW="600px">
          Name your form, add it to the list, then customize it with fields. Simple and fast!
        </Text>
      </VStack>

      {/* Add New Form Section */}
      <Box
        p={6}
        mb={8}
        bg={cardBg}
        borderRadius="lg"
        shadow="md"
        borderWidth="1px"
        borderColor={cardBorder}
      >
        <VStack spacing={4} align="stretch">
          <FormControl id="form-name">
            <FormLabel fontSize="lg" fontWeight="semibold" color={textColor}>
              Step 1: Name Your Form
            </FormLabel>
            <HStack spacing={4}>
              <Input
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                placeholder="e.g., Registration, Survey"
                size="lg"
                borderColor={accentColor}
                bg="white"
                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 2px ${accentColor}` }}
              />
              <Tooltip label="Add a new form to the list" placement="top">
                <Button
                  onClick={() => handleAddForm()}
                  colorScheme="teal"
                  size="lg"
                  px={8}
                  leftIcon={<AddIcon />}
                  bg={accentColor}
                  _hover={{ bg: "teal.700", transform: "scale(1.02)" }}
                  transition="all 0.2s"
                >
                  Add Form
                </Button>
              </Tooltip>
            </HStack>
            <FormHelperText color="gray.600">
              Give it a clear, catchy name!
            </FormHelperText>
          </FormControl>
        </VStack>
      </Box>

      {/* Forms List */}
      <Box mb={10}>
        <Text fontSize="xl" fontWeight="semibold" mb={4} color={textColor}>
          Your Forms
        </Text>
        {forms.length > 0 ? (
          <VStack spacing={4} align="stretch">
            {forms.map((form) => (
              <Flex
                key={form.id}
                p={4}
                bg={cardBg}
                borderRadius="lg"
                shadow="sm"
                borderWidth="1px"
                borderColor={cardBorder}
                align="center"
                justify="space-between"
                transition="all 0.3s"
                _hover={{ bg: hoverBg, shadow: "md" }}
              >
                <HStack spacing={3} flex="1">
                  {editMode[form.id] ? (
                    <>
                      <Input
                        value={tempEditNames[form.id] || ""}
                        onChange={(e) =>
                          setTempEditNames((prev) => ({ ...prev, [form.id]: e.target.value }))
                        }
                        size="md"
                        borderColor={accentColor}
                        bg="white"
                        _focus={{ borderColor: accentColor }}
                      />
                      <Tooltip label="Save the new name" placement="top">
                        <IconButton
                          aria-label="Save form name"
                          icon={<CheckIcon />}
                          size="sm"
                          colorScheme="green"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveFormName(form.id);
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Text fontSize="lg" fontWeight="medium" color={textColor}>
                        {form.name}
                      </Text>
                      <Tooltip label="Edit form name" placement="top">
                        <IconButton
                          aria-label="Edit form name"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="teal"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditMode((prev) => ({ ...prev, [form.id]: true }));
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </HStack>
                <HStack spacing={2}>
                  <Tooltip label="Add a form before this one" placement="top">
                    <IconButton
                      aria-label="Add before"
                      icon={<ArrowUpIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddForm("before", form.id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Add a form after this one" placement="top">
                    <IconButton
                      aria-label="Add after"
                      icon={<ArrowDownIcon />}
                      size="sm"
                      variant="outline"
                      colorScheme="teal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddForm("after", form.id);
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Edit fields" placement="top">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      onClick={() => handleOpenForm(form)}
                    >
                      Fields
                    </Button>
                  </Tooltip>
                  <Tooltip label="Delete this form" placement="top">
                    <IconButton
                      aria-label="Delete form"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteForm(form.id);
                      }}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            ))}
          </VStack>
        ) : (
          <Box p={6} bg="white" borderRadius="lg" shadow="sm" textAlign="center">
            <Text fontSize="md" color="gray.600">
              No forms yet. Start by adding one above!
            </Text>
          </Box>
        )}
      </Box>

      {/* Drawer for Form Details */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
        <DrawerOverlay bg="rgba(0,0,0,0.2)" />
        <DrawerContent bg={cardBg} borderLeftRadius="lg" style={{minWidth:'80vw'}}>
          <DrawerCloseButton mt={4} size="lg" color={textColor} />
          <DrawerHeader fontSize="2xl" fontWeight="bold" py={6} px={6} color={textColor}>
            {selectedForm?.name}
          </DrawerHeader>
          <DrawerBody p={6}>
            {selectedForm && (
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Step 2: Add Fields
                </Text>
                {Object.entries(selectedForm.fields).length > 0 ? (
                  Object.entries(selectedForm.fields).map(([key, value]) => (
                    <Box
                      key={key}
                      p={4}
                      bg="white"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={cardBorder}
                      _hover={{ bg: hoverBg }}
                    >
                      <HStack justify="space-between" mb={3}>
                        <Text fontSize="md" fontWeight="medium" color={textColor}>
                          {key}
                        </Text>
                        <Tooltip label="Remove this field" placement="top">
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteField(selectedForm.id, key)}
                          >
                            Remove
                          </Button>
                        </Tooltip>
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
                  ))
                ) : (
                  <Text fontSize="sm" color="gray.600">
                    No fields added yet. Create one below!
                  </Text>
                )}
                <Divider />
                <Box>
                  <Text fontSize="md" fontWeight="medium" mb={4} color={textColor}>
                    Add a New Field
                  </Text>
                  <VStack spacing={4} align="stretch">
                    <FormControl id="field-name">
                      <FormLabel fontSize="sm" color={textColor}>
                        Field Name
                      </FormLabel>
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
                        placeholder="e.g., Email, Phone"
                        size="md"
                        bg="white"
                        borderColor={accentColor}
                        _focus={{ borderColor: accentColor }}
                      />
                    </FormControl>
                    <FormControl id="field-type">
                      <FormLabel fontSize="sm" color={textColor}>
                        Field Type
                      </FormLabel>
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
                        size="md"
                        bg="white"
                        borderColor={accentColor}
                        _focus={{ borderColor: accentColor }}
                      >
                        <option value="string">Text (e.g., Name)</option>
                        <option value="number">Number (e.g., Age)</option>
                        <option value="object">Group (e.g., Address)</option>
                        <option value="array">List (e.g., Interests)</option>
                      </Select>
                    </FormControl>
                    <Button
                      onClick={() => handleAddField(selectedForm.id)}
                      colorScheme="teal"
                      size="md"
                      leftIcon={<AddIcon />}
                      bg={accentColor}
                      _hover={{ bg: "teal.700" }}
                    >
                      Add Field
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Form
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this form? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteForm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Save Button */}
      {forms.length > 0 && (
        <Box mt={8} textAlign="center">
          <Tooltip label="Save all your forms" placement="top">
            <Button
              onClick={handleSave}
              isLoading={isLoading}
              colorScheme="blue"
              size="lg"
              px={12}
              fontSize="lg"
              fontWeight="semibold"
              bg="blue.500"
              _hover={{ bg: "blue.600", transform: "scale(1.02)" }}
              transition="all 0.2s"
            >
              Save All Forms
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
});

export default MultiFormCreator;