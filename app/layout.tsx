'use client';

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme/theme"; // Import the default exported theme
import { lato } from "./theme/theme"; // Import Lato (already defined)
import MainLayout from "./layouts/mainLayout/MainLayout";
import AuthenticationLayout from "./layouts/authenticationLayout/AuthenticationLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import stores from "./store/stores";
import Notification from "./component/common/Notification/Notification";
import Script from 'next/script';
import { Montserrat } from 'next/font/google';
import WhatsAppButton from "./component/common/whatsApp/whatsAppButton";
import Image from "next/image";


const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { companyStore: { getCompanyDetails } } = stores;
  const pathname = usePathname();

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]); // Removed getCompanyDetails from the dependency array to avoid unnecessary re-renders

  const getLayout = () => {
    if (pathname === '/login' || pathname === '/register' || pathname === "/forgot-password") {
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
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WQW7482D');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '615471921116956');
            fbq('track', 'PageView');
          `}
        </Script>

        <ColorModeScript initialColorMode="light" />
      </head>

      <body className={`${lato.className} ${montserrat.className}`}>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WQW7482D"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>

        {/* Meta Pixel (noscript fallback) */}
        <noscript>
          <Image alt="" height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=615471921116956&ev=PageView&noscript=1" />
        </noscript>

        <ChakraProvider theme={theme}>
          <Notification />
          <LayoutComponent>{children}</LayoutComponent>
          <WhatsAppButton /> {/* WhatsApp Button Added Here ✅ */}
        </ChakraProvider>
      </body>
    </html>
  );
}
