'use client';

import { Box, Flex, Text, Image, useDisclosure, Modal, ModalOverlay, ModalContent, AspectRatio, IconButton, HStack, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const stories = [
    { id: 1, label: 'Trending', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' },
    { id: 2, label: 'New Arrivals', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2021/04/12/70878-537443181_tiny.mp4' },
    { id: 3, label: 'Summer Spec', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' },
    { id: 4, label: 'Tech Life', image: 'https://images.unsplash.com/photo-1546868831-71cc2f5c514d?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2021/04/12/70878-537443181_tiny.mp4' },
    { id: 5, label: 'Lifestyle', image: 'https://images.unsplash.com/photo-1511499767390-a735d4a80242?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' },
    { id: 6, label: 'Trending', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' },
    { id: 7, label: 'New Arrivals', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2021/04/12/70878-537443181_tiny.mp4' },
    { id: 8, label: 'Summer Spec', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' },
    { id: 9, label: 'New Arrivals', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2021/04/12/70878-537443181_tiny.mp4' },
    { id: 10, label: 'Summer Spec', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop', video: 'https://cdn.pixabay.com/video/2016/09/21/5159-183789417_tiny.mp4' }
];

const VideoStories = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const activeStory = stories[currentIndex];

    // Progress bar logic
    useEffect(() => {
        if (!isOpen || isPaused) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 1;
            });
        }, 50); // Controls speed of progress

        return () => clearInterval(interval);
    }, [isOpen, currentIndex, isPaused]);

    const handleStoryClick = (index: number) => {
        setCurrentIndex(index);
        setProgress(0);
        onOpen();
    };

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    return (
        <Box py={3} bg="white">
            <Flex
                overflowX="auto"
                px={4}
                gap={5}
                css={{ '&::-webkit-scrollbar': { display: 'none' } }}
                justifyContent="center"
            >
                {stories.map((story, index) => (
                    <Flex
                        key={story.id}
                        direction="column"
                        align="center"
                        flex="0 0 auto"
                        cursor="pointer"
                        onClick={() => handleStoryClick(index)}
                        transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                        _hover={{ transform: 'translateY(-2px)' }}
                    >
                        <Box
                            p="2px"
                            borderRadius="full"
                            bgGradient="linear(to-tr, #FF0080, #7928CA)"
                            mb={2}
                            boxShadow="lg"
                        >
                            <Box
                                boxSize={{ base: '55px', md: '75px' }}
                                borderRadius="full"
                                overflow="hidden"
                                border="2.5px solid white"
                                position="relative"
                            >
                                <Image
                                    src={story.image}
                                    alt={story.label}
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                />
                                <Box
                                    position="absolute"
                                    inset="0"
                                    bg="blackAlpha.300"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box bg="whiteAlpha.400" borderRadius="full" p={1} backdropFilter="blur(4px)">
                                        <Text fontSize="md" color="white" ml={0.5}>▶</Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Text fontSize="10px" fontWeight="black" color="gray.600" textTransform="uppercase" letterSpacing="widest">
                            {story.label}
                        </Text>
                    </Flex>
                ))}
            </Flex>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: "full", md: "xl" }}
                isCentered
                motionPreset="scale"
                blockScrollOnMount={true}
            >
                <ModalOverlay backdropFilter="blur(20px)" bg="purple.900/40" onClick={onClose} />
                <ModalContent
                    bg="transparent"
                    boxShadow="none"
                    mx={4}
                    my={6}
                    maxW={{ base: '85%', md: '340px' }}
                    h={{ base: '80%', md: '80%' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                >
                    {/* ACCESSIBLE CLOSE BUTTON AREA */}
                    <Box
                        position="absolute"
                        top={-10}
                        right={0}
                        zIndex={150}
                    >
                        <IconButton
                            aria-label="Close"
                            icon={<FiX size="22" />}
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            variant="solid"
                            bg="white"
                            color="purple.600"
                            borderRadius="full"
                            size="md"
                            boxShadow="2xl"
                            _active={{ transform: 'scale(0.9)' }}
                        />
                    </Box>

                    {/* Immersive Video Container */}
                    <Box
                        w="100%"
                        h="100%"
                        position="relative"
                        borderRadius="3xl"
                        overflow="hidden"
                        bg="black"
                        boxShadow="0 50px 100px -20px rgba(0, 0, 0, 0.8)"
                    >
                        {/* Status Bars */}
                        <HStack position="absolute" top={4} left={6} right={6} spacing={1} zIndex={40}>
                            {stories.map((_, i) => (
                                <Box key={i} flex={1} h="2px" bg="whiteAlpha.300" borderRadius="full" overflow="hidden">
                                    <Box
                                        h="full"
                                        bgGradient="linear(to-r, #FF0080, #7928CA)"
                                        transition="none"
                                        w={i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%"}
                                    />
                                </Box>
                            ))}
                        </HStack>

                        {/* Top Info Overlay */}
                        <Flex
                            position="absolute"
                            top={8}
                            left={0}
                            right={0}
                            px={6}
                            align="center"
                            zIndex={50}
                        >
                            <HStack spacing={3}>
                                <Image
                                    src={activeStory.image}
                                    boxSize="32px"
                                    borderRadius="full"
                                    border="2px solid white"
                                    boxShadow="xl"
                                />
                                <Box>
                                    <Text color="white" fontWeight="900" fontSize="10px" letterSpacing="tight" textShadow="0 2px 4px rgba(0,0,0,0.5)">{activeStory.label}</Text>
                                    <Text color="whiteAlpha.800" fontSize="8px" fontWeight="black" textTransform="uppercase">Live Now</Text>
                                </Box>
                            </HStack>
                        </Flex>

                        {/* Navigation Zones - IMPORTANT: top="100px" ensures top area is NOT blocked */}
                        <Box position="absolute" top="100px" bottom="100px" left={0} right={0} zIndex={10} display="flex">
                            <Box flex={1} cursor="w-resize" onClick={() => handlePrev()} />
                            <Box flex={2} cursor="pointer" onClick={() => setIsPaused(!isPaused)} />
                            <Box flex={1} cursor="e-resize" onClick={() => handleNext()} />
                        </Box>

                        <AspectRatio ratio={9 / 16} h="100%" w="100%">
                            <video
                                key={activeStory.video}
                                src={activeStory.video}
                                autoPlay
                                loop={false}
                                playsInline
                                onEnded={handleNext}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </AspectRatio>

                        {/* Immersive Footer / CTA */}
                        <Box
                            position="absolute"
                            bottom={0}
                            left={0}
                            right={0}
                            p={4}
                            bgGradient="linear(to-t, rgba(0,0,0,0.9), transparent)"
                            zIndex={30}
                        >
                            <Flex
                                bg="whiteAlpha.100"
                                backdropFilter="blur(30px)"
                                p={3}
                                borderRadius="2xl"
                                border="1px solid"
                                borderColor="whiteAlpha.300"
                                align="center"
                                justify="space-between"
                                boxShadow="dark-lg"
                            >
                                <HStack spacing={3}>
                                    <Box boxSize="38px" borderRadius="lg" overflow="hidden" boxShadow="2xl">
                                        <Image src={activeStory.image} w="full" h="full" objectFit="cover" />
                                    </Box>
                                    <Box>
                                        <Text color="white" fontSize="9px" fontWeight="900" letterSpacing="0.8px">LIMITED DROP</Text>
                                        <Text color="whiteAlpha.700" fontSize="8px" fontWeight="black" textTransform="uppercase">Shop latest</Text>
                                    </Box>
                                </HStack>
                                <Box
                                    as="button"
                                    px={4}
                                    py={2.5}
                                    bg="gradient-to-r"
                                    bgGradient="linear(to-r, #FF0080, #7928CA)"
                                    color="white"
                                    borderRadius="xl"
                                    fontWeight="900"
                                    fontSize="9px"
                                    transition="0.2s"
                                    _active={{ transform: 'scale(0.95)' }}
                                    onClick={(e) => { e.stopPropagation(); }}
                                >
                                    BUY
                                </Box>
                            </Flex>
                        </Box>
                    </Box>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default VideoStories;
