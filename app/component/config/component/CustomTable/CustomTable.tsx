'use client'
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useBreakpointValue,
  Tooltip,
  Flex,
  Heading,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import TableLoader from "./TableLoader";
import Pagination from "../pagination/Pagination";
const MultiDropdown = dynamic(() => import('../multiDropdown/MultiDropdown'), { ssr: false });
import { FaEdit, FaEye } from "react-icons/fa";
import { IoMdAdd, IoMdInformationCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FcClearFilters } from "react-icons/fc";
import { formatDate } from "../../utils/dateUtils";
const CustomDateRange = dynamic(() => import('../CustomDateRange/CustomDateRange'), { ssr: false });

interface Column {
  headerName?: string;
  key?: string;
  type?: string;
  function?: any;
  addkey?: any;
  props?: any;
  actions?: any;
  metaData?: {
    component?: any;
    function?: any;
  };
}

interface RowData {
  [key: string]: any;
}

interface CustomTableProps {
  title?: string;
  columns: Column[];
  data: RowData[];
  serial?: any;
  loading: boolean;
  totalPages?: number;
  actions?: any;
  cells?: boolean;
  tableProps?: any;
}

interface TableActionsProps {
  actions: any;
  column: any;
  row: any;
  cells: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
  actions,
  column,
  row,
  // cells,
}) => {
  if (!actions) {
    actions = {};
  }
  const { actionBtn } = actions;
  // const cellProps = cells ? { border: "1px groove gray" } : {};

  const iconColor = useColorModeValue("gray.700", "gray.200");
  const deleteColor = useColorModeValue("red.500", "red.300");

  return (
    <Td
      // position="sticky" right={0} bg="white" zIndex={9999}
      {...column?.props?.row}
      // {...cellProps}
      position={column?.props?.isSticky ? "sticky" : "relative"}
      right={column?.props?.isSticky ? "0" : undefined}
      p={1}
      zIndex={column?.props?.isSticky ? "5" : undefined}
      bgColor={column?.props?.isSticky ? "white" : undefined}
    >
      <Flex columnGap={0} justifyContent={"center"}>
        {actionBtn?.editKey?.showEditButton && (
          <IconButton
            size="lg"
            bgColor="transparent"
            color={iconColor}
            onClick={() => {
              if (actionBtn?.editKey?.function)
                actionBtn?.editKey.function(row);
            }}
            aria-label=""
            title={actionBtn?.editKey?.title || "Edit Data"}
          >
            <FaEdit />
          </IconButton>
        )}
        {actionBtn?.viewKey?.showViewButton && (
          <IconButton
            size="lg"
            bgColor="transparent"
            color={iconColor}
            onClick={() => {
              if (actionBtn?.viewKey?.function)
                actionBtn?.viewKey.function(row);
            }}
            aria-label=""
            title={actionBtn?.viewKey?.title || "View Data"}
          >
            <FaEye />
          </IconButton>
        )}
        {actionBtn?.deleteKey?.showDeleteButton && (
          <IconButton
            size="lg"
            bgColor="transparent"
            color={deleteColor}
            onClick={() => {
              if (actionBtn?.deleteKey?.function)
                actionBtn?.deleteKey.function(row);
            }}
            aria-label=""
            title={actionBtn?.deleteKey?.title || "Delete Data"}
          >
            <MdDelete />
          </IconButton>
        )}
      </Flex>
    </Td>
  );
};

const GenerateRows: React.FC<{
  column: Column;
  row: RowData;
  action: any;
  cells: boolean;
}> = ({ column, row, action, cells }: any) => {
  // Define cell border color based on color mode
  const cellBorder = useColorModeValue("gray.200", "gray.700");
  const cellProps = cells
    ? { border: `1px solid ${cellBorder}` } // Conditional border only if cells prop is true
    : {};

  switch (column.type) {
    case "date":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
        >
          {row[column.key] ? formatDate(row[column.key]) : "--"}
        </Td>
      );
    case "link":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          color="blue.400"
          textDecoration="underline"
          {...column?.props?.row}
          {...cellProps}
          onClick={() => {
            if (column?.function) {
              column?.function(row);
            }
          }}
        >
          {row[column.key] || "--"}
        </Td>
      );
    case "tooltip":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
        >
          <Tooltip label={row[column.key]}>
            {typeof row[column.key] === "string"
              ? row[column.key].substring(0, 15) || "--"
              : "-"}
          </Tooltip>
        </Td>
      );
    case "array":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
        >
          <Tooltip label={JSON.stringify(row[column.key])}>
            <IconButton
              aria-label="array info"
              size="lg"
              bgColor="transparent"
              color="gray.700"
            >
              <IoMdInformationCircle />
            </IconButton>
          </Tooltip>
        </Td>
      );
    case "table-actions":
      return (
        <TableActions
          actions={action}
          column={column}
          row={row}
          cells={cells}
        />
      );
    case "combineKey":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
          isTruncated={true}
        >
          {row[column.key] || "--"}
        </Td>
      );
    case "component":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
        >
          {column.metaData?.component ? column.metaData.component(row) : null}
        </Td>
      );
    default:
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...column?.props?.row}
          {...cellProps}
          isTruncated={true}
        >
          {row[column.key] || "--"}
        </Td>
      );
  }
};

const CustomTable: React.FC<CustomTableProps> = ({
  title,
  columns,
  data,
  serial,
  loading,
  actions,
  cells = false,
  tableProps = {},
  // isActions = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  // const cellProps = cells ? { border: "1px solid gray" } : {};
  const headerBg = useColorModeValue("gray.700", "gray.800");
  // const borderColor = useColorModeValue("gray.300", "gray.600");

  const bodyBg = useColorModeValue("white", "gray.700");

  const hoverBg = useColorModeValue("blue.100", "blue.700");
  const menuItemHover = useColorModeValue("blue.100", "blue.700");
  const menuListBg = useColorModeValue("white", "gray.700");
  const titleColor = useColorModeValue("blue.500", "white");

  const boxBorder = useColorModeValue("gray.200", "gray.700");
  const mainBox = useColorModeValue("white", "gray.900");

  return (
    <Box
      rounded={12}
      bg={mainBox}
      boxShadow="rgb(0 0 0 / 20%) 0px 0px 8px"
      border={"1px solid"}
      borderColor={boxBorder}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={title ? 3 : 0}
      >
        {title ? (
          <Heading color={titleColor} fontSize={isMobile ? "sm" : "xl"}>
            {title || ""}
          </Heading>
        ) : null}

        <Flex alignItems="center" columnGap={2} ml="auto">
          {!isMobile && actions?.search && actions?.search?.show && (
            <Input
              placeholder={actions?.search?.placeholder || "Search"}
              value={actions?.search?.searchValue}
              onChange={actions?.search?.onSearchChange}
              borderRadius="5rem"
              // bg="white"
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              maxW="25rem"
            />
          )}
          {actions?.datePicker?.show && actions?.datePicker?.date && (
            <Box display={isMobile ? "none" : undefined}>
              <CustomDateRange
                isMobile={actions?.datePicker?.isMobile}
                startDate={actions?.datePicker?.date.startDate}
                endDate={actions?.datePicker?.date.endDate}
                onStartDateChange={(e) => {
                  if (actions?.datePicker?.onDateChange) {
                    actions?.datePicker?.onDateChange(e, "startDate");
                  }
                }}
                onEndDateChange={(e) => {
                  if (actions?.datePicker?.onDateChange) {
                    actions?.datePicker?.onDateChange(e, "endDate");
                  }
                }}
              />
            </Box>
          )}
          {actions?.multidropdown?.show && (
            <Box display={isMobile ? "block" : undefined}>
              <MultiDropdown
                title={actions?.multidropdown?.title}
                dropdowns={actions?.multidropdown?.dropdowns || []}
                onDropdownChange={actions?.multidropdown?.onDropdownChange}
                selectedOptions={actions?.multidropdown?.selectedOptions}
                onApply={actions?.multidropdown?.onApply}
                search={{
                  visible: actions?.multidropdown?.search?.visible,
                  placeholder: actions?.multidropdown?.search?.placeholder,
                  searchValue: actions?.multidropdown?.search?.searchValue,
                  onSearchChange:
                    actions?.multidropdown?.search?.onSearchChange,
                }}
                actions={actions}
              />
            </Box>
          )}
          {actions?.resetData?.show && (
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="red"
                minW={{ base: "6rem", md: "10rem" }}
                textAlign={"center"}
              >
                Actions
              </MenuButton>
              <MenuList
                zIndex={15}
                bg={menuListBg}
                border="1px solid"
                // borderColor={useColorModeValue("gray.200", "gray.600")}
                boxShadow="md"
                minW={"10rem"}
                py={0}
              >
                {actions?.actionBtn?.addKey?.showAddButton && (
                  <MenuItem
                    onClick={() =>
                      actions?.actionBtn?.addKey?.function?.("add")
                    }
                    _hover={{ bg: hoverBg }}
                    icon={<IoMdAdd fontSize={"20px"} />}
                    p={"0.7rem"}
                  >
                    Add
                  </MenuItem>
                )}
                {actions?.resetData?.show && (
                  <MenuItem
                    onClick={actions?.resetData?.function}
                    icon={<FcClearFilters fontSize={"20px"} />}
                    _hover={{ bg: menuItemHover }}
                    p={"0.7rem"}
                  >
                    {actions?.resetData?.text || "Reset"}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      <Box
        overflow="auto"
        className="customScrollBar"
        minH={"65vh"}
        maxH={"65vh"}
        rounded={2}
        px={2}
        {...tableProps.tableBox}
      >
        <Table
          size={isMobile ? "xs" : "sm"}
          variant="striped"
          {...tableProps.table}
          bg={bodyBg}
          borderRadius="md"
          overflow="hidden"
        >
          <Thead
            bg={headerBg}
            position="sticky"
            top="0"
            zIndex="9"
            height="50px"
          >
            <Tr>
              {serial?.show && (
                <Th
                  color="white"
                  w={serial?.width || undefined}
                  border="none"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontSize="xs"
                >
                  {serial?.text || "S.No."}
                </Th>
              )}
              {columns.map((column, colIndex) => (
                <Th
                  key={colIndex}
                  textAlign="center"
                  position={column?.props?.isSticky ? "sticky" : "relative"}
                  right={column?.props?.isSticky ? "0" : undefined}
                  bg={headerBg}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color="white"
                  fontWeight="bold"
                  border="none" // No borders on header cells
                  {...column?.props?.column}
                >
                  {column.headerName}
                </Th>
              ))}
            </Tr>
          </Thead>

          <TableLoader loader={loading} show={data.length}>
            <Tbody >
              {data.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  _hover={{
                    bg: hoverBg,
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  {serial?.show && (
                    <Td
                      fontWeight="bold"
                      w={serial?.width || undefined}
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      border="none" // No border on cells
                    >
                      {rowIndex + 1}
                    </Td>
                  )}
                  {columns.map((column, colIndex) => (
                    <GenerateRows
                      key={colIndex}
                      column={column}
                      row={row}
                      action={actions}
                      cells={cells}
                      // border="none" // No border on cells
                    />
                  ))}
                </Tr>
              ))}
            </Tbody>
          </TableLoader>
        </Table>
      </Box>
      {actions?.pagination?.show && (
        <Pagination
          currentPage={actions?.pagination?.currentPage || 1}
          onPageChange={(e) => {
            if (actions?.pagination?.onClick) {
              actions?.pagination?.onClick(e);
            }
          }}
          totalPages={actions?.pagination?.totalPages || 1}
          props={{ style: { marginTop: "15px" } }}
        />
      )}
    </Box>
  );
};

export default CustomTable;
