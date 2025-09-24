import '@ant-design/v5-patch-for-react-19';
import type {Metadata, ResolvingMetadata} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import {themeBody} from "@/theme";
import {languages} from "@/i18n/settings";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return languages.map((lng) => ({lng}));
}

export async function generateMetadata(
  { params }: { params: Promise<any> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;
  const baseUrl = parentMetadata.alternates?.canonical?.url || process.env.NEXT_PUBLIC_APP_URL || "https://vinmo.org";
  const { lng } = await params;

  return {
    alternates: {
      canonical: `${baseUrl}/${lng}`,
      languages: {
        "en": `${baseUrl}/en`,
        "pt-BR": `${baseUrl}/pt-BR`,
        "x-default": `${baseUrl}/en`,
      }
    }
  };
}

async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<any>;
}>) {
  const { lng } = await params;
  return (
    <html lang={lng} className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
        style={themeBody}
      >
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout