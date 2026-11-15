"use client";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ScaleFade,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { FaEdit, FaEnvelope, FaEye, FaWpforms } from "react-icons/fa";
import { FcClearFilters } from "react-icons/fc";
import { FiDownload, FiSliders } from "react-icons/fi";
import { IoMdAdd, IoMdInformationCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { formatDate } from "../../utils/dateUtils";
import Pagination from "../pagination/Pagination";
import TableLoader from "./TableLoader";
import { RepeatIcon } from "@chakra-ui/icons";

const MultiDropdown = dynamic(() => import("../multiDropdown/MultiDropdown"), { ssr: false });
const CustomDateRange = dynamic(() => import("../CustomDateRange/CustomDateRange"), { ssr: false });

interface Column {
  headerName?: string;
  key?: string;
  type?: string;
  function?: any;
  addkey?: any;
  props?: any;
  actions?: any;
  metaData?: { component?: any; function?: any };
}

interface RowData { [key: string]: any; }

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
  subTitle?: any;
  onRowClick?: (row: RowData) => void;
}

const TableActions: React.FC<any> = ({ actions, column, row }) => {
  const { actionBtn } = actions || {};
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Td
      position={column?.props?.isSticky ? "sticky" : "relative"}
      right={column?.props?.isSticky ? "0" : undefined}
      zIndex={column?.props?.isSticky ? 10 : undefined}
      bg={useColorModeValue("white", "gray.800")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.300", "gray.600")}
      p={1}
      textAlign="center"
    >
      <HStack gap={1} justify="center">
        {actionBtn?.editKey?.showEditButton && (
          <Tooltip label={actionBtn?.editKey?.title || "Edit"} hasArrow placement="top">
            <IconButton
              aria-label="edit"
              icon={<FaEdit />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{
                bg: "var(--color-primary-light, #EFF6FF)",
                color: "var(--color-primary-600, #1D4ED8)",
                transform: "scale(1.12) rotate(8deg)",
              }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => {
                e.stopPropagation();
                actionBtn?.editKey?.function?.(row);
              }}
            />
          </Tooltip>
        )}

        {actionBtn?.viewKey?.showViewButton && (
          <Tooltip label={actionBtn?.viewKey?.title || "View"} hasArrow placement="top">
            <IconButton
              aria-label="view"
              icon={<FaEye />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{
                bg: "var(--color-primary-light, #EFF6FF)",
                color: "var(--color-primary-600, #1D4ED8)",
                transform: "scale(1.12)",
              }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => {
                e.stopPropagation();
                actionBtn?.viewKey?.function?.(row);
              }}
            />
          </Tooltip>
        )}

        {actionBtn?.smtpKey?.showSmtpButton && (
          <Tooltip label={actionBtn?.smtpKey?.title || "SMTP settings"} hasArrow placement="top">
            <IconButton
              aria-label="smtp settings"
              icon={<FaEnvelope />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{
                bg: "var(--color-primary-light, #EFF6FF)",
                color: "var(--color-primary-600, #1D4ED8)",
                transform: "scale(1.12)",
              }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => {
                e.stopPropagation();
                actionBtn?.smtpKey?.function?.(row);
              }}
            />
          </Tooltip>
        )}

        {actionBtn?.onboardingKey?.showOnboardingButton && (
          <Tooltip label={actionBtn?.onboardingKey?.title || "Configure vendor onboarding"} hasArrow placement="left">
            <IconButton
              aria-label="configure vendor onboarding"
              icon={<FaWpforms />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{ bg: "var(--color-primary-light, #EFF6FF)", color: "var(--color-primary-600, #1D4ED8)", transform: "scale(1.12)" }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => { e.stopPropagation(); actionBtn?.onboardingKey?.function?.(row); }}
            />
          </Tooltip>
        )}

        {actionBtn?.financeFormKey?.showFinanceFormButton && (
          <Tooltip label={row?.financeFormId ? "Edit Finance Form" : actionBtn?.financeFormKey?.title || "Create Finance Form"} hasArrow placement="left">
            <IconButton
              aria-label={row?.financeFormId ? "edit finance form" : "create finance form"}
              icon={<FaWpforms />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{ bg: "var(--color-primary-light, #EFF6FF)", color: "var(--color-primary-700, #1D4ED8)", transform: "scale(1.12)" }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => { e.stopPropagation(); actionBtn?.financeFormKey?.function?.(row); }}
            />
          </Tooltip>
        )}

        {actionBtn?.configureSchemaKey?.showConfigureSchemaButton && (
          <Tooltip label="Configure Schema" hasArrow placement="left">
            <IconButton
              aria-label="Configure Schema"
              icon={<FiSliders />}
              size="sm"
              variant="ghost"
              color={iconColor}
              _hover={{ bg: "var(--color-primary-light, #EFF6FF)", color: "var(--color-primary-700, #1D4ED8)", transform: "scale(1.12)" }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => { e.stopPropagation(); actionBtn?.configureSchemaKey?.function?.(row); }}
            />
          </Tooltip>
        )}

        {actionBtn?.deleteKey?.showDeleteButton && (
          <Tooltip label={actionBtn?.deleteKey?.title || "Delete"} hasArrow placement="top">
            <IconButton
              aria-label="delete"
              icon={<MdDelete />}
              size="sm"
              variant="ghost"
              color={useColorModeValue("red.500", "red.400")}
              _hover={{
                bg: "red.50",
                color: "red.600",
                transform: "scale(1.12)",
              }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
              onClick={(e) => {
                e.stopPropagation();
                actionBtn?.deleteKey?.function?.(row);
              }}
            />
          </Tooltip>
        )}
      </HStack>
    </Td>
  );
};

const GenerateRows: React.FC<any> = ({ column, row, action, cells }) => {
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cellBg = useColorModeValue("white", "gray.800");

const baseCellProps = {
  py: 3,
  px: 5,
  fontSize: "sm",
  color: textColor,
  borderBottomWidth: "1px",
  borderBottomColor: borderColor,
  transition:
    "background 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  whiteSpace: "nowrap" as const,
  position: column?.props?.isSticky ? "sticky" as const : undefined,
  right: column?.props?.isSticky ? 0 : undefined,
  zIndex: column?.props?.isSticky ? 5 : undefined,
  bg: column?.props?.isSticky ? cellBg : undefined,
};

  switch (column.type) {
    case "date":
      return (
        <Td {...baseCellProps}>
          {row[column.key] ? formatDate(row[column.key]) : "--"}
        </Td>
      );

    case "link":
      return (
        <Td
          {...baseCellProps}
          color="var(--color-primary-600, #1D4ED8)"
          fontWeight="medium"
          cursor="pointer"
          _hover={{ color: "var(--color-primary-700, #1E40AF)", textDecoration: "underline" }}
          onClick={() => column?.function?.(row)}
        >
          {row[column.key] || "--"}
        </Td>
      );

    case "tooltip":
      return (
        <Td {...baseCellProps}>
          <Tooltip label={row[column.key]} hasArrow placement="top">
            <Text isTruncated maxW="180px" fontWeight="medium">
              {typeof row[column.key] === "string" ? row[column.key].substring(0, 28) : "--"}
            </Text>
          </Tooltip>
        </Td>
      );

    case "array":
      return (
        <Td {...baseCellProps} textAlign="center">
          <Tooltip label={JSON.stringify(row[column.key], null, 2)} hasArrow>
            <IconButton
              aria-label="info"
              icon={<IoMdInformationCircle />}
              size="sm"
              variant="ghost"
              color="gray.500"
              _hover={{ color: "var(--color-primary-600, #1D4ED8)", transform: "rotate(12deg)" }}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            />
          </Tooltip>
        </Td>
      );

    case "table-actions":
      return <TableActions actions={action} column={column} row={row} />;

    case "component":
      return (
        <Td {...baseCellProps}>
          {column.metaData?.component ? column.metaData.component(row) : null}
        </Td>
      );

    default:
      return (
        <Td {...baseCellProps} isTruncated maxW="220px" fontWeight="medium">
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
  subTitle,
  onRowClick,
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardBg = useColorModeValue("white", "brand.900");
  const headerBg = useColorModeValue("white", "brand.800");
  const accent = useColorModeValue("brand.600", "brand.400");
  const borderColor = useColorModeValue("white", "brand.700");
  const rowHover = useColorModeValue("var(--color-primary-light, #EFF6FF)", "gray.800");
  const shadow = useColorModeValue(
    "0 20px 40px -15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)",
    "0 20px 40px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
  );

  const tableHeaderBg = "brand.600";

  return (
    <Box
      bg={cardBg}
      borderRadius="3xl"
      // boxShadow="0 10px 40px -15px rgba(0, 0, 0, 0.15)"
      shadow={'md'}
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {/* HEADER */}
      <Flex
        justify="space-between"
        align="center"
        px={6}
        py={3}
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <Flex direction="column" gap={0.5}>
          {title && (
            <Heading
              size="md"
              color={accent}
              fontWeight="600"
              letterSpacing="-0.02em"
            >
              {title}
            </Heading>
          )}
          {subTitle && (
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {subTitle}
            </Text>
          )}
        </Flex>

        <Flex align="center" gap={3} ml="auto" flexWrap="wrap">
          {!isMobile && actions?.search?.show && (
            <Input
              placeholder={actions?.search?.placeholder || "Search..."}
              value={actions?.search?.searchValue}
              onChange={actions?.search?.onSearchChange}
              size="sm"
              width="260px"
              borderRadius="full"
              bg={useColorModeValue("white", "gray.800")}
              borderColor={borderColor}
              _focus={{
                borderColor: accent,
                boxShadow: "0 0 0 3px var(--color-primary-ring, rgba(37, 99, 235, 0.2))",
              }}
              transition="all 0.2s ease"
            />
          )}

          {actions?.datePicker?.show && !isMobile && (
            <HStack spacing={2} align="center">
              <CustomDateRange
                startDate={actions?.datePicker?.date?.startDate}
                endDate={actions?.datePicker?.date?.endDate}
                onStartDateChange={(e: any) => actions?.datePicker?.onDateChange?.(e, "startDate")}
                onEndDateChange={(e: any) => actions?.datePicker?.onDateChange?.(e, "endDate")}
              />
              {actions?.datePicker?.onApply && (
                <Button
                  size="sm"
                  bg="var(--color-primary-600, #1D4ED8)"
                  color="#FFFFFF"
                  _hover={{
                    bg: "var(--color-primary-700, #1E40AF)",
                    transform: "translateY(-1px)",
                    shadow: "sm",
                  }}
                  _active={{ bg: "var(--color-primary-800, #1E3A8A)" }}
                  borderRadius="full"
                  px={4}
                  h="36px"
                  fontWeight="600"
                  fontSize="xs"
                  transition="all 0.2s ease"
                  onClick={actions?.datePicker?.onApply}
                >
                  Apply
                </Button>
              )}
              {actions?.datePicker?.onReset && (
                <IconButton
                  size="sm"
                  aria-label="reset"
                  icon={<RepeatIcon/>}
                  variant="outline"
                  borderColor={borderColor}
                  color={useColorModeValue("gray.700", "gray.200")}
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.700"),
                    borderColor: "var(--color-primary-500, #2563EB)",
                  }}
                  borderRadius="full"
                  px={4}
                  h="36px"
                  fontWeight="500"
                  fontSize="xs"
                  transition="all 0.2s ease"
                  onClick={actions?.datePicker?.onReset}
                />
               
              )}
            </HStack>
          )}

          {actions?.downloadExcel?.show && (
            <Button
              bg="green.600"
              color="#FFFFFF"
              _hover={{ bg: "green.700", transform: "translateY(-1px)", shadow: "md" }}
              _active={{ bg: "green.800" }}
              borderRadius="full"
              leftIcon={<FiDownload />}
              size="sm"
              isLoading={actions?.downloadExcel?.loading}
              onClick={actions?.downloadExcel?.onClick}
              transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              {actions?.downloadExcel?.text || "Download Excel"}
            </Button>
          )}

          {actions?.bulkActions?.show && (
            <HStack spacing={2}>
              {actions.bulkActions.approve?.show && (
                <Button
                  size="sm"
                  rounded="full"
                  colorScheme="green"
                  onClick={actions.bulkActions.approve.onClick}
                  isDisabled={!actions.bulkActions.selectedCount}
                >
                  Bulk Approve ({actions.bulkActions.selectedCount})
                </Button>
              )}
              {actions.bulkActions.reject?.show && (
                <Button
                  size="sm"
                  rounded="full"
                  borderColor="red.500"
                  _hover={{bg:"red.50"}}
                  color="red.500"
                  variant="outline"
                  onClick={actions.bulkActions.reject.onClick}
                  isDisabled={!actions.bulkActions.selectedCount}
                >
                  Bulk Reject ({actions.bulkActions.selectedCount})
                </Button>
              )}
            </HStack>
          )}

          {actions?.multidropdown?.show && <MultiDropdown {...actions?.multidropdown} />}

          {(actions?.actionBtn?.addKey?.showAddButton || actions?.resetData?.show) && (
            <>
              {actions?.actionBtn?.addKey?.showAddButton && actions?.resetData?.show && !actions?.actionBtn?.addKey?.showAsButton ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="var(--color-primary-600, #1D4ED8)"
                    color="#FFFFFF"
                    _hover={{ bg: "var(--color-primary-700, #1E40AF)", transform: "translateY(-1px)", shadow: "lg" }}
                    _active={{ bg: "var(--color-primary-800, #1E3A8A)" }}
                    borderRadius="full"
                    leftIcon={<IoMdAdd />}
                    size="md"
                    transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    Actions
                  </MenuButton>
                  <MenuList borderRadius="2xl" py={2} shadow="xl">
                    <MenuItem
                      onClick={() => actions?.actionBtn?.addKey?.function?.("add")}
                      icon={<IoMdAdd />}
                      fontWeight="medium"
                    >
                      {actions?.actionBtn?.addKey?.text || "Add New"}
                    </MenuItem>
                    <MenuItem
                      onClick={actions?.resetData?.function}
                      icon={<FcClearFilters />}
                      fontWeight="medium"
                    >
                      {actions?.resetData?.text || "Reset Filters"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  {actions?.actionBtn?.addKey?.showAddButton && (
                    <Button
                      bg="var(--color-primary-600, #1D4ED8)"
                      color="#FFFFFF"
                      _hover={{ bg: "var(--color-primary-700, #1E40AF)", transform: "translateY(-1px)", shadow: "lg" }}
                      _active={{ bg: "var(--color-primary-800, #1E3A8A)" }}
                      borderRadius="full"
                      leftIcon={<IoMdAdd />}
                      size="md"
                      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                      onClick={() => actions?.actionBtn?.addKey?.function?.("add")}
                    >
                      {actions?.actionBtn?.addKey?.text || "Add New"}
                    </Button>
                  )}
                  {actions?.resetData?.show && (
                    <Button
                      variant="outline"
                      borderRadius="full"
                      leftIcon={<FcClearFilters />}
                      size="md"
                      onClick={actions?.resetData?.function}
                    >
                      Reset
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </Flex>
      </Flex>


      {/* TABLE */}
      {/* TABLE */}
<Box
  px={{ base: 3, md: 5 }}
  py={{ base: 3, md: 4 }}
  bg={cardBg}
>
  <Box
    overflowX="auto"
    overflowY="auto"
    maxH="64vh"
    border="1px solid"
    borderColor={borderColor}
    borderRadius="xl"
    className="customScrollBar"
    boxShadow="sm"
    sx={{
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'var(--color-primary-600, #60A5FA)',
        borderRadius: '9999px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'var(--color-primary-600, #1D4ED8)',
      },
      scrollbarWidth: 'thin',
      scrollbarColor:
        'var(--color-primary-600, #60A5FA) transparent',
    }}
    {...tableProps.tableBox}
  >
    <ScaleFade in={true} initialScale={0.98}>
      <Table
        size="sm"
        variant="simple"
        bg={cardBg}
        {...tableProps.table}
      >
        <Thead
          bg={tableHeaderBg}
          position="sticky"
          top={0}
          zIndex={20}
        >
          <Tr>
            {serial?.show && (
              <Th
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                color="#FFFFFF"
                bg={tableHeaderBg}
                fontWeight="700"
                py={4}
                px={5}
                borderBottom="none"
              >
                {serial?.text || "#"}
              </Th>
            )}

            {actions?.selection?.show && (
              <Th color="#FFFFFF" bg={tableHeaderBg} px={3} width="44px">
                <Checkbox
                  aria-label="Select all rows"
                  isChecked={data.length > 0 && data.every((row) => actions.selection.isSelected(row))}
                  isIndeterminate={data.some((row) => actions.selection.isSelected(row)) && !data.every((row) => actions.selection.isSelected(row))}
                  onChange={(event) => {
                    event.stopPropagation();
                    actions.selection.onToggleAll(event.target.checked, data);
                  }}
                />
              </Th>
            )}

            {columns.map((col, idx) => (
              <Th
                key={idx}
                textAlign="left"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
                color="#FFFFFF"
                whiteSpace="nowrap"
                fontWeight="700"
                py={4}
                px={5}
                position={
                  col?.props?.isSticky
                    ? "sticky"
                    : undefined
                }
                right={
                  col?.props?.isSticky
                    ? 0
                    : undefined
                }
                bg={tableHeaderBg}
                zIndex={
                  col?.props?.isSticky
                    ? 10
                    : undefined
                }
                borderBottom="none"
              >
                {col.headerName}
              </Th>
            ))}
          </Tr>
        </Thead>

        <TableLoader
          loader={loading}
          show={safeData.length}
        >
          <Tbody>
            {safeData.map((row, rowIndex) => (
              <Tr
                key={rowIndex}
                _hover={{
                  bg: rowHover,
                }}
                transition="background 0.2s ease"
                cursor={onRowClick ? "pointer" : "default"}
                onClick={() => onRowClick?.(row)}
              >
                {serial?.show && (
                  <Td
                    fontWeight="600"
                    color="gray.400"
                    py={3}
                    px={5}
                    fontSize="sm"
                    borderBottomWidth="1px"
                    borderBottomColor={useColorModeValue(
                      "gray.200",
                      "gray.700"
                    )}
                  >
                    {rowIndex + 1}
                  </Td>
                )}

                {actions?.selection?.show && (
                  <Td px={3} width="44px" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      aria-label="Select row"
                      isChecked={actions.selection.isSelected(row)}
                      onChange={(event) => {
                        event.stopPropagation();
                        actions.selection.onToggle(row, event.target.checked);
                      }}
                    />
                  </Td>
                )}

                {columns.map(
                  (column, colIndex) => (
                    <GenerateRows
                      key={colIndex}
                      column={column}
                      row={row}
                      action={actions}
                      cells={cells}
                    />
                  )
                )}
              </Tr>
            ))}
          </Tbody>
        </TableLoader>
      </Table>
    </ScaleFade>
  </Box>
</Box>
      {/* PAGINATION */}
      {actions?.pagination?.show && (
        <Box
          px={6}
          py={4}
          borderTop="1px solid"
          borderColor={borderColor}
          bg={headerBg}
        >
          <Pagination
            currentPage={actions?.pagination?.currentPage || 1}
            totalPages={actions?.pagination?.totalPages || 1}
            onPageChange={actions?.pagination?.onClick}
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomTable;
