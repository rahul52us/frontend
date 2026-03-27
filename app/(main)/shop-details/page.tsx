import { Suspense } from "react";
import ShopTitleClient from "./ShopTitleClient";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ShopTitleClient />
        </Suspense>
    );
}
