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
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

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
  onRowClick?: (row: RowData) => void;
  variant?: "default" | "merchant";
}

interface TableActionsProps {
  actions: any;
  column: any;
  row: any;
  cells: boolean;
  variant?: "default" | "merchant";
}

const getColumnTextAlign = (column: any) =>
  column?.props?.row?.textAlign ||
  column?.props?.column?.textAlign ||
  (column?.type === "table-actions" ? "center" : "left");

const getSharedCellLayoutProps = (column: any) => ({
  textAlign: getColumnTextAlign(column),
  verticalAlign: "middle" as const,
  px: 4,
  py: 3,
});

const TableActions: React.FC<TableActionsProps> = ({
  actions,
  column,
  row,
  variant = "default",
  // cells,
}) => {
  if (!actions) {
    actions = {};
  }
  const { actionBtn } = actions;
  const isMerchant = variant === "merchant";
  // const cellProps = cells ? { border: "1px groove gray" } : {};

  const iconColor = isMerchant
    ? dashboardPalette.textMuted
    : useColorModeValue("gray.700", "gray.200");
  const deleteColor = isMerchant
    ? dashboardPalette.danger
    : useColorModeValue("red.500", "red.300");

  return (
    <Td
      // position="sticky" right={0} bg="white" zIndex={9999}
      {...column?.props?.row}
      // {...cellProps}
      position={column?.props?.isSticky ? "sticky" : "relative"}
      right={column?.props?.isSticky ? "0" : undefined}
      {...getSharedCellLayoutProps(column)}
      zIndex={column?.props?.isSticky ? "5" : undefined}
      bgColor={
        column?.props?.isSticky
          ? isMerchant
            ? dashboardPalette.surface
            : "white"
          : undefined
      }
    >
      <Flex columnGap={0} justifyContent={"center"}>
        {actionBtn?.editKey?.showEditButton && (
          <IconButton
            size="lg"
            bgColor="transparent"
            color={iconColor}
            _hover={
              isMerchant
                ? { bg: dashboardPalette.surfaceSoft, color: dashboardPalette.text }
                : undefined
            }
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
            _hover={
              isMerchant
                ? { bg: dashboardPalette.surfaceSoft, color: dashboardPalette.text }
                : undefined
            }
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
            _hover={
              isMerchant
                ? { bg: "rgba(239, 107, 107, 0.12)" }
                : undefined
            }
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
  variant?: "default" | "merchant";
}> = ({ column, row, action, cells, variant }: any) => {
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
          {...getSharedCellLayoutProps(column)}
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
          {...getSharedCellLayoutProps(column)}
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
          {...getSharedCellLayoutProps(column)}
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
          {...getSharedCellLayoutProps(column)}
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
          variant={variant}
        />
      );
    case "combineKey":
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...getSharedCellLayoutProps(column)}
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
          {...getSharedCellLayoutProps(column)}
          {...column?.props?.row}
          {...cellProps}
        >
          {column.metaData?.component ? column.metaData.component(row) : null}
        </Td>
      );
    default:
      const cellValue = row[column.key];
      return (
        <Td
          whiteSpace="normal"
          cursor="pointer"
          fontSize="sm"
          {...getSharedCellLayoutProps(column)}
          {...column?.props?.row}
          {...cellProps}
          isTruncated={true}
        >
          {React.isValidElement(cellValue)
            ? cellValue
            : (typeof cellValue === 'object' && cellValue !== null)
              ? JSON.stringify(cellValue)
              : (cellValue || "--")}
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
  onRowClick,
  variant = "default",
  // isActions = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isMerchant = variant === "merchant";
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
  const activeHeaderBg = isMerchant ? dashboardPalette.surfaceAlt : headerBg;
  const activeBodyBg = isMerchant ? dashboardPalette.surface : bodyBg;
  const activeHoverBg = isMerchant ? "rgba(214, 183, 114, 0.10)" : hoverBg;
  const activeMenuItemHover = isMerchant ? dashboardPalette.surfaceSoft : menuItemHover;
  const activeMenuListBg = isMerchant ? dashboardPalette.surface : menuListBg;
  const activeTitleColor = isMerchant ? dashboardPalette.text : titleColor;
  const activeBoxBorder = isMerchant ? dashboardPalette.border : boxBorder;
  const activeMainBox = isMerchant ? dashboardPalette.shell : mainBox;
  const inputBorderColor = isMerchant ? dashboardPalette.borderStrong : "gray.300";
  const inputFocusStyles = isMerchant
    ? {
        borderColor: dashboardPalette.accent,
        boxShadow: `0 0 0 1px ${dashboardPalette.accent}`,
      }
    : { borderColor: "blue.500", boxShadow: "outline" };

  return (
    <Box
      rounded={12}
      bg={activeMainBox}
      boxShadow={isMerchant ? "0 28px 60px rgba(0, 0, 0, 0.24)" : "rgb(0 0 0 / 20%) 0px 0px 8px"}
      border={"1px solid"}
      borderColor={activeBoxBorder}
      sx={
        isMerchant
          ? {
              "& .pagination": {
                gap: "6px",
              },
              "& .pagination a": {
                color: dashboardPalette.textMuted,
                borderRadius: "12px",
                minWidth: "38px",
                minHeight: "38px",
                padding: "6px 12px",
                transition: "all 0.2s ease",
              },
              "& .pagination a:hover": {
                color: dashboardPalette.accentStrong,
                background: "rgba(214, 183, 114, 0.08)",
              },
              "& .paginationActive a": {
                color: `${dashboardPalette.accentStrong} !important`,
                background: "rgba(214, 183, 114, 0.12)",
                border: `1px solid ${dashboardPalette.border}`,
              },
              "& .paginationDisabled": {
                color: `${dashboardPalette.textSoft} !important`,
              },
              "& .custom-table-pagination .chakra-icon-button": {
                bg: dashboardPalette.surfaceAlt,
                color: dashboardPalette.textMuted,
                border: "1px solid",
                borderColor: dashboardPalette.borderStrong,
              },
              "& .custom-table-pagination .chakra-icon-button:hover": {
                bg: dashboardPalette.surfaceSoft,
                color: dashboardPalette.text,
              },
              "& .custom-table-pagination .chakra-icon-button[disabled]": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
            }
          : undefined
      }
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={title ? 3 : 0}
        borderBottom={isMerchant && title ? "1px solid" : undefined}
        borderColor={isMerchant ? dashboardPalette.border : undefined}
        gap={3}
        flexWrap="wrap"
      >
        {title ? (
          <Heading color={activeTitleColor} fontSize={isMobile ? "sm" : "xl"} fontWeight={isMerchant ? "600" : undefined}>
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
              bg={isMerchant ? dashboardPalette.surfaceAlt : undefined}
              color={isMerchant ? dashboardPalette.text : undefined}
              borderColor={inputBorderColor}
              _placeholder={isMerchant ? { color: dashboardPalette.textSoft } : undefined}
              _hover={isMerchant ? { borderColor: dashboardPalette.accent } : undefined}
              _focus={inputFocusStyles}
              maxW="25rem"
            />
          )}
          {actions?.datePicker?.show && actions?.datePicker?.date && (
            <Box display={isMobile ? "none" : undefined}>
              <CustomDateRange
                isMobile={actions?.datePicker?.isMobile}
                startDate={actions?.datePicker?.date.startDate}
                endDate={actions?.datePicker?.date.endDate}
                variant={variant}
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
                variant={variant}
              />
            </Box>
          )}
          {actions?.resetData?.show && (
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme={isMerchant ? undefined : "red"}
                minW={{ base: "6rem", md: "10rem" }}
                textAlign={"center"}
                borderColor={isMerchant ? dashboardPalette.borderStrong : undefined}
                color={isMerchant ? dashboardPalette.textMuted : undefined}
                bg={isMerchant ? dashboardPalette.surfaceAlt : undefined}
                _hover={isMerchant ? { bg: dashboardPalette.surfaceSoft, color: dashboardPalette.text } : undefined}
              >
                Actions
              </MenuButton>
              <MenuList
                zIndex={15}
                bg={activeMenuListBg}
                border="1px solid"
                borderColor={isMerchant ? dashboardPalette.border : undefined}
                // borderColor={useColorModeValue("gray.200", "gray.600")}
                boxShadow={isMerchant ? "0 20px 40px rgba(0, 0, 0, 0.35)" : "md"}
                minW={"10rem"}
                py={0}
                color={isMerchant ? dashboardPalette.text : undefined}
              >
                {actions?.actionBtn?.addKey?.showAddButton && (
                  <MenuItem
                    onClick={() =>
                      actions?.actionBtn?.addKey?.function?.("add")
                    }
                    _hover={{ bg: activeHoverBg }}
                    icon={<IoMdAdd fontSize={"20px"} />}
                    p={"0.7rem"}
                    bg="transparent"
                  >
                    Add
                  </MenuItem>
                )}
                {actions?.resetData?.show && (
                  <MenuItem
                    onClick={actions?.resetData?.function}
                    icon={<FcClearFilters fontSize={"20px"} />}
                    _hover={{ bg: activeMenuItemHover }}
                    p={"0.7rem"}
                    bg="transparent"
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
        bg={isMerchant ? dashboardPalette.shell : undefined}
        {...tableProps.tableBox}
      >
        <Table
          size={isMobile ? "xs" : "sm"}
          variant={isMerchant ? "simple" : "striped"}
          {...tableProps.table}
          bg={activeBodyBg}
          color={isMerchant ? dashboardPalette.text : undefined}
          borderRadius="md"
          overflow="hidden"
          sx={{
            th: {
              verticalAlign: "middle",
            },
            td: {
              verticalAlign: "middle",
            },
            ...(tableProps.table?.sx || {}),
          }}
        >
          <Thead
            bg={activeHeaderBg}
            position="sticky"
            top="0"
            zIndex="9"
            height="50px"
          >
            <Tr>
              {serial?.show && (
                <Th
                  color={isMerchant ? dashboardPalette.textMuted : "white"}
                  w={serial?.width || undefined}
                  border="none"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontSize="xs"
                  textAlign="center"
                  verticalAlign="middle"
                  px={4}
                  py={3}
                >
                  {serial?.text || "S.No."}
                </Th>
              )}
              {columns.map((column, colIndex) => (
                <Th
                  key={colIndex}
                  textAlign={getColumnTextAlign(column)}
                  position={column?.props?.isSticky ? "sticky" : "relative"}
                  right={column?.props?.isSticky ? "0" : undefined}
                  bg={activeHeaderBg}
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color={isMerchant ? dashboardPalette.textMuted : "white"}
                  fontWeight="bold"
                  verticalAlign="middle"
                  px={4}
                  py={3}
                  border="none" // No borders on header cells
                  {...column?.props?.column}
                >
                  {column.headerName}
                </Th>
              ))}
            </Tr>
          </Thead>

          <TableLoader loader={loading} show={data.length} variant={variant}>
            <Tbody >
              {data.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  _hover={{
                    bg: activeHoverBg,
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  bg={isMerchant ? dashboardPalette.surface : undefined}
                >
                  {serial?.show && (
                    <Td
                      fontWeight="bold"
                      w={serial?.width || undefined}
                      textAlign="center"
                      verticalAlign="middle"
                      px={4}
                      py={3}
                      fontSize="sm"
                      border="none" // No border on cells
                      color={isMerchant ? dashboardPalette.textMuted : undefined}
                    >
                      {(actions?.pagination?.currentPage && actions?.pagination?.limit)
                        ? ((actions.pagination.currentPage - 1) * actions.pagination.limit + rowIndex + 1)
                        : (rowIndex + 1)}
                    </Td>
                  )}
                  {columns.map((column, colIndex) => (
                    <GenerateRows
                      key={colIndex}
                      column={column}
                      row={row}
                      action={actions}
                      cells={cells}
                      variant={variant}
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
          props={{
            style: { marginTop: "15px" },
            className: isMerchant ? "custom-table-pagination" : undefined,
          }}
        />
      )}
    </Box>
  );
};

export default CustomTable;
