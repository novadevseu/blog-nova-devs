// app/layout.tsx
import React from "react";
import { Metadata } from "next";
import StoreProvider from "../components/StoreProvider";
import Container from "@/components/Container";
import "./globals.css";

// Define the metadata used for SEO in Next.js
export const metadata: Metadata = {
  title: "CoffeeScript & Chill - Nova Devs",
  description:
    "Stay updated with the latest tech articles, guides, and insights. CoffeeScript & Chill, powered by Nova Devs.",
  keywords:
    "CoffeeScript, programming, JavaScript, web development, tech blog, Nova Devs, guides",
  openGraph: {
    title: "CoffeeScript & Chill - Nova Devs",
    description:
      "Stay updated with the latest tech articles, guides, and insights. CoffeeScript & Chill, powered by Nova Devs.",
    url: "https://yourwebsite.com",
    type: "website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CoffeeScript & Chill Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@NovaDevsEU",
    title: "CoffeeScript & Chill - Nova Devs",
    description:
      "Stay updated with the latest tech articles, guides, and insights.",
    images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://yourwebsite.com",
  },
};

/**
 * Root layout that wraps the entire application with StoreProvider and Container.
 * This includes global SEO optimizations.
 */
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        {/* Canonical URL to prevent duplicate content issues */}
        <link rel="canonical" href="https://yourwebsite.com" />

        {/* JSON-LD Structured Data for Google SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nova Devs",
              url: "https://yourwebsite.com",
              logo: "https://yourwebsite.com/logo.png",
              description:
                "Nova Devs is a European-based software development and tech community creating high-quality applications and content.",
              sameAs: [
                "https://www.linkedin.com/company/nova-devs-eu/",
                "https://github.com/novadevseu",
                "https://your-portfolio.com", // Replace with your real portfolio URL
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@novadevs.com",
                contactType: "Customer Support",
              },
            }),
          }}
        />
      </head>
      <body className="pt-2 px-10">
        <StoreProvider>
          <Container>{children}</Container>

          
        </StoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
