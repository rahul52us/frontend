'use client';

import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import MainLayout from "./layouts/mainLayout/MainLayout";
import AuthenticationLayout from "./layouts/authenticationLayout/AuthenticationLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import stores from "./store/stores";
import Notification from "./component/common/Notification/Notification";
import WhatsAppButton from "./component/common/whatsApp/whatsAppButton";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { companyStore: { getCompanyDetails } } = stores;
  const pathname = usePathname();
  const theme = extendTheme(stores.themeStore);

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]); // This is fine as is

  const getLayout = () => {
    if (pathname === '/login' || pathname === '/register' || pathname === "/forgot-password" || pathname === '/signUp') {
      return AuthenticationLayout;
    } else if (pathname.startsWith('/dashboard')) {
      return DashboardLayout;
    }
    return MainLayout;
  };

  const LayoutComponent = getLayout();

  return (
    <html lang="en">
      <head>
        <ColorModeScript initialColorMode="light" />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            "'Montserrat', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        }}
      >
        <noscript>
          <Image
            alt=""
            height={1}
            width={1}
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=615471921116956&ev=PageView&noscript=1"
          />
        </noscript>

        <ChakraProvider theme={theme}>
          <Notification />
          <LayoutComponent>{children}</LayoutComponent>
          <WhatsAppButton />
        </ChakraProvider>
      </body>
    </html>
  );
}
