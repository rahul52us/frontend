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
    // keyframes,
    useBreakpointValue,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
    FiClock,
    FiExternalLink,
    FiGlobe,
    FiImage,
    FiInfo,
    FiMail,
    FiMapPin,
    FiNavigation,
    FiPhone,
    FiTag,
} from "react-icons/fi";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";
import { keyframes } from "@emotion/react";

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

const useShopTheme = () => ({
    pageBg: useColorModeValue("gray.50", "gray.900"),
    cardBg: useColorModeValue("white", "gray.800"),
    border: useColorModeValue("gray.100", "whiteAlpha.200"),
    text: useColorModeValue("gray.800", "gray.100"),
    muted: useColorModeValue("gray.500", "gray.400"),
    soft: useColorModeValue("gray.50", "whiteAlpha.100"),
    accent: useColorModeValue("blue.600", "blue.300"),
    accentBg: useColorModeValue("blue.50", "whiteAlpha.200"),
});

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

const SectionCard = ({
    title,
    icon,
    children,
    delay = 0,
    ...props
}: {
    title?: string;
    icon?: any;
    children: React.ReactNode;
    delay?: number;
    [key: string]: any;
}) => {
    const t = useShopTheme();
    return (
        <Box
            bg={t.cardBg}
            border="1px solid"
            borderColor={t.border}
            borderRadius="20px"
            p={{ base: 4, md: 6 }}
            boxShadow="0 1px 2px rgba(15, 23, 42, 0.04)"
            animation={enter(delay)}
            {...props}
        >
            {title ? (
                <HStack spacing={2} mb={3}>
                    {icon ? <Icon as={icon} boxSize={4} color={t.accent} /> : null}
                    <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={t.muted}>
                        {title}
                    </Text>
                </HStack>
            ) : null}
            {children}
        </Box>
    );
};

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

    return (
        <Link
            href={href}
            isExternal={external}
            flex="1"
            minW={0}
            _hover={{ textDecoration: "none" }}
            _focusVisible={{ outline: "2px solid", outlineColor: t.accent, outlineOffset: "2px" }}
            borderRadius="16px"
        >
            <Flex
                direction="column"
                align="center"
                justify="center"
                gap={1.5}
                py={3}
                bg={t.cardBg}
                border="1px solid"
                borderColor={t.border}
                borderRadius="16px"
                transition="all 0.2s ease"
                _hover={{ transform: "translateY(-2px)", borderColor: tintColor }}
                _active={{ transform: "scale(0.96)" }}
            >
                <Circle size="9" bg={tint}>
                    <Icon as={icon} boxSize={4} color={tintColor} />
                </Circle>
                <Text fontSize="xs" fontWeight="600" color={t.text}>
                    {label}
                </Text>
            </Flex>
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
            p={2.5}
            borderRadius="14px"
            transition="background 0.2s ease"
            _hover={href ? { bg: t.soft } : undefined}
        >
            <Circle size="9" bg={tint} flexShrink={0}>
                <Icon as={icon} boxSize={4} color={tintColor} />
            </Circle>
            <Box minW={0} flex="1">
                <Text fontSize="xs" color={t.muted}>
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

const Chip = ({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) => (
    <Badge
        px={3}
        py={1}
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
        <Flex direction="column" align="center" gap={3} py={10}>
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
/* Main                                                                */
/* ------------------------------------------------------------------ */

const ShopView: React.FC<ShopViewProps> = ({ isOpen, onClose, shop }) => {
    // All hooks stay above the early return
    const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
    const t = useShopTheme();
    const [preview, setPreview] = React.useState<{ url: string; title?: string } | null>(null);

    if (!shop) return null;

    const primaryPhone = shop.ownerContact?.phone || shop.contactInfo?.phone;
    const primaryEmail = shop.contactInfo?.email || shop.ownerContact?.email;
    const website = shop.contactInfo?.website;
    const loc = shop.location || {};
    const fullAddress = [loc.address, loc.city, loc.state, loc.postalCode, loc.country].filter(Boolean).join(", ");
    const mapsUrl = fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
        : "";

    const quickActions = [
        primaryPhone && { label: "Call", icon: FiPhone, href: `tel:${primaryPhone}`, scheme: "green", external: false },
        primaryEmail && { label: "Email", icon: FiMail, href: `mailto:${primaryEmail}`, scheme: "orange", external: false },
        website && { label: "Website", icon: FiGlobe, href: website, scheme: "blue", external: true },
        mapsUrl && { label: "Directions", icon: FiNavigation, href: mapsUrl, scheme: "red", external: true },
    ].filter(Boolean) as any[];

    const hasContact = Boolean(primaryPhone || primaryEmail || website);
    const hasCategories = Array.isArray(shop.categories) && shop.categories.length > 0;
    const hasTags = Array.isArray(shop.tags) && shop.tags.length > 0;
    const gallery: any[] = Array.isArray(shop.gallery) ? shop.gallery : [];
    const history: any[] = Array.isArray(shop.statusHistory) ? [...shop.statusHistory].reverse() : [];

    const tabStyles = {
        flex: { base: 1, md: "none" },
        px: { base: 2, md: 5 },
        py: 2,
        fontSize: "sm",
        fontWeight: "600",
        color: t.muted,
        borderRadius: "full",
        whiteSpace: "nowrap" as const,
        transition: "all 0.2s ease",
        _selected: { bg: "blue.600", color: "white", boxShadow: "0 6px 16px rgba(37, 99, 235, 0.28)" },
        _hover: { color: t.text },
        _focusVisible: { boxShadow: "outline" },
    };

    const drawerBody = (
        <Box bg={t.pageBg} minH="100%" pb="calc(24px + env(safe-area-inset-bottom))">
            {/* Cover */}
            <Box h={{ base: "132px", md: "200px" }} position="relative" overflow="hidden" bgGradient="linear(to-br, blue.500, purple.500)">
                {shop.coverImage?.url ? (
                    <>
                        <Image src={shop.coverImage.url} alt="Cover" w="100%" h="100%" objectFit="cover" />
                        <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.500, transparent 60%)" />
                    </>
                ) : (
                    <Box position="absolute" inset={0} opacity={0.25} bgGradient="radial(circle at 80% 20%, whiteAlpha.700, transparent 55%)" />
                )}
            </Box>

            <Box px={{ base: 3, md: 8 }} maxW="5xl" mx="auto">
                {/* Identity */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "flex-start", md: "flex-end" }}
                    gap={{ base: 3, md: 5 }}
                    mt={{ base: "-40px", md: "-56px" }}
                    position="relative"
                    zIndex={2}
                    animation={enter(0)}
                >
                    <Avatar
                        name={shop.name}
                        src={shop.logo?.url}
                        w={{ base: "80px", md: "112px" }}
                        h={{ base: "80px", md: "112px" }}
                        fontSize={{ base: "2xl", md: "4xl" }}
                        border="4px solid"
                        borderColor={t.pageBg}
                        boxShadow="0 8px 24px rgba(15, 23, 42, 0.16)"
                        bg="blue.500"
                        color="white"
                    />
                    <Box minW={0} pb={{ md: 1 }}>
                        <Text
                            fontSize={{ base: "xl", md: "3xl" }}
                            fontWeight="800"
                            letterSpacing="-0.02em"
                            lineHeight="1.2"
                            color={t.text}
                        >
                            {shop.name}
                        </Text>
                        <HStack spacing={2} mt={2} flexWrap="wrap" rowGap={2}>
                            <Badge px={2.5} py={1} borderRadius="full" colorScheme="gray" variant="subtle" fontSize="xs">
                                {shop.companyCode || "N/A"}
                            </Badge>
                            <Badge px={2.5} py={1} borderRadius="full" colorScheme={reviewScheme(shop.reviewStatus)} variant="subtle" fontSize="xs">
                                {toLabel(shop.reviewStatus)}
                            </Badge>
                            <Badge px={2.5} py={1} borderRadius="full" colorScheme={shopScheme(shop.shopStatus)} variant="subtle" fontSize="xs">
                                {toLabel(shop.shopStatus)}
                            </Badge>
                        </HStack>
                    </Box>
                </Flex>

                {/* Quick actions */}
                {quickActions.length > 0 ? (
                    <Flex gap={2.5} mt={5} animation={enter(80)}>
                        {quickActions.map((action) => (
                            <QuickAction key={action.label} {...action} />
                        ))}
                    </Flex>
                ) : null}

                {/* Tabs */}
                <Tabs variant="unstyled" isLazy mt={4}>
                    <TabList
                        gap={1.5}
                        p={1.5}
                        bg={t.cardBg}
                        border="1px solid"
                        borderColor={t.border}
                        borderRadius="full"
                        position="sticky"
                        top={2}
                        zIndex={5}
                        boxShadow="0 4px 16px rgba(15, 23, 42, 0.06)"
                        overflowX="auto"
                        sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
                    >
                        <Tab {...tabStyles}>Overview</Tab>
                        <Tab {...tabStyles}>Location</Tab>
                        <Tab {...tabStyles}>Media{gallery.length ? ` (${gallery.length})` : ""}</Tab>
                        <Tab {...tabStyles}>History</Tab>
                    </TabList>

                    <TabPanels>
                        {/* Overview */}
                        <TabPanel px={0} pt={4} pb={0}>
                            <Box
                                display="grid"
                                gap={{ base: 3, md: 5 }}
                                gridTemplateColumns={{ base: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(0, 1fr)" }}
                                gridTemplateAreas={{
                                    base: `"about" "contact" "tags"`,
                                    lg: `"about contact" "tags contact"`,
                                }}
                            >
                                <SectionCard title="About" icon={FiInfo} gridArea="about">
                                    <Text fontSize="sm" color={t.text} lineHeight="1.8" whiteSpace="pre-line">
                                        {shop.description || "No description provided."}
                                    </Text>
                                </SectionCard>

                                <SectionCard title="Contact" icon={FiPhone} gridArea="contact" delay={60} h="fit-content">
                                    {hasContact ? (
                                        <VStack align="stretch" spacing={0.5} mx={-1}>
                                            {primaryPhone && (
                                                <InfoRow icon={FiPhone} label="Phone" value={primaryPhone} href={`tel:${primaryPhone}`} scheme="green" />
                                            )}
                                            {primaryEmail && (
                                                <InfoRow icon={FiMail} label="Email" value={primaryEmail} href={`mailto:${primaryEmail}`} scheme="orange" />
                                            )}
                                            {website && (
                                                <InfoRow icon={FiGlobe} label="Website" value="Visit website" href={website} scheme="blue" external />
                                            )}
                                        </VStack>
                                    ) : (
                                        <Text fontSize="sm" color={t.muted}>
                                            No contact details added.
                                        </Text>
                                    )}
                                </SectionCard>

                                {hasCategories || hasTags ? (
                                    <SectionCard title="Categories & Tags" icon={FiTag} gridArea="tags" delay={120}>
                                        {hasCategories && (
                                            <HStack wrap="wrap" spacing={0} gap={2} mb={hasTags ? 3 : 0}>
                                                {shop.categories.map((cat: string, i: number) => (
                                                    <Chip key={`cat-${i}`} tone="blue">
                                                        {cat}
                                                    </Chip>
                                                ))}
                                            </HStack>
                                        )}
                                        {hasTags && (
                                            <HStack wrap="wrap" spacing={0} gap={2}>
                                                {shop.tags.map((tag: string, i: number) => (
                                                    <Chip key={`tag-${i}`} tone="gray">
                                                        #{tag}
                                                    </Chip>
                                                ))}
                                            </HStack>
                                        )}
                                    </SectionCard>
                                ) : null}
                            </Box>
                        </TabPanel>

                        {/* Location */}
                        <TabPanel px={0} pt={4} pb={0}>
                            <SectionCard title="Main Address" icon={FiMapPin}>
                                {fullAddress ? (
                                    <>
                                        <Flex align="flex-start" gap={3} bg={t.soft} p={4} borderRadius="16px">
                                            <Circle size="10" bg="red.50" flexShrink={0}>
                                                <Icon as={FiMapPin} boxSize={5} color="red.500" />
                                            </Circle>
                                            <Box minW={0}>
                                                <Text fontWeight="700" color={t.text}>
                                                    {loc.address || "Address not provided"}
                                                </Text>
                                                <Text fontSize="sm" color={t.muted} mt={0.5}>
                                                    {[loc.city, loc.state].filter(Boolean).join(", ")} {loc.postalCode}
                                                </Text>
                                                {loc.country ? (
                                                    <Text fontSize="sm" fontWeight="600" color={t.muted} mt={0.5}>
                                                        {loc.country}
                                                    </Text>
                                                ) : null}
                                            </Box>
                                        </Flex>
                                        <Button
                                            as="a"
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            leftIcon={<FiNavigation />}
                                            colorScheme="blue"
                                            borderRadius="14px"
                                            w="full"
                                            mt={4}
                                            h="46px"
                                        >
                                            Get directions
                                        </Button>
                                    </>
                                ) : (
                                    <EmptyNote icon={FiMapPin} text="No address available." />
                                )}
                            </SectionCard>
                        </TabPanel>

                        {/* Media */}
                        <TabPanel px={0} pt={4} pb={0}>
                            <SectionCard p={{ base: 3, md: 5 }}>
                                {gallery.length > 0 ? (
                                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: 2, md: 3 }}>
                                        {gallery.map((item: any, idx: number) => (
                                            <Box
                                                key={idx}
                                                as="button"
                                                type="button"
                                                onClick={() => item.file?.url && setPreview({ url: item.file.url, title: item.title })}
                                                position="relative"
                                                overflow="hidden"
                                                borderRadius="16px"
                                                sx={{ aspectRatio: "1 / 1" }}
                                                bg={t.soft}
                                                role="group"
                                                _active={{ transform: "scale(0.97)" }}
                                                transition="transform 0.2s ease"
                                                animation={enter(idx * 40)}
                                            >
                                                <Image
                                                    src={item.file?.url}
                                                    alt={item.title || "Gallery image"}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                    transition="transform 0.4s ease"
                                                    _groupHover={{ transform: "scale(1.06)" }}
                                                />
                                                {item.title ? (
                                                    <Box
                                                        position="absolute"
                                                        left={0}
                                                        right={0}
                                                        bottom={0}
                                                        px={2}
                                                        py={1.5}
                                                        bgGradient="linear(to-t, blackAlpha.700, transparent)"
                                                    >
                                                        <Text color="white" fontSize="xs" fontWeight="600" noOfLines={1} textAlign="left">
                                                            {item.title}
                                                        </Text>
                                                    </Box>
                                                ) : null}
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                ) : (
                                    <EmptyNote icon={FiImage} text="No images available in the gallery." />
                                )}
                            </SectionCard>
                        </TabPanel>

                        {/* History */}
                        <TabPanel px={0} pt={4} pb={0}>
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
                                                    <Box flex="1" minW={0} pb={isLast ? 0 : 5}>
                                                        <HStack spacing={1.5} flexWrap="wrap" rowGap={1.5}>
                                                            <Badge colorScheme={shopScheme(step.status)} variant="subtle" borderRadius="full" px={2.5} py={0.5} fontSize="xs">
                                                                {toLabel(step.status)}
                                                            </Badge>
                                                            {step.reviewStatus ? (
                                                                <Badge colorScheme={reviewScheme(step.reviewStatus)} variant="subtle" borderRadius="full" px={2.5} py={0.5} fontSize="xs">
                                                                    {toLabel(step.reviewStatus)}
                                                                </Badge>
                                                            ) : null}
                                                        </HStack>
                                                        <Text fontSize="xs" color={t.muted} mt={1.5}>
                                                            {formatDate(step.updatedAt)}
                                                        </Text>
                                                        {step.remarks ? (
                                                            <Box
                                                                mt={2}
                                                                bg={t.soft}
                                                                p={3}
                                                                borderRadius="12px"
                                                                borderLeft="3px solid"
                                                                borderColor="blue.300"
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

            {/* Image preview */}
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
        <CustomDrawer title="Shop Details" open={isOpen} close={onClose} size="xl">
            {drawerBody}
        </CustomDrawer>
    );
};

export default ShopView;