import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ShopClient />
        </Suspense>
    );
}
