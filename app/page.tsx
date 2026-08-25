import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const products = await prisma.product.findMany()
  
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">مرحبا بـ MEHDI STORE</h1>
      
      {products.length === 0 ? (
        <p>مزال ماكاينينش منتجات. زدهم من لوحة التحكم</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="text-lg text-green-600">{p.price} درهم</p>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
