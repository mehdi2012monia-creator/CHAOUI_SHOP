"use client";
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { AdminPanel } from "./panel";

export default function AdminPage() {
  return <AdminPanel />;
}
