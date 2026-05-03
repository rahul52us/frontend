const fs = require('fs');
const path = 'c:/Users/uknow/Desktop/my-projects/business sahayta/frontend/app/(authentication)/signUp/components/SignUpComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the Container `px` entirely on mobile to save space, rely on Box `px`
content = content.replace(
  /px=\{\{ base: 4, md: 6 \}\}\s*display="flex"\s*alignItems=\{\{ base: "flex-start", md: "center" \}\}/,
  `px={{ base: 0, md: 6 }}\n        display="flex"\n        alignItems={{ base: "flex-start", md: "center" }}`
);

// 2. Reduce Box inner padding and spacing
content = content.replace(
  /<Box\s*\{\.\.\.panelStyles\}\s*boxShadow=\{panelStyles\.boxShadow\}\s*borderWidth=\{panelStyles\.borderWidth\}\s*px=\{\{ base: 4, md: 8, xl: 9 \}\}\s*py=\{\{ base: 5, md: 8, xl: 9 \}\}/,
  `<Box
          {...panelStyles}
          boxShadow={panelStyles.boxShadow}
          borderWidth={panelStyles.borderWidth}
          px={{ base: 3, md: 8, xl: 9 }}
          py={{ base: 3, md: 8, xl: 9 }}`
);

// 3. Make VStack spacing even tighter
content = content.replace(
  /<VStack align="stretch" spacing=\{\{ base: 5, md: 8 \}\}>/,
  `<VStack align="stretch" spacing={{ base: 4, md: 8 }}>`
);

// 4. Overhaul the top row (Back button + Badge)
const topRowRegex = /<Flex justify="space-between" align=\{\{ base: "start", sm: "center" \}\} direction=\{\{ base: "column", sm: "row" \}\} gap=\{3\}>\s*<Circle size="42px" bg="white" borderWidth="1px" borderColor="gray\.200" boxShadow="sm">\s*<IconButton\s*aria-label="Go back"\s*icon=\{<ArrowBackIcon \/>\}\s*variant="ghost"\s*borderRadius="full"\s*onClick=\{handleBack\}\s*isDisabled=\{stepIndex === 0\}\s*\/>\s*<\/Circle>\s*<Badge\s*bg="blue\.50"\s*color="blue\.600"\s*borderRadius="md"\s*px=\{3\}\s*py=\{1\}\s*fontSize="xs"\s*fontWeight="700"\s*>\s*Step \{stepIndex \+ 1\}\/\{steps\.length\}\s*<\/Badge>\s*<\/Flex>/;

content = content.replace(topRowRegex, `<Flex justify="space-between" align="center" gap={2} mb={{ base: -2, md: 0 }}>
              <IconButton
                aria-label="Go back"
                icon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
                borderRadius="full"
                onClick={handleBack}
                isDisabled={stepIndex === 0}
                display={stepIndex === 0 ? "none" : "flex"}
              />
              <Box display={{ base: "none", md: "block" }}>
                <Badge
                  bg="blue.50"
                  color="blue.600"
                  borderRadius="md"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="700"
                >
                  Step {stepIndex + 1}/{steps.length}
                </Badge>
              </Box>
            </Flex>`);

// 5. Hide Progress bar on mobile
content = content.replace(
  /<Progress value=\{progress\} bg="gray\.100" borderRadius="full" colorScheme="blue" h="6px" \/>/,
  `<Progress value={progress} bg="gray.100" borderRadius="full" colorScheme="blue" h="6px" display={{ base: "none", md: "block" }} />`
);

// 6. Simplify the Step Header Stack (remove icon on mobile, reduce spacing)
const headerStackRegex = /<Stack\s*direction=\{isSellerPhotosStep \? "column" : \{\s*base: "row",\s*sm: "row"\s*\}\}\s*spacing=\{\{ base: 3, md: 4 \}\}\s*align=\{isSellerPhotosStep \? "center" : "center"\}\s*justify=\{isSellerPhotosStep \? "center" : undefined\}\s*>\s*<Circle size=\{\{ base: "44px", md: "50px" \}\} bg="blue\.50" color="blue\.600">\s*<Icon as=\{activeStep\.icon as any\} boxSize=\{\{ base: 4, md: 5 \}\} \/>\s*<\/Circle>\s*<Box flex="1" minW=\{0\} textAlign=\{isSellerPhotosStep \? "center" : "left"\}>\s*<Heading fontSize=\{\{\s*base: "xl",\s*sm: "2xl",\s*md: "3xl"\s*\}\} color="gray\.900" lineHeight="1\.2">\s*\{activeStep\.title\}\s*<\/Heading>\s*<Text color="gray\.500" fontSize=\{\{\s*base: "xs",\s*md: "sm"\s*\}\} mt=\{1\}>\s*\{activeStep\.subtitle\}\s*<\/Text>\s*<\/Box>\s*<\/Stack>/;

content = content.replace(headerStackRegex, `<Stack
              direction={isSellerPhotosStep ? "column" : "row"}
              spacing={{ base: 0, md: 4 }}
              align={isSellerPhotosStep ? "center" : "center"}
              justify={isSellerPhotosStep ? "center" : undefined}
            >
              <Circle size={{ base: "0px", md: "50px" }} bg="blue.50" color="blue.600" display={{ base: "none", md: "flex" }}>
                <Icon as={activeStep.icon as any} boxSize={5} />
              </Circle>
              <Box flex="1" minW={0} textAlign={isSellerPhotosStep ? "center" : "left"}>
                <Heading fontSize={{ base: "lg", sm: "xl", md: "3xl" }} color="gray.900" lineHeight="1.2">
                  {activeStep.title}
                </Heading>
                <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={1}>
                  {activeStep.subtitle}
                </Text>
              </Box>
            </Stack>`);

// 7. Make the "Already have an account?" smaller and tighter
content = content.replace(
  /<Text textAlign="center" color="gray\.600">\s*Already have an account\?\{" "\}\s*<Button\s*type="button"\s*variant="link"\s*color="blue\.600"\s*isDisabled=\{isRouteTransitioning\}\s*onClick=\{.*\}>\s*Sign in\s*<\/Button>\s*<\/Text>/,
  `<Text textAlign="center" color="gray.600" fontSize={{ base: "sm", md: "md" }} mt={{ base: -2, md: 0 }}>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                color="blue.600"
                fontSize={{ base: "sm", md: "md" }}
                isDisabled={isRouteTransitioning}
                onClick={() => navigateWithAnimation("/login")}
              >
                Sign in
              </Button>
            </Text>`
);

fs.writeFileSync(path, content);
console.log("Super minimal applied successfully.");
