import {
    Box,
    Text,
    IconButton,
    Tooltip,
    Flex,
    Image,
    Button,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
  } from "@chakra-ui/react";
  import { observer } from "mobx-react-lite";
  import { MdDelete } from "react-icons/md";
  import { FaFilePdf, FaFileImage } from "react-icons/fa";
  import { useState } from "react";
  import { ViewIcon } from "@chakra-ui/icons";
import { readFileAsBase64 } from "../../../config/utils/utils";
import FileViewer from "./FilesViewer/FileViewer";

  const ShowFileUploadFile = observer(
    ({ files, removeFile, edit, showViewIcon }: any) => {
      const [selectedFile, setSelectedFile] = useState<any>({
        type: null,
        file: null,
      });

      const setSelectedFileFun = async (item: any) => {
        if (edit) {
          if (item.url) {
            setSelectedFile({
              type: item.type,
              file: item.file || item.url,
            });
          } else {
            const file: any = await readFileAsBase64(item);
            if (file) {
              if (item.name.endsWith(".pdf")) {
                setSelectedFile({ type: "pdf", file: file });
              } else {
                setSelectedFile({ type: "image", file: file });
              }
            }
          }
        } else {
          const file: any = await readFileAsBase64(item);
          if (file) {
            if (item.name.endsWith(".pdf")) {
              setSelectedFile({ type: "pdf", file: file });
            } else {
              setSelectedFile({ type: "image", file: file });
            }
          }
        }
      };

      const renderFileComponent = (type: string, url: any) => {
        if (type === "pdf" || type?.startsWith("application/pdf")) {
          return <FileViewer url={url} />;
        }
        if (type === "image" || type?.startsWith("image/")) {
          return (
            <Image
              src={url}
              alt="Uploaded file"
              maxW="100%"
                    maxH="100%"
                    objectFit="contain"
              borderRadius="lg"
              boxShadow="xl"
            />
          );
        }
        return null;
      };

      const checkFilesType = () => {
        if (Array.isArray(files)) return files;
        return [files];
      };

      return (
        <>
          <VStack spacing={4} mt={showViewIcon ? undefined : 5} w="full">
            {checkFilesType().map((item: any, index: number) =>
              showViewIcon ? (
                <Tooltip key={index} label="View File" hasArrow placement="top">
                  <IconButton
                    variant="solid"
                    colorScheme="teal"
                    aria-label="View file"
                    onClick={() => setSelectedFileFun(item)}
                    icon={<ViewIcon />}
                    size="lg"
                    borderRadius="full"
                  />
                </Tooltip>
              ) : (
                <Box
                  key={index}
                  w="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bg="gray.50"
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg" }}
                  transition="all 0.3s ease-in-out"
                >
                  <Flex
                    cursor="pointer"
                    onClick={() => setSelectedFileFun(item)}
                    alignItems="center"
                  >
                    {item?.name &&
                      (item.name.endsWith(".pdf") ? (
                        <FaFilePdf size={28} color="red" />
                      ) : (
                        <FaFileImage size={28} color="blue" />
                      ))}
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="gray.700"
                      ml={3}
                      noOfLines={1}
                      maxWidth="250px"
                      overflow="hidden"
                    >
                      {item?.name}
                    </Text>
                  </Flex>
                  {removeFile && (
                    <Tooltip label="Delete" hasArrow placement="top">
                      <IconButton
                        icon={<MdDelete />}
                        colorScheme="red"
                        aria-label="Delete"
                        size="sm"
                        onClick={() => {
                          removeFile(item, index);
                          setSelectedFile(null);
                        }}
                        borderRadius="full"
                      />
                    </Tooltip>
                  )}
                </Box>
              )
            )}
          </VStack>

          <Modal
            isOpen={selectedFile?.type ? true : false}
            onClose={() => setSelectedFile({ type: null, file: null })}
            size={'3xl'}
            isCentered
          >
            <ModalOverlay />
            <ModalContent h="85vh" bg={"blackAlpha.900"}>
              <Flex position="relative" height="100%">
                <ModalCloseButton color={"white"} />
                <ModalBody
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                    {selectedFile.file &&
                      renderFileComponent(selectedFile.type, selectedFile.file)}
                    <Flex justifyContent="flex-end" w="full" display="none">
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          setSelectedFile({ type: null, file: null })
                        }
                        display="none"
                        size="lg"
                        _hover={{ bg: "red.500", color: "white" }}
                      >
                        Close
                      </Button>
                    </Flex>
                </ModalBody>
              </Flex>
            </ModalContent>
          </Modal>
        </>
      );
    }
  );

  export default ShowFileUploadFile;
