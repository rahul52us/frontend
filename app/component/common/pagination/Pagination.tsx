import ReactPaginate from "react-paginate";
import { Box, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange:any;
  props?: any;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  props,
}: PaginationProps) => {
  const { colorMode } = useColorMode();

  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return totalPages ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb={2}
      {...props}
    >
      <Flex alignItems="center" gridColumnGap="5px">
        <IconButton
          aria-label="First page"
          icon={<MdFirstPage />}
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          color={colorMode === "light" ? "gray.700" : "whiteAlpha.700"}
          _disabled={{ color: colorMode === "light" ? "gray.700" : "whiteAlpha.700" }}
        />
        <ReactPaginate
          previousLabel={<MdNavigateBefore />}
          nextLabel={<MdNavigateNext />}
          breakLabel="..."
          pageCount={totalPages}
          forcePage={currentPage - 1}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          previousLinkClassName={`paginationLink ${currentPage === 1 ? 'paginationDisabled' : ''}`}
          nextLinkClassName={`paginationLink ${currentPage === totalPages ? 'paginationDisabled' : ''}`}
          disabledClassName="paginationDisabled"
          activeClassName="paginationActive"
          pageClassName="paginationItem"
          pageLinkClassName="paginationLink"
          pageRangeDisplayed={5} // Show 5 pages at a time
          marginPagesDisplayed={1}
        />
        <IconButton
          aria-label="Last page"
          icon={<MdLastPage />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          color={colorMode === "light" ? "gray.700" : "whiteAlpha.700"}
          _disabled={{ color: colorMode === "light" ? "gray.700" : "whiteAlpha.700" }}
        />
      </Flex>
    </Box>
  ) : null;
};

export default Pagination;
