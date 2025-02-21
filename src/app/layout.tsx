import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/components/store/storeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WithAuth from "@/middlewareWraper";
import { Toaster } from "@/components/ui/toaster";
import ImageKitProviderWrapper from "@/components/ImageKitProviderWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WriteFlow",
  description: "An blogging website where anyone can share his thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <SessionProvider>
              <WithAuth>
                <div className="min-h-[70vh] min-w-[400px]">
                  <ImageKitProviderWrapper>
                    <Navbar />
                    {children}
                  </ImageKitProviderWrapper>
                </div>
                <Footer />
              </WithAuth>
            </SessionProvider>
          </StoreProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
