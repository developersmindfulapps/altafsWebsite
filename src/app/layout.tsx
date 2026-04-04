import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWebsiteContent } from "@/lib/getContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWebsiteContent();

  return {
    metadataBase: new URL("https://altaflawfirmjammu.example.com"),
    title: {
      default: content.seo.defaultTitle,
      template: `%s | ${content.siteSettings.siteName}`
    },
    description: content.seo.defaultDescription,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.defaultTitle,
      description: content.seo.defaultDescription,
      url: "https://altaflawfirmjammu.example.com",
      siteName: content.siteSettings.siteName,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-slate-800 bg-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
