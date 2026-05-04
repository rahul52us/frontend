'use client';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import { MdEdit } from "react-icons/md";
import { CloseIcon, WarningIcon } from "@chakra-ui/icons";
import RichTextEditor from "../../../../component/common/Editor/RichQuillEditor";
import FormModel from "../../../../component/common/FormModel/FormModel";
import CustomInput from "../../../../component/config/component/customInput/CustomInput";
import { buildBase64ImageUpload } from "../../../../config/utils/imageUpload";

const BlogForm = observer(({ initialValues, submitForm, loading }: any) => {
  const [formState, setFormState] = useState<any>(initialValues);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempSubtitle, setTempSubtitle] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const tagInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleStateChange = (key: string, value: any) => {
    if (key === "coverImage") {
      setFormState((prev: any) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...value,
        },
      }));
    }
    else {
      setFormState((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  const handleTagAdd = () => {
    const { tagInput, tags } = formState;
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      handleStateChange("tags", [...tags, tagInput.trim()]);
      handleStateChange("tagInput", "");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    handleStateChange(
      "tags",
      formState.tags.filter((tag: any) => tag !== tagToRemove)
    );
  };

  const sendDataToBackend = () => {
    const { title, content, subTitle, tags, coverImage, isPrivate } = formState;
    if (!title || !content) {
      toast({
        title: "Validation Error",
        description: "Title and content cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    submitForm({ title, content, subTitle, tags, coverImage, isPrivate });
  };

  const handleModalSubmit = () => {
    handleStateChange("subTitle", tempSubtitle);
    onClose();
  };

  const handleReset = () => {
    setFormState({
      isPreviewMode: false,
      title: "",
      subTitle: "",
      content: "",
      tags: [],
      tagInput: "",
      isLoading: false,
      coverImage: {
        filename: null,
        type: null,
        buffer: null,
        isAdd :0,
        isDeleted : 1
      },
    });
    setIsResetModalOpen(false);
  };

  const { isPreviewMode, title, subTitle, content, tags, tagInput } = formState;

  return (
    <Box p={2} borderRadius="lg" boxShadow="lg" position="relative">
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Left Column - Editor */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading fontSize="lg" color="gray.700">
              {isPreviewMode ? "Preview Mode" : "Edit Mode"}
            </Heading>
            <CustomInput
              type="switch"
              name="isPrivate"
              label="Is Private"
              value={formState.isPrivate}
              onChange={(e : any) => {
                setFormState((prev: any) => ({
                  ...prev,
                  isPrivate: e?.target?.checked,
                }));
              }}
            />
            <Button
              size="sm"
              bgColor={isPreviewMode ? "purple.400" : "blue.400"}
              color="white"
              _hover={{ bgColor: isPreviewMode ? "purple.500" : "blue.500" }}
              onClick={() => handleStateChange("isPreviewMode", !isPreviewMode)}
            >
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
          </Flex>

          {isPreviewMode ? (
            <Box
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Heading as="h1" size="lg" mb={2}>
                {title || "Untitled Blog"}
              </Heading>
              <Text fontSize="md" color="gray.600" mb={4}>
                <Box dangerouslySetInnerHTML={{ __html: tempSubtitle }} />
                {!isPreviewMode && (
                  <Button
                    size="xs"
                    ml={2}
                    onClick={() => {
                      setTempSubtitle(subTitle);
                      onOpen();
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Text>
              <Box dangerouslySetInnerHTML={{ __html: content }} />
              <Text mt={6} fontSize="sm" color="gray.500">
                Tags: {tags.join(", ") || "No Tags"}
              </Text>
            </Box>
          ) : (
            <Box>
              <VStack align="start" spacing={4} w="100%">
                <Flex align="center" w="100%" p={4} gap={2}>
                  <Flex flex={1}>
                    <Input
                      placeholder="Enter blog title"
                      value={title}
                      onChange={(e) =>
                        handleStateChange("title", e.target.value)
                      }
                      size="lg"
                      borderColor="gray.300"
                      w="100%"
                    />
                  </Flex>
                  <Button
                    // size="sm"
                    colorScheme="teal"
                    variant="solid"
                    onClick={() => {
                      setTempSubtitle(subTitle);
                      onOpen();
                    }}
                    leftIcon={<Icon as={MdEdit} />}
                    _hover={{ bgColor: "teal.500", color: "white" }}
                    _active={{ bgColor: "teal.600" }}
                    _focus={{ boxShadow: "outline" }}
                    borderRadius="md"
                  >
                    Manage Content
                  </Button>
                </Flex>
                <Box width="100%">
                  <RichTextEditor
                    setEditorHtml={(html: string) =>
                      handleStateChange("content", html)
                    }
                    height="65vh"
                    editorHtml={content}
                  />
                </Box>
              </VStack>
            </Box>
          )}
        </Box>

        <FormModel
          open={isOpen}
          close={onClose}
          isCentered
          title="Edit Blog Details"
        >
          <Tabs variant="enclosed" minH={500}>
            <TabList>
              <Tab>Subtitle</Tab>
              <Tab>Tags</Tab>
              <Tab>Cover Image</Tab>
            </TabList>

            <TabPanels>
              {/* Subtitle Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor="gray.300"
                    w={"100%"}
                    boxShadow="sm"
                  >
                    <RichTextEditor
                      setEditorHtml={(html: string) => setTempSubtitle(html)}
                      editorHtml={tempSubtitle}
                      height="200px"
                    />
                  </Box>
                  <Box
                    p={2}
                    bg="gray.50"
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor="gray.300"
                    boxShadow="sm"
                    height="200px"
                    overflowY="auto"
                    mt={2}
                    dangerouslySetInnerHTML={{ __html: tempSubtitle }}
                  />

                  <Box display="flex" justifyContent="flex-end" gap={4}>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      variant="solid"
                      onClick={handleModalSubmit}
                    >
                      Save
                    </Button>
                    <Button variant="outline" size="sm" colorScheme="gray">
                      Cancel
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Tags Tab */}
              <TabPanel>
                <VStack align="start" w="100%" spacing={2}>
                  <Text fontWeight="bold" fontSize="sm">
                    Tags
                  </Text>
                  <Flex w="100%" gap={2} wrap="wrap" align="center">
                    {tags.map((tag: any) => (
                      <Tag
                        key={tag}
                        size="sm"
                        colorScheme="teal"
                        borderRadius="full"
                      >
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => handleTagRemove(tag)} />
                      </Tag>
                    ))}
                  </Flex>
                  <Flex w="100%" mt={2} gap={2}>
                    <Input
                      ref={tagInputRef}
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) =>
                        handleStateChange("tagInput", e.target.value)
                      }
                      size="sm"
                    />
                    <Button size="sm" colorScheme="teal" onClick={handleTagAdd}>
                      Add
                    </Button>
                  </Flex>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4} align="stretch" p={4}>
                  {/* File Input for Cover Image */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]; // Get the selected file
                      if (file) {
                        const normalizedImage = await buildBase64ImageUpload(file, {
                          isAdd: 1,
                          isDeleted: 0,
                        });
                        handleStateChange("coverImage", normalizedImage);
                      }
                    }}
                  />

                  {/* Preview Section */}
                  {formState.coverImage?.buffer && (
                    <Box>
                      <Text fontSize="sm" mb={2}>
                        Cover Image Preview:
                      </Text>
                      <Box
                        borderRadius="md"
                        overflow="hidden"
                        borderWidth={1}
                        borderColor="gray.300"
                      >
                        <Image
                          src={formState.coverImage.buffer}
                          alt={formState.coverImage.filename || ""}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </Box>

                      {/* Remove Cover Image */}
                      <Button
                        size="sm"
                        mt={2}
                        colorScheme="red"
                        onClick={() =>
                          handleStateChange("coverImage", {
                            name: null,
                            buffer: null,
                            type: null,
                            isDeleted: 1,
                          })
                        }
                      >
                        Remove Cover Image
                      </Button>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FormModel>
        <FormModel
          open={isResetModalOpen}
          close={() => setIsResetModalOpen(false)}
          isCentered
          title="Confirm Reset"
          size="lg"
        >
          <Box p={6} maxWidth="400px" mx="auto">
            {/* Main Title */}
            <Box textAlign="center" mb={6}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Confirm Data Reset
              </Text>
              <Text fontSize="lg" color="gray.600" mt={2}>
                Are you sure you want to reset all data? This action cannot be
                undone.
              </Text>
            </Box>

            {/* Warning Icon */}
            <Box display="flex" justifyContent="center" mb={4}>
              <WarningIcon color="red.500" boxSize={10} />
            </Box>

            {/* Description Text */}
            <Box mb={6}>
              <Text fontSize="md" color="gray.600" textAlign="center">
                {`All unsaved changes will be lost. Please confirm if you'd like
                to reset. If you're unsure, you may want to save your changes
                before proceeding.`}
              </Text>
            </Box>

            {/* Action Buttons */}
            <Flex justify="center" gap={6}>
              {/* Reset Button */}
              <Button
                colorScheme="red"
                size="lg"
                variant="solid"
                onClick={handleReset}
                width="180px"
                _hover={{ bg: "red.600" }}
                _active={{ bg: "red.700" }}
                boxShadow="lg"
                leftIcon={<WarningIcon boxSize={5} />}
              >
                Yes, Reset
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                colorScheme="gray"
                size="lg"
                onClick={() => setIsResetModalOpen(false)}
                width="180px"
                _hover={{ bg: "gray.100" }}
                _active={{ bg: "gray.200" }}
                boxShadow="lg"
                leftIcon={<CloseIcon boxSize={5} />}
              >
                Cancel
              </Button>
            </Flex>
          </Box>
        </FormModel>

        {/* Right Column - Writing Tips */}
        <Box p={4} borderRadius="lg" boxShadow="sm">
          <Heading fontSize="lg" mb={4} color="gray.700">
            Writing Tips
          </Heading>
          <Text fontSize="sm" mb={2}>
            - Use engaging titles and subtitles.
          </Text>
          <Text fontSize="sm" mb={2}>
            - Write concise and reader-friendly content.
          </Text>
          <Text fontSize="sm">
            - Organize your content with subheadings and bullet points.
          </Text>
        </Box>
      </Grid>

      {/* Buttons */}
      <Flex
        position="absolute"
        right="2"
        top="2"
        gap={4}
        zIndex={10}
        align="center"
        bg="white"
        p={2}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={() => {
            setIsResetModalOpen(true);
          }}
        >
          Reset
        </Button>
        <Button
          colorScheme="teal"
          isLoading={loading}
          onClick={sendDataToBackend}
        >
          Publish
        </Button>
      </Flex>
    </Box>
  );
});

export default BlogForm;
