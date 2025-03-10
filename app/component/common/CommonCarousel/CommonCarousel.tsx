import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({
  children,
  slidesToShow = 4,
  autoplay = true,
  autoplaySpeed = 3000,
  buttonColor = "white",
  buttonBgColor = "rgba(0,0,0,0.6)",
  dots=false
}) => {
  const sliderRef = useRef(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const settings = {
    dots: dots,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : slidesToShow,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,

    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const buttonStyles = {
    color: buttonColor,
    bg: buttonBgColor,
    _hover: { bg: buttonBgColor, opacity: 0.8 },
    _active: { bg: buttonBgColor, opacity: 0.6 },
    size: "md",
    borderRadius: "full",
    transition: "all 0.3s ease",
  };

  return (
    <Box position="relative" width="full" p={{ base: 0, md: 2 }} >
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>

      {/* Custom Navigation Buttons */}
      <Box
        position="absolute"
        bottom={{ base: "-10%", md: "-10%" }}
        right="2%"
        zIndex={2}
        display="flex"
        gap={2}
      >
        <IconButton
          aria-label="Previous slide"
          icon={<FaChevronLeft />}
          {...buttonStyles}
          onClick={() => sliderRef.current.slickPrev()}
        />
        <IconButton
          aria-label="Next slide"
          icon={<FaChevronRight />}
          {...buttonStyles}
          onClick={() => sliderRef.current.slickNext()}
        />
      </Box>

      {/* Custom Dots Styles */}
      <style jsx global>{`
        .slick-slide {
          height: auto !important;
        }
        .slick-slide > div {
          height: 100%;
          padding: 0 6px; /* Horizontal gap */
          padding-bottom:4px
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-list {
          margin: 0 -6px; /* Compensate for padding */
        }
      `}</style>
    </Box>
  );
};

export default Carousel;