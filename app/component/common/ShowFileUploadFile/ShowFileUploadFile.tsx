import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { readFileAsBase64 } from "../../../config/utils/utils";
import FileViewer from "./FilesViewer/FileViewer";

const fileRowBg = "var(--dashboard-file-row-bg, #F7FAFC)";
const fileRowBorder = "var(--dashboard-file-row-border, #E2E8F0)";
const fileRowText = "var(--dashboard-file-row-text, #2D3748)";

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
          return;
        }
      }

      const file: any = await readFileAsBase64(item);
      if (file) {
        if (item.name?.endsWith(".pdf")) {
          setSelectedFile({ type: "pdf", file });
        } else {
          setSelectedFile({ type: "image", file });
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

    const normalizedFiles = Array.isArray(files) ? files : [files];

    return (
      <>
        <VStack spacing={4} mt={showViewIcon ? undefined : 5} w="full">
          {normalizedFiles.map((item: any, index: number) =>
            showViewIcon ? (
              <Tooltip key={index} label="View File" hasArrow placement="top">
                <IconButton
                  variant="outline"
                  borderRadius="full"
                  aria-label="View file"
                  onClick={() => setSelectedFileFun(item)}
                  icon={<ViewIcon />}
                  size="lg"
                  bg="var(--dashboard-surface-soft, white)"
                  color="var(--dashboard-accent-strong, #2B6CB0)"
                  borderColor="var(--dashboard-border-strong, #CBD5E0)"
                  _hover={{ bg: "var(--dashboard-accent-soft, #EBF8FF)" }}
                />
              </Tooltip>
            ) : (
              <Box
                key={index}
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bg={fileRowBg}
                p={4}
                borderRadius="18px"
                border="1px solid"
                borderColor={fileRowBorder}
                _hover={{ borderColor: "var(--dashboard-accent, #3182CE)" }}
                transition="all 0.2s ease"
              >
                <Flex
                  cursor="pointer"
                  onClick={() => setSelectedFileFun(item)}
                  alignItems="center"
                  minW={0}
                >
                  {item?.name && (item.name.endsWith(".pdf") ? (
                    <FaFilePdf size={24} color="#ef6b6b" />
                  ) : (
                    <FaFileImage size={24} color="#d6b772" />
                  ))}
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={fileRowText}
                    ml={3}
                    noOfLines={1}
                    maxW="250px"
                  >
                    {item?.name || "Uploaded file"}
                  </Text>
                </Flex>
                {removeFile ? (
                  <Tooltip label="Delete" hasArrow placement="top">
                    <IconButton
                      icon={<MdDelete />}
                      aria-label="Delete"
                      size="sm"
                      onClick={() => {
                        removeFile(item, index);
                        setSelectedFile({ type: null, file: null });
                      }}
                      borderRadius="full"
                      variant="ghost"
                      color="#ef6b6b"
                      _hover={{ bg: "rgba(239, 107, 107, 0.12)" }}
                    />
                  </Tooltip>
                ) : null}
              </Box>
            )
          )}
        </VStack>

        <Modal
          isOpen={Boolean(selectedFile?.type)}
          onClose={() => setSelectedFile({ type: null, file: null })}
          size="3xl"
          isCentered
        >
          <ModalOverlay bg="rgba(0, 0, 0, 0.76)" />
          <ModalContent h="85vh" bg="rgba(9, 8, 13, 0.98)" border="1px solid" borderColor="var(--dashboard-border, rgba(255,255,255,0.12))">
            <Flex position="relative" height="100%">
              <ModalCloseButton color="var(--dashboard-text, white)" />
              <ModalBody
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                {selectedFile.file && renderFileComponent(selectedFile.type, selectedFile.file)}
                <Flex justifyContent="flex-end" w="full" display="none">
                  <Button
                    colorScheme="red"
                    onClick={() => setSelectedFile({ type: null, file: null })}
                    display="none"
                    size="lg"
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
