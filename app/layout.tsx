import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//shows the image on tab
export const metadata: Metadata = {
  title: "ROOM",
  description: "Video Calling App",
  icons:{
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* wrapped our body in clerk for authentication */}
      <ClerkProvider
        appearance={{
          layout:{
            logoImageUrl:'/icons/room-logo.svg',
            socialButtonsVariant:'iconButton',
          },
          variables:{
            colorText:'#fff',
            colorPrimary:'#0E78F9',
            colorBackground:'#1c1f2e',
            colorInputBackground:'#252a41',
            colorInputText:'#fff',
          }
        }}
      >
        
            <body
              className={`${geistSans.variable} ${geistMono.variable} bg-dark-2 antialiased`}
              >
              {children}
              <Toaster />

            </body>
        </ClerkProvider>
    </html>
  );
}
