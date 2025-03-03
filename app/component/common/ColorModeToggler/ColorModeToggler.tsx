'use client'
import { Button, useColorMode } from "@chakra-ui/react";
function ColorModeToggler() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
      <Button onClick={toggleColorMode} mt={4}>
        Switch to {colorMode === "light" ? "Dark" : "Light"} Mode
      </Button>
    );
}

export default ColorModeToggler