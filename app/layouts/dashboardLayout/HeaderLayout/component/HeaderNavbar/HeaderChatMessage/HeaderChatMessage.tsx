'use client'
import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { FaRegEnvelope } from "react-icons/fa";

const HeaderChatMessage = observer(() => {
  // const { chatMessage: { setOpenMessageDrawer } } = stores;

  const handleClick = () => {
    // setOpenMessageDrawer('create');
  };

  return (
    <Flex align="center" justify="center" p={2}>
      <Tooltip label="New Message" aria-label="New Message Tooltip">
        <IconButton
          icon={<FaRegEnvelope />}
          variant="ghost"
          fontSize="2xl"
          color="white"
          _hover={{ color: "blue.500", bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
          aria-label="chat-message-icons"
          onClick={handleClick}
        />
      </Tooltip>
    </Flex>
  );
});

export default HeaderChatMessage;