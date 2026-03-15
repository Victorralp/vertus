import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { RouteTransitionOverlay } from "@/components/shared/route-transition-overlay";

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
  title: {
    default: "Vertex Credit Union - Modern Digital Banking",
    template: "%s | Vertex Credit Union"
  },
  description: "Experience secure, fast, and convenient digital banking with Vertex Credit Union. Manage your accounts, transfers, loans, and more.",
  keywords: ["digital banking", "credit union", "online banking", "mobile banking", "secure banking", "vertex credit union"],
  authors: [{ name: "Vertex Credit Union" }],
  creator: "Vertex Credit Union",
  publisher: "Vertex Credit Union",
  metadataBase: new URL('https://vertexcu.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vertexcu.com",
    title: "Vertex Credit Union - Modern Digital Banking",
    description: "Experience secure, fast, and convenient digital banking with Vertex Credit Union.",
    siteName: "Vertex Credit Union",
    images: [
      {
        url: "/vertex-logo.png",
        width: 1200,
        height: 630,
        alt: "Vertex Credit Union Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex Credit Union - Modern Digital Banking",
    description: "Experience secure, fast, and convenient digital banking with Vertex Credit Union.",
    images: ["/vertex-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <RouteTransitionOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
