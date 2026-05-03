const fs = require('fs');
const path = 'c:/Users/uknow/Desktop/my-projects/business sahayta/frontend/app/(authentication)/signUp/components/SignUpComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update renderPhoneStep
const renderPhoneStepRegex = /const renderPhoneStep = \(\) => \([\s\S]*?<VStack align="stretch" spacing=\{6\}>[\s\S]*?<Box>[\s\S]*?<Text fontSize="sm" color="gray\.500" mb=\{3\}>[\s\S]*?I want to join as[\s\S]*?<\/Text>[\s\S]*?<SimpleGrid columns=\{2\} spacing=\{3\}>[\s\S]*?<Button[\s\S]*?Buyer \/ User[\s\S]*?<\/Button>[\s\S]*?<Button[\s\S]*?Seller[\s\S]*?<\/Button>[\s\S]*?<\/SimpleGrid>[\s\S]*?<\/Box>/;
content = content.replace(renderPhoneStepRegex, `const renderPhoneStep = () => (
  <VStack align="stretch" spacing={{ base: 5, md: 6 }}>
    <Box>
      <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider" color="gray.500" mb={3}>
        I want to join as
      </Text>
      <HStack spacing={3}>
        <Button
          flex={1}
          type="button"
          variant={intent === "user" ? "solid" : "outline"}
          colorScheme="blue"
          borderRadius="xl"
          h={{ base: "44px", md: "48px" }}
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => setIntentSelection("user")}
          bg={intent === "user" ? "blue.600" : "transparent"}
          color={intent === "user" ? "white" : "gray.600"}
          borderColor={intent === "user" ? "blue.600" : "gray.200"}
          _hover={{ bg: intent === "user" ? "blue.700" : "gray.50" }}
        >
          Buyer / User
        </Button>
        <Button
          flex={1}
          type="button"
          variant={intent === "seller" ? "solid" : "outline"}
          colorScheme="blue"
          borderRadius="xl"
          h={{ base: "44px", md: "48px" }}
          fontSize={{ base: "sm", md: "md" }}
          onClick={() => setIntentSelection("seller")}
          bg={intent === "seller" ? "blue.600" : "transparent"}
          color={intent === "seller" ? "white" : "gray.600"}
          borderColor={intent === "seller" ? "blue.600" : "gray.200"}
          _hover={{ bg: intent === "seller" ? "blue.700" : "gray.50" }}
        >
          Seller
        </Button>
      </HStack>
    </Box>`);

// 2. Reduce general spacing in forms
content = content.replace(/spacing=\{5\}/g, 'spacing={{ base: 4, md: 5 }}');

// 3. Update main container Box padding to be smaller
const boxRegex = /<Box\s*\{\.\.\.panelStyles\}\s*boxShadow=\{panelStyles\.boxShadow\}\s*borderWidth=\{panelStyles\.borderWidth\}\s*px=\{\{ base: 2, md: 8, xl: 9 \}\}\s*py=\{\{ base: 4, md: 8, xl: 9 \}\}\s*w="full"\s*>/;
content = content.replace(boxRegex, `<Box
          {...panelStyles}
          boxShadow={panelStyles.boxShadow}
          borderWidth={panelStyles.borderWidth}
          px={{ base: 4, md: 8, xl: 9 }}
          py={{ base: 5, md: 8, xl: 9 }}
          w="full"
        >`);

// 4. Reduce spacing in main VStack
content = content.replace(/<VStack align="stretch" spacing=\{8\}>/, '<VStack align="stretch" spacing={{ base: 5, md: 8 }}>');

// 5. Container padding top
content = content.replace(/pt=\{\{ base: "10px", md: 0 \}\}/g, 'pt={{ base: "0px", md: 0 }}');
content = content.replace(/pt=\{\{ base: "calc\(env\(safe-area-inset-top, 0px\) \+ 16px\)", md: 6 \}\}/g, 'pt={{ base: "calc(env(safe-area-inset-top, 0px) + 8px)", md: 6 }}');
content = content.replace(/pb=\{\{ base: "calc\(env\(safe-area-inset-bottom, 0px\) \+ 16px\)", md: 6 \}\}/g, 'pb={{ base: "calc(env(safe-area-inset-bottom, 0px) + 8px)", md: 6 }}');

// 6. Reduce step header icon and text
const headerStackRegex = /<Stack\s*direction=\{isSellerPhotosStep \? "column" : \{\s*base: "column",\s*sm: "row"\s*\}\}\s*spacing=\{4\}\s*align=\{isSellerPhotosStep \? "center" : \{\s*base: "flex-start",\s*sm: "center"\s*\}\}\s*justify=\{isSellerPhotosStep \? "center" : undefined\}\s*>\s*<Circle size="50px" bg="blue\.50" color="blue\.600">\s*<Icon as=\{activeStep\.icon as any\} boxSize=\{5\} \/>\s*<\/Circle>\s*<Box flex="1" minW=\{0\} textAlign=\{isSellerPhotosStep \? "center" : "left"\}>\s*<Heading fontSize=\{\{\s*base: "2xl",\s*sm: "3xl",\s*lg: "4xl"\s*\}\} color="gray\.900" lineHeight="1\.1">\s*\{activeStep\.title\}\s*<\/Heading>\s*<Text color="gray\.500" fontSize=\{\{\s*base: "sm",\s*md: "md"\s*\}\}>\s*\{activeStep\.subtitle\}\s*<\/Text>\s*<\/Box>\s*<\/Stack>/;
content = content.replace(headerStackRegex, `<Stack
              direction={isSellerPhotosStep ? "column" : { base: "row", sm: "row" }}
              spacing={{ base: 3, md: 4 }}
              align={isSellerPhotosStep ? "center" : "center"}
              justify={isSellerPhotosStep ? "center" : undefined}
            >
              <Circle size={{ base: "44px", md: "50px" }} bg="blue.50" color="blue.600">
                <Icon as={activeStep.icon as any} boxSize={{ base: 4, md: 5 }} />
              </Circle>
              <Box flex="1" minW={0} textAlign={isSellerPhotosStep ? "center" : "left"}>
                <Heading fontSize={{ base: "xl", sm: "2xl", md: "3xl" }} color="gray.900" lineHeight="1.2">
                  {activeStep.title}
                </Heading>
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                  {activeStep.subtitle}
                </Text>
              </Box>
            </Stack>`);

fs.writeFileSync(path, content);
console.log("Rewrite applied successfully.");
