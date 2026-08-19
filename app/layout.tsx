import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSeoSettings } from "@/lib/seo-settings";
import "./globals.css";

const fzPoppins = localFont({
  src: [
    { path: "../public/font/FZ-Poppins-Thin.ttf", weight: "100", style: "normal" },
    { path: "../public/font/FZ-Poppins-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../public/font/FZ-Poppins-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/font/FZ-Poppins-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../public/font/FZ-Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/font/FZ-Poppins-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/font/FZ-Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/font/FZ-Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/font/FZ-Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/font/FZ-Poppins-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../public/font/FZ-Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/font/FZ-Poppins-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../public/font/FZ-Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/font/FZ-Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../public/font/FZ-Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/font/FZ-Poppins-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../public/font/FZ-Poppins-Black.ttf", weight: "900", style: "normal" },
    { path: "../public/font/FZ-Poppins-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-fz-poppins",
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const metadataBase = new URL(seo.siteUrl);

  return {
    metadataBase,
    applicationName: seo.siteName,
    title: {
      default: seo.title,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.siteUrl,
    },
    icons: {
      icon: [{ url: seo.favicon }],
      shortcut: [{ url: seo.favicon }],
      apple: [{ url: seo.favicon }],
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: seo.siteUrl,
      siteName: seo.siteName,
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.socialImage, alt: seo.socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${fzPoppins.variable} scroll-smooth [scroll-padding-top:88px]`}
    >
      <body>{children}</body>
    </html>
  );
}
