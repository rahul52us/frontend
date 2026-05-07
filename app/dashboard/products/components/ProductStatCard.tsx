import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";
// import { TrendingUp, TrendingDown } from "lucide-react"; // or your icon lib

const dashboardPalette = {
  surface: "#111827",
  border: "#1F2937",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
};

const toneConfig = {
  sage: {
    accent: "linear-gradient(90deg, #2dd4bf, #34d399)",
    iconBgLight: "rgba(45,212,191,0.12)",
    iconBgDark: "rgba(45,212,191,0.16)",
    iconColorLight: "#0d9488",
    iconColorDark: "#2dd4bf",
    dotLight: "#2dd4bf",
    dotDark: "#2dd4bf",
  },
  green: {
    accent: "linear-gradient(90deg, #4ade80, #86efac)",
    iconBgLight: "rgba(74,222,128,0.12)",
    iconBgDark: "rgba(74,222,128,0.16)",
    iconColorLight: "#16a34a",
    iconColorDark: "#4ade80",
    dotLight: "#4ade80",
    dotDark: "#4ade80",
  },
  rose: {
    accent: "linear-gradient(90deg, #fb7185, #f43f5e)",
    iconBgLight: "rgba(244,63,94,0.10)",
    iconBgDark: "rgba(244,63,94,0.16)",
    iconColorLight: "#e11d48",
    iconColorDark: "#fb7185",
    dotLight: "#fb7185",
    dotDark: "#fb7185",
  },
  warning: {
    accent: "linear-gradient(90deg, #fb923c, #fbbf24)",
    iconBgLight: "rgba(251,146,60,0.12)",
    iconBgDark: "rgba(251,146,60,0.16)",
    iconColorLight: "#ea580c",
    iconColorDark: "#fb923c",
    dotLight: "#fb923c",
    dotDark: "#fb923c",
  },
} as const;

type Tint = keyof typeof toneConfig;

interface ProductStatCardProps {
  icon: IconType;
  label: string;
  value: number;
  tint: Tint;
}

export function ProductStatCard({
  icon,
  label,
  value,
  tint,
}: ProductStatCardProps) {
  const tone = toneConfig[tint];

  const surface = useColorModeValue("white", dashboardPalette.surface);
  const text    = useColorModeValue("#0F172A", dashboardPalette.text);
  const muted   = useColorModeValue("#64748B", dashboardPalette.textMuted);

  const iconBg    = useColorModeValue(tone.iconBgLight,    tone.iconBgDark);
  const iconColor = useColorModeValue(tone.iconColorLight, tone.iconColorDark);
  const dot       = useColorModeValue(tone.dotLight,       tone.dotDark);

  const formattedValue = value.toLocaleString();

  return (
  <Box
    position="relative"
    borderRadius="16px"
    overflow="hidden"
    bg={surface}
    shadow={'base'}
    borderWidth="2px"
    borderColor={iconBg}
    transition="all 0.22s ease"
    minH={{ base: "60px", md: "100px" }}
  >
    <Flex
      align="center"
      justify="space-between"
      px={{ base: 4, md: 4 }}
      py={{ base: 3, md: 4 }}
      h="100%"
    >
      {/* Left Content */}
      <Box flex="1">
        {/* Number */}
        <Text
          fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
          fontSize={{ base: "18px", md: "28px" }}
          fontWeight="700"
          color={text}
          lineHeight="1"
          letterSpacing="-0.02em"
        >
          {formattedValue}
        </Text>

        {/* Label */}
        <Flex align="center" mt={{ base: "4px", md: "6px" }}>
          <Box
            as="span"
            display="inline-block"
            boxSize={{ base: "5px", md: "6px" }}
            borderRadius="full"
            bg={dot}
            mr="5px"
            flexShrink={0}
          />

          <Text
            fontSize={{ base: "10px", md: "11.5px" }}
            color={muted}
            fontWeight="500"
            lineHeight="1.3"
            noOfLines={1}
          >
            {label}
          </Text>
        </Flex>
      </Box>

      {/* Right Icon */}
      <Flex
        align="center"
        justify="center"
        boxSize={{ base: "34px", md: "44px" }}
        borderRadius={{ base: "10px", md: "12px" }}
        bg={iconBg}
        color={iconColor}
        flexShrink={0}
        ml={3}
      >
        <Icon
          as={icon}
          boxSize={{ base: "15px", md: "20px" }}
        />
      </Flex>
    </Flex>
  </Box>
);
}