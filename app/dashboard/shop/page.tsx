'use client'
import React from 'react'
const ShopPage = dynamic(() => import("./component/Form"), { ssr: false });
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic';

const page = observer(() => {
return (
    <ShopPage />
)
})

export default page