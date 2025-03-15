"use client";
import { Box } from "@chakra-ui/react";
import React from "react";
import ShopPage from "./component/ShopPage/ShopPage";
import { observer } from "mobx-react-lite";

const page = observer(() => {
  return (
    <Box>
      <ShopPage />
    </Box>
  );
});

export default page;
