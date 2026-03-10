'use client';

import React, { Suspense } from 'react';
import DetailedProductPage from './component/DetailedProductPage';
import { useSearchParams } from 'next/navigation';

function ProductContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');

    if (!productId) return null;

    return <DetailedProductPage productId={productId} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductContent />
        </Suspense>
    );
}
