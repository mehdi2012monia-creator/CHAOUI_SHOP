import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSetting } from "@/lib/admin";
import { StoreProvider, Toasts } from "@/components/store/store-context";
import { Header } from "@/components/store/header";
import { Hero } from "@/components/store/hero";
import { DealsSection } from "@/components/store/deals";
import { QuickView } from "@/components/store/product-card";
import { CartDrawer } from "@/components/store/cart-drawer";
import { AdminOverlay } from "@/components/store/admin-overlay";
import {
  AllProducts,
  CategoryBanners,
  FeaturedSection,
  Footer,
  TrustStrip,
} from "@/components/store/sections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProducts, shippingRaw, thresholdRaw, categoriesRaw] =
    await Promise.all([
      db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .orderBy(desc(products.featured), desc(products.id)),
      getSetting("shipping_fee", "35"),
      getSetting("free_shipping_threshold", "500"),
      getSetting("categories", "المطبخ,إلكترونيات,المنزل"),
    ]);

  const categories = categoriesRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <StoreProvider
      products={allProducts}
      categories={categories}
      shippingFee={Number(shippingRaw) || 35}
      freeThreshold={Number(thresholdRaw) || 500}
    >
      <Header />
      <main>
        <Hero />
        <DealsSection />
        <FeaturedSection />
        <CategoryBanners />
        <AllProducts />
        <TrustStrip />
      </main>
      <Footer />
      <CartDrawer />
      <QuickView />
      <Toasts />
      <AdminOverlay />
    </StoreProvider>
  );
}
