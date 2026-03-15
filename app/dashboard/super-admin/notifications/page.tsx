"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Badge,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { notifyError, notifySuccess } from "../../../config/utils/notification";

const roleOptions = ["user", "seller", "admin", "superAdmin"];

type RecipientOption = {
  recipientId: string;
  name?: string;
  phone?: string;
  email?: string;
  type?: string;
};

const NotificationComposerPage = () => {
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
  const recipientPickerVersion = "Recipient Picker v4";

  const toggleArrayValue = (current: string[], value: string, checked: boolean) => {
    if (!value) {
      return current;
    }

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
            new Map<string, RecipientOption>(normalized.map((item) => [item.recipientId, item])).values()
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      title,
      message,
      category,
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
      notifySuccess(`${data?.message || "Notification sent successfully."} Recipients: ${sentCount}.`, {
        title: "Notification sent",
        duration: 3000,
      });

      setTitle("");
      setMessage("");
      setActionUrl("");
      setMetaInput("");
      setSourceId("");
      setExpiresAt("");
      if (targetMode === "user") {
        setSelectedUserIds([]);
        setManualUserIdsInput("");
      }
    } catch (error: any) {
      const backendData = error?.response?.data?.data;
      const validationMessage = Array.isArray(backendData) ? backendData.join(", ") : undefined;
      notifyError(validationMessage || error?.response?.data?.message || "Failed to send notification.", {
        title: "Failed to send",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="900px" p={6}>
      <Heading size="lg" mb={2}>
        Notification Composer
      </Heading>
      <Text color="gray.500" mb={6}>
        Send persistent in-app notifications to users, roles, or all active users.
      </Text>

      <Box as="form" onSubmit={handleSubmit} bg="white" borderRadius="lg" p={6} shadow="sm">
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Target Mode</FormLabel>
            <Select value={targetMode} onChange={(event) => setTargetMode(event.target.value as any)}>
              <option value="broadcast">Broadcast (all active users)</option>
              <option value="role">Role</option>
              <option value="user">User IDs</option>
            </Select>
          </FormControl>

          {targetMode === "user" && (
            <>
              <FormControl>
                <FormLabel>Search Recipients</FormLabel>
                <Input
                  value={recipientSearch}
                  onChange={(event) => setRecipientSearch(event.target.value)}
                  placeholder="Search by name, phone, or email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Select Recipients</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  {recipientPickerVersion}
                </Text>
                <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3} maxH="220px" overflowY="auto">
                  {recipientLoading ? (
                    <HStack py={4} justify="center">
                      <Spinner size="sm" />
                      <Text fontSize="sm" color="gray.500">
                        Loading recipients...
                      </Text>
                    </HStack>
                  ) : recipientOptions.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">
                      No recipients found.
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={2}>
                      {recipientOptions.map((item, index) => {
                        const isSelected = selectedUserIds.includes(item.recipientId);
                        return (
                          <Box
                            key={`${item.recipientId}-${index}`}
                            border="1px solid"
                            borderColor={isSelected ? "blue.400" : "gray.200"}
                            bg={isSelected ? "blue.50" : "white"}
                            borderRadius="md"
                            px={3}
                            py={2}
                            cursor="pointer"
                            width="100%"
                            onClick={() =>
                              setSelectedUserIds((prev) =>
                                toggleArrayValue(prev, item.recipientId, !prev.includes(item.recipientId))
                              )
                            }
                          >
                            <HStack justify="space-between" align="center">
                              <Text fontSize="sm" textAlign="left" noOfLines={1}>
                                {item.name || "Unnamed"} ({item.type || "user"}) - {item.phone || item.email || "N/A"}
                              </Text>
                              {isSelected ? <Badge colorScheme="blue">Selected</Badge> : <Badge>Pick</Badge>}
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  )}
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Manual User IDs (optional)</FormLabel>
                <Textarea
                  value={manualUserIdsInput}
                  onChange={(event) => setManualUserIdsInput(event.target.value)}
                  placeholder="Comma-separated user IDs"
                  rows={2}
                />
                <FormHelperText>{resolvedUserIds.length} recipient(s) selected.</FormHelperText>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Selected IDs: {selectedUserIds.join(", ") || "none"}
                </Text>
              </FormControl>
            </>
          )}

          {targetMode === "role" && (
            <FormControl isRequired>
              <FormLabel>Roles</FormLabel>
              <HStack spacing={3} align="start" flexWrap="wrap">
                {roleOptions.map((role) => (
                  <Box
                    key={role}
                    border="1px solid"
                    borderColor={roles.includes(role) ? "blue.400" : "gray.200"}
                    bg={roles.includes(role) ? "blue.50" : "white"}
                    borderRadius="md"
                    px={3}
                    py={2}
                    cursor="pointer"
                    onClick={() => setRoles((prev) => toggleArrayValue(prev, role, !prev.includes(role)))}
                  >
                    <HStack spacing={2}>
                      {roles.includes(role) ? <Badge colorScheme="blue">Selected</Badge> : <Badge>Pick</Badge>}
                      <Text textTransform="capitalize">{role}</Text>
                    </HStack>
                  </Box>
                ))}
              </HStack>
            </FormControl>
          )}

          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={2000} />
          </FormControl>

          <HStack spacing={4} align="start">
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="announcement" />
            </FormControl>

            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select value={priority} onChange={(event) => setPriority(event.target.value as any)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>Action URL</FormLabel>
            <Input value={actionUrl} onChange={(event) => setActionUrl(event.target.value)} placeholder="/dashboard/orders" />
          </FormControl>

          <HStack spacing={4} align="start">
            <FormControl>
              <FormLabel>Source Type</FormLabel>
              <Input value={sourceType} onChange={(event) => setSourceType(event.target.value)} placeholder="manual_admin" />
            </FormControl>

            <FormControl>
              <FormLabel>Source ID</FormLabel>
              <Input value={sourceId} onChange={(event) => setSourceId(event.target.value)} placeholder="Optional source reference" />
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>Expires At</FormLabel>
            <Input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
            <FormHelperText>Leave empty to use default retention window.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Meta (JSON)</FormLabel>
            <Textarea
              value={metaInput}
              onChange={(event) => setMetaInput(event.target.value)}
              placeholder='{"key":"value"}'
              rows={4}
            />
          </FormControl>

          <HStack justify="flex-end" pt={2}>
            <Button type="submit" colorScheme="blue" isLoading={submitting}>
              Send Notification
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default NotificationComposerPage;
