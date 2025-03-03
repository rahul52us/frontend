import { Box, Center, Icon, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosPlay } from "react-icons/io";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CustomSmallTitle from "../../../../component/common/CustomSmallTitle/CustomSmallTitle";
import CustomSubHeading from "../../../../component/common/CustomSubHeading/CustomSubHeading";
import { dummyData } from "./constant";

const VideoCarousel = () => {
  const [selectedVideo, setSelectedVideo] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [centerIndex, setCenterIndex] = useState(0); // Track the center index

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "140px", // Reduced padding to show more of side images
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setCenterIndex(next), // Update center index
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "15%", // Adjusted for smaller screens
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px", // Adjusted for mobile screens
        },
      },
    ],
  };
  const handleImageClick = (videoId) => {
    setSelectedVideo(videoId);
    onOpen();
  };


  return (
    <Box p={{ base: 8, lg: 4 }} maxW={{ lg: "85%", xl: '80%' }} mx={'auto'}>
      <CustomSmallTitle>VIDEO LIBRARY</CustomSmallTitle>
      <CustomSubHeading highlightText="Understanding Mental Health with Experts"> </CustomSubHeading>
      <Box mt={6}>

        <Slider {...settings}>
          {dummyData.map((item, index) => (
            <Box key={item.id} position="relative" cursor="pointer"
              transform={index === centerIndex ? "scale(1.05)" : "scale(1)"}
              transition="transform 0.3s ease-in-out"
              py={2} rounded={'xl'}
            >

              {/* Popover Trigger covering the whole card */}
              <Popover trigger="hover" placement="bottom">
                <PopoverTrigger>
                  <Box position="relative" zIndex="popover" mx={2}>
                    <Image src={item.imageUrl} alt={item.title} h={{ base: "300px", lg: '380px' }} rounded={'xl'} objectFit={'cover'}  width={"100%"} />
                    <Box position="absolute" top="50%" zIndex={1} left="50%" transform="translate(-50%, -50%)" fontSize="4xl" color="white">
                      <Icon bg={"white"} as={IoIosPlay} color={"brand.100"} p={1} pl={1.5} rounded={"full"} fontSize={"40px"} onClick={() => handleImageClick(item.videoId)} />
                    </Box>
                    <Center px={2}>
                      <Text textAlign="center" color={'white'} fontWeight={600} position={'absolute'} bottom={10}>
                        {item.title}
                      </Text>
                    </Center>
                    <Center>
                      <Text textAlign="center" fontSize={'sm'} color={'white'} position={'absolute'} bottom={6}>
                        {item.doctor}
                      </Text>
                    </Center>
                  </Box>
                </PopoverTrigger>

                {/* Popover Content with High Z-Index */}
                <Portal>

                  <PopoverContent bg="brand.100" color="white" borderRadius="md" p={3} zIndex="popover" pointerEvents="auto">
                    <PopoverArrow bg="brand.100" />
                    <PopoverBody fontSize="sm" fontWeight="medium">
                      {item.description}
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            </Box>
          ))}
        </Slider>
      </Box >
      <Modal isOpen={isOpen} onClose={onClose} size={{base:"xs",lg:'lg'}} isCentered>
        <ModalOverlay />
        <ModalContent  bg={'transparent'}>
          <ModalCloseButton />
          <ModalBody p={0}    bg={'transparent'}>
            <Box position="relative" h={'20rem'}  bg={'transparent'}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                // style={{ position: "absolute", top: 0, left: 0 }}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box >
  );
};

export default VideoCarousel;