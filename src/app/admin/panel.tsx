"use client";
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState } from "react";

export function AdminPanel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جيب الداتا من API من بعد ما يطلع السيرفر
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(() => setLoading(false))
  }, [])

  if(loading) return <div>Loading...</div>
  
  return <div>Admin Panel</div>
}
