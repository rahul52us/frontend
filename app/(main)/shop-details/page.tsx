import { Suspense } from "react";
import ShopTitleClient from "./ShopTitleClient";
import ShopLayoutSkeletan from "./component/ShopPage/ShopLayoutSkeletan";

export default function Page() {
  return (
    <Suspense fallback={<ShopLayoutSkeletan />}>
      <ShopTitleClient />
    </Suspense>
  );
}
