"use client";
import { observer } from "mobx-react-lite";
import React from "react";
import ProductIndex from "../products/page";

const page = observer(() => {
  return <ProductIndex />;
});

export default page;
