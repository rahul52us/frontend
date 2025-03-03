'use client'

import { useState } from "react";
import { Button, useToast, Flex, Heading, Box, Spinner, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import FAQForm from "./component/FaqForm";
import stores from "../../../store/stores";
import { observer } from "mobx-react-lite";

const Faq = observer(() => {
  const {
    companyStore: { updateCompanyDetails, getCompanyDetails, companyDetails },
  } = stores;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      await updateCompanyDetails({ faq: formData?.faqs });
      getCompanyDetails();
      toast({
        title: "FAQ Updated",
        description: "The FAQ section has been successfully updated.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      handleClose();
    } catch (err: any) {
      toast({
        title: "Failed to Update",
        description: err?.message || "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      {/* Heading */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg" color="teal.600">
          Manage FAQs
        </Heading>

        {/* Add FAQ Button */}
        <Button
          colorScheme="teal"
          onClick={handleOpen}
          size="md"
          variant="solid"
          _hover={{ bg: "teal.500" }}
        >
          Add FAQ
        </Button>
      </Flex>

      {/* Loading State */}
      {isLoading && (
        <Flex justifyContent="center" alignItems="center" my={6}>
          <Spinner size="lg" color="teal.500" />
        </Flex>
      )}

      {/* Existing FAQ Data - Accordion */}
      {companyDetails?.faq?.length > 0 ? (
        <Box mb={6}>
          <Accordion allowMultiple>
            {companyDetails?.faq.map((faq, index) => (
              <AccordionItem key={index} border="1px solid" borderColor="gray.300" borderRadius="md" mb={2}>
                <h2>
                  <AccordionButton _expanded={{ bg: "teal.500", color: "white" }}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {faq.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text>{faq.paragraph}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      ) : (
        <Text color="gray.500">No FAQs available. Add some FAQs to get started.</Text>
      )}

      {/* FAQ Form Drawer */}
      <FAQForm isOpen={isOpen} onClose={handleClose} onSubmit={handleSubmit} />
    </Box>
  );
});

export default Faq;
