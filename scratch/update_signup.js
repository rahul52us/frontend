const fs = require('fs');
const filePath = 'c:/Users/uknow/Desktop/my-projects/business sahayta/frontend/app/(authentication)/signUp/components/SignUpComponent.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Colors
content = content.replace(/colorScheme=\"teal\"/g, 'colorScheme=\"blue\"');
content = content.replace(/teal\.50/g, 'blue.50');
content = content.replace(/teal\.100/g, 'blue.100');
content = content.replace(/teal\.200/g, 'blue.200');
content = content.replace(/teal\.400/g, 'blue.400');
content = content.replace(/teal\.500/g, 'blue.500');
content = content.replace(/teal\.600/g, 'blue.600');
content = content.replace(/accentColor=\"teal\"/g, 'accentColor=\"blue\"');
content = content.replace(/\"green\" \: \"teal\"/g, '\"green\" \: \"blue\"');

// Update MotionBox and Container for mobile styling
content = content.replace(
  /bgGradient=\"linear\\(to-b, #f8fafc 0%, #ffffff 45%, #f0fdfa 100%\\)\"/g,
  'bgGradient={{ base: \"none\", md: \"linear(to-b, #f8fafc 0%, #ffffff 45%, #eff6ff 100%)\" }}\n      bg={{ base: \"white\", md: \"transparent\" }}'
);

content = content.replace(
  /pt=\{\{ base: \"calc\\(env\\(safe-area-inset-top, 0px\\) \\+ 18px\\)\", md: 6 \}\}/g,
  'pt={{ base: \"calc(env(safe-area-inset-top, 0px) + 16px)\", md: 6 }}'
);

content = content.replace(
  /pb=\{\{ base: \"calc\\(env\\(safe-area-inset-bottom, 0px\\) \\+ 24px\\)\", md: 6 \}\}/g,
  'pb={{ base: \"calc(env(safe-area-inset-bottom, 0px) + 16px)\", md: 6 }}'
);

content = content.replace(
  /minH=\{\{ base: \"calc\\(100vh - env\\(safe-area-inset-top, 0px\\) - env\\(safe-area-inset-bottom, 0px\\) - 42px\\)\", md: \"calc\\(100vh - 48px\\)\" \}\}/g,
  'minH={{ base: \"100vh\", md: \"calc(100vh - 48px)\" }}\n        pt={{ base: \"10px\", md: 0 }}'
);

content = content.replace(
  /alignItems=\"center\"/g,
  'alignItems={{ base: \"flex-start\", md: \"center\" }}'
);

content = content.replace(
  /borderRadius=\{\{ base: \"3xl\", md: \"3xl\" \}\}/g,
  ''
);

content = content.replace(
  /px=\{\{ base: 5, md: 8, xl: 9 \}\}/g,
  'px={{ base: 2, md: 8, xl: 9 }}'
);

content = content.replace(
  /py=\{\{ base: 6, md: 8, xl: 9 \}\}/g,
  'py={{ base: 4, md: 8, xl: 9 }}'
);

fs.writeFileSync(filePath, content);
console.log("Done");
