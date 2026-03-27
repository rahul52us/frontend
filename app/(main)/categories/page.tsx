import { Suspense } from "react";
import CategoryClient from "./CategoryClient";

export default function CategoryPage() {
    return (
        <Suspense fallback={null}>
            <CategoryClient />
        </Suspense>
    );
}
