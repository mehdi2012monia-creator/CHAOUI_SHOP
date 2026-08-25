import type { Metadata } from "next";
import { DownloadClient } from "./client";

export const metadata: Metadata = {
  title: "تحميل ملفات المتجر",
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  return <DownloadClient />;
}
