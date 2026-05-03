const fs = require('fs');
const path = 'c:/Users/uknow/Desktop/my-projects/business sahayta/frontend/app/(authentication)/signUp/components/SignUpComponent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Refine UploadCard for extreme minimalism
const uploadCardRegex = /const UploadCard = \(\{[\s\S]*?accentColor,[\s\S]*?\}\) => \{[\s\S]*?return \([\s\S]*?<Box[\s\S]*?\{\.\.\.fieldCardStyles\}[\s\S]*?>[\s\S]*?<VStack align="stretch" spacing=\{4\}>[\s\S]*?<Stack[\s\S]*?direction=\{\{ base: "column", sm: "row" \}\}[\s\S]*?spacing=\{3\}[\s\S]*?>[\s\S]*?<HStack align="flex-start" spacing=\{4\}>[\s\S]*?<Circle size="46px"[\s\S]*?>[\s\S]*?<Icon as=\{icon\} boxSize=\{5\} \/>[\s\S]*?<\/Circle>[\s\S]*?<Box>[\s\S]*?<Text fontSize="md" fontWeight="700" color="gray\.900">[\s\S]*?\{title\}[\s\S]*?<\/Text>[\s\S]*?<Text fontSize="sm" color="gray\.500">[\s\S]*?\{helper\}[\s\S]*?<\/Text>[\s\S]*?<\/Box>[\s\S]*?<\/HStack>[\s\S]*?<Badge[\s\S]*?>[\s\S]*?\{hasFiles \? "Added" : badgeText\}[\s\S]*?<\/Badge>[\s\S]*?<\/Stack>[\s\S]*?\{hasFiles \? \([\s\S]*?\) : \([\s\S]*?py=\{8\}[\s\S]*?px=\{6\}[\s\S]*?[\s\S]*?<VStack spacing=\{3\}>[\s\S]*?<Circle size="50px"[\s\S]*?>[\s\S]*?<Icon as=\{icon\} boxSize=\{5\} \/>[\s\S]*?<\/Circle>[\s\S]*?<Box>[\s\S]*?<Text fontSize="sm" fontWeight="700" color="gray\.800">[\s\S]*?Upload an image[\s\S]*?<\/Text>[\s\S]*?<Text mt=\{1\} fontSize="sm" color="gray\.500">[\s\S]*?\{formatHint\}[\s\S]*?<\/Text>[\s\S]*?<\/Box>[\s\S]*?<\/VStack>[\s\S]*?<\/Box>[\s\S]*?\)\}[\s\S]*?<Stack direction=\{\{ base: "column", sm: "row" \}\} spacing=\{3\}>[\s\S]*?<Button colorScheme="blue" variant=\{hasFiles \? "outline" : "solid"\} borderRadius="full" onClick=\{openPicker\}>[\s\S]*?\{hasFiles \? "Replace image" : "Choose image"\}[\s\S]*?<\/Button>[\s\S]*?\{hasFiles \? \([\s\S]*?\) : null\}[\s\S]*?<\/Stack>[\s\S]*?<\/VStack>[\s\S]*?<\/Box>[\s\S]*?\);[\s\S]*?\};/;

content = content.replace(uploadCardRegex, `const UploadCard = ({
  title,
  helper,
  files,
  onFileChange,
  onRemove,
  icon,
  badgeText,
  formatHint,
  accentColor,
}: {
  title: string;
  helper: string;
  files: any;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  icon: any;
  badgeText: string;
  formatHint: string;
  accentColor: "teal" | "blue";
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasFiles = Boolean(files && ((Array.isArray(files) && files.length) || !Array.isArray(files)));
  const openPicker = () => inputRef.current?.click();
  const accentScheme = accentColor === "blue" ? "blue" : "teal";

  return (
    <Box
      {...fieldCardStyles}
      borderColor={hasFiles ? \`\${accentColor}.200\` : fieldCardStyles.borderColor}
      bg={hasFiles ? "white" : \`\${accentColor}.50\`}
      p={{ base: 3, md: 5 }}
    >
      <VStack align="stretch" spacing={{ base: 2, md: 4 }}>
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          spacing={2}
        >
          <HStack align="center" spacing={3}>
            <Circle size={{ base: "32px", md: "46px" }} bg="white" color={\`\${accentColor}.600\`} boxShadow="sm" flexShrink={0}>
              <Icon as={icon} boxSize={{ base: 3.5, md: 5 }} />
            </Circle>
            <Box>
              <Text fontSize={{ base: "xs", md: "md" }} fontWeight="700" color="gray.900">
                {title}
              </Text>
              <Text fontSize="xs" color="gray.500" display={{ base: "none", md: "block" }}>
                {helper}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme={hasFiles ? "green" : accentScheme} borderRadius="full" px={{ base: 2, md: 3 }} py={0.5} fontSize={{ base: "9px", md: "xs" }}>
            {hasFiles ? "Added" : badgeText}
          </Badge>
        </Stack>

        {hasFiles ? (
          <Box borderWidth="1px" borderColor={\`\${accentColor}.100\`} borderRadius="xl" bg="white" px={3} py={1}>
            <ShowFileUploadFile files={files} removeFile={onRemove} edit={false} />
          </Box>
        ) : (
          <Box
            role="button"
            tabIndex={0}
            borderWidth="1px"
            borderStyle="dashed"
            borderColor={\`\${accentColor}.200\`}
            borderRadius="xl"
            py={{ base: 3, md: 8 }}
            px={{ base: 3, md: 6 }}
            textAlign="center"
            bg="white"
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ borderColor: \`\${accentColor}.400\`, bg: \`\${accentColor}.50\` }}
            _focusVisible={{ outline: "none", boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.22)" }}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
          >
            <VStack spacing={1}>
              <Icon as={icon} boxSize={{ base: 4, md: 5 }} color={\`\${accentColor}.600\`} />
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="700" color="gray.800">
                Upload image
              </Text>
            </VStack>
          </Box>
        )}

        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          display="none"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            onFileChange(file);
            event.target.value = "";
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button size="xs" colorScheme="blue" variant={hasFiles ? "outline" : "solid"} borderRadius="full" onClick={openPicker} flex={1} h="32px">
            {hasFiles ? "Replace" : "Choose"}
          </Button>
          {hasFiles ? (
            <Button size="xs" variant="ghost" colorScheme="red" borderRadius="full" onClick={onRemove} h="32px">
              Remove
            </Button>
          ) : null}
        </Stack>
      </VStack>
    </Box>
  );
};`);

// 2. Shrink GoogleMap on mobile
content = content.replace(
  /h=\{\{ base: "260px", md: "320px" \}\}/,
  'h={{ base: "180px", md: "320px" }}'
);

// 3. Shrink FormLabel on mobile
content = content.replace(
  /<FormLabel color="gray\.700" fontWeight="600">/g,
  '<FormLabel color="gray.700" fontWeight="600" fontSize={{ base: "xs", md: "sm" }} mb={1}>'
);

// 4. Shrink footer "Already have an account?"
content = content.replace(
  /<Text textAlign="center" color="gray\.600">[\s\S]*?Already have an account\?\{" "\}[\s\S]*?<Button[\s\S]*?variant="link"[\s\S]*?color="blue\.600"[\s\S]*?>[\s\S]*?Sign in[\s\S]*?<\/Button>[\s\S]*?<\/Text>/,
  `<Text textAlign="center" color="gray.600" fontSize={{ base: "xs", md: "sm" }} mt={{ base: -2, md: 0 }}>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                color="blue.600"
                fontSize={{ base: "xs", md: "sm" }}
                isDisabled={isRouteTransitioning}
                onClick={() => navigateWithAnimation("/login")}
              >
                Sign in
              </Button>
            </Text>`
);

// 5. Shrink Gallery section
content = content.replace(
  /<Box \{\.\.\.fieldCardStyles\} borderColor="blue\.100">/,
  '<Box {...fieldCardStyles} borderColor="blue.100" p={{ base: 3, md: 5 }}>'
);

content = content.replace(
  /direction=\{\{ base: "column", md: "row" \}\}\s*justify="space-between"\s*align=\{\{ base: "flex-start", md: "center" \}\}\s*spacing=\{3\}/,
  'direction="row" justify="space-between" align="center" spacing={2}'
);

content = content.replace(
  /<Button colorScheme="blue" borderRadius="full" onClick=\{.*\}>\s*\{sellerData\.gallery\.length \? "Add more photos" : "Choose photos"\}\s*<\/Button>/,
  '<Button size="xs" colorScheme="blue" borderRadius="full" onClick={() => galleryInputRef.current?.click()} h="32px">\n                {sellerData.gallery.length ? "Add more" : "Choose"}\n              </Button>'
);

// 6. Final container pt refinement
content = content.replace(
  /pt=\{\{ base: "calc\(env\(safe-area-inset-top, 0px\) \+ 8px\)", md: 6 \}\}/,
  'pt={{ base: "calc(env(safe-area-inset-top, 0px) + 4px)", md: 6 }}'
);

fs.writeFileSync(path, content);
console.log("Ultimate minimal UI applied.");
