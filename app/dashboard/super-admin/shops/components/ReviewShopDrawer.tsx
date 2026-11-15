"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Collapse,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  // keyframes,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiEdit3,
  FiFileText,
  FiGlobe,
  FiHash,
  FiImage,
  FiInbox,
  FiMail,
  FiMapPin,
  FiPauseCircle,
  FiPhone,
  FiSlash,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import { keyframes } from "@emotion/react";

type ReviewAction = "approve" | "request_changes" | "reject";
type VisibilityAction = "active" | "inactive" | "suspended";

interface ReviewShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shop: any;
  onSubmit: (action: ReviewAction, remarks: string) => Promise<void> | void;
  onVisibilitySubmit: (status: VisibilityAction, remarks: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const enter = (delay = 0) => `${fadeIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`;

const getReviewStatusColor = (status?: string) => {
  switch (status) {
    case "approved":
      return "green";
    case "changes_requested":
      return "orange";
    case "rejected":
      return "red";
    default:
      return "purple";
  }
};

const getShopStatusColor = (status?: string) => {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "gray";
    case "suspended":
      return "red";
    default:
      return "orange";
  }
};

const toLabel = (value?: string) =>
  value ? value.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Pending";

const formatDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const getStatusMeta = (status?: string) => {
  switch (status) {
    case "approved":
      return { scheme: "green", icon: FiCheckCircle, title: "Approved" };
    case "changes_requested":
      return { scheme: "orange", icon: FiEdit3, title: "Changes requested" };
    case "rejected":
      return { scheme: "red", icon: FiXCircle, title: "Rejected" };
    default:
      return { scheme: "purple", icon: FiInbox, title: "Awaiting your review" };
  }
};

const useReviewTheme = () => ({
  pageBg: useColorModeValue("gray.50", "gray.900"),
  cardBg: useColorModeValue("white", "gray.800"),
  border: useColorModeValue("gray.100", "whiteAlpha.200"),
  text: useColorModeValue("gray.800", "gray.100"),
  muted: useColorModeValue("gray.500", "gray.400"),
  soft: useColorModeValue("gray.50", "whiteAlpha.100"),
  accent: useColorModeValue("brand.600", "brand.300"),
});

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const SectionCard = ({
  title,
  icon,
  right,
  children,
  delay = 0,
  ...props
}: {
  title?: string;
  icon?: any;
  right?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  [key: string]: any;
}) => {
  const t = useReviewTheme();
  return (
    <Box
      bg={t.cardBg}
      border="1px solid"
      borderColor={t.border}
      borderRadius="20px"
      p={{ base: 4, md: 5 }}
      boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
      animation={enter(delay)}
      {...props}
    >
      {title ? (
        <Flex justify="space-between" align="center" gap={2} mb={3}>
          <HStack spacing={2} minW={0}>
            {icon ? <Icon as={icon} boxSize={3.5} color={t.accent} /> : null}
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={t.muted}>
              {title}
            </Text>
          </HStack>
          {right}
        </Flex>
      ) : null}
      {children}
    </Box>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  href,
  scheme = "brand",
  external,
  muted,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  href?: string;
  scheme?: string;
  external?: boolean;
  muted?: boolean;
}) => {
  const t = useReviewTheme();
  const tint = useColorModeValue(`${scheme}.50`, `${scheme}.900`);
  const tintColor = useColorModeValue(`${scheme}.600`, `${scheme}.200`);

  const body = (
    <Flex
      align="center"
      gap={3}
      py={2}
      px={1}
      borderRadius="12px"
      transition="background 0.2s ease"
      _hover={href ? { bg: t.soft } : undefined}
    >
      <Circle size="8" bg={tint} flexShrink={0}>
        <Icon as={icon} boxSize={3.5} color={tintColor} />
      </Circle>
      <Box minW={0} flex="1">
        <Text fontSize="xs" color={t.muted} lineHeight="1.2">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="600" color={muted ? t.muted : t.text} noOfLines={2} wordBreak="break-word">
          {value}
        </Text>
      </Box>
    </Flex>
  );

  return href ? (
    <Link href={href} isExternal={external} _hover={{ textDecoration: "none" }} display="block">
      {body}
    </Link>
  ) : (
    body
  );
};

const StatusBadge = ({ scheme, children }: { scheme: string; children: React.ReactNode }) => (
  <Badge
    px={2}
    py={0.5}
    borderRadius="full"
    colorScheme={scheme}
    variant="subtle"
    fontSize="10px"
    textTransform="none"
    fontWeight="700"
  >
    {children}
  </Badge>
);

const EmptyNote = ({ icon, text }: { icon: any; text: string }) => {
  const t = useReviewTheme();
  return (
    <Flex direction="column" align="center" gap={2} py={6}>
      <Circle size="10" bg={t.soft}>
        <Icon as={icon} boxSize={4} color={t.muted} />
      </Circle>
      <Text fontSize="sm" color={t.muted}>
        {text}
      </Text>
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/* Status banner (header footer)                                       */
/* ------------------------------------------------------------------ */

const StatusBanner = ({ status, submittedAt }: { status?: string; submittedAt?: string }) => {
  const meta = getStatusMeta(status);
  const bg = useColorModeValue(`${meta.scheme}.50`, `${meta.scheme}.900`);
  const color = useColorModeValue(`${meta.scheme}.700`, `${meta.scheme}.200`);
  const sub = useColorModeValue(`${meta.scheme}.600`, `${meta.scheme}.300`);
  const circleBg = useColorModeValue("white", "whiteAlpha.200");

  return (
    <Flex align="center" gap={3} bg={bg} borderRadius="14px" px={3} py={2.5}>
      <Circle size="9" bg={circleBg} flexShrink={0}>
        <Icon as={meta.icon} boxSize={4} color={color} />
      </Circle>
      <Box minW={0}>
        <Text fontSize="sm" fontWeight="700" color={color} lineHeight="1.2">
          {meta.title}
        </Text>
        <Text fontSize="xs" color={sub} mt={0.5} noOfLines={1}>
          Submitted {submittedAt ? formatDate(submittedAt) : "recently"}
        </Text>
      </Box>
    </Flex>
  );
};

/* ------------------------------------------------------------------ */
/* Checklist                                                           */
/* ------------------------------------------------------------------ */

type CheckItem = { label: string; ok: boolean; note?: string };

const CheckChip = ({ item }: { item: CheckItem }) => {
  const okBg = useColorModeValue("green.50", "whiteAlpha.100");
  const badBg = useColorModeValue("red.50", "whiteAlpha.100");
  const okColor = useColorModeValue("green.600", "green.300");
  const badColor = useColorModeValue("red.500", "red.300");
  const t = useReviewTheme();

  return (
    <Flex align="center" gap={2} px={2.5} py={2} borderRadius="12px" bg={item.ok ? okBg : badBg} minW={0}>
      <Circle size="18px" bg={item.ok ? okColor : badColor} flexShrink={0}>
        <Icon as={item.ok ? FiCheck : FiX} boxSize="11px" color="white" />
      </Circle>
      <Text fontSize="xs" fontWeight="600" color={t.text} noOfLines={1}>
        {item.label}
        {item.note ? (
          <Text as="span" color={t.muted} fontWeight="500">
            {" "}
            {item.note}
          </Text>
        ) : null}
      </Text>
    </Flex>
  );
};

// const Checklist = ({ items }: { items: CheckItem[] }) => {
//   const t = useReviewTheme();
//   const done = items.filter((i) => i.ok).length;
//   const pct = Math.round((done / items.length) * 100);
//   const scheme = pct >= 75 ? "green" : pct >= 50 ? "orange" : "red";
//   const [width, setWidth] = useState(0);

//   useEffect(() => {
//     const timer = setTimeout(() => setWidth(pct), 150);
//     return () => clearTimeout(timer);
//   }, [pct]);

//   return (
//     <SectionCard
//       title="Submission checklist"
//       icon={FiCheckCircle}
//       delay={60}
//       right={
//         <Text fontSize="xs" fontWeight="800" color={`${scheme}.500`}>
//           {done}/{items.length} complete
//         </Text>
//       }
//     >
//       <Box h="6px" borderRadius="full" bg={t.soft} overflow="hidden" mb={3}>
//         <Box
//           h="full"
//           w={`${width}%`}
//           borderRadius="full"
//           bg={`${scheme}.400`}
//           transition="width 0.9s cubic-bezier(0.22, 1, 0.36, 1)"
//         />
//       </Box>
//       <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
//         {items.map((item) => (
//           <CheckChip key={item.label} item={item} />
//         ))}
//       </SimpleGrid>
//     </SectionCard>
//   );
// };

/* ------------------------------------------------------------------ */
/* Decision dock (sticky bottom)                                       */
/* ------------------------------------------------------------------ */

type DockOption = {
  value: string;
  label: string;
  icon: any;
  scheme: string;
  requireRemarks: boolean;
  confirm: string;
  placeholder: string;
};

const reviewOptions: DockOption[] = [
  {
    value: "approve",
    label: "Approve",
    icon: FiCheck,
    scheme: "green",
    requireRemarks: false,
    confirm: "Approve shop",
    placeholder: "Add approval notes (optional)...",
  },
  {
    value: "request_changes",
    label: "Changes",
    icon: FiEdit3,
    scheme: "orange",
    requireRemarks: true,
    confirm: "Send change request",
    placeholder: "Tell the seller what needs to change...",
  },
  {
    value: "reject",
    label: "Reject",
    icon: FiX,
    scheme: "red",
    requireRemarks: true,
    confirm: "Reject submission",
    placeholder: "Explain why this submission is rejected...",
  },
];

const visibilityOptions: DockOption[] = [
  {
    value: "active",
    label: "Activate",
    icon: FiCheckCircle,
    scheme: "green",
    requireRemarks: false,
    confirm: "Activate shop",
    placeholder: "Add an optional note for the seller...",
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: FiPauseCircle,
    scheme: "gray",
    requireRemarks: false,
    confirm: "Mark inactive",
    placeholder: "Add an optional note for the seller...",
  },
  {
    value: "suspended",
    label: "Suspend",
    icon: FiSlash,
    scheme: "red",
    requireRemarks: false,
    confirm: "Suspend shop",
    placeholder: "Reason for suspension (shared with the seller)...",
  },
];

const DockOptionButton = ({
  option,
  selected,
  disabled,
  current,
  onClick,
}: {
  option: DockOption;
  selected: boolean;
  disabled: boolean;
  current?: boolean;
  onClick: () => void;
}) => {
  const t = useReviewTheme();
  const tint = useColorModeValue(`${option.scheme}.50`, `${option.scheme}.900`);
  const strong = useColorModeValue(`${option.scheme}.500`, `${option.scheme}.300`);

  return (
    <Flex
      as="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      direction="column"
      align="center"
      justify="center"
      gap={1}
      h="58px"
      borderRadius="16px"
      border="1.5px solid"
      borderColor={selected ? strong : t.border}
      bg={selected ? tint : t.cardBg}
      opacity={disabled && !selected ? 0.5 : 1}
      cursor={disabled ? "not-allowed" : "pointer"}
      transition="all 0.2s ease"
      _hover={disabled ? undefined : { borderColor: strong, transform: "translateY(-1px)" }}
      _active={disabled ? undefined : { transform: "scale(0.96)" }}
    >
      <Icon as={option.icon} boxSize={4} color={strong} />
      <Text fontSize="xs" fontWeight="700" color={selected ? strong : t.text}>
        {current ? "Current" : option.label}
      </Text>
    </Flex>
  );
};

const DecisionDock = ({
  shop,
  canReview,
  isSubmitting,
  onSubmit,
  onVisibilitySubmit,
}: {
  shop: any;
  canReview: boolean;
  isSubmitting: boolean;
  onSubmit: ReviewShopDrawerProps["onSubmit"];
  onVisibilitySubmit: ReviewShopDrawerProps["onVisibilitySubmit"];
}) => {
  const t = useReviewTheme();
  const [mode, setMode] = useState<"review" | "visibility">(canReview ? "review" : "visibility");
  const [selected, setSelected] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string>(shop?.reviewRemarks || "");
  const [busy, setBusy] = useState<string | null>(null);
  const lastOption = useRef<DockOption | null>(null);

  useEffect(() => {
    setMode(canReview ? "review" : "visibility");
    setSelected(null);
    setRemarks(shop?.reviewRemarks || "");
    setBusy(null);
  }, [shop, canReview]);

  const options = mode === "review" ? reviewOptions : visibilityOptions;
  const current = options.find((o) => o.value === selected) || null;
  if (current) lastOption.current = current;
  const shown = current || lastOption.current;
  const remarksMissing = Boolean(current?.requireRemarks) && !remarks.trim();

  const confirm = async () => {
    if (!current) return;
    setBusy(current.value);
    try {
      if (mode === "review") {
        await onSubmit(current.value as ReviewAction, remarks);
      } else {
        await onVisibilitySubmit(current.value as VisibilityAction, remarks);
      }
    } finally {
      setBusy(null);
    }
  };

  const switchMode = (next: "review" | "visibility") => {
    setMode(next);
    setSelected(null);
  };

  const toggleStyles = (active: boolean) => ({
    px: 3,
    h: "26px",
    fontSize: "xs",
    fontWeight: "700",
    borderRadius: "full",
    bg: active ? t.cardBg : "transparent",
    color: active ? t.text : t.muted,
    boxShadow: active ? "0 1px 3px rgba(15, 23, 42, 0.12)" : "none",
    transition: "all 0.2s ease",
  });

  return (
    <Box
      position="sticky"
      bottom={0}
      zIndex={10}
      mx={{ base: -3, sm: -4, md: 0 }}
      mt={4}
      px={{ base: 3, sm: 4, md: 4 }}
      pt={3}
      pb="calc(12px + env(safe-area-inset-bottom))"
      bg={t.cardBg}
      borderTop="1px solid"
      borderColor={t.border}
      borderTopRadius="22px"
      boxShadow="0 -10px 30px rgba(15, 23, 42, 0.08)"
    >
      <Flex justify="space-between" align="center" mb={2.5} gap={2}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={t.muted}>
          {mode === "review" ? "Your decision" : "Visibility"}
        </Text>
        {canReview ? (
          <HStack spacing={0.5} p={0.5} bg={t.soft} borderRadius="full">
            <Box as="button" type="button" onClick={() => switchMode("review")} {...toggleStyles(mode === "review")}>
              Review
            </Box>
            <Box as="button" type="button" onClick={() => switchMode("visibility")} {...toggleStyles(mode === "visibility")}>
              Visibility
            </Box>
          </HStack>
        ) : (
          <StatusBadge scheme="green">Review completed</StatusBadge>
        )}
      </Flex>

      <SimpleGrid columns={3} spacing={2}>
        {options.map((opt) => {
          const isCurrentStatus = mode === "visibility" && shop.shopStatus === opt.value;
          return (
            <DockOptionButton
              key={opt.value}
              option={opt}
              selected={selected === opt.value}
              current={isCurrentStatus}
              disabled={isCurrentStatus || isSubmitting}
              onClick={() => setSelected((prev) => (prev === opt.value ? null : opt.value))}
            />
          );
        })}
      </SimpleGrid>

      <Collapse in={Boolean(current)} animateOpacity>
        {shown ? (
          <Box pt={3}>
            <Textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder={shown.placeholder}
              rows={3}
              minH="84px"
              resize="none"
              borderRadius="14px"
              fontSize={{ base: "16px", md: "sm" }}
              bg={t.soft}
              borderColor={t.border}
              _focusVisible={{ bg: t.cardBg, borderColor: `${shown.scheme}.400`, boxShadow: "none" }}
            />
            <Flex align="center" gap={1.5} mt={1.5} minH="18px">
              {shown.requireRemarks ? (
                <>
                  <Icon as={FiAlertCircle} boxSize={3} color={remarksMissing ? "orange.500" : t.muted} />
                  <Text fontSize="xs" color={remarksMissing ? "orange.500" : t.muted}>
                    Remarks are required and visible to the seller.
                  </Text>
                </>
              ) : (
                <Text fontSize="xs" color={t.muted}>
                  Remarks are optional and included in the seller update.
                </Text>
              )}
            </Flex>
            <Button
              w="full"
              h="46px"
              mt={2}
              borderRadius="14px"
              colorScheme={shown.scheme}
              leftIcon={<Icon as={shown.icon} />}
              onClick={confirm}
              isLoading={(isSubmitting || busy !== null) && busy === shown.value}
              isDisabled={remarksMissing || (isSubmitting && busy !== shown.value)}
              boxShadow="0 8px 20px rgba(0, 0, 0, 0.12)"
              _active={{ transform: "scale(0.98)" }}
            >
              {shown.confirm}
            </Button>
          </Box>
        ) : null}
      </Collapse>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const ReviewShopDrawer: React.FC<ReviewShopDrawerProps> = ({
  isOpen,
  onClose,
  shop,
  onSubmit,
  onVisibilitySubmit,
  isSubmitting = false,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const t = useReviewTheme();
  const [descExpanded, setDescExpanded] = useState(false);
  const [preview, setPreview] = useState<{ url: string; label?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDescExpanded(false);
      setPreview(null);
    }
  }, [isOpen, shop]);

  const galleryUrls: string[] = useMemo(
    () => (Array.isArray(shop?.gallery) ? shop.gallery.map((item: any) => item?.file?.url).filter(Boolean) : []),
    [shop]
  );

  const media = useMemo(
    () =>
      [
        shop?.logo?.url ? { url: shop.logo.url, label: "Logo" } : null,
        shop?.coverImage?.url ? { url: shop.coverImage.url, label: "Cover" } : null,
        ...galleryUrls.map((url, i) => ({ url, label: `Gallery ${i + 1}` })),
      ].filter(Boolean) as { url: string; label: string }[],
    [shop, galleryUrls]
  );

  const checks: CheckItem[] = useMemo(() => {
    const loc = shop?.location || {};
    const phone = shop?.ownerContact?.phone || shop?.contactInfo?.phone;
    const email = shop?.contactInfo?.email || shop?.ownerContact?.email;
    return [
      { label: "Logo", ok: Boolean(shop?.logo?.url) },
      { label: "Cover", ok: Boolean(shop?.coverImage?.url) },
      { label: "Gallery", ok: galleryUrls.length > 0, note: galleryUrls.length ? `(${galleryUrls.length})` : undefined },
      { label: "Description", ok: Boolean(shop?.description) },
      { label: "GST number", ok: Boolean(shop?.gstNumber) },
      { label: "Contact", ok: Boolean(phone || email) },
      { label: "Address", ok: Boolean(loc.address && (loc.city || loc.state)) },
      { label: "Map pin", ok: Array.isArray(loc.coordinates) && loc.coordinates.length >= 2 },
    ];
  }, [shop, galleryUrls]);

  if (!shop) return null;

  const primaryPhone = shop.ownerContact?.phone || shop.contactInfo?.phone;
  const primaryEmail = shop.contactInfo?.email || shop.ownerContact?.email;
  const website = shop.contactInfo?.website;
  const loc = shop.location || {};
  const cityLine = [loc.city, loc.state, loc.postalCode].filter(Boolean).join(", ");
  const hasCoords = Array.isArray(loc.coordinates) && loc.coordinates.length >= 2;
  const canReview = shop.reviewStatus !== "approved";
  const description: string = shop.description || "";
  const history: any[] = Array.isArray(shop.statusHistory) ? [...shop.statusHistory].reverse() : [];
  const statusMeta = getStatusMeta(shop.reviewStatus);

  const tabStyles = {
    flex: 1,
    px: 2,
    py: 2,
    fontSize: "sm",
    fontWeight: "600",
    color: t.muted,
    borderRadius: "full",
    whiteSpace: "nowrap" as const,
    transition: "all 0.2s ease",
    _selected: { bg: "brand.600", color: "white", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.26)" },
    _hover: { color: t.text },
    _focusVisible: { boxShadow: "outline" },
  };

  const drawerContent = (
    <Box bg={t.pageBg} minH="100%">
      <Stack spacing={{ base: 3, md: 4 }}>
        {/* Header card */}
        <Box
          bg={t.cardBg}
          border="1px solid"
          borderColor={t.border}
          borderRadius="22px"
          overflow="hidden"
          boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
          animation={enter(0)}
        >
          <Box
            h={{ base: "84px", md: "112px" }}
            position="relative"
            bgGradient={`linear(to-br, ${statusMeta.scheme}.400, brand.500)`}
          >
            {shop.coverImage?.url ? (
              <>
                <Image src={shop.coverImage.url} alt="Cover" w="100%" h="100%" objectFit="cover" />
                <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.400, transparent 70%)" />
              </>
            ) : (
              <Box
                position="absolute"
                inset={0}
                opacity={0.3}
                bgGradient="radial(circle at 85% 15%, whiteAlpha.800, transparent 55%)"
              />
            )}
          </Box>

          <Box px={{ base: 4, md: 5 }} pb={4}>
            <Flex align="flex-end" gap={3} mt={{ base: "-28px", md: "-36px" }} position="relative">
              <Avatar
                name={shop.name}
                src={shop.logo?.url}
                boxSize={{ base: "60px", md: "76px" }}
                bg="brand.500"
                color="white"
                border="3px solid"
                borderColor={t.cardBg}
                boxShadow="0 6px 18px rgba(15, 23, 42, 0.16)"
                flexShrink={0}
              />
              <HStack spacing={1.5} pb={1} flexWrap="wrap" rowGap={1.5} minW={0}>
                <StatusBadge scheme="gray">{shop.companyCode || "No code"}</StatusBadge>
                <StatusBadge scheme={getShopStatusColor(shop.shopStatus)}>{toLabel(shop.shopStatus)}</StatusBadge>
              </HStack>
            </Flex>

            <Text
              mt={2.5}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="800"
              letterSpacing="-0.02em"
              lineHeight="1.2"
              color={t.text}
              noOfLines={2}
            >
              {shop.name}
            </Text>

            <Box mt={3}>
              <StatusBanner status={shop.reviewStatus} submittedAt={shop.createdAt} />
            </Box>
          </Box>
        </Box>

        {/* Checklist */}
        {/* <Checklist items={checks} /> */}

        {/* Tabs */}
        <Tabs variant="unstyled" isLazy>
          <Box position="sticky" top={0} zIndex={5} py={1.5} bg={t.pageBg}>
            <TabList
              gap={1}
              p={1}
              bg={t.cardBg}
              border="1px solid"
              borderColor={t.border}
              borderRadius="full"
              boxShadow="0 4px 14px rgba(15, 23, 42, 0.05)"
            >
              <Tab {...tabStyles}>Details</Tab>
              <Tab {...tabStyles}>Media{media.length ? ` · ${media.length}` : ""}</Tab>
              <Tab {...tabStyles}>History{history.length ? ` · ${history.length}` : ""}</Tab>
            </TabList>
          </Box>

          <TabPanels>
            {/* Details */}
            <TabPanel px={0} pt={2} pb={0}>
              <Stack spacing={{ base: 3, md: 4 }}>
                <SectionCard title="About" icon={FiFileText}>
                  <Text
                    fontSize="sm"
                    color={description ? t.text : t.muted}
                    lineHeight="1.75"
                    whiteSpace="pre-line"
                    noOfLines={descExpanded ? undefined : 4}
                  >
                    {description || "No description provided."}
                  </Text>
                  {description.length > 200 ? (
                    <Button
                      variant="link"
                      size="xs"
                      colorScheme="brand"
                      mt={2}
                      rightIcon={<Icon as={descExpanded ? FiChevronUp : FiChevronDown} />}
                      onClick={() => setDescExpanded((v) => !v)}
                    >
                      {descExpanded ? "Show less" : "Read more"}
                    </Button>
                  ) : null}
                </SectionCard>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
                  <SectionCard title="Business & Contact" icon={FiHash} h="fit-content">
                    <VStack align="stretch" spacing={0}>
                      <InfoRow icon={FiHash} label="GST number" value={shop.gstNumber || "Not provided"} muted={!shop.gstNumber} scheme="purple" />
                      <InfoRow
                        icon={FiPhone}
                        label="Phone"
                        value={primaryPhone || "No phone"}
                        href={primaryPhone ? `tel:${primaryPhone}` : undefined}
                        muted={!primaryPhone}
                        scheme="green"
                      />
                      <InfoRow
                        icon={FiMail}
                        label="Email"
                        value={primaryEmail || "No email"}
                        href={primaryEmail ? `mailto:${primaryEmail}` : undefined}
                        muted={!primaryEmail}
                        scheme="orange"
                      />
                      <InfoRow
                        icon={FiGlobe}
                        label="Website"
                        value={website || "Not provided"}
                        href={website || undefined}
                        external
                        muted={!website}
                        scheme="brand"
                      />
                    </VStack>
                  </SectionCard>

                  <SectionCard title="Location" icon={FiMapPin} h="fit-content">
                    <VStack align="stretch" spacing={0}>
                      <InfoRow icon={FiMapPin} label="Address" value={loc.address || "Address not provided"} muted={!loc.address} scheme="red" />
                      <InfoRow icon={FiMapPin} label="City / State / Postal" value={cityLine || "Missing"} muted={!cityLine} scheme="red" />
                      <InfoRow icon={FiMapPin} label="Country" value={loc.country || "Not provided"} muted={!loc.country} scheme="red" />
                      {hasCoords ? (
                        <InfoRow
                          icon={FiMapPin}
                          label="Coordinates"
                          value={`${loc.coordinates[1]}, ${loc.coordinates[0]}`}
                          href={`https://www.google.com/maps/search/?api=1&query=${loc.coordinates[1]},${loc.coordinates[0]}`}
                          external
                          scheme="red"
                        />
                      ) : null}
                    </VStack>
                  </SectionCard>
                </SimpleGrid>
              </Stack>
            </TabPanel>

            {/* Media */}
            <TabPanel px={0} pt={2} pb={0}>
              <SectionCard title="Uploaded media" icon={FiImage} p={{ base: 3, md: 4 }}>
                {media.length > 0 ? (
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 2, md: 3 }}>
                    {media.map((item, index) => (
                      <Box
                        key={`${item.url}-${index}`}
                        as="button"
                        type="button"
                        onClick={() => setPreview(item)}
                        position="relative"
                        overflow="hidden"
                        borderRadius="16px"
                        sx={{ aspectRatio: "1 / 1" }}
                        bg={t.soft}
                        role="group"
                        transition="transform 0.2s ease"
                        _active={{ transform: "scale(0.97)" }}
                        animation={enter(index * 40)}
                      >
                        <Image
                          src={item.url}
                          alt={`${shop.name} ${item.label}`}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          transition="transform 0.4s ease"
                          _groupHover={{ transform: "scale(1.06)" }}
                        />
                        <Box
                          position="absolute"
                          left={0}
                          right={0}
                          bottom={0}
                          px={2.5}
                          py={2}
                          bgGradient="linear(to-t, blackAlpha.700, transparent)"
                        >
                          <Text color="white" fontSize="xs" fontWeight="700" textAlign="left">
                            {item.label}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <EmptyNote icon={FiImage} text="No images uploaded yet." />
                )}
              </SectionCard>
            </TabPanel>

            {/* History */}
            <TabPanel px={0} pt={2} pb={0}>
              <SectionCard title="Review history" icon={FiClock}>
                {history.length > 0 ? (
                  <Box>
                    {history.map((item: any, index: number) => {
                      const isLast = index === history.length - 1;
                      const scheme = getShopStatusColor(item.status);
                      return (
                        <Flex key={`${item.updatedAt || index}-${index}`} gap={3} animation={enter(index * 50)}>
                          <Flex direction="column" align="center" flexShrink={0} pt={1}>
                            <Circle
                              size={index === 0 ? "14px" : "10px"}
                              bg={`${scheme}.400`}
                              mt={index === 0 ? 0 : "2px"}
                              boxShadow={index === 0 ? `0 0 0 4px var(--chakra-colors-${scheme}-100)` : "none"}
                            />
                            {!isLast && <Box w="2px" flex="1" bg={t.border} my={1} borderRadius="full" />}
                          </Flex>
                          <Box flex="1" minW={0} pb={isLast ? 0 : 4}>
                            <HStack spacing={1.5} flexWrap="wrap" rowGap={1.5}>
                              <StatusBadge scheme={scheme}>{toLabel(item.status)}</StatusBadge>
                              {item.reviewStatus ? (
                                <StatusBadge scheme={getReviewStatusColor(item.reviewStatus)}>
                                  {toLabel(item.reviewStatus)}
                                </StatusBadge>
                              ) : null}
                            </HStack>
                            <Text fontSize="xs" color={t.muted} mt={1}>
                              {item.updatedAt ? formatDate(item.updatedAt) : "Unknown time"}
                            </Text>
                            {item.remarks ? (
                              <Box mt={2} bg={t.soft} p={2.5} borderRadius="10px" borderLeft="3px solid" borderColor="brand.300">
                                <Text fontSize="sm" color={t.text} lineHeight="1.6">
                                  {item.remarks}
                                </Text>
                              </Box>
                            ) : null}
                          </Box>
                        </Flex>
                      );
                    })}
                  </Box>
                ) : (
                  <EmptyNote icon={FiClock} text="No review history yet." />
                )}
              </SectionCard>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>

      {/* Sticky decision dock */}
      <DecisionDock
        shop={shop}
        canReview={canReview}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onVisibilitySubmit={onVisibilitySubmit}
      />

      {/* Image preview */}
      <Modal isOpen={Boolean(preview)} onClose={() => setPreview(null)} isCentered size={{ base: "full", md: "4xl" }}>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
        <ModalContent bg="transparent" boxShadow="none" m={0}>
          <ModalCloseButton color="white" top={4} right={4} zIndex={2} bg="blackAlpha.600" borderRadius="full" />
          <Flex direction="column" align="center" justify="center" h="full" p={4} gap={3} onClick={() => setPreview(null)}>
            {preview ? (
              <Image
                src={preview.url}
                alt={preview.label || "Preview"}
                maxH="80vh"
                maxW="100%"
                objectFit="contain"
                borderRadius="16px"
              />
            ) : null}
            {preview?.label ? (
              <Text color="white" fontWeight="600" fontSize="sm">
                {preview.label}
              </Text>
            ) : null}
          </Flex>
        </ModalContent>
      </Modal>
    </Box>
  );

  if (isMobile) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="Review Shop Submission"
        size="full"
        bodyProps={{ px: { base: 3, sm: 4 }, pt: 3, pb: 0, bg: t.pageBg }}
      >
        {drawerContent}
      </BottomSheetDrawer>
    );
  }

  return (
    <CustomDrawer title="Review Shop Submission" open={isOpen} close={onClose} size="3xl">
      {drawerContent}
    </CustomDrawer>
  );
};

export default ReviewShopDrawer;