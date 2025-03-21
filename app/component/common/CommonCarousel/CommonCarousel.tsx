"use client";
import { Box, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Define props interface for TypeScript
interface CarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  buttonColor?: string;
  buttonBgColor?: string;
  dots?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesToShow = 4,
  autoplay = true,
  autoplaySpeed = 3000,
  buttonColor = "white",
  buttonBgColor = "rgba(0, 0, 0, 0.6)",
  dots = true, // Default to true for visibility
}) => {
  const sliderRef = useRef<Slider>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Responsive slidesToShow based on breakpoint
  const slidesToShowResponsive = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: slidesToShow,
  }) || slidesToShow;

  // Carousel settings with TypeScript typing
  const settings: Settings = {
    dots: dots,
    infinite: true,
    speed: 600,
    slidesToShow: slidesToShowResponsive,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    arrows: false,
    pauseOnHover: true,
    lazyLoad: "ondemand" as const,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const buttonStyles = {
    color: buttonColor,
    bg: buttonBgColor,
    _active: { bg: buttonBgColor, opacity: 0.7, transform: "scale(0.95)" },
    size: { base: "sm", md: "md" },
    borderRadius: "full",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
  };

  if (!isMounted) {
    return null; // Or a loading placeholder
  }

  return (
    <Box
      position="relative"
      width="full"
      px={{ base: 2, md: 4 }}
      py={2}
      overflow="hidden"
    >
      <Slider ref={sliderRef as RefObject<Slider>} {...settings}>
        {children}
      </Slider>

      {/* Navigation Buttons at Bottom */}
      <Box
        display="flex"
        justifyContent="end" // Center buttons horizontally
        gap={4} // Space between buttons
        mt={4} // Margin-top to position below carousel
        zIndex={2}
      >
        <IconButton
          aria-label="Previous slide"
          icon={<FaChevronLeft />}
          {...buttonStyles}
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <IconButton
          aria-label="Next slide"
          icon={<FaChevronRight />}
          {...buttonStyles}
          onClick={() => sliderRef.current?.slickNext()}
        />
      </Box>

      {/* Custom Styles */}
      <style jsx global>{`
        .slick-slide {
          height: auto !important;
        }
        .slick-slide > div {
          height: 100%;
          padding: 0 4px;
          padding-bottom: 8px;
        }
        .slick-track {
          display: flex;
          align-items: stretch;
        }
        .slick-list {
          margin: 0 -8px;
          overflow: hidden;
        }
        .slick-slider {
          transition: opacity 0.3s ease;
        }
        .slick-dots {
          bottom: -30px; /* Position dots below the carousel */
          
        }
        .slick-dots li button:before {
          font-size: 10px; /* Smaller dots */
          color: gray; /* Default dot color */
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .slick-dots li.slick-active button:before {
          color: teal; /* Active dot color */
          opacity: 1;
        }
        .slick-dots li button:hover:before {
          color: teal; /* Hover dot color */
          opacity: 0.75;
        }
      `}</style>
    </Box>
  );
};

export default Carousel;