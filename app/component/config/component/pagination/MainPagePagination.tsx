import { Button, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange:any;
  placement?: string;
  size?: string;
  loading?:any
}

export default function MainPagePagination({
  totalPages,
  currentPage,
  onPageChange,
  placement = "center",
  size = "md",
  loading
}: PaginationProps) {
  const MotionButton = motion(Button);

  // Helper function to calculate the range of visible pages
  const getVisiblePages = (totalPages: number, currentPage: number) => {
    const maxVisiblePages = 4; // Number of pages to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage >= totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages(totalPages, currentPage);

  return totalPages > 0 ? (
    <Flex justifyContent={placement} mt={2} gap={2}>
      <MotionButton
        variant="solid"
        colorScheme="teal"
        shadow="md"
        size={size}
        p={0}
        onClick={() => onPageChange({ selected: Math.max(1, currentPage - 1) })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        borderRadius="full"
        mr={2}
        disabled={currentPage === 1}
        isLoading={loading}
      >
        <MdNavigateBefore fontSize="20px" />
      </MotionButton>
      {visiblePages.map((page) => (
        <MotionButton
          key={page}
          variant="solid"
          colorScheme={page === currentPage ? "teal" : "gray"}
          size={size}
          shadow="inset rgb(0 0 0 / 15%) 0px 0px 8px"
          onClick={() => onPageChange({ selected: page })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          borderRadius="full"
        >
          {page}
        </MotionButton>
      ))}
      <MotionButton
        variant="solid"
        colorScheme="teal"
        size={size}
        p={0}
        shadow="md"
        onClick={() =>
          onPageChange({ selected: Math.min(totalPages, currentPage + 1) })
        }
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        borderRadius="full"
        ml={2}
        disabled={currentPage === totalPages}
        isLoading={loading}
      >
        <MdNavigateNext fontSize="20px" />
      </MotionButton>
    </Flex>
  ) : null;
}
