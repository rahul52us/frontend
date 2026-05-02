'use client'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { FcClearFilters } from "react-icons/fc";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdAdd, IoMdInformationCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";
import { formatDate } from "../../utils/dateUtils";
import Pagination from "../pagination/Pagination";
import TableLoader from "./TableLoader";
const MultiDropdown = dynamic(() => import('../multiDropdown/MultiDropdown'), { ssr: false });
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

  // Theme-aware colors
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cDanger = useColorModeValue("red.500", dashboardPalette.danger);

  const iconColor = isMerchant
    ? cTextMuted
    : useColorModeValue("gray.700", "gray.200");
  const deleteColor = isMerchant
    ? cDanger
    : useColorModeValue("red.500", "red.300");

  return (
    <Td
      {...column?.props?.row}
      position={column?.props?.isSticky ? "sticky" : "relative"}
      right={column?.props?.isSticky ? "0" : undefined}
      {...getSharedCellLayoutProps(column)}
      zIndex={column?.props?.isSticky ? "5" : undefined}
      bgColor={
        column?.props?.isSticky
          ? isMerchant
            ? cSurface
            : useColorModeValue("white", "gray.800")
          : undefined
      }
    >
      <Flex columnGap={0} justifyContent={"center"}>
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            icon={<HiDotsVertical />}
            size="sm"
            variant="ghost"
            color={iconColor}
            _hover={{ bg: cSurfaceSoft, color: cText }}
            aria-label="Actions"
          />
          <MenuList zIndex={10} bg={cSurface} borderColor={cSurfaceSoft}>
            {actionBtn?.editKey?.showEditButton && (
              <MenuItem
                icon={<FaEdit />}
                onClick={() => {
                  if (actionBtn?.editKey?.function)
                    actionBtn?.editKey.function(row);
                }}
              >
                {actionBtn?.editKey?.title || "Edit"}
              </MenuItem>
            )}
            {actionBtn?.viewKey?.showViewButton && (
              <MenuItem
                icon={<FaEye />}
                onClick={() => {
                  if (actionBtn?.viewKey?.function)
                    actionBtn?.viewKey.function(row);
                }}
              >
                {actionBtn?.viewKey?.title || "View"}
              </MenuItem>
            )}
            {actionBtn?.deleteKey?.showDeleteButton && (
              <MenuItem
                icon={<MdDelete />}
                color={deleteColor}
                _hover={{ bg: "rgba(239, 107, 107, 0.12)" }}
                onClick={() => {
                  if (actionBtn?.deleteKey?.function)
                    actionBtn?.deleteKey.function(row);
                }}
              >
                {actionBtn?.deleteKey?.title || "Delete"}
              </MenuItem>
            )}
          </MenuList>
        </Menu>
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
  const cellBorder = useColorModeValue("gray.200", "gray.700");
  const cellProps = cells
    ? { border: `1px solid ${cellBorder}` }
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
              color={useColorModeValue("gray.700", "gray.200")}
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
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isMerchant = variant === "merchant";

  // Dynamic Theme Colors
  const cAccentSoft = useColorModeValue("blue.50", dashboardPalette.accentSoft);
  const cAccentStrong = useColorModeValue("blue.700", dashboardPalette.accentStrong);
  const cAccent = useColorModeValue("blue.600", dashboardPalette.accent);
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);
  const cText = useColorModeValue("gray.800", dashboardPalette.text);
  const cTextSoft = useColorModeValue("gray.400", dashboardPalette.textSoft);
  const cBorder = useColorModeValue("gray.200", dashboardPalette.border);
  const cBorderStrong = useColorModeValue("gray.300", dashboardPalette.borderStrong);
  const cSurface = useColorModeValue("white", dashboardPalette.surface);
  const cSurfaceAlt = useColorModeValue("gray.50", dashboardPalette.surfaceAlt);
  const cSurfaceSoft = useColorModeValue("gray.100", dashboardPalette.surfaceSoft);
  const cShell = useColorModeValue("white", dashboardPalette.shell);

  const headerBg = useColorModeValue("gray.700", "gray.800");
  const bodyBg = useColorModeValue("white", "gray.900");
  const hoverBg = useColorModeValue("blue.100", "blue.700");
  const menuItemHover = useColorModeValue("blue.100", "blue.700");
  const menuListBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("blue.500", "white");
  const boxBorder = useColorModeValue("gray.200", "gray.700");
  const mainBox = useColorModeValue("white", "gray.900");

  const activeHeaderBg = isMerchant ? cSurfaceAlt : headerBg;
  const activeBodyBg = isMerchant ? cSurface : bodyBg;
  const activeHoverBg = isMerchant ? useColorModeValue("rgba(214, 183, 114, 0.10)", "rgba(255,255,255,0.03)") : hoverBg;
  const activeMenuItemHover = isMerchant ? cSurfaceSoft : menuItemHover;
  const activeMenuListBg = isMerchant ? cSurface : menuListBg;
  const activeTitleColor = isMerchant ? cText : titleColor;
  const activeBoxBorder = isMerchant ? cBorder : boxBorder;
  const activeMainBox = isMerchant ? cShell : mainBox;
  const inputBorderColor = isMerchant ? cBorderStrong : useColorModeValue("gray.300", "gray.600");

  const inputFocusStyles = isMerchant
    ? {
        borderColor: cAccent,
        boxShadow: `0 0 0 1px ${cAccent}`,
      }
    : { borderColor: "blue.500", boxShadow: "outline" };

  return (
    <Box
      rounded={12}
      bg={activeMainBox}
      boxShadow={isMerchant ? useColorModeValue("sm", "0 28px 60px rgba(0, 0, 0, 0.24)") : "rgb(0 0 0 / 20%) 0px 0px 8px"}
      border={"1px solid"}
      borderColor={activeBoxBorder}
      sx={
        isMerchant
          ? {
              "& .pagination": {
                gap: "6px",
              },
              "& .pagination a": {
                color: cTextMuted,
                borderRadius: "12px",
                minWidth: "38px",
                minHeight: "38px",
                padding: "6px 12px",
                transition: "all 0.2s ease",
              },
              "& .pagination a:hover": {
                color: cAccentStrong,
                background: useColorModeValue("rgba(214, 183, 114, 0.08)", "rgba(255,255,255,0.05)"),
              },
              "& .paginationActive a": {
                color: `${cAccentStrong} !important`,
                background: useColorModeValue("rgba(214, 183, 114, 0.12)", "rgba(255,255,255,0.08)"),
                border: `1px solid ${cBorder}`,
              },
              "& .paginationDisabled": {
                color: `${cTextSoft} !important`,
              },
              "& .custom-table-pagination .chakra-icon-button": {
                bg: cSurfaceAlt,
                color: cTextMuted,
                border: "1px solid",
                borderColor: cBorderStrong,
              },
              "& .custom-table-pagination .chakra-icon-button:hover": {
                bg: cSurfaceSoft,
                color: cText,
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
        borderColor={isMerchant ? cBorder : undefined}
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
              size="sm"
              fontWeight="normal"
              placeholder={actions?.search?.placeholder || "Search"}
              value={actions?.search?.searchValue}
              onChange={actions?.search?.onSearchChange}
              borderRadius="5rem"
              bg={isMerchant ? cSurfaceAlt : undefined}
              color={isMerchant ? cText : undefined}
              borderColor={inputBorderColor}
              _placeholder={isMerchant ? { color: cTextSoft } : undefined}
              _hover={isMerchant ? { borderColor: cAccent } : undefined}
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
                as={IconButton}
                icon={<HiDotsVertical />}
                variant="outline"
                size="sm"
                colorScheme={isMerchant ? undefined : "gray"}
                borderColor={isMerchant ? cBorderStrong : undefined}
                color={isMerchant ? cTextMuted : undefined}
                bg={isMerchant ? cSurfaceAlt : undefined}
                _hover={isMerchant ? { bg: cSurfaceSoft, color: cText } : undefined}
                aria-label="Actions"
              />
              <MenuList
                zIndex={15}
                bg={activeMenuListBg}
                border="1px solid"
                borderColor={isMerchant ? cBorder : undefined}
                boxShadow={isMerchant ? "0 20px 40px rgba(0, 0, 0, 0.35)" : "md"}
                minW={"10rem"}
                py={0}
                color={isMerchant ? cText : undefined}
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
        bg={isMerchant ? cShell : undefined}
        {...tableProps.tableBox}
      >
        <Table
          size={isMobile ? "xs" : "sm"}
          variant={isMerchant ? "simple" : "striped"}
          {...tableProps.table}
          bg={activeBodyBg}
          color={isMerchant ? cText : undefined}
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
                  color={isMerchant ? cTextMuted : "white"}
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
                  color={isMerchant ? cTextMuted : "white"}
                  fontWeight="bold"
                  verticalAlign="middle"
                  px={4}
                  py={3}
                  border="none"
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
                  bg={isMerchant ? cSurface : undefined}
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
                      border="none"
                      color={isMerchant ? cTextMuted : undefined}
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
