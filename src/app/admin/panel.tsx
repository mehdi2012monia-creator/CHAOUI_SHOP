export const dynamic = 'force-dynamic'
export const revalidate = 0

// بدل هاد 2 سطور باللي عندك فـ المشروع
import { db } from "@/lib/drizzle"; 
import { settings } from "@/lib/schema";

export default async function AdminPanel() {
  const data = await db.select().from(settings);
  
  return (
    <div>
      Admin Panel
      {/* الكود ديالك */}
    </div>
  )
}
