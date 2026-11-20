"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTrash,
} from "react-icons/fa";

type AddressCardProps = {
  address: any;
  handleEdit: (address: any) => void;
  handleSetDefault: (id: string) => void | Promise<void>;
  /** Receives the whole address object (the section needs its name + id) */
  handleDelete: (address: any) => void;
};

const AddressCard = ({
  address,
  handleEdit,
  handleSetDefault,
  handleDelete,
}: AddressCardProps) => {
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const isDefault = Boolean(address?.isDefault);
  const id = address?._id || address?.id;

  // Theme tokens - Light / Dark mode
  const cardBg = useColorModeValue("white", "var(--color-surface)");
  const cardBorder = useColorModeValue(
    isDefault ? "var(--color-primary)" : "gray.200",
    "var(--color-border)"
  );
  const footerBorder = useColorModeValue("gray.100", "var(--color-border)");
  const tileBg = useColorModeValue(
    isDefault ? "rgba(6, 95, 104, 0.07)" : "gray.50",
    "var(--color-surface-hover)"
  );
  const tileColor = useColorModeValue(
    "var(--color-primary)",
    isDefault ? "brand.300" : "var(--color-primary)"
  );
  const titleColor = useColorModeValue("gray.800", "var(--color-text)");
  const bodyColor = useColorModeValue("gray.600", "var(--color-text-muted)");
  const mutedColor = useColorModeValue("gray.500", "var(--color-text-muted)");
  const actionColor = useColorModeValue("gray.600", "var(--color-text)");
  const actionHoverBg = useColorModeValue("gray.50", "var(--color-surface-hover)");
  const deleteHoverBg = useColorModeValue("red.50", "rgba(229, 62, 62, 0.12)");

  const onSetDefault = useCallback(async () => {
    setIsSettingDefault(true);
    try {
      await handleSetDefault(id);
    } finally {
      setIsSettingDefault(false);
    }
  }, [handleSetDefault, id]);

  const onEdit = useCallback(() => {
    handleEdit(address);
  }, [address, handleEdit]);

  const onDelete = useCallback(() => {
    handleDelete(address);
  }, [address, handleDelete]);

  // Address lines
  const line1 = address?.line1 || address?.addressLine1;
  const line2 = address?.line2 || address?.addressLine2;

  const cityLine = useMemo(() => {
    return [
      [address?.city, address?.state].filter(Boolean).join(", "),
      address?.postalCode,
    ]
      .filter(Boolean)
      .join(" ");
  }, [address?.city, address?.postalCode, address?.state]);

  return (
    <Flex
      direction="column"
      overflow="hidden"
      bg={cardBg}
      borderWidth={isDefault ? "1.5px" : "1px"}
      borderColor={cardBorder}
      rounded="2xl"
      minW={0}
      transition="all 0.2s ease"
      _hover={{
        borderColor: isDefault ? "var(--color-primary)" : "gray.300",
        shadow: "sm",
      }}
    >
      {/* Body */}
      <Flex gap={3} p={4} flex={1}>
        {/* Location Icon */}
        <Flex
          boxSize={10}
          flexShrink={0}
          align="center"
          justify="center"
          rounded="xl"
          bg={tileBg}
          color={tileColor}
        >
          <Icon as={FaMapMarkerAlt} boxSize={4} />
        </Flex>

        {/* Address Details */}
        <Box minW={0} flex={1}>
          <Flex
            align="center"
            justify="space-between"
            gap={2}
            wrap="wrap"
          >
            <Text
              fontWeight="bold"
              fontSize="md"
              color={titleColor}
              noOfLines={1}
            >
              {address?.name}
            </Text>

            {isDefault && (
              <Badge
                colorScheme="brand"
                variant="solid"
                rounded="full"
                px={2.5}
                py={0.5}
                fontSize="xs"
                textTransform="none"
                display="inline-flex"
                alignItems="center"
                gap={1}
              >
                <Icon as={FaCheckCircle} boxSize={2.5} />
                Default
              </Badge>
            )}
          </Flex>

          {/* Phone */}
          {address?.phone && (
            <Flex
              align="center"
              gap={1.5}
              mt={0.5}
              color={mutedColor}
            >
              <Icon as={FaPhoneAlt} boxSize={2.5} />
              <Text fontSize="sm">
                {address.phone}
              </Text>
            </Flex>
          )}

          {/* Address */}
          <Box
            mt={2}
            fontSize="sm"
            lineHeight="tall"
            color={bodyColor}
          >
            {line1 && <Text>{line1}</Text>}
            {line2 && <Text>{line2}</Text>}
            {cityLine && <Text>{cityLine}</Text>}
            {address?.country && (
              <Text>{address.country}</Text>
            )}
          </Box>
        </Box>
      </Flex>

      {/* Actions */}
      <Flex
        borderTopWidth="1px"
        borderColor={footerBorder}
        bg={cardBg}
      >
        {/* Edit */}
        <Button
          flex={1}
          h={12}
          px={2}
          rounded="none"
          variant="ghost"
          fontSize="sm"
          fontWeight={600}
          color={actionColor}
          leftIcon={<FaEdit />}
          _hover={{ bg: actionHoverBg }}
          onClick={onEdit}
        >
          Edit
        </Button>

        {/* Set Default */}
        {!isDefault && (
          <>
            <Box w="1px" alignSelf="stretch" bg={footerBorder} />
            <Button
              flex={1}
              h={12}
              px={2}
              rounded="none"
              variant="ghost"
              fontSize="sm"
              fontWeight={600}
              colorScheme="brand"
              leftIcon={<FaCheckCircle />}
              isLoading={isSettingDefault}
              _hover={{ bg: actionHoverBg }}
              onClick={onSetDefault}
            >
              Set default
            </Button>
          </>
        )}

        <Box w="1px" alignSelf="stretch" bg={footerBorder} />

        {/* Delete */}
        <Button
          flex={1}
          h={12}
          px={2}
          rounded="none"
          variant="ghost"
          fontSize="sm"
          fontWeight={600}
          colorScheme="red"
          leftIcon={<FaTrash />}
          _hover={{ bg: deleteHoverBg }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Flex>
    </Flex>
  );
};

export default memo(AddressCard);
