import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qahtan Al Saidi — Data Analyst Portfolio",
  description: "Data Analyst with expertise in SQL, Python, Power BI, and Excel VBA. Based in Riyadh, Saudi Arabia. Specializing in dashboard development, data cleaning, and business intelligence.",
  keywords: ["Data Analyst", "SQL", "Python", "Power BI", "Excel VBA", "Business Intelligence", "Riyadh", "Saudi Arabia", "Qahtan Al Saidi"],
  authors: [{ name: "Qahtan Al Saidi" }],
  openGraph: {
    title: "Qahtan Al Saidi — Data Analyst Portfolio",
    description: "Data Analyst with expertise in SQL, Python, Power BI, and Excel VBA.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qahtan Al Saidi — Data Analyst",
    description: "Data Analyst portfolio showcasing SQL, Python, Power BI, and Excel VBA expertise.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}