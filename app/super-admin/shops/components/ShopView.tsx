import React from "react";
import {
    Box,
    Image,
    Text,
    VStack,
    HStack,
    Badge,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    SimpleGrid,
    Link,
    Icon,
    Step,
    StepIndicator,
    StepStatus,
    StepTitle,
    StepDescription,
    StepSeparator,
    StepIcon,
    Stepper,
    Container,
} from "@chakra-ui/react";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaStar, FaClock } from "react-icons/fa";
import CustomDrawer from "../../../component/common/Drawer/CustomDrawer";

interface ShopViewProps {
    isOpen: boolean;
    onClose: () => void;
    shop: any;
}

const ShopView: React.FC<ShopViewProps> = ({ isOpen, onClose, shop }) => {
    if (!shop) return null;

    return (
        <CustomDrawer
            title="Shop Details"
            open={isOpen}
            close={onClose}
            size="xl"
        >
            <Box position="relative" bg="gray.50" minH="100vh" pb={10}>
                {/* Header Section */}
                <Box h="200px" bg="gray.200" position="relative" overflow="hidden">
                    {shop.coverImage?.url ? (
                        <>
                            <Image
                                src={shop.coverImage.url}
                                alt="Cover Image"
                                w="100%"
                                h="100%"
                                objectFit="cover"
                            />
                            <Box position="absolute" bottom={0} left={0} w="100%" h="100%" bgGradient="linear(to-t, blackAlpha.600, transparent)" />
                        </>
                    ) : (
                        <Box w="100%" h="100%" bgGradient="linear(to-r, gray.300, gray.400)" />
                    )}
                </Box>

                <Container maxW="7xl">
                    <Box px={{ base: 4, md: 8 }} mt="-75px" position="relative" zIndex={2}>
                        <HStack alignItems="flex-end" spacing={6}>
                            <Box p={1} bg="white" borderRadius="full" shadow="lg">
                                <Image
                                    src={shop.logo?.url || "https://via.placeholder.com/150"}
                                    alt="Logo"
                                    boxSize="150px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    bg="white"
                                    fallbackSrc="https://via.placeholder.com/150"
                                />
                            </Box>
                            <Box mb={2}>
                                <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800" color="gray.800" textShadow="0 1px 2px rgba(0,0,0,0.1)">
                                    {shop.name}
                                </Text>
                                <HStack spacing={3} mt={1}>
                                    <Badge px={2} py={1} fontSize="0.8em" borderRadius="md" colorScheme="blue" variant="solid">
                                        {shop.companyCode || "N/A"}
                                    </Badge>
                                    <Badge px={2} py={1} fontSize="0.8em" borderRadius="md" variant="solid" colorScheme={
                                        shop.shopStatus === 'active' ? 'green' :
                                            shop.shopStatus === 'suspended' ? 'red' : 'orange'
                                    }>
                                        {shop.shopStatus}
                                    </Badge>
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>

                    <Box mt={8}>
                        <Tabs colorScheme="blue" variant="line" isLazy>
                            <TabList mb={4} borderBottom="2px solid" borderColor="gray.200">
                                <Tab fontWeight="bold" _selected={{ color: 'blue.600', borderColor: 'blue.600', borderBottomWidth: '4px', mb: '-2px' }}>Overview</Tab>
                                <Tab fontWeight="bold" _selected={{ color: 'blue.600', borderColor: 'blue.600', borderBottomWidth: '4px', mb: '-2px' }}>Location</Tab>
                                <Tab fontWeight="bold" _selected={{ color: 'blue.600', borderColor: 'blue.600', borderBottomWidth: '4px', mb: '-2px' }}>Media</Tab>
                                <Tab fontWeight="bold" _selected={{ color: 'blue.600', borderColor: 'blue.600', borderBottomWidth: '4px', mb: '-2px' }}>History</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Overview Tab */}
                                <TabPanel px={0}>
                                    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                                        {/* Left Column */}
                                        <Box gridColumn={{ lg: "span 2" }} bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
                                            <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">Description</Text>
                                            <Text color="gray.600" lineHeight="1.8" mb={6}>
                                                {shop.description || "No description provided."}
                                            </Text>

                                            <Divider my={6} />

                                            <Box mb={6}>
                                                <Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">Categories</Text>
                                                <HStack wrap="wrap" spacing={2}>
                                                    {shop.categories?.map((cat: string, i: number) => (
                                                        <Badge key={i} px={3} py={1} borderRadius="full" colorScheme="purple" variant="subtle">
                                                            {cat}
                                                        </Badge>
                                                    ))}
                                                </HStack>
                                            </Box>

                                            <Box>
                                                <Text fontSize="md" fontWeight="bold" mb={3} color="gray.700">Tags</Text>
                                                <HStack wrap="wrap" spacing={2}>
                                                    {shop.tags?.map((tag: string, i: number) => (
                                                        <Badge key={i} px={3} py={1} borderRadius="full" colorScheme="gray">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </HStack>
                                            </Box>
                                        </Box>

                                        {/* Right Column (Contact) */}
                                        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100" h="fit-content">
                                            <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">Contact Info</Text>
                                            <VStack align="start" spacing={4}>
                                                {shop.contactInfo?.phone && (
                                                    <HStack p={2} w="100%" _hover={{ bg: "gray.50", borderRadius: "md" }}>
                                                        <Icon as={FaPhone} color="blue.500" boxSize={5} />
                                                        <Text fontWeight="medium">{shop.contactInfo.phone}</Text>
                                                    </HStack>
                                                )}
                                                {shop.contactInfo?.email && (
                                                    <HStack p={2} w="100%" _hover={{ bg: "gray.50", borderRadius: "md" }}>
                                                        <Icon as={FaEnvelope} color="orange.500" boxSize={5} />
                                                        <Link href={`mailto:${shop.contactInfo.email}`} isExternal color="gray.700" _hover={{ color: "blue.500" }}>
                                                            {shop.contactInfo.email}
                                                        </Link>
                                                    </HStack>
                                                )}
                                                {shop.contactInfo?.website && (
                                                    <HStack p={2} w="100%" _hover={{ bg: "gray.50", borderRadius: "md" }}>
                                                        <Icon as={FaGlobe} color="green.500" boxSize={5} />
                                                        <Link href={shop.contactInfo.website} isExternal color="blue.500" fontWeight="bold">
                                                            Visit Website
                                                        </Link>
                                                    </HStack>
                                                )}
                                            </VStack>
                                        </Box>
                                    </SimpleGrid>
                                </TabPanel>

                                {/* Location Tab */}
                                <TabPanel px={0}>
                                    <Box bg="white" p={8} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
                                        <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">Main Address</Text>
                                        <HStack align="start" spacing={4} bg="gray.50" p={4} borderRadius="lg">
                                            <Icon as={FaMapMarkerAlt} color="red.500" boxSize={6} mt={1} />
                                            <Box>
                                                <Text fontWeight="bold" fontSize="lg">{shop.location?.address}</Text>
                                                <Text color="gray.600">{shop.location?.city}, {shop.location?.state} {shop.location?.postalCode}</Text>
                                                <Text color="gray.500" fontWeight="bold" mt={1}>{shop.location?.country}</Text>
                                            </Box>
                                        </HStack>
                                    </Box>
                                </TabPanel>

                                {/* Media Tab */}
                                <TabPanel px={0}>
                                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
                                        {shop.gallery?.length > 0 ? (
                                            <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                                                {shop.gallery.map((item: any, idx: number) => (
                                                    <Box key={idx} borderRadius="lg" overflow="hidden" position="relative" role="group">
                                                        <Image
                                                            src={item.file?.url}
                                                            alt={item.title}
                                                            w="100%"
                                                            h="200px"
                                                            objectFit="cover"
                                                            transition="transform 0.3s"
                                                            _groupHover={{ transform: "scale(1.05)" }}
                                                        />
                                                        <Box position="absolute" bottom={0} left={0} right={0} bg="blackAlpha.700" p={2} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
                                                            <Text color="white" fontSize="sm" noOfLines={1}>{item.title}</Text>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                        ) : (
                                            <Text color="gray.500" textAlign="center" py={10}>No images available in the gallery.</Text>
                                        )}
                                    </Box>
                                </TabPanel>

                                {/* History Tab */}
                                <TabPanel px={0}>
                                    <Box bg="white" p={8} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
                                        <Text fontSize="xl" fontWeight="bold" mb={6} color="gray.700">Status Timeline</Text>
                                        {shop.statusHistory && shop.statusHistory.length > 0 ? (
                                            <Stepper index={shop.statusHistory.length} orientation="vertical" height="auto" gap="0">
                                                {[...shop.statusHistory].reverse().map((step: any, index: number) => (
                                                    <Step key={index} style={{ width: '100%' }}>
                                                        <StepIndicator bg="white" borderColor="blue.500">
                                                            <StepStatus
                                                                complete={<StepIcon color="blue.500" />}
                                                                incomplete={<StepIcon />}
                                                                active={<Box w={2} h={2} bg="blue.500" borderRadius="full" />}
                                                            />
                                                        </StepIndicator>

                                                        <Box flexShrink="0" mb={8} w="100%">
                                                            <StepTitle>
                                                                <Badge
                                                                    colorScheme={step.status === 'active' ? 'green' : step.status === 'suspended' ? 'red' : 'orange'}
                                                                    px={2} py={0.5} borderRadius="full"
                                                                >
                                                                    {step.status}
                                                                </Badge>
                                                                <Text as="span" ml={3} fontSize="sm" color="gray.500">
                                                                    {new Date(step.updatedAt).toLocaleString()}
                                                                </Text>
                                                            </StepTitle>
                                                            <StepDescription mt={2}>
                                                                {step.remarks && (
                                                                    <Box bg="gray.50" p={3} borderLeft="3px solid" borderColor="gray.300" borderRadius="sm">
                                                                        <Text fontSize="sm" fontStyle="italic" color="gray.600">"{step.remarks}"</Text>
                                                                    </Box>
                                                                )}
                                                            </StepDescription>
                                                        </Box>
                                                        <StepSeparator />
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        ) : (
                                            <Text color="gray.500">No history available.</Text>
                                        )}
                                    </Box>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Container>
            </Box>
        </CustomDrawer>
    );
};

export default ShopView;
