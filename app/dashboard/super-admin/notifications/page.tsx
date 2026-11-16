"use client";

import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiPlusCircle,
  FiSend,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers
} from "react-icons/fi";
import ConfirmationModal from "../../../component/common/ConfirmationModal/ConfirmationModal";
import BottomSheetDrawer from "../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";
import CustomInput from "../../../component/config/component/customInput/CustomInput";
import CustomTable from "../../../component/config/component/CustomTable/CustomTable";
import { notifyError, notifySuccess } from "../../../config/utils/notification";
import { dashboardPalette } from "../../../layouts/dashboardLayout/dashboardPalette";
import {
  getMerchantTableProps,
  MerchantBadge,
  MerchantPageHeader,
  MerchantPageShell,
  MerchantPanel,
  MerchantStatCard
} from "../../components/common/merchantDashboardUI";

const roleOptions = ["user", "seller", "admin", "superAdmin"];

const targetModeSelectOptions = [
  { value: "broadcast", label: "Broadcast (All Active Users)" },
  { value: "role", label: "Specific User Role" },
  { value: "user", label: "Specific User IDs" },
];

const prioritySelectOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

type RecipientOption = {
  recipientId: string;
  name?: string;
  phone?: string;
  email?: string;
  type?: string;
};

type SentNotificationRecord = {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: "low" | "medium" | "high";
  targetMode: "user" | "role" | "broadcast";
  targetSummary: string;
  sentAt: string;
  status: "delivered" | "scheduled";
};

const NotificationPage = () => {
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const {
    isOpen: isComposeOpen,
    onOpen: onComposeOpen,
    onClose: onComposeClose,
  } = useDisclosure();

  const [targetMode, setTargetMode] = useState<"user" | "role" | "broadcast">("broadcast");
  const [roles, setRoles] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientOptions, setRecipientOptions] = useState<RecipientOption[]>([]);
  const [recipientLoading, setRecipientLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [manualUserIdsInput, setManualUserIdsInput] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("announcement");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [actionUrl, setActionUrl] = useState("");
  const [metaInput, setMetaInput] = useState("");
  const [sourceType, setSourceType] = useState("manual_admin");
  const [sourceId, setSourceId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // History / log of notifications dispatched from this console session
  const [sentHistory, setSentHistory] = useState<SentNotificationRecord[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<SentNotificationRecord | null>(null);

  const surfaceBg = useColorModeValue("white", dashboardPalette.surface);
  const shellBg = useColorModeValue("#F8FAFC", dashboardPalette.surfaceAlt);
  const borderCol = useColorModeValue("#E2E8F0", dashboardPalette.border);
  const textCol = useColorModeValue("#0F172A", dashboardPalette.text);
  const textMuted = useColorModeValue("#64748B", dashboardPalette.textMuted);

  const toggleArrayValue = (current: string[], value: string, checked: boolean) => {
    if (!value) return current;
    if (checked) {
      return Array.from(new Set([...current, value]));
    }
    return current.filter((item) => item !== value);
  };

  const parsedManualUserIds = useMemo(() => {
    return manualUserIdsInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [manualUserIdsInput]);

  const resolvedUserIds = useMemo(() => {
    const all = [...selectedUserIds, ...parsedManualUserIds];
    return Array.from(new Set(all));
  }, [selectedUserIds, parsedManualUserIds]);

  useEffect(() => {
    let isCancelled = false;

    const fetchRecipients = async () => {
      if (targetMode !== "user") {
        return;
      }

      setRecipientLoading(true);
      try {
        const { data } = await axios.get("/notifications/recipients", {
          params: {
            search: recipientSearch,
            page: 1,
            limit: 50,
          },
        });

        if (!isCancelled) {
          const rawItems = Array.isArray(data?.data?.items) ? data.data.items : [];
          const normalized = rawItems
            .map((item: any) => {
              const rawId = item?._id ?? item?.id ?? item?.userId ?? item?.recipientUserId;
              const recipientId =
                typeof rawId === "string"
                  ? rawId
                  : rawId && typeof rawId?.toString === "function"
                  ? rawId.toString()
                  : "";

              return {
                recipientId: recipientId.trim(),
                name: item?.name,
                phone: item?.phone,
                email: item?.email,
                type: item?.type,
              } satisfies RecipientOption;
            })
            .filter((item: RecipientOption) => Boolean(item.recipientId));

          const dedupedById = Array.from(
            new Map<string, RecipientOption>(
              normalized.map((item) => [item.recipientId, item])
            ).values()
          );
          setRecipientOptions(dedupedById);
        }
      } catch {
        if (!isCancelled) {
          setRecipientOptions([]);
        }
      } finally {
        if (!isCancelled) {
          setRecipientLoading(false);
        }
      }
    };

    fetchRecipients();

    return () => {
      isCancelled = true;
    };
  }, [targetMode, recipientSearch]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setActionUrl("");
    setMetaInput("");
    setSourceId("");
    setExpiresAt("");
    setSelectedUserIds([]);
    setManualUserIdsInput("");
  };

  const handleOpenCompose = () => {
    onComposeOpen();
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!title.trim()) {
      notifyError("Please enter a notification title.", {
        title: "Missing title",
        duration: 3000,
      });
      return;
    }

    if (!message.trim()) {
      notifyError("Please enter a notification message.", {
        title: "Missing message",
        duration: 3000,
      });
      return;
    }

    if (targetMode === "user" && resolvedUserIds.length === 0) {
      notifyError("Select at least one recipient for user target mode.", {
        title: "Missing recipients",
        duration: 3000,
      });
      return;
    }

    if (targetMode === "role" && roles.length === 0) {
      notifyError("Select at least one role for role target mode.", {
        title: "Missing roles",
        duration: 3000,
      });
      return;
    }

    let parsedMeta: any = undefined;
    if (metaInput.trim()) {
      try {
        parsedMeta = JSON.parse(metaInput);
      } catch {
        notifyError("Meta field must be valid JSON.", {
          title: "Invalid meta JSON",
          duration: 3000,
        });
        return;
      }
    }

    const payload: any = {
      targetMode,
      title: title.trim(),
      message: message.trim(),
      category: category.trim() || "announcement",
      priority,
      actionUrl: actionUrl.trim() || undefined,
      meta: parsedMeta,
      sourceType: sourceType.trim() || undefined,
      sourceId: sourceId.trim() || undefined,
      expiresAt: expiresAt || undefined,
    };

    if (targetMode === "user") {
      payload.userIds = resolvedUserIds;
    }

    if (targetMode === "role") {
      payload.roles = roles;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/notifications/send", payload);
      const sentCount = Number(data?.data?.insertedCount || 0);

      notifySuccess(
        `${data?.message || "Notification broadcast successfully."} Recipients: ${
          targetMode === "broadcast" ? "All active users" : sentCount || "Delivered"
        }`,
        {
          title: "Notification Sent",
          duration: 3500,
        }
      );

      // Record in local session history
      const newRecord: SentNotificationRecord = {
        id: `notif-${Date.now()}`,
        title: title.trim(),
        message: message.trim(),
        category: category.trim() || "announcement",
        priority,
        targetMode,
        targetSummary:
          targetMode === "broadcast"
            ? "All Users (Broadcast)"
            : targetMode === "role"
            ? `Roles: ${roles.join(", ")}`
            : `${resolvedUserIds.length} Recipient(s)`,
        sentAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          month: "short",
          day: "numeric",
        }),
        status: "delivered",
      };

      setSentHistory((prev) => [newRecord, ...prev]);
      resetForm();
      onComposeClose();
    } catch (error: any) {
      const backendData = error?.response?.data?.data;
      const validationMessage = Array.isArray(backendData)
        ? backendData.join(", ")
        : undefined;
      notifyError(
        validationMessage ||
          error?.response?.data?.message ||
          "Failed to send notification.",
        {
          title: "Failed to send",
          duration: 3000,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Table Columns
  const columns = [
    {
      headerName: "Title",
      key: "title",
      type: "component",
      metaData: {
        component: (item: SentNotificationRecord) => (
          <VStack align="start" spacing={0.5} maxW="240px">
            <Text fontWeight="700" color={textCol} noOfLines={1} fontSize="sm">
              {item.title}
            </Text>
            <Text fontSize="xs" color={textMuted} noOfLines={1}>
              {item.message}
            </Text>
          </VStack>
        ),
      },
    },
    {
      headerName: "Target",
      key: "targetMode",
      type: "component",
      metaData: {
        component: (item: SentNotificationRecord) => (
          <HStack spacing={1.5}>
            <Icon
              as={
                item.targetMode === "broadcast"
                  ? FiGlobe
                  : item.targetMode === "role"
                  ? FiShield
                  : FiUser
              }
              color={dashboardPalette.accentStrong}
              boxSize={3.5}
            />
            <Text fontSize="xs" fontWeight="600" color={textCol}>
              {item.targetSummary}
            </Text>
          </HStack>
        ),
      },
    },
    {
      headerName: "Category",
      key: "category",
      type: "component",
      metaData: {
        component: (item: SentNotificationRecord) => (
          <MerchantBadge tone="soft" textTransform="capitalize">
            {item.category}
          </MerchantBadge>
        ),
      },
    },
    {
      headerName: "Priority",
      key: "priority",
      type: "component",
      metaData: {
        component: (item: SentNotificationRecord) => (
          <MerchantBadge
            tone={
              item.priority === "high"
                ? "danger"
                : item.priority === "medium"
                ? "warning"
                : "accent"
            }
            textTransform="capitalize"
          >
            {item.priority}
          </MerchantBadge>
        ),
      },
    },
    {
      headerName: "Status",
      key: "status",
      type: "component",
      metaData: {
        component: (item: SentNotificationRecord) => (
          <MerchantBadge tone={item.status === "delivered" ? "success" : "soft"}>
            {item.status === "delivered" ? "Delivered" : "Scheduled"}
          </MerchantBadge>
        ),
      },
    },
    {
      headerName: "Sent Time",
      key: "sentAt",
      type: "text",
    },
    {
      headerName: "Action",
      key: "action",
      type: "table-actions",
      props: {
        isSticky: true,
        width: "80px",
      },
    },
  ];

  const tableActions = {
    actionBtn: {
      deleteKey: {
        showDeleteButton: true,
        function: (record: SentNotificationRecord) => setRecordToDelete(record),
      },
    },
    pagination: {
      show: true,
      currentPage: 1,
      totalPages: 1,
      onClick: () => {},
    },
  };

  const handleDeleteHistory = () => {
    if (recordToDelete) {
      setSentHistory((prev) => prev.filter((r) => r.id !== recordToDelete.id));
      toast({
        title: "Log Removed",
        description: "Notification log entry removed.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      setRecordToDelete(null);
    }
  };

  // Form Body used in both Desktop CustomDrawer and Mobile BottomSheetDrawer
  const renderComposeForm = () => (
    <Box as="form" onSubmit={handleSubmit} pb={{ base: 6, md: 2 }}>
      <VStack spacing={4} align="stretch">
        {/* Target Audience Mode */}
        <CustomInput
          type="select"
          name="targetMode"
          label="Target Audience Mode"
          required
          value={targetModeSelectOptions.find((opt) => opt.value === targetMode)}
          onChange={(opt: any) => setTargetMode(opt?.value || "broadcast")}
          options={targetModeSelectOptions}
        />

        {/* User Search & Selection if targetMode === 'user' */}
        {targetMode === "user" && (
          <Box
            p={3.5}
            borderRadius="16px"
            border="1px solid"
            borderColor={borderCol}
            bg={shellBg}
          >
            <VStack spacing={3} align="stretch">
              <CustomInput
                type="text"
                name="recipientSearch"
                label="Search Users"
                placeholder="Search recipient by name, phone, or email"
                value={recipientSearch}
                onChange={(e: any) => setRecipientSearch(e.target.value)}
              />

              <Box>
                <Flex justify="space-between" align="center" mb={1.5}>
                  <Text fontSize="xs" fontWeight="700" color={textMuted}>
                    Select Recipients ({selectedUserIds.length} chosen)
                  </Text>
                  {selectedUserIds.length > 0 && (
                    <Button
                      variant="link"
                      size="xs"
                      color={dashboardPalette.accent}
                      onClick={() => setSelectedUserIds([])}
                    >
                      Clear All
                    </Button>
                  )}
                </Flex>

                <Box
                  border="1px solid"
                  borderColor={borderCol}
                  borderRadius="14px"
                  p={2}
                  maxH="180px"
                  overflowY="auto"
                  bg={surfaceBg}
                >
                  {recipientLoading ? (
                    <HStack py={4} justify="center">
                      <Spinner size="sm" color={dashboardPalette.accent} />
                      <Text fontSize="xs" color={textMuted}>
                        Loading recipients...
                      </Text>
                    </HStack>
                  ) : recipientOptions.length === 0 ? (
                    <Text fontSize="xs" color={textMuted} textAlign="center" py={4}>
                      {recipientSearch ? "No users matching query." : "Type above to search users."}
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={1.5}>
                      {recipientOptions.map((item, index) => {
                        const isSelected = selectedUserIds.includes(item.recipientId);
                        return (
                          <Box
                            key={`${item.recipientId}-${index}`}
                            px={3}
                            py={2}
                            borderRadius="10px"
                            cursor="pointer"
                            border="1px solid"
                            borderColor={isSelected ? dashboardPalette.accent : borderCol}
                            bg={isSelected ? dashboardPalette.accentSoft : shellBg}
                            onClick={() =>
                              setSelectedUserIds((prev) =>
                                toggleArrayValue(prev, item.recipientId, !isSelected)
                              )
                            }
                            transition="all 0.15s ease"
                          >
                            <HStack justify="space-between" align="center">
                              <Box minW={0}>
                                <Text
                                  fontSize="xs"
                                  fontWeight="700"
                                  color={textCol}
                                  noOfLines={1}
                                >
                                  {item.name || "Unnamed User"} ({item.type || "user"})
                                </Text>
                                <Text fontSize="11px" color={textMuted} noOfLines={1}>
                                  {item.phone || item.email || "No contact info"}
                                </Text>
                              </Box>
                              <MerchantBadge tone={isSelected ? "accent" : "soft"}>
                                {isSelected ? "Selected" : "Pick"}
                              </MerchantBadge>
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}
                </Box>
              </Box>

              <CustomInput
                type="textarea"
                name="manualUserIdsInput"
                label="Manual User IDs (comma-separated)"
                placeholder="e.g. 64b8a1c92..., 64b8a1d04..."
                rows={2}
                value={manualUserIdsInput}
                onChange={(e: any) => setManualUserIdsInput(e.target.value)}
              />
              <Text fontSize="11px" color={textMuted}>
                Total recipients resolved: <strong>{resolvedUserIds.length}</strong>
              </Text>
            </VStack>
          </Box>
        )}

        {/* Roles multi-selector if targetMode === 'role' */}
        {targetMode === "role" && (
          <Box
            p={3.5}
            borderRadius="16px"
            border="1px solid"
            borderColor={borderCol}
            bg={shellBg}
          >
            <Text fontSize="xs" fontWeight="700" color={textMuted} mb={2}>
              Select Recipient Roles *
            </Text>
            <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={2}>
              {roleOptions.map((role) => {
                const isSelected = roles.includes(role);
                return (
                  <Box
                    key={role}
                    px={3}
                    py={2.5}
                    borderRadius="12px"
                    border="1.5px solid"
                    borderColor={isSelected ? dashboardPalette.accent : borderCol}
                    bg={isSelected ? dashboardPalette.accentSoft : surfaceBg}
                    cursor="pointer"
                    textAlign="center"
                    onClick={() =>
                      setRoles((prev) => toggleArrayValue(prev, role, !isSelected))
                    }
                    transition="all 0.15s ease"
                  >
                    <HStack justify="center" spacing={1.5}>
                      <Icon
                        as={isSelected ? FiCheckCircle : FiShield}
                        color={isSelected ? dashboardPalette.accentStrong : textMuted}
                        boxSize={3.5}
                      />
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="capitalize"
                        color={isSelected ? dashboardPalette.accentStrong : textCol}
                      >
                        {role}
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        )}

        {/* Title */}
        <CustomInput
          type="text"
          name="title"
          label="Notification Title"
          placeholder="e.g. Platform Maintenance Notice"
          required
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
        />

        {/* Message */}
        <CustomInput
          type="textarea"
          name="message"
          label="Notification Message"
          placeholder="Write the message text that will be displayed to users..."
          required
          rows={3}
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
        />

        {/* Category & Priority Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <CustomInput
            type="text"
            name="category"
            label="Category"
            placeholder="e.g. announcement, promotion, system"
            value={category}
            onChange={(e: any) => setCategory(e.target.value)}
          />

          <CustomInput
            type="select"
            name="priority"
            label="Priority Level"
            value={prioritySelectOptions.find((opt) => opt.value === priority)}
            onChange={(opt: any) => setPriority(opt?.value || "medium")}
            options={prioritySelectOptions}
          />
        </SimpleGrid>

        {/* Action URL */}
        <CustomInput
          type="url"
          name="actionUrl"
          label="Action Redirect URL (optional)"
          placeholder="e.g. /dashboard/orders or https://..."
          value={actionUrl}
          onChange={(e: any) => setActionUrl(e.target.value)}
        />

        {/* Source Type & Source ID Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <CustomInput
            type="text"
            name="sourceType"
            label="Source Type"
            placeholder="manual_admin"
            value={sourceType}
            onChange={(e: any) => setSourceType(e.target.value)}
          />

          <CustomInput
            type="text"
            name="sourceId"
            label="Source ID (optional)"
            placeholder="Reference ID or Campaign code"
            value={sourceId}
            onChange={(e: any) => setSourceId(e.target.value)}
          />
        </SimpleGrid>

        {/* Expiration DateTime */}
        <CustomInput
          type="dateAndTime"
          name="expiresAt"
          label="Expiration Date & Time (optional)"
          placeholder="Leave empty for standard retention window"
          value={expiresAt}
          onChange={(e: any) => setExpiresAt(e.target.value)}
        />

        {/* Meta JSON */}
        <CustomInput
          type="textarea"
          name="metaInput"
          label="Meta Payload (JSON format, optional)"
          placeholder='{"key": "value", "campaignId": 123}'
          rows={2}
          value={metaInput}
          onChange={(e: any) => setMetaInput(e.target.value)}
        />

        {/* Footer actions */}
        <Flex justify="flex-end" gap={3} pt={2}>
          <Button
            variant="ghost"
            borderRadius="14px"
            onClick={onComposeClose}
            isDisabled={submitting}
          >
            Cancel
          </Button>
          <Button
            leftIcon={<FiSend />}
            isLoading={submitting}
            loadingText="Broadcasting..."
            colorScheme="brand"
            borderRadius="14px"
            px={6}
            onClick={() => handleSubmit()}
          >
            Send Notification
          </Button>
        </Flex>
      </VStack>
    </Box>
  );

  return (
    <MerchantPageShell>
      {/* Page Header matching offers / products / shops */}
      <MerchantPageHeader
        icon={FiBell}
        title="Broadcast Center"
        description="Dispatch real-time in-app notifications to active users, seller groups, or entire platform audiences."
        badges={
          <HStack spacing={2}>
            <MerchantBadge tone="accent">
              <Icon as={FiGlobe} mr={1} />
              Broadcast Ready
            </MerchantBadge>
            <MerchantBadge tone={sentHistory.length > 0 ? "success" : "soft"}>
              {sentHistory.length} Dispatched
            </MerchantBadge>
          </HStack>
        }
        actions={
          <Button
            leftIcon={<FiPlusCircle />}
            onClick={handleOpenCompose}
            colorScheme="brand"
            borderRadius="14px"
            px={5}
          >
            New Broadcast
          </Button>
        }
        mobileActions={
          <Button
            size="sm"
            colorScheme="brand"
            borderRadius="full"
            leftIcon={<FiPlusCircle />}
            onClick={handleOpenCompose}
          >
            Broadcast
          </Button>
        }
      />

      {/* Top 4 Stats Grid matching offers & categories */}
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        spacing={{ base: 3, md: 4 }}
        mb={{ base: 4, md: 6 }}
      >
        <MerchantStatCard
          label="Target Mode"
          value={targetMode === "broadcast" ? "All Users" : targetMode}
          icon={FiGlobe}
          variant="panel"
          iconColor={dashboardPalette.accentStrong}
          iconBg="rgba(59, 130, 246, 0.12)"
        />
        <MerchantStatCard
          label="Dispatched (Session)"
          value={sentHistory.length}
          icon={FiCheckCircle}
          variant="panel"
          iconColor={dashboardPalette.success}
          iconBg="rgba(70, 201, 139, 0.14)"
          valueColor={dashboardPalette.success}
        />
        <MerchantStatCard
          label="Selected Recipients"
          value={targetMode === "broadcast" ? "All" : resolvedUserIds.length || roles.length}
          icon={FiUsers}
          variant="panel"
          iconColor={dashboardPalette.accent}
          iconBg="rgba(6, 95, 104, 0.14)"
        />
        <MerchantStatCard
          label="Channel Status"
          value="Operational"
          icon={FiClock}
          variant="panel"
          iconColor={dashboardPalette.warning}
          iconBg="rgba(245, 158, 11, 0.14)"
        />
      </SimpleGrid>

      {/* Main Panel */}
      <MerchantPanel p={{ base: 1, md: 6 }}>
        <Flex justify="space-between" align="center" gap={3} mb={4} flexWrap="wrap">
          <HStack spacing={2}>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="800" color={textCol}>
              Broadcast History & Logs
            </Text>
            <Badge
              bg={shellBg}
              color={textMuted}
              borderRadius="full"
              px={2.5}
              py={0.5}
              fontSize="xs"
              fontWeight="700"
            >
              {sentHistory.length} records
            </Badge>
          </HStack>

          <Button
            size="sm"
            leftIcon={<FiSend />}
            colorScheme="brand"
            variant="outline"
            borderRadius="12px"
            onClick={handleOpenCompose}
          >
            Create Notice
          </Button>
        </Flex>

        {/* Desktop View: CustomTable */}
        <Box display={{ base: "none", md: "block" }}>
          {sentHistory.length === 0 ? (
            <Box
              py={12}
              textAlign="center"
              bg={shellBg}
              borderRadius="16px"
              border="1px dashed"
              borderColor={borderCol}
            >
              <Circle size="52px" bg={surfaceBg} mx="auto" mb={3} border="1px solid" borderColor={borderCol}>
                <Icon as={FiBell} boxSize={6} color={dashboardPalette.accentStrong} />
              </Circle>
              <Text fontSize="md" fontWeight="700" color={textCol} mb={1}>
                No notifications sent in this session
              </Text>
              <Text fontSize="sm" color={textMuted} maxW="420px" mx="auto" mb={4}>
                Click the button below to compose and dispatch an in-app notice or announcement across the platform.
              </Text>
              <Button
                colorScheme="brand"
                borderRadius="14px"
                leftIcon={<FiSend />}
                onClick={handleOpenCompose}
              >
                Send First Notification
              </Button>
            </Box>
          ) : (
            <CustomTable
              title={`Recent Dispatches (${sentHistory.length})`}
              data={sentHistory}
              // tableMinH="60vh"
              loading={false}
              columns={columns}
              actions={tableActions}
              serial={{ show: true, text: "S.No." }}
              {...getMerchantTableProps("62vh")}
            />
          )}
        </Box>

        {/* Mobile View: High Quality Responsive Notification Cards */}
        <Box display={{ base: "block", md: "none" }}>
          {sentHistory.length === 0 ? (
            <Box
              py={8}
              px={4}
              textAlign="center"
              bg={shellBg}
              borderRadius="16px"
              border="1px dashed"
              borderColor={borderCol}
            >
              <Circle size="46px" bg={surfaceBg} mx="auto" mb={2.5} border="1px solid" borderColor={borderCol}>
                <Icon as={FiBell} boxSize={5} color={dashboardPalette.accentStrong} />
              </Circle>
              <Text fontSize="sm" fontWeight="700" color={textCol} mb={1}>
                No notifications sent yet
              </Text>
              <Text fontSize="xs" color={textMuted} mb={4}>
                Send notifications to buyers, sellers, or all users instantly.
              </Text>
              <Button
                size="sm"
                colorScheme="brand"
                borderRadius="full"
                leftIcon={<FiSend />}
                onClick={handleOpenCompose}
              >
                Compose Notice
              </Button>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch">
              {sentHistory.map((item) => (
                <Box
                  key={item.id}
                  p={4}
                  borderRadius="16px"
                  border="1px solid"
                  borderColor={borderCol}
                  bg={surfaceBg}
                  boxShadow="0 2px 8px rgba(15, 23, 42, 0.04)"
                  position="relative"
                  overflow="hidden"
                >
                  {/* Top indicator bar */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="3px"
                    bg={
                      item.priority === "high"
                        ? "red.400"
                        : item.priority === "medium"
                        ? "amber.400"
                        : dashboardPalette.accent
                    }
                  />

                  <Flex justify="space-between" align="start" gap={2} mb={2}>
                    <HStack spacing={2.5} align="center" minW={0}>
                      <Circle
                        size="34px"
                        bg={dashboardPalette.accentSoft}
                        flexShrink={0}
                      >
                        <Icon
                          as={
                            item.targetMode === "broadcast"
                              ? FiGlobe
                              : item.targetMode === "role"
                              ? FiShield
                              : FiUser
                          }
                          boxSize={4}
                          color={dashboardPalette.accentStrong}
                        />
                      </Circle>
                      <Box minW={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="700"
                          color={textCol}
                          noOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text fontSize="11px" color={textMuted} fontWeight="600">
                          {item.sentAt}
                        </Text>
                      </Box>
                    </HStack>

                    <IconButton
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      borderRadius="full"
                      icon={<FiTrash2 />}
                      aria-label="Remove log entry"
                      onClick={() => setRecordToDelete(item)}
                    />
                  </Flex>

                  <Text fontSize="xs" color={textMuted} mb={3} noOfLines={2}>
                    {item.message}
                  </Text>

                  <Divider my={2} borderColor={borderCol} />

                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={1.5}>
                    <HStack spacing={1.5}>
                      <MerchantBadge tone="soft" textTransform="capitalize">
                        {item.category}
                      </MerchantBadge>
                      <MerchantBadge
                        tone={
                          item.priority === "high"
                            ? "danger"
                            : item.priority === "medium"
                            ? "warning"
                            : "accent"
                        }
                        textTransform="capitalize"
                      >
                        {item.priority}
                      </MerchantBadge>
                    </HStack>

                    <MerchantBadge tone="success">
                      Delivered
                    </MerchantBadge>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </MerchantPanel>

      {/* Form Drawer (BottomSheetDrawer on mobile, CustomDrawer on desktop) */}
      {isMobile ? (
        <BottomSheetDrawer
          isOpen={isComposeOpen}
          onClose={onComposeClose}
          title="Compose Notification"
          size="full"
        >
          {renderComposeForm()}
        </BottomSheetDrawer>
      ) : (
        <CustomDrawer
          open={isComposeOpen}
          close={onComposeClose}
          title="Compose Notification"
          width="540px"
        >
          {renderComposeForm()}
        </CustomDrawer>
      )}

      {/* Confirmation Modal for removing history log */}
      {recordToDelete && (
        <ConfirmationModal
          isOpen={Boolean(recordToDelete)}
          onClose={() => setRecordToDelete(null)}
          onConfirm={handleDeleteHistory}
          title="Remove Notification Log"
          message={
            <Text>
              Are you sure you want to remove the log entry for{" "}
              <strong>{recordToDelete.title}</strong>?
            </Text>
          }
          confirmText="Yes, Remove"
        />
      )}
    </MerchantPageShell>
  );
};

export default NotificationPage;
