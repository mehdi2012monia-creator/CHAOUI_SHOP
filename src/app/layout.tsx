```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getStoreUrl,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getStoreUrl();

  const gVerify = process.env.GOOGLE_SITE_VERIFICATION || "";

  return {
    metadataBase: new URL(base),
    title: {
      default: SITE_NAME + " — " + SITE_TAGLINE,
      template: "%s | " + SITE_NAME,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: "/",
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
    openGraph: {
      type: "website",
      locale: "ar_MA",
      url: absoluteUrl("/", base),
      siteName: SITE_NAME,
      title: SITE_NAME + " — " + SITE_TAGLINE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: "/images/products/airfryer.jpg",
          width: 1024,
          height: 1024,
          alt: SITE_NAME + " — " + SITE_TAGLINE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME + " — " + SITE_TAGLINE,
      description: SITE_DESCRIPTION,
      images: ["/images/products/airfryer.jpg"],
    },
    verification: gVerify
      ? {
          google: gVerify,
        }
      : undefined,
    category: "shopping",
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const base = await getStoreUrl();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/", base),
    image: absoluteUrl("/images/products/airfryer.jpg", base),
    priceRange: "149 MAD - 1990 MAD",
    currenciesAccepted: "MAD",
    paymentAccepted: "الدفع عند الاستلام",
    areaServed: {
      "@type": "Country",
      name: "المغرب",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressLocality: "الدار البيضاء",
    },
    potentialAction: {
      "@type": "SearchAction",
      target:
        absoluteUrl("/", base) + "?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Lalezar&family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd),
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
```
