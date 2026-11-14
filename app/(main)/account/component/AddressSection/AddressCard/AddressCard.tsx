import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
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
  const isDefault = !!address.isDefault;
  const id = address._id || address.id;

  // Theme tokens
  const cardBg = useColorModeValue(
    isDefault ? "purple.50" : "white",
    isDefault ? "whiteAlpha.100" : "whiteAlpha.50"
  );
  const cardBorder = useColorModeValue(
    isDefault ? "purple.300" : "gray.200",
    isDefault ? "purple.300" : "whiteAlpha.200"
  );
  const footerBorder = useColorModeValue(
    isDefault ? "purple.100" : "gray.100",
    "whiteAlpha.200"
  );
  const tileBg = useColorModeValue(
    isDefault ? "purple.100" : "gray.100",
    "whiteAlpha.200"
  );
  const tileColor = useColorModeValue(
    isDefault ? "purple.600" : "gray.500",
    isDefault ? "purple.200" : "gray.300"
  );
  const titleColor = useColorModeValue("gray.800", "white");
  const bodyColor = useColorModeValue("gray.600", "gray.300");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const actionColor = useColorModeValue("gray.700", "gray.200");
  const actionHoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");

  // Address lines
  const line1 = address.line1 || address.addressLine1;
  const line2 = address.line2 || address.addressLine2;
  const cityLine = [
    [address.city, address.state].filter(Boolean).join(", "),
    address.postalCode,
  ]
    .filter(Boolean)
    .join(" ");

  const onSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      await handleSetDefault(id);
    } finally {
      setIsSettingDefault(false);
    }
  };

  const divider = <Box w="1px" alignSelf="stretch" bg={footerBorder} />;

  return (
    <Flex
      direction="column"
      overflow="hidden"
      bg={cardBg}
      borderWidth={isDefault ? "2px" : "1px"}
      borderColor={cardBorder}
      rounded="2xl"
      minW={0}
    >
      {/* Body */}
      <Flex gap={3} p={4} flex={1}>
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

        <Box minW={0} flex={1}>
          <Flex align="center" justify="space-between" gap={2} wrap="wrap">
            <Text fontWeight="bold" fontSize="md" color={titleColor} noOfLines={1}>
              {address.name}
            </Text>
            {isDefault && (
              <Badge
                colorScheme="purple"
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

          {address.phone && (
            <Flex align="center" gap={1.5} mt={0.5} color={mutedColor}>
              <Icon as={FaPhoneAlt} boxSize={2.5} />
              <Text fontSize="sm">{address.phone}</Text>
            </Flex>
          )}

          <Box mt={2} fontSize="sm" lineHeight="tall" color={bodyColor}>
            {line1 && <Text>{line1}</Text>}
            {line2 && <Text>{line2}</Text>}
            {cityLine && <Text>{cityLine}</Text>}
            {address.country && <Text>{address.country}</Text>}
          </Box>
        </Box>
      </Flex>

      {/* Actions: full-width, 48px-tall tap targets */}
      <Flex borderTopWidth="1px" borderColor={footerBorder}>
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
          onClick={() => handleEdit(address)}
        >
          Edit
        </Button>

        {!isDefault && (
          <>
            {divider}
            <Button
              flex={1}
              h={12}
              px={2}
              rounded="none"
              variant="ghost"
              fontSize="sm"
              fontWeight={600}
              colorScheme="purple"
              leftIcon={<FaCheckCircle />}
              isLoading={isSettingDefault}
              _hover={{ bg: actionHoverBg }}
              onClick={onSetDefault}
            >
              Set default
            </Button>
          </>
        )}

        {divider}
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
          onClick={() => handleDelete(address)}
        >
          Delete
        </Button>
      </Flex>
    </Flex>
  );
};

export default AddressCard;