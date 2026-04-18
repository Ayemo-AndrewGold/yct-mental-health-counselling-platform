import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "YCT Student Mental Health & Counselling Platform",
  description: "YCT Student Mental Health & Counselling Platform provides comprehensive support for students' mental health and wellbeing. Get the help you need with our tailored counselling services.",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://yctstudentmentalhealth.com"),
  openGraph: {
    title: "YCT Student Mental Health & Counselling Platform",
    url: "https://yctstudentmentalhealth.com/",
    siteName: "YCT Student Mental Health & Counselling Platform",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "YCT Student Mental Health & Counselling Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YCT Student Mental Health & Counselling Platform",
    description: "YCT Student Mental Health & Counselling Platform provides comprehensive support for students' mental health and wellbeing. Get the help you need with our tailored counselling services.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
