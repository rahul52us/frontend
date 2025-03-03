import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { rotateCardData } from "./data";

interface CardProps {
  card: {
    id: number;
    name: string;
    title: string;
    experience: string;
    image: string;
    opacity: number;
    width: string;
    height: string;
    link: string;
  };
  index: number;
  isActive: boolean;
  onClick?: () => void;
}

const CommonCard = ({ card, index, isActive, onClick }: CardProps) => {
  const cardWidth = useBreakpointValue({
    base: isActive ? "11rem" : "9rem",
    md: isActive ? "19rem" : "16rem",
  });
  const cardHeight = useBreakpointValue({
    base: isActive ? "13rem" : "10rem",
    md: isActive ? "21rem" : "18rem",
  });
  const fontSize = useBreakpointValue({
    base: "10px",
    md: isActive ? "18px" : "16px",
  });
  const subFontSize = useBreakpointValue({
    base: "9px",
    md: isActive ? "14px" : "12px",
  });

  const GetPosition = (idx: number) => {
    const desktopPosition = [
      { x: -320, y: 120 }, // Card 1
      { x: 0, y: 0 }, // Active Card
      { x: 0, y: 300 }, // Card 3
    ];

    const mobilePosition = [
      { x: -130, y: 100 }, // Card 1
      { x: 50, y: 40 }, // Active Card
      { x: 50, y: 210 }, // Card 3
    ];

    return (
      useBreakpointValue({ base: mobilePosition, md: desktopPosition })?.[idx] ||
      { x: 0, y: 0 }
    );
  };

  return (
    <motion.div
      layout
      layoutId={`card-${card.id}`}
      initial={GetPosition(index)}
      animate={GetPosition(index)}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      onClick={onClick}
      style={{
        position: "absolute",
        cursor: "pointer",
        width: cardWidth,
        opacity: isActive ? 1 : 0.5,
      }}
    >
      <Box position="relative">
        <motion.img
          src={card.image}
          style={{
            width: "100%",
            height: cardHeight,
            objectFit: "cover",
            borderRadius: "16px",
            border: isActive ? "2px solid #DF837C" : "none",
          }}
          alt={card.name}
        />
        <Flex
          justify="center"
          position="absolute"
          bottom={isActive ? "0.5rem" : "1rem"}
          width="100%"
        >
          <Box
            w="80%"
            bg="blackAlpha.600"
            color="white"
            py={isActive ? 2 : 1}
            px={isActive ? 3 : 2}
            rounded="10px"
            boxShadow="md"
          >
            <Text fontSize={fontSize} fontWeight={700}>
              {card.name}
            </Text>
            <Text fontSize={subFontSize} color="#434343" my={1}>
              {card.title}
            </Text>
            <Text fontSize={subFontSize}>{card.experience}</Text>
          </Box>
        </Flex>
      </Box>
    </motion.div>
  );
};

const RotatingCard = () => {
  const [cards, setCards] = useState(rotateCardData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        newCards.unshift(newCards.pop()!); // Move the last card to the front
        return newCards;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (clickedId: number) => {
    const clickedCard = cards.find((card) => card.id === clickedId);
    if (clickedCard) {
      window.open(clickedCard.link, "_blank"); // Open the link in a new tab
    }
  };

  const boxSize = useBreakpointValue({ base: "20%", md: "0" });

  return (
    <Box
      position="relative"
      h={{ base: "400px", md: "600px" }}
      w={boxSize}
      overflow="visible"
      mx="auto"
    >
      <Flex
        position="absolute"
        top="60px"
        left={{ base: "-55px", lg: "-170px" }}
        align="end"
        gap={{ base: 2, lg: 4 }}
        display={{ base: "flex", md: "flex" }}
      >
        <Image src="/images/greenStar.svg" alt="star" boxSize={{ base: "24px", lg: "36px" }} />
        <Box
          width={{ base: "4rem", lg: "6rem" }}
          height={{ base: "30px", lg: "50px" }}
          bg="#EAF475"
          borderTopLeftRadius={{ base: "30px", lg: "40px" }}
          zIndex={1}
        />
      </Flex>
      <Flex
        position="absolute"
        bottom={10}
        left={{ base: "-90px", lg: "-240px" }}
        gap={2}
        align="start"
        display={{ base: "flex", md: "flex" }}
      >
        <Image src="/images/blueStar.svg" alt="star" boxSize={{ base: "24px", lg: "36px" }} />
        <Box
          width={{ base: "6rem", lg: "11.5rem" }}
          height={{ base: "40px", lg: "90px" }}
          borderTopRightRadius={{ base: "16px", lg: "30px" }}
          borderBottomLeftRadius={{ base: "20px", lg: "30px" }}
          bg="#B9DDFF"
          zIndex={1}
        />
      </Flex>

      {cards.map((card, index) => (
        <CommonCard
          key={card.id}
          card={card}
          index={index}
          isActive={index === 0}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </Box>
  );
};

export default RotatingCard;
