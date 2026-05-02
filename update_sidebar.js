const fs = require('fs');

const filePath = 'c:\\Users\\uknow\\Desktop\\my-projects\\business sahayta\\frontend\\app\\layouts\\dashboardLayout\\SidebarLayout\\SidebarLayout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('useColorModeValue')) {
  content = content.replace('useColorMode,', 'useColorMode, useColorModeValue,');
}

// 1. In renderIcon
content = content.replace(
  `const iconColor = depth === 0 ? dashboardPalette.accent : dashboardPalette.textMuted;`,
  `const iconColor = depth === 0 ? (colorMode === "light" ? "var(--chakra-colors-blue-600)" : dashboardPalette.accent) : (colorMode === "light" ? "var(--chakra-colors-gray-500)" : dashboardPalette.textMuted);`
);

// We will use a regex to replace the colors globally inside the components but we have to be careful.
// A simpler way is to replace the dashboardPalette object with a proxy or redefining it locally in the components, 
// but it's imported at the top.
// Let's replace the imports and usages directly where appropriate or just write a script that does string replacements.

// Since the whole file is just React components, we can insert the useColorModeValue hooks at the beginning of each component.
content = content.replace(
  `const SidebarPopover = observer(({`,
  `const SidebarPopover = observer(({`
);

// Let's just use regular expressions to inject hooks.
const hookInject = `
  const { colorMode } = useColorMode();
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cHoverBg = useColorModeValue("gray.100", "rgba(255,255,255,0.03)");
  const cShell = useColorModeValue("white", dashboardPalette.shell);
`;

// Replace in SidebarPopover
content = content.replace(
  `const { colorMode } = useColorMode();`,
  hookInject
);
content = content.replace(/dashboardPalette\.accentSoft/g, 'cAccentSoft')
  .replace(/dashboardPalette\.accentStrong/g, 'cAccentStrong')
  .replace(/dashboardPalette\.accent/g, 'cAccent')
  .replace(/dashboardPalette\.textMuted/g, 'cTextMuted')
  .replace(/dashboardPalette\.text/g, 'cText')
  .replace(/dashboardPalette\.surfaceAlt/g, 'cSurfaceAlt')
  .replace(/dashboardPalette\.border/g, 'cBorder')
  .replace(/dashboardPalette\.surfaceSoft/g, 'cSurfaceSoft')
  .replace(/dashboardPalette\.shell/g, 'cShell')
  .replace(/"rgba\(255,255,255,0\.03\)"/g, 'cHoverBg');

// For SidebarAccordion and SidebarLayout, the hooks need to be injected inside their bodies as well.
// But we already replaced dashboardPalette globally! This means cAccentSoft etc will be referenced everywhere.
// So we must inject these constants into ALL three components: SidebarPopover, SidebarAccordion, SidebarLayout.

function injectHooks(componentName, contentStr) {
  const regex = new RegExp(\`const \${componentName} = .*?=> \\{\`);
  return contentStr.replace(regex, (match) => {
    return match + hookInject;
  });
}

// Rollback global replace first.
content = fs.readFileSync(filePath, 'utf8');
if (!content.includes('useColorModeValue')) {
  content = content.replace('useColorMode,', 'useColorMode, useColorModeValue,');
}

content = content.replace(
  `const iconColor = depth === 0 ? dashboardPalette.accent : dashboardPalette.textMuted;`,
  `const iconColor = depth === 0 ? (colorMode === "light" ? "var(--chakra-colors-blue-600)" : dashboardPalette.accent) : (colorMode === "light" ? "var(--chakra-colors-gray-500)" : dashboardPalette.textMuted);`
);

content = content.replace(
  `const { colorMode } = useColorMode();`,
  `// colorMode handled`
);

content = injectHooks('SidebarPopover', content);
content = injectHooks('SidebarAccordion', content);
content = injectHooks('SidebarLayout: React.FC<SidebarProps>', content);

content = content.replace(/dashboardPalette\.accentSoft/g, 'cAccentSoft')
  .replace(/dashboardPalette\.accentStrong/g, 'cAccentStrong')
  .replace(/dashboardPalette\.accent/g, 'cAccent')
  .replace(/dashboardPalette\.textMuted/g, 'cTextMuted')
  .replace(/dashboardPalette\.text/g, 'cText')
  .replace(/dashboardPalette\.surfaceAlt/g, 'cSurfaceAlt')
  .replace(/dashboardPalette\.border/g, 'cBorder')
  .replace(/dashboardPalette\.surfaceSoft/g, 'cSurfaceSoft')
  .replace(/dashboardPalette\.shell/g, 'cShell')
  .replace(/"rgba\\(255,255,255,0\.03\\)"/g, 'cHoverBg')
  .replace(/'rgba\\(255,255,255,0\.03\\)'/g, 'cHoverBg');

fs.writeFileSync(filePath, content);
console.log("Updated SidebarLayout.tsx successfully.");
