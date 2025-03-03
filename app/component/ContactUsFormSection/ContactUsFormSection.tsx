import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import CustomCarousel from "../common/CustomCarousal/CustomCarousal";
import CarouselCard from "./element/CarouselCard";
import ContactDetailedForm from "./element/ContactDetailedForm";

const carouselData = [
  {
    imageSrc: "/images/contactUs/clinicImage1.webp",
    iconSrc: "/images/contactUs/contactusicon1.svg",
    title: "Our Therapy Rooms",
    description: "Private, confidential, and peaceful!",
  },
  {
    imageSrc: "/images/contactUs/clinicImage2.png",
    iconSrc: "/images/contactUs/contactusicon2.svg",
    title: "Virtual Therapy Sessions",
    description: "Connect with our experts from the comfort of your home, with secure platforms.",
  },
  {
    imageSrc: "/images/contactUs/clinicImage3.webp",
    iconSrc: "/images/contactUs/contactusicon3.svg",
    title: "Accessible Anytime",
    description: "Book your appointments online and manage your schedule with ease.",
  },
];

const ContactUsFormSection = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "1fr 2fr",
  });
  const carouselMaxWidth = useBreakpointValue({ base: "90vw", md: "50vw" });
  const fakeBackgroundLeft = useBreakpointValue({ base: "0", md: "-45%" });
  const fakeBackgroundWidth = useBreakpointValue({ base: "100%", md: "145%" });
  const formPadding = useBreakpointValue({ base: 0, md: 2 });

  return (
    <Box pl={{ base: 0, md: 2 }} mb={{ base: 2, lg: 8 }} mt={3}>
      <Grid templateColumns={gridTemplateColumns} position="relative" mr={{ lg: 12 }}>
        {/* Left Section - Carousel */}
        <Box
          position="relative"
          zIndex={1}
          h={isMobile ? "auto" : "80%"}
          mt={{ base: 6, md: 12 }}
          ml={{ base: "0", lg: "-3%", xl: "-4%" }} // Shift left slightly without overflow
          maxWidth="100%" // Ensure no extra width
          order={isMobile ? 2 : 1}
          mx={{ base: "auto", lg: "0" }}
        >
          <CustomCarousel
            slidesToShow={1}
            autoplay={false}
            maxWidth={carouselMaxWidth}
            prevArrowIcon={<FaLongArrowAltLeft />}
            nextArrowIcon={<FaLongArrowAltRight />}
            leftArrowPosition={isMobile ? -4 : 9}
            rightArrowPosition={isMobile ? -4 : 9}
            hoverBgColor="#DF837C"
            hoverIconColor="white"
            initialIconColor="black"
          >
            {carouselData.map((item, index) => (
              <CarouselCard
                key={index}
                imageSrc={item.imageSrc}
                iconSrc={item.iconSrc}
                title={item.title}
                description={item.description}
              />
            ))}
          </CustomCarousel>
        </Box>

        {/* Right Section - Form */}
        <Box position="relative" mr={{ base: 0, md: 0 }} mt={{ base: 6, md: 0 }} order={isMobile ? 1 : 2}>
          {/* Fake Background to Extend (Hidden on Mobile) */}
          {!isMobile && (
            <Box
              position="absolute"
              rounded={"xl"}
              left={fakeBackgroundLeft}
              top={0}
              bottom={0}
              width={fakeBackgroundWidth}
              bg={"#86C6F459"}
              zIndex={0}
            />
          )}

          {/* Actual Form Content */}
          <Box position="relative" zIndex={1} p={formPadding} w={'100%'}>
            <ContactDetailedForm />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ContactUsFormSection;