import {
    Avatar,
    Badge,
    Box,
    Button,
    Circle,
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
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useBreakpointValue,
    useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React, { useMemo, useState } from "react";
import {
    FiClock,
    FiExternalLink,
    FiGlobe,
    FiHash,
    FiImage,
    FiInfo,
    FiMail,
    FiMapPin,
    FiMessageSquare,
    FiNavigation,
    FiPhone,
    FiTag,
    FiUser,
} from "react-icons/fi";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

interface ShopViewProps {
    isOpen: boolean;
    onClose: () => void;
    shop: any;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const enter = (delay = 0) => `${fadeIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`;

const toLabel = (value?: string) =>
    value ? value.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Pending";

const reviewScheme = (status?: string) =>
    status === "approved" ? "green" : status === "changes_requested" ? "orange" : status === "rejected" ? "red" : "purple";

const shopScheme = (status?: string) => (status === "active" ? "green" : status === "suspended" ? "red" : "orange");

const formatDate = (value?: string) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const resolveMediaUrl = (item: any): string | null => {
    if (!item) return null;
    if (typeof item === "string") return item.trim() || null;
    if (item?.file?.url && typeof item.file.url === "string") return item.file.url;
    if (item?.url && typeof item.url === "string") return item.url;
    if (item?.file && typeof item.file === "string") return item.file;
    return null;
};

const useShopTheme = () => ({
    pageBg: useColorModeValue("gray.50", "gray.900"),
    cardBg: useColorModeValue("white", "gray.800"),
    border: useColorModeValue("gray.100", "whiteAlpha.200"),
    text: useColorModeValue("gray.800", "gray.100"),
    muted: useColorModeValue("gray.500", "gray.400"),
    soft: useColorModeValue("gray.50", "whiteAlpha.100"),
    accent: useColorModeValue("brand.600", "brand.300"),
    accentBg: useColorModeValue("brand.50", "whiteAlpha.200"),
});

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const SectionCard = ({
    title,
    icon,
    children,
    delay = 0,
    right,
    ...props
}: {
    title?: string;
    icon?: any;
    children: React.ReactNode;
    delay?: number;
    right?: React.ReactNode;
    [key: string]: any;
}) => {
    const t = useShopTheme();
    return (
        <Box
            bg={t.cardBg}
            border="1px solid"
            borderColor={t.border}
            borderRadius="18px"
            p={{ base: 4, md: 5 }}
            boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
            animation={enter(delay)}
            {...props}
        >
            {title ? (
                <Flex justify="space-between" align="center" mb={3}>
                    <HStack spacing={2}>
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

/** Compact pill action: icon + label, ~32px tall */
const QuickAction = ({
    label,
    icon,
    href,
    scheme,
    external,
}: {
    label: string;
    icon: any;
    href: string;
    scheme: string;
    external?: boolean;
}) => {
    const t = useShopTheme();
    const tint = useColorModeValue(`${scheme}.50`, `${scheme}.900`);
    const tintColor = useColorModeValue(`${scheme}.600`, `${scheme}.200`);
    const hoverBorder = useColorModeValue(`${scheme}.200`, `${scheme}.700`);

    return (
        <Link
            href={href}
            isExternal={external}
            flexShrink={0}
            _hover={{ textDecoration: "none" }}
            _focusVisible={{ outline: "2px solid", outlineColor: t.accent, outlineOffset: "2px" }}
            borderRadius="full"
        >
            <HStack
                spacing={1.5}
                h="32px"
                pl={1.5}
                pr={3}
                bg={t.cardBg}
                border="1px solid"
                borderColor={t.border}
                borderRadius="full"
                transition="all 0.2s ease"
                _hover={{ borderColor: hoverBorder, bg: tint }}
                _active={{ transform: "scale(0.96)" }}
            >
                <Circle size="22px" bg={tint}>
                    <Icon as={icon} boxSize="12px" color={tintColor} />
                </Circle>
                <Text fontSize="xs" fontWeight="600" color={t.text} whiteSpace="nowrap">
                    {label}
                </Text>
            </HStack>
        </Link>
    );
};

const InfoRow = ({
    icon,
    label,
    value,
    href,
    scheme,
    external,
}: {
    icon: any;
    label: string;
    value: string;
    href?: string;
    scheme: string;
    external?: boolean;
}) => {
    const t = useShopTheme();
    const tint = useColorModeValue(`${scheme}.50`, `${scheme}.900`);
    const tintColor = useColorModeValue(`${scheme}.600`, `${scheme}.200`);

    const content = (
        <Flex
            align="center"
            gap={3}
            p={2}
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
                <Text fontSize="sm" fontWeight="600" color={t.text} noOfLines={1}>
                    {value}
                </Text>
            </Box>
            {href ? <Icon as={FiExternalLink} boxSize={3.5} color={t.muted} flexShrink={0} /> : null}
        </Flex>
    );

    return href ? (
        <Link href={href} isExternal={external} _hover={{ textDecoration: "none" }} display="block">
            {content}
        </Link>
    ) : (
        content
    );
};

const Chip = ({ children, tone = "brand" }: { children: React.ReactNode; tone?: string }) => (
    <Badge
        px={2.5}
        py={0.5}
        borderRadius="full"
        colorScheme={tone}
        variant="subtle"
        fontSize="xs"
        fontWeight="600"
        textTransform="none"
    >
        {children}
    </Badge>
);

const EmptyNote = ({ icon, text }: { icon: any; text: string }) => {
    const t = useShopTheme();
    return (
        <Flex direction="column" align="center" gap={3} py={8}>
            <Circle size="12" bg={t.soft}>
                <Icon as={icon} boxSize={5} color={t.muted} />
            </Circle>
            <Text fontSize="sm" color={t.muted} textAlign="center">
                {text}
            </Text>
        </Flex>
    );
};

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

const ShopView: React.FC<ShopViewProps> = ({ isOpen, onClose, shop }) => {
    // All hooks stay above early returns
    const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
    const t = useShopTheme();
    const [preview, setPreview] = useState<{ url: string; title?: string } | null>(null);

    // Collect all media comprehensively (Logo, Cover, and Gallery photos)
    const allMedia = useMemo(() => {
        if (!shop) return [];
        const list: { url: string; label: string; type: "logo" | "cover" | "gallery" }[] = [];

        const logoUrl = resolveMediaUrl(shop.logo) || resolveMediaUrl(shop.logoUrl);
        if (logoUrl) {
            list.push({ url: logoUrl, label: "Logo", type: "logo" });
        }

        const coverUrl =
            resolveMediaUrl(shop.coverImage) ||
            resolveMediaUrl(shop.coverImageUrl) ||
            resolveMediaUrl(shop.banner);
        if (coverUrl) {
            list.push({ url: coverUrl, label: "Cover Photo", type: "cover" });
        }

        if (Array.isArray(shop.gallery)) {
            shop.gallery.forEach((item: any, i: number) => {
                const url = resolveMediaUrl(item);
                if (url) {
                    const label = item?.title || item?.caption || item?.label || `Gallery ${i + 1}`;
                    list.push({ url, label, type: "gallery" });
                }
            });
        }

        return list;
    }, [shop]);

    if (!shop) return null;

    const logoUrl = resolveMediaUrl(shop.logo) || resolveMediaUrl(shop.logoUrl);
    const coverUrl =
        resolveMediaUrl(shop.coverImage) ||
        resolveMediaUrl(shop.coverImageUrl) ||
        resolveMediaUrl(shop.banner);

    const primaryPhone = shop.ownerContact?.phone || shop.contactInfo?.phone || shop.phone;
    const primaryEmail = shop.contactInfo?.email || shop.ownerContact?.email || shop.email;
    const website = shop.contactInfo?.website || shop.website;
    const ownerName =
        shop.ownerContact?.name ||
        shop.ownerName ||
        shop.owner?.name ||
        shop.seller?.name ||
        shop.userId?.name;

    const loc = shop.location || {};
    const fullAddress = [loc.address, loc.city, loc.state, loc.postalCode, loc.country].filter(Boolean).join(", ");
    const hasCoords = Array.isArray(loc.coordinates) && loc.coordinates.length >= 2;
    const mapsUrl = hasCoords
        ? `https://www.google.com/maps/search/?api=1&query=${loc.coordinates[1]},${loc.coordinates[0]}`
        : fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
        : "";

    const quickActions = [
        primaryPhone && { label: "Call", icon: FiPhone, href: `tel:${primaryPhone}`, scheme: "green", external: false },
        primaryEmail && { label: "Email", icon: FiMail, href: `mailto:${primaryEmail}`, scheme: "orange", external: false },
        website && { label: "Website", icon: FiGlobe, href: website, scheme: "brand", external: true },
        mapsUrl && { label: "Directions", icon: FiNavigation, href: mapsUrl, scheme: "red", external: true },
    ].filter(Boolean) as any[];

    const hasCategories = Array.isArray(shop.categories) && shop.categories.length > 0;
    const hasTags = Array.isArray(shop.tags) && shop.tags.length > 0;
    const history: any[] = Array.isArray(shop.statusHistory) ? [...shop.statusHistory].reverse() : [];
    const reviewRemarks = shop.reviewRemarks || shop.remarks;
    const hasRatings = Boolean(shop.ratings?.averageRating || shop.ratings?.totalRatings);

    const tabStyles = {
        flex: { base: 1, md: "none" },
        px: { base: 2, md: 4 },
        py: 1.5,
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

    const drawerBody = (
        <Box bg={t.pageBg} minH="100%" pb="calc(20px + env(safe-area-inset-bottom))">
            {/* Cover Banner */}
            <Box h={{ base: "110px", md: "175px" }} position="relative" overflow="hidden" bgGradient="linear(to-br, brand.500, purple.500)">
                {coverUrl ? (
                    <>
                        <Image src={coverUrl} alt="Shop Cover" w="100%" h="100%" objectFit="cover" />
                        <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.600, transparent 65%)" />
                    </>
                ) : (
                    <Box position="absolute" inset={0} opacity={0.25} bgGradient="radial(circle at 80% 20%, whiteAlpha.700, transparent 55%)" />
                )}
            </Box>

            <Box px={{ base: 3, md: 6 }} maxW="5xl" mx="auto">
                {/* Identity: avatar + name */}
                <Flex
                    align="flex-end"
                    gap={{ base: 3, md: 4 }}
                    mt={{ base: "-32px", md: "-46px" }}
                    position="relative"
                    zIndex={2}
                    animation={enter(0)}
                >
                    <Avatar
                        name={shop.name}
                        src={logoUrl || coverUrl || undefined}
                        w={{ base: "64px", md: "88px" }}
                        h={{ base: "64px", md: "88px" }}
                        fontSize={{ base: "xl", md: "3xl" }}
                        border="3px solid"
                        borderColor={t.pageBg}
                        boxShadow="0 6px 18px rgba(15, 23, 42, 0.16)"
                        bg="brand.500"
                        color="white"
                        flexShrink={0}
                    />
                    <Box minW={0} flex="1" pb={0.5}>
                        <Text
                            fontSize={{ base: "lg", md: "2xl" }}
                            fontWeight="800"
                            letterSpacing="-0.02em"
                            lineHeight="1.2"
                            color={t.text}
                            noOfLines={2}
                        >
                            {shop.name}
                        </Text>
                        <HStack spacing={1.5} mt={1} color={t.muted}>
                            <Icon as={FiClock} boxSize={3} />
                            <Text fontSize="xs">
                                Submitted {shop.createdAt ? formatDate(shop.createdAt) : "recently"}
                            </Text>
                        </HStack>
                    </Box>
                </Flex>

                {/* Status Badges */}
                <HStack spacing={1.5} mt={2.5} flexWrap="wrap" rowGap={1.5} animation={enter(40)}>
                    <Badge px={2} py={0.5} borderRadius="full" colorScheme="gray" variant="subtle" fontSize="10px">
                        {shop.companyCode || "No code"}
                    </Badge>
                    <Badge px={2} py={0.5} borderRadius="full" colorScheme={reviewScheme(shop.reviewStatus)} variant="subtle" fontSize="10px">
                        {toLabel(shop.reviewStatus)}
                    </Badge>
                    <Badge px={2} py={0.5} borderRadius="full" colorScheme={shopScheme(shop.shopStatus)} variant="subtle" fontSize="10px">
                        {toLabel(shop.shopStatus)}
                    </Badge>
                    {shop.gstNumber && (
                        <Badge px={2} py={0.5} borderRadius="full" colorScheme="purple" variant="subtle" fontSize="10px">
                            GST: {shop.gstNumber}
                        </Badge>
                    )}
                    {hasRatings && (
                        <Badge px={2} py={0.5} borderRadius="full" colorScheme="yellow" variant="subtle" fontSize="10px">
                            ★ {shop.ratings?.averageRating ? shop.ratings.averageRating.toFixed(1) : "0.0"} ({shop.ratings?.totalRatings || 0})
                        </Badge>
                    )}
                </HStack>

                {/* Quick actions: slim, scrollable pill row */}
                {quickActions.length > 0 ? (
                    <Flex
                        gap={2}
                        mt={3}
                        mx={{ base: -3, md: 0 }}
                        px={{ base: 3, md: 0 }}
                        overflowX="auto"
                        animation={enter(80)}
                        sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
                    >
                        {quickActions.map((action) => (
                            <QuickAction key={action.label} {...action} />
                        ))}
                    </Flex>
                ) : null}

                {/* Tabs */}
                <Tabs variant="unstyled" isLazy mt={3.5}>
                    <TabList
                        gap={1}
                        p={1}
                        bg={t.cardBg}
                        border="1px solid"
                        borderColor={t.border}
                        borderRadius="full"
                        position="sticky"
                        top={1.5}
                        zIndex={5}
                        boxShadow="0 4px 14px rgba(15, 23, 42, 0.06)"
                        overflowX="auto"
                        sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
                    >
                        <Tab {...tabStyles}>Overview</Tab>
                        <Tab {...tabStyles}>Location</Tab>
                        <Tab {...tabStyles}>Media{allMedia.length ? ` (${allMedia.length})` : ""}</Tab>
                        <Tab {...tabStyles}>History</Tab>
                    </TabList>

                    <TabPanels>
                        {/* Overview Tab */}
                        <TabPanel px={0} pt={3} pb={0}>
                            <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                                {/* About Section */}
                                <SectionCard title="About Shop" icon={FiInfo}>
                                    <Text fontSize="sm" color={t.text} lineHeight="1.75" whiteSpace="pre-line">
                                        {shop.description || "No description provided."}
                                    </Text>
                                </SectionCard>

                                {/* Review Remarks / Admin Feedback if present */}
                                {reviewRemarks && (
                                    <SectionCard title="Review Remarks" icon={FiMessageSquare} delay={40}>
                                        <Box bg={t.soft} p={3} borderRadius="12px" borderLeft="3px solid" borderColor="brand.400">
                                            <Text fontSize="xs" fontWeight="700" color={t.muted} textTransform="uppercase" letterSpacing="0.06em">
                                                Latest Review Feedback
                                            </Text>
                                            <Text fontSize="sm" color={t.text} mt={1} lineHeight="1.6" whiteSpace="pre-line">
                                                {reviewRemarks}
                                            </Text>
                                        </Box>
                                    </SectionCard>
                                )}

                                {/* Contact & Business Details */}
                                <SectionCard title="Contact & Business Details" icon={FiPhone} delay={60}>
                                    <VStack align="stretch" spacing={0.5} mx={-1}>
                                        {ownerName && (
                                            <InfoRow icon={FiUser} label="Owner / Merchant" value={ownerName} scheme="purple" />
                                        )}
                                        <InfoRow
                                            icon={FiHash}
                                            label="GST Number"
                                            value={shop.gstNumber || "Not provided"}
                                            scheme={shop.gstNumber ? "purple" : "gray"}
                                        />
                                        {primaryPhone && (
                                            <InfoRow icon={FiPhone} label="Phone" value={primaryPhone} href={`tel:${primaryPhone}`} scheme="green" />
                                        )}
                                        {primaryEmail && (
                                            <InfoRow icon={FiMail} label="Email" value={primaryEmail} href={`mailto:${primaryEmail}`} scheme="orange" />
                                        )}
                                        {website && (
                                            <InfoRow icon={FiGlobe} label="Website" value="Visit website" href={website} scheme="brand" external />
                                        )}
                                    </VStack>
                                </SectionCard>

                                {/* Media Preview in Overview */}
                                <SectionCard
                                    title="Media Preview"
                                    icon={FiImage}
                                    delay={100}
                                    right={allMedia.length ? <Text fontSize="xs" color={t.muted}>{allMedia.length} files</Text> : undefined}
                                >
                                    {allMedia.length > 0 ? (
                                        <Flex
                                            gap={2.5}
                                            overflowX="auto"
                                            mx={-1}
                                            px={1}
                                            pb={1}
                                            sx={{ scrollSnapType: "x proximity", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
                                        >
                                            {allMedia.map((item, index) => (
                                                <Box
                                                    key={`${item.url}-${index}`}
                                                    as="button"
                                                    type="button"
                                                    onClick={() => setPreview({ url: item.url, title: item.label })}
                                                    position="relative"
                                                    flexShrink={0}
                                                    w={{ base: "104px", md: "132px" }}
                                                    h={{ base: "104px", md: "132px" }}
                                                    borderRadius="14px"
                                                    overflow="hidden"
                                                    bg={t.soft}
                                                    role="group"
                                                    sx={{ scrollSnapAlign: "start" }}
                                                    transition="transform 0.2s ease"
                                                    _active={{ transform: "scale(0.97)" }}
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
                                                        px={2}
                                                        py={1}
                                                        bgGradient="linear(to-t, blackAlpha.700, transparent)"
                                                    >
                                                        <Text color="white" fontSize="10px" fontWeight="700" textAlign="left" noOfLines={1}>
                                                            {item.label}
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Flex>
                                    ) : (
                                        <EmptyNote icon={FiImage} text="No media uploaded yet." />
                                    )}
                                </SectionCard>

                                {/* Categories & Tags */}
                                {hasCategories || hasTags ? (
                                    <SectionCard title="Categories & Tags" icon={FiTag} delay={120}>
                                        {hasCategories && (
                                            <HStack wrap="wrap" spacing={0} gap={1.5} mb={hasTags ? 3 : 0}>
                                                {shop.categories.map((cat: string, i: number) => (
                                                    <Chip key={`cat-${i}`} tone="brand">
                                                        {cat}
                                                    </Chip>
                                                ))}
                                            </HStack>
                                        )}
                                        {hasTags && (
                                            <HStack wrap="wrap" spacing={0} gap={1.5}>
                                                {shop.tags.map((tag: string, i: number) => (
                                                    <Chip key={`tag-${i}`} tone="gray">
                                                        #{tag}
                                                    </Chip>
                                                ))}
                                            </HStack>
                                        )}
                                    </SectionCard>
                                ) : null}
                            </VStack>
                        </TabPanel>

                        {/* Location Tab */}
                        <TabPanel px={0} pt={3} pb={0}>
                            <SectionCard title="Shop Location" icon={FiMapPin}>
                                {fullAddress || hasCoords ? (
                                    <VStack align="stretch" spacing={3}>
                                        <Flex align="flex-start" gap={3} bg={t.soft} p={3.5} borderRadius="14px">
                                            <Circle size="9" bg="red.50" flexShrink={0}>
                                                <Icon as={FiMapPin} boxSize={4} color="red.500" />
                                            </Circle>
                                            <Box minW={0} flex="1">
                                                <Text fontWeight="700" fontSize="sm" color={t.text}>
                                                    {loc.address || "Address not specified"}
                                                </Text>
                                                <Text fontSize="sm" color={t.muted} mt={0.5}>
                                                    {[loc.city, loc.state].filter(Boolean).join(", ")} {loc.postalCode}
                                                </Text>
                                                {loc.country ? (
                                                    <Text fontSize="xs" fontWeight="600" color={t.muted} mt={0.5}>
                                                        {loc.country}
                                                    </Text>
                                                ) : null}
                                            </Box>
                                        </Flex>

                                        {hasCoords && (
                                            <InfoRow
                                                icon={FiMapPin}
                                                label="GPS Coordinates"
                                                value={`${loc.coordinates[1]}, ${loc.coordinates[0]}`}
                                                href={`https://www.google.com/maps/search/?api=1&query=${loc.coordinates[1]},${loc.coordinates[0]}`}
                                                external
                                                scheme="red"
                                            />
                                        )}

                                        {mapsUrl && (
                                            <Button
                                                as="a"
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                leftIcon={<FiNavigation />}
                                                colorScheme="brand"
                                                variant="outline"
                                                size="sm"
                                                borderRadius="full"
                                                alignSelf="flex-start"
                                                mt={1}
                                            >
                                                Open in Google Maps
                                            </Button>
                                        )}
                                    </VStack>
                                ) : (
                                    <EmptyNote icon={FiMapPin} text="No address or location details available." />
                                )}
                            </SectionCard>
                        </TabPanel>

                        {/* Media Tab */}
                        <TabPanel px={0} pt={3} pb={0}>
                            <SectionCard
                                p={{ base: 3, md: 4 }}
                                title="All Media & Photos"
                                icon={FiImage}
                                right={allMedia.length ? <Text fontSize="xs" color={t.muted}>{allMedia.length} files</Text> : undefined}
                            >
                                {allMedia.length > 0 ? (
                                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: 2.5, md: 3.5 }} mt={2}>
                                        {allMedia.map((item, idx) => (
                                            <Box
                                                key={`${item.url}-${idx}`}
                                                as="button"
                                                type="button"
                                                onClick={() => setPreview({ url: item.url, title: item.label })}
                                                position="relative"
                                                overflow="hidden"
                                                borderRadius="14px"
                                                sx={{ aspectRatio: "1 / 1" }}
                                                bg={t.soft}
                                                role="group"
                                                _active={{ transform: "scale(0.97)" }}
                                                transition="transform 0.2s ease"
                                                animation={enter(idx * 35)}
                                                border="1px solid"
                                                borderColor={t.border}
                                            >
                                                <Image
                                                    src={item.url}
                                                    alt={item.label || "Shop photo"}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                    transition="transform 0.4s ease"
                                                    _groupHover={{ transform: "scale(1.06)" }}
                                                />
                                                <Badge
                                                    position="absolute"
                                                    top={2}
                                                    left={2}
                                                    fontSize="9px"
                                                    fontWeight="700"
                                                    borderRadius="full"
                                                    px={2}
                                                    py={0.5}
                                                    colorScheme={
                                                        item.type === "logo"
                                                            ? "purple"
                                                            : item.type === "cover"
                                                            ? "blue"
                                                            : "gray"
                                                    }
                                                    variant="solid"
                                                >
                                                    {item.label}
                                                </Badge>
                                                <Box
                                                    position="absolute"
                                                    left={0}
                                                    right={0}
                                                    bottom={0}
                                                    px={2}
                                                    py={1.5}
                                                    bgGradient="linear(to-t, blackAlpha.800, transparent)"
                                                >
                                                    <Text color="white" fontSize="xs" fontWeight="600" noOfLines={1} textAlign="left">
                                                        {item.label}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                ) : (
                                    <EmptyNote icon={FiImage} text="No photos or media uploaded yet." />
                                )}
                            </SectionCard>
                        </TabPanel>

                        {/* History Tab */}
                        <TabPanel px={0} pt={3} pb={0}>
                            <SectionCard title="Status Timeline" icon={FiClock}>
                                {history.length > 0 ? (
                                    <Box>
                                        {history.map((step: any, index: number) => {
                                            const isLast = index === history.length - 1;
                                            const dotColor = `${shopScheme(step.status)}.400`;
                                            return (
                                                <Flex key={index} gap={3} animation={enter(index * 50)}>
                                                    <Flex direction="column" align="center" flexShrink={0} pt={1}>
                                                        <Circle
                                                            size={index === 0 ? "14px" : "10px"}
                                                            bg={dotColor}
                                                            boxShadow={index === 0 ? `0 0 0 4px var(--chakra-colors-${shopScheme(step.status)}-100)` : "none"}
                                                            mt={index === 0 ? 0 : "2px"}
                                                        />
                                                        {!isLast && <Box w="2px" flex="1" bg={t.border} my={1} borderRadius="full" />}
                                                    </Flex>
                                                    <Box flex="1" minW={0} pb={isLast ? 0 : 4}>
                                                        <HStack spacing={1.5} flexWrap="wrap" rowGap={1.5}>
                                                            <Badge colorScheme={shopScheme(step.status)} variant="subtle" borderRadius="full" px={2} py={0.5} fontSize="10px">
                                                                {toLabel(step.status)}
                                                            </Badge>
                                                            {step.reviewStatus ? (
                                                                <Badge colorScheme={reviewScheme(step.reviewStatus)} variant="subtle" borderRadius="full" px={2} py={0.5} fontSize="10px">
                                                                    {toLabel(step.reviewStatus)}
                                                                </Badge>
                                                            ) : null}
                                                        </HStack>
                                                        <Text fontSize="xs" color={t.muted} mt={1}>
                                                            {formatDate(step.updatedAt)}
                                                        </Text>
                                                        {step.remarks ? (
                                                            <Box
                                                                mt={2}
                                                                bg={t.soft}
                                                                p={2.5}
                                                                borderRadius="10px"
                                                                borderLeft="3px solid"
                                                                borderColor="brand.300"
                                                            >
                                                                <Text fontSize="sm" color={t.text} fontStyle="italic" lineHeight="1.6">
                                                                    &quot;{step.remarks}&quot;
                                                                </Text>
                                                            </Box>
                                                        ) : null}
                                                    </Box>
                                                </Flex>
                                            );
                                        })}
                                    </Box>
                                ) : (
                                    <EmptyNote icon={FiClock} text="No history available." />
                                )}
                            </SectionCard>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            {/* Image preview Lightbox Modal */}
            <Modal isOpen={Boolean(preview)} onClose={() => setPreview(null)} isCentered size={{ base: "full", md: "4xl" }}>
                <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
                <ModalContent bg="transparent" boxShadow="none" m={0}>
                    <ModalCloseButton color="white" top={4} right={4} zIndex={2} bg="blackAlpha.600" borderRadius="full" />
                    <Flex direction="column" align="center" justify="center" h="full" p={4} gap={3} onClick={() => setPreview(null)}>
                        {preview ? (
                            <Image
                                src={preview.url}
                                alt={preview.title || "Preview"}
                                maxH="80vh"
                                maxW="100%"
                                objectFit="contain"
                                borderRadius="16px"
                            />
                        ) : null}
                        {preview?.title ? (
                            <Text color="white" fontWeight="600" fontSize="sm" textAlign="center">
                                {preview.title}
                            </Text>
                        ) : null}
                    </Flex>
                </ModalContent>
            </Modal>
        </Box>
    );

    if (isMobile) {
        return (
            <BottomSheetDrawer isOpen={isOpen} onClose={onClose} title="Shop Details" size="full" bodyProps={{ p: 0 }}>
                {drawerBody}
            </BottomSheetDrawer>
        );
    }

    return (
        <CustomDrawer title="Shop Details" open={isOpen} close={onClose} size="3xl">
            {drawerBody}
        </CustomDrawer>
    );
};

export default ShopView;
