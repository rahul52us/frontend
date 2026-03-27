import { Suspense } from "react";
import ProductClient from "./ProductClient";

const Page = () => {
    return (
        <Suspense fallback={null}>
            <ProductClient />
        </Suspense>
    );
}

export default Page;
