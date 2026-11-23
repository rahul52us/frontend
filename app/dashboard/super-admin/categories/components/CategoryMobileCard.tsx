import React from "react";
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FiEdit2, FiEye, FiLayers, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";

export const categoryColorPalette = [
  {
    border: "#3B82F6",
    bgSoft: "rgba(59, 130, 246, 0.08)",
    borderStrong: "rgba(59, 130, 246, 0.28)",
    accent: "#3B82F6",
    fallbackGrad: "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.20))",
  },
  {
    border: "#10B981",
    bgSoft: "rgba(16, 185, 129, 0.08)",
    borderStrong: "rgba(16, 185, 129, 0.28)",
    accent: "#10B981",
    fallbackGrad: "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(20, 184, 166, 0.20))",
  },
  {
    border: "#8B5CF6",
    bgSoft: "rgba(139, 92, 246, 0.08)",
    borderStrong: "rgba(139, 92, 246, 0.28)",
    accent: "#8B5CF6",
    fallbackGrad: "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.20))",
  },
  {
    border: "#F59E0B",
    bgSoft: "rgba(245, 158, 11, 0.08)",
    borderStrong: "rgba(245, 158, 11, 0.28)",
    accent: "#F59E0B",
    fallbackGrad: "linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(249, 115, 22, 0.20))",
  },
  {
    border: "#EC4899",
    bgSoft: "rgba(236, 72, 153, 0.08)",
    borderStrong: "rgba(236, 72, 153, 0.28)",
    accent: "#EC4899",
    fallbackGrad: "linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(244, 63, 94, 0.20))",
  },
  {
    border: "#06B6D4",
    bgSoft: "rgba(6, 182, 212, 0.08)",
    borderStrong: "rgba(6, 182, 212, 0.28)",
    accent: "#06B6D4",
    fallbackGrad: "linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 165, 233, 0.20))",
  },
  {
    border: "#F97316",
    bgSoft: "rgba(249, 115, 22, 0.08)",
    borderStrong: "rgba(249, 115, 22, 0.28)",
    accent: "#F97316",
    fallbackGrad: "linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 88, 12, 0.20))",
  },
  {
    border: "#14B8A6",
    bgSoft: "rgba(20, 184, 166, 0.08)",
    borderStrong: "rgba(20, 184, 166, 0.28)",
    accent: "#14B8A6",
    fallbackGrad: "linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.20))",
  },
  {
    border: "#6366F1",
    bgSoft: "rgba(99, 102, 241, 0.08)",
    borderStrong: "rgba(99, 102, 241, 0.28)",
    accent: "#6366F1",
    fallbackGrad: "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.20))",
  },
  {
    border: "#E11D48",
    bgSoft: "rgba(225, 29, 72, 0.08)",
    borderStrong: "rgba(225, 29, 72, 0.28)",
    accent: "#E11D48",
    fallbackGrad: "linear-gradient(135deg, rgba(225, 29, 72, 0.25), rgba(244, 63, 94, 0.20))",
  },
];

export const getCategoryColor = (indexOrId: number | string) => {
  if (typeof indexOrId === "number") {
    return categoryColorPalette[indexOrId % categoryColorPalette.length];
  }
  let hash = 0;
  const str = String(indexOrId || "");
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return categoryColorPalette[Math.abs(hash) % categoryColorPalette.length];
};

export interface CategoryMobileCardProps {
  category: any;
  index?: number;
  onView?: (category: any) => void;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
}

export const CategoryMobileCard: React.FC<CategoryMobileCardProps> = ({
  category,
  index = 0,
  onView,
  onEdit,
  onDelete,
}) => {
  const filterCount = (category.filterConfig || []).filter(
    (item: any) => item.isActive !== false,
  ).length;
  const parentName = category.parent?.name ?? "Root";
  const colorTheme = getCategoryColor(index ?? category._id);

  return (
    <Box
      bg="var(--merchant-surface-alt)"
      border="1.5px solid"
      borderColor={colorTheme.borderStrong}
      borderRadius="16px"
      overflow="hidden"
      position="relative"
      transition="all 0.2s ease"
      boxShadow={`0 2px 10px ${colorTheme.bgSoft}`}
      _hover={{
        borderColor: colorTheme.border,
        boxShadow: `0 4px 16px ${colorTheme.bgSoft}`,
        transform: "translateY(-2px)",
      }}
    >
      {/* Top Color Accent Line */}
      <Box h="3px" w="100%" bg={colorTheme.accent} />

      {/* Photo (top half) */}
      <Box position="relative" w="100%" aspectRatio={4 / 3}>
        {category.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Flex
            w="100%"
            h="100%"
            align="center"
            justify="center"
            bg={colorTheme.fallbackGrad}
          >
            <Icon as={FiLayers} boxSize={8} color={colorTheme.accent} />
          </Flex>
        )}

        <Menu isLazy strategy="fixed" placement="bottom-end">
          <MenuButton
            as={IconButton}
            aria-label="Category actions"
            icon={<HiDotsVertical />}
            size="xs"
            position="absolute"
            top={2}
            right={2}
            borderRadius="full"
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: "blackAlpha.700" }}
            _active={{ bg: "blackAlpha.800" }}
          />
          <MenuList minW="140px" zIndex={20}>
            {onView && (
              <MenuItem icon={<FiEye />} onClick={() => onView(category)}>
                View
              </MenuItem>
            )}
            <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(category)}>
              Edit
            </MenuItem>
            <MenuItem
              icon={<FiTrash2 />}
              color="red.500"
              onClick={() => onDelete(category)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {/* Details (bottom half) */}
      <Box p={3} bg={colorTheme.bgSoft}>
        <Text
          fontSize="sm"
          fontWeight="700"
          color="var(--merchant-text)"
          noOfLines={1}
        >
          {category.name}
        </Text>
        <Text
          mt={0.5}
          fontSize="xs"
          color="var(--merchant-text-muted)"
          noOfLines={1}
        >
          {parentName}
        </Text>

        <Flex mt={2} align="center" justify="space-between" gap={2}>
          <HStack spacing={1.5} minW={0}>
            <Box
              w="7px"
              h="7px"
              flexShrink={0}
              borderRadius="full"
              bg={category.isActive ? "green.400" : "red.400"}
            />
            <Text
              fontSize="xs"
              fontWeight="600"
              color={category.isActive ? "green.500" : "red.500"}
              noOfLines={1}
            >
              {category.isActive ? "Active" : "Inactive"}
            </Text>
          </HStack>
          <Text fontSize="xs" color="var(--merchant-text-muted)" flexShrink={0}>
            {filterCount} {filterCount === 1 ? "filter" : "filters"}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default CategoryMobileCard;

