import type { Metadata } from "next";
import { DownloadClient } from "./client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "تحميل ملفات المتجر",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}
