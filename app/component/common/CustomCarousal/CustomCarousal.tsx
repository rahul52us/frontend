import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  onClick?: () => void;
  position?: number;
  icon?: ReactElement;
  hoverBgColor?: string;
  hoverIconColor?: string;
  initialIconColor?: string;
}

const PrevArrow = ({
  onClick,
  position = -10,
  icon,
  hoverBgColor = "#DF837C",
  hoverIconColor = "white",
  initialIconColor = "black"
}: ArrowProps) => {
  return (
    <IconButton
      aria-label="Previous slide"
      icon={icon || <ChevronLeftIcon />}
      onClick={onClick}
      position="absolute"
      left={position}
      top="50%"
      transform="translateY(-50%)"
      zIndex={2}
      rounded="full"
      bg="white"
      shadow="base"
      _hover={{ bg: hoverBgColor }}
      sx={{
        '& svg': {
          color: initialIconColor
        },
        '&:hover svg': {
          color: hoverIconColor
        }
      }}
      className="opacity-70 hover:opacity-100"
    />
  );
};

const NextArrow = ({
  onClick,
  position = -10,
  icon,
  hoverBgColor = "#DF837C",
  hoverIconColor = "white",
  initialIconColor = "black"
}: ArrowProps) => {
  return (
    <IconButton
      aria-label="Next slide"
      icon={icon || <ChevronRightIcon />}
      onClick={onClick}
      position="absolute"
      right={position}
      top="50%"
      transform="translateY(-50%)"
      zIndex={2}
      rounded="full"
      bg="white"
      shadow="base"
      _hover={{ bg: hoverBgColor }}
      sx={{
        '& svg': {
          color: initialIconColor
        },
        '&:hover svg': {
          color: hoverIconColor
        }
      }}
      className="opacity-70 hover:opacity-100"
    />
  );
};

interface CustomCarouselProps {
  children: React.ReactNode;
  slidesToShow?: number;
  slidesToScroll?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  showArrows?: boolean;
  showDots?: boolean;
  maxWidth?: string | number;
  leftArrowPosition?: number;
  rightArrowPosition?: number;
  prevArrowIcon?: ReactElement;
  nextArrowIcon?: ReactElement;
  hoverBgColor?: string;
  hoverIconColor?: string;
  initialIconColor?: string;
  [key: string]: unknown; // Better than 'any' for type safety
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({
  children,
  slidesToShow = 3,
  slidesToScroll = 1,
  autoplay = false,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = false,
  maxWidth = "100%",
  leftArrowPosition = -10,
  rightArrowPosition = -10,
  prevArrowIcon,
  nextArrowIcon,
  hoverBgColor = "#DF837C",
  hoverIconColor = "white",
  initialIconColor = "black",
  ...props
}) => {
  const settings = {
    dots: showDots,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    prevArrow: showArrows ? (
      <PrevArrow
        position={leftArrowPosition}
        icon={prevArrowIcon}
        hoverBgColor={hoverBgColor}
        hoverIconColor={hoverIconColor}
        initialIconColor={initialIconColor}
      />
    ) : undefined,
    nextArrow: showArrows ? (
      <NextArrow
        position={rightArrowPosition}
        icon={nextArrowIcon}
        hoverBgColor={hoverBgColor}
        hoverIconColor={hoverIconColor}
        initialIconColor={initialIconColor}
      />
    ) : undefined,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(slidesToShow, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(slidesToShow, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    ...props,
  };

  return (
    <Box position="relative" width="full" p={{ base: 4, md: 4 }} maxWidth={maxWidth}>
      <Slider {...settings}>
        {React.Children.map(children, (child) => (
          <Box px={2} pb={2}>{child}</Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CustomCarousel;