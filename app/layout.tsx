'use client';

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import MainLayout from "./layouts/mainLayout/MainLayout";
import AuthenticationLayout from "./layouts/authenticationLayout/AuthenticationLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import stores from "./store/stores";
import Notification from "./component/common/Notification/Notification";
import WhatsAppButton from "./component/common/whatsApp/whatsAppButton";
import Image from "next/image";
import { headingFont, bodyFont } from "../lib/fonts";
import { theme } from "./theme/theme";
import { ThemeProvider } from "./theme/ThemeContext";
import NativeMobileProvider from "./providers/NativeMobileProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { companyStore: { getCompanyDetails } } = stores;
  const pathname = usePathname();

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]);

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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
        />
        {/* Anti-flash inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('app_theme_mode') || localStorage.getItem('chakra-ui-color-mode') || 'system';
                  var resolved = mode;
                  if (mode === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                  if (resolved === 'dark') {
                    document.documentElement.classList.add('chakra-ui-dark');
                    document.documentElement.classList.remove('chakra-ui-light');
                  } else {
                    document.documentElement.classList.add('chakra-ui-light');
                    document.documentElement.classList.remove('chakra-ui-dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </head>

      <body
        className={`${headingFont.variable} ${bodyFont.variable} font-body`}
        style={{
          margin: 0,
          padding: 0,
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
          <ThemeProvider>
            <NativeMobileProvider>
              <Notification />
              <LayoutComponent>{children}</LayoutComponent>
              <WhatsAppButton />
            </NativeMobileProvider>
          </ThemeProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
