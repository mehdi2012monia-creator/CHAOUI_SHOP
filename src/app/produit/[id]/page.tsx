import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { mad } from "@/lib/format";
import { absoluteUrl, getStoreUrl, SITE_NAME } from "@/lib/site";
import { ProductPageActions } from "@/components/store/product-page-actions";
import {
  IconArrowLeft,
  IconCash,
  IconCheck,
  IconShield,
  IconStar,
  IconTruck,
  Wordmark,
} from "@/components/ui";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function getProduct(idRaw: string) {
  const id = Number(idRaw);
  if (!Number.isFinite(id)) return null;
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.active, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "المنتج غير موجود" };
  const base = await getStoreUrl();

  const desc =
    p.description.slice(0, 155) ||
    `${p.name} بثمن ${mad(p.price)} — الدفع عند الاستلام وتوصيل سريع لجميع مدن المغرب.`;

  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/produit/${p.id}` },
    openGraph: {
      type: "website",
      locale: "ar_MA",
      url: absoluteUrl(`/produit/${p.id}`, base),
      siteName: SITE_NAME,
      title: `${p.name} — ${mad(p.price)}`,
      description: desc,
      images: [{ url: p.image, alt: p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} — ${mad(p.price)}`,
      description: desc,
      images: [p.image],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();
  const base = await getStoreUrl();

  const related = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, p.category),
        eq(products.active, true),
        ne(products.id, p.id)
      )
    )
    .limit(4);

  const imageUrl = p.image.startsWith("http")
    ? p.image
    : absoluteUrl(p.image, base);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: [imageUrl],
    sku: `MH-${p.id}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: p.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.6,
      reviewCount: 18 + (p.id % 40),
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/produit/${p.id}`, base),
      priceCurrency: "MAD",
      price: p.price,
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "MA",
        },
      },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: absoluteUrl("/", base),
      },
      { "@type": "ListItem", position: 2, name: p.category },
      {
        "@type": "ListItem",
        position: 3,
        name: p.name,
        item: absoluteUrl(`/produit/${p.id}`, base),
      },
    ],
  };

  const disc =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round((1 - p.price / p.oldPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <a href="/" aria-label={SITE_NAME}>
            <Wordmark />
          </a>
          <a
            href="/#products"
            className="btn-press flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2 text-xs font-extrabold transition hover:border-majorelle-500 hover:text-majorelle-600"
          >
            كل المنتجات
            <IconArrowLeft className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs font-bold text-ink/45">
          <a href="/" className="transition hover:text-ink">
            الرئيسية
          </a>
          <span>/</span>
          <span className="text-majorelle-600">{p.category}</span>
          <span>/</span>
          <span className="truncate text-ink/70">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-ink/10 bg-white">
            <img
              src={p.image}
              alt={p.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-extrabold text-majorelle-600">
              {p.category}
            </span>
            <h1 className="mt-2 text-3xl leading-[1.3] font-extrabold sm:text-4xl">
              {p.name}
            </h1>

            <div className="mt-3 flex items-center gap-1 text-saffron-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="h-4 w-4" />
              ))}
              <span className="ms-1.5 text-xs font-bold text-ink/50">
                ({18 + (p.id % 40)} تقييم)
              </span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-5xl leading-none text-majorelle-700">
                {mad(p.price)}
              </span>
              {p.oldPrice && (
                <span className="pb-1.5 text-base font-bold text-ink/35 line-through">
                  {mad(p.oldPrice)}
                </span>
              )}
              {disc !== null && (
                <span className="mb-1.5 rounded-md bg-saffron-400 px-2 py-1 text-xs font-extrabold text-ink">
                  وفّر {disc}%
                </span>
              )}
            </div>

            <p
              className={`mt-2 text-sm font-bold ${
                p.stock <= 0 ? "text-danger" : "text-mint-600"
              }`}
            >
              {p.stock <= 0
                ? "نفذ المخزون حالياً"
                : p.stock <= 5
                  ? `بقيت ${p.stock} قطع فقط`
                  : "متوفر في المخزون"}
            </p>

            <ProductPageActions product={p} />

            <p className="mt-6 text-sm leading-8 text-ink/70">{p.description}</p>

            <ul className="mt-6 grid gap-3 rounded-xl border border-ink/10 bg-white p-4 text-[13px] font-bold text-ink/70">
              <li className="flex items-center gap-2.5">
                <IconCash className="h-4.5 w-4.5 text-saffron-500" />
                الدفع عند الاستلام في جميع مدن المغرب
              </li>
              <li className="flex items-center gap-2.5">
                <IconTruck className="h-4.5 w-4.5 text-saffron-500" />
                توصيل خلال 24 إلى 48 ساعة — مجاني فوق 500 د.م
              </li>
              <li className="flex items-center gap-2.5">
                <IconShield className="h-4.5 w-4.5 text-saffron-500" />
                منتج أصلي مع ضمان وإرجاع خلال 7 أيام
              </li>
              <li className="flex items-center gap-2.5">
                <IconCheck className="h-4.5 w-4.5 text-saffron-500" />
                خدمة العملاء 6 أيام في الأسبوع
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl">منتجات مشابهة</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((r) => (
                <a
                  key={r.id}
                  href={`/produit/${r.id}`}
                  className="group overflow-hidden rounded-xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-3.5">
                    <h3 className="line-clamp-2 min-h-10 text-[13px] leading-5 font-bold">
                      {r.name}
                    </h3>
                    <p className="mt-1.5 font-extrabold text-majorelle-700">
                      {mad(r.price)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-10 border-t border-ink/10 bg-ink py-8 text-center text-xs font-bold text-paper/50">
        © 2026 {SITE_NAME} — جميع الحقوق محفوظة · الدفع عند الاستلام · توصيل
        لجميع مدن المغرب
      </footer>
    </div>
  );
}
