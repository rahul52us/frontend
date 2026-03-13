"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
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

const NotificationComposerPage = () => {
  const [targetMode, setTargetMode] = useState<"user" | "role" | "broadcast">("broadcast");
  const [roles, setRoles] = useState<string[]>([]);

  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientOptions, setRecipientOptions] = useState<any[]>([]);
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
          setRecipientOptions(Array.isArray(data?.data?.items) ? data.data.items : []);
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
      notifySuccess(data?.message || "Notification dispatched successfully.", {
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
      notifyError(error?.response?.data?.message || "Failed to send notification.", {
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
                    <CheckboxGroup value={selectedUserIds} onChange={(value) => setSelectedUserIds(value as string[])}>
                      <VStack align="start" spacing={2}>
                        {recipientOptions.map((item) => (
                          <Checkbox key={item._id} value={item._id}>
                            <Text fontSize="sm">
                              {item.name || "Unnamed"} ({item.type}) - {item.phone}
                            </Text>
                          </Checkbox>
                        ))}
                      </VStack>
                    </CheckboxGroup>
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
              </FormControl>
            </>
          )}

          {targetMode === "role" && (
            <FormControl isRequired>
              <FormLabel>Roles</FormLabel>
              <CheckboxGroup value={roles} onChange={(value) => setRoles(value as string[])}>
                <HStack spacing={4} align="start" flexWrap="wrap">
                  {roleOptions.map((role) => (
                    <Checkbox key={role} value={role} textTransform="capitalize">
                      {role}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
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
