import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";

const FAQAccordion = observer(() => {
  const {companyStore : {companyDetails}} = stores
  const [expandedPanels, setExpandedPanels] = useState({});

  const togglePanel = (index) => {
    setExpandedPanels((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box>
      <Accordion allowToggle>
        <VStack spacing={{ base: 3, md: 5 }} align="stretch">
          {companyDetails?.faq?.map((module, index) => (
            <Box
              key={index}
              position="relative"
              rounded="14px"
              transition="all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <AccordionItem
                border="none"
                bg="white"
                rounded="14px"
                transition="all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                {({ isExpanded }) => (
                  <Box
                    shadow={
                      isExpanded ? "0 4px 16px rgba(0, 0, 0, 0.1)" : "none"
                    }
                    p={{ base: 1.5, md: 3 }}
                    rounded={"14px"}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <AccordionButton
                      _hover={{ bg: "transparent" }}
                      cursor="pointer"
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize={{
                          base: isExpanded ? "18px" : "14px",
                          md: isExpanded ? "20px" : "16px",
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        fontWeight={isExpanded ? "500" : "400"}
                        color="#0F0F0F"
                      >
                        {module.title}
                      </Box>
                      <AccordionIcon transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" />
                    </AccordionButton>
                    <AccordionPanel
                      px={4}
                      pt={0}
                      pb={4}
                      style={{
                        overflow: "hidden",
                        transition:
                          "max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                        maxHeight: isExpanded ? "500px" : "0",
                        opacity: isExpanded ? 1 : 0,
                      }}
                      color="#575757"
                      w={{ base: "100%", md: "85%" }}
                    >
                      <Text
                        lineHeight={{base:"24px",md:"28px"}}
                        fontSize={{base:"14px",md:"16px"}}
                        noOfLines={expandedPanels[index] ? undefined : 3}
                      >
                        {module.paragraph}
                      </Text>
                      <Button
                        size="sm"
                        mt={2}
                        variant="link"
                        color={"#045B64"}
                        onClick={() => togglePanel(index)}
                      >
                        {expandedPanels[index] ? "Show Less" : "Read More.."}
                      </Button>
                    </AccordionPanel>
                  </Box>
                )}
              </AccordionItem>
            </Box>
          ))}
        </VStack>
      </Accordion>
    </Box>
  );
});

export default FAQAccordion;
