import { Suspense } from "react";
import ShopClient from "./ShopClient";
import ShopLayoutSkeletan from "../shop-details/component/ShopPage/ShopLayoutSkeletan";

export default function Page() {
  return (
    <Suspense fallback={<ShopLayoutSkeletan />}>
      <ShopClient />
    </Suspense>
  );
}
