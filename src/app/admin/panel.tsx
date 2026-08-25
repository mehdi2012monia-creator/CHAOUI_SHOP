export const dynamic = 'force-dynamic'
export const revalidate = 0

import { db } from "@/lib/drizzle"; // بدلها بالـ import ديالك
import { settings } from "@/lib/schema"; // بدلها بالـ import ديالك

export async function AdminPanel() {
  // اي كود فيه db.query خليه بحال ماهو
  const data = await db.select().from(settings);
  
  return (
    <div>
      {/* الكود ديالك */}
    </div>
  )
}
