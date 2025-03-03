import { Box, Image, Text } from "@chakra-ui/react";

const CardComponent2 = ({ image, title, description, boldWords, borderRadius }) => {
  // Function to wrap specific words in <strong> tags
  const getFormattedText = (text, boldWords) => {
    if (!boldWords || boldWords.length === 0) return text;

    // Escape special characters for regex
    const escapedWords = boldWords.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Create a regex pattern to match any of the words
    const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");

    // Split text and wrap matched words in <strong>
    return text.split(regex).map((part, index) =>
      boldWords.includes(part) ? (
        <strong key={index} style={{ fontWeight: "bold" }}>{part}</strong>
      ) : (
        part
      )
    );
  };

  return (
    <Box
      p={{ base: 3, md: 5 }}
      border={"2px solid"}
      borderColor={"#065F68"}
      rounded={"10px"}
      borderTopLeftRadius={borderRadius?.topLeft}
      borderBottomRightRadius={borderRadius?.bottomRight}
    >
      <Image src={image} boxSize={{ base: "50px", md:"70px",xl: "75px" }} objectFit={"contain"} alt="" />
      <Text fontWeight={500} fontSize={{ base: "16px", md: "20px", lg: "22px" }} color={"#2C2B2B"} my={{ base: 0, md: 2 }}>
        {title}
      </Text>
      <Text color={"#434343"} fontSize={{ base: "xs", md: "16px", lg: "17px" }}>
        {getFormattedText(description, boldWords)}
      </Text>
    </Box>
  );
};

export default CardComponent2;
