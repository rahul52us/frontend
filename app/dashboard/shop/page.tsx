'use client'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/navigation';
import stores from '../../store/stores';

const ShopPage = dynamic(() => import("./component/Form"), { ssr: false });

const Page = observer(() => {
    const router = useRouter();
    const { user } = stores.auth;

    useEffect(() => {
        if (user && user.type !== 'seller' && user.type !== 'superAdmin') {
            // Basic permission check: only sellers/admins allowed on shop dashboard
            router.push('/');
        }
    }, [user, router]);

    if (user && user.type !== 'seller' && user.type !== 'superAdmin') {
        return null; // Avoid flashing content before redirect
    }

    return (
        <ShopPage />
    )
})

export default Page