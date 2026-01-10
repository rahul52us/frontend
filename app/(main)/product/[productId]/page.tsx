import React from 'react'
import DetailedProductPage from './component/DetailedProductPage'

const Page = async ({ params }: { params: Promise<{ productId: string }> }) => {
    const { productId } = await params;
    return (
        <DetailedProductPage productId={productId} />
    )
}

export default Page
